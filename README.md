# 🪶 morrigan

<div align="center">

**Prepare your digital legacy — with dignity and sovereignty.**

*Store files, messages, passwords, and final words. Encrypt them beyond recovery. Share access only with the people you trust, only when the time comes.*

[![Version](https://img.shields.io/badge/version-0.1.0-0d1518?style=flat-square&logo=github&logoColor=3a9faa)](https://github.com/paulfxyz/morrigan/releases/tag/v0.1.0)
[![License: AGPLv3](https://img.shields.io/badge/license-AGPLv3-3a9faa?style=flat-square)](LICENSE)
[![Non-Profit](https://img.shields.io/badge/non--profit-foundation-c9a64a?style=flat-square)](https://morrigan.life/foundation)
[![Zero Knowledge](https://img.shields.io/badge/zero--knowledge-architecture-1a3a3f?style=flat-square)](docs/architecture/encryption.md)
[![Open Source](https://img.shields.io/badge/open_source-forever-3a9faa?style=flat-square)](https://github.com/paulfxyz/morrigan)
[![Status](https://img.shields.io/badge/status-early_development-c9a64a?style=flat-square)]()
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-3a9faa?style=flat-square)](CONTRIBUTING.md)
[![Vibe Coded](https://img.shields.io/badge/vibe_coded-100%25-c96a2a?style=flat-square)](https://github.com/paulfxyz/morrigan)

> **Live:** [morrigan.life](https://morrigan.life) · **Docs:** [morrigan.life/docs](https://morrigan.life/docs) · **Donate:** [morrigan.life/donate](https://morrigan.life/donate)

<a href="https://morrigan.life">
  <img src="https://morrigan.life/assets/hero-bg.png" alt="Morrigan — Ancient Celtic standing stones with a raven silhouette in teal mist" width="720" />
</a>

*Your data is encrypted on your device. We never see it. If you lose your key, it's gone forever. That's not a bug — it's the promise.*

</div>

---

```
  ╔══════════════════════════════════════════════════════════╗
  ║                                                          ║
  ║   ███╗   ███╗ ██████╗ ██████╗ ██████╗ ██╗ ██████╗ █████╗ ║
  ║   ████╗ ████║██╔═══██╗██╔══██╗██╔══██╗██║██╔════╝██╔══██╗║
  ║   ██╔████╔██║██║   ██║██████╔╝██████╔╝██║██║  ███╗███████║
  ║   ██║╚██╔╝██║██║   ██║██╔══██╗██╔══██╗██║██║   ██║██╔══██║
  ║   ██║ ╚═╝ ██║╚██████╔╝██║  ██║██║  ██║██║╚██████╔╝██║  ██║
  ║   ╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝
  ║                                                          ║
  ║   🪶  Your encrypted digital will.                        ║
  ║   🔐  Zero-knowledge. No backdoors. No exceptions.        ║
  ║   🌍  Open source. Non-profit. Forever free.              ║
  ║                                                          ║
  ║   v0.1.0  ·  morrigan.life  ·  github.com/paulfxyz       ║
  ╚══════════════════════════════════════════════════════════╝
```

---

> This README is both a product reference and a design document. It covers the full vision, architecture decisions, cryptographic rationale, the dead man's switch mechanism, and lessons learned building in public. If you're working on digital estate planning, end-to-end encryption, or threshold cryptography, there's a lot here worth reading carefully.

---

## Table of Contents

1. [The Morrígan — the mythology](#-the-morrígan--the-mythology)
2. [Why this exists](#-why-this-exists)
3. [What Morrigan does](#-what-morrigan-does)
4. [Feature overview](#-feature-overview)
5. [Architecture overview](#-architecture-overview)
6. [Encryption deep-dive](#-encryption-deep-dive)
7. [Shamir's Secret Sharing](#-shamirs-secret-sharing)
8. [Transformation — Post-Quantum Commitment](#-transformation--post-quantum-commitment)
8. [The dead man's switch](#-the-dead-mans-switch)
9. [Storage model](#-storage-model)
10. [Key management philosophy](#-key-management-philosophy)
11. [Non-profit foundation](#-non-profit-foundation)
12. [Landing page](#-landing-page)
13. [Roadmap](#-roadmap)
14. [Self-hosting](#-self-hosting)
15. [Contributing](#-contributing)
16. [Changelog](#-changelog)
17. [Security](#-security)
18. [License](#-license)
19. [Author](#-author)
20. [Built with Perplexity Computer](#-built-with-perplexity-computer)

---

## 🪶 The Morrígan — the mythology

**The Morrígan** is a figure from Irish Celtic mythology. She is a goddess of fate, death, and sovereignty — not evil, but inevitable. She appears on the eve of great battles, not to cause destruction, but to foresee it. She is the boundary between the living and the dead. She is the crow perched on the standing stone, watching.

Her abilities:
- **Foresight** — she knows what is coming before it arrives
- **Sovereignty** — she grants or withdraws power; she cannot be owned
- **Transformation** — she shifts form; she is never trapped in one state
- **The boundary** — she exists at the edge between life and death, the seen and unseen

Each of these abilities maps to a design principle of this project. The one worth dwelling on is **Transformation**.

> *"She is never trapped in one state."*

As a foundation, Morrigan is constitutionally committed to always migrating to the strongest available cryptographic standards — including post-quantum cryptography. Algorithms are not permanent choices. They age, break, and are superseded. The Morrígan transforms. So does our stack.

This project is named in her honour. Morrigan helps you prepare — with dignity and intelligence — for the one boundary everyone will eventually cross.

---

## 💡 Why this exists

Someone close to me died suddenly. No warning, no time to prepare.

What followed was months of painful uncertainty: digital accounts nobody could access, passwords lost to the void, cloud files locked behind two-factor authentication tied to a dead phone, messages they had always meant to send but never did.

We prepare our physical estates with lawyers and notaries. We sign wills, name executors, designate beneficiaries. But our *digital* lives — the photos, the writings, the financial access, the credentials, the final words we never got around to saying — exist in a lawless, ungoverned limbo. They die with us, or they're exposed without our consent.

No existing solution solves this properly:
- **Password managers** have no posthumous access mechanism
- **Lawyer-held documents** can't store encrypted digital files
- **Google Inactive Account Manager** is a corporate product with a corporate privacy policy
- **Dead man's switch services** exist but none combine zero-knowledge encryption with threshold secret sharing

Morrigan is built to fill that gap. It is not a company. It will be a non-profit foundation. The software will always be free and open-source. The architecture is designed so that even *we* cannot read your data.

---

## 🔍 What Morrigan does

Morrigan is a **digital will platform**. It lets you:

1. **Store** anything — documents, photos, videos, voice recordings, plain text letters, passwords, seed phrases, final instructions
2. **Encrypt** it all, client-side, with a key that never leaves your device
3. **Set conditions** — who gets access to what, when, and under what circumstances
4. **Distribute your key** via Shamir's Secret Sharing across your trusted people — no single person can access your vault alone
5. **Automate the release** via a configurable dead man's switch — if you stop responding, access is granted after a waiting period you define

The experience is designed to feel like writing a letter, not configuring a cryptographic system.

---

## ✨ Feature Overview

| | Feature | Detail |
|---|---|---|
| 🔐 | **Client-side encryption** | All data encrypted on your device before upload. AES-256-GCM or XChaCha20-Poly1305 via libsodium. Server receives only ciphertext. |
| 🗝️ | **Sovereign key model** | On setup, you download a private key file. If you lose it, your data is irrecoverable. No reset. No backdoor. No exceptions. |
| 🧩 | **Shamir's Secret Sharing** | Your key is split into N shares. Any K-of-N combination reconstructs it. Beneficiaries each hold one share. No single party has full access. |
| 📁 | **Rich content support** | Upload any file format. Write rich text letters. Record voice messages. Store passwords, seed phrases, credentials. |
| ⏱️ | **Dead man's switch** | Configure a check-in window (7, 14, or 30 days). If you stop responding, access is triggered automatically. |
| 📧 | **Beneficiary notification** | Designate recipients by email. They receive a private link with instructions for triggering the release. |
| 🌐 | **Bring Your Own Storage (BYOS)** | Connect any S3-compatible, SFTP, or WebDAV endpoint. We never need to host your ciphertext. |
| 🔒 | **Zero-knowledge architecture** | Morrigan's servers never see plaintext. Encryption keys never transit our infrastructure. |
| 🌍 | **30+ languages** | Full i18n from day one. Localized UI and content in 30+ languages. |
| 📖 | **Open source, always** | AGPLv3 licensed. Audit the code. Fork it. Run your own instance. |
| 🏛️ | **Non-profit foundation** | Not a company. Funded by donations and grants. Transparent salary structure. |

---

## 🏛️ Architecture Overview

Morrigan is built around three architectural principles:

### 1. Zero-knowledge by construction

The architecture is not zero-knowledge by policy — it is zero-knowledge by construction. There is no code path that allows the server to decrypt user data. Ever.

```
User device                    Morrigan servers
─────────────────────────────────────────────────
  Raw content                       ↑
      ↓                             │
  [Encrypt with local key]     [Ciphertext only]
      ↓                             │
  Ciphertext ─────────────────────→ │
                                    │
  Private key   (never sent) ─────────── ✗
```

### 2. Distributed trust via Shamir's Secret Sharing

No single entity holds the power to decrypt your vault. Not you alone, not your beneficiaries alone, not Morrigan.

```
Your private key (K)
        ↓
  [Shamir Split: 3-of-5]
        ↓
  Share 1 → Beneficiary A
  Share 2 → Beneficiary B
  Share 3 → Beneficiary C (held encrypted by Morrigan)
  Share 4 → Beneficiary D
  Share 5 → You (backup copy)

  Any 3 of the 5 shares reconstruct K.
  No individual share reveals anything about K.
```

### 3. Dead man's switch as the release mechanism

Access is not released by an action you take — it is released by the *absence* of an action. This is the only design that works when the person holding the key is incapacitated or gone.

```
Beneficiary triggers request
        ↓
User receives email: "Confirm you're alive"
        ↓
[Daily for N days — configurable]
        ↓
No response after N days → Vault access released
```

---

## 🔐 Encryption Deep-Dive

### Algorithm selection: AES-256-GCM vs XChaCha20-Poly1305

Both are evaluated in Morrigan. Here is the rationale:

| Criterion | AES-256-GCM | XChaCha20-Poly1305 |
|---|---|---|
| Security level | 256-bit (quantum-resistant with 128-bit margin) | 256-bit |
| Performance (software) | Requires AES-NI hardware instruction for efficiency | Fast in pure software — better on older/mobile devices |
| Nonce size | 96 bits (12 bytes) — nonce reuse catastrophic | 192 bits (24 bytes) — safe for random generation |
| Standardization | NIST FIPS 197 — required for compliance contexts | IETF RFC 8439 / libsodium standard |
| libsodium support | `crypto_aead_aes256gcm` (hardware-dependent) | `crypto_aead_xchacha20poly1305_ietf` (always available) |
| Our recommendation | Use when hardware AES-NI is guaranteed | **Default: safer nonce space, portable, always fast** |

**Decision:** XChaCha20-Poly1305 is the default. AES-256-GCM is offered as an option for users in compliance contexts (government, finance) where NIST standards are required.

### Key derivation

Master keys are derived via **Argon2id** (the current state of the art for password-based key derivation):
- Memory: 64MB
- Iterations: 3
- Parallelism: 4
- Output: 32 bytes (256-bit key)

### Client-side implementation

All cryptographic operations run in-browser via **libsodium.js** — a WebAssembly compilation of the reference libsodium C library. We do not roll our own crypto. Ever.

```javascript
// Simplified key generation and encryption flow
const key = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_KEYBYTES);
const nonce = sodium.randombytes_buf(sodium.crypto_aead_xchacha20poly1305_ietf_NPUBBYTES);
const ciphertext = sodium.crypto_aead_xchacha20poly1305_ietf_encrypt(
  plaintext,
  additionalData,
  null,
  nonce,
  key
);
```

The key is exported as a `.key` file. The file is a base64-encoded JSON object containing the key material and metadata. The user is instructed, loudly and repeatedly, to store this file somewhere safe — a password manager, a hardware key, a printed piece of paper in a fireproof safe.

---

## 🧩 Shamir's Secret Sharing

[Shamir's Secret Sharing](https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing) (SSS) is a cryptographic scheme invented by Adi Shamir in 1979. It splits a secret into N shares such that any K of them reconstruct the original — but K-1 shares reveal absolutely nothing.

### Why SSS over multi-sig or simple key splitting

| Approach | Problem |
|---|---|
| **Simple key splitting** (cut the key in half) | Every share is a partial attack surface. Loss of any piece permanently breaks recovery. |
| **Multi-signature** | Requires all signers to be online simultaneously. Catastrophic UX for posthumous access. |
| **Shamir's Secret Sharing** | Threshold: K-of-N. Tolerates up to N-K lost shares. Information-theoretically secure below threshold. |

### The Morrigan implementation

Users configure:
- **N** — total number of shares created (e.g., 5)
- **K** — minimum shares required to reconstruct (e.g., 3)
- **Distribution** — which beneficiary or custody method receives each share

Shares are delivered via:
1. **Email to beneficiaries** — share embedded in a private link (encrypted at rest)
2. **Morrigan custody** — one share can optionally be held by Morrigan's servers, encrypted under the user's account credentials
3. **Manual download** — user downloads share for offline storage

The implementation uses **[secrets.js-grempe](https://github.com/grempe/secrets.js)** or equivalent audited library — not a handrolled polynomial interpolation.

---

## ⏱️ The Dead Man's Switch

This is the core mechanism that makes Morrigan work. It is worth understanding in detail.

### The problem it solves

You are incapacitated or dead. Your beneficiaries have their key shares. But how do they know you're gone? And how do they know it's *really* the right time — not an attempted premature access?

### The flow

```
1. Beneficiary A visits their private Morrigan link
2. They click "Request Access"
3. Morrigan sends you an email:
   Subject: "Someone has requested access to your Morrigan vault"
   Body:    "If you are OK, click here to dismiss this request."
4. This email repeats daily for N days (you configure N: 7 / 14 / 30 / custom)
5. If you click dismiss at any point → request cancelled, 30-day cooldown
6. If N days pass with no response → access is granted
7. Beneficiaries with sufficient shares are notified and can reconstruct the key
```

### Why daily emails, not a single email

A single missed email could be a spam filter. A typo in your email address. A brief hospitalization. Daily repetition over N days means:
- False positives (accidental triggers) are caught
- True positives (actual incapacity) are confirmed with high confidence
- The window is long enough for travel, illness, or communication breakdown

### Configurable window

| Window | Use case |
|---|---|
| 7 days | High urgency — financial access, time-sensitive instructions |
| 14 days | Standard recommendation |
| 30 days | Deliberate caution — extended illness, travel |
| Custom | Power users with specific legal or personal requirements |

### Security model

The dead man's switch is not a backdoor. Morrigan's servers:
- Can confirm the switch has triggered
- Can notify beneficiaries
- **Cannot decrypt the vault** — they never held the key

Even if Morrigan's infrastructure is compromised, attackers gain access to encrypted ciphertext and the list of beneficiaries — not the vault contents.

---

## 💾 Storage Model

### Default: Morrigan-hosted encrypted storage

Morrigan hosts encrypted blobs. The storage layer is content-addressed — files are stored by their hash, deduplicated, and never linked to plaintext metadata. The database stores:
- User ID (pseudonymous)
- Blob hash + size
- Encrypted metadata (filename, type, creation date) — decryptable only with your key
- Timestamps

### BYOS: Bring Your Own Storage

Power users can connect their own storage endpoint. Morrigan becomes a **zero-knowledge orchestration layer** — it handles authentication, the dead man's switch, key share distribution, and beneficiary management. The actual ciphertext never touches our servers.

Supported BYOS backends:
- Any **S3-compatible** endpoint (AWS S3, Cloudflare R2, Backblaze B2, MinIO, self-hosted)
- **SFTP** — any standard SSH file transfer server
- **WebDAV** — Nextcloud, ownCloud, Synology NAS, any RFC 4918-compliant server

---

## 🗝️ Key Management Philosophy

This section is the most important in the README. Read it carefully.

### The promise

> **If you lose your key, your data is irrecoverable. No reset. No backdoor. No exceptions.**

This is not a limitation of the implementation. It is the guarantee. The moment a "reset" mechanism exists, the zero-knowledge property is broken. A reset requires that *someone* — Morrigan, a support agent, a court order — can access your data without your key. We refuse to build that mechanism.

### What this means in practice

1. When you create a Morrigan vault, you are prompted to download your key file
2. The UI will not let you proceed without acknowledging — multiple times — that losing this file means losing your data
3. We recommend: at least two physical copies, at least one offline, at least one in a different location than your home
4. For Shamir-protected vaults: your K-of-N configuration determines redundancy — losing up to N-K shares is safe

### Two-tier key access model

| Tier | Audience | Method | Security | Notes |
|---|---|---|---|---|
| **Simple** | Non-technical users | Private key encrypted and held by Morrigan. Beneficiary authenticates to retrieve it. | Good — depends on Morrigan's security | Lower sovereignty — we hold an encrypted copy |
| **Sovereign** | Security-conscious users | Shamir's Secret Sharing. Key split across beneficiaries. Morrigan holds only one encrypted shard (never enough to decrypt alone). | Excellent — zero-knowledge, distributed trust | **Recommended. Our default.** |

---

## 🔮 Transformation — Post-Quantum Commitment

Encryption is not a fixed artefact. It is a living discipline.

As computing paradigms shift — particularly with the rise of quantum computing — the cryptographic primitives that are strong today may become vulnerable tomorrow. The Morrígan's power of **Transformation** is not metaphor: it is a constitutional obligation written into the foundation's charter. Morrigan will always migrate to the strongest available standards, regardless of the effort or cost.

### Why this matters

For-profit companies face commercial pressure to defer cryptographic upgrades. Legacy integrations, enterprise contracts, and engineering bandwidth trade-offs all conspire against doing the right thing. As a non-profit foundation with no investors and no exit to protect, Morrigan has no such pressure. The stack transforms.

### Current stack (quantum-classical hybrid baseline)

| Primitive | Algorithm | Security level | Quantum status |
|---|---|---|---|
| Symmetric cipher | XChaCha20-Poly1305 | 256-bit | **Quantum-resistant** (symmetric, 128-bit post-quantum) |
| Key exchange | X25519 (Curve25519) | 128-bit classical | Vulnerable to Shor's algorithm |
| Signatures | Ed25519 | 128-bit classical | Vulnerable to Shor's algorithm |
| KDF | Argon2id | Memory-hard | Not affected by quantum computing |
| Secret sharing | Shamir over GF(2⁸) | 256-bit secret | Not affected by quantum computing |

> Note: XChaCha20-Poly1305 is already quantum-resistant. The asymmetric primitives (X25519, Ed25519) are the migration targets.

### Post-quantum roadmap

NIST finalised its first post-quantum cryptography standards in 2024 (FIPS 203/204/205). Morrigan's migration path:

| Algorithm | Role | NIST standard | Status | Notes |
|---|---|---|---|---|
| **CRYSTALS-Kyber** (ML-KEM) | Key Encapsulation | FIPS 203 | On roadmap | Replaces X25519 for asymmetric key wrapping |
| **CRYSTALS-Dilithium** (ML-DSA) | Digital signatures | FIPS 204 | On roadmap | Replaces Ed25519 for vault manifest signing |
| **SPHINCS+** (SLH-DSA) | Hash-based signatures | FIPS 205 | On roadmap | Stateless fallback — no lattice assumptions |
| **HQC** | Code-based KEM | NIST Round 4 | Watching | Alternative mathematical family for diversity |

### Migration philosophy

1. **Hybrid mode first** — new vaults will support both classical and post-quantum primitives in parallel, ensuring backward compatibility during the transition
2. **Migration tooling** — existing vaults will receive a re-encryption path that allows seamless upgrade without data loss
3. **Ecosystem gating** — we will not force migration until browser WebAssembly support for PQC libraries is production-stable
4. **Transparency** — every cryptographic decision and timeline will be documented publicly in this repository

> *"We are not locked into today's choices. The stack transforms."*

---

## 🏛️ Non-Profit Foundation

Morrigan will be established as a non-profit foundation. Not a startup. Not a company with investors. Not a product that will be acquired.

### Why non-profit

The moment Morrigan has shareholders, it has pressure to monetize your most private data. The incentive structure of a for-profit company is incompatible with the trust required for this product. A non-profit with a transparent governance structure is the only model that makes sense here.

### Incorporation

We are evaluating three jurisdictions:
- **France** — strong privacy tradition, GDPR by default, EU data residency
- **Switzerland** — Geneva Conventions, political neutrality, recognized foundation law
- **United States** — 501(c)(3), broad donor base, established open-source precedent

### Salary structure

| Role | Cap | Notes |
|---|---|---|
| All staff | 3× local median wage | Hard cap — never exceeded |
| Founder | Lowest relative to contribution | Scales down with workload |
| Any month with minimal input | Proportional reduction | Not a fixed salary |

The compensation model ensures that Morrigan cannot become a financial vehicle for its founders.

### Funding model

- **Donations** — individual supporters via the donation page
- **Grants** — privacy-focused foundations (NLnet, Open Technology Fund, Mozilla Foundation)
- **Hosted tier** — optional paid tier for high-storage/high-availability usage (software remains free and self-hostable)
- **Corporate sponsorship** — with strict conflict-of-interest policy

---

## 🌐 Landing Page

The `landing/` directory in this repository contains the full source of [morrigan.life](https://morrigan.life).

**Stack:** Static HTML / CSS / JavaScript — no framework, no build step, no bundler.

**Design:**
- Dark teal / charcoal / muted gold palette inspired by Celtic mythology
- Typography: Cormorant Garamond (display) + DM Sans (body)
- Hero: atmospheric photo of standing stones with a raven silhouette
- Scroll-driven animations (CSS-native, no JS library)
- Fully responsive, light/dark mode toggle

**Sections:**
- `#hero` — Value proposition + primary CTA
- `#why` — Founder's personal narrative (placeholder for Paul's copy)
- `#what` — The technical stack, encryption approach, open-source commitment
- `#how` — Four-step process walkthrough + dead man's switch explainer
- `#languages` — 30+ language support visualization
- `#donate` — Non-profit foundation + funding model

**Hosting:** Deployed to `morrigan.life` via FTP on SiteGround (es20.siteground.eu).

---

## 🗺️ Roadmap

### v0.1.0 — Landing (current)
- [x] Public repository with full documentation
- [x] Landing page live at morrigan.life
- [x] Brand identity (logo, colors, typography)
- [x] Architecture design documents

### v0.2.0 — Transformation *(this release)*
- [x] Landing page full Anthropic-inspired design rebuild
- [x] Post-quantum cryptography section on landing page
- [x] Foundation charter: commitment to always upgrade cryptographic stack
- [x] CRYSTALS-Kyber, CRYSTALS-Dilithium, SPHINCS+ roadmap documented
- [x] "Post-quantum ready" trust signal in hero
- [x] README: Transformation narrative and PQC migration roadmap

### v0.3.0 — Foundation
- [ ] Non-profit foundation registration
- [ ] Early Access waitlist and email capture
- [ ] Donation page (Stripe / GitHub Sponsors)
- [ ] Community Discord / Matrix server

### v0.3.0 — Core Encryption
- [ ] Client-side encryption library (libsodium.js integration)
- [ ] Key generation and export UI
- [ ] Local vault proof of concept (no server)
- [ ] Unit tests for all crypto primitives

### v0.4.0 — Vault & Content
- [ ] File upload with client-side encryption
- [ ] Rich text editor for letters/notes
- [ ] Audio recording with client-side encryption
- [ ] Vault management UI (create, view, edit, delete items)

### v0.5.0 — Shamir & Beneficiaries
- [ ] Shamir's Secret Sharing implementation (3rd-party audited library)
- [ ] Beneficiary management (add/remove/notify)
- [ ] Key share distribution via email
- [ ] Share reconstruction UI (for beneficiaries)

### v0.6.0 — Dead Man's Switch
- [ ] Check-in notification system (email-based)
- [ ] Configurable window (7/14/30/custom days)
- [ ] Beneficiary trigger flow
- [ ] Audit log of all switch events

### v0.7.0 — BYOS & Infrastructure
- [ ] S3-compatible storage backend
- [ ] SFTP storage backend
- [ ] WebDAV storage backend
- [ ] Infrastructure as code (Terraform or Pulumi)

### v1.0.0 — Public Beta
- [ ] Full feature complete
- [ ] Security audit by independent third party
- [ ] Bug bounty program
- [ ] Documentation site

---

## 🖥️ Self-Hosting

Morrigan is designed to be fully self-hostable. The hosted service at morrigan.life is one deployment — not a proprietary lock-in. The entire stack can run on your own infrastructure.

*Self-hosting instructions will be added as the server-side code is developed. The architecture documentation in `docs/architecture/` describes the design decisions that will guide the implementation.*

**Planned deployment options:**
- **Docker Compose** — single-machine deployment, full stack
- **Kubernetes** — production, multi-node, HA
- **Bare metal** — documented manual setup guide

---

## 🤝 Contributing

Morrigan is an open-source project and welcomes contributions from everyone. Please read [CONTRIBUTING.md](CONTRIBUTING.md) for full guidelines.

**Priority areas for contribution:**
1. **Cryptography review** — audit the encryption design in `docs/architecture/encryption.md`
2. **Accessibility** — the landing page and future app UI must meet WCAG AA
3. **Translations** — 30+ languages from day one, community-maintained via Crowdin (coming soon)
4. **Security research** — responsible disclosure process documented in [SECURITY.md](SECURITY.md)
5. **Frontend development** — landing page, app UI
6. **Backend development** — Node.js / TypeScript API server (upcoming)

**Quick start:**
```bash
git clone https://github.com/paulfxyz/morrigan.git
cd morrigan

# Landing page (no build step needed)
cd landing
open index.html
```

---

## 📋 Changelog

### v0.2.0 — Transformation *(2026-04-12)*
- Anthropic-inspired design system: Playfair Display + Inter, warm parchment palette, alternating sections
- Post-quantum cryptography commitment section added to landing page
- CRYSTALS-Kyber, CRYSTALS-Dilithium, SPHINCS+ roadmap documented
- "Post-quantum ready" trust badge added to hero
- README: Transformation narrative, PQC migration tables, migration philosophy

### v0.1.0 — Landing *(initial release)*
See [CHANGELOG.md](CHANGELOG.md) for the full version history.

**Latest:** [v0.1.0](CHANGELOG.md#v010--2026-04-12) — Initial public release. Landing page. Architecture documentation. Repository scaffolding.

---

## 🔒 Security

Morrigan takes security seriously. Please read [SECURITY.md](SECURITY.md) for:
- Supported versions and their security status
- How to report a vulnerability responsibly
- Our disclosure timeline
- What we consider in-scope vs out-of-scope

**Do not open public issues for security vulnerabilities.** Email `security@morrigan.life` instead.

---

## 📄 License

Morrigan is licensed under the [GNU Affero General Public License v3.0](LICENSE) (AGPLv3).

Key implications:
- **Free to use** — for any purpose, forever
- **Free to modify** — the source is yours to change
- **Copyleft** — modifications must be released under the same license
- **Network use** — if you run a modified Morrigan as a service, you must release your source code

The AGPLv3 was chosen specifically to prevent a proprietary fork from being run as a closed service. If you build something better with Morrigan's code, that improvement belongs to everyone.

---

## 👤 Author

**Paul Fleury** — [@paulfxyz](https://github.com/paulfxyz)

Internet entrepreneur based in Lisbon. General Partner at [Asymptote Ventures](https://linkedin.com/in/paulfxyz/).

Building open-source tools at the intersection of privacy, sovereignty, and human dignity.

→ [paulfleury.com](https://paulfleury.com) · [LinkedIn](https://linkedin.com/in/paulfxyz/) · [hollr.to/paulfxyz](https://hollr.to/paulfxyz)

---

## 🤖 Built with Perplexity Computer

The landing page, repository scaffolding, architecture documentation, and README were built with [Perplexity Computer](https://perplexity.ai) — an agentic AI that writes and ships production code, not just suggestions.

The initial landing page was generated, QA'd with Playwright screenshots, and deployed to production in a single session. The README was written from a structured brief and matches the quality standard set by [mang.sh](https://github.com/paulfxyz/mang) and [hollr](https://github.com/paulfxyz/hollr).

---

<div align="center">

**Morrigan is for everyone who has ever thought:**
*"What happens to everything I've built, if I'm suddenly gone?"*

[morrigan.life](https://morrigan.life) · [Donate](https://morrigan.life/donate) · [Star this repo](https://github.com/paulfxyz/morrigan)

*Made with purpose in Lisbon. 🇵🇹*

</div>
