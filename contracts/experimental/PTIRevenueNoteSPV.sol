// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice EXPERIMENTAL RESTRICTED-SECURITY TOKEN PROTOTYPE.
/// @dev NOT FOR DEPLOYMENT, SALE, TRANSFER, OR SOLICITATION.
/// @dev Requires issuer-specific legal, regulatory, custody, investor-record,
/// transfer-restriction, and operational approval before any production use.
///
/// THIS IS A PROTOTYPE RESTRICTED-TOKEN INTERFACE; NOT A COMPLIANCE DETERMINATION,
/// ISSUANCE PLATFORM, OR TRANSFER-AGENT SUBSTITUTE.
/// Reg D (506c) and Reg S are potential offering pathways requiring issuer-specific
/// securities counsel, offering documentation, investor eligibility controls, and jurisdictional review.

contract PTIRevenueNoteSPV {
    string public constant name = "PTI Summit Series Revenue Note (Prototype)";
    string public constant symbol = "PTI-NOTE-PROTO";
    uint8 public constant decimals = 18;

    address public owner;
    address public complianceOfficer;

    uint256 public totalSupply;
    uint256 public constant MAX_ISSUANCE = 10_000_000 * 10**18;

    struct InvestorKYC {
        bool isAccredited;
        bool isKYCPassed;
        uint256 lockupExpiry; // Rule 144 holding period timestamp
        bool isBlacklisted;
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => InvestorKYC) public identityRegistry;
    uint256 public totalRevenueDistributed;

    event InvestorKYCUpdated(address indexed investor, bool accredited, bool kycPassed, uint256 lockup);
    event NotesIssued(address indexed investor, uint256 amount);
    event RevenueDistributed(uint256 totalAmount, uint256 timestamp);

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

    function issueNotes(address investor, uint256 amount) external onlyCompliance {
        InvestorKYC memory kyc = identityRegistry[investor];
        require(kyc.isKYCPassed && kyc.isAccredited, "Investor must be KYC verified and accredited");
        require(!kyc.isBlacklisted, "Investor is blacklisted");
        require(totalSupply + amount <= MAX_ISSUANCE, "Exceeds max issuance cap");

        balanceOf[investor] += amount;
        totalSupply += amount;

        emit NotesIssued(investor, amount);
    }

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

    function transfer(address to, uint256 amount) external returns (bool) {
        (bool allowed, string memory reason) = canTransfer(msg.sender, to, amount);
        require(allowed, reason);

        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;

        return true;
    }

    function depositRevenueDistribution() external payable onlyOwner {
        require(msg.value > 0, "No distribution amount provided");
        require(totalSupply > 0, "No notes issued");

        totalRevenueDistributed += msg.value;
        emit RevenueDistributed(msg.value, block.timestamp);
    }
}
