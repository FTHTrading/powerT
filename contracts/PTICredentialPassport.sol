// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PTICredentialPassport
 * @notice Soulbound (non-transferable) membership and credential token for Powerteam International (PTI).
 * Represents verified tier status, attendance history, badges, and entitlement permissions.
 */
contract PTICredentialPassport {
    string public name = "Powerteam Passport";
    string public symbol = "PTI-PASS";

    address public owner;
    address public authorizedIssuer;

    enum MembershipTier { None, General, VIP, Founder, LegacyMastermind }

    struct PassportProfile {
        uint256 tokenId;
        MembershipTier tier;
        uint256 issuedTimestamp;
        uint256 expirationTimestamp;
        uint256 discountBasisPoints; // e.g. 1000 = 10%
        bool hasConciergeAccess;
        bool hasSpeakerFastTrack;
        bytes32 identityHash; // Off-chain KYC/identity root (no raw PII)
    }

    uint256 private _nextTokenId = 1;

    // Mapping from user address to their Passport Profile
    mapping(address => PassportProfile) public passports;
    // Mapping from user address to array of badge hashes (certifications, POAPs)
    mapping(address => bytes32[]) public userBadges;
    // Mapping from tokenId to owner address
    mapping(uint256 => address) public tokenOwner;
    // Total minted tokens count
    uint256 public totalSupply;

    // Events
    event PassportMinted(address indexed member, uint256 indexed tokenId, MembershipTier tier);
    event PassportTierUpdated(address indexed member, MembershipTier newTier, uint256 expiration);
    event BadgeAwarded(address indexed member, bytes32 indexed badgeCode, string badgeName);
    event PassportRevoked(address indexed member, uint256 indexed tokenId);

    modifier onlyOwner() {
        require(msg.sender == owner, "PTICredentialPassport: caller is not the owner");
        _;
    }

    modifier onlyIssuer() {
        require(msg.sender == owner || msg.sender == authorizedIssuer, "PTICredentialPassport: unauthorized");
        _;
    }

    constructor(address _issuer) {
        owner = msg.sender;
        authorizedIssuer = _issuer;
    }

    function setAuthorizedIssuer(address _issuer) external onlyOwner {
        authorizedIssuer = _issuer;
    }

    /**
     * @notice Mints a non-transferable Soulbound Passport to a verified member
     */
    function mintPassport(
        address to,
        MembershipTier tier,
        uint256 durationDays,
        uint256 discountBps,
        bool concierge,
        bool speakerAccess,
        bytes32 identityHash
    ) external onlyIssuer returns (uint256) {
        require(to != address(0), "Invalid recipient");
        require(passports[to].tokenId == 0, "Passport already exists for address");

        uint256 tokenId = _nextTokenId++;
        uint256 expiry = durationDays == 0 ? 0 : block.timestamp + (durationDays * 1 days);

        passports[to] = PassportProfile({
            tokenId: tokenId,
            tier: tier,
            issuedTimestamp: block.timestamp,
            expirationTimestamp: expiry,
            discountBasisPoints: discountBps,
            hasConciergeAccess: concierge,
            hasSpeakerFastTrack: speakerAccess,
            identityHash: identityHash
        });

        tokenOwner[tokenId] = to;
        totalSupply++;

        emit PassportMinted(to, tokenId, tier);
        return tokenId;
    }

    /**
     * @notice Updates membership tier and permissions
     */
    function updateTier(
        address member,
        MembershipTier newTier,
        uint256 durationDays,
        uint256 discountBps,
        bool concierge,
        bool speakerAccess
    ) external onlyIssuer {
        require(passports[member].tokenId != 0, "Passport does not exist");

        PassportProfile storage profile = passports[member];
        profile.tier = newTier;
        profile.expirationTimestamp = durationDays == 0 ? 0 : block.timestamp + (durationDays * 1 days);
        profile.discountBasisPoints = discountBps;
        profile.hasConciergeAccess = concierge;
        profile.hasSpeakerFastTrack = speakerAccess;

        emit PassportTierUpdated(member, newTier, profile.expirationTimestamp);
    }

    /**
     * @notice Awards verified credentials and POAPs (e.g. Master Speaker, Certified Coach)
     */
    function awardBadge(address member, bytes32 badgeCode, string calldata badgeName) external onlyIssuer {
        require(passports[member].tokenId != 0, "Passport does not exist");
        userBadges[member].push(badgeCode);
        emit BadgeAwarded(member, badgeCode, badgeName);
    }

    /**
     * @notice Checks whether a member has an active valid passport
     */
    function isValidMember(address member) external view returns (bool) {
        PassportProfile memory profile = passports[member];
        if (profile.tokenId == 0) return false;
        if (profile.expirationTimestamp != 0 && block.timestamp > profile.expirationTimestamp) return false;
        return true;
    }

    /**
     * @notice Soulbound transfer block - prevents secondary market trading
     */
    function transferFrom(address, address, uint256) external pure {
        revert("PTICredentialPassport: SOULBOUND - Transfers disabled");
    }

    function safeTransferFrom(address, address, uint256) external pure {
        revert("PTICredentialPassport: SOULBOUND - Transfers disabled");
    }

    function safeTransferFrom(address, address, uint256, bytes calldata) external pure {
        revert("PTICredentialPassport: SOULBOUND - Transfers disabled");
    }
}
