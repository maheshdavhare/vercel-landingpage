/* =============================================
   AXIOM — JAVASCRIPT INTERACTIONS
   ============================================= */

'use strict';

// ---- NAVBAR SCROLL EFFECT ----
const navbar = document.getElementById('navbar');
let lastScroll = 0;

function handleNavbarScroll() {
  const scrollY = window.scrollY;
  if (scrollY > 20) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  lastScroll = scrollY;
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });
handleNavbarScroll();


// ---- HAMBURGER / MOBILE MENU ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let menuOpen = false;

function toggleMenu() {
  menuOpen = !menuOpen;
  mobileMenu.classList.toggle('open', menuOpen);

  // Animate hamburger → X
  const spans = hamburger.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
}

hamburger.addEventListener('click', toggleMenu);

// Close mobile menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    if (menuOpen) toggleMenu();
  });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (menuOpen && !mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    toggleMenu();
  }
});


// ---- SMOOTH SCROLL FOR ANCHOR LINKS ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});


// ---- BILLING TOGGLE (PRICING) ----
const billingToggle = document.getElementById('billingToggle');
const toggleMonthly = document.getElementById('toggleMonthly');
const toggleAnnual = document.getElementById('toggleAnnual');
let isAnnual = false;

function updatePrices() {
  const priceEls = document.querySelectorAll('.price-num[data-monthly]');
  priceEls.forEach(el => {
    const monthly = parseInt(el.dataset.monthly, 10);
    const annual = parseInt(el.dataset.annual, 10);

    if (monthly === 0) {
      el.textContent = '$0';
      return;
    }

    const target = isAnnual ? annual : monthly;
    animateCount(el, target);
  });
}

function animateCount(el, target) {
  const current = parseInt(el.textContent.replace('$', ''), 10) || 0;
  const duration = 300;
  const startTime = performance.now();

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const value = Math.round(current + (target - current) * eased);
    el.textContent = '$' + value;
    if (progress < 1) requestAnimationFrame(step);
  }

  requestAnimationFrame(step);
}

billingToggle.addEventListener('click', () => {
  isAnnual = !isAnnual;
  billingToggle.classList.toggle('on', isAnnual);
  toggleMonthly.classList.toggle('active', !isAnnual);
  toggleAnnual.classList.toggle('active', isAnnual);
  updatePrices();
});

// Set initial state
toggleMonthly.classList.add('active');


// ---- SCROLL REVEAL ANIMATION ----
function initRevealAnimations() {
  // Add reveal classes to target elements
  const selectors = [
    '.section-header',
    '.feature-card',
    '.testi-card',
    '.price-card',
    '.preview-window',
    '.logos',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      // Stagger children within grids
      const delay = (i % 4) + 1;
      if (delay > 1) el.classList.add(`reveal-delay-${delay}`);
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

initRevealAnimations();


// ---- HERO TITLE ENTRANCE ----
function heroEntrance() {
  const heroTitle = document.querySelector('.hero-title');
  const heroSub = document.querySelector('.hero-sub');
  const heroBadge = document.querySelector('.hero-badge');
  const heroActions = document.querySelector('.hero-actions');
  const heroProof = document.querySelector('.hero-social-proof');

  const elements = [heroBadge, heroTitle, heroSub, heroActions, heroProof];

  elements.forEach((el, i) => {
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`;
  });

  // Trigger after brief delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      elements.forEach(el => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      });
    });
  });
}

heroEntrance();


// ---- FAKE DASHBOARD — TYPING ANIMATION IN URL BAR ----
function initDashboardAnimation() {
  const urlBar = document.querySelector('.window-url');
  if (!urlBar) return;

  const text = 'app.axiom.dev/dashboard';
  let index = 0;
  let started = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        urlBar.textContent = '';

        const interval = setInterval(() => {
          urlBar.textContent = text.slice(0, ++index);
          if (index >= text.length) {
            clearInterval(interval);
          }
        }, 55);

        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  const previewWindow = document.querySelector('.preview-window');
  if (previewWindow) observer.observe(previewWindow);
}

initDashboardAnimation();


// ---- FAKE DEPLOY COUNTER ANIMATION ----
function initDeployCounter() {
  const statNum = document.querySelector('.fsc-num');
  if (!statNum) return;

  let started = false;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !started) {
        started = true;
        let count = 1200;
        const target = 1284;
        const duration = 1200;
        const startTime = performance.now();

        function step(now) {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.round(count + (target - count) * eased);
          statNum.textContent = value.toLocaleString();
          if (progress < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
        observer.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observer.observe(statNum);
}

initDeployCounter();


// ---- FEATURE CARD TILT EFFECT ----
function initTiltEffect() {
  document.querySelectorAll('.feature-card, .testi-card, .price-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      card.style.transform = `translateY(-2px) rotateX(${-y * 3}deg) rotateY(${x * 3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

initTiltEffect();


// ---- ACTIVE NAV LINK ON SCROLL ----
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

initActiveNav();