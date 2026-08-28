# ⚡ Powerteam International (`powerT`)
### Prototype & Product Specification Repository: Powerteam Passport Pilot & Closed-Loop Utility Architecture

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE.md)
[![Pilot Status](https://img.shields.io/badge/Pilot%20Status-Controlled%20Beta%20Pilot-yellow?style=for-the-badge)]()
[![Security Policy](https://img.shields.io/badge/Security-Policy%20Enforced-informational?style=for-the-badge)](SECURITY.md)

> [!IMPORTANT]
> **PROTOTYPE & SPECIFICATION REPOSITORY**: This repository contains architectural prototypes, specifications, and test suites for a controlled closed-loop utility pilot for Powerteam International’s active 2026–2027 event calendar. **It does not represent deployed financial infrastructure or an active securities offering.** All investor-facing revenue products remain strictly deferred until independent legal, custody, accounting, and regulatory approvals are complete.

---

## 🎨 Color-Coded Table of Contents

| Indicator | Domain & Layer | Focus & Prototype Scope | Primary Files |
| :--- | :--- | :--- | :--- |
| <img src="https://via.placeholder.com/15/28a745/28a745.png" width="15" height="15" /> **GREEN** | [🟢 **Layer 1: Powerteam Passport**](#-1-layer-1-consumer--passport-credential) | Non-transferable membership credential (SBT), attendance badges, tier permissions, AI concierge access. | [`contracts/PTICredentialPassport.sol`](contracts/PTICredentialPassport.sol) |
| <img src="https://via.placeholder.com/15/ffc107/ffc107.png" width="15" height="15" /> **YELLOW** | [🟡 **Layer 2: Closed-Loop PTI Credits**](#-2-layer-2-closed-loop-pti-service-credits) | Contractual closed-loop prepaid service credit against published catalog. Off-chain ledger first with on-chain receipts. | [`contracts/PTICreditReceipt.sol`](contracts/PTICreditReceipt.sol)<br>[`config/catalog.v1.json`](config/catalog.v1.json) |
| <img src="https://via.placeholder.com/15/007bff/007bff.png" width="15" height="15" /> **BLUE** | [🔵 **Layer 3: Restricted Revenue Note**](#-3-layer-3-restricted-revenue-note-experimental) | *Prototype restricted-token interface only; quarantined in experimental.* Not active in pilot. | [`contracts/experimental/PTIRevenueNoteSPV.sol`](contracts/experimental/PTIRevenueNoteSPV.sol) |
| <img src="https://via.placeholder.com/15/6f42c1/6f42c1.png" width="15" height="15" /> **PURPLE** | [🟣 **Layer 4: Internal Settlement Control**](#-4-layer-4-internal-settlement-routing) | Internal settlement-control prototype with two-step propose/approve/execute workflow and payee limits. | [`contracts/PTISettlementRouter.sol`](contracts/PTISettlementRouter.sol) |
| <img src="https://via.placeholder.com/15/dc3545/dc3545.png" width="15" height="15" /> **RED** | [🔴 **Layer 5: Entity Separation & Compliance**](#-5-layer-5-legal-separation--compliance) | Operating Co. vs. IP Co. vs. Future SPV isolation; Howey test de-risking; zero PII on-chain. | [`docs/LEGAL_AND_COMPLIANCE.md`](docs/LEGAL_AND_COMPLIANCE.md)<br>[`docs/DATA_CLASSIFICATION.md`](docs/DATA_CLASSIFICATION.md) |
| <img src="https://via.placeholder.com/15/17a2b8/17a2b8.png" width="15" height="15" /> **CYAN** | [🌐 **Layer 6: Operations & Reconciliation**](#-6-layer-6-data-spine--reconciliation-policy) | Authoritative off-chain database schema, daily Stripe/credit reconciliation, and policy-constrained MCP AI concierge. | [`docs/RECONCILIATION_POLICY.md`](docs/RECONCILIATION_POLICY.md)<br>[`docs/PRODUCT_SPEC.md`](docs/PRODUCT_SPEC.md) |
| <img src="https://via.placeholder.com/15/6c757d/6c757d.png" width="15" height="15" /> **GRAY** | [⚪ **Layer 7: Single-Event Pilot Runbook**](#-7-layer-7-single-event-pilot-runbook) | 50–100 cohort beta launch on a named summit (CEO Success Summit); KPIs and execution gates. | [`docs/PILOT_RUNBOOK.md`](docs/PILOT_RUNBOOK.md) |

---

## 🏛️ Target Operating Model

```
CUSTOMER / MEMBER
       │
       ▼
Powerteam Passport Portal (email login + embedded wallet + customer profile)
       │
       ├──► 🟢 Passport Credential — non-transferable identity/access badge
       ├──► 🟡 PTI Credits — closed-loop prepaid service balance ($1.00 credit value policy)
       └──► 🌐 CRM / Ticketing / LMS / Stripe Integration
                 │
                 ▼
       Off-chain source-of-truth ledger (PostgreSQL Master Table)
                 │
                 └──► Optional on-chain proofs (credential ID, issuance, redemption receipt hash)

-----------------------------------------------------------------------------------------
REGULATED INVESTOR PATH — SEPARATE & DEFERRED (NOT LIVE IN PILOT)
       │
       ▼
KYC / accreditation / jurisdiction screen
       │
       ▼
SPV + offering documents + controlled bank/custody + transfer agent/ATS review
       │
       ▼
Restricted revenue-note security token (Prototype Quarantined in contracts/experimental/)
```

---

## 🟢 1. Layer 1: Consumer & Passport Credential

* **Implementation**: [`contracts/PTICredentialPassport.sol`](contracts/PTICredentialPassport.sol)
* **Standard**: Soulbound non-transferable credential token with role-based access control (`DEFAULT_ADMIN_ROLE` on Safe multisig, `ISSUER_ROLE`, `REVOCATION_ROLE`, `METADATA_ROLE`, `PAUSER_ROLE`).
* **Zero PII**: No names, emails, or personal data on-chain. Uses salted cryptographic hashes only.
* **Controlled Recovery**: Account recovery mechanism to revoke compromised credentials and reissue to new member wallets with an on-chain audit trail.

---

## 🟡 2. Layer 2: Closed-Loop PTI Service Credits

* **Implementation**: [`contracts/PTICreditReceipt.sol`](contracts/PTICreditReceipt.sol) & [`config/catalog.v1.json`](config/catalog.v1.json)
* **Nature**: Contractual closed-loop service credit with a published redemption schedule; not a stablecoin, deposit, stored-value account, or cash-equivalent.
* **Issuance**: Issued only after verified settled payment and successful order reconciliation, with idempotency controls and manual exception review.
* **Catalog Redemptions**: Redeemable 1:1 for confirmed events (e.g., CEO Success Summit, Digital Success Summit, Rainmaker Summit, and Icon Speaker Accelerator).

---

## 🔵 3. Layer 3: Restricted Revenue Note (Experimental)

* **Implementation**: [`contracts/experimental/PTIRevenueNoteSPV.sol`](contracts/experimental/PTIRevenueNoteSPV.sol)
* **Status**: Prototype restricted-token interface; not a compliance determination, issuance platform, or transfer-agent substitute.
* **Prerequisites**: Requires issuer-specific legal counsel, bankruptcy-remote SPV creation, private placement memorandum (PPM), accreditation verification (Rule 506c), and registered custody review.

---

## 🟣 4. Layer 4: Internal Settlement Routing

* **Implementation**: [`contracts/PTISettlementRouter.sol`](contracts/PTISettlementRouter.sol)
* **Nature**: Internal settlement-control prototype; not third-party escrow, qualified custody, or fiduciary administration.
* **Controls**: Multi-sig approval, two-step propose/approve/execute workflow, payee allowlists, payout caps, and emergency pause.

---

## 🔴 5. Layer 5: Legal Separation & Compliance

| Entity | Role & Scope | Boundary Constraints |
| :--- | :--- | :--- |
| **Powerteam Operating Co.** | Runs events, programs, membership, ticketing, customer support, and credit redemption. | Cannot offer investment returns through Passport/credit products. |
| **Powerteam IP Co.** | Holds licensed trademarks, curriculum, media rights, domains, and content licenses. | Cannot transfer rights it does not clearly own or control. |
| **PTI Event / SPV LLC** | Holds a precisely scheduled receivables or revenue-participation asset (if counsel approves). | Cannot commingle operating cash or promise generalized company profits. |
| **Independent Vendors** | Payment processor, KYC vendor, accountant, counsel, registered intermediaries. | Cannot be presented as unnecessary because a smart contract exists. |

---

## 🌐 6. Layer 6: Data Spine & Reconciliation Policy

* **Authoritative Ledger**: Central PostgreSQL relational ledger syncing payment intent IDs, order IDs, SKU redemptions, and credential statuses.
* **Policy-Constrained MCP AI Agent**: Read-only authenticated member access, catalog recommendations, check-in badge verifications; autonomous fund transfers and accreditation approvals are strictly disabled.
* **Daily Reconciliation**: Standardized reporting comparing settled funds, credit issuances, redemptions, and deferred liability balances ([`docs/RECONCILIATION_POLICY.md`](docs/RECONCILIATION_POLICY.md)).

---

## ⚪ 7. Layer 7: Single-Event Pilot Runbook

* **Target Pilot**: CEO Success Summit (Fort Lauderdale / Las Vegas).
* **Participant Cohort**: Capped at 50–100 beta participants.
* **Success Criteria**: $\ge 80\%$ activation, $< 1\%$ reconciliation variance, $0$ duplicate mints, and a signed reconciliation report within 5 business days ([`docs/PILOT_RUNBOOK.md`](docs/PILOT_RUNBOOK.md)).

---

## 📁 Repository Directory Structure

```
powerT/
├── apps/
│   ├── portal/                   # Customer/member web experience
│   ├── admin/                    # Catalog, reconciliation, support controls
│   └── investor/                 # Quarantined / disabled until approved
├── contracts/
│   ├── PTICredentialPassport.sol # Soulbound membership credential & badges
│   ├── PTICreditReceipt.sol      # Proof receipts & idempotency logs
│   ├── PTISettlementRouter.sol   # Internal settlement & allocation router
│   ├── interfaces/               # Shared Solidity interfaces
│   └── experimental/
│       └── PTIRevenueNoteSPV.sol # Quarantined security token prototype
├── services/
│   ├── ledger-api/               # Master relational ledger service
│   ├── payments-webhook/         # Stripe/fiat payment listener & idempotency
│   ├── credential-service/       # Identity hash & badge issuer
│   ├── reconciliation-worker/    # Daily ledger & accounting auditor
│   └── mcp-concierge/            # Policy-constrained AI concierge agent
├── config/
│   ├── catalog.v1.json           # Active service catalog & pricing policy
│   ├── roles-and-approvals.yml   # Multi-sig governance & limits
│   └── jurisdictions.yml         # Jurisdiction eligibility policies
├── docs/
│   ├── PRODUCT_SPEC.md           # Product & database schemas
│   ├── PILOT_RUNBOOK.md          # 50-100 cohort beta launch runbook
│   ├── DATA_CLASSIFICATION.md    # Zero-PII matrix & privacy guidelines
│   ├── THREAT_MODEL.md           # Attack vectors & mitigation proofs
│   ├── INCIDENT_RESPONSE.md      # Severity escalation & pause playbook
│   ├── RECONCILIATION_POLICY.md  # Daily accounting & exception workflow
│   └── LEGAL_AND_COMPLIANCE.md   # Legal matrix & regulatory disclaimers
├── test/
│   ├── Passport.test.js          # Passport SBT & recovery tests
│   ├── Credits.test.js           # Proof receipt & idempotency tests
│   └── SettlementRouter.test.js  # Propose/approve/execute router tests
├── .env.example                  # Environment variable template
├── .gitignore                    # Git ignore rules for keys/secrets/build
├── hardhat.config.js             # Hardhat network & compiler settings
├── package.json                  # Dependencies & scripts
├── LICENSE.md                    # MIT License
├── SECURITY.md                   # Security & vulnerability disclosure policy
└── README.md                     # Master documentation with color-coded TOC
```

---

## 🧪 Testing & Verification

```bash
# Compile smart contracts
npx hardhat compile

# Run all unit tests
npx hardhat test
```
