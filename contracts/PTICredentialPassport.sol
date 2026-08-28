// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PTICredentialPassport
 * @notice Prototype Soulbound (non-transferable) membership and credential token for Powerteam International (PTI).
 * @dev Prototype specification contract for controlled pilot. Not financial infrastructure.
 * Enforces role-based access control, pausable emergency stops, controlled recovery, and strict soulbound transfers.
 * ZERO PII IS STORED ON-CHAIN. All personal and KYC data remains in off-chain encrypted systems.
 */
contract PTICredentialPassport {
    string public constant name = "Powerteam Passport";
    string public constant symbol = "PTI-PASS";

    // Roles definition
    bytes32 public constant DEFAULT_ADMIN_ROLE = 0x00;
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant REVOCATION_ROLE = keccak256("REVOCATION_ROLE");
    bytes32 public constant METADATA_ROLE = keccak256("METADATA_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    // Simple role mapping (can integrate OpenZeppelin AccessControl when package installed)
    mapping(bytes32 => mapping(address => bool)) private _roles;
    address public adminSafeMultisig;
    bool public paused;

    enum CredentialStatus { None, Active, Suspended, Revoked, Expired }
    enum MembershipTier { None, General, VIP, Founder, LegacyMastermind }

    struct PassportRecord {
        uint256 passportId;
        MembershipTier tier;
        CredentialStatus status;
        uint256 issuedAt;
        uint256 expiresAt;
        bytes32 credentialHash; // Salted cryptographic proof root (zero PII)
        uint256 discountBasisPoints;
        bool hasConciergeAccess;
    }

    uint256 private _nextPassportId = 1;

    // Wallet address to Passport record
    mapping(address => PassportRecord) public passports;
    // Passport ID to active wallet address
    mapping(uint256 => address) public passportOwner;
    // Audit trail: Old passport ID => New recovered passport ID
    mapping(uint256 => uint256) public recoveryAuditTrail;
    // Wallet to verified badge hashes (POAP / Certification hashes)
    mapping(address => bytes32[]) private _userBadges;

    // Events
    event PassportIssued(address indexed member, uint256 indexed passportId, MembershipTier tier, bytes32 credentialHash);
    event PassportStatusChanged(uint256 indexed passportId, CredentialStatus oldStatus, CredentialStatus newStatus);
    event PassportRecovered(uint256 indexed oldPassportId, uint256 indexed newPassportId, address indexed newWallet);
    event BadgeAttested(address indexed member, bytes32 indexed badgeCode, string badgeNameRef);
    event PausedStateChanged(bool isPaused);
    event RoleGranted(bytes32 indexed role, address indexed account);
    event RoleRevoked(bytes32 indexed role, address indexed account);

    modifier onlyRole(bytes32 role) {
        require(_roles[role][msg.sender] || msg.sender == adminSafeMultisig, "PTICredentialPassport: unauthorized");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "PTICredentialPassport: contract is paused");
        _;
    }

    constructor(address _adminSafeMultisig, address _issuer) {
        require(_adminSafeMultisig != address(0), "Invalid admin multisig address");
        adminSafeMultisig = _adminSafeMultisig;
        
        _roles[DEFAULT_ADMIN_ROLE][_adminSafeMultisig] = true;
        _roles[ISSUER_ROLE][_issuer] = true;
        _roles[REVOCATION_ROLE][_adminSafeMultisig] = true;
        _roles[METADATA_ROLE][_issuer] = true;
        _roles[PAUSER_ROLE][_adminSafeMultisig] = true;
    }

    function setPaused(bool _paused) external onlyRole(PAUSER_ROLE) {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }

    function grantRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _roles[role][account] = true;
        emit RoleGranted(role, account);
    }

    function revokeRole(bytes32 role, address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _roles[role][account] = false;
        emit RoleRevoked(role, account);
    }

    /**
     * @notice Issues a non-transferable Passport credential to a verified member
     */
    function issuePassport(
        address to,
        MembershipTier tier,
        uint256 durationDays,
        bytes32 credentialHash,
        uint256 discountBps,
        bool conciergeAccess
    ) external onlyRole(ISSUER_ROLE) whenNotPaused returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(passports[to].status == CredentialStatus.None || passports[to].status == CredentialStatus.Revoked, "Active passport exists");

        uint256 passportId = _nextPassportId++;
        uint256 expiry = durationDays == 0 ? 0 : block.timestamp + (durationDays * 1 days);

        passports[to] = PassportRecord({
            passportId: passportId,
            tier: tier,
            status: CredentialStatus.Active,
            issuedAt: block.timestamp,
            expiresAt: expiry,
            credentialHash: credentialHash,
            discountBasisPoints: discountBps,
            hasConciergeAccess: conciergeAccess
        });

        passportOwner[passportId] = to;
        emit PassportIssued(to, passportId, tier, credentialHash);
        return passportId;
    }

    /**
     * @notice Updates credential status (e.g. Suspend, Revoke, Expire)
     */
    function setCredentialStatus(uint256 passportId, CredentialStatus newStatus) external onlyRole(REVOCATION_ROLE) {
        address member = passportOwner[passportId];
        require(member != address(0), "Passport does not exist");
        
        CredentialStatus oldStatus = passports[member].status;
        passports[member].status = newStatus;
        
        emit PassportStatusChanged(passportId, oldStatus, newStatus);
    }

    /**
     * @notice Controlled recovery workflow: revokes compromised wallet and reissues to new member address
     */
    function recoverPassport(
        address oldWallet,
        address newWallet,
        bytes32 newCredentialHash
    ) external onlyRole(DEFAULT_ADMIN_ROLE) whenNotPaused returns (uint256) {
        require(newWallet != address(0), "Invalid new wallet");
        require(passports[oldWallet].passportId != 0, "Old passport not found");
        
        PassportRecord memory oldRecord = passports[oldWallet];
        uint256 oldId = oldRecord.passportId;

        // Revoke old credential
        passports[oldWallet].status = CredentialStatus.Revoked;
        emit PassportStatusChanged(oldId, oldRecord.status, CredentialStatus.Revoked);

        // Issue replacement
        uint256 newId = _nextPassportId++;
        passports[newWallet] = PassportRecord({
            passportId: newId,
            tier: oldRecord.tier,
            status: CredentialStatus.Active,
            issuedAt: block.timestamp,
            expiresAt: oldRecord.expiresAt,
            credentialHash: newCredentialHash,
            discountBasisPoints: oldRecord.discountBasisPoints,
            hasConciergeAccess: oldRecord.hasConciergeAccess
        });

        passportOwner[newId] = newWallet;
        recoveryAuditTrail[oldId] = newId;

        emit PassportRecovered(oldId, newId, newWallet);
        return newId;
    }

    /**
     * @notice Attests attendance or certification badge
     */
    function attestBadge(address member, bytes32 badgeCode, string calldata badgeNameRef) external onlyRole(METADATA_ROLE) whenNotPaused {
        require(passports[member].status == CredentialStatus.Active, "Passport not active");
        _userBadges[member].push(badgeCode);
        emit BadgeAttested(member, badgeCode, badgeNameRef);
    }

    /**
     * @notice View function to verify active member credential
     */
    function isValidMember(address member) external view returns (bool) {
        PassportRecord memory record = passports[member];
        if (record.status != CredentialStatus.Active) return false;
        if (record.expiresAt != 0 && block.timestamp > record.expiresAt) return false;
        return !paused;
    }

    // --- SOULBOUND TRANSFER PREVENTION ---
    function transferFrom(address, address, uint256) external pure {
        revert("PTICredentialPassport: SOULBOUND_CREDENTIAL_NON_TRANSFERABLE");
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert("PTICredentialPassport: SOULBOUND_CREDENTIAL_NON_TRANSFERABLE");
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external pure {
        revert("PTICredentialPassport: SOULBOUND_CREDENTIAL_NON_TRANSFERABLE");
    }

    function approve(address, uint256) external pure {
        revert("PTICredentialPassport: APPROVALS_DISABLED_FOR_SOULBOUND");
    }

    function setApprovalForAll(address, bool) external pure {
        revert("PTICredentialPassport: OPERATOR_APPROVALS_DISABLED_FOR_SOULBOUND");
    }
}
