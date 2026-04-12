/**
 * Morrigan — main.js
 * Ink & Linen design system — v0.3.0
 *
 * Sections:
 *   1. Scrolled header detection
 *   2. Mobile hamburger toggle
 *   3. Smooth scroll for hash links
 *   4. SVG .draw-path stroke animation (IntersectionObserver)
 *   5. .fade-in → .visible (IntersectionObserver)
 *   6. .stagger children stagger
 *   7. Hero canvas: floating particles (warm ink/terra dots)
 *   8. Crypto badge counter animation (data-count)
 */

'use strict';

/* ══════════════════════════════════════
   1. SCROLLED HEADER
══════════════════════════════════════ */
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > 24);
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // apply on load
})();


/* ══════════════════════════════════════
   2. MOBILE HAMBURGER TOGGLE
══════════════════════════════════════ */
(function initHamburger() {
  const btn   = document.getElementById('nav-hamburger');
  const menu  = document.getElementById('nav-mobile');
  if (!btn || !menu) return;

  function close() {
    btn.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-hidden', 'true');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      close();
    } else {
      btn.setAttribute('aria-expanded', 'true');
      menu.setAttribute('aria-hidden', 'false');
      menu.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close on any mobile link click
  menu.querySelectorAll('.nav-mobile-link, .btn').forEach(link => {
    link.addEventListener('click', close);
  });

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();


/* ══════════════════════════════════════
   3. SMOOTH SCROLL
══════════════════════════════════════ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (hash === '#') return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const headerH = document.getElementById('site-header')?.offsetHeight ?? 72;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
      // Update URL without jump
      history.pushState(null, '', hash);
    });
  });
})();


/* ══════════════════════════════════════
   4. SVG STROKE DRAW ANIMATION
   Targets elements with class .draw-path
   Animates stroke-dashoffset from total
   path length → 0 over ~1.4s ease-out
══════════════════════════════════════ */
(function initDrawPaths() {
  const DURATION = 1400; // ms
  const EASING   = t => 1 - Math.pow(1 - t, 3); // ease-out-cubic

  function animatePath(path, delay = 0) {
    const length = path.getTotalLength?.() ?? 1000;
    path.style.strokeDasharray  = length;
    path.style.strokeDashoffset = length;
    path.style.transition       = 'none';
    path.style.willChange       = 'stroke-dashoffset';

    let start = null;
    function step(timestamp) {
      if (!start) start = timestamp + delay;
      if (timestamp < start) { requestAnimationFrame(step); return; }
      const elapsed  = timestamp - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = EASING(progress);
      path.style.strokeDashoffset = length * (1 - eased);
      if (progress < 1) requestAnimationFrame(step);
      else path.style.strokeDashoffset = 0;
    }
    requestAnimationFrame(step);
  }

  // Group paths by parent SVG element
  const drawEls = document.querySelectorAll('.draw-path');
  if (!drawEls.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const paths = entry.target.querySelectorAll('.draw-path');
      paths.forEach((p, i) => animatePath(p, i * 120));
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  // Observe the nearest SVG or section parent that wraps the paths
  const observed = new Set();
  drawEls.forEach(p => {
    const svg = p.closest('svg') ?? p.closest('.hero-illo') ?? p.parentElement;
    if (svg && !observed.has(svg)) {
      observed.add(svg);
      obs.observe(svg);
    }
  });
})();


/* ══════════════════════════════════════
   5. FADE-IN REVEAL
   .fade-in gets .visible when it enters
   the viewport (threshold 0.12)
══════════════════════════════════════ */
(function initFadeIn() {
  const fadeEls = document.querySelectorAll('.fade-in');
  if (!fadeEls.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

  fadeEls.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════
   6. STAGGER CHILDREN REVEAL
   Parent with .stagger: children receive
   .visible with nth-child-based delays
══════════════════════════════════════ */
(function initStagger() {
  const staggerEls = document.querySelectorAll('.stagger');
  if (!staggerEls.length) return;

  const BASE_DELAY = 80; // ms between children

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const children = Array.from(entry.target.children);
      children.forEach((child, i) => {
        setTimeout(() => {
          child.classList.add('visible');
        }, i * BASE_DELAY);
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -24px 0px' });

  staggerEls.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════
   7. HERO CANVAS — FLOATING PARTICLES
   Warm ink + terracotta micro-dots that
   drift slowly across the linen hero bg.
   Very subtle — opacity 0.12–0.22.
══════════════════════════════════════ */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx    = canvas.getContext('2d');
  let W, H, particles = [], raf;

  const COLORS = ['#C4785A', '#1A1714', '#A8A09A'];
  const COUNT  = 42;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    // Re-position particles proportionally
    particles.forEach(p => {
      p.x = p.xRatio * W;
      p.y = p.yRatio * H;
    });
  }

  function createParticle() {
    const xRatio = Math.random();
    const yRatio = Math.random();
    return {
      xRatio,
      yRatio,
      x     : xRatio * W,
      y     : yRatio * H,
      r     : 1.2 + Math.random() * 2.8,
      color : COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha : 0.06 + Math.random() * 0.14,
      vx    : (Math.random() - 0.5) * 0.18,
      vy    : (Math.random() - 0.5) * 0.14,
      // Gentle sinusoidal drift
      phase : Math.random() * Math.PI * 2,
      speed : 0.003 + Math.random() * 0.004,
    };
  }

  function init() {
    particles = Array.from({ length: COUNT }, createParticle);
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    const now = performance.now() * 0.001;

    particles.forEach(p => {
      // Sinusoidal drift on top of base velocity
      p.x += p.vx + Math.sin(now * p.speed * 5 + p.phase) * 0.12;
      p.y += p.vy + Math.cos(now * p.speed * 4 + p.phase) * 0.08;

      // Update ratios for resize
      p.xRatio = p.x / W;
      p.yRatio = p.y / H;

      // Wrap edges
      if (p.x < -10) p.x = W + 10;
      if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10;
      if (p.y > H + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    raf = requestAnimationFrame(tick);
  }

  // Visibility API — pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); }
    else                 { raf = requestAnimationFrame(tick); }
  });

  // Reduced-motion: skip if user prefers
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return;

  resize();
  init();
  tick();

  const resizeObs = new ResizeObserver(() => resize());
  resizeObs.observe(canvas);
})();


/* ══════════════════════════════════════
   8. CRYPTO BADGE COUNTER ANIMATION
   Elements with data-count="N" animate
   from 0 → N when entering viewport.
══════════════════════════════════════ */
(function initCounters() {
  const DURATION = 1600;

  function easeOutExpo(t) {
    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
  }

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10);
    if (isNaN(target)) return;
    const suffix = el.getAttribute('data-suffix') ?? '';
    let start = null;

    function step(ts) {
      if (!start) start = ts;
      const elapsed  = ts - start;
      const progress = Math.min(elapsed / DURATION, 1);
      const eased    = easeOutExpo(progress);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-count]');
  if (!counterEls.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counterEls.forEach(el => obs.observe(el));
})();


/* ══════════════════════════════════════
   9. YEAR MARKER ENTRANCE
   .year-marker elements slide in with
   a slight translateY on scroll reveal.
   (Handled by CSS .fade-in + .visible;
   this adds a small extra nudge delay
   per year-marker for narrative feel.)
══════════════════════════════════════ */
(function initYearMarkers() {
  const markers = document.querySelectorAll('.year-marker');
  if (!markers.length) return;

  markers.forEach((marker, i) => {
    marker.style.transitionDelay = `${i * 60}ms`;
  });
})();


/* ══════════════════════════════════════
   10. ACCORDION — security.html
   Handles <details> open/close with
   smooth height animation.
══════════════════════════════════════ */
(function initAccordion() {
  const details = document.querySelectorAll('details.accordion-item');
  if (!details.length) return;

  details.forEach(detail => {
    const summary = detail.querySelector('summary');
    const body    = detail.querySelector('.accordion-body');
    if (!summary || !body) return;

    // Allow CSS transitions by animating max-height
    body.style.overflow = 'hidden';
    body.style.maxHeight = detail.open ? body.scrollHeight + 'px' : '0';

    summary.addEventListener('click', e => {
      e.preventDefault();
      if (detail.open) {
        body.style.maxHeight = body.scrollHeight + 'px';
        requestAnimationFrame(() => {
          body.style.transition = 'max-height 0.3s ease';
          body.style.maxHeight  = '0';
          setTimeout(() => { detail.open = false; }, 310);
        });
      } else {
        detail.open = true;
        body.style.maxHeight = '0';
        requestAnimationFrame(() => {
          body.style.transition = 'max-height 0.35s ease';
          body.style.maxHeight  = body.scrollHeight + 'px';
        });
        // Close other open details (accordion behaviour)
        details.forEach(other => {
          if (other !== detail && other.open) {
            const ob = other.querySelector('.accordion-body');
            if (ob) {
              ob.style.transition = 'max-height 0.3s ease';
              ob.style.maxHeight  = '0';
              setTimeout(() => { other.open = false; }, 310);
            }
          }
        });
      }
    });
  });
})();


/* ══════════════════════════════════════
   11. BLOCKCHAIN ANCHOR — SECTION
   Animate the chain-link SVG when the
   blockchain anchoring section enters
   the viewport (ink section).
══════════════════════════════════════ */
(function initChainSection() {
  const section = document.getElementById('blockchain');
  if (!section) return;

  const chainPaths = section.querySelectorAll('.chain-link-path');

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        chainPaths.forEach((p, i) => {
          setTimeout(() => p.classList.add('chain-drawn'), i * 200);
        });
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  obs.observe(section);
})();
