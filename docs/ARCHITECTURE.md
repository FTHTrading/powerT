# 🏗️ Technical Architecture & System Integration — `powerT`

## 1. Dual-State Architecture Overview

To ensure data privacy (GDPR / CCPA) and avoid exposing customer Personal Identifiable Information (PII) on a public blockchain, `powerT` utilizes a **Dual-State Hybrid Architecture**:

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      Client Web3 / Mobile                   │
 └──────────────────────────────┬──────────────────────────────┘
                                │
        ┌───────────────────────┴───────────────────────┐
        ▼                                               ▼
┌──────────────────────────────┐        ┌──────────────────────────────┐
│       Off-Chain Core         │        │       On-Chain Smart         │
│  - CRM (HubSpot/Infusion)    │        │       Contracts (EVM)        │
│  - Payment (Stripe / ACH)    │◄──────►│  - PTICredentialPassport.sol │
│  - LMS (Courses / Audio)     │        │  - PTICreditVault.sol        │
│  - Merkle Root State Sync    │        │  - PTIRevenueNoteSPV.sol     │
└──────────────────────────────┘        └──────────────────────────────┘
```

## 2. On-Chain Contracts Detail

### 2.1 `PTICredentialPassport.sol`
* **Non-Transferable (SBT)**: Enforces `revert` on all standard ERC-721 transfer functions.
* **Tier Tracking**: Stores dynamic tier level (`General`, `VIP`, `Founder`, `LegacyMastermind`).
* **Identity Root**: Stores a cryptographic `identityHash` (SHA-256 of verified off-chain ID) without exposing raw PII.
* **Badge Attestations**: Stores array of byte32 hashes for speaker awards, certifications, and attendance POAPs.

### 2.2 `PTICreditVault.sol`
* **1:1 Fixed Value**: 1 credit = $1.00 USD.
* **Closed-Loop Utility**: Zero peer-to-peer transfers; strictly for purchases in the PTI catalog.
* **Burn on Redemption**: Automatically reduces circulating credits upon service consumption.
* **Proof-of-Liabilities**: Provides public view of total unearned deferred service obligations.

### 2.3 `PTIRevenueNoteSPV.sol`
* **SEC Compliance**: Reg D (506c) / Reg S.
* **Identity Registry**: On-chain KYC and accreditation allowlists.
* **Rule 144 Enforcer**: Programmatic time-lock holding period enforcement.
* **Waterfall Mechanics**: Receives gross event receivables and splits according to priority tiers.

---

## 3. AI Concierge MCP Integration
The system integrates with an AI Model Context Protocol (MCP) server that:
1. Verifies wallet credentials against current active tiers.
2. Calculates real-time discount entitlements for new bookings.
3. Automatically triggers calendar booking APIs and credit burn vouchers upon confirmed member authorization.
