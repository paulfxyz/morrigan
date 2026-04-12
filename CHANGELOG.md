# Changelog

All notable changes to Morrigan will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.1.0] — 2026-04-12 — 3-Channel Identity + Documentation Overhaul

### Added

**3-Channel Identity System:**
- TOTP 2FA authenticator added as a third optional identity channel (RFC 6238 compliant)
- 2-of-3 confirmation policy: any two of email OTP, phone SMS, or TOTP must confirm sensitive actions
- Open-source authenticator app compatibility: Aegis, Raivo, Bitwarden, Google Authenticator
- Channel overview cards on security.html (Email OTP, Phone SMS, TOTP 2FA)
- Updated action confirmation table: 3 channels shown, "2/3" policy indicators

**Documentation (new/rewritten):**
- `README.md` — extended to 481 lines: architecture diagram, cryptographic stack deep-dive (XChaCha20 vs AES, Argon2id vs bcrypt/scrypt), 3-channel identity system, tech decisions, repository structure, roadmap, vibe coding attribution
- `ROADMAP.md` — created from scratch: correct versioning (v1.0.0 → v2.0.0), all milestones documented with acceptance criteria
- `INSTALL.md` — thorough rewrite: local dev setup, design system token reference, JS feature index, FTP deploy guide (individual `put` commands), GitHub release process, environment variables, accessibility notes, browser support table
- `CHANGELOG.md` — this entry; correct design tokens throughout (replaces erroneous Syne/c8f74f references from v1.0.0 entry)

**Code Audit:**
- `main.js` rewritten with comprehensive technical comments (465 → 621 lines)
- Every one of 12 features documented with: purpose, HTML contract, CSS contract, implementation rationale, performance notes
- Argon2id note added to password strength meter (contextualises the UX heuristic vs. actual security)
- Hamburger selector broadened to support `.hamburger`, `.nav-hamburger`, `#hamburger`
- Active nav selector broadened to include `.nav-links a` for page-specific nav markup
- Password strength meter level 4 colour corrected: `rgb(207, 254, 37)` (was `#c8f74f`)

**Landing page content updates:**
- `security.html` — identity section replaced: "Two channels. Zero shortcuts." → "Three channels. Two required."
- `security.html` — auth roadmap corrected: v0.5.0/v0.6.0 (wrong) → v1.1.0/v1.3.0/v2.0.0 (correct)
- `features.html` — roadmap corrected: v0.5.0/v0.6.0/v0.7.0/v0.8.0/v1.0-Stable → v1.1.0/v1.2.0/v1.3.0/v1.4.0/v1.5.0/v2.0.0
- `features.html` — v1.1.0 added as a current milestone with 3-channel and docs content
- `index.html` — "Dual-Channel Auth" feature card renamed to "3-Channel Identity"
- `index.html` — all dual-channel copy updated to 3-channel (2-of-3) language
- `README.md` — "Built with Perplexity Computer" section replaced with "Built with ❤️ + AI" vibe coding explanation

### Design System
Design tokens are unchanged from v1.0.0 (Setrex pixel-perfect):
- Font: `'BDO Grotesk', 'Inter', Arial, sans-serif` — loaded from `fonts.cdnfonts.com/css/bdo-grotesk`
- Background: `rgb(1,1,4)` — near-black (not `#0a0a0a`)
- Cards: `rgb(13,13,16)` — card surface with `border-radius: 24px`
- Lime accent: `rgb(207,254,37)` — electric lime (not `#c8f74f`)
- H1: 62px, weight 500, letter-spacing -0.06em

---

## [v1.0.0] — 2026-04-12 — Full Multi-Page Site Launch (Setrex Direction)

### Added
**Complete website redesign — Dark Cosmic system:**
- Full multi-page public site: index.html, features.html, security.html, donate.html
- Auth pages: login.html, signup.html (2-column split layout, vault unlock flow)
- Design system: near-black (rgb(1,1,4)), electric lime (rgb(207,254,37)), BDO Grotesk
- Canvas starfield particle animation across all hero sections
- Interactive tab switchers (features/homepage), accordion FAQ, scroll reveals
- Infinite CSS marquee (encryption standards strip)
- Count-up stat animations via IntersectionObserver
- Password strength meter on signup (4-level, lime at max strength)
- Scroll-aware sticky header with backdrop blur
- Mobile hamburger nav with body scroll lock

**Content additions:**
- Features page: comparison table, roadmap timeline, post-quantum section
- Security page: full cryptographic stack deep-dive, dual-channel identity table, blockchain anchoring 4-step flow
- Donate page: tier cards, fund allocation, founder note (Damascus/father story)
- Login/signup: dual-channel identity enforced in UI copy

**GitHub:**
- Version badge updated to v1.0.0
- Status badge updated to stable

---

## [v0.1.0] — 2026-04-12

### Added — Initial public release

**Landing page (`landing/`):**
- Full production landing page for [morrigan.life](https://morrigan.life)
- Dark/light mode toggle with system preference detection
- Hero section with full-bleed atmospheric image (Celtic standing stones, raven silhouette)
- "Why Morrigan" section — founder's personal narrative with mythological pull quote
- "The Stack" section — encryption architecture visual, four feature cards
- "How It Works" section — four-step process + dead man's switch flow explainer
- "30+ Languages" section — language tag grid
- Donate / Foundation section — funding model and non-profit structure
- Footer with navigation, open-source badge, and domain links
- Responsive layout (mobile-first, collapses at 768px)
- Sticky header with scroll-aware blur + shadow
- CSS scroll-driven animations (opacity fade-in, no layout shift)
- Custom SVG logo (raven-in-shield mark) + favicon

**Brand identity:**
- Color palette: deep teal (#0d1518), charcoal, muted gold (#c9a64a), primary teal (#3a9faa)
- Typography: Cormorant Garamond (display) + DM Sans (body)
- Hero image: AI-generated atmospheric standing stones in teal mist with raven
- Encryption visual: AI-generated Celtic knotwork cryptographic pattern

**Repository scaffolding:**
- Comprehensive README.md with full architecture documentation
- CHANGELOG.md (this file)
- CONTRIBUTING.md with contribution guidelines
- SECURITY.md with responsible disclosure policy
- LICENSE (AGPLv3)
- CODE_OF_CONDUCT.md
- GitHub issue templates (bug report, feature request, security)
- GitHub PR template
- GitHub Actions workflow (placeholder — CI/CD ready)
- `docs/architecture/` — encryption and key management design documents
- `docs/api/` — future API reference placeholder
- `.gitignore`

---

## Version Policy

Morrigan uses [Semantic Versioning](https://semver.org/):

| Type | Meaning | Example |
|---|---|---|
| Major (X.0.0) | Breaking API or data format change | 1.0.0 → 2.0.0 |
| Minor (0.X.0) | New feature, backward compatible | 0.1.0 → 0.2.0 |
| Patch (0.0.X) | Bug fix, security patch | 0.1.0 → 0.1.1 |

Until v1.0.0, the API is unstable and minor versions may include breaking changes. This will be clearly noted in the changelog.

---

[v1.1.0]: https://github.com/paulfxyz/morrigan/compare/v1.0.0...v1.1.0
[v1.0.0]: https://github.com/paulfxyz/morrigan/compare/v0.1.0...v1.0.0
[v0.1.0]: https://github.com/paulfxyz/morrigan/releases/tag/v0.1.0
