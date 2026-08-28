# 🛡️ Threat Model & Attack Vector Analysis — `powerT`

## 1. Threat Scenarios & Mitigations

### 1.1 Webhook Replay / Double-Minting
* **Threat**: Attacker captures payment webhook and replays payload to mint additional credits.
* **Mitigation**: Strict idempotency checking via `payment_processor_event_id` in database and `orderHash` tracking on-chain in `PTICreditReceipt.sol`.

### 1.2 Credential Compromise / Key Loss
* **Threat**: Member loses device or embedded wallet private key.
* **Mitigation**: Controlled recovery pattern in `PTICredentialPassport.recoverPassport()` allows admin Safe multisig to revoke old SBT and reissue credentials with verified off-chain authentication.

### 1.3 Unauthorized Secondary Trading
* **Threat**: Speculators attempt to list Passports or Credits on OpenSea or Uniswap.
* **Mitigation**: Pure contract-level transfer locks in both `PTICredentialPassport.sol` and `PTICreditReceipt.sol` explicitly `revert` on all ERC transfer and approval functions.
