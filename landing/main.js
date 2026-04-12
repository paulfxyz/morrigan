/**
 * main.js — Morrigan Website
 * ─────────────────────────────────────────────────────────────────────────────
 * Single JS file that powers all pages (index, features, security, donate,
 * login, signup). Each feature is an IIFE so it can fail silently if its
 * required DOM nodes are absent on any given page — no page-specific guards
 * needed at the top level.
 *
 * Feature index:
 *   1. Canvas Starfield          — animated particle background in hero sections
 *   2. Scroll-Aware Header       — adds "scrolled" class for backdrop blur
 *   3. Hamburger Menu            — mobile nav overlay + body scroll-lock
 *   4. Count-Up Animation        — [data-count] elements animated on scroll entry
 *   5. Tab Switcher              — .tabs-container multi-group support
 *   6. Accordion                 — single-open per group, CSS height transition
 *   7. Scroll Reveal             — .reveal elements fade in on IntersectionObserver
 *   8. Infinite Marquee          — CSS-driven, JS only handles pause-on-hover
 *   9. Password Strength Meter   — 4-level strength bar on signup
 *  10. Password Toggle           — show/hide passphrase input
 *  11. Smooth Scroll             — anchor links with sticky-header offset
 *  12. Active Nav Link           — highlights current page link by pathname
 *
 * Design system tokens (for reference — defined in style.css):
 *   Background:   rgb(1,1,4)
 *   Lime accent:  rgb(207,254,37)
 *   Cards:        rgb(13,13,16)  border-radius 24px
 *   Font:         'BDO Grotesk', 'Inter', Arial, sans-serif
 *
 * Identity model (v1.1.0):
 *   3-channel authentication — Email OTP · Phone SMS · TOTP 2FA
 *   At least 2-of-3 channels must confirm for any sensitive action.
 *
 * @author  Paul Fleury <hello@paulfleury.com>
 * @license AGPLv3
 * @version 1.1.0
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════════════════════════════════
     1. CANVAS STARFIELD
     ────────────────────────────────────────────────────────────────────────
     Renders a slow-drifting field of white particles on <canvas id="stars">.
     The canvas lives inside the hero section and is sized to match its parent,
     not the full viewport — this prevents scroll flicker and allows the hero
     to be any height.

     Performance notes:
     • 180 stars is enough to feel dense without taxing low-end devices.
     • Velocity is ±0.05px/frame — imperceptible as movement but prevents a
       completely static look.
     • requestAnimationFrame is used correctly: the animFrame handle is stored
       so the loop can be cancelled before a resize, preventing accumulation
       of concurrent RAF loops.
     • The canvas is purely cosmetic; no accessibility action required.
  ════════════════════════════════════════════════════════════════════════ */
  (function initStarfield() {
    const canvas = document.getElementById('stars');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let animFrame;

    /** Returns a random float in [min, max). */
    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    /** Creates a single star object positioned randomly within w×h. */
    function createStar(w, h) {
      return {
        x:       Math.random() * w,
        y:       Math.random() * h,
        radius:  randomBetween(0.5, 1.5),   // px — subtle size variation
        opacity: randomBetween(0.3, 0.9),   // avoid fully-opaque or invisible
        dx:      randomBetween(-0.05, 0.05), // horizontal drift speed
        dy:      randomBetween(-0.05, 0.05), // vertical drift speed
      };
    }

    /** Matches canvas dimensions to its parent and regenerates the star field. */
    function resize() {
      const parent = canvas.parentElement;
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      stars = Array.from({ length: 180 }, () => createStar(canvas.width, canvas.height));
    }

    /** Single animation frame: move all stars and wrap at edges. */
    function draw() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        star.x += star.dx;
        star.y += star.dy;

        // Wrap-around: stars that leave one edge reappear at the opposite edge
        if (star.x < 0)      star.x = width;
        if (star.x > width)  star.x = 0;
        if (star.y < 0)      star.y = height;
        if (star.y > height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();

    // On resize: cancel the current loop before re-initialising to avoid
    // multiple concurrent RAF loops accumulating over time.
    window.addEventListener('resize', () => {
      cancelAnimationFrame(animFrame);
      resize();
      draw();
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     2. SCROLL-AWARE HEADER
     ────────────────────────────────────────────────────────────────────────
     Adds the "scrolled" class to .site-header once the user has scrolled
     more than 20px. style.css uses this class to apply backdrop-filter blur
     and a subtle border-bottom, signalling visual separation from page content.

     The { passive: true } flag tells the browser this listener never calls
     preventDefault(), allowing scroll events to be handled on the compositor
     thread without waiting for JS — essential for smooth 60fps scrolling.
  ════════════════════════════════════════════════════════════════════════ */
  (function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run immediately in case page loaded mid-scroll
  })();


  /* ════════════════════════════════════════════════════════════════════════
     3. HAMBURGER MENU
     ────────────────────────────────────────────────────────────────────────
     Controls the mobile navigation overlay (.nav-mobile) toggled by the
     .hamburger / #hamburger button.

     Accessibility:
     • aria-expanded is kept in sync with menu state.
     • Escape key closes the menu (keyboard user UX requirement).
     • Outside clicks close the menu (touch / click-outside UX convention).
     • All nav links inside the overlay close the menu on click (prevents
       the menu appearing open on the next page if the browser reuses state).

     Body scroll-lock (overflow: hidden) is applied while the menu is open
     to prevent the user from accidentally scrolling the background page
     through the translucent overlay on iOS Safari.
  ════════════════════════════════════════════════════════════════════════ */
  (function initHamburger() {
    // Support both id="hamburger" (old) and class=".nav-hamburger" (new)
    const hamburger = document.querySelector('.hamburger, .nav-hamburger, #hamburger');
    const navMobile = document.querySelector('.nav-mobile, #nav-mobile');
    if (!hamburger || !navMobile) return;

    function openMenu() {
      hamburger.classList.add('open');
      navMobile.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // scroll-lock
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('open') ? closeMenu() : openMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close when clicking outside both the menu and the hamburger button
    document.addEventListener('click', (e) => {
      if (
        navMobile.classList.contains('open') &&
        !navMobile.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close when a link inside the mobile menu is tapped/clicked
    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     4. COUNT-UP ANIMATION
     ────────────────────────────────────────────────────────────────────────
     Animates numeric stat elements when they scroll into view.

     Usage: add data-count="100%" (or any number + optional suffix) to any
     element. The animation fires once per page load via IntersectionObserver
     (observer.unobserve ensures it doesn't repeat on scroll back).

     Easing: easeOutCubic — fast start, gentle deceleration — matches the
     Setrex design system's preferred ease-out curve (cubic-bezier(0.16,1,0.3,1)).
     Duration: 1200ms is long enough to be legible on large numbers without
     feeling sluggish.
  ════════════════════════════════════════════════════════════════════════ */
  (function initCountUp() {
    const DURATION = 1200; // ms

    /** ease-out cubic: t ∈ [0,1] → mapped value ∈ [0,1] */
    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    /**
     * Animates one element from 0 to its data-count value.
     * Supports any numeric prefix followed by an arbitrary suffix string,
     * e.g. "256" → "256", "100%" → "100%", "3.5x" → "3.5x"
     */
    function animateCount(el) {
      const raw   = el.getAttribute('data-count');
      const match = raw.match(/^(\d+\.?\d*)(.*)$/);
      if (!match) return;

      const target = parseFloat(match[1]);
      const suffix = match[2] || '';
      const start  = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        const value    = Math.round(easeOutCubic(progress) * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }

      requestAnimationFrame(step);
    }

    const targets = document.querySelectorAll('[data-count]');
    if (!targets.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target); // play once only
        }
      });
    }, { threshold: 0.5 }); // wait until element is half visible

    targets.forEach((el) => observer.observe(el));
  })();


  /* ════════════════════════════════════════════════════════════════════════
     5. TAB SWITCHER
     ────────────────────────────────────────────────────────────────────────
     Supports multiple independent tab groups on the same page.

     HTML contract:
       .tabs-container
         .tabs-nav
           button[data-tab="panel-id"]    ← tab trigger
         .tab-panel[data-panel="panel-id"] ← tab content

     Style contract (in style.css):
       .tab-panel { display: none; }
       .tab-panel.active { display: block; }
       .tabs-nav [data-tab].active { /* active tab styles */ }

     The first tab in each group is activated by default if none is marked
     active in the HTML.
  ════════════════════════════════════════════════════════════════════════ */
  (function initTabs() {
    const tabGroups = document.querySelectorAll('.tabs-container');
    if (!tabGroups.length) return;

    tabGroups.forEach((container) => {
      const buttons = container.querySelectorAll('.tabs-nav [data-tab]');
      const panels  = container.querySelectorAll('.tab-panel[data-panel]');

      function activateTab(tabId) {
        buttons.forEach((btn) =>
          btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId)
        );
        panels.forEach((panel) =>
          panel.classList.toggle('active', panel.getAttribute('data-panel') === tabId)
        );
      }

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => activateTab(btn.getAttribute('data-tab')));
      });

      // Default: first tab if none pre-selected in HTML
      const firstActive = container.querySelector('.tabs-nav [data-tab].active');
      if (!firstActive && buttons.length) {
        activateTab(buttons[0].getAttribute('data-tab'));
      }
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     6. ACCORDION
     ────────────────────────────────────────────────────────────────────────
     Single-open accordion. Clicking an open item closes it (toggle).
     Clicking a different item closes the current one and opens the new one.

     HTML contract:
       .accordion
         .accordion-item
           button.accordion-trigger    ← the clickable header
           .accordion-body             ← the collapsible content

     The height transition is handled in CSS using max-height on .accordion-item.open
     .accordion-body. JS only toggles the .open class.

     Why not <details>? The native element lacks cross-browser animation support
     and requires CSS :has() for single-open behaviour. This JS approach gives
     full control with minimal overhead.
  ════════════════════════════════════════════════════════════════════════ */
  (function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    if (!accordions.length) return;

    accordions.forEach((group) => {
      const items = group.querySelectorAll('.accordion-item');

      items.forEach((item) => {
        const trigger = item.querySelector('.accordion-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('open');

          // Close all siblings in this group
          items.forEach((i) => i.classList.remove('open'));

          // Toggle the clicked item (open if it was closed, stay closed if it was open)
          if (!isOpen) item.classList.add('open');
        });
      });
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     7. SCROLL REVEAL
     ────────────────────────────────────────────────────────────────────────
     Fades in elements with the .reveal class as they enter the viewport.
     Elements in the same parent container are staggered (80ms per sibling)
     to create a cascading entrance effect.

     Important: we only animate opacity (not transform: translateY) to
     prevent Cumulative Layout Shift (CLS). The element holds its final
     layout space from the first paint — only its visibility changes.

     style.css contract:
       .reveal        { opacity: 0; transition: opacity 0.6s ... }
       .reveal.revealed { opacity: 1; }
  ════════════════════════════════════════════════════════════════════════ */
  (function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    // Pre-compute stagger delays: siblings within the same parent get
    // progressively longer delays (index × 80ms).
    const parentIndexMap = new Map();

    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!parentIndexMap.has(parent)) parentIndexMap.set(parent, []);
      parentIndexMap.get(parent).push(el);
    });

    parentIndexMap.forEach((siblings) => {
      siblings.forEach((el, i) => {
        el.dataset.revealDelay = i * 80; // ms
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el); // trigger only once per page load
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }); // trigger when 5% visible

    revealEls.forEach((el) => observer.observe(el));

    // Fallback: reveal any still-hidden elements after 1.2s
    // (catches above-fold elements in environments where IntersectionObserver
    // fires asynchronously or with a delay on first page load)
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => {
        el.classList.add('revealed');
      });
    }, 1200);
  })();


  /* ════════════════════════════════════════════════════════════════════════
     8. INFINITE MARQUEE
     ────────────────────────────────────────────────────────────────────────
     The marquee scroll animation is driven entirely by a CSS @keyframes
     translateX animation on .marquee-track. JS only adds the "paused"
     class on hover to pause the animation — it does not re-implement
     the scroll logic in JS.

     To add pause-on-hover support, style.css must include:
       .marquee-track.paused { animation-play-state: paused; }
  ════════════════════════════════════════════════════════════════════════ */
  (function initMarquee() {
    const tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;

    tracks.forEach((track) => {
      track.addEventListener('mouseenter', () => track.classList.add('paused'));
      track.addEventListener('mouseleave', () => track.classList.remove('paused'));
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     9. PASSWORD STRENGTH METER
     ────────────────────────────────────────────────────────────────────────
     4-level strength bar on the signup page (input#passphrase).

     Strength levels (mapped to 4 visual segments):
       1 — Too short (< 8 chars)
       2 — Weak      (< 12 chars)
       3 — Good      (< 16 chars OR lacks variety)
       4 — Strong    (≥ 16 chars, mixed case, digits, symbols)

     Colors progress from red → orange → yellow → lime (rgb(207,254,37)).
     Using the exact Setrex lime at level 4 matches the design system.

     Note: This is a UX heuristic meter, not a cryptographic strength
     estimator. Morrigan actually uses Argon2id for key derivation, which
     provides memory-hard brute-force resistance regardless of this meter.
  ════════════════════════════════════════════════════════════════════════ */
  (function initPasswordStrength() {
    const input    = document.querySelector('input[type="password"]#passphrase');
    const segments = document.querySelectorAll('.strength-segment');
    const label    = document.querySelector('.strength-label');
    if (!input || !segments.length) return;

    // Level configs: color matches design system progression → pale blue at max
    const LEVELS = [
      { color: '#e05252',             text: 'Too short' }, // level 1 — red
      { color: '#f5a623',             text: 'Weak'      }, // level 2 — orange
      { color: '#f5d623',             text: 'Good'      }, // level 3 — yellow
      { color: '#a8d8f0',             text: 'Strong'    }, // level 4 — Morrigan pale blue
    ];

    /**
     * Returns strength level 1–4 based on length and character variety.
     * Higher levels require progressively more character diversity.
     */
    function getStrength(value) {
      const len       = value.length;
      const hasUpper  = /[A-Z]/.test(value);
      const hasLower  = /[a-z]/.test(value);
      const hasNum    = /[0-9]/.test(value);
      const hasSymbol = /[^A-Za-z0-9]/.test(value);
      const mixed     = hasUpper && hasLower;

      if (len < 8)  return 1;
      if (len < 12) return 2;
      if (len >= 16 && mixed && hasNum && hasSymbol) return 4;
      if (len >= 12 && (mixed || hasNum)) return 3;
      return 2;
    }

    input.addEventListener('input', () => {
      const strength = input.value.length === 0 ? 0 : getStrength(input.value);
      const cfg      = LEVELS[strength - 1];

      segments.forEach((seg, i) => {
        if (i < strength) {
          seg.classList.add('active');
          seg.style.background = cfg.color;
        } else {
          seg.classList.remove('active');
          seg.style.background = '';
        }
      });

      if (label) {
        label.textContent = strength > 0 ? cfg.text : '';
      }
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     10. PASSWORD TOGGLE (show/hide)
     ────────────────────────────────────────────────────────────────────────
     Toggles input[type] between "password" and "text" for any
     .password-toggle button. Supports SVG icon swap via <use href="...">
     with IDs #icon-eye and #icon-eye-off, or falls back to emoji.

     The button must be inside a common wrapper with the input:
       .password-wrapper > input[type="password"] + button.password-toggle
  ════════════════════════════════════════════════════════════════════════ */
  (function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.password-toggle');
    if (!toggleBtns.length) return;

    toggleBtns.forEach((btn) => {
      const wrapper = btn.closest('.password-wrapper, .input-wrapper, .field');
      const input   = wrapper
        ? wrapper.querySelector('input[type="password"], input[type="text"]')
        : btn.previousElementSibling;

      if (!input) return;

      btn.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';

        // Swap SVG icon if present (expects #icon-eye / #icon-eye-off IDs)
        const svgUse = btn.querySelector('use');
        if (svgUse) {
          const current = svgUse.getAttribute('href') || svgUse.getAttribute('xlink:href') || '';
          const next    = current.includes('eye-off')
            ? current.replace('eye-off', 'eye')
            : current.replace('eye', 'eye-off');
          svgUse.setAttribute('href', next);
          if (svgUse.hasAttribute('xlink:href')) svgUse.setAttribute('xlink:href', next);
        } else {
          // Fallback: plain text icons
          btn.textContent = isPassword ? '🙈' : '👁';
        }

        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     11. SMOOTH SCROLL
     ────────────────────────────────────────────────────────────────────────
     Intercepts all internal anchor links (href="#...") and scrolls to the
     target with a HEADER_OFFSET to account for the sticky header height.
     Without this offset, the sticky header would overlap the section heading.

     We use window.scrollTo({ behavior: 'smooth' }) which is well-supported
     and respects prefers-reduced-motion in Chrome 108+ (scrolls instantly
     if the user has requested reduced motion at the OS level).
  ════════════════════════════════════════════════════════════════════════ */
  (function initSmoothScroll() {
    const HEADER_OFFSET = 64; // px — matches .site-header height in style.css

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const id     = anchor.getAttribute('href').slice(1);
        if (!id) return;
        const target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  })();


  /* ════════════════════════════════════════════════════════════════════════
     12. ACTIVE NAV LINK
     ────────────────────────────────────────────────────────────────────────
     Adds the "active" class to the nav link whose href matches the current
     page filename. Works for both the desktop (.site-nav) and mobile
     (.nav-mobile) navigation menus.

     Edge cases:
     • Root path "/" is treated as "index.html"
     • Partial matches (e.g. "security" in "security.html") are supported
       for link hrefs that omit the .html extension
  ════════════════════════════════════════════════════════════════════════ */
  (function initActiveNav() {
    const path     = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.site-nav a, .nav-links a, .nav-mobile a').forEach((link) => {
      const href     = link.getAttribute('href') || '';
      const linkFile = href.split('/').pop();
      if (!linkFile) return;

      if (
        filename === linkFile ||
        (filename === '' && linkFile === 'index.html') ||
        (linkFile !== 'index.html' && filename.includes(linkFile.replace('.html', '')))
      ) {
        link.classList.add('active');
      }
    });
  })();

}); // end DOMContentLoaded
