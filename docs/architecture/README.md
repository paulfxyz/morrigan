# Architecture Documentation

This directory contains the design documents for Morrigan's core systems.

These documents describe the *intended* architecture — implementation will follow in future releases. **Independent review and critique of these documents is actively encouraged.**

---

## Documents

| File | Description | Status |
|---|---|---|
| [encryption.md](encryption.md) | Cryptographic primitives, key hierarchy, vault encryption flow | Draft |
| [dead-mans-switch.md](dead-mans-switch.md) | Posthumous access mechanism, state machine, email design | Draft |

## Upcoming documents

- `shamir-key-sharing.md` — Shamir threshold implementation details
- `storage-backends.md` — S3, SFTP, WebDAV integration design
- `api-server.md` — Node.js/TypeScript API design and endpoint reference
- `beneficiary-flow.md` — End-to-end flow from vault owner to beneficiary
- `non-profit-governance.md` — Foundation structure and governance model

---

## Design Principles

1. **Zero-knowledge by construction** — no code path allows server-side decryption
2. **Auditable over clever** — reference published standards, no custom crypto
3. **Threshold redundancy** — no single point of failure in key management
4. **Inaction as the trigger** — the dead man's switch is activated by absence, not action
5. **Open source forever** — AGPLv3 ensures the architecture remains inspectable
