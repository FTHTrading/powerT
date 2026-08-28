const { expect } = require("chai");
const { MasterLedgerService } = require("../services/ledger-api/src/ledger");

describe("MasterLedgerService — Vertical Slice & Pilot Boundary", function () {
  let ledger;

  beforeEach(function () {
    ledger = new MasterLedgerService();
  });

  it("should process settled payment webhook, issue credits, and create Passport", async function () {
    const res = await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_001",
      customerId: "CUST-101",
      email: "founder@example.com",
      walletAddress: "0x1111111111111111111111111111111111111111",
      amount: 500,
      providerRef: "pi_stripe_12345",
      tier: "Founder"
    });

    expect(res.status).to.equal("SUCCESS");
    expect(res.creditsIssued).to.equal(500);
    expect(res.passportId).to.equal("PTI-2026-000001");

    const balance = ledger.getCustomerCreditBalance("CUST-101");
    expect(balance).to.equal(500);
  });

  it("should enforce idempotency on duplicate payment webhooks", async function () {
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_duplicate_test",
      customerId: "CUST-102",
      email: "dup@example.com",
      walletAddress: "0x2222222222222222222222222222222222222222",
      amount: 250,
      providerRef: "pi_stripe_dup",
    });

    const secondAttempt = await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_duplicate_test",
      customerId: "CUST-102",
      email: "dup@example.com",
      walletAddress: "0x2222222222222222222222222222222222222222",
      amount: 250,
      providerRef: "pi_stripe_dup",
    });

    expect(secondAttempt.status).to.equal("IGNORED_DUPLICATE");
    expect(ledger.getCustomerCreditBalance("CUST-102")).to.equal(250);
  });

  it("should execute transactional credit redemption for allowed pilot SKU", async function () {
    // 1. Issue credits
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_redeem_01",
      customerId: "CUST-103",
      email: "attendee@example.com",
      walletAddress: "0x3333333333333333333333333333333333333333",
      amount: 500,
      providerRef: "pi_stripe_500",
    });

    // 2. Redeem for CEO Summit ($250 / 250 credits)
    const redeemRes = await ledger.redeemCreditsForCatalogItem({
      customerId: "CUST-103",
      catalogSku: "CEO-SUMMIT-2026-FTL",
      idempotencyKey: "red_001",
    });

    expect(redeemRes.status).to.equal("SUCCESS");
    expect(redeemRes.creditsBurned).to.equal(250);
    expect(redeemRes.remainingBalance).to.equal(250);
    expect(redeemRes.ticketId).to.be.a("string");
    expect(redeemRes.receiptHash).to.be.a("string");

    // 3. Check-in event
    const checkin = await ledger.processEventCheckin({
      ticketId: redeemRes.ticketId,
      customerId: "CUST-103",
      eventSku: "CEO-SUMMIT-2026-FTL",
    });
    expect(checkin.badgeHash).to.be.a("string");
  });

  it("should reject redemption for non-pilot SKUs", async function () {
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_boundary",
      customerId: "CUST-104",
      email: "boundary@example.com",
      walletAddress: "0x4444444444444444444444444444444444444444",
      amount: 1500,
      providerRef: "pi_stripe_1500",
    });

    try {
      await ledger.redeemCreditsForCatalogItem({
        customerId: "CUST-104",
        catalogSku: "ICON-SPEAKER-PROGRAM-2026", // Not in pilot allowed list
      });
      expect.fail("Should have thrown boundary error");
    } catch (err) {
      expect(err.message).to.include("SKU_NOT_ALLOWED_IN_PILOT");
    }
  });

  it("should reject redemption when credit balance is insufficient", async function () {
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_low",
      customerId: "CUST-105",
      email: "low@example.com",
      walletAddress: "0x5555555555555555555555555555555555555555",
      amount: 100, // CEO Summit requires 250
      providerRef: "pi_stripe_100",
    });

    try {
      await ledger.redeemCreditsForCatalogItem({
        customerId: "CUST-105",
        catalogSku: "CEO-SUMMIT-2026-FTL",
      });
      expect.fail("Should have thrown insufficient credits");
    } catch (err) {
      expect(err.message).to.include("INSUFFICIENT_CREDITS");
    }
  });

  it("should maintain a verifiable cryptographic audit hash chain", async function () {
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_audit_01",
      customerId: "CUST-106",
      email: "audit@example.com",
      walletAddress: "0x6666666666666666666666666666666666666666",
      amount: 250,
      providerRef: "pi_stripe_audit",
    });

    await ledger.redeemCreditsForCatalogItem({
      customerId: "CUST-106",
      catalogSku: "CEO-SUMMIT-2026-FTL",
    });

    expect(ledger.auditEvents.length).to.equal(2);
    expect(ledger.auditEvents[1].previousRecordHash).to.equal(ledger.auditEvents[0].recordHash);
  });
});
