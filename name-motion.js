(() => {
  'use strict';
  const name = document.querySelector('#hero-title');
  if (!name) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const label = name.textContent.trim();
  let letterIndex = 0;
  let finishTimer;
  let inView = false;

  // Keep the heading readable without JavaScript and announce the full name once.
  const fragment = document.createDocumentFragment();
  for (const node of Array.from(name.childNodes)) {
    const pieces = (node.textContent || '').split(/(\s+)/);
    for (const piece of pieces) {
      if (!piece) continue;
      if (/^\s+$/.test(piece)) {
        fragment.append(document.createTextNode(piece));
        continue;
      }
      const word = document.createElement(node.nodeType === 1 ? node.tagName.toLowerCase() : 'span');
      word.className = 'name-word';
      word.setAttribute('aria-hidden', 'true');
      for (const character of piece) {
        const letter = document.createElement('span');
        letter.className = 'name-letter';
        letter.textContent = character;
        letter.style.setProperty('--letter-index', letterIndex++);
        word.append(letter);
      }
      fragment.append(word);
    }
  }
  name.setAttribute('aria-label', label);
  name.replaceChildren(fragment);
  name.classList.add('animated-name');

  function finish() {
    clearTimeout(finishTimer);
    name.classList.remove('name-revealing');
  }

  function reveal() {
    if (reducedMotion.matches || document.hidden || name.classList.contains('name-revealing')) return;
    name.classList.add('name-revealing');
    finishTimer = setTimeout(finish, 920 + letterIndex * 55);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting && !inView) reveal();
        if (!entry.isIntersecting) finish();
        inView = entry.isIntersecting;
      }
    }, { threshold: 0.35 }).observe(name);
  } else {
    reveal();
  }

  name.addEventListener('pointerenter', event => {
    if (finePointer.matches && event.pointerType !== 'touch') reveal();
  });
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) finish(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden) finish(); });
})();
