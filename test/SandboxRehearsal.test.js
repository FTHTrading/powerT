const { expect } = require("chai");
const { MasterLedgerService } = require("../services/ledger-api/src/ledger");
const { AuditChainVerifier } = require("../services/ledger-api/src/auditVerifier");
const pilotConfig = require("../config/pilot.v1.json");

describe("Sandbox Rehearsal — Operational Recovery, Outages & Boundary Tests", function () {
  let ledger;
  let auditVerifier;

  beforeEach(function () {
    ledger = new MasterLedgerService();
    auditVerifier = new AuditChainVerifier(ledger);
  });

  it("should handle triple duplicate webhook delivery with zero duplicate issuances", async function () {
    const payload = {
      idempotencyKey: "stripe_evt_triple_001",
      customerId: "CUST-TRIPLE-01",
      email: "triple@powerteam.com",
      walletAddress: "0x1234567890123456789012345678901234567890",
      amount: 500,
      providerRef: "pi_stripe_triple",
    };

    // 1st delivery
    const res1 = await ledger.processSettledPaymentWebhook(payload);
    expect(res1.status).to.equal("SUCCESS");

    // 2nd delivery (duplicate)
    const res2 = await ledger.processSettledPaymentWebhook(payload);
    expect(res2.status).to.equal("IGNORED_DUPLICATE");

    // 3rd delivery (duplicate)
    const res3 = await ledger.processSettledPaymentWebhook(payload);
    expect(res3.status).to.equal("IGNORED_DUPLICATE");

    // 4th delivery (duplicate)
    const res4 = await ledger.processSettledPaymentWebhook(payload);
    expect(res4.status).to.equal("IGNORED_DUPLICATE");

    // Balance must be exactly 500
    expect(ledger.getCustomerCreditBalance("CUST-TRIPLE-01")).to.equal(500);
    expect(ledger.creditLots.size).to.equal(1);
    expect(ledger.orders.size).to.equal(1);
  });

  it("should prevent double-spending on concurrent redemptions", async function () {
    // User buys 250 credits (only enough for one CEO Summit ticket)
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_concur_01",
      customerId: "CUST-CONCUR-01",
      email: "concur@powerteam.com",
      walletAddress: "0x2222222222222222222222222222222222222222",
      amount: 250,
      providerRef: "pi_concur_250",
    });

    // Simulate concurrent redemption requests
    const p1 = ledger.redeemCreditsForCatalogItem({
      customerId: "CUST-CONCUR-01",
      catalogSku: "CEO-SUMMIT-2026-FTL",
      idempotencyKey: "red_session_1",
    });

    const p2 = ledger.redeemCreditsForCatalogItem({
      customerId: "CUST-CONCUR-01",
      catalogSku: "CEO-SUMMIT-2026-FTL",
      idempotencyKey: "red_session_2",
    });

    const results = await Promise.allSettled([p1, p2]);
    const fulfilled = results.filter(r => r.status === "fulfilled");
    const rejected = results.filter(r => r.status === "rejected");

    expect(fulfilled.length).to.equal(1);
    expect(rejected.length).to.equal(1);
    expect(rejected[0].reason.message).to.include("INSUFFICIENT_CREDITS");
    expect(ledger.getCustomerCreditBalance("CUST-CONCUR-01")).to.equal(0);
  });

  it("should process refund, void credit lots, and reject subsequent redemptions", async function () {
    const payment = await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_refund_01",
      customerId: "CUST-REFUND-01",
      email: "refund@powerteam.com",
      walletAddress: "0x3333333333333333333333333333333333333333",
      amount: 250,
      providerRef: "pi_refund_250",
    });

    expect(ledger.getCustomerCreditBalance("CUST-REFUND-01")).to.equal(250);

    // Process refund
    const refundRes = await ledger.processRefundOrChargeback({
      orderId: payment.orderId,
      reason: "CUSTOMER_SATISFACTION_GUARANTEE",
      approver: "HEAD_CUSTOMER_OPS",
    });

    expect(refundRes.status).to.equal("REFUND_PROCESSED");
    expect(refundRes.voidedCredits).to.equal(250);
    expect(ledger.getCustomerCreditBalance("CUST-REFUND-01")).to.equal(0);

    // Attempt redemption post-refund
    try {
      await ledger.redeemCreditsForCatalogItem({
        customerId: "CUST-REFUND-01",
        catalogSku: "CEO-SUMMIT-2026-FTL",
      });
      expect.fail("Should have failed redemption on refunded balance");
    } catch (err) {
      expect(err.message).to.include("INSUFFICIENT_CREDITS");
    }
  });

  it("should verify cryptographic audit chain integrity and detect tampering", async function () {
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_audit_01",
      customerId: "CUST-AUDIT-01",
      email: "audit@powerteam.com",
      walletAddress: "0x4444444444444444444444444444444444444444",
      amount: 500,
      providerRef: "pi_audit_500",
    });

    await ledger.redeemCreditsForCatalogItem({
      customerId: "CUST-AUDIT-01",
      catalogSku: "CEO-SUMMIT-2026-FTL",
    });

    // 1. Verify clean chain
    const cleanCheck = auditVerifier.verifyChainIntegrity();
    expect(cleanCheck.isValid).to.equal(true);
    expect(cleanCheck.verifiedEventsCount).to.equal(2);

    // 2. Simulate malicious record tampering
    ledger.auditEvents[0].amount = 999999;

    const tamperedCheck = auditVerifier.verifyChainIntegrity();
    expect(tamperedCheck.isValid).to.equal(false);
    expect(tamperedCheck.error).to.include("TAMPERED_RECORD_HASH");
  });

  it("should generate opaque rotating QR check-in tokens with zero PII", function () {
    const qrData = ledger.generateRotatingCheckinToken("TKT-1001", "CUST-SEC-01");
    expect(qrData.token).to.match(/^CHK-ROT-[a-f0-9]{24}$/);
    expect(qrData.token).to.not.include("CUST-SEC-01");
    expect(qrData.token).to.not.include("TKT-1001");
  });

  it("should complete member account recovery drill and preserve audit trail", async function () {
    const payment = await ledger.processSettledPaymentWebhook({
      idempotencyKey: "stripe_evt_recov_01",
      customerId: "CUST-RECOV-01",
      email: "recov@powerteam.com",
      walletAddress: "0xOLD_COMPROMISED_WALLET_0000000000000000",
      amount: 1000,
      providerRef: "pi_recov_1000",
    });

    const recovery = await ledger.recoverMemberPassport({
      oldPassportId: payment.passportId,
      customerId: "CUST-RECOV-01",
      newWalletAddress: "0xNEW_SECURE_HARDWARE_WALLET_1111111111",
      approver: "SAFE_MULTISIG_2_OF_3",
    });

    expect(recovery.status).to.equal("RECOVERED");
    expect(ledger.passportCredentials.get(payment.passportId).status).to.equal("REVOKED");
    expect(recovery.newPassport.status).to.equal("ACTIVE");
    expect(recovery.newPassport.walletAddress).to.equal("0xNEW_SECURE_HARDWARE_WALLET_1111111111");

    // Balance remains fully intact for customer
    expect(ledger.getCustomerCreditBalance("CUST-RECOV-01")).to.equal(1000);
  });

  it("should enforce CI/CD boundary gates against investor and secondary market flags", function () {
    expect(pilotConfig.enabledFeatures.investorPortal).to.equal(false);
    expect(pilotConfig.enabledFeatures.revenueNotes).to.equal(false);
    expect(pilotConfig.enabledFeatures.automatedPayouts).to.equal(false);
    expect(pilotConfig.enabledFeatures.walletTransfers).to.equal(false);
    expect(pilotConfig.enabledFeatures.secondaryMarket).to.equal(false);
    expect(pilotConfig.enabledFeatures.cashRedemptions).to.equal(false);
    expect(pilotConfig.enabledFeatures.stablecoinConversion).to.equal(false);
  });
});
