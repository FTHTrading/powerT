// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PTISettlementRouter
 * @notice Prototype internal settlement and allocation workflow router for Powerteam sandbox/testnet pilots.
 * @dev THIS IS AN INTERNAL SETTLEMENT-CONTROL PROTOTYPE; NOT THIRD-PARTY ESCROW, QUALIFIED CUSTODY, OR FIDUCIARY ADMINISTRATION.
 * Actual event revenue settles to controlled fiat bank accounts and is reconciled by accounting.
 * Implements a two-step propose/approve/execute workflow, explicit batch IDs, payee allowlists, and emergency pause.
 * Direct automatic investor disbursements are DISABLED in this pilot phase.
 */
contract PTISettlementRouter {
    address public adminMultisig;
    address public financeProposer;
    bool public paused;

    enum BatchStatus { None, Proposed, Approved, Executed, Cancelled }

    struct SettlementBatch {
        bytes32 batchId;
        string accountingReference; // Internal ERP / Accounting Ledger ID
        address payable payee;
        uint256 amount;
        BatchStatus status;
        uint256 proposedAt;
        uint256 executedAt;
    }

    // Payee allowlist: payee => bool
    mapping(address => bool) public isApprovedPayee;
    // Payee single payout limit: payee => max single payout
    mapping(address => uint256) public payeePayoutLimit;
    // Batch storage: batchId => SettlementBatch
    mapping(bytes32 => SettlementBatch) public batches;

    event PayeeAllowlistUpdated(address indexed payee, bool approved, uint256 limit);
    event BatchProposed(bytes32 indexed batchId, string accountingRef, address indexed payee, uint256 amount);
    event BatchApproved(bytes32 indexed batchId);
    event BatchExecuted(bytes32 indexed batchId, address indexed payee, uint256 amount);
    event BatchCancelled(bytes32 indexed batchId, string reason);
    event PausedStateChanged(bool isPaused);

    modifier onlyAdmin() {
        require(msg.sender == adminMultisig, "PTISettlementRouter: unauthorized admin");
        _;
    }

    modifier onlyProposer() {
        require(msg.sender == financeProposer || msg.sender == adminMultisig, "PTISettlementRouter: unauthorized proposer");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "PTISettlementRouter: paused");
        _;
    }

    constructor(address _adminMultisig, address _proposer) {
        require(_adminMultisig != address(0), "Invalid admin");
        adminMultisig = _adminMultisig;
        financeProposer = _proposer;
    }

    function setPaused(bool _paused) external onlyAdmin {
        paused = _paused;
        emit PausedStateChanged(_paused);
    }

    function setPayeeStatus(address payee, bool approved, uint256 maxLimit) external onlyAdmin {
        require(payee != address(0), "Invalid payee");
        isApprovedPayee[payee] = approved;
        payeePayoutLimit[payee] = maxLimit;
        emit PayeeAllowlistUpdated(payee, approved, maxLimit);
    }

    /**
     * @notice Step 1: Propose a settlement batch against verified accounting reference
     */
    function proposeBatch(
        bytes32 batchId,
        string calldata accountingRef,
        address payable payee,
        uint256 amount
    ) external onlyProposer whenNotPaused {
        require(batches[batchId].status == BatchStatus.None, "Batch ID already exists");
        require(isApprovedPayee[payee], "Payee not on approved allowlist");
        require(amount <= payeePayoutLimit[payee], "Amount exceeds payee payout limit");

        batches[batchId] = SettlementBatch({
            batchId: batchId,
            accountingReference: accountingRef,
            payee: payee,
            amount: amount,
            status: BatchStatus.Proposed,
            proposedAt: block.timestamp,
            executedAt: 0
        });

        emit BatchProposed(batchId, accountingRef, payee, amount);
    }

    /**
     * @notice Step 2: Approve proposed batch (Admin Safe multisig only)
     */
    function approveBatch(bytes32 batchId) external onlyAdmin whenNotPaused {
        SettlementBatch storage b = batches[batchId];
        require(b.status == BatchStatus.Proposed, "Batch not in proposed status");
        b.status = BatchStatus.Approved;
        emit BatchApproved(batchId);
    }

    /**
     * @notice Step 3: Execute approved settlement batch
     */
    function executeBatch(bytes32 batchId) external onlyAdmin whenNotPaused {
        SettlementBatch storage b = batches[batchId];
        require(b.status == BatchStatus.Approved, "Batch not approved");
        require(address(this).balance >= b.amount, "Insufficient router balance");

        b.status = BatchStatus.Executed;
        b.executedAt = block.timestamp;

        (bool success, ) = b.payee.call{value: b.amount}("");
        require(success, "Payout execution failed");

        emit BatchExecuted(batchId, b.payee, b.amount);
    }

    /**
     * @notice Cancel batch in case of accounting mismatch or error
     */
    function cancelBatch(bytes32 batchId, string calldata reason) external onlyAdmin {
        SettlementBatch storage b = batches[batchId];
        require(b.status == BatchStatus.Proposed || b.status == BatchStatus.Approved, "Cannot cancel executed batch");
        b.status = BatchStatus.Cancelled;
        emit BatchCancelled(batchId, reason);
    }

    receive() external payable {}
}
