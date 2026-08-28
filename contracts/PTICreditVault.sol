// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

interface IPTICredentialPassport {
    function isValidMember(address member) external view returns (bool);
}

/**
 * @title PTICreditVault
 * @notice Fixed-value redeemable prepaid utility credit ledger for Powerteam International.
 * 1 PTI Credit = $1.00 USD equivalent in eligible catalog services.
 * Features strict non-transferability, gateway-authorized issuance upon fiat payment, 
 * deterministic burn on service redemption, and proof-of-liability tracking.
 */
contract PTICreditVault {
    string public name = "PTI Service Credit";
    string public symbol = "PTI-CREDIT";
    uint8 public decimals = 18;

    address public owner;
    address public authorizedPaymentGateway;
    IPTICredentialPassport public passportContract;

    uint256 public totalCreditsIssued;
    uint256 public totalCreditsRedeemed;
    
    // Balance mapping: user => active credit balance
    mapping(address => uint256) public balanceOf;

    // Service catalog mapping: catalogItemId => required credit cost
    struct CatalogItem {
        string name;
        uint256 creditCost; // in units (18 decimals)
        bool isActive;
    }
    mapping(bytes32 => CatalogItem) public serviceCatalog;

    event CreditsPurchased(address indexed member, uint256 amount, string fiatTxRef);
    event CreditsRedeemed(address indexed member, bytes32 indexed serviceId, uint256 amountBurned, string metadataRef);
    event CatalogItemConfigured(bytes32 indexed serviceId, string name, uint256 creditCost, bool isActive);

    modifier onlyOwner() {
        require(msg.sender == owner, "PTICreditVault: caller is not the owner");
        _;
    }

    modifier onlyGateway() {
        require(msg.sender == owner || msg.sender == authorizedPaymentGateway, "PTICreditVault: unauthorized gateway");
        _;
    }

    constructor(address _passportContract, address _gateway) {
        owner = msg.sender;
        passportContract = IPTICredentialPassport(_passportContract);
        authorizedPaymentGateway = _gateway;
    }

    function setPaymentGateway(address _gateway) external onlyOwner {
        authorizedPaymentGateway = _gateway;
    }

    function setPassportContract(address _passport) external onlyOwner {
        passportContract = IPTICredentialPassport(_passport);
    }

    /**
     * @notice Registers or updates a catalog item and its credit cost
     */
    function configureCatalogItem(bytes32 serviceId, string calldata serviceName, uint256 creditCost, bool isActive) external onlyOwner {
        serviceCatalog[serviceId] = CatalogItem({
            name: serviceName,
            creditCost: creditCost,
            isActive: isActive
        });
        emit CatalogItemConfigured(serviceId, serviceName, creditCost, isActive);
    }

    /**
     * @notice Issues fixed-value credits upon verified fiat/stablecoin receipt (e.g. Stripe webhook)
     */
    function issueCredits(address member, uint256 amount, string calldata fiatTxRef) external onlyGateway {
        require(member != address(0), "Invalid member address");
        require(amount > 0, "Amount must be greater than zero");
        
        // Ensure recipient is an active Passport holder
        if (address(passportContract) != address(0)) {
            require(passportContract.isValidMember(member), "Recipient must hold an active Passport");
        }

        balanceOf[member] += amount;
        totalCreditsIssued += amount;

        emit CreditsPurchased(member, amount, fiatTxRef);
    }

    /**
     * @notice Redeems (burns) credits for a specific catalog service
     */
    function redeemForService(bytes32 serviceId, string calldata metadataRef) external {
        CatalogItem memory item = serviceCatalog[serviceId];
        require(item.isActive, "Service item is not active");
        require(balanceOf[msg.sender] >= item.creditCost, "Insufficient credit balance");

        balanceOf[msg.sender] -= item.creditCost;
        totalCreditsRedeemed += item.creditCost;

        emit CreditsRedeemed(msg.sender, serviceId, item.creditCost, metadataRef);
    }

    /**
     * @notice Returns the total outstanding unearned deferred liability
     */
    function getOutstandingCreditLiability() external view returns (uint256) {
        return totalCreditsIssued - totalCreditsRedeemed;
    }

    /**
     * @notice Disabled direct peer-to-peer transfers to maintain closed-loop prepaid compliance
     */
    function transfer(address, uint256) external pure returns (bool) {
        revert("PTICreditVault: Non-transferable closed-loop utility credit");
    }

    function transferFrom(address, address, uint256) external pure returns (bool) {
        revert("PTICreditVault: Non-transferable closed-loop utility credit");
    }
}
