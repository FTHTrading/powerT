// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PTIEscrowSettlement
 * @notice Automated escrow, partner reconciliation, and revenue splitting contract for Powerteam events.
 * Manages sponsor booth settlements, speaker revenue shares, and SPV waterfall allocations.
 */
contract PTIEscrowSettlement {
    address public owner;
    address public spvContract;

    struct EventVault {
        string eventName;
        uint256 totalCollected;
        uint256 productionBudget;
        uint256 spvAllocationBps; // basis points e.g. 2000 = 20%
        bool isSettled;
    }

    mapping(bytes32 => EventVault) public eventVaults;

    event EventConfigured(bytes32 indexed eventId, string name, uint256 budget, uint256 spvAllocationBps);
    event FundsDeposited(bytes32 indexed eventId, address indexed sender, uint256 amount);
    event EventSettled(bytes32 indexed eventId, uint256 productionAmount, uint256 spvAmount, uint256 operatingResidual);

    modifier onlyOwner() {
        require(msg.sender == owner, "PTIEscrowSettlement: unauthorized");
        _;
    }

    constructor(address _spvContract) {
        owner = msg.sender;
        spvContract = _spvContract;
    }

    function configureEvent(
        bytes32 eventId,
        string calldata eventName,
        uint256 productionBudget,
        uint256 spvAllocationBps
    ) external onlyOwner {
        require(spvAllocationBps <= 10000, "Invalid basis points");
        eventVaults[eventId] = EventVault({
            eventName: eventName,
            totalCollected: 0,
            productionBudget: productionBudget,
            spvAllocationBps: spvAllocationBps,
            isSettled: false
        });
        emit EventConfigured(eventId, eventName, productionBudget, spvAllocationBps);
    }

    function depositEventReceipts(bytes32 eventId) external payable {
        EventVault storage ev = eventVaults[eventId];
        require(!ev.isSettled, "Event is already settled");
        require(msg.value > 0, "Zero deposit");

        ev.totalCollected += msg.value;
        emit FundsDeposited(eventId, msg.sender, msg.value);
    }

    function settleEvent(bytes32 eventId, address payable productionExpenseWallet, address payable operatingWallet) external onlyOwner {
        EventVault storage ev = eventVaults[eventId];
        require(!ev.isSettled, "Already settled");
        require(ev.totalCollected >= ev.productionBudget, "Insufficient funds to clear senior production budget");

        ev.isSettled = true;
        uint256 remaining = ev.totalCollected - ev.productionBudget;

        // 1. Pay Senior Production Expenses
        (bool pSuccess, ) = productionExpenseWallet.call{value: ev.productionBudget}("");
        require(pSuccess, "Production payout failed");

        // 2. Pay SPV Allocation
        uint256 spvAmount = (remaining * ev.spvAllocationBps) / 10000;
        if (spvAmount > 0 && spvContract != address(0)) {
            (bool sSuccess, ) = spvContract.call{value: spvAmount}("");
            require(sSuccess, "SPV payout failed");
        }

        // 3. Sweep Operating Residual
        uint256 residual = remaining - spvAmount;
        if (residual > 0) {
            (bool oSuccess, ) = operatingWallet.call{value: residual}("");
            require(oSuccess, "Residual payout failed");
        }

        emit EventSettled(eventId, ev.productionBudget, spvAmount, residual);
    }
}
