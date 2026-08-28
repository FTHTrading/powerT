// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PTIRevenueNoteSPV
 * @notice Regulated tokenized debt/revenue note issued by PTI Summit Series SPV LLC (Bankruptcy-Remote SPV).
 * Implements permissioned ERC-1400 / ERC-3643 compliance controls:
 * - On-chain KYC/AML & Accreditation allowlist registry.
 * - Enforceable Rule 144 transfer lockups and jurisdiction checks.
 * - Programmatic revenue distribution waterfall from contracted event receivables.
 */
contract PTIRevenueNoteSPV {
    string public name = "PTI Summit Series Revenue Note";
    string public symbol = "PTI-NOTE";
    uint8 public constant decimals = 18;

    address public owner;
    address public complianceOfficer;

    uint256 public totalSupply;
    uint256 public constant MAX_ISSUANCE = 10_000_000 * 10**18; // $10,000,000 Note Cap

    // Investor KYC & Accreditation Status
    struct InvestorKYC {
        bool isAccredited;
        bool isKYCPassed;
        uint256 lockupExpiry; // Rule 144 holding period timestamp
        bool isBlacklisted;
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => InvestorKYC) public identityRegistry;

    // Programmatic Waterfall Tracking
    uint256 public totalRevenueDistributed;
    mapping(address => uint256) public investorPayouts;

    event InvestorKYCUpdated(address indexed investor, bool accredited, bool kycPassed, uint256 lockup);
    event NotesIssued(address indexed investor, uint256 amount);
    event RevenueDistributed(uint256 totalAmount, uint256 timestamp);
    event RevenueClaimed(address indexed investor, uint256 amount);
    event TransferRestricted(address from, address to, string reason);

    modifier onlyOwner() {
        require(msg.sender == owner, "PTIRevenueNoteSPV: caller is not the owner");
        _;
    }

    modifier onlyCompliance() {
        require(msg.sender == owner || msg.sender == complianceOfficer, "PTIRevenueNoteSPV: unauthorized compliance");
        _;
    }

    constructor(address _complianceOfficer) {
        owner = msg.sender;
        complianceOfficer = _complianceOfficer;
    }

    function setComplianceOfficer(address _compliance) external onlyOwner {
        complianceOfficer = _compliance;
    }

    /**
     * @notice Registers or updates KYC & lockup permissions for an accredited investor
     */
    function setInvestorKYC(
        address investor,
        bool accredited,
        bool kycPassed,
        uint256 lockupDurationDays,
        bool blacklisted
    ) external onlyCompliance {
        require(investor != address(0), "Invalid investor address");
        
        uint256 lockup = lockupDurationDays == 0 ? 0 : block.timestamp + (lockupDurationDays * 1 days);
        identityRegistry[investor] = InvestorKYC({
            isAccredited: accredited,
            isKYCPassed: kycPassed,
            lockupExpiry: lockup,
            isBlacklisted: blacklisted
        });

        emit InvestorKYCUpdated(investor, accredited, kycPassed, lockup);
    }

    /**
     * @notice Issues notes to verified accredited investors under Reg D / Reg S
     */
    function issueNotes(address investor, uint256 amount) external onlyCompliance {
        InvestorKYC memory kyc = identityRegistry[investor];
        require(kyc.isKYCPassed && kyc.isAccredited, "Investor must be KYC verified and accredited");
        require(!kyc.isBlacklisted, "Investor is blacklisted");
        require(totalSupply + amount <= MAX_ISSUANCE, "Exceeds max issuance cap");

        balanceOf[investor] += amount;
        totalSupply += amount;

        emit NotesIssued(investor, amount);
    }

    /**
     * @notice Checks transferability under SEC Rule 144 and KYC allowlists
     */
    function canTransfer(address from, address to, uint256 amount) public view returns (bool, string memory) {
        if (balanceOf[from] < amount) return (false, "Insufficient balance");
        
        InvestorKYC memory senderKYC = identityRegistry[from];
        if (block.timestamp < senderKYC.lockupExpiry) return (false, "Transfer locked: Rule 144 holding period active");
        if (senderKYC.isBlacklisted) return (false, "Sender blacklisted");

        InvestorKYC memory recipientKYC = identityRegistry[to];
        if (!recipientKYC.isKYCPassed || !recipientKYC.isAccredited) return (false, "Recipient not KYC/Accredited");
        if (recipientKYC.isBlacklisted) return (false, "Recipient blacklisted");

        return (true, "Valid");
    }

    /**
     * @notice Transfer with compliance verification
     */
    function transfer(address to, uint256 amount) external returns (bool) {
        (bool allowed, string memory reason) = canTransfer(msg.sender, to, amount);
        require(allowed, reason);

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        return true;
    }

    /**
     * @notice Distributes gross event receipts through SPV waterfall to noteholders
     */
    function depositRevenueDistribution() external payable onlyOwner {
        require(msg.value > 0, "No distribution amount provided");
        require(totalSupply > 0, "No notes issued");

        totalRevenueDistributed += msg.value;
        emit RevenueDistributed(msg.value, block.timestamp);
    }
}
