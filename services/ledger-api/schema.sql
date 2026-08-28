-- =====================================================================
-- Powerteam Passport Pilot — Master Database Schema (PostgreSQL DDL)
-- =====================================================================

CREATE TABLE IF NOT EXISTS customers (
    customer_id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    kyc_status VARCHAR(32) DEFAULT 'UNVERIFIED',
    kyc_reference_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS wallet_links (
    link_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    wallet_address VARCHAR(42) NOT NULL UNIQUE,
    is_primary BOOLEAN DEFAULT TRUE,
    linked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS passport_credentials (
    passport_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    wallet_address VARCHAR(42) NOT NULL,
    tier VARCHAR(32) NOT NULL DEFAULT 'General',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', -- ACTIVE, SUSPENDED, REVOKED, EXPIRED
    issued_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    discount_bps INTEGER DEFAULT 0,
    has_concierge_access BOOLEAN DEFAULT TRUE,
    credential_hash VARCHAR(66) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS catalog_items (
    sku VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    credit_price NUMERIC(18, 2) NOT NULL,
    cash_price NUMERIC(18, 2) NOT NULL,
    inventory INTEGER NOT NULL,
    redeemable_until TIMESTAMP WITH TIME ZONE NOT NULL,
    refund_policy_id VARCHAR(64) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS orders (
    order_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    payment_processor_event_id VARCHAR(128) UNIQUE,
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    credits_purchased NUMERIC(18, 2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'SETTLED', -- PENDING, SETTLED, REFUNDED, DISPUTED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payment_events (
    event_id VARCHAR(64) PRIMARY KEY,
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    order_id VARCHAR(64) NOT NULL REFERENCES orders(order_id),
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    provider_reference VARCHAR(128) NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    raw_payload JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_lots (
    lot_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(order_id),
    lot_type VARCHAR(20) DEFAULT 'PURCHASED', -- PURCHASED, PROMOTIONAL
    original_credits NUMERIC(18, 2) NOT NULL,
    remaining_credits NUMERIC(18, 2) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credit_redemptions (
    redemption_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    passport_id VARCHAR(64) NOT NULL REFERENCES passport_credentials(passport_id),
    catalog_sku VARCHAR(64) NOT NULL REFERENCES catalog_items(sku),
    credits_burned NUMERIC(18, 2) NOT NULL,
    ticket_id VARCHAR(64) NOT NULL UNIQUE,
    receipt_job_enqueued BOOLEAN DEFAULT FALSE,
    receipt_hash VARCHAR(66),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_checkins (
    checkin_id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) NOT NULL,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    event_sku VARCHAR(64) NOT NULL,
    badge_hash VARCHAR(66),
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS credential_issuance_events (
    issuance_event_id VARCHAR(64) PRIMARY KEY,
    passport_id VARCHAR(64) NOT NULL REFERENCES passport_credentials(passport_id),
    event_type VARCHAR(32) NOT NULL, -- MINT, UPGRADE, RECOVERY, REVOCATION
    on_chain_tx_hash VARCHAR(66),
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS manual_adjustments (
    adjustment_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    credit_delta NUMERIC(18, 2) NOT NULL,
    reason TEXT NOT NULL,
    approver_1 VARCHAR(64) NOT NULL,
    approver_2 VARCHAR(64) NOT NULL,
    status VARCHAR(20) DEFAULT 'APPROVED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reconciliation_runs (
    run_id VARCHAR(64) PRIMARY KEY,
    settled_fiat_total NUMERIC(18, 2) NOT NULL,
    credits_issued_total NUMERIC(18, 2) NOT NULL,
    credits_redeemed_total NUMERIC(18, 2) NOT NULL,
    deferred_liability_total NUMERIC(18, 2) NOT NULL,
    variance_percentage NUMERIC(8, 4) NOT NULL,
    is_discrepancy_flagged BOOLEAN DEFAULT FALSE,
    run_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS audit_events (
    event_id VARCHAR(64) PRIMARY KEY,
    idempotency_key VARCHAR(128) NOT NULL UNIQUE,
    customer_id VARCHAR(64),
    actor_id VARCHAR(64) NOT NULL,
    order_id VARCHAR(64),
    provider_reference VARCHAR(128),
    amount NUMERIC(18, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    credit_quantity NUMERIC(18, 2),
    catalog_sku VARCHAR(64),
    event_timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    recorded_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(32) NOT NULL,
    approval_reference VARCHAR(128),
    previous_record_hash VARCHAR(66),
    record_hash VARCHAR(66) NOT NULL
);
