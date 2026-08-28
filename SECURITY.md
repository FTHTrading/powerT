# Security Policy — Powerteam International (`powerT`)

## 1. Prototype & Development Status
**IMPORTANT NOTICE**: The contracts and code in this repository represent a prototype and product-specification architecture for a controlled closed-loop utility pilot. **No contracts in this repository are currently deployed to production or mainnet financial infrastructure.** Formal external smart contract audits and legal reviews will precede any mainnet deployment.

## 2. Reporting a Vulnerability
We take the security of our platform, members, and data seriously. If you discover a security vulnerability, please report it privately via email:

* **Security Contact**: `security@unykorn.org` / `security@powert.io`
* **Response SLA**: Initial triage within 24 hours; status updates within 72 hours.

Please include:
1. Proof-of-concept description or script.
2. Affected contracts, services, or configuration files.
3. Potential impact and remediation suggestions.

## 3. Embargo & Coordinated Disclosure
We request that reporters maintain confidentiality under a standard **90-day coordinated disclosure embargo** while remediation and patch releases are developed and verified.

## 4. Scope Exclusions
The following are strictly out of scope:
* Compromise resulting from user-side private key/credential loss or social engineering.
* Third-party payment gateways (e.g., Stripe) or upstream cloud provider outages.
* Theoretical issues on explicitly marked experimental contracts (`contracts/experimental/*`).
* Denial-of-service on local testnets or mock nodes.
