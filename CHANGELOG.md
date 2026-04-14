# Changelog

All notable changes to Morrígan will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v2.3.32] — 2026-04-14 — Domain Migration: morrigan.life → morrigan.org

### Changed

**Domain:**
- Primary domain moved from `morrigan.life` to `morrigan.org`
- All 80 occurrences of `morrigan.life` replaced with `morrigan.org` across 60 files
- `morrigan.one` references in docs also consolidated to `morrigan.org`
- `data-wf-domain` attribute updated in all HTML files
- New FTP target: `esm34.siteground.biz` / `ftp@morrigan.org` / `morrigan.org/public_html/`

**Documentation:**
- README.md: domain updated, version badge bumped to v2.3.32
- CHANGELOG.md: domain updated throughout
- CONTRIBUTING.md, SECURITY.md, CODE_OF_CONDUCT.md: all email addresses updated to `@morrigan.org`
- INSTALL.md: FTP instructions updated to new host + credentials
- ROADMAP.md: domain references updated

**Git:**
- Commit `8f30789` — 41 files changed

---

## [v2.3.31] — 2026-04-14 — security.html: Spacing Overhaul + Badge Chips

### Changed

**security.html — comprehensive layout overhaul:**
- Section outer padding: `60px 0 80px` → `100px 0 120px` (more breathing room)
- Max-width container: `840px` → `900px`
- `.mig-reveal` bottom margins: `56px` → `88px`
- H2 headlines: `clamp(24px,3vw,36px)` → `clamp(28px,3.5vw,42px)`, letter-spacing `−0.8px` → `−1px`
- Body paragraphs: `16px / 1.8` → `17px / 1.9`, margin-bottom `32px` → `40px`
- ZK cards: min-width `240px` → `280px`, padding `28px` → `36px 32px`, border-radius `12px` → `14px`
- ZK card label: uppercase + tracked (`letter-spacing: 0.8px`)
- ZK card value: `20px / 600` → `24px / 700`, letter-spacing `−0.3px`
- ZK card description: `14px / 1.5` → `15px / 1.6`
- Store/never-store cards: grid gap `20px` → `24px`, padding `28px` → `36px 32px`
- CTA card: `48px 40px` → `64px 48px`

### Added

**Cryptography stack** — plain dot-separated text replaced with icon+badge chips:
- `Argon2id` · `AES-256-GCM` · `Ed25519` · `TLS 1.3` · `WebAuthn` · `TOTP / RFC 6238` · `Cloudflare` · `AWS`

**AI community stack** — plain text replaced with icon+badge chips:
- `OpenAI` · `Anthropic` · `Google DeepMind` · `Mistral AI` · `Harvard` · `MIT` · `Oxford`

**Infrastructure & identity partners** — plain text replaced with icon+badge chips:
- `Cloudflare` · `AWS` · `Hetzner` · `OVHcloud` · `Persona` · `Twilio` · `YubiKey` · `WebAuthn`

**Git:**
- Commit `16ea7ce` — 1 file changed, 67 insertions, 35 deletions

---

## [v2.3.30] — 2026-04-14 — Spacing Audit + Per-Folder Encryption Content

### Added

**how-it-works.html:**
- New "Per-folder encryption" content block inserted between "Secured from signup" badges and Step 2
- 3 folder cards: Medical Records, Letters to Family, Passwords & Accounts
- 4-column principle grid: Independent master keys · Choose your cipher & protocol · Granular access per folder · No shared secrets across folders

**beyond.html:**
- Per-folder encryption subsection added to Enhanced Cryptography section
- Full-width block with border-top separator, before `</section>`
- Same 3 folder cards + 4-column principle grid as how-it-works.html

### Fixed

**Spacing audit — all three pages:**
- `beyond.html`: nav animation restored (inline style fixed), section-to-section gaps corrected
- `security.html`: base spacing pass (padding bump prior to v2.3.31 full overhaul)
- `how-it-works.html`: section margin/padding normalisation pass

**Git:**
- Commit `bb02cdd` — beyond.html (201,731 bytes), security.html (91,410 bytes), how-it-works.html (89,590 bytes)

---

## [v2.3.29] — 2026-04-13 — Nav Animation Fix (beyond.html / webflow.chunk2.js)

### Fixed

- Webflow IX2 event `e-37` removed from `webflow.chunk2.js` — was causing navbar on `beyond.html` (and other non-home pages) to slide in then immediately slide back out on page load
- `beyond.html` inline navbar style corrected: was `opacity:0; transform:translateY(-20px)` — now removed so the nav animates correctly into view
- Nav + logo hover/scroll effects now applied consistently on all pages (beyond, security, how-it-works, donate) — previously only active on index.html and about.html

**Git:**
- Commit `ef3e41e`

---

## [v2.1.0] — 2026-04-12 — Homepage Cleanup, Membership Model + SVG Illustrations

### Added

**Homepage rewrites (index.html):**
- `intro` section → "Why Morrígan exists" with 4-stat grid (100% client-side, 0 plaintext, 50GB storage, AGPLv3)
- `capabilities` section → 6-card feature grid with inline SVG illustrations (vault lock, timer, network globe, key, shield, link chain)
- `integration-v1` section → open-source code block showing XChaCha20 + Argon2id stack
- `testimonial` section → honest early-user quotes (no fake star ratings)
- `pricing-v2` section → membership preview cards (Personal $5/mo, Corporate from $100/mo, One-time)
- `faq` section → 5 Morrígan-specific Q&A pairs (free tier, shutdown resilience, self-hosting, passphrase loss, dead man's switch)
- `blog-v2` section → proper Morrígan blog titles

**Homepage removals:**
- `brands` section — removed (irrelevant logos)
- `investor` section — removed (not applicable)

**donate.html — complete rewrite:**
- Hero with mission statement and CTA
- 4-pillar membership value section: Hosted Storage, Lifetime Access, Community Vote, Events + Discord
- 3 membership tier cards: Personal ($5/mo), Corporate ($100–$1,000/mo), One-time (GitHub Sponsors)
- Governance section: every member = exactly 1 vote (personal, corporate, staff, founder — no exceptions)
- Budget breakdown: 60% infrastructure / 30% development / 10% community
- `/membership` URL alias added to `.htaccess`

**SVG illustrations injected:**
- `security.html` — ZK proof flow diagram + timer/dead-man's-switch SVG
- `how-it-works.html` — 5 step SVGs (shield, lock, clock, users, checkmark)

**Nav + footer:**
- "Pricing" → "Donate" across all 18 active pages (desktop + mobile nav)
- Footer standardised across all 18 pages: 3 columns (Product, Company, Legal), consistent copyright, "Built with ❤️ + AI"

**README.md — major update:**
- New "Brand & Design System" section: logo mark description (four-leaf clover geometry, SVG code), full colour token table, typography specs, design principles
- New "Membership & Governance" section: tier table, 1-vote rule explained, budget allocation
- Updated roadmap table to reflect actual released versions (v1.7.0, v2.0.0, v2.1.0)
- Repository structure updated with all 18 active pages listed
- Version badge updated to v2.1.0

### Changed

- FAQ answer boilerplate (Setrex placeholder text) removed from all answers
- Nav link href `/pricing` → `/pricing` kept (URL unchanged), label updated to "Donate" everywhere

---

## [v2.0.1] — 2026-04-12 — Nav Overflow Hotfix

### Fixed
- Nav compact CSS injected into all pages via `<head>` — 7-item nav was clipping labels at ≤1280px viewports
- Reduced nav padding, font-size, and gap to prevent overflow without breaking design system

---

## [v2.0.0] — 2026-04-12 — Full Morrígan Content Rebuild

### Added
- **5 new pages:** `security.html`, `donate.html`, `login.html`, `signup.html`, `how-it-works.html`
- Full Morrígan nav: Home · How it Works · Security · Features · Pricing · Blog · About + Login + Get Started
- Full Morrígan footer: 3 columns (Product, Company, Legal) + proper copyright
- Morrígan-branded copy on ALL 18 active pages — no more Setrex/fintech/placeholder text

### Changed
- Homepage hero: "Secure your digital legacy — forever."
- All pages: meta titles, OG tags, descriptions updated to Morrígan context
- Blog posts rewritten: digital legacy, dead man's switch, zero-knowledge encryption
- Pricing tiers: Personal £0 / Guardian £5/mo / Legacy £12/mo
- `.htaccess`: redirects old career/integration routes → about/features

### Removed (backed up to `/backup/`)
- `home-02.html`, `career.html`, `career-detail.html`, `integration*.html` — no longer needed

---

## [v1.7.0] — 2026-04-12 — Full Greyscale

### Changed
- **CSS:** `--colors--yellow` (accent) → `#FFFFFF` (white); all blue tints → neutral greys
- **91 SVG assets:** all `#4169E1` blue fills/strokes replaced with white/grey
- **Lottie JSON animation:** all colour arrays desaturated to luminance-equivalent grey
- **53 AVIF images + 56 WebP images:** fully desaturated via ffmpeg `hue=s=0` and ImageMagick
- **Utility pages:** badges, borders, links all converted to greyscale palette

---

## [v1.6.0] — 2026-04-12 — Utility Pages + Full 404 Resolution

### Added
- Three utility pages from scratch: `/utility-pages/style-guide`, `/utility-pages/changelog`, `/utility-pages/license`
- All pages fully branded with Morrígan logo, nav, accents, and footer

### Fixed
- All missing `.htaccess` rewrite rules: blog slugs, career paths, integration paths
- Resolved all internal 404s — every link across all pages returns 200

---

## [v1.5.0] — 2026-04-12 — Clover Logo, Morrígan Accent + 404 Fixes

### Changed
- **Logo mark:** Four-leaf clover (trèfle à quatre feuilles) — white on black square — replaces raven wings in all pages nav/footer
- **Favicon/app icon:** White clover on black square (32×32 PNG + 180×180 apple-touch-icon + 512×512)
- **Brand name:** "Morrigan" → "Morrígan" (Irish fada accent) in all page titles, meta tags, headings, and visible text
- **`.htaccess`:** Added missing clean URL rules for integration and career detail pages

---

## [v1.4.0] — 2026-04-12 — Full Blue Rebrand: Logo, Favicon + All Assets

### Changed
- Morrigan logo: new inline SVG mark (raven wings + crown dot) replaces Setrex logo
- Favicon + apple-touch-icon: AI-generated Morrígan brand mark (royal blue + white wings)
- Lottie animations: `lottie1.json` green (#cffe25) → royal blue (#4169E1)
- SVG assets (48 files): all icon, logo, cursor, shape SVGs fully recoloured
- Browser mockup images (8 files): green dots pixel-replaced with royal blue
- Meta tags: all Setrex-branded descriptions replaced with Morrígan copy
- `data-wf-domain`: changed from `setrex-saas-template.webflow.io` → `morrigan.org`

---

## [v1.3.1] — 2026-04-12 — Royal Blue CSS Hotfix

### Changed
- Deployed CSS with #4169E1 to FTP (verified via curl)

---

## [v1.3.0] — 2026-04-12 — Royal Blue Design System + Full 22-Page Clone

### Changed
- **Brand color:** Setrex lime green (`#cffe25`) → royal blue (`#4169E1`)
- **Footer:** "Developed by Arini Studio" / "Powered by Webflow" → "Built with ❤️ + AI" / "Morrigan.life"
- **README badges:** Updated to royal blue, bumped version to v1.3.0

### Added
- 8 new pages: 404, 401, career-detail, integration-detail-1/2, integration-frameflow/dataflow/blazelo
- All CDN2 blog/integration assets self-hosted with proper srcset variants
- `.htaccess` clean URL rewrites + `ErrorDocument 404/401`

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
- `README.md` — architecture diagram, cryptographic stack deep-dive, 3-channel identity, tech decisions, roadmap, vibe coding attribution
- `ROADMAP.md` — created from scratch: correct versioning, all milestones documented
- `INSTALL.md` — thorough rewrite: local dev setup, design system token reference, deploy guide
- `CHANGELOG.md` — this entry

**Code Audit:**
- `main.js` rewritten with comprehensive technical comments (465 → 621 lines)
- Every one of 12 features documented with purpose, HTML/CSS contract, rationale

---

## [v1.0.0] — 2026-04-12 — Full Multi-Page Site Launch

### Added
- Complete website redesign — Dark Cosmic system
- Full multi-page public site: index, features, security, donate
- Auth pages: login, signup (2-column split layout, vault unlock flow)
- Design system: near-black (rgb(1,1,4)), electric lime (rgb(207,254,37)), BDO Grotesk
- Canvas starfield, tab switchers, accordion FAQ, scroll reveals, count-up stats
- Password strength meter on signup (4-level)
- Scroll-aware sticky header with backdrop blur
- Mobile hamburger nav with body scroll lock

---

## [v0.1.0] — 2026-04-12 — Initial Public Release

### Added
- Full production landing page for [morrigan.org](https://morrigan.org)
- Dark/light mode toggle with system preference detection
- Hero section with full-bleed atmospheric image (Celtic standing stones, raven silhouette)
- Responsive layout (mobile-first, collapses at 768px)
- Custom SVG logo (raven-in-shield mark) + favicon

**Repository scaffolding:**
- README.md, CHANGELOG.md, CONTRIBUTING.md, SECURITY.md, LICENSE (AGPLv3), CODE_OF_CONDUCT.md
- GitHub issue templates (bug report, feature request, security)
- GitHub PR template + Actions workflow (placeholder — CI/CD ready)
- `docs/architecture/` — encryption and key management design documents

---

## Version Policy

Morrígan uses [Semantic Versioning](https://semver.org/):

| Type | Meaning | Example |
|---|---|---|
| Major (X.0.0) | Breaking API or data format change | 1.0.0 → 2.0.0 |
| Minor (0.X.0) | New feature, backward compatible | 0.1.0 → 0.2.0 |
| Patch (0.0.X) | Bug fix, security patch | 0.1.0 → 0.1.1 |

---

[v2.1.0]: https://github.com/paulfxyz/morrigan/compare/v2.0.1...v2.1.0
[v2.0.1]: https://github.com/paulfxyz/morrigan/compare/v2.0.0...v2.0.1
[v2.0.0]: https://github.com/paulfxyz/morrigan/compare/v1.7.0...v2.0.0
[v1.7.0]: https://github.com/paulfxyz/morrigan/compare/v1.6.0...v1.7.0
[v1.6.0]: https://github.com/paulfxyz/morrigan/compare/v1.5.0...v1.6.0
[v1.5.0]: https://github.com/paulfxyz/morrigan/compare/v1.4.0...v1.5.0
[v1.4.0]: https://github.com/paulfxyz/morrigan/compare/v1.3.1...v1.4.0
[v1.3.1]: https://github.com/paulfxyz/morrigan/compare/v1.3.0...v1.3.1
[v1.3.0]: https://github.com/paulfxyz/morrigan/compare/v1.1.0...v1.3.0
[v1.1.0]: https://github.com/paulfxyz/morrigan/compare/v1.0.0...v1.1.0
[v1.0.0]: https://github.com/paulfxyz/morrigan/compare/v0.1.0...v1.0.0
[v0.1.0]: https://github.com/paulfxyz/morrigan/releases/tag/v0.1.0
