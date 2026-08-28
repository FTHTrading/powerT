const fs = require("fs");
const path = require("path");

class DailyReconciliationWorker {
  constructor(ledgerService) {
    this.ledger = ledgerService;
  }

  generateDailyReconciliationReport() {
    let grossSettledPayments = 0;
    let refunds = 0;
    let chargebacks = 0;
    let purchasedCreditsIssued = 0;
    let promotionalCreditsIssued = 0;
    let purchasedCreditsRedeemed = 0;
    const exceptions = [];

    // 1. Process orders
    for (const order of this.ledger.orders.values()) {
      if (order.status === "SETTLED") {
        grossSettledPayments += order.amount;
        purchasedCreditsIssued += order.creditsPurchased;
      } else if (order.status === "REFUNDED") {
        refunds += order.amount;
        exceptions.push({
          type: "REFUND_PROCESSED",
          orderId: order.orderId,
          amount: order.amount,
          requiresReview: true,
        });
      } else if (order.status === "DISPUTED") {
        chargebacks += order.amount;
        exceptions.push({
          type: "CHARGEBACK_DETECTED",
          orderId: order.orderId,
          amount: order.amount,
          requiresReview: true,
        });
      }
    }

    // 2. Process redemptions
    for (const red of this.ledger.creditRedemptions.values()) {
      purchasedCreditsRedeemed += red.creditsBurned;
    }

    // 3. Process promotional adjustments
    for (const lot of this.ledger.creditLots.values()) {
      if (lot.lotType === "PROMOTIONAL") {
        promotionalCreditsIssued += lot.originalCredits;
      }
    }

    const netSettledPayments = grossSettledPayments - refunds - chargebacks;
    const outstandingPurchasedLiability = purchasedCreditsIssued - purchasedCreditsRedeemed;
    const variance = Math.abs(grossSettledPayments - purchasedCreditsIssued);

    if (variance > 0.01) {
      exceptions.push({
        type: "VARIANCE_THRESHOLD_EXCEEDED",
        variance,
        cause: "Mismatch between fiat settlement and credit lots",
        requiresReview: true,
      });
    }

    const report = {
      reportDate: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      metrics: {
        grossSettledPayments,
        refunds,
        chargebacks,
        netSettledPayments,
        purchasedCreditsIssued,
        promotionalCreditsIssued,
        purchasedCreditsRedeemed,
        outstandingPurchasedLiability,
        totalRedemptionsCount: this.ledger.creditRedemptions.size,
      },
      exceptionsCount: exceptions.length,
      exceptions,
      reconciliationStatus: exceptions.length === 0 ? "RECONCILED_CLEAN" : "ACTION_REQUIRED",
    };

    return report;
  }
}

module.exports = { DailyReconciliationWorker };
