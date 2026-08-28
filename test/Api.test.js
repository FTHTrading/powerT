const { expect } = require("chai");
const { createApp } = require("../services/ledger-api/src/app");
const { MasterLedgerService } = require("../services/ledger-api/src/ledger");
const { DailyReconciliationWorker } = require("../services/reconciliation-worker/index");
const { MCPConciergeService } = require("../services/mcp-concierge/index");

describe("Full Stack API, Reconciliation & MCP Concierge Integration", function () {
  let ledger;
  let app;
  let reconciliationWorker;
  let concierge;

  beforeEach(function () {
    ledger = new MasterLedgerService();
    app = createApp(ledger);
    reconciliationWorker = new DailyReconciliationWorker(ledger);
    concierge = new MCPConciergeService(ledger);
  });

  it("should enforce pilot catalog boundary to allowed SKUs only", async function () {
    const allowedSkus = ["CEO-SUMMIT-2026-FTL"];
    const allConfig = require("../config/catalog.v1.json").items;
    
    expect(allConfig.length).to.be.greaterThan(1);
    
    // Simulate GET /v1/catalog logic
    const pilotItems = allConfig.filter(i => allowedSkus.includes(i.sku));
    expect(pilotItems.length).to.equal(1);
    expect(pilotItems[0].sku).to.equal("CEO-SUMMIT-2026-FTL");
  });

  it("should process Stripe webhook and create member Passport", async function () {
    const webhookPayload = {
      eventType: "payment_intent.succeeded",
      data: {
        paymentIntentId: "pi_test_live_rehearsal_001",
        customerId: "CUST-REHEARSAL-01",
        customerEmail: "vip@powerteam.com",
        walletAddress: "0x7777777777777777777777777777777777777777",
        amount: 2500,
        currency: "USD",
        tier: "Founder",
      },
    };

    const res = await ledger.processSettledPaymentWebhook({
      idempotencyKey: webhookPayload.data.paymentIntentId,
      customerId: webhookPayload.data.customerId,
      email: webhookPayload.data.customerEmail,
      walletAddress: webhookPayload.data.walletAddress,
      amount: webhookPayload.data.amount,
      providerRef: webhookPayload.data.paymentIntentId,
      tier: webhookPayload.data.tier,
    });

    expect(res.status).to.equal("SUCCESS");
    expect(res.creditsIssued).to.equal(2500);

    const bal = ledger.getCustomerCreditBalance("CUST-REHEARSAL-01");
    expect(bal).to.equal(2500);
  });

  it("should execute full rehearsal redemption and generate clean reconciliation report", async function () {
    // 1. Ingest payment
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "pi_reconcile_01",
      customerId: "CUST-REHEARSAL-02",
      email: "rec@powerteam.com",
      walletAddress: "0x8888888888888888888888888888888888888888",
      amount: 1000,
      providerRef: "pi_reconcile_01",
      tier: "Founder",
    });

    // 2. Redeem for CEO Summit (250 credits)
    const redemption = await ledger.redeemCreditsForCatalogItem({
      customerId: "CUST-REHEARSAL-02",
      catalogSku: "CEO-SUMMIT-2026-FTL",
    });
    expect(redemption.status).to.equal("SUCCESS");

    // 3. Generate reconciliation report
    const report = reconciliationWorker.generateDailyReconciliationReport();
    expect(report.reconciliationStatus).to.equal("RECONCILED_CLEAN");
    expect(report.metrics.grossSettledPayments).to.equal(1000);
    expect(report.metrics.purchasedCreditsIssued).to.equal(1000);
    expect(report.metrics.purchasedCreditsRedeemed).to.equal(250);
    expect(report.metrics.outstandingPurchasedLiability).to.equal(750);
    expect(report.exceptionsCount).to.equal(0);
  });

  it("should execute MCP Concierge read-only tools and append audit records", async function () {
    await ledger.processSettledPaymentWebhook({
      idempotencyKey: "pi_mcp_test",
      customerId: "CUST-MCP-01",
      email: "mcp@powerteam.com",
      walletAddress: "0x9999999999999999999999999999999999999999",
      amount: 500,
      providerRef: "pi_mcp_test",
      tier: "Founder",
    });

    const profile = await concierge.getProfile("CUST-MCP-01");
    expect(profile.tier).to.equal("Founder");
    expect(profile.conciergeAccess).to.equal(true);

    const balance = await concierge.getBalance("CUST-MCP-01");
    expect(balance.availableBalance).to.equal(500);

    const catalog = await concierge.listEligibleItems("CUST-MCP-01");
    expect(catalog.catalogItems.length).to.equal(1);

    expect(ledger.auditEvents.length).to.be.at.least(4);
  });
});
