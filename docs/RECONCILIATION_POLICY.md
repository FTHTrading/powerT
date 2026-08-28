# 📊 Daily Reconciliation & Accounting Policy — `powerT`

## 1. Daily Reconciliation Workflow

The off-chain financial and operational ledger is the sole authoritative source of truth. Daily automated reconciliation workers compare:

```
┌─────────────────────────────────────────────────────────────┐
│                 Daily Reconciliation Spine                  │
├─────────────────────────────────────────────────────────────┤
│  1. Payment Gateway Receipts (Stripe / ACH settled funds)   │
│  2. Total Purchased Credits Issued (USD Value)              │
│  3. Total Credits Redeemed Against Catalog SKUs             │
│  4. Outstanding Purchased-Credit Deferred Liability Balance │
│  5. Outstanding Promotional-Credit Balance                  │
│  6. Event / Ticket Inventory Delta (LMS & Eventbrite Sync)  │
│  7. Refunds, Chargebacks, and Manual Adjustments            │
│  8. On-Chain Receipt & Credential Logged Count              │
└─────────────────────────────────────────────────────────────┘
```

## 2. Idempotency & Duplicate Prevention
* Every credit issuance must originate from a verified, settled payment webhook containing a unique `payment_intent_id`.
* Every issuance is keyed to an immutable `order_id` in the database.
* Retries with identical order IDs are idempotent and strictly prevented from double-minting.

## 3. Two-Person Exception Review
The automated reconciliation worker alerts finance operations upon detecting:
* **Discrepancy > 0.01%** between settled Stripe receipts and credit issuance.
* **Manual credit adjustment** exceeding $250.
* **Refund or chargeback** processed after full or partial credit consumption.

All flagged exceptions require two-person sign-off from Finance Operations and Legal/Compliance before adjustments are committed.
