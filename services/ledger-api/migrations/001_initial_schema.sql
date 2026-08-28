-- Migration 001: Initial Core Schema
CREATE TABLE IF NOT EXISTS schema_migrations (
    version VARCHAR(64) PRIMARY KEY,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
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
    status VARCHAR(32) NOT NULL DEFAULT 'SETTLED',
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

INSERT INTO schema_migrations (version) VALUES ('001_initial_schema') ON CONFLICT DO NOTHING;
