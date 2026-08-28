-- Migration 002: Credit Lots, Redemptions, and Durable Outbox Queue
CREATE TABLE IF NOT EXISTS credit_lots (
    lot_id VARCHAR(64) PRIMARY KEY,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    order_id VARCHAR(64) NOT NULL REFERENCES orders(order_id),
    lot_type VARCHAR(20) DEFAULT 'PURCHASED',
    original_credits NUMERIC(18, 2) NOT NULL,
    remaining_credits NUMERIC(18, 2) NOT NULL,
    is_locked BOOLEAN DEFAULT FALSE,
    is_voided BOOLEAN DEFAULT FALSE,
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

CREATE TABLE IF NOT EXISTS outbox_jobs (
    job_id VARCHAR(64) PRIMARY KEY,
    job_type VARCHAR(64) NOT NULL, -- ON_CHAIN_RECEIPT_LOG, RECONCILIATION_SYNC, NOTIFICATION
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PROCESSING, COMPLETED, FAILED, DEAD_LETTER
    attempts INTEGER DEFAULT 0,
    max_attempts INTEGER DEFAULT 5,
    last_error TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_at TIMESTAMP WITH TIME ZONE
);

INSERT INTO schema_migrations (version) VALUES ('002_credit_lot_expiry_and_outbox') ON CONFLICT DO NOTHING;
