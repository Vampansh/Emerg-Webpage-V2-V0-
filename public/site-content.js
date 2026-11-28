/* ============================================================
   EMERG — EDITABLE SITE CONTENT
   ------------------------------------------------------------
   Photo badalne ke liye:
     1. Nayi photo  public/assets/  folder me daalo (jaise assets/my-photo.jpg)
     2. Neeche us item ka  src  badal do: 'assets/my-photo.jpg'
     3. alt  me photo ka chhota description likho (SEO + accessibility)

   Gallery me jitne items rakhoge utni slides banengi (add/remove kar sakte ho).
   Reel add karne ke liye Instagram reel ka link  reels  list me paste karo.
   ============================================================ */

window.EMERG_CONTENT = {
  instagram: 'https://www.instagram.com/emerg_jabalpur/',

  /* "What We've Done" — photo slider */
  gallery: [
    { src: 'assets/DSC07286.jpg', alt: 'EMERG Creative Studio & Production Workspace', badge: 'Creative Studio', title: 'Ideation & Art Direction' },
    { src: 'assets/DSC07296.jpg', alt: 'EMERG Media Production in Action', badge: 'Media Studio', title: 'High-Impact Visual Content' },
    { src: 'assets/DSC07304.jpg', alt: 'EMERG Brand Strategy & Planning', badge: 'Strategy', title: 'Architecture & Digital Blueprint' },
    { src: 'assets/DSC07316.jpg', alt: 'EMERG Digital Systems & Client Execution', badge: 'Execution', title: 'Precision Delivery & Scaling' },
    { src: 'assets/DSC07318.jpg', alt: 'EMERG Collaborative Growth Sessions', badge: 'Growth', title: 'Cross-Functional Innovation' },
  ],

  /* "Our Work" — 4 project cards, same order as on the page */
  work: [
    { src: 'assets/DSC07286.jpg', alt: 'EMERG studio creative planning and brand identity design session' },
    { src: 'assets/DSC07296.jpg', alt: 'EMERG media studio team producing visual content' },
    { src: 'assets/DSC07304.jpg', alt: 'EMERG digital strategy and web architecture planning' },
    { src: 'assets/DSC07316.jpg', alt: 'EMERG studio engineering and AI automation workflow session' },
  ],

  /* "Selected Social Work" — Instagram reel links (1, 2, 3 ya zyada) */
  reels: [
    'https://www.instagram.com/reel/DT0mnnvkjWG/',
  ],
};

/* ---------- Applies the content above to the page (no need to edit) ---------- */
(function applyEmergContent() {
  const content = window.EMERG_CONTENT;
  if (!content) return;

  const track = document.getElementById('galleryTrack');
  const dotsWrap = document.getElementById('galleryDots');
  if (track && dotsWrap && Array.isArray(content.gallery) && content.gallery.length) {
    const slideTemplate = track.querySelector('.gallery-slide');
    const dotTemplate = dotsWrap.querySelector('.gallery-dot');
    if (slideTemplate && dotTemplate) {
      track.replaceChildren();
      dotsWrap.replaceChildren();
      content.gallery.forEach((item, i) => {
        const slide = slideTemplate.cloneNode(true);
        slide.dataset.index = String(i);
        const img = slide.querySelector('.gallery-img');
        if (img) { img.src = item.src; img.alt = item.alt || ''; img.loading = i < 2 ? 'eager' : 'lazy'; img.decoding = 'async'; }
        const badge = slide.querySelector('.gallery-badge');
        if (badge) badge.textContent = item.badge || '';
        const title = slide.querySelector('.gallery-card-title');
        if (title) title.textContent = item.title || '';
        track.appendChild(slide);

        const dot = dotTemplate.cloneNode(true);
        dot.dataset.slide = String(i);
        dot.setAttribute('aria-label', `Slide ${i + 1}`);
        dot.classList.toggle('active', i === 0);
        dotsWrap.appendChild(dot);
      });
    }
  }

  if (Array.isArray(content.work)) {
    document.querySelectorAll('.project-card').forEach((card, i) => {
      const item = content.work[i];
      if (!item) return;
      card.dataset.img = item.src;
      const img = card.querySelector('.project-card-bg-img');
      if (img) { img.src = item.src; img.alt = item.alt || img.alt; }
    });
  }

  const reelsGrid = document.querySelector('#work-reels-showcase .reels-grid');
  if (reelsGrid && Array.isArray(content.reels) && content.reels.length) {
    const reelTemplate = reelsGrid.querySelector('.reel-card');
    if (reelTemplate) {
      reelsGrid.replaceChildren();
      content.reels.forEach((url, i) => {
        const card = reelTemplate.cloneNode(true);
        card.setAttribute('data-reel-url', url);
        const iframe = card.querySelector('.reel-embed-frame');
        if (iframe) { iframe.removeAttribute('src'); iframe.title = `EMERG Instagram reel ${i + 1}`; iframe.loading = 'lazy'; }
        reelsGrid.appendChild(card);
      });
      const count = content.reels.length;
      reelsGrid.classList.remove('reels-grid-single');
      reelsGrid.classList.add(`reels-count-${Math.min(count, 3)}`);
    }
  }
})();
