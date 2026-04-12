/* ══════════════════════════════════════════════
   MORRIGAN — main.js
══════════════════════════════════════════════ */

(function () {
  'use strict';

  // ─── THEME TOGGLE ────────────────────────────
  const root = document.documentElement;
  const toggleBtn = document.querySelector('[data-theme-toggle]');

  // Default: dark
  const storedTheme = root.getAttribute('data-theme') || 'dark';
  root.setAttribute('data-theme', storedTheme);
  updateToggleIcon(storedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      updateToggleIcon(next);
      toggleBtn.setAttribute('aria-label', 'Switch to ' + (next === 'dark' ? 'light' : 'dark') + ' mode');
    });
  }

  function updateToggleIcon(theme) {
    if (!toggleBtn) return;
    if (theme === 'dark') {
      toggleBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
    } else {
      toggleBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
    }
  }


  // ─── SCROLLED HEADER ─────────────────────────
  const header = document.getElementById('site-header');
  let lastScroll = 0;

  function handleScroll() {
    const y = window.scrollY;
    if (y > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScroll = y;
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load


  // ─── MOBILE HAMBURGER ─────────────────────────
  const hamburger = document.getElementById('nav-hamburger');
  const mobileNav = document.getElementById('nav-mobile');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const expanded = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
      if (!expanded) {
        mobileNav.classList.add('open');
      } else {
        mobileNav.classList.remove('open');
      }
    });

    // Close on link click
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        mobileNav.classList.remove('open');
      });
    });
  }


  // ─── SMOOTH SCROLL FOR HASH LINKS ─────────────
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', function (e) {
      const id = this.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });


  // ─── RAVEN PARTICLE CANVAS ───────────────────
  // Subtle teal dots that drift upward across the hero background.
  (function initRavenCanvas() {
    const canvas = document.getElementById('raven-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const PARTICLE_COUNT = 22;
    const BASE_COLOR = 'rgba(58, 159, 170, ';

    function resize() {
      W = canvas.width = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function makeParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.5,       // radius 0.5–2.3
        speed: Math.random() * 0.35 + 0.1,   // drift speed upward
        drift: (Math.random() - 0.5) * 0.15, // gentle horizontal drift
        alpha: Math.random() * 0.25 + 0.05,  // max opacity 0.05–0.3
        phase: Math.random() * Math.PI * 2,  // for alpha pulse
        phaseSpeed: Math.random() * 0.008 + 0.003,
      };
    }

    function initParticles() {
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = makeParticle();
        p.y = Math.random() * H; // scatter vertically on init
        particles.push(p);
      }
    }

    function draw(ts) {
      ctx.clearRect(0, 0, W, H);

      particles.forEach(p => {
        // Pulse alpha
        const pulse = 0.5 + 0.5 * Math.sin(p.phase);
        const a = p.alpha * pulse;

        // Fade at top 15% and bottom 15%
        const topFade   = Math.min(1, p.y / (H * 0.15));
        const botFade   = Math.min(1, (H - p.y) / (H * 0.15));
        const edgeFade  = Math.min(topFade, botFade);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = BASE_COLOR + (a * edgeFade).toFixed(3) + ')';
        ctx.fill();

        // Move
        p.y  -= p.speed;
        p.x  += p.drift;
        p.phase += p.phaseSpeed;

        // Reset when it exits top
        if (p.y + p.r < 0) {
          p.y = H + p.r;
          p.x = Math.random() * W;
        }
        // Wrap horizontal edges
        if (p.x < -p.r) p.x = W + p.r;
        if (p.x > W + p.r) p.x = -p.r;
      });

      requestAnimationFrame(draw);
    }

    resize();
    initParticles();
    requestAnimationFrame(draw);

    // Resize handler — debounced
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        initParticles();
      }, 150);
    });
  }());


  // ─── TIMELINE STAGGER-REVEAL ────────────────
  // Slides timeline entries in from the left with staggered delay.
  (function initTimelineReveal() {
    const entries = document.querySelectorAll('[data-timeline]');
    if (!entries.length) return;

    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      entries.forEach(el => el.classList.add('tl-visible'));
      return;
    }

    const io = new IntersectionObserver((records) => {
      records.forEach(record => {
        if (record.isIntersecting) {
          record.target.classList.add('tl-visible');
          io.unobserve(record.target);
        }
      });
    }, { threshold: 0.25 });

    entries.forEach(el => io.observe(el));
  }());


  // ─── ENCRYPTION BADGE COUNTER ANIMATION ──────
  // When the encryption section enters viewport, animate the
  // data-count badges counting up to their target numbers.
  (function initBadgeCounters() {
    const badges = document.querySelectorAll('.crypto-card-badge[data-count]');
    if (!badges.length) return;

    if (!('IntersectionObserver' in window)) return;

    // Store original text and parsed numeric target for each badge
    badges.forEach(badge => {
      const original = badge.textContent.trim();
      const match = original.match(/^(\d+)(.*)/);
      if (!match) return;
      badge.dataset.target = match[1];
      badge.dataset.suffix = match[2] || '';
      badge.dataset.original = original;
      badge._counted = false;
    });

    function animateCounter(badge) {
      if (badge._counted) return;
      badge._counted = true;

      const target = parseInt(badge.dataset.target, 10);
      const suffix = badge.dataset.suffix || '';
      const duration = 900; // ms
      const startTime = performance.now();

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);
        badge.textContent = current + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver((records) => {
      records.forEach(record => {
        if (record.isIntersecting) {
          animateCounter(record.target);
          io.unobserve(record.target);
        }
      });
    }, { threshold: 0.5 });

    badges.forEach(badge => {
      if (badge.dataset.target) io.observe(badge);
    });
  }());

}());
