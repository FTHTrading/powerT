# 📋 Product Specification — Powerteam Passport Pilot (v1.0)

## 1. Product Overview
The **Powerteam Passport** is a closed-loop membership credential and prepaid service credit product designed for Powerteam International's recurring 2026–2027 live and digital event calendar (CEO Success Summits, Rainmaker Summits, Digital Summits, and Icon Speaker programs).

## 2. Layer Definitions

### 🟢 Green: Powerteam Passport Credential
* **Format**: Non-transferable membership credential (SBT), wallet-bound with controlled account recovery.
* **Metadata Structure**:
```json
{
  "passportId": "PTI-2026-000001",
  "tier": "Founder",
  "status": "active",
  "issuedAt": "2026-08-28T20:00:00Z",
  "expiresAt": "2027-08-28T23:59:59Z",
  "entitlements": ["priority-registration", "ai-concierge", "member-pricing"],
  "credentialProof": "hash-only",
  "transferable": false,
  "piiStoredOnChain": false
}
```

### 🟡 Yellow: PTI Credits
* **Unit Definition**: One credit applies as $1.00 USD toward eligible catalog items under published terms.
* **Nature**: Contractual closed-loop service credit; not a stablecoin, deposit, or cash-equivalent.
* **Redemption Rules**: Sourced from `config/catalog.v1.json`, redeemable for event admissions, coaching seats, and vendor booths.

### 🔵 Blue: Restricted Revenue Note (Experimental Prototype)
* **Status**: Quarantined prototype (`contracts/experimental/PTIRevenueNoteSPV.sol`).
* **Requirement**: Not active in pilot. Requires independent SPV formation, offering documentation (PPM), accredited investor verification, and custody agreements before any live release.

## 3. Off-Chain Event Ledger Schema
The central source of truth maintains the following relational schema:
```sql
CREATE TABLE pti_master_ledger (
    customer_id VARCHAR(64) PRIMARY KEY,
    passport_id VARCHAR(64) UNIQUE,
    wallet_address VARCHAR(42),
    order_id VARCHAR(64) NOT NULL,
    payment_processor_event_id VARCHAR(128) UNIQUE,
    catalog_sku VARCHAR(64),
    credits_issued NUMERIC(18, 2) DEFAULT 0.00,
    credits_redeemed NUMERIC(18, 2) DEFAULT 0.00,
    credit_balance NUMERIC(18, 2) DEFAULT 0.00,
    credential_status VARCHAR(20) DEFAULT 'ACTIVE',
    event_checkin_id VARCHAR(64),
    kyc_status_reference VARCHAR(128),
    audit_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```
