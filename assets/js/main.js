/* ============================================================
   RiverRun Outfitters — main.js
   Vanilla JS (No jQuery)
   ============================================================ */

'use strict';

/* ── Helpers ─────────────────────────────────────────────── */
const qs = (s, p = document) => p.querySelector(s);
const qsa = (s, p = document) => [...p.querySelectorAll(s)];

/* ============================================================ */
/* 1. Dark / Light Mode Toggle                                   */
/* ============================================================ */
const THEME_KEY = 'rr-theme';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcons(saved);
}

function toggleTheme() {
  const cur = document.documentElement.getAttribute('data-theme') || 'light';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  updateThemeIcons(next);
}

function updateThemeIcons(theme) {
  qsa('.theme-toggle-btn').forEach(btn => {
    const icon = btn.querySelector('i');
    if (!icon) return;
    if (theme === 'dark') {
      icon.className = 'bi bi-sun-fill';
      btn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      icon.className = 'bi bi-moon-fill';
      btn.setAttribute('aria-label', 'Switch to dark mode');
    }
  });
}

/* ============================================================ */
/* 2. RTL Mode Toggle                                            */
/* ============================================================ */
const RTL_KEY = 'rr-rtl';

function initRTL() {
  const saved = localStorage.getItem(RTL_KEY) === 'true';
  document.documentElement.setAttribute('dir', saved ? 'rtl' : 'ltr');
  updateRTLBtns(saved);
}

function toggleRTL() {
  const isRTL = document.documentElement.getAttribute('dir') === 'rtl';
  const next = !isRTL;
  document.documentElement.setAttribute('dir', next ? 'rtl' : 'ltr');
  localStorage.setItem(RTL_KEY, next);
  updateRTLBtns(next);
}

function updateRTLBtns(isRTL) {
  qsa('.rtl-toggle-btn').forEach(btn => {
    btn.setAttribute('aria-label', isRTL ? 'Switch to LTR' : 'Switch to RTL');
    btn.title = isRTL ? 'LTR Mode' : 'RTL Mode';
    const icon = btn.querySelector('i');
    if (icon) icon.className = isRTL ? 'bi bi-arrow-right' : 'bi bi-arrow-left-right';
  });
}

/* ============================================================ */
/* 3. Navbar Scroll Effect                                       */
/* ============================================================ */
function initNavbar() {
  const nav = qs('.navbar-rr');
  if (!nav) return;

  const handleScroll = () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run on load

  // Active link highlight
  const links = qsa('.nav-link-rr[data-page]');
  const page = window.location.pathname.split('/').pop() || 'index.html';
  links.forEach(l => {
    if (l.getAttribute('data-page') === page) l.classList.add('active');
  });
}

/* ============================================================ */
/* 4. Offcanvas Mobile Menu                                      */
/* ============================================================ */
function initOffcanvas() {
  const togglerBtn = qs('.hamburger');
  const offcanvas = qs('.offcanvas-rr');
  const overlay = qs('.offcanvas-overlay');
  const closeBtn = qs('.offcanvas-close');

  if (!togglerBtn || !offcanvas) return;

  function open() {
    offcanvas.classList.add('open');
    overlay && overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    togglerBtn.setAttribute('aria-expanded', 'true');
  }

  function close() {
    offcanvas.classList.remove('open');
    overlay && overlay.classList.remove('open');
    document.body.style.overflow = '';
    togglerBtn.setAttribute('aria-expanded', 'false');
  }

  togglerBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);
  overlay && overlay.addEventListener('click', close);

  // Close on mobile link click
  qsa('.mobile-nav-link').forEach(l => l.addEventListener('click', close));

  // Handle resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 991) close();
  });
}

/* ============================================================ */
/* 5. Back to Top Button                                         */
/* ============================================================ */
function initBackToTop() {
  const btn = qs('#backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================ */
/* 6. Scroll Reveal Animations                                   */
/* ============================================================ */
function initScrollReveal() {
  const elements = qsa('.reveal, .reveal-left, .reveal-right');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ============================================================ */
/* 7. Counter Animations                                         */
/* ============================================================ */
function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2000;
  const step = Math.ceil(target / (duration / 16));
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = current.toLocaleString();
  }, 16);
}

function initCounters() {
  const counters = qsa('[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !e.target.dataset.animated) {
        e.target.dataset.animated = 'true';
        animateCounter(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ============================================================ */
/* 8. Hero Parallax                                              */
/* ============================================================ */
function initParallax() {
  const hero = qs('.hero-rr');
  if (!hero || window.innerWidth < 992) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.backgroundPositionY = `${y * 0.4}px`;
  }, { passive: true });
}

/* ============================================================ */
/* 9. Gallery Filtering + Lightbox                               */
/* ============================================================ */
function initGallery() {
  // Filtering
  const pills = qsa('.filter-pill');
  const items = qsa('.gallery-item');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.filter;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.category === cat;
        item.style.display = show ? '' : 'none';
        if (show) {
          item.style.animation = 'fadeInUp .4s ease forwards';
        }
      });
    });
  });

  // Lightbox
  const lightbox = qs('.lightbox');
  const lbImg = lightbox && lightbox.querySelector('img');
  const lbClose = lightbox && lightbox.querySelector('.lightbox-close');

  items.forEach(item => {
    item.addEventListener('click', () => {
      if (!lightbox || !lbImg) return;
      const src = item.querySelector('img')?.src;
      if (src) { lbImg.src = src; lightbox.classList.add('open'); }
    });
  });

  lbClose && lbClose.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox && lightbox.addEventListener('click', e => {
    if (e.target === lightbox) lightbox.classList.remove('open');
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') lightbox && lightbox.classList.remove('open');
  });
}

/* ============================================================ */
/* 10. FAQ Accordion                                             */
/* ============================================================ */
function initFAQ() {
  const items = qsa('.faq-item');
  items.forEach(item => {
    const q = item.querySelector('.faq-question');
    const a = item.querySelector('.faq-answer');
    if (!q || !a) return;

    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      items.forEach(i => {
        i.classList.remove('open');
        const ia = i.querySelector('.faq-answer');
        if (ia) ia.style.maxHeight = null;
      });
      // Open clicked
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });
}

/* ============================================================ */
/* 11. Booking Form Validation                                   */
/* ============================================================ */
function initBookingForm() {
  const form = qs('#bookingForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    qsa('.form-control-rr[required]', form).forEach(field => {
      const errEl = form.querySelector(`[data-error="${field.name}"]`);
      if (!field.value.trim()) {
        field.classList.add('error');
        if (errEl) errEl.textContent = 'This field is required.';
        valid = false;
      } else {
        field.classList.remove('error');
        if (errEl) errEl.textContent = '';
      }
    });

    // Email check
    const emailField = form.querySelector('[type="email"]');
    if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
      emailField.classList.add('error');
      const errEl = form.querySelector('[data-error="email"]');
      if (errEl) errEl.textContent = 'Please enter a valid email.';
      valid = false;
    }

    if (valid) showBookingSuccess(form);
  });

  // Live validation
  qsa('.form-control-rr', form).forEach(field => {
    field.addEventListener('input', () => {
      if (field.value.trim()) {
        field.classList.remove('error');
        const errEl = form.querySelector(`[data-error="${field.name}"]`);
        if (errEl) errEl.textContent = '';
      }
    });
  });

  // Pricing summary update
  const rentalType = form.querySelector('[name="rentalType"]');
  const summaryEl = qs('#priceSummary');
  const prices = {
    'single-kayak': 35,
    'tandem-kayak': 55,
    'canoe': 45,
    'tube': 20,
    'guided-tour': 89,
    'group-package': 199
  };

  if (rentalType && summaryEl) {
    rentalType.addEventListener('change', () => {
      const p = prices[rentalType.value] || 0;
      summaryEl.textContent = p ? `$${p} / person` : '—';
    });
  }
}

function showBookingSuccess(form) {
  const wrap = form.closest('.booking-form-wrap');
  if (!wrap) return;
  wrap.innerHTML = `
    <div class="text-center py-5">
      <div style="font-size:4rem;margin-bottom:1rem;">🎉</div>
      <h3 style="color:var(--primary);font-family:var(--font-h);font-weight:800;">Booking Request Received!</h3>
      <p style="color:var(--text-muted);margin:1rem 0;">We'll confirm your adventure within 24 hours via email.</p>
      <a href="index.html" class="btn-primary-rr">Back to Home</a>
    </div>`;
}

/* ============================================================ */
/* 12. Contact Form                                              */
/* ============================================================ */
function initContactForm() {
  const form = qs('#contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (btn) { btn.textContent = 'Sending…'; btn.disabled = true; }
    setTimeout(() => {
      if (btn) { btn.textContent = 'Message Sent! ✓'; btn.style.background = '#16a34a'; }
    }, 1500);
  });
}

/* ============================================================ */
/* 13. Auth Forms                                                */
/* ============================================================ */
function initAuthForms() {
  // Password strength meter
  const pwdInput = qs('#password');
  const bar = qs('.pwd-strength-bar');
  const msg = qs('#pwdMsg');

  if (pwdInput && bar) {
    pwdInput.addEventListener('input', () => {
      const v = pwdInput.value;
      let strength = 0;
      if (v.length >= 8) strength++;
      if (/[A-Z]/.test(v)) strength++;
      if (/[0-9]/.test(v)) strength++;
      if (/[^A-Za-z0-9]/.test(v)) strength++;

      const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
      const labels = ['Weak', 'Fair', 'Good', 'Strong'];
      bar.style.width = `${strength * 25}%`;
      bar.style.background = colors[strength - 1] || '#e5e7eb';
      if (msg) msg.textContent = strength > 0 ? labels[strength - 1] : '';
    });
  }

  // Confirm password
  const confirmPwd = qs('#confirmPassword');
  if (pwdInput && confirmPwd) {
    confirmPwd.addEventListener('blur', () => {
      const errEl = qs('#confirmPwdMsg');
      if (confirmPwd.value && confirmPwd.value !== pwdInput.value) {
        confirmPwd.classList.add('error');
        if (errEl) errEl.textContent = 'Passwords do not match.';
      } else {
        confirmPwd.classList.remove('error');
        if (errEl) errEl.textContent = '';
      }
    });
  }

  // Register form
  const regForm = qs('#registerForm');
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const terms = regForm.querySelector('#termsCheck');
      if (terms && !terms.checked) {
        alert('Please accept the Terms & Conditions to continue.');
        return;
      }
      const btn = regForm.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Creating Account…'; btn.disabled = true; }
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 1600);
    });
  }

  // Login form
  const loginForm = qs('#loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = loginForm.querySelector('[type="submit"]');
      if (btn) { btn.textContent = 'Signing In…'; btn.disabled = true; }
      setTimeout(() => {
        btn.textContent = 'Signed In! ✓';
        btn.style.background = '#16a34a';
      }, 1400);
    });
  }
}

/* ============================================================ */
/* 14. Countdown Timer (Coming Soon)                             */
/* ============================================================ */
function initCountdown() {
  const el = qs('#countdown');
  if (!el) return;

  const target = new Date(el.dataset.target || '2026-08-01T00:00:00');
  const dEl = el.querySelector('[data-unit="days"]');
  const hEl = el.querySelector('[data-unit="hours"]');
  const mEl = el.querySelector('[data-unit="minutes"]');
  const sEl = el.querySelector('[data-unit="seconds"]');

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) { el.innerHTML = '<p>We are LIVE!</p>'; return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (dEl) dEl.textContent = String(d).padStart(2, '0');
    if (hEl) hEl.textContent = String(h).padStart(2, '0');
    if (mEl) mEl.textContent = String(m).padStart(2, '0');
    if (sEl) sEl.textContent = String(s).padStart(2, '0');
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================ */
/* 15. Smooth Scrolling for Anchor Links                         */
/* ============================================================ */
function initSmoothScroll() {
  qsa('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ============================================================ */
/* 16. Newsletter Form                                           */
/* ============================================================ */
function initNewsletter() {
  qsa('.newsletter-form').forEach(form => {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const input = form.querySelector('input');
      const btn = form.querySelector('button');
      if (!input || !input.value) return;
      if (btn) { btn.textContent = '✓ Subscribed!'; btn.style.background = '#16a34a'; }
      setTimeout(() => {
        if (btn) { btn.textContent = 'Subscribe'; btn.style.background = ''; }
        if (input) input.value = '';
      }, 3000);
    });
  });
}

/* ============================================================ */
/* 17. Blog Search                                               */
/* ============================================================ */
function initBlogSearch() {
  const input = qs('#blogSearch');
  const cards = qsa('.blog-card');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase();
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

/* ============================================================ */
/* 18. Blog Category Filter                                      */
/* ============================================================ */
function initBlogFilter() {
  const pills = qsa('.blog-filter-pill');
  const cards = qsa('.blog-card');

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      cards.forEach(card => {
        card.style.display = (cat === 'all' || card.dataset.cat === cat) ? '' : 'none';
      });
    });
  });
}

/* ============================================================ */
/* 19. Waiver Checkbox Guard                                     */
/* ============================================================ */
function initWaiverGuard() {
  const waiverCheck = qs('#waiverCheck');
  const submitBtn = qs('#bookSubmitBtn');

  if (!waiverCheck || !submitBtn) return;

  const toggle = () => { submitBtn.disabled = !waiverCheck.checked; };
  toggle();
  waiverCheck.addEventListener('change', toggle);
}

/* ============================================================ */
/* INIT ALL                                                       */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initRTL();
  initNavbar();
  initOffcanvas();
  initBackToTop();
  initScrollReveal();
  initCounters();
  initParallax();
  initGallery();
  initFAQ();
  initBookingForm();
  initContactForm();
  initAuthForms();
  initCountdown();
  initSmoothScroll();
  initNewsletter();
  initBlogSearch();
  initBlogFilter();
  initWaiverGuard();

  // Init all theme & RTL btns
  qsa('.theme-toggle-btn').forEach(btn => btn.addEventListener('click', toggleTheme));
  qsa('.rtl-toggle-btn').forEach(btn => btn.addEventListener('click', toggleRTL));
});
