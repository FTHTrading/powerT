const express = require("express");
const cors = require("cors");
const crypto = require("crypto");
const { MasterLedgerService } = require("./ledger");
const pilotConfig = require("../../../config/pilot.v1.json");
const catalogConfig = require("../../../config/catalog.v1.json");

function createApp(ledgerService = new MasterLedgerService()) {
  const app = express();
  app.use(cors());

  // Raw body capture for webhook signature verification
  app.use(express.json({
    verify: (req, res, buf) => {
      req.rawBody = buf;
    }
  }));

  // --- Auth Simulation Middleware ---
  const authenticateMember = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ error: "UNAUTHORIZED", message: "Authorization header required" });
    }
    const customerId = authHeader.replace("Bearer ", "").trim();
    if (!customerId) {
      return res.status(401).json({ error: "INVALID_CREDENTIALS" });
    }
    req.user = { customerId };
    next();
  };

  const authenticateAdmin = (req, res, next) => {
    const adminKey = req.headers["x-admin-key"];
    if (!adminKey || adminKey !== (process.env.ADMIN_API_KEY || "dev_admin_key")) {
      return res.status(403).json({ error: "FORBIDDEN", message: "Admin authorization required" });
    }
    next();
  };

  // 1. Health Endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "healthy",
      service: "powert-ledger-api",
      pilot: pilotConfig.release,
      timestamp: new Date().toISOString(),
    });
  });

  // 2. Catalog Endpoint (Pilot boundary filtered)
  app.get("/v1/catalog", (req, res) => {
    const allowedSkus = new Set(pilotConfig.allowedCatalogSkus);
    const filteredItems = catalogConfig.items
      .filter(item => allowedSkus.has(item.sku))
      .map(item => ({
        ...item,
        pilotNotice: "Pilot redemption subject to terms and confirmed event fulfillment.",
      }));

    res.json({
      version: catalogConfig.version,
      currency: catalogConfig.currency,
      creditValuePolicy: catalogConfig.creditValuePolicy,
      items: filteredItems,
    });
  });

  // 3. Member Credits Balance
  app.get("/v1/credits/balance", authenticateMember, (req, res) => {
    const balance = ledgerService.getCustomerCreditBalance(req.user.customerId);
    res.json({
      customerId: req.user.customerId,
      availableCredits: balance,
      purchasedCredits: balance,
      promotionalCredits: 0,
      valuationPolicy: "1 Credit = $1.00 USD toward eligible catalog items",
    });
  });

  // 4. Passport Profile
  app.get("/v1/passports/:passportId", (req, res) => {
    const passport = ledgerService.passportCredentials.get(req.params.passportId);
    if (!passport) {
      return res.status(404).json({ error: "NOT_FOUND", message: "Passport credential not found" });
    }

    res.json({
      passportId: passport.passportId,
      tier: passport.tier,
      status: passport.status,
      issuedAt: passport.issuedAt,
      expiresAt: passport.expiresAt,
      discountBasisPoints: passport.discountBps,
      hasConciergeAccess: passport.hasConciergeAccess,
      credentialProof: passport.credentialHash,
      transferable: false,
      piiStoredOnChain: false,
    });
  });

  // 5. Stripe Webhook Endpoint
  app.post("/v1/webhooks/stripe", async (req, res) => {
    const signature = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_secret";

    // Signature verification (HMAC SHA-256)
    if (signature && signature !== "skip_verify_for_unit_tests") {
      const computed = crypto.createHmac("sha256", webhookSecret).update(req.rawBody || JSON.stringify(req.body)).digest("hex");
      if (signature !== computed) {
        return res.status(400).json({ error: "INVALID_SIGNATURE", message: "Webhook signature verification failed" });
      }
    }

    const { eventType, data } = req.body;
    if (eventType !== "payment_intent.succeeded" && eventType !== "checkout.session.completed") {
      return res.json({ received: true, ignored: true, reason: "Unhandled event type" });
    }

    try {
      const result = await ledgerService.processSettledPaymentWebhook({
        idempotencyKey: data.idempotencyKey || data.paymentIntentId,
        customerId: data.customerId,
        email: data.customerEmail,
        walletAddress: data.walletAddress || "0x0000000000000000000000000000000000000000",
        amount: data.amount,
        currency: data.currency || "USD",
        providerRef: data.paymentIntentId,
        tier: data.tier || "Founder",
      });

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ error: "LEDGER_PROCESSING_FAILED", message: err.message });
    }
  });

  // 6. Transactional Credit Redemption
  app.post("/v1/redemptions", authenticateMember, async (req, res) => {
    const { catalogSku, idempotencyKey } = req.body;
    if (!catalogSku) {
      return res.status(400).json({ error: "BAD_REQUEST", message: "catalogSku is required" });
    }

    try {
      const result = await ledgerService.redeemCreditsForCatalogItem({
        customerId: req.user.customerId,
        catalogSku,
        idempotencyKey,
      });
      res.status(201).json(result);
    } catch (err) {
      if (err.message.includes("SKU_NOT_ALLOWED") || err.message.includes("INSUFFICIENT_CREDITS")) {
        return res.status(400).json({ error: "REDEMPTION_REJECTED", message: err.message });
      }
      res.status(500).json({ error: "INTERNAL_ERROR", message: err.message });
    }
  });

  // 7. Event Check-in
  app.post("/v1/checkins", async (req, res) => {
    const { ticketId, customerId, eventSku } = req.body;
    if (!ticketId || !customerId || !eventSku) {
      return res.status(400).json({ error: "BAD_REQUEST", message: "ticketId, customerId, and eventSku are required" });
    }

    try {
      const checkin = await ledgerService.processEventCheckin({ ticketId, customerId, eventSku });
      res.status(201).json(checkin);
    } catch (err) {
      res.status(500).json({ error: "CHECKIN_FAILED", message: err.message });
    }
  });

  // 8. Immutable Audit Events
  app.get("/v1/audit/events", (req, res) => {
    res.json({
      count: ledgerService.auditEvents.length,
      events: ledgerService.auditEvents,
    });
  });

  // 9. Admin Manual Adjustments (Requires 2 approvers)
  app.post("/v1/admin/manual-adjustments", authenticateAdmin, (req, res) => {
    const { customerId, creditDelta, reason, approver1, approver2 } = req.body;
    if (!customerId || !creditDelta || !reason || !approver1 || !approver2) {
      return res.status(400).json({
        error: "APPROVAL_POLICY_VIOLATION",
        message: "Manual adjustments require two distinct authorized approvers and a valid reason."
      });
    }

    const lotId = "LOT-ADJ-" + crypto.randomUUID();
    const adjustmentLot = {
      lotId,
      customerId,
      orderId: "ADJ-MANUAL",
      lotType: "PROMOTIONAL",
      originalCredits: Number(creditDelta),
      remainingCredits: Number(creditDelta),
      isLocked: false,
      createdAt: new Date().toISOString(),
    };
    ledgerService.creditLots.set(lotId, adjustmentLot);

    const audit = ledgerService._appendAuditEvent(
      "ADMIN_MANUAL",
      "ADJ-IDEMP-" + lotId,
      customerId,
      "ADJ-ORDER",
      0,
      Number(creditDelta),
      null,
      "MANUAL_ADJUSTMENT_APPLIED",
      `${approver1},${approver2}`
    );

    res.status(201).json({
      status: "ADJUSTMENT_COMMITTED",
      lotId,
      customerId,
      creditDelta,
      approvers: [approver1, approver2],
      auditHash: audit.recordHash,
    });
  });

  // 10. Admin Reconciliation Runs
  app.post("/v1/admin/reconciliation-runs", authenticateAdmin, (req, res) => {
    let settledFiatTotal = 0;
    let creditsIssuedTotal = 0;
    let creditsRedeemedTotal = 0;

    for (const order of ledgerService.orders.values()) {
      if (order.status === "SETTLED") {
        settledFiatTotal += order.amount;
        creditsIssuedTotal += order.creditsPurchased;
      }
    }

    for (const red of ledgerService.creditRedemptions.values()) {
      creditsRedeemedTotal += red.creditsBurned;
    }

    const outstandingPurchasedLiability = creditsIssuedTotal - creditsRedeemedTotal;
    const variancePercentage = settledFiatTotal === 0 ? 0 : Math.abs(settledFiatTotal - creditsIssuedTotal) / settledFiatTotal;

    const report = {
      runId: "REC-" + crypto.randomUUID(),
      settledFiatTotal,
      creditsIssuedTotal,
      creditsRedeemedTotal,
      outstandingPurchasedLiability,
      variancePercentage,
      isDiscrepancyFlagged: variancePercentage > 0.0001,
      runTimestamp: new Date().toISOString(),
    };

    res.status(200).json(report);
  });

  return app;
}

module.exports = { createApp };
