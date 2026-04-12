# Contributing to Morrigan

Thank you for your interest in contributing. Morrigan is a non-profit open-source project built around dignity, privacy, and technical excellence. Contributions of all kinds are welcome — code, documentation, translations, security research, design feedback.

---

## Before you start

- Read the [README](README.md) — especially the architecture overview and encryption deep-dive
- Read the [Code of Conduct](CODE_OF_CONDUCT.md)
- For security vulnerabilities, read [SECURITY.md](SECURITY.md) and **do not open a public issue**
- Check open issues and PRs before starting work on something new

---

## How to contribute

### Reporting bugs

Use the [Bug Report template](.github/ISSUE_TEMPLATE/bug_report.md). Include:
- What you expected to happen
- What actually happened
- Steps to reproduce (minimal, reliable)
- Environment (browser, OS, version)

### Suggesting features

Use the [Feature Request template](.github/ISSUE_TEMPLATE/feature_request.md). Explain the problem you're solving, not just the solution. We are opinionated about the product — if something conflicts with the zero-knowledge architecture, it will not be accepted regardless of implementation quality.

### Submitting code

1. **Fork** the repository
2. **Create a branch** from `main`: `git checkout -b feature/your-feature-name`
3. **Make your changes** — keep commits focused and atomic
4. **Write or update tests** if applicable
5. **Update documentation** if your change affects documented behavior
6. **Open a Pull Request** using the [PR template](.github/PULL_REQUEST_TEMPLATE.md)

### Priority contribution areas

| Area | What we need |
|---|---|
| **Cryptography review** | Independent audit of the encryption design in `docs/architecture/encryption.md`. Spot errors, edge cases, or improvements. |
| **Security research** | Pen test the landing page and, eventually, the application. Responsible disclosure via `security@morrigan.life`. |
| **Accessibility** | WCAG AA compliance audit of the landing page and future app UI. |
| **Translations** | 30+ languages — submit corrections or new language files. |
| **Frontend** | Landing page improvements, future app UI. Static HTML/CSS/JS, no framework. |
| **Backend (upcoming)** | Node.js / TypeScript API server design and implementation. |
| **Documentation** | Architecture docs, self-hosting guides, API reference. |

---

## Code style

- **JavaScript/TypeScript**: No framework preference mandated yet. Vanilla JS preferred for the landing page.
- **CSS**: CSS custom properties (variables) throughout. No preprocessors. Mobile-first.
- **Commits**: Present tense, imperative mood: "Add encryption key export" not "Added key export" or "Adding key export"
- **Branch names**: `feature/`, `fix/`, `docs/`, `security/` prefixes

---

## Cryptographic code

**We do not accept handrolled cryptographic implementations.** All crypto must:
- Use libsodium.js or an equivalently audited library
- Be reviewed by at least one additional maintainer before merge
- Include a reference to the standard or specification being implemented
- Have unit tests covering known test vectors

---

## Translations

Morrigan aims to support 30+ languages from day one. Translation contributions are especially valuable. A Crowdin project will be set up for the app strings — for now, open an issue to coordinate.

---

## Questions?

Open a [Discussion](https://github.com/paulfxyz/morrigan/discussions) on GitHub. We're a small team and respond as fast as we can.
