(() => {
  'use strict';
  const designs = window.graphicDesigns || [];
  const dialog = document.createElement('dialog');
  dialog.className = 'graphic-dialog'; dialog.setAttribute('aria-labelledby', 'design-preview-title');
  dialog.innerHTML = '<header class="graphic-dialog-top"><div><small>Graphic Design</small><h3 id="design-preview-title"></h3></div><button type="button" class="design-close" aria-label="Close design preview">×</button></header><div class="graphic-dialog-image"><img alt=""></div><footer class="graphic-dialog-bottom"><div class="graphic-dialog-nav"><button type="button" class="design-previous" aria-label="Previous design">←</button><span class="graphic-dialog-count" aria-live="polite"></span><button type="button" class="design-next" aria-label="Next design">→</button></div><a class="graphic-dialog-source" target="_blank" rel="noopener noreferrer">Open original ↗</a></footer>';
  document.body.append(dialog);
  let index = 0, opener = null;
  function display() {
    const item = designs[index]; if (!item) return;
    const image = dialog.querySelector('.graphic-dialog-image img'); image.src = item.src; image.alt = item.title;
    dialog.querySelector('h3').textContent = item.title;
    dialog.querySelector('.graphic-dialog-count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(designs.length).padStart(2, '0')}`;
    const link = dialog.querySelector('.graphic-dialog-source'); link.href = item.url; link.setAttribute('aria-label', `Open original ${item.title} on Google Drive (new tab)`);
  }
  function move(direction) { index = (index + direction + designs.length) % designs.length; display(); }
  function open(item, button) {
    index = designs.findIndex(design => design.id === item.id); if (index < 0) return;
    opener = button; display(); document.querySelectorAll('video').forEach(video => video.pause());
    window.featuredReelGallery?.stop(); document.body.classList.add('design-preview-open');
    dialog.showModal(); dialog.querySelector('.design-close').focus({preventScroll:true});
  }
  dialog.querySelector('.design-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.design-previous').addEventListener('click', () => move(-1));
  dialog.querySelector('.design-next').addEventListener('click', () => move(1));
  dialog.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1);
  });
  dialog.addEventListener('click', event => { const box = dialog.getBoundingClientRect(); if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.remove('design-preview-open'); opener?.focus({preventScroll:true}); });
  function createCard(item) {
    const card = document.createElement('article'); card.className = 'card design-card'; card.dataset.designId = item.id;
    const button = document.createElement('button'); button.type = 'button'; button.className = 'design-cover'; button.setAttribute('aria-label', `View ${item.title}`); button.setAttribute('aria-haspopup', 'dialog');
    const image = document.createElement('img'); image.src = item.src; image.alt = item.title; image.loading = 'lazy'; image.decoding = 'async'; image.width = item.width; image.height = item.height;
    const hint = document.createElement('span'); hint.className = 'design-view'; hint.textContent = 'View design ↗'; hint.setAttribute('aria-hidden', 'true');
    button.append(image, hint); button.addEventListener('click', () => open(item, button));
    const caption = document.createElement('div'); caption.className = 'design-caption'; caption.textContent = item.title;
    card.append(button, caption); return card;
  }
  window.graphicDesignGallery = {createCard};
})();
