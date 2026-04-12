# Security Policy

## Reporting a Vulnerability

**Do not open a public GitHub issue for security vulnerabilities.**

Email `security@morrigan.life` with:
- A description of the vulnerability
- Steps to reproduce
- Your assessment of severity and impact
- Any suggested fix (optional but appreciated)

We will acknowledge your report within 72 hours and provide a timeline for resolution.

---

## Disclosure Timeline

| Timeline | Action |
|---|---|
| T+0 | Report received |
| T+72h | Acknowledgment sent, initial assessment |
| T+7d | Severity confirmed, fix timeline communicated |
| T+30d | Fix deployed (or extended timeline if complex) |
| T+45d | Public disclosure (coordinated with reporter) |

We believe in responsible disclosure and will credit researchers who report vulnerabilities, unless they prefer to remain anonymous.

---

## Supported Versions

| Version | Supported |
|---|---|
| 0.1.x | ✅ Active |

Morrigan is in early development. The current version is a landing page only — no server-side application or user data is processed yet. Security research on the eventual application is especially welcome.

---

## In-Scope

- The landing page at morrigan.life
- The future application at app.morrigan.life (once deployed)
- The API server (once deployed)
- The open-source repository and its configuration
- The encryption implementation (client-side)
- The dead man's switch mechanism

## Out-of-Scope

- Attacks requiring physical access to the user's device
- Social engineering attacks against Morrigan staff
- Denial of service attacks
- Issues in third-party dependencies (report upstream)
- Issues that require the user to have already lost their encryption key

---

## Cryptographic Design Principles

Morrigan's security model is based on the following non-negotiable principles:

1. **No backdoors** — there is no mechanism to decrypt user data without the user's key. Not for law enforcement. Not for court orders. Not for Morrigan staff.
2. **Zero-knowledge by construction** — the server architecture cannot be modified to log plaintext without a complete rewrite that would be visible in the open-source code.
3. **Auditable code** — the cryptographic implementation is in the public repository. Independent audit is encouraged and valued.
4. **No custom crypto** — all cryptographic primitives are from libsodium.js, an audited, widely-deployed library. We do not implement our own ciphers, KDFs, or MAC schemes.

---

## Bug Bounty

A bug bounty program will be established once the application is in public beta. Details will be announced here and on the morrigan.life blog.
