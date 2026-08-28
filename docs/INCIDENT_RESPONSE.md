# 🚨 Incident Response & Emergency Procedures — `powerT`

## 1. Severity Levels & Escalation Matrix

* **SEV-1 (Critical)**: Unauthorized contract state modification, double-credit minting bug, or private key leak.
* **SEV-2 (High)**: Payment webhook desynchronization or off-chain ledger discrepancy $> \$1,000$.
* **SEV-3 (Medium)**: Single user login failure, delayed check-in badge attestation.

## 2. Emergency Pause Playbook
1. **Trigger Contract Pause**: The Safe multisig triggers `setPaused(true)` on `PTICredentialPassport.sol`, `PTICreditReceipt.sol`, and `PTISettlementRouter.sol`.
2. **Halt Automated Workers**: Suspend `services/payments-webhook` and `services/ledger-api`.
3. **Audit Ledger & Logs**: Run SQL reconciliation script comparing Stripe event logs to database ledger rows.
4. **Post-Mortem & Fix**: Deploy patch to testnet, verify with test suite, and unpause via multisig consensus.
