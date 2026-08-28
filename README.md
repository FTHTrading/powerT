# ⚡ Powerteam International (`powerT`)
### Enterprise Real-World Asset (RWA) Infrastructure, Soulbound Passport & SPV Revenue-Note Architecture

[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-363636?style=for-the-badge&logo=solidity)](https://soliditylang.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![RWA Security](https://img.shields.io/badge/Security-ERC--1400%20%7C%20ERC--3643-red?style=for-the-badge)](contracts/PTIRevenueNoteSPV.sol)
[![Utility Layer](https://img.shields.io/badge/Utility-Soulbound%20SBT%20%2B%20Credit%20Vault-brightgreen?style=for-the-badge)](contracts/PTICredentialPassport.sol)
[![Status](https://img.shields.io/badge/System%20Status-Production%20Ready-success?style=for-the-badge)]()

---

## 🎨 Color-Coded Table of Contents

| Color Indicator | Domain & Layer | Focus Area & Description |
| :--- | :--- | :--- |
| <img src="https://via.placeholder.com/15/28a745/28a745.png" width="15" height="15" /> **GREEN** | [🟢 **Layer 1: Consumer & Utility Passport**](#-1-layer-1-consumer--utility-passport-layer) | Non-transferable credentials (SBT), loyalty tiers, discounts, badges, AI concierge. |
| <img src="https://via.placeholder.com/15/ffc107/ffc107.png" width="15" height="15" /> **YELLOW** | [🟡 **Layer 2: Closed-Loop Credit Engine**](#-2-layer-2-closed-loop-credit-engine) | Fixed $1.00 USD redeemable credit system, catalog redemptions, proof-of-liabilities. |
| <img src="https://via.placeholder.com/15/007bff/007bff.png" width="15" height="15" /> **BLUE** | [🔵 **Layer 3: Institutional & SPV Revenue Note**](#-3-layer-3-institutional--spv-revenue-note-layer) | Regulated security token (Reg D 506c / Reg S), SPV bankruptcy separation, automated waterfalls. |
| <img src="https://via.placeholder.com/15/6f42c1/6f42c1.png" width="15" height="15" /> **PURPLE** | [🟣 **Layer 4: Technical & On-Chain Mechanics**](#-4-layer-4-technical--on-chain-mechanics) | Smart contract suite, EIP-712 meta-transactions, account abstraction, and gasless verification. |
| <img src="https://via.placeholder.com/15/dc3545/dc3545.png" width="15" height="15" /> **RED** | [🔴 **Layer 5: Legal Separation & Compliance Matrix**](#-5-layer-5-legal-separation--compliance-matrix) | Three-entity legal architecture, Howey test mitigation, SEC tokenized securities adherence. |
| <img src="https://via.placeholder.com/15/17a2b8/17a2b8.png" width="15" height="15" /> **CYAN** | [🌐 **Layer 6: Off-Chain Data Spine & MCP Agent**](#-6-layer-6-off-chain-data-spine--mcp-agent-layer) | Sync engine between CRM/Stripe/LMS/Ticketing and on-chain state roots. |
| <img src="https://via.placeholder.com/15/6c757d/6c757d.png" width="15" height="15" /> **GRAY** | [⚪ **Layer 7: 90-Day Deployment Roadmap**](#-7-layer-7-90-day-deployment-roadmap) | Four-phase implementation timeline from asset audit to regulated SPV issuance. |

---

## 🏛️ Ecosystem Overview & Architecture

The `powerT` system solves the fundamental flaw of "celebrity/personal brand tokenization" by decoupling the **identifiable, contractual business cash flows** from personal likeness:

```mermaid
flowchart TD
    subgraph 🟢 Layer 1: Consumer & Utility
        U[Member / Customer] -->|Fiat / Stripe / USDC| P[Powerteam Passport SBT]
        P -->|Grants Access| V[VIP Events, AI Concierge, Course LMS]
    end

    subgraph 🟡 Layer 2: Credit Engine
        P -->|Includes / Receives| C[PTI Credits $1.00 Peg]
        C -->|Deterministic 1:1 Redemption| R[Masterminds, Tickets, Vendor Booths, Media]
    end

    subgraph 🔵 Layer 3: Regulated SPV
        INV[Accredited Investor / LP] -->|KYC / AML Whitelist| SPV[PTI Summit Series SPV LLC]
        SPV -->|Issues| SEC[PTI Revenue Note Token ERC-1400]
        RECEIVABLES[Event Receivables & Sponsorship Escrow] -->|Waterfall Distribution| SEC
    end

    subgraph 🟣 Layer 4: Enterprise Data Spine
        DB[(Dual-State Off-Chain DB)] <-->|EIP-712 Attestation / State Root| SC[On-Chain Smart Contracts]
        AGENT[AI Concierge & Verification MCP Agent] <-->|Sync| DB
    end
```

---

## 🟢 1. Layer 1: Consumer & Utility Passport Layer

The **Powerteam Passport** (`PTICredentialPassport.sol`) is an ERC-721 Soulbound Token (non-transferable) engineered as a lifetime loyalty & credential anchor.

### Key Capabilities
* **Zero Speculation Guarantee**: Contract-level transfer restrictions prevent secondary market trading or speculative manipulation.
* **Dynamic On-Chain Metadata**:
  * **Membership Tier**: `General (1)`, `VIP (2)`, `Founder (3)`, `Legacy Mastermind (4)`.
  * **Accreditation Badges**: Speaker Certification, Graduate Honors, Master Coach Badge.
  * **Entitlements**: Dynamic flags for priority seating, 10% lifetime discount, and AI business concierge access.
* **EIP-712 Gasless Minting & Upgrades**: Users sign in with email/social (via embedded Account Abstraction) while backend relayers pay gas fees.

---

## 🟡 2. Layer 2: Closed-Loop Credit Engine

The **PTI Credit Vault** (`PTICreditVault.sol`) manages fixed-value utility credits pegged deterministically at **1 PTI Credit = $1.00 USD**:

### Mechanics & Economic Model
* **Non-Transferable Utility**: Credits are bound to the holder's Passport and cannot be traded on Uniswap, DEXs, or third-party marketplaces.
* **Deterministic Redemption Catalog**:
  * *National Summit VIP Pass*: 1,000 Credits ($1,000 value).
  * *Executive Mastermind Half-Day*: 1,500 Credits ($1,500 value).
  * *Exhibitor / Vendor Booth*: 2,500 Credits ($2,500 value).
  * *Speaker Stage Spotlight & Podcast Interview*: 750 Credits ($750 value).
* **Proof-of-Liabilities Tracking**: Every credit minted represents deferred revenue liability on the operating balance sheet. Upon redemption, credits are cryptographically burned, triggering earned revenue recognition in the accounting ledger.

---

## 🔵 3. Layer 3: Institutional & SPV Revenue Note Layer

The **PTI Revenue Note** (`PTIRevenueNoteSPV.sol`) is a fully regulated, permissioned security token issued by a **Bankruptcy-Remote Special Purpose Vehicle (SPV)** under SEC Regulation D (Rule 506c) and Regulation S.

### Institutional Tokenomics & Protections
* **Asset-Backed Collateral**: Backed exclusively by contracted event receivables (sponsorships, VIP table packages, exhibitor fees, media distribution contracts).
* **Identity Registry & Compliance Controls**:
  * Strict allowlist gating with on-chain KYC/AML and Accredited Investor checks.
  * Automated Rule 144 transfer lockups and jurisdiction blacklisting.
* **Programmatic Waterfall**:
  ```
  Gross Event Receipts
       │
       ├──► 1. Senior Production Expenses Escrow (Fixed Budget)
       │
       ├──► 2. Noteholder Preferred Return (e.g., 8–12% APR)
       │
       ├──► 3. Revenue Share Pool (e.g., 20% of net margin)
       │
       └──► 4. Operating Company Residual
  ```

---

## 🟣 4. Layer 4: Technical & On-Chain Mechanics

### Smart Contract Suite

| Contract File | Standard | Description |
| :--- | :--- | :--- |
| [`PTICredentialPassport.sol`](contracts/PTICredentialPassport.sol) | ERC-721 (SBT) | Non-transferable membership credential, tier tracking, achievement badges. |
| [`PTICreditVault.sol`](contracts/PTICreditVault.sol) | ERC-20 (Restricted) | Closed-loop $1.00 pegged prepaid credit balance with burn-on-redemption. |
| [`PTIRevenueNoteSPV.sol`](contracts/PTIRevenueNoteSPV.sol) | ERC-1400 / ERC-3643 | Regulated security token with KYC allowlist, transfer restrictions, and revenue waterfall. |
| [`PTIEscrowSettlement.sol`](contracts/PTIEscrowSettlement.sol) | Custom Escrow | Receivables settlement, multi-sig escrow, and partner fee disbursements. |

---

## 🔴 5. Legal Separation & Compliance Matrix

To eliminate regulatory ambiguity under the *Howey Test* and SEC digital asset guidance:

```
┌──────────────────────────────────────────────┐       ┌──────────────────────────────────────────────┐
│          PTI Operating Entity LLC            │       │         PTI Summit Series SPV LLC            │
│  (Operational & Consumer Services)           │       │       (Bankruptcy-Remote Entity)             │
├──────────────────────────────────────────────┤       ├──────────────────────────────────────────────┤
│  • Issues Powerteam Passport (SBT)           │       │  • Holds Assigned Event Receivables          │
│  • Sells & Redeems $1.00 PTI Credits         │       │  • Issues Reg D / Reg S Revenue Notes        │
│  • Delivers Seminars, Coaching & Media       │       │  • Disburses Investor Waterfall Yields       │
│  • Standard Commercial Terms & Consumer Law  │       │  • Formal PPM, Subscription Agmt, Custody    │
└──────────────────────────────────────────────┘       └──────────────────────────────────────────────┘
```

---

## 🌐 6. Layer 6: Off-Chain Data Spine & MCP Agent Layer

* **Dual-State Synchronization**: Bridges Stripe, HubSpot/ActiveCampaign, Eventbrite/Custom Ticketing, and Teachable/Kajabi into unified cryptographic state hashes.
* **Permissioned AI Concierge**: MCP Agent capable of:
  1. Validating credential tiers and discount eligibility in real-time.
  2. Calculating redeemable credit balances against published catalog rates.
  3. Generating real-time Proof-of-Reserve and Proof-of-Liability audit summaries.

---

## ⚪ 7. Layer 7: 90-Day Deployment Roadmap

```
Week 1-2   [Phase 1]: Asset Inventory & Legal Charter
           ├── Audit monetizable contracts (events, courses, sponsorships)
           └── Finalize three-tier corporate entity separation

Week 3-4   [Phase 2]: Smart Contract Deployment & Testing
           ├── Deploy PTICredentialPassport (SBT) & PTICreditVault on Testnet
           └── Complete EIP-712 permit & meta-transaction relayer tests

Week 5-6   [Phase 3]: Web3 Passport Portal & Data Spine
           ├── Integrate Social Login / Account Abstraction
           └── Connect CRM, Stripe webhooks, and credit balance ledger

Week 7-8   [Phase 4]: Pilot Cohort Launch (Named Summit Event)
           ├── Mint 250 Founder Passports for VIP attendee cohort
           └── Live redemption test for event perks, seating & masterminds

Week 9-10  [Phase 5]: Proof-of-Reserves & Partner Settlement Dashboard
           ├── Public audit dashboard (Credits issued vs. Redeemed)
           └── Automated sponsor booth settlement in fiat/stablecoin

Week 11-12 [Phase 6]: SPV Revenue Note Underwriting & Filing
           ├── File SEC Form D (Rule 506c) for Series A Event Receivables SPV
           └── Deploy PTIRevenueNoteSPV contract with KYC allowlist
```

---

## 🚀 Quick Start & Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Compile Contracts
```bash
npx hardhat compile
```

### 3. Run Test Suite
```bash
npx hardhat test
```

### 4. Deploy to Network
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 📄 License
Released under the [MIT License](LICENSE).
