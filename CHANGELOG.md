# Changelog

All notable changes to Morrigan will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).
This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [v1.0.0] — 2026-04-12 "Setrex Direction" — Full Multi-Page Site Launch

### Added
**Complete website redesign — Dark Cosmic system:**
- Full multi-page public site: index.html, features.html, security.html, donate.html
- Auth pages: login.html, signup.html (2-column split layout, vault unlock flow)
- Design system: near-black (#0a0a0a), electric lime (#c8f74f), Syne + DM Sans
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

## [Unreleased]

### Planned for v0.2.0
- Non-profit foundation registration
- Early Access waitlist and email capture
- Donation page integration
- Community Discord / Matrix server

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

[Unreleased]: https://github.com/paulfxyz/morrigan/compare/v0.1.0...HEAD
[v0.1.0]: https://github.com/paulfxyz/morrigan/releases/tag/v0.1.0
