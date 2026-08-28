# 🔒 Data Classification & Privacy Matrix — `powerT`

## 1. Zero-PII On-Chain Mandate

Under GDPR, CCPA, and best security practices, no private customer data is ever committed to the blockchain.

| Data Type | Example Fields | Classification | Storage Location | On-Chain Exposure |
| :--- | :--- | :--- | :--- | :--- |
| **Direct PII** | Full Legal Name, Email, Phone, Physical Address | **RESTRICTED** | Encrypted PostgreSQL (AES-256) | ❌ **NONE** |
| **Financial / Payment** | Credit Card, Bank Account, Stripe Customer ID | **CONFIDENTIAL** | Stripe Vault / Encrypted DB | ❌ **NONE** |
| **Identity Verification** | KYC Document Hash, ID Type, Jurisdiction | **CONFIDENTIAL** | KYC Partner Secure Storage | ❌ **Salted SHA-256 Hash Only** |
| **Membership Metadata** | Passport Tier, Expiration, Entitlement Flags | **INTERNAL** | App Database & Contract | ✅ **Public Enum / Integer** |
| **Event Check-In Proof** | Check-in timestamp, badge issuance | **PUBLIC** | App Database & Contract | ✅ **Salted Proof / Badge Hash** |
| **Credit Ledger State** | Order ID, Credit Delta, SKU Reference | **CONFIDENTIAL** | Master Ledger Database | ✅ **Idempotency Hash Only** |
