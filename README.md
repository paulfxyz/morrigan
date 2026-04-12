<div align="center">

<img src="https://morrigan.life/favicon.svg" alt="Morrigan" width="64" height="64">

# Morrigan

**Digital will. Encrypted legacy. Open-source.**

[![Version](https://img.shields.io/badge/version-v1.1.0-rgb(207%2C254%2C37)?style=flat-square&labelColor=rgb(13%2C13%2C16))](CHANGELOG.md)
[![License](https://img.shields.io/badge/license-AGPLv3-blue?style=flat-square)](LICENSE)
[![Status](https://img.shields.io/badge/status-active%20development-green?style=flat-square)](ROADMAP.md)
[![Built with ❤️ + AI](https://img.shields.io/badge/built_with-%E2%9D%A4%EF%B8%8F_%2B_AI-rgb(207%2C254%2C37)?style=flat-square&labelColor=rgb(13%2C13%2C16))](https://morrigan.life)

[morrigan.life](https://morrigan.life) · [morrigan.one](https://morrigan.one) · [Donate](https://morrigan.life/donate) · [Security](SECURITY.md) · [Changelog](CHANGELOG.md)

</div>

---

> *"Morrigan is not a product born from a pitch deck. It is an answer to a question I could not stop asking: what happens to the things we meant to say?"*
> — Paul Fleury, Founder

---

## What is Morrigan?

Morrigan is an open-source, zero-knowledge digital legacy platform. It lets you:

- **Encrypt and store** sensitive documents, credentials, messages, and final wishes in a vault only you can open
- **Assign specific items to specific people** — a beneficiary system with granular access control
- **Set a dead man's switch** — a check-in mechanism that releases your vault when you stop responding, and not a moment before
- **Anchor your vault to the Bitcoin blockchain** — tamper-evident proof of existence that survives Morrigan's infrastructure
- **Confirm identity with 2-of-3 channels** — email OTP, phone SMS, and TOTP authenticator, any two required for sensitive actions

It is free to use, free to fork, and licensed under AGPLv3. There is no proprietary backend, no locked encryption, and no business model that requires your data.

### The Origin

In 2019, a mentor was killed in Damascus. That same year, Paul Fleury's father died on Christmas Day. Neither left a way to be found digitally — no vault, no instructions, no legacy. Everything they had built digitally became inaccessible, ambiguous, or simply gone.

Morrigan began as a question: *if I die tonight, what happens to the things I meant to say?*

The name comes from the Celtic goddess of fate, war, and sovereignty — a figure associated with death not as an ending but as a transition. Morrigan watches over the threshold.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Cryptographic Stack](#cryptographic-stack)
- [3-Channel Identity System](#3-channel-identity-system)
- [Dead Man's Switch](#dead-mans-switch)
- [Blockchain Anchoring](#blockchain-anchoring)
- [Tech Decisions](#tech-decisions)
- [Repository Structure](#repository-structure)
- [Installation](#installation)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)
- [Author](#author)
- [Built with ❤️ + AI](#built-with-heart--ai)

---

## Features

### Core Vault

| Feature | Description |
|---|---|
| **Zero-knowledge encryption** | XChaCha20-Poly1305 — all encryption/decryption runs in-browser. The server never sees plaintext. |
| **Memory-hard key derivation** | Argon2id (64MB / 3 iterations) — makes GPU and ASIC brute-force economically impractical |
| **Distributed key recovery** | Shamir's Secret Sharing — split the vault key into N shares, require M to reconstruct |
| **Versioned snapshots** | Every vault update creates an immutable snapshot. Any previous state is restorable. |
| **Multi-format vault items** | Documents, credentials, images, messages, contact data, legal instructions |

### Identity & Access

| Feature | Description |
|---|---|
| **3-channel authentication** | Email OTP, Phone SMS, TOTP 2FA — at least 2 of 3 required for sensitive actions |
| **Granular beneficiary roles** | Assign specific vault items to specific people with custom access levels |
| **Timed access control** | Items can be locked until a specific date or event condition |

### Delivery & Verification

| Feature | Description |
|---|---|
| **Dead man's switch** | Configurable check-in intervals (daily/weekly/monthly) with grace periods |
| **Cascade delivery** | Missed check-ins trigger a delivery chain — verified, gradual, auditable |
| **Bitcoin anchoring** | OpenTimestamps SHA-256 hash → Merkle root → Bitcoin OP_RETURN |
| **Tamper-evident proofs** | .ots proof files verifiable with any Bitcoin node, independent of Morrigan |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER'S BROWSER                          │
│                                                                 │
│   Passphrase ──→ Argon2id ──→ 256-bit Key                      │
│                                   │                            │
│   Plaintext ──→ XChaCha20-Poly1305(key) ──→ Ciphertext         │
│                                   │                            │
│   Key ──→ Shamir SSS ──→ [Share 1] [Share 2] [Share 3]         │
└───────────────────────────┬─────────────────────────────────────┘
                            │ Only ciphertext crosses the wire
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                         SERVER                                  │
│                                                                 │
│   Receives: encrypted ciphertext only                          │
│   Stores:   ciphertext, metadata, beneficiary config           │
│   Cannot:   decrypt, read, reset passphrase, assist access     │
└───────────────────────────┬─────────────────────────────────────┘
                            │ SHA-256 hash only
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BITCOIN BLOCKCHAIN                           │
│                                                                 │
│   hash(ciphertext) ──→ Merkle tree ──→ OP_RETURN tx ──→ Block  │
│   Provides: tamper-evident timestamp, independent of Morrigan  │
└─────────────────────────────────────────────────────────────────┘
```

### Design Principles

1. **Client-side encryption is non-negotiable.** Nothing decryptable ever leaves the browser.
2. **We cannot be compelled to hand over plaintext.** There is none to hand over.
3. **The system should survive Morrigan's disappearance.** Bitcoin proofs, open-source code, and Shamir shares distributed to trusted humans.
4. **No feature can weaken the cryptographic model.** Convenience enhancements (biometrics, mobile) layer on top — they do not replace the model.

---

## Cryptographic Stack

### Encryption: XChaCha20-Poly1305

**Library:** [libsodium.js](https://github.com/jedisct1/libsodium.js) — the JavaScript binding to the audited libsodium C library.

XChaCha20-Poly1305 is an Authenticated Encryption with Associated Data (AEAD) scheme. It combines:

- **XChaCha20** — a stream cipher with a 192-bit extended nonce (vs. ChaCha20's 96-bit). The extended nonce eliminates practical collision risk when nonces are generated randomly, which they are here.
- **Poly1305** — a one-time MAC that authenticates the ciphertext. Any tampering with ciphertext or associated data causes decryption to fail with an authentication error before any plaintext is returned.

**Why not AES-GCM?**
AES-GCM is acceptable but has known weaknesses: nonce misuse recovery is catastrophic (32-bit counter overflows at ~68GB under the same key), and performance without hardware AES acceleration (common on mobile/embedded) degrades significantly. XChaCha20-Poly1305 has no hardware dependency and is the cipher used by WireGuard, Signal, and Noise Protocol Framework.

**Why not AES-CBC?**
No authentication. An attacker can flip ciphertext bits and produce different plaintext without detection. Never use unauthenticated encryption for secrets.

### Key Derivation: Argon2id

**Parameters:** Memory = 64MB, Iterations = 3, Parallelism = 1

Argon2id won the Password Hashing Competition (2015) and is the current OWASP recommendation for password-based key derivation.

The "id" variant interleaves:
- **Data-dependent** memory access (Argon2d variant) — resistant to GPU attacks
- **Data-independent** memory access (Argon2i variant) — resistant to side-channel attacks

At 64MB / 3 iterations, an attacker needs to spend 64MB of RAM per passphrase guess. A GPU with 24GB VRAM can run ~375 guesses in parallel (vs. millions in parallel with bcrypt). The economics of brute force become prohibitive at scale.

**Salt:** 128-bit random salt generated per-user at account creation. Stored alongside the ciphertext. Different users derive different keys from the same passphrase.

### Key Splitting: Shamir's Secret Sharing

Shamir's Secret Sharing (SSS) is information-theoretically secure — not just computationally. With a (M, N) threshold scheme:

- The vault key is split into N shares
- Any M shares reconstruct the exact key
- M−1 shares reveal **zero information** about the key — this is provable, not an assumption

Morrigan recommends 2-of-3 or 3-of-5 configurations. Suggested share distribution:
- Share 1: Trusted family member
- Share 2: Solicitor / notary (in a sealed envelope)
- Share 3: Trusted friend in a different jurisdiction

The shares are useless to an attacker who acquires only one. They do not enable partial reconstruction or brute force.

### Timestamp Anchoring: OpenTimestamps (Bitcoin)

1. SHA-256 hash of the encrypted vault ciphertext is computed client-side
2. The hash is submitted to the OpenTimestamps aggregation server
3. Thousands of hashes are combined into a Merkle tree
4. The Merkle root is embedded in a Bitcoin OP_RETURN transaction
5. The resulting `.ots` proof file is returned to the user

**Verification:** The `.ots` file proves the vault hash existed before the Bitcoin block's timestamp. Verification requires only a Bitcoin node — Morrigan does not need to exist.

**Privacy:** The hash reveals nothing about vault contents. Size, structure, and plaintext are not recoverable from a SHA-256 digest.

---

## 3-Channel Identity System

As of v1.1.0, Morrigan implements a **2-of-3 identity confirmation model** for all sensitive actions.

### The Three Channels

| Channel | Type | Delivery | Notes |
|---|---|---|---|
| **Email OTP** | Time-limited code | Email to verified address | Confirms ownership of the primary identity anchor |
| **Phone SMS** | Time-limited code | SMS to registered number | Physically separate from email — compromise of email alone is insufficient |
| **TOTP 2FA** | Time-based code | Authenticator app | Works offline. Most phishing-resistant. Any open-source app. |

### 2-of-3 Policy

For any sensitive action, at least 2 of your 3 registered channels must confirm. Which 2 is your choice — you select at confirmation time.

This is strictly more secure than the previous "both required" dual-channel model:
- **Failure resilience:** Losing access to one channel does not lock you out
- **Attacker resistance:** Compromising one channel is never sufficient
- **Flexibility:** Users without a phone number can use email + TOTP; users without a TOTP app can use email + SMS

### Sensitive Actions Requiring 2-of-3

| Action | Channels Required |
|---|---|
| Sign in | 2 of 3 |
| Export vault | 2 of 3 |
| Change beneficiaries | 2 of 3 |
| Toggle dead man's switch | 2 of 3 |
| Change email address | 2 of 3 |
| Delete account | 2 of 3 |

### TOTP Authenticator Compatibility

Morrigan's TOTP implementation follows [RFC 6238](https://www.rfc-editor.org/rfc/rfc6238) (TOTP) and [RFC 4226](https://www.rfc-editor.org/rfc/rfc4226) (HOTP). Any standards-compliant app works:

- [Aegis](https://getaegis.app/) (Android — open source, recommended)
- [Raivo OTP](https://raivo-otp.com/) (iOS — open source, recommended)
- [Bitwarden Authenticator](https://bitwarden.com/) (cross-platform — open source)
- Google Authenticator (iOS / Android)
- Any other RFC 6238-compliant app

---

## Dead Man's Switch

The dead man's switch is the core mechanism of Morrigan. It answers the question: *how do your people get what you've prepared for them, if you cannot deliver it yourself?*

### How It Works

1. **Set your interval** — you choose how often to check in (daily, weekly, monthly, or custom)
2. **Check in** — a simple confirmation via the Morrigan interface, email, or SMS
3. **Miss a check-in** — a configurable grace period begins (e.g., 7 days)
4. **Grace period expires** — the delivery sequence begins
5. **Beneficiaries receive** — their assigned vault items are delivered via the identity verification channels they registered

### Design Guarantees

- **You control the trigger.** The switch does not fire while you check in on schedule.
- **Grace period prevents accidents.** A missed check-in while on holiday or in hospital does not immediately expose your vault.
- **The delivery sequence is auditable.** Every step is logged with timestamps on the server and hashed to Bitcoin.
- **Beneficiaries cannot force early access.** They have no mechanism to trigger the switch or read vault items ahead of schedule.

---

## Blockchain Anchoring

```
User vault ciphertext
        │
        ▼
   SHA-256 hash
        │
        ▼
OpenTimestamps aggregation server
        │  (aggregates thousands of hashes hourly)
        ▼
   Merkle tree root
        │
        ▼
Bitcoin OP_RETURN transaction
        │
        ▼
Bitcoin block (immutable, globally replicated)
        │
        ▼
.ots proof file returned to user
```

**What this proves:** The vault hash existed before the Bitcoin block's timestamp.

**What this does NOT prove:** The contents, size, or structure of the vault. SHA-256 is a one-way function — you cannot derive any information about the preimage from the hash.

**Legal significance:** In many jurisdictions, a blockchain-anchored timestamp is legally meaningful as evidence of prior art or document existence. Consult a solicitor in your jurisdiction.

---

## Tech Decisions

### Why AGPLv3?

The AGPL was chosen specifically to prevent a proprietary fork from being deployed as a closed SaaS. Any operator running a modified version of Morrigan as a service must release their modifications. This enforces the open-source guarantee even in the network-service context.

A permissive licence (MIT/Apache) would allow a company to take the codebase, improve it, and offer it commercially without contributing back. Legacy and mortality tooling should not be controlled by commercial interests with opaque business models.

### Why libsodium?

libsodium is one of the most extensively audited cryptographic libraries in existence. It has been reviewed by multiple independent security firms, is used by Signal, WireGuard, and numerous security products, and provides a high-level API that makes cryptographic misuse difficult by design.

The alternative (Web Crypto API directly) is lower-level and more prone to implementation errors. libsodium's opinionated defaults (random nonces, authenticated encryption only, no unauthenticated modes) are the right choice for a non-cryptographer implementing a security-critical application.

### Why Bitcoin (not Ethereum or a permissioned chain)?

Bitcoin's proof-of-work consensus provides the highest known resistance to timestamp manipulation. Rewriting a Bitcoin block requires outpacing the entire network's hash rate — economically and practically impossible.

Ethereum is proof-of-stake, which is more energy-efficient but concentrates timestamp trust in validators. A permissioned chain (Hyperledger, private Ethereum) defeats the purpose entirely — the whole value of blockchain anchoring is independence from any single party, including Morrigan.

OpenTimestamps aggregates thousands of hashes per block, amortising the Bitcoin transaction fee across all users.

### Why XChaCha20 over AES?

AES-GCM is secure when implemented correctly, but "correctly" has subtle requirements: unique 96-bit nonces per key, careful handling of the 32-bit counter boundary, and hardware acceleration for performance. AES-GCM failures in the wild are almost always nonce reuse.

XChaCha20-Poly1305's 192-bit extended nonce means a randomly-generated nonce has a negligible collision probability over the lifetime of any practical application. It also runs at near-identical speed without hardware acceleration, making it appropriate for mobile and low-end devices.

### Why a single-page JavaScript application for the vault UI?

Client-side encryption requires that the encryption key and plaintext never leave the browser. A traditional server-rendered application would require posting sensitive data to the server, even transiently. A client-side SPA can guarantee that the server receives only the encrypted output of client-side operations.

The vault application is vanilla JavaScript with no transpilation step — reducing supply-chain attack surface, simplifying auditing, and removing framework dependency from the security model.

### Why Argon2id over bcrypt/scrypt?

- **bcrypt** is limited to 72-byte inputs (truncation vulnerability) and has a static 4KB memory cost — trivial to run on modern GPUs at scale.
- **scrypt** has better memory-hardness than bcrypt but poor parallelism resistance and no official standardisation track.
- **Argon2id** is the PHC winner, OWASP-recommended, NIST SP 800-63B-aligned, and combines resistance to both GPU/ASIC attacks (data-dependent) and side-channel attacks (data-independent) in a single variant.

---

## Repository Structure

```
morrigan/
├── landing/                # Public website (static HTML/CSS/JS)
│   ├── index.html          # Homepage
│   ├── features.html       # Features, comparison table, roadmap timeline
│   ├── security.html       # Cryptographic deep-dive, 3-channel identity
│   ├── donate.html         # Donation tiers, fund allocation, founder note
│   ├── login.html          # Auth page — vault sign-in
│   ├── signup.html         # Auth page — account creation with strength meter
│   ├── style.css           # Full Setrex design system (590 lines)
│   ├── main.js             # Site-wide JavaScript (621 lines, 12 features)
│   └── favicon.svg         # SVG raven-in-shield mark
│
├── docs/
│   ├── architecture/       # Encryption and key management design docs
│   └── api/                # Future API reference
│
├── README.md               # This file
├── CHANGELOG.md            # Version history
├── ROADMAP.md              # Versioned milestone plan
├── INSTALL.md              # Local development setup guide
├── CONTRIBUTING.md         # Contribution guidelines
├── SECURITY.md             # Responsible disclosure policy
├── CODE_OF_CONDUCT.md      # Community standards
└── LICENSE                 # AGPLv3
```

---

## Installation

See [INSTALL.md](INSTALL.md) for the full setup guide covering:
- Local development with a static server
- Environment variables for FTP deployment
- Production deployment checklist

Quick start (static file server):

```bash
git clone https://github.com/paulfxyz/morrigan.git
cd morrigan/landing
npx serve .
# Site available at http://localhost:3000
```

---

## Roadmap

| Version | Status | Focus |
|---|---|---|
| v1.0.0 | Released | Core vault, multi-page site, dual-channel auth, blockchain anchoring |
| v1.1.0 | **Current** | 3-channel identity (2-of-3), TOTP UI, extended docs, code audit |
| v1.2.0 | Planned | Full TOTP backend, Kyber-1024 PQC migration begins |
| v1.3.0 | Planned | WebAuthn / hardware security keys (YubiKey, Passkeys) |
| v1.4.0 | Planned | Mobile apps (iOS + Android), offline vault |
| v1.5.0 | Planned | Multi-party vaults, collaborative wills |
| v2.0.0 | Planned | Independent cryptographic audit, bug bounty, foundation registration |

Full milestone details in [ROADMAP.md](ROADMAP.md).

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a PR.

Areas where help is most needed:
- Cryptographic review and red-teaming
- Accessibility testing
- Internationalisation (i18n)
- Mobile browser testing
- Technical writing / documentation

**Security vulnerabilities:** Do not open public issues. See [SECURITY.md](SECURITY.md) for responsible disclosure instructions. Email `security@morrigan.life`.

---

## Security

Morrigan takes security seriously. The cryptographic model is designed so that even a full server compromise does not expose plaintext vault content.

Known limitations and in-scope concerns are documented in [SECURITY.md](SECURITY.md).

**Do not open public issues for security vulnerabilities.** Email `security@morrigan.life` instead.

---

## License

Morrigan is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPLv3).

Key implications:
- **Free to use** — for any purpose, forever
- **Free to modify** — the source is yours to change
- **Copyleft** — modifications must be released under the same licence
- **Network use** — if you run a modified Morrigan as a service, you must release your source code

The AGPLv3 was chosen specifically to prevent a proprietary fork from being run as a closed service. If you build something better with Morrigan's code, that improvement belongs to everyone.

---

## Author

**Paul Fleury** — [@paulfxyz](https://github.com/paulfxyz)

Internet entrepreneur based in Lisbon. General Partner at [Asymptote Ventures](https://linkedin.com/in/paulfxyz/).

Building open-source tools at the intersection of privacy, sovereignty, and human dignity.

→ [paulfleury.com](https://paulfleury.com) · [LinkedIn](https://linkedin.com/in/paulfxyz/) · [hollr.to/paulfxyz](https://hollr.to/paulfxyz)

---

## Built with ❤️ + AI

Morrigan is built using a **vibe coding** approach — the entire project is developed collaboratively with AI tools as primary pair programmers.

What "vibe coding" means here: not prompting an AI to generate boilerplate, but genuinely directing AI agents as if they were senior engineers — giving them context, architecture decisions, design systems, and constraints, and iterating on the results with the same rigour applied to human-written code.

**The tools used:**

- **[Perplexity Computer](https://perplexity.ai)** — primary agentic orchestration. Writes and ships production code, manages the full development session including parallel subagent work, deploys to FTP, pushes GitHub releases, and keeps the entire project context alive across sessions.
- **[Claude Code](https://claude.ai)** — code sessions for deep dives, complex refactors, and technical decision-making that benefits from extended context.
- Other AI tools as needed for research, design review, and content generation.

This is an honest and transparent attribution. Vibe coding is a legitimate development approach — it changes who writes the code, not the standards the code must meet.

The cryptographic decisions, architecture, product philosophy, and ethical choices in Morrigan are human. The code that implements those decisions is AI-assisted.

---

<div align="center">

**Morrigan is for everyone who has ever thought:**
*"What happens to everything I've built, if I'm suddenly gone?"*

[morrigan.life](https://morrigan.life) · [Donate](https://morrigan.life/donate) · [Star this repo](https://github.com/paulfxyz/morrigan)

*Made with purpose in Lisbon. 🇵🇹*

</div>
