// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PTICreditReceipt
 * @notice Optional on-chain cryptographic proof and redemption receipt record for Powerteam International.
 * @dev THIS CONTRACT IS NOT THE PRIMARY ACCOUNTING LEDGER OR A STORED-VALUE REPOSITORY.
 * The authoritative source-of-truth ledger is maintained in the reconciled off-chain database.
 * This contract provides verifiable state roots, idempotency tracking, and cryptographic receipts.
 */
contract PTICreditReceipt {
    string public constant name = "PTI Credit Proof Receipt";
    string public constant symbol = "PTI-RECEIPT";

    address public adminSafeMultisig;
    address public authorizedRelayer;
    bool public paused;

    // Idempotency: orderId hash => bool
    mapping(bytes32 => bool) public processedOrders;
    // Audit receipts: redemptionReceiptHash => bool
    mapping(bytes32 => bool) public verifiedRedemptions;

    event CreditIssuanceReceiptLogged(
        address indexed member,
        bytes32 indexed orderHash,
        uint256 creditAmount,
        string catalogSku
    );

    event CreditRedemptionReceiptLogged(
        address indexed member,
        bytes32 indexed redemptionReceiptHash,
        uint256 creditsBurned,
        string catalogSku
    );

    event RelayerUpdated(address indexed newRelayer);
    event PausedStateChanged(bool isPaused);

    modifier onlyAdmin() {
        require(msg.sender == adminSafeMultisig, "PTICreditReceipt: unauthorized admin");
        _;
    }

    modifier onlyRelayer() {
        require(msg.sender == authorizedRelayer || msg.sender == adminSafeMultisig, "PTICreditReceipt: unauthorized relayer");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "PTICreditReceipt: paused");
        _;
    }

    constructor(address _adminSafeMultisig, address _relayer) {
        require(_adminSafeMultisig != address(0), "Invalid admin");
        adminSafeMultisig = _adminSafeMultisig;
        authorizedRelayer = _relayer;
    }

    function setRelayer(address _newRelayer) external onlyAdmin {
        authorizedRelayer = _newRelayer;
        emit RelayerUpdated(_newRelayer);
    }

    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }

    /**
     * @notice Logs a settled issuance receipt with idempotency protection
     */
    function logIssuanceReceipt(
        address member,
        bytes32 orderHash,
        uint256 creditAmount,
        string calldata catalogSku
    ) external onlyRelayer whenNotPaused {
        require(!processedOrders[orderHash], "PTICreditReceipt: order already processed (idempotency key match)");
        processedOrders[orderHash] = true;

        emit CreditIssuanceReceiptLogged(member, orderHash, creditAmount, catalogSku);
    }

    /**
     * @notice Logs a verified redemption receipt
     */
    function logRedemptionReceipt(
        address member,
        bytes32 redemptionReceiptHash,
        uint256 creditsBurned,
        string calldata catalogSku
    ) external onlyRelayer whenNotPaused {
        require(!verifiedRedemptions[redemptionReceiptHash], "PTICreditReceipt: redemption receipt already recorded");
        verifiedRedemptions[redemptionReceiptHash] = true;

        emit CreditRedemptionReceiptLogged(member, redemptionReceiptHash, creditsBurned, catalogSku);
    }
}
