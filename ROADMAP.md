# Morrigan — Roadmap

This document describes the planned development trajectory for Morrigan, from its current state through the v2.0.0 foundation milestone. Versioning follows [Semantic Versioning](https://semver.org/).

> **Current version:** v1.1.0  
> **Last updated:** April 2026

---

## Versioning Philosophy

Morrigan's version numbers carry meaning:

| Type | Meaning | Example |
|---|---|---|
| **Patch** (x.x.X) | Bug fixes, security patches, content corrections | v1.1.0 → v1.1.1 |
| **Minor** (x.X.0) | New features, backward-compatible changes | v1.1.0 → v1.2.0 |
| **Major** (X.0.0) | Breaking data format or API changes, or milestone events | v1.x.x → v2.0.0 |

The jump from v1.x.x to v2.0.0 marks the completion of an independent cryptographic audit and formal foundation registration — not a feature release.

---

## v1.0.0 — Released (April 2026)

**Theme:** Core vault platform + public launch.

- [x] Full multi-page public website (index, features, security, donate)
- [x] Auth pages (login + signup with password strength meter)
- [x] XChaCha20-Poly1305 encryption (client-side, via libsodium.js)
- [x] Argon2id key derivation (64MB / 3 iterations)
- [x] Shamir's Secret Sharing (distributed key recovery)
- [x] Dead man's switch (configurable check-in intervals + grace periods)
- [x] Bitcoin anchoring via OpenTimestamps (SHA-256 → Merkle root → OP_RETURN)
- [x] Dual-channel authentication (email OTP + phone SMS)
- [x] Beneficiary roles and assignment system (UI design)
- [x] Canvas starfield animation, scroll reveals, tab switcher, accordion
- [x] Mobile-responsive design (hamburger nav, fluid typography)
- [x] GitHub repository scaffolding (README, CHANGELOG, CONTRIBUTING, SECURITY, LICENSE)
- [x] AGPLv3 licence
- [x] Setrex-inspired dark design system (BDO Grotesk, rgb(1,1,4), rgb(207,254,37))

---

## v1.1.0 — Current (April 2026)

**Theme:** 3-channel identity, documentation overhaul, code audit.

- [x] **3-channel identity system** — Email OTP + Phone SMS + TOTP 2FA
- [x] **2-of-3 confirmation policy** — any two of three channels must confirm sensitive actions
- [x] **TOTP compatibility** — RFC 6238-compliant, works with Aegis, Raivo, Bitwarden, Google Authenticator
- [x] **security.html updated** — 3-channel identity table, corrected auth roadmap, TOTP channel card
- [x] **features.html updated** — corrected roadmap versions (v1.0.0 → v2.0.0)
- [x] **index.html updated** — 3-channel copy throughout
- [x] **README.md rewrite** — extended architecture, cryptographic stack, tech decisions, vibe coding attribution
- [x] **ROADMAP.md created** — this file; correct versioning throughout
- [x] **INSTALL.md rewrite** — thorough setup guide for local dev + production
- [x] **CHANGELOG.md updated** — v1.1.0 entry with correct design tokens
- [x] **main.js audit** — comprehensive technical comments on all 12 features (621 lines)
- [x] **"Built with Perplexity Computer" removed** — replaced with "Built with ❤️ + AI" + vibe coding explanation
- [x] **GitHub release v1.1.0** — tag, release notes, badge updates
- [x] **FTP deploy** — all updated files deployed to morrigan.life

---

## v1.2.0 — Planned

**Theme:** Full TOTP backend implementation + post-quantum cryptography phase I.

- [ ] TOTP setup flow in vault UI (QR code generation, secret provisioning, backup codes)
- [ ] TOTP verification endpoint (server-side RFC 6238 validation with timing-safe comparison)
- [ ] Kyber-1024 key encapsulation (CRYSTALS-Kyber, NIST PQC standard)
- [ ] Dilithium digital signatures (CRYSTALS-Dilithium, NIST PQC standard)
- [ ] Hybrid classical + post-quantum encryption scheme (XChaCha20 + Kyber-1024)
- [ ] New vaults default to hybrid PQ+classical; migration path for existing vaults
- [ ] Documentation: post-quantum cryptography explainer

---

## v1.3.0 — Planned

**Theme:** WebAuthn / hardware security keys.

- [ ] FIDO2 / WebAuthn registration and authentication
- [ ] YubiKey support (hardware token, phishing-resistant by cryptographic design)
- [ ] Passkey support (device-bound or synced platform keys)
- [ ] Passkey as a fourth optional identity channel (2-of-4 policy update)
- [ ] Hardware key recovery flow
- [ ] Documentation: WebAuthn explainer, hardware key recommendations

---

## v1.4.0 — Planned

**Theme:** Mobile applications.

- [ ] Native iOS app (Swift / SwiftUI)
- [ ] Native Android app (Kotlin / Jetpack Compose)
- [ ] Biometric unlock (Face ID, Touch ID, fingerprint)
- [ ] Push notification check-ins for dead man's switch
- [ ] Offline vault access (encrypted local cache)
- [ ] Full feature parity with web platform
- [ ] TestFlight / Play Store internal testing

---

## v1.5.0 — Planned

**Theme:** Multi-party vaults and collaborative legacy.

- [ ] Multi-owner vault (joint accounts, shared wills)
- [ ] Threshold approval for releasing specific items (e.g., 2-of-3 beneficiaries must acknowledge receipt)
- [ ] Collaborative editing with per-contributor audit log
- [ ] Conflict resolution for concurrent edits
- [ ] Role expansion: executor, witness, co-administrator
- [ ] Legal notes: multi-party digital will validity by jurisdiction

---

## v2.0.0 — Planned

**Theme:** Independent audit, bug bounty, foundation registration.

This is a milestone release, not a feature release. The version bump to 2.0.0 marks the completion of:

- [ ] **Independent cryptographic audit** — full third-party review by a recognised security firm. Findings to be published in full.
- [ ] **Bug bounty programme** — public programme with defined scope, severity ratings, and reward tiers
- [ ] **Foundation registration** — formal non-profit legal entity in an appropriate jurisdiction
- [ ] **Governance structure** — foundation board, community advisory council, transparent decision-making
- [ ] **Security audit publication** — full report published regardless of findings
- [ ] **SPHINCS+ hash-based signatures** — post-quantum signature scheme as an alternative to Dilithium
- [ ] **HQC backup KEM** — algorithm diversity in key encapsulation (KEM agility)

---

## Out of Scope (Not Planned)

These items are explicitly not on the roadmap and would require significant community discussion before being considered:

- **Proprietary encryption extensions** — the cryptographic model is fixed and open
- **AI-generated will content** — Morrigan stores what you put in it; it does not generate legal documents
- **Centralised key escrow** — violates the zero-knowledge guarantee
- **Paid tiers with reduced features** — Morrigan is free by design. Donations fund development.
- **Social recovery via Morrigan staff** — we cannot and will not participate in account recovery

---

## Notes on Scope Changes

This roadmap is a statement of intent, not a contract. Versions may shift based on:
- Security findings that require immediate response
- Community feedback that changes prioritisation
- Dependencies on external cryptographic standards (NIST PQC finalisation, WebAuthn spec changes)

Major shifts will be documented in [CHANGELOG.md](CHANGELOG.md).
