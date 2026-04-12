# Morrigan — Landing Page

Source for [morrigan.life](https://morrigan.life).

**Stack:** Pure HTML / CSS / JavaScript. No framework. No build step. No bundler. No dependencies.

## Structure

```
landing/
├── index.html          # Main landing page
├── style.css           # All styles (CSS custom properties, responsive)
├── main.js             # Theme toggle, scroll behavior, mobile nav
├── favicon.svg         # SVG favicon (raven-in-shield mark)
└── assets/
    ├── hero-bg.png     # Hero: Celtic standing stones + raven in teal mist
    └── encryption-visual.png  # Celtic knotwork cryptographic pattern
```

## Sections

| Section | ID | Description |
|---|---|---|
| Navigation | — | Sticky header, dark/light toggle, mobile hamburger |
| Hero | `#hero` | Full-bleed image, headline, CTAs, trust badges |
| Why | `#why` | Founder's personal narrative + mythological pull quote |
| The Stack | `#what` | Encryption architecture + four feature cards |
| How It Works | `#how` | Four-step process + dead man's switch explainer |
| Languages | `#languages` | 30+ language support grid |
| Donate | `#donate` | Non-profit foundation + funding model |
| Footer | — | Links, badges, domain references |

## Design

- **Palette:** Deep teal (`#0d1518`), muted gold (`#c9a64a`), primary teal (`#3a9faa`)
- **Typography:** Cormorant Garamond (display) + DM Sans (body) — via Google Fonts CDN
- **Dark mode:** Default. Light mode available via toggle or `prefers-color-scheme`.
- **Animations:** CSS scroll-driven (`animation-timeline: view()`), no JS libraries

## Hosting

Deployed to `morrigan.life` via FTP:
- Host: `es20.siteground.eu`
- Port: `21`

## Development

No build step required. Open `index.html` directly in a browser, or serve with any static file server:

```bash
# Python
python3 -m http.server 8080

# Node.js
npx serve .

# VS Code
# Live Server extension works perfectly
```
