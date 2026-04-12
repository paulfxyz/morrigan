# Morrigan — Installation Guide

This guide covers local development setup, production deployment, and environment configuration for the Morrigan landing site.

> **Note:** Morrigan's vault application (the actual encrypted legacy platform) is not yet publicly deployed as a backend service. This guide covers the public-facing landing site (`landing/`) which is a static HTML/CSS/JS site with no server-side processing.

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18+ | Local development server (optional) |
| [Git](https://git-scm.com/) | 2.x | Version control |
| [lftp](https://lftp.yar.ru/) | 4.x | FTP deployment (Linux/macOS) |
| [gh CLI](https://cli.github.com/) | 2.x | GitHub releases (optional) |

You do not need Node.js to view the site locally — any static file server will do. Node.js is listed because `npx serve` is the most convenient zero-install option.

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/paulfxyz/morrigan.git
cd morrigan
```

### 2. Serve the landing site

The landing site is in `landing/`. It is pure HTML/CSS/JS with no build step.

**Option A — npx serve (recommended, no install)**

```bash
cd landing
npx serve .
# Listening on http://localhost:3000
```

**Option B — Python (if Python is available)**

```bash
cd landing
python3 -m http.server 8080
# Listening on http://localhost:8080
```

**Option C — VS Code Live Server**

Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension and click "Go Live" in the status bar.

### 3. Open in browser

Navigate to the URL shown by your server. All navigation links are relative (`href="features.html"`) and work correctly from any local server.

---

## File Structure

```
morrigan/
└── landing/
    ├── index.html          # Homepage
    ├── features.html       # Features, tab switcher, roadmap timeline
    ├── security.html       # Crypto stack, 3-channel identity, blockchain anchoring
    ├── donate.html         # Donation tiers, fund allocation, founder note
    ├── login.html          # Vault sign-in (split layout)
    ├── signup.html         # Account creation (password strength meter)
    ├── style.css           # Complete design system — Setrex tokens
    ├── main.js             # Site-wide JS (12 features, 621 lines)
    └── favicon.svg         # SVG raven-in-shield mark
```

All pages reference `style.css` and `main.js` from the same directory. There are no subdirectory paths, CDN bundles, or framework dependencies beyond the BDO Grotesk font loaded from `fonts.cdnfonts.com`.

---

## Design System

The site uses the **Setrex** design system tokens, reverse-engineered from the [Setrex SaaS template](https://setrex-saas-template.webflow.io/):

```css
/* Typography */
font-family: 'BDO Grotesk', 'Inter', Arial, sans-serif;
/* Loaded from: https://fonts.cdnfonts.com/css/bdo-grotesk */

/* Scale */
H1: 62px, weight 500, letter-spacing -0.06em, line-height 1.05
H2: 52px, weight 500, letter-spacing -0.06em
H3: 42px, weight 500, letter-spacing -0.06em
Body: 16px, weight 400, color rgba(210,210,210,0.70)

/* Colors */
Background: rgb(1,1,4)        /* near-black — NOT #0a0a0a */
Cards:      rgb(13,13,16)     /* card surface */
Lime:       rgb(207,254,37)   /* accent — NOT #c8f74f */
Lime text:  rgb(1,1,4)        /* text on lime backgrounds */

/* Components */
Cards: border-radius 24px, border 1px rgba(255,255,255,0.08)
Buttons: border-radius 100px
Nav pill: background white, color dark (for "Get Started")
```

If you are editing `style.css`, use these exact values. Off-by-one colour substitutions (e.g. `#0a0a0a` instead of `rgb(1,1,4)`) produce a noticeably different visual — the Setrex theme depends on the near-black subtlety.

---

## JavaScript Overview

`main.js` (621 lines) powers all pages with 12 self-contained features, each an IIFE:

1. **Canvas Starfield** — `<canvas id="stars">` in hero sections
2. **Scroll-Aware Header** — `.scrolled` class on `.site-header`
3. **Hamburger Menu** — `.hamburger`/`.nav-hamburger` + `.nav-mobile`
4. **Count-Up Animation** — `[data-count]` attributes
5. **Tab Switcher** — `.tabs-container` with `[data-tab]` / `[data-panel]`
6. **Accordion** — `.accordion` → `.accordion-item` → `.accordion-trigger`
7. **Scroll Reveal** — `.reveal` → `.revealed` via IntersectionObserver
8. **Infinite Marquee** — `.marquee-track` pause-on-hover
9. **Password Strength** — `input#passphrase` + `.strength-segment`
10. **Password Toggle** — `.password-toggle` inside `.password-wrapper`
11. **Smooth Scroll** — `a[href^="#"]` with header offset
12. **Active Nav Link** — pathname match → `.active` on nav links

No framework. No build step. No bundler. Audit by reading the file.

---

## FTP Deployment

The production site is hosted on SiteGround at `morrigan.life`.

> **Important:** Use individual `put` commands in lftp — `mirror` has been observed to silently fail or skip files.

### Deploy all files

```bash
lftp -c "
set ftp:ssl-allow no;
set net:timeout 60;
open ftp://es20.siteground.eu:21;
user 'ftp@morrigan.life' 'PASSWORD_HERE';
cd morrigan.life/public_html/;
put /path/to/morrigan/landing/index.html;
put /path/to/morrigan/landing/style.css;
put /path/to/morrigan/landing/main.js;
put /path/to/morrigan/landing/features.html;
put /path/to/morrigan/landing/security.html;
put /path/to/morrigan/landing/donate.html;
put /path/to/morrigan/landing/login.html;
put /path/to/morrigan/landing/signup.html;
put /path/to/morrigan/landing/favicon.svg;
quit
"
```

### Verify deployment

After deploying, check:
1. [https://morrigan.life](https://morrigan.life) — homepage loads
2. [https://morrigan.life/features.html](https://morrigan.life/features.html) — features page
3. [https://morrigan.life/security.html](https://morrigan.life/security.html) — security page
4. Star canvas visible in hero, BDO Grotesk font loaded, lime (#207,254,37) accent visible

---

## GitHub Release Process

Morrigan uses GitHub releases with semantic version tags.

### Create a new release

```bash
# 1. Stage and commit all changes
git add -A
git commit -m "v1.x.x — Release title"

# 2. Push to main
git push origin main

# 3. Create annotated tag
git tag -a v1.x.x -m "Release notes"
git push origin v1.x.x

# 4. Create GitHub release (requires gh CLI)
gh release create v1.x.x \
  --title "v1.x.x — Release Title" \
  --notes "Release notes here" \
  --repo paulfxyz/morrigan
```

### Verify the push

After `git push`, confirm with `git log --oneline -5` that the commit appears and the remote tracking branch is ahead of the expected state. Do not claim a push is live without verifying the command completed successfully.

---

## Environment Variables

The landing site has no environment variables — it is a static site with no server-side code.

For the future vault application backend (planned for v1.2.0+), the following variables will be required:

```env
# Database
DATABASE_URL=postgres://...

# TOTP (v1.1.0+)
TOTP_ISSUER=Morrigan
TOTP_WINDOW=1          # Accepted time windows either side of current (default 1)

# Email OTP
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
OTP_FROM=noreply@morrigan.life
OTP_EXPIRY_MINUTES=10

# SMS OTP
SMS_PROVIDER=           # e.g. twilio, vonage
SMS_API_KEY=
SMS_FROM=

# OpenTimestamps
OTS_SERVER=https://a.pool.opentimestamps.org

# Application
NODE_ENV=production
APP_URL=https://morrigan.life
SESSION_SECRET=         # 64+ random bytes
```

This list will be formalised when the backend is open-sourced.

---

## Development Tips

### Editing a page

1. Open the relevant `.html` file in your editor
2. The page is self-contained HTML — all styles come from `style.css`, all JS from `main.js`
3. Inline `<style>` blocks in individual pages handle page-specific layout (e.g., security.html's `.arch-grid`)
4. Refresh your local server URL to see changes

### Adding a new page

1. Copy an existing page as a template (e.g., copy `donate.html`)
2. Update `<title>`, `<meta>` tags, and `<meta property="og:url">`
3. Update the `class="active"` nav link to match the new page
4. Add the new file to the FTP deploy command
5. Add a link in the nav of all other pages

### Modifying the design system

All design tokens are CSS custom properties in the `:root` block at the top of `style.css`. To change a colour or spacing value:

1. Update the custom property in `:root`
2. Do not hardcode values elsewhere — always reference the variable
3. Test across all pages (some have inline styles that reference variables)

### Debugging JavaScript

Each feature in `main.js` is an IIFE that exits silently if its required DOM nodes are absent. If a feature isn't working:
1. Check that the required class/id/attribute is present in the HTML
2. Open browser DevTools console — no errors should appear on any page
3. The feature number in the file comment matches the section name for easy location

---

## Accessibility Notes

- All interactive elements have visible focus styles (`:focus-visible`)
- Images use descriptive `alt` text
- ARIA labels on icon buttons and the hamburger menu
- Heading hierarchy is maintained (`h1` → `h2` → `h3`) on every page
- Colour contrast meets WCAG AA for body text against the dark background

---

## Browser Support

| Browser | Version | Notes |
|---|---|---|
| Chrome | 108+ | Full support including CSS scroll-driven animations |
| Firefox | 115+ | Full support |
| Safari | 16.4+ | Full support (CSS scroll animations require 16.4+) |
| Edge | 108+ | Full support (Chromium-based) |
| Mobile Safari | 16.4+ | Full support |
| Chrome Android | 108+ | Full support |

CSS scroll-driven animations (`animation-timeline: view()`) are used for `.reveal` elements, protected by `@supports`. Browsers that don't support it fall back to always-visible elements.
