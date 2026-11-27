'use strict';

(function initEditorial() {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const clamp = (value) => Math.min(1, Math.max(0, value));

  /* ---------- Process timeline drawn by scroll ---------- */
  const stepsGrid = document.querySelector('.steps-grid');
  const steps = stepsGrid ? Array.from(stepsGrid.querySelectorAll('.step-card')) : [];

  function setStepsProgress(progress) {
    stepsGrid.style.setProperty('--steps-progress', progress.toFixed(4));
    steps.forEach((step, index) => {
      step.classList.toggle('is-active', progress > index / steps.length + 0.02);
    });
  }

  if (stepsGrid && steps.length) {
    if (reduceMotion) {
      setStepsProgress(1);
    } else {
      const stacked = window.matchMedia('(max-width: 1080px)');
      let queued = false;

      const measure = () => {
        queued = false;
        const rect = stepsGrid.getBoundingClientRect();
        const viewport = window.innerHeight;
        const progress = stacked.matches
          ? (viewport * 0.72 - rect.top) / rect.height
          : (viewport * 0.82 - rect.top) / (viewport * 0.42);
        setStepsProgress(clamp(progress));
      };
      const requestMeasure = () => {
        if (queued) return;
        queued = true;
        requestAnimationFrame(measure);
      };

      window.addEventListener('scroll', requestMeasure, { passive: true });
      window.addEventListener('resize', requestMeasure);
      measure();
    }
  }

  /* ---------- Footer wordmark rises letter by letter ---------- */
  const wordmark = document.querySelector('.footer-wordmark');
  if (wordmark) {
    const letters = wordmark.textContent.trim().split('');
    wordmark.textContent = '';
    letters.forEach((letter, index) => {
      const span = document.createElement('span');
      span.textContent = letter;
      span.style.setProperty('--li', index);
      wordmark.appendChild(span);
    });

    new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        wordmark.classList.add('is-in');
        observer.disconnect();
      });
    }, { threshold: 0.25 }).observe(wordmark);
  }

  /* ---------- Cursor label over project cards ---------- */
  if (finePointer && !reduceMotion) {
    const cards = document.querySelectorAll('.project-card');
    if (cards.length) {
      const label = document.createElement('div');
      label.className = 'cursor-label';
      label.setAttribute('aria-hidden', 'true');
      label.textContent = 'View';
      document.body.appendChild(label);

      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      let running = false;

      const follow = () => {
        current.x += (target.x - current.x) * 0.18;
        current.y += (target.y - current.y) * 0.18;
        label.style.setProperty('--cx', `${current.x.toFixed(1)}px`);
        label.style.setProperty('--cy', `${current.y.toFixed(1)}px`);
        if (running) requestAnimationFrame(follow);
      };

      cards.forEach((card) => {
        card.addEventListener('pointerenter', (event) => {
          target.x = current.x = event.clientX;
          target.y = current.y = event.clientY;
          label.classList.add('is-on');
          if (!running) {
            running = true;
            requestAnimationFrame(follow);
          }
        });
        card.addEventListener('pointermove', (event) => {
          target.x = event.clientX;
          target.y = event.clientY;
        });
        card.addEventListener('pointerleave', () => {
          label.classList.remove('is-on');
          running = false;
        });
      });
    }
  }
})();
