/* ============================================================
   Seresafari Africa — MAIN JAVASCRIPT
   ============================================================ */

/* ── CURSOR ─────────────────────────────────────────────── */
(function initCursor() {
  const dot = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  let mx = 0, my = 0, rx = 0, ry = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * .12; ry += (my - ry) * .12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
  const hoverEls = 'a,button,[data-hover],.tour-card,.dest-card,.dest-full-card,.test-card,.insight-card,.gal-item,.exp-tab,.kili-route,.faq-q,.c-info-item,.team-card,.val-card,.mvv-card';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-lg'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-lg'));
  });
})();

/* ── NAV SCROLL + ACTIVE ─────────────────────────────────── */
(function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  // window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('scroll', function () {
  const triggerAt = window.innerHeight * 0.25; // 25% of viewport height
  if (window.scrollY > triggerAt) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
  onScroll();
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a[href*="#"]');
  if (sections.length && links.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting)
          links.forEach(a => a.classList.toggle('active', a.getAttribute('href').includes(e.target.id)));
      });
    }, { threshold: .35 });
    sections.forEach(s => obs.observe(s));
  }
})();

/* ── MOBILE MENU ─────────────────────────────────────────── */
(function initMobile() {
  const ham  = document.getElementById('ham');
  const menu = document.getElementById('mob-menu');
  if (!ham || !menu) return;
  ham.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    ham.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ── SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal,.reveal-l,.reveal-r,.reveal-scale');
  if (!els.length) return;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .1 });
  els.forEach(el => obs.observe(el));
})();

/* ── COUNTER ANIMATION ───────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  let fired = false;
  const obs = new IntersectionObserver(entries => {
    if (!entries.some(e => e.isIntersecting) || fired) return;
    fired = true;
    counters.forEach(el => {
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      const dur = 2200, steps = 80;
      let current = 0;
      const timer = setInterval(() => {
        current += target / steps;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = Math.floor(current).toLocaleString() + suffix;
      }, dur / steps);
    });
  }, { threshold: .5 });
  counters.forEach(el => obs.observe(el));
})();

/* ── PARALLAX HERO ───────────────────────────────────────── */
(function initParallax() {
  const bg = document.querySelector('.hero-bg');
  if (!bg) return;
  window.addEventListener('scroll', () => {
    bg.style.transform = `translateY(${window.scrollY * .32}px) scale(1.05)`;
  }, { passive: true });
})();

/* ── EXPERIENCE TABS ─────────────────────────────────────── */
(function initExpTabs() {
  const tabs = document.querySelectorAll('.exp-tab');
  const img  = document.getElementById('exp-img');
  if (!tabs.length || !img) return;
  img.style.transition = 'opacity .32s';
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      img.style.opacity = '0';
      setTimeout(() => { img.src = tab.dataset.img; img.style.opacity = '1'; }, 320);
    });
  });
})();

/* ── FAQ ACCORDION ───────────────────────────────────────── */
(function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
})();

/* ── GALLERY LIGHTBOX ────────────────────────────────────── */
(function initLightbox() {
  const lb    = document.getElementById('lightbox');
  const lbImg = document.getElementById('lb-img');
  if (!lb || !lbImg) return;
  document.querySelectorAll('.gal-item').forEach(item => {
    item.addEventListener('click', () => {
      lbImg.src = item.querySelector('img').src.replace(/w=\d+/, 'w=1400');
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });
  function closeLB() { lb.classList.remove('open'); document.body.style.overflow = ''; }
  document.getElementById('lb-close')?.addEventListener('click', closeLB);
  lb.addEventListener('click', e => { if (e.target === lb) closeLB(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
})();

/* ── BOOKING FORM ────────────────────────────────────────── */
(function initBooking() {
  const form = document.getElementById('book-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const inputs = form.querySelectorAll('[required]');
    let valid = true;
    inputs.forEach(inp => {
      const ok = inp.value.trim() !== '';
      inp.style.borderColor = ok ? 'rgba(201,150,58,.28)' : '#E85D4A';
      if (!ok) valid = false;
    });
    if (!valid) return;
    const btn = form.querySelector('button[type="submit"]');
    btn.innerHTML = '<i class="fa-solid fa-check"></i> Enquiry Sent! We\'ll respond within 24 hours.';
    btn.style.background = '#4A8C4A';
    btn.disabled = true;
    form.reset();
    inputs.forEach(i => i.style.borderColor = 'rgba(201,150,58,.28)');
  });
})();

/* ── PAGE TRANSITIONS ────────────────────────────────────── */
(function initPageTrans() {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position:'fixed', inset:'0', background:'#0A0A08',
    zIndex:'9800', opacity:'0', pointerEvents:'none', transition:'opacity .3s'
  });
  document.body.appendChild(overlay);
  document.querySelectorAll('a[href$=".html"]:not([target])').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
      e.preventDefault();
      overlay.style.opacity = '1'; overlay.style.pointerEvents = 'all';
      setTimeout(() => { window.location.href = href; }, 280);
    });
  });
  window.addEventListener('pageshow', () => { overlay.style.opacity = '0'; overlay.style.pointerEvents = 'none'; });
})();

/* ── CARD TILT ───────────────────────────────────────────── */
(function initTilt() {
  document.querySelectorAll('.tour-card,.test-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      card.style.transform = `translateY(-8px) perspective(900px) rotateY(${x*4}deg) rotateX(${-y*4}deg)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
})();

/* ── BACK TO TOP ─────────────────────────────────────────── */
(function initBackTop() {
  const btn = document.getElementById('back-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 600;
    btn.style.opacity = show ? '1' : '0';
    btn.style.pointerEvents = show ? 'all' : 'none';
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
