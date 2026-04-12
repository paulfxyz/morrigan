/**
 * main.js — Morrigan Website
 * Powers all pages. Elements are accessed with optional chaining so
 * missing DOM nodes on any given page cause no errors.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     1. CANVAS STARFIELD
     Target: <canvas id="stars"> inside the hero section
  ================================================================ */
  (function initStarfield() {
    const canvas = document.getElementById('stars');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let animFrame;

    function randomBetween(min, max) {
      return Math.random() * (max - min) + min;
    }

    function createStar(w, h) {
      return {
        x:       Math.random() * w,
        y:       Math.random() * h,
        radius:  randomBetween(0.5, 1.5),
        opacity: randomBetween(0.3, 0.9),
        dx:      randomBetween(-0.05, 0.05),
        dy:      randomBetween(-0.05, 0.05),
      };
    }

    function resize() {
      const parent = canvas.parentElement;
      canvas.width  = parent ? parent.offsetWidth  : window.innerWidth;
      canvas.height = parent ? parent.offsetHeight : window.innerHeight;
      stars = Array.from({ length: 180 }, () => createStar(canvas.width, canvas.height));
    }

    function draw() {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const star of stars) {
        // Move
        star.x += star.dx;
        star.y += star.dy;

        // Wrap-around
        if (star.x < 0)       star.x = width;
        if (star.x > width)   star.x = 0;
        if (star.y < 0)       star.y = height;
        if (star.y > height)  star.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    }

    resize();
    draw();

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animFrame);
      resize();
      draw();
    });
  })();


  /* ================================================================
     2. SCROLL-AWARE HEADER
     Adds "scrolled" class after 20px of scroll
  ================================================================ */
  (function initScrollHeader() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    function onScroll() {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once in case page loads already scrolled
  })();


  /* ================================================================
     3. HAMBURGER MENU
     Targets: .hamburger, .nav-mobile
     Also handles body scroll lock (feature 13)
  ================================================================ */
  (function initHamburger() {
    const hamburger = document.querySelector('.hamburger');
    const navMobile = document.querySelector('.nav-mobile');
    if (!hamburger || !navMobile) return;

    function openMenu() {
      hamburger.classList.add('open');
      navMobile.classList.add('open');
      hamburger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden'; // feature 13
    }

    function closeMenu() {
      hamburger.classList.remove('open');
      navMobile.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.contains('open');
      isOpen ? closeMenu() : openMenu();
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (
        navMobile.classList.contains('open') &&
        !navMobile.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        closeMenu();
      }
    });

    // Close when a nav link inside mobile menu is clicked
    navMobile.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });
  })();


  /* ================================================================
     4. COUNT-UP ANIMATION
     Targets: [data-count] elements
  ================================================================ */
  (function initCountUp() {
    const DURATION = 1200; // ms

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function animateCount(el) {
      const raw    = el.getAttribute('data-count');
      // Extract numeric part (e.g. "100%" → 100, suffix "%")
      const match  = raw.match(/^(\d+\.?\d*)(.*)$/);
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
          observer.unobserve(entry.target); // run only once
        }
      });
    }, { threshold: 0.5 });

    targets.forEach((el) => observer.observe(el));
  })();


  /* ================================================================
     5. TAB SWITCHER
     Targets: .tabs-container > .tabs-nav [data-tab] + .tab-panel [data-panel]
     Multiple independent groups supported
  ================================================================ */
  (function initTabs() {
    const tabGroups = document.querySelectorAll('.tabs-container');
    if (!tabGroups.length) return;

    tabGroups.forEach((container) => {
      const buttons = container.querySelectorAll('.tabs-nav [data-tab]');
      const panels  = container.querySelectorAll('.tab-panel[data-panel]');

      function activateTab(tabId) {
        buttons.forEach((btn) => {
          btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        panels.forEach((panel) => {
          panel.classList.toggle('active', panel.getAttribute('data-panel') === tabId);
        });
      }

      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          activateTab(btn.getAttribute('data-tab'));
        });
      });

      // Activate first tab by default if none is active
      const firstActive = container.querySelector('.tabs-nav [data-tab].active');
      if (!firstActive && buttons.length) {
        activateTab(buttons[0].getAttribute('data-tab'));
      }
    });
  })();


  /* ================================================================
     6. ACCORDION
     Targets: .accordion > .accordion-item > .accordion-trigger + .accordion-body
     Only one open per .accordion group; skip if using native <details>
  ================================================================ */
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

          // Close all items in this group
          items.forEach((i) => i.classList.remove('open'));

          // Toggle clicked item
          if (!isOpen) item.classList.add('open');
        });
      });
    });
  })();


  /* ================================================================
     7. SCROLL REVEAL
     Targets: .reveal elements
     Staggered delay for siblings inside same parent
  ================================================================ */
  (function initScrollReveal() {
    const revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    // Pre-compute stagger delays based on sibling index within same parent
    const parentIndexMap = new Map();

    revealEls.forEach((el) => {
      const parent = el.parentElement;
      if (!parentIndexMap.has(parent)) {
        parentIndexMap.set(parent, []);
      }
      parentIndexMap.get(parent).push(el);
    });

    parentIndexMap.forEach((siblings) => {
      siblings.forEach((el, i) => {
        el.dataset.revealDelay = i * 80; // 80ms stagger
      });
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el    = entry.target;
          const delay = parseInt(el.dataset.revealDelay || '0', 10);
          setTimeout(() => el.classList.add('revealed'), delay);
          observer.unobserve(el); // only once
        }
      });
    }, { threshold: 0.15 });

    revealEls.forEach((el) => observer.observe(el));
  })();


  /* ================================================================
     8. INFINITE MARQUEE
     Targets: .marquee-track
     CSS animation drives movement; JS only handles pause-on-hover
  ================================================================ */
  (function initMarquee() {
    const tracks = document.querySelectorAll('.marquee-track');
    if (!tracks.length) return;

    tracks.forEach((track) => {
      track.addEventListener('mouseenter', () => track.classList.add('paused'));
      track.addEventListener('mouseleave', () => track.classList.remove('paused'));
    });
  })();


  /* ================================================================
     9. PASSWORD STRENGTH METER
     Target: input[type="password"]#passphrase (signup page)
  ================================================================ */
  (function initPasswordStrength() {
    const input    = document.querySelector('input[type="password"]#passphrase');
    const segments = document.querySelectorAll('.strength-segment');
    const label    = document.querySelector('.strength-label');
    if (!input || !segments.length) return;

    const LEVELS = [
      { color: '#e05252', text: 'Too short' },  // 1 segment
      { color: '#f5a623', text: 'Weak'      },  // 2 segments
      { color: '#f5d623', text: 'Good'      },  // 3 segments
      { color: '#c8f74f', text: 'Strong'    },  // 4 segments
    ];

    function getStrength(value) {
      const len        = value.length;
      const hasUpper   = /[A-Z]/.test(value);
      const hasLower   = /[a-z]/.test(value);
      const hasNum     = /[0-9]/.test(value);
      const hasSymbol  = /[^A-Za-z0-9]/.test(value);
      const mixedCase  = hasUpper && hasLower;

      if (len < 8)  return 1;
      if (len < 12) return 2;
      if (len < 16 && (mixedCase || hasNum)) return 3;
      if (len >= 16 && mixedCase && hasNum && hasSymbol) return 4;
      if (len >= 12 && (mixedCase || hasNum)) return 3;
      return 2;
    }

    input.addEventListener('input', () => {
      const strength = input.value.length === 0 ? 0 : getStrength(input.value);
      const levelCfg = LEVELS[strength - 1];

      segments.forEach((seg, i) => {
        if (i < strength) {
          seg.classList.add('active');
          seg.style.background = levelCfg.color;
        } else {
          seg.classList.remove('active');
          seg.style.background = '';
        }
      });

      if (label) {
        label.textContent = strength > 0 ? levelCfg.text : '';
      }
    });
  })();


  /* ================================================================
     10. PASSWORD TOGGLE (show/hide)
     Targets: .password-toggle buttons
  ================================================================ */
  (function initPasswordToggle() {
    const toggleBtns = document.querySelectorAll('.password-toggle');
    if (!toggleBtns.length) return;

    // Unicode eye icons (fallback if no SVG swap is used)
    const EYE_OPEN   = '👁';
    const EYE_CLOSED = '🙈';

    toggleBtns.forEach((btn) => {
      // Find the associated password input (sibling or in same wrapper)
      const wrapper = btn.closest('.password-wrapper, .input-wrapper, .field');
      const input   = wrapper
        ? wrapper.querySelector('input[type="password"], input[type="text"]')
        : btn.previousElementSibling;

      if (!input) return;

      btn.addEventListener('click', () => {
        const isPassword = input.type === 'password';
        input.type       = isPassword ? 'text' : 'password';

        // Swap icon — prefer swapping SVG class/content if present
        const svgUse = btn.querySelector('use');
        if (svgUse) {
          const current = svgUse.getAttribute('href') || svgUse.getAttribute('xlink:href') || '';
          // Expect icon IDs like "#icon-eye" and "#icon-eye-off"
          const next = current.includes('eye-off') ? current.replace('eye-off', 'eye')
                                                    : current.replace('eye', 'eye-off');
          svgUse.setAttribute('href', next);
          if (svgUse.hasAttribute('xlink:href')) svgUse.setAttribute('xlink:href', next);
        } else {
          btn.textContent = isPassword ? EYE_CLOSED : EYE_OPEN;
        }

        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
      });
    });
  })();


  /* ================================================================
     11. SMOOTH SCROLL
     All anchor links with href="#..." — offset for sticky header
  ================================================================ */
  (function initSmoothScroll() {
    const HEADER_OFFSET = 64;

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


  /* ================================================================
     12. ACTIVE NAV LINK
     Highlights the current page's nav link based on pathname
  ================================================================ */
  (function initActiveNav() {
    const path     = window.location.pathname;
    const filename = path.split('/').pop() || 'index.html';

    document.querySelectorAll('.site-nav a, .nav-mobile a').forEach((link) => {
      const href = link.getAttribute('href') || '';
      // Match if the href filename appears in current path
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
