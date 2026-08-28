const crypto = require("crypto");
const pilotConfig = require("../../config/pilot.v1.json");
const catalogConfig = require("../../config/catalog.v1.json");

/**
 * Model Context Protocol (MCP) AI Concierge Service
 * Strictly scoped read-only tools bound to authenticated member session.
 * Prohibits financial/investment claims and logs every query to the audit chain.
 */
class MCPConciergeService {
  constructor(ledgerService) {
    this.ledger = ledgerService;
  }

  _logToolExecution(customerId, toolName, resultCategory) {
    return this.ledger._appendAuditEvent(
      "MCP_AI_CONCIERGE",
      "MCP-EXEC-" + crypto.randomUUID(),
      customerId,
      null,
      0,
      0,
      null,
      `MCP_TOOL_${toolName.toUpperCase()}`,
      `POLICY_V1:${resultCategory}`
    );
  }

  /**
   * Tool 1: passport.get_profile
   */
  async getProfile(sessionCustomerId) {
    const passport = Array.from(this.ledger.passportCredentials.values())
      .find(p => p.customerId === sessionCustomerId);

    this._logToolExecution(sessionCustomerId, "passport.get_profile", passport ? "FOUND" : "NOT_FOUND");

    if (!passport) {
      return { status: "NO_PASSPORT", message: "No active Powerteam Passport found for member session." };
    }

    return {
      passportId: passport.passportId,
      tier: passport.tier,
      status: passport.status,
      expiresAt: passport.expiresAt,
      discountBenefit: `${passport.discountBps / 100}% on eligible programs`,
      conciergeAccess: passport.hasConciergeAccess,
      disclaimer: "Passport credentials verify membership tier and event entitlements only."
    };
  }

  /**
   * Tool 2: credits.get_balance
   */
  async getBalance(sessionCustomerId) {
    const balance = this.ledger.getCustomerCreditBalance(sessionCustomerId);
    this._logToolExecution(sessionCustomerId, "credits.get_balance", "SUCCESS");

    return {
      availableBalance: balance,
      purchasedCredits: balance,
      promotionalCredits: 0,
      unitValuationPolicy: "1 PTI Credit applies as $1.00 toward eligible catalog items",
      disclaimer: "Credits are contractual closed-loop service prepayments; not an investment or cash equivalent."
    };
  }

  /**
   * Tool 3: catalog.list_eligible_items
   */
  async listEligibleItems(sessionCustomerId) {
    const allowed = new Set(pilotConfig.allowedCatalogSkus);
    const eligibleItems = catalogConfig.items.filter(i => allowed.has(i.sku));

    this._logToolExecution(sessionCustomerId, "catalog.list_eligible_items", "SUCCESS");

    return {
      pilotRelease: pilotConfig.release,
      catalogItems: eligibleItems,
      notice: "Catalog items are subject to seat availability and published cancellation terms."
    };
  }

  /**
   * Tool 4: events.get_member_schedule
   */
  async getMemberSchedule(sessionCustomerId) {
    const redemptions = Array.from(this.ledger.creditRedemptions.values())
      .filter(r => r.customerId === sessionCustomerId);

    this._logToolExecution(sessionCustomerId, "events.get_member_schedule", `COUNT_${redemptions.length}`);

    const schedule = redemptions.map(r => {
      const item = catalogConfig.items.find(i => i.sku === r.catalogSku);
      return {
        ticketId: r.ticketId,
        sku: r.catalogSku,
        eventTitle: item ? item.title : r.catalogSku,
        redeemedAt: r.createdAt,
        receiptProof: r.receiptHash,
      };
    });

    return {
      confirmedRegistrations: schedule,
      instructions: "Present your QR code badge at the summit registration desk for physical check-in."
    };
  }
}

module.exports = { MCPConciergeService };
