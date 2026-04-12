/* ══════════════════════════════════════════════
   MORRIGAN — main.js
══════════════════════════════════════════════ */

(function () {
  'use strict';


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
  // Subtle faint-teal dots that drift upward across the hero background.
  (function initRavenCanvas() {
    const canvas = document.getElementById('raven-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let W, H, particles;
    const PARTICLE_COUNT = 22;
    const BASE_COLOR = 'rgba(27, 122, 130, '; // muted deep teal — very faint

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
        alpha: Math.random() * 0.12 + 0.02,  // max opacity 0.02–0.14 — very faint
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


  // ─── SCROLL-TRIGGERED FADE-IN ─────────────────
  // Triggers .fade-in → .fade-in.visible on scroll.
  (function initFadeIns() {
    const els = document.querySelectorAll('.fade-in');
    if (!els.length) return;

    if (!('IntersectionObserver' in window)) {
      els.forEach(el => el.classList.add('visible'));
      return;
    }

    const io = new IntersectionObserver((records) => {
      records.forEach(record => {
        if (record.isIntersecting) {
          record.target.classList.add('visible');
          io.unobserve(record.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(el => io.observe(el));
  }());


  // ─── YEAR MARKER ENTRANCE ANIMATION ──────────
  // Stagger-animates the editorial year markers on scroll into view.
  (function initYearMarkers() {
    const markers = document.querySelectorAll('.year-marker');
    if (!markers.length) return;

    // Set initial state
    markers.forEach((marker, i) => {
      marker.style.opacity = '0';
      marker.style.transform = 'translateY(24px)';
      marker.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      marker.style.transitionDelay = (i * 0.12) + 's';
    });

    if (!('IntersectionObserver' in window)) {
      markers.forEach(m => {
        m.style.opacity = '1';
        m.style.transform = 'none';
      });
      return;
    }

    const io = new IntersectionObserver((records) => {
      records.forEach(record => {
        if (record.isIntersecting) {
          record.target.style.opacity = '1';
          record.target.style.transform = 'translateY(0)';
          io.unobserve(record.target);
        }
      });
    }, { threshold: 0.2 });

    markers.forEach(marker => io.observe(marker));
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


  // ─── FUND BAR ANIMATION ───────────────────────
  // Triggers fund-bar-fill animations when they scroll into view.
  (function initFundBars() {
    const fills = document.querySelectorAll('.fund-bar-fill');
    if (!fills.length) return;
    if (!('IntersectionObserver' in window)) return;

    // Hide bars initially, reveal on intersect
    fills.forEach(fill => {
      fill.style.animationPlayState = 'paused';
    });

    const io = new IntersectionObserver((records) => {
      records.forEach(record => {
        if (record.isIntersecting) {
          record.target.style.animationPlayState = 'running';
          io.unobserve(record.target);
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(fill => io.observe(fill));
  }());


  // ─── CRYPTO ADDRESS COPY ──────────────────────
  // Click any .crypto-address to copy the address text to clipboard.
  (function initCryptoCopy() {
    document.querySelectorAll('.crypto-address').forEach(row => {
      row.addEventListener('click', () => {
        const textEl = row.querySelector('.crypto-address-text');
        if (!textEl) return;
        const text = textEl.textContent.trim();
        // Don't copy placeholder text
        if (text.startsWith('[')) return;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(() => {
            const icon = row.querySelector('.crypto-copy-icon');
            if (icon) {
              icon.style.color = 'var(--color-teal)';
              setTimeout(() => { icon.style.color = ''; }, 1200);
            }
          }).catch(() => {});
        }
      });
    });
  }());

}());
