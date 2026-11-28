/**
 * EMERG The Studio - script.js
 * Vanilla ES6+ JavaScript
 * Features: Theme Toggle, Nav Highlighting, Subtle Reveals,
 *           Portfolio Filter, Lightbox Modal, Form Validation
 */

'use strict';

/* ============================================================
   THEME SWITCHER
   ============================================================ */
const themeToggle = document.getElementById('themeToggle');
const html        = document.documentElement;

function getStoredTheme() {
  return localStorage.getItem('emerg-theme') || 'dark';
}

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('emerg-theme', theme);

  const isDark = theme === 'dark';
  if (themeToggle) {
    themeToggle.setAttribute(
      'aria-label',
      isDark ? 'Switch to light mode' : 'Switch to dark mode'
    );
  }

  // Swap navbar monogram between coloured (light) and dark-mode versions
  const navMonogram = document.querySelector('.logo-monogram-img');
  if (navMonogram) {
    navMonogram.src = isDark ? 'assets/monogram-dark.svg' : 'assets/monogram-light.svg';
  }
}

// Apply on page load
applyTheme(getStoredTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });
}


/* ============================================================
   NAVBAR - SCROLL SHADOW & ACTIVE LINK HIGHLIGHTING
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link[data-section]');

// Scroll shadow
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// Active nav link tracking via IntersectionObserver
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinks.forEach(link => {
        const isActive = link.dataset.section === id;
        link.classList.toggle('active', isActive);
      });
    }
  });
}, {
  rootMargin: '-40% 0px -55% 0px',
  threshold: 0,
});

sections.forEach(section => navObserver.observe(section));


/* ============================================================
   MOBILE NAV HAMBURGER
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link, #mobileNav .btn');

function openMobileNav() {
  hamburger.classList.add('open');
  mobileNav.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
  hamburger.classList.remove('open');
  mobileNav.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  const isOpen = mobileNav.classList.contains('open');
  isOpen ? closeMobileNav() : openMobileNav();
});

// Close on link click
mobileNavLinks.forEach(link => {
  link.addEventListener('click', closeMobileNav);
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (
    mobileNav.classList.contains('open') &&
    !mobileNav.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    closeMobileNav();
  }
});

// Close on Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    if (mobileNav && mobileNav.classList.contains('open')) closeMobileNav();
    if (lightboxOverlay && !lightboxOverlay.hasAttribute('hidden')) closeLightbox();
  }
});


/* ============================================================
   INTERSECTION OBSERVER - SUBTLE REVEAL ANIMATIONS
   ============================================================ */
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, {
  threshold: 0.08,
  rootMargin: '0px 0px -20px 0px',
});

revealElements.forEach(el => revealObserver.observe(el));


/* ============================================================
   PORTFOLIO - CATEGORY FILTER
   ============================================================ */
const filterBtns   = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;

    // Update active state + ARIA
    filterBtns.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');

    // Filter cards
    projectCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        card.classList.remove('hidden');
        // Re-trigger reveal animation
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 10);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});


/* ============================================================
   LIGHTBOX MODAL
   ============================================================ */
const lightboxOverlay  = document.getElementById('lightboxOverlay');
const lightboxClose    = document.getElementById('lightboxClose');
const lightboxImg      = document.getElementById('lightboxImg');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxTitle    = document.getElementById('lightboxTitle');
const lightboxDesc     = document.getElementById('lightboxDesc');
const lightboxResults  = document.getElementById('lightboxResults');

let previouslyFocused = null;

function openLightbox(card) {
  previouslyFocused = document.activeElement;

  const title    = card.dataset.title;
  const desc     = card.dataset.desc;
  const results  = JSON.parse(card.dataset.results || '[]');
  const img      = card.dataset.img;
  const category = card.querySelector('.project-tag').textContent.trim();

  lightboxImg.src          = img;
  lightboxImg.alt          = title;
  lightboxCategory.textContent = category;
  lightboxTitle.textContent    = title;
  lightboxDesc.textContent     = desc;

  // Render results
  lightboxResults.innerHTML = results
    .map(r => `<div class="result-item">${r}</div>`)
    .join('');

  lightboxOverlay.removeAttribute('hidden');
  // Force reflow then animate
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      lightboxOverlay.classList.add('open');
    });
  });

  document.body.style.overflow = 'hidden';
  lightboxClose.focus();
}

function closeLightbox() {
  lightboxOverlay.classList.remove('open');
  document.body.style.overflow = '';

  // Hide after transition
  lightboxOverlay.addEventListener('transitionend', () => {
    lightboxOverlay.setAttribute('hidden', '');
    if (previouslyFocused) previouslyFocused.focus();
  }, { once: true });
}

// Open on card click or Enter/Space key
projectCards.forEach(card => {
  card.addEventListener('click', () => openLightbox(card));
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openLightbox(card);
    }
  });
});

if (lightboxClose) {
  lightboxClose.addEventListener('click', closeLightbox);
}

// Close on overlay backdrop click
if (lightboxOverlay) {
  lightboxOverlay.addEventListener('click', (e) => {
    if (e.target === lightboxOverlay) closeLightbox();
  });

  // Trap focus inside modal
  lightboxOverlay.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;

    const focusable = lightboxOverlay.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}


/* ============================================================
   CONTACT FORM VALIDATION
   ============================================================ */
const contactForm    = document.getElementById('contactForm');
const formSuccess    = document.getElementById('formSuccess');
const submitBtn      = document.getElementById('formSubmitBtn');

const fields = {
  name:    { el: document.getElementById('fullName'),      error: document.getElementById('error-name'),    group: document.getElementById('group-name')    },
  email:   { el: document.getElementById('emailAddress'),  error: document.getElementById('error-email'),   group: document.getElementById('group-email')   },
  phone:   { el: document.getElementById('mobileNumber'),  error: document.getElementById('error-phone'),   group: document.getElementById('group-phone')   },
  service: { el: document.getElementById('serviceSelect'), error: document.getElementById('error-service'),  group: document.getElementById('group-service')  },
  message: { el: document.getElementById('projectMessage'),error: document.getElementById('error-message'), group: document.getElementById('group-message') },
};

// Real-time inline validation on blur
if (contactForm) {
  Object.values(fields).forEach(({ el, error, group }) => {
    if (!el) return;
    el.addEventListener('blur', () => {
      validateField(el, error, group);
    });
    el.addEventListener('input', () => {
      if (group.classList.contains('error')) {
        validateField(el, error, group);
      }
    });
  });
}

function validateField(el, error, group) {
  let valid = true;

  if (el.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    valid = el.value.trim() !== '' && emailRegex.test(el.value.trim());
  } else if (el.type === 'tel') {
    // Accepts clean digits (allows spaces, +, -, parentheses); requires at least 7 digits (e.g. 10-digit Indian mobile)
    const cleaned = el.value.replace(/[\s\-\+\(\)]/g, '');
    valid = cleaned.length >= 7 && /^\d+$/.test(cleaned);
  } else if (el.tagName === 'SELECT') {
    valid = el.value !== '';
  } else if (el.tagName === 'TEXTAREA') {
    valid = el.value.trim().length >= 20;
  } else {
    valid = el.value.trim().length >= 2;
  }

  group.classList.toggle('error', !valid);
  error.classList.toggle('visible', !valid);

  return valid;
}

function validateAll() {
  let allValid = true;
  const { name, email, phone, service, message } = fields;

  if (!validateField(name.el,    name.error,    name.group))    allValid = false;
  if (!validateField(email.el,   email.error,   email.group))   allValid = false;
  if (!validateField(phone.el,   phone.error,   phone.group))   allValid = false;
  if (!validateField(service.el, service.error, service.group)) allValid = false;
  if (!validateField(message.el, message.error, message.group)) allValid = false;

  return allValid;
}

if (contactForm) {
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const honeypot = contactForm.querySelector('input[name="_honey"]');
  if (honeypot && honeypot.value) return;

  if (!validateAll()) {
    // Focus first error
    const firstError = contactForm.querySelector('.form-group.error input, .form-group.error select, .form-group.error textarea');
    if (firstError) firstError.focus();
    return;
  }

  // Loading state
  const originalBtnText   = submitBtn.textContent;
  submitBtn.innerHTML     = '<span class="btn-spinner" aria-hidden="true"></span> Sending...';
  submitBtn.disabled      = true;
  submitBtn.style.opacity = '0.8';
  const formError = document.getElementById('formError');
  if (formError) formError.style.display = 'none';

  // Map service values to readable titles
  const serviceMap = {
    marketing:   'Digital Marketing',
    media:       'Media Studio',
    web:         'Website & Digital Solutions',
    ai:          'AI Enablement',
    full:        'Full-Service Partnership',
    branding:    'Media Studio',
    social:      'Digital Marketing',
    performance: 'Digital Marketing',
  };

  const payload = {
    name:      fields.name.el.value.trim(),
    email:     fields.email.el.value.trim(),
    phone:     fields.phone.el.value.trim(),
    service:   serviceMap[fields.service.el.value] || fields.service.el.value,
    message:   fields.message.el.value.trim(),
    _subject:  `New Inquiry from ${fields.name.el.value.trim()} - EMERG Website`,
    _template: 'table',
    _captcha:  'false',
    _replyto:  fields.email.el.value.trim(),
    _honey:    '',
    page:      window.location.href,
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('https://formsubmit.co/ajax/hello@emerg.co.in', {
      method:  'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept':        'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const result = await response.json().catch(() => ({}));

    if (response.ok && (result.success === 'true' || result.success === true)) {
      contactForm.style.display = 'none';
      formSuccess.removeAttribute('hidden');
      formSuccess.classList.add('visible');
      formSuccess.focus();
    } else {
      throw new Error(result.message || 'Form submission failed');
    }
  } catch (err) {
    if (err && err.name === 'AbortError') err = new Error('Form submission failed');
    console.error('FormSubmit error:', err);
    if (formError) {
      const alertIcon = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;" aria-hidden="true"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
      formError.style.display = 'flex';
      if (err.message && err.message !== 'Form submission failed') {
        formError.innerHTML = `${alertIcon}<span>${err.message}</span>`;
      } else if (window.location.protocol === 'file:') {
        formError.innerHTML = `${alertIcon}<span>Note: Form submissions require opening the site through a web server rather than directly as a local file (file://).</span>`;
      } else {
        formError.innerHTML = `${alertIcon}<span>Something went wrong. Please try again or email us directly at <a href="mailto:hello@emerg.co.in" style="color:inherit;font-weight:600;text-decoration:underline;">hello@emerg.co.in</a></span>`;
      }
    }
    submitBtn.textContent   = originalBtnText;
    submitBtn.disabled      = false;
    submitBtn.style.opacity = '1';
  }
});
}


/* ============================================================
   INSTAGRAM REELS SHOWCASE & DYNAMIC LIVE PLAYER RUNNER
   ============================================================ */
function initInstagramReels() {
  const reelsShowcase = document.getElementById('work-reels-showcase');
  if (!reelsShowcase) return;

  const reelCards = reelsShowcase.querySelectorAll('.reel-card');

  reelCards.forEach(card => {
    const rawUrl = card.getAttribute('data-reel-url') || '';
    const iframe = card.querySelector('.reel-embed-frame');
    const fallback = card.querySelector('.reel-preview-fallback');
    const links = card.querySelectorAll('a[href]');

    // Extract shortcode from URLs like:
    // https://www.instagram.com/reel/DT0mnnvkjWG/?utm_source=...
    // https://www.instagram.com/p/DT0mnnvkjWG/
    // https://instagram.com/reel/DT0mnnvkjWG
    const match = rawUrl.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);

    if (match && match[1]) {
      const shortcode = match[1];
      const embedSrc = `https://www.instagram.com/reel/${shortcode}/embed/`;

      if (iframe) {
        if (iframe.getAttribute('src') !== embedSrc) {
          iframe.setAttribute('src', embedSrc);
        }
        iframe.style.display = 'block';
      }
      if (fallback) {
        fallback.style.display = 'none';
      }

      // Update all direct links on this card to point to the pasted Instagram URL
      links.forEach(a => {
        a.setAttribute('href', rawUrl);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });
    } else {
      // Profile URL or waiting for a specific reel link
      if (iframe && fallback) {
        iframe.style.display = 'none';
        fallback.style.display = 'flex';
      }
      links.forEach(a => {
        a.setAttribute('href', rawUrl || 'https://www.instagram.com/emerg_jabalpur/');
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      });
    }
  });

  // Re-process Instagram embeds if Meta embed.js is ready
  if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
    try {
      window.instgrm.Embeds.process();
    } catch (e) {
      // Gracefully handle embed script timing
    }
  }
}

// Run immediately and also on DOMContentLoaded
initInstagramReels();
document.addEventListener('DOMContentLoaded', initInstagramReels);


/* ============================================================
   APPLE-STYLE EASED ANCHOR SMOOTH SCROLL
   ============================================================ */
function smoothScrollToY(targetY, duration = 680) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, targetY);
    return;
  }
  if (window.__lenis) {
    window.__lenis.scrollTo(targetY, { duration: duration / 1000 * 1.6 });
    return;
  }
  const startY = window.scrollY || document.documentElement.scrollTop;
  const distance = targetY - startY;
  const startTime = performance.now();

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function step(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    window.scrollTo(0, startY + distance * easeOutQuart(progress));
    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const navHeight = navbar ? navbar.offsetHeight : 64;
      const targetY = Math.max(0, target.getBoundingClientRect().top + window.scrollY - navHeight - 8);
      smoothScrollToY(targetY, 680);
    }
  });
});


/* ============================================================
   STUDIO GALLERY CAROUSEL - INTERACTIVE CONTROLS
   ============================================================ */
const galleryTrack = document.getElementById('galleryTrack');
const galleryContainer = document.querySelector('.gallery-track-container');
const galleryPrev = document.getElementById('galleryPrev');
const galleryNext = document.getElementById('galleryNext');
const galleryDots = document.querySelectorAll('.gallery-dot');
const gallerySlides = document.querySelectorAll('.gallery-slide');

if (galleryTrack && galleryContainer) {
  let currentIndex = 0;
  const totalSlides = gallerySlides.length;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let animFrame = null;
  let isAnimating = false;

  const targetFor = (index) => {
    const slide = gallerySlides[index];
    const contRect = galleryContainer.getBoundingClientRect();
    const slideRect = slide.getBoundingClientRect();
    const raw = galleryContainer.scrollLeft + (slideRect.left - contRect.left) - (contRect.width - slideRect.width) / 2;
    const max = galleryContainer.scrollWidth - galleryContainer.clientWidth;
    return Math.max(0, Math.min(max, raw));
  };

  const nearestIndex = () => {
    const contRect = galleryContainer.getBoundingClientRect();
    const center = contRect.left + contRect.width / 2;
    let best = 0;
    let bestDist = Infinity;
    gallerySlides.forEach((slide, i) => {
      const r = slide.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - center);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  };

  const animateTo = (target) => {
    cancelAnimationFrame(animFrame);
    const start = galleryContainer.scrollLeft;
    const distance = target - start;
    if (prefersReducedMotion || Math.abs(distance) < 1) {
      galleryContainer.scrollLeft = target;
      return;
    }
    const duration = Math.min(900, 420 + Math.abs(distance) * 0.35);
    const startTime = performance.now();
    isAnimating = true;
    galleryContainer.classList.add('is-animating');
    const ease = (t) => 1 - Math.pow(1 - t, 4);
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      galleryContainer.scrollLeft = start + distance * ease(t);
      if (t < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        isAnimating = false;
        galleryContainer.classList.remove('is-animating');
      }
    };
    animFrame = requestAnimationFrame(step);
  };

  const updateDots = (index) => {
    galleryDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === index);
      dot.setAttribute('aria-selected', i === index ? 'true' : 'false');
    });
  };

  const scrollToIndex = (index) => {
    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;
    currentIndex = index;

    animateTo(targetFor(currentIndex));
    updateDots(currentIndex);
  };

  if (galleryPrev) {
    galleryPrev.addEventListener('click', () => {
      scrollToIndex(currentIndex - 1);
    });
  }

  if (galleryNext) {
    galleryNext.addEventListener('click', () => {
      scrollToIndex(currentIndex + 1);
    });
  }

  galleryDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const slideIndex = parseInt(dot.getAttribute('data-slide'), 10);
      scrollToIndex(slideIndex);
    });
  });

  // Track scroll position to update dots during manual touch/drag scroll
  let scrollTimeout;
  galleryContainer.addEventListener('scroll', () => {
    if (isAnimating) return;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      currentIndex = nearestIndex();
      updateDots(currentIndex);
    }, 80);
  }, { passive: true });

  // Auto-advance every 5 seconds; pauses on hover, touch, or when off-screen
  let autoAdvanceTimer = null;
  let galleryVisible = false;
  let galleryHovered = false;
  const stopAuto = () => { clearInterval(autoAdvanceTimer); autoAdvanceTimer = null; };
  const startAuto = () => {
    stopAuto();
    if (prefersReducedMotion || !galleryVisible || galleryHovered) return;
    autoAdvanceTimer = setInterval(() => scrollToIndex(currentIndex + 1), 5000);
  };

  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      galleryVisible = entries[0].isIntersecting;
      startAuto();
    }, { threshold: 0.35 }).observe(galleryContainer);
  }

  const carouselWrap = document.querySelector('.gallery-carousel-wrap');
  if (carouselWrap) {
    carouselWrap.addEventListener('mouseenter', () => { galleryHovered = true; stopAuto(); });
    carouselWrap.addEventListener('mouseleave', () => { galleryHovered = false; startAuto(); });
    carouselWrap.addEventListener('touchstart', () => { cancelAnimationFrame(animFrame); isAnimating = false; galleryContainer.classList.remove('is-animating'); stopAuto(); }, { passive: true });
    carouselWrap.addEventListener('touchend', () => setTimeout(startAuto, 1500), { passive: true });
  }
  document.addEventListener('visibilitychange', () => (document.hidden ? stopAuto() : startAuto()));
  window.addEventListener('resize', () => {
    galleryContainer.scrollLeft = targetFor(currentIndex);
  }, { passive: true });

  // Mouse Drag-to-Scroll for desktop users
  let isDown = false;
  let startX;
  let scrollLeft;

  const endDrag = () => {
    if (!isDown) return;
    isDown = false;
    galleryContainer.classList.remove('dragging');
    scrollToIndex(nearestIndex());
  };

  galleryContainer.addEventListener('mousedown', (e) => {
    cancelAnimationFrame(animFrame);
    isAnimating = false;
    galleryContainer.classList.remove('is-animating');
    isDown = true;
    galleryContainer.classList.add('dragging');
    startX = e.pageX - galleryContainer.offsetLeft;
    scrollLeft = galleryContainer.scrollLeft;
  });

  galleryContainer.addEventListener('mouseleave', endDrag);
  galleryContainer.addEventListener('mouseup', endDrag);

  galleryContainer.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryContainer.offsetLeft;
    const walk = (x - startX) * 1.5;
    galleryContainer.scrollLeft = scrollLeft - walk;
  });
}


/* ============================================================
   ARCHITECTURAL STUDIO BACKGROUND CANVAS
   Subtle studio grid, harmonic wave curves & ambient glow
   ============================================================ */
(function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  const heroSection = document.getElementById('hero');
  if (!canvas || !heroSection) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let animationFrameId;
  let isRunning = false;
  let width = 0;
  let height = 0;
  let phase = 0;

  const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = heroSection.clientWidth;
    height = heroSection.clientHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (!pointer.active) {
      pointer.x = width * 0.72;
      pointer.y = height * 0.45;
      pointer.targetX = pointer.x;
      pointer.targetY = pointer.y;
    }
  }

  function render() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    phase += 0.011;

    pointer.x += (pointer.targetX - pointer.x) * 0.06;
    pointer.y += (pointer.targetY - pointer.y) * 0.06;

    // 1. Soft Studio Light Glow (no purple gradients, pure warm slate / aubergine)
    const glowRadius = Math.max(width * 0.36, 260);
    const glow = ctx.createRadialGradient(pointer.x, pointer.y, 8, pointer.x, pointer.y, glowRadius);
    if (isDark) {
      glow.addColorStop(0, 'rgba(136, 111, 104, 0.16)');
      glow.addColorStop(0.55, 'rgba(66, 76, 85, 0.06)');
      glow.addColorStop(1, 'rgba(33, 23, 25, 0)');
    } else {
      glow.addColorStop(0, 'rgba(136, 111, 104, 0.12)');
      glow.addColorStop(0.55, 'rgba(66, 76, 85, 0.04)');
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    }
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    // 2. Subtle Architectural Hairline Grid
    const gridSize = width < 768 ? 56 : 72;
    ctx.strokeStyle = isDark ? 'rgba(209, 204, 220, 0.045)' : 'rgba(61, 44, 46, 0.045)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = gridSize; x < width; x += gridSize) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
    }
    for (let y = gridSize; y < height; y += gridSize) {
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
    }
    ctx.stroke();

    // 3. Flowing Architectural Wave Ribbons
    const ribbons = [
      { amp: 22, freq: 0.0028, speed: 0.75, yBase: height * 0.68, alpha: isDark ? 0.22 : 0.18 },
      { amp: 30, freq: 0.0019, speed: 0.55, yBase: height * 0.76, alpha: isDark ? 0.14 : 0.12 }
    ];

    ribbons.forEach((r) => {
      ctx.beginPath();
      for (let x = 0; x <= width; x += 8) {
        const y = r.yBase + Math.sin(x * r.freq + phase * r.speed) * r.amp + Math.cos(x * r.freq * 0.5 - phase * 0.4) * (r.amp * 0.35);
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = isDark ? `rgba(209, 204, 220, ${r.alpha})` : `rgba(136, 111, 104, ${r.alpha})`;
      ctx.lineWidth = 1.25;
      ctx.stroke();
    });

    animationFrameId = requestAnimationFrame(render);
  }

  if (isFinePointer) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      pointer.targetX = e.clientX - rect.left;
      pointer.targetY = e.clientY - rect.top;
      pointer.active = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      pointer.active = false;
      pointer.targetX = width * 0.72;
      pointer.targetY = height * 0.45;
    });
  }

  window.addEventListener('resize', resize, { passive: true });

  const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isRunning) {
        isRunning = true;
        render();
      } else if (!entry.isIntersecting && isRunning) {
        isRunning = false;
        cancelAnimationFrame(animationFrameId);
      }
    });
  }, { threshold: 0.05 });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else if (heroSection.getBoundingClientRect().bottom > 0) {
      isRunning = true;
      render();
    }
  });

  resize();
  heroObserver.observe(heroSection);
})();


/* ============================================================
   APPLE-STYLE SCROLL CHOREOGRAPHY (Hero Depth & Scale)
   ============================================================ */
(function initAppleScrollChoreography() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const heroPhotoWrap = document.querySelector('.hero-photo-wrap');
  const heroSection = document.getElementById('hero');
  if (!heroPhotoWrap || !heroSection) return;

  let ticking = false;

  function updateDepth() {
    ticking = false;
    if (window.innerWidth <= 768) {
      heroPhotoWrap.style.removeProperty('--apple-scale');
      heroPhotoWrap.style.removeProperty('--apple-parallax');
      return;
    }

    const rect = heroSection.getBoundingClientRect();
    const viewH = window.innerHeight || 800;
    const progress = Math.min(Math.max(-rect.top / viewH, 0), 1);

    const scale = 1 + progress * 0.035;
    const translateY = progress * 18;
    heroPhotoWrap.style.setProperty('--apple-scale', scale.toFixed(4));
    heroPhotoWrap.style.setProperty('--apple-parallax', `${translateY.toFixed(1)}px`);
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateDepth);
    }
  }, { passive: true });
})();


/* ============================================================
   SCROLL-TO-TOP BUTTON
   ============================================================ */
(function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (!scrollToTopBtn) return;

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop > 400) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  scrollToTopBtn.addEventListener('click', () => {
    smoothScrollToY(0, 680);
  });
})();
