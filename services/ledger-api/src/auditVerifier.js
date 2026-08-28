const crypto = require("crypto");

class AuditChainVerifier {
  constructor(ledgerService) {
    this.ledger = ledgerService;
  }

  verifyChainIntegrity() {
    const events = this.ledger.auditEvents;
    if (!events || events.length === 0) {
      return { isValid: true, verifiedEventsCount: 0, message: "Audit chain is empty." };
    }

    let expectedPreviousHash = "0x0000000000000000000000000000000000000000000000000000000000000000";

    for (let i = 0; i < events.length; i++) {
      const event = events[i];

      // 1. Verify previous record hash link
      if (event.previousRecordHash !== expectedPreviousHash) {
        return {
          isValid: false,
          brokenIndex: i,
          eventId: event.eventId,
          error: `BROKEN_CHAIN_LINK: Expected previous hash ${expectedPreviousHash}, found ${event.previousRecordHash}`,
        };
      }

      // 2. Recompute current record hash
      const eventData = {
        eventId: event.eventId,
        idempotencyKey: event.idempotencyKey,
        customerId: event.customerId,
        actorId: event.actorId,
        orderId: event.orderId,
        amount: event.amount,
        creditQuantity: event.creditQuantity,
        sku: event.sku,
        status: event.status,
        eventTimestamp: event.eventTimestamp,
      };

      const payload = JSON.stringify({ eventData, previousHash: event.previousRecordHash });
      const computedHash = "0x" + crypto.createHash("sha256").update(payload).digest("hex");

      if (computedHash !== event.recordHash) {
        return {
          isValid: false,
          tamperedIndex: i,
          eventId: event.eventId,
          error: `TAMPERED_RECORD_HASH: Computed ${computedHash}, stored ${event.recordHash}`,
        };
      }

      expectedPreviousHash = event.recordHash;
    }

    return {
      isValid: true,
      verifiedEventsCount: events.length,
      headHash: expectedPreviousHash,
      verifiedAt: new Date().toISOString(),
    };
  }
}

module.exports = { AuditChainVerifier };
