-- Migration 003: Checkins, Adjustments, Reconciliation, Audit Ledger and Performance Indexes
CREATE TABLE IF NOT EXISTS event_checkins (
    checkin_id VARCHAR(64) PRIMARY KEY,
    ticket_id VARCHAR(64) NOT NULL,
    customer_id VARCHAR(64) NOT NULL REFERENCES customers(customer_id),
    event_sku VARCHAR(64) NOT NULL,
    badge_hash VARCHAR(66),
    checked_in_by VARCHAR(64) NOT NULL DEFAULT 'STAFF_GATE',
    checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
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

-- Performance & Integrity Indexes
CREATE INDEX IF NOT EXISTS idx_payment_events_idempotency ON payment_events(idempotency_key);
CREATE INDEX IF NOT EXISTS idx_credit_lots_customer ON credit_lots(customer_id);
CREATE INDEX IF NOT EXISTS idx_redemptions_ticket ON credit_redemptions(ticket_id);
CREATE INDEX IF NOT EXISTS idx_audit_record_hash ON audit_events(record_hash);

INSERT INTO schema_migrations (version) VALUES ('003_admin_approvals_and_audit_indexes') ON CONFLICT DO NOTHING;
