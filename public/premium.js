/**
 * EMERG - Premium motion layer
 * Inertial smooth scroll, masked headline reveals, card spotlights,
 * magnetic buttons, and a scroll progress indicator.
 */
'use strict';

(function initPremium() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- Inertial smooth scroll (Lenis) ---------- */
  if (!reduceMotion && typeof window.Lenis === 'function') {
    const lenis = new window.Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    window.__lenis = lenis;

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Existing modal / drawer code locks scrolling via body overflow
    new MutationObserver(() => {
      document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ['style'] });

    document
      .querySelectorAll('#lightboxOverlay, #mobileNav, .gallery-track-container, .reel-player-container')
      .forEach((el) => el.setAttribute('data-lenis-prevent', ''));
  }

  /* ---------- Scroll progress ---------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  let ticking = false;
  const updateProgress = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.transform = `scaleX(${ratio.toFixed(4)})`;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateProgress);
    }
  }, { passive: true });
  updateProgress();

  if (reduceMotion) return;

  /* ---------- Masked word reveal for headlines ---------- */
  function splitWords(el) {
    let index = 0;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(' '));
          return;
        }
        const outer = document.createElement('span');
        outer.className = 'split-word';
        const inner = document.createElement('span');
        inner.textContent = part;
        inner.style.setProperty('--wi', index++);
        outer.appendChild(inner);
        frag.appendChild(outer);
      });
      node.parentNode.replaceChild(frag, node);
    });
    el.classList.add('split-ready');
  }

  const headlines = document.querySelectorAll('.hero-headline, .section-title');
  const headlineObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        headlineObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

  headlines.forEach((el) => {
    splitWords(el);
    if (el.classList.contains('hero-headline')) el.style.setProperty('--split-base', '150ms');
    headlineObserver.observe(el);
  });

  /* ---------- Hero image curtain reveal ---------- */
  const heroPhoto = document.querySelector('.hero-photo-wrap');
  if (heroPhoto) requestAnimationFrame(() => setTimeout(() => heroPhoto.classList.add('is-in'), 120));

  /* ---------- Cursor spotlight on cards ---------- */
  if (finePointer) {
    document.querySelectorAll('.service-card, .why-card, .step-card, .team-card').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        card.style.setProperty('--my', `${e.clientY - rect.top}px`);
      });
    });

    /* ---------- Magnetic buttons ---------- */
    document.querySelectorAll('.btn-primary, .btn-outline, .theme-toggle, .scroll-to-top').forEach((btn) => {
      const strength = 0.22;
      btn.addEventListener('pointermove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        btn.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.transform = '';
      });
    });
  }
})();
