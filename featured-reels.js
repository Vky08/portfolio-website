(() => {

  'use strict';

  const section = document.querySelector('#featured-reels');

  const track = document.querySelector('#featured-reels-track');

  if (!section || !track) return;

  const previous = section.querySelector('[data-reel-direction="-1"]');

  const next = section.querySelector('[data-reel-direction="1"]');

  const status = section.querySelector('.featured-reels-status');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const items = window.featuredReels || [];

  const toggle = document.createElement('button');

  toggle.type = 'button'; toggle.className = 'featured-reels-toggle';

  section.querySelector('.featured-reels-actions').insertBefore(toggle, previous);

  let userPaused = false, hovered = false, focused = false, inView = false, frameId = 0, lastTime = 0, offset = 0, pauseUntil = 0, resumeTimer = 0;

  let activeCard = null;

  function stop() {

    if (!activeCard) return;

    activeCard.querySelector('video')?.pause();

    activeCard.querySelector('iframe, video')?.remove();

    activeCard.querySelector('.featured-reel-cover').hidden = false;

    activeCard.classList.remove('is-playing');

    if (activeCard.dataset.loopCopy) activeCard.setAttribute('aria-hidden', 'true');

    activeCard = null;

    syncMotion();

  }

  function createCard(item) {

    const card = document.createElement('article');

    card.className = 'card featured-reel-card';

    card.dataset.reelId = item.id;

    const cover = document.createElement('button');

    cover.type = 'button'; cover.className = 'featured-reel-cover';

    cover.setAttribute('aria-label', `Play ${item.title}`);

    const poster = document.createElement('img');

    poster.src = item.poster; poster.alt = ''; poster.loading = 'lazy';

    const play = document.createElement('span');

    play.className = 'featured-reel-play'; play.textContent = '▶'; play.setAttribute('aria-hidden', 'true');

    cover.append(poster, play);

    const label = document.createElement('h4');

    label.className = 'featured-reel-title'; label.textContent = item.title;

    const source = document.createElement('a');

    source.className = 'video-source'; source.href = item.url; source.target = '_blank'; source.rel = 'noopener noreferrer'; source.textContent = '↗';

    source.setAttribute('aria-label', `Open original ${item.title} (new tab)`);

    cover.addEventListener('click', () => {

      stop(); document.querySelectorAll('video').forEach(video => video.pause());

      const frame = document.createElement(item.src ? 'video' : 'iframe');

      if (item.src) {

        frame.src = item.src; frame.poster = item.poster; frame.controls = true; frame.playsInline = true;

        frame.setAttribute('aria-label', item.title);

      } else {

        frame.src = item.embedUrl; frame.title = item.title;

        frame.allow = 'autoplay; encrypted-media; fullscreen; picture-in-picture';

        frame.allowFullscreen = true; frame.referrerPolicy = 'strict-origin-when-cross-origin';

      }

      card.insertBefore(frame, source); cover.hidden = true; card.classList.add('is-playing'); activeCard = card;

      card.removeAttribute('aria-hidden'); syncMotion();

      frame.focus();

      if (item.src) frame.play().catch(() => {});

    });

    card.append(cover, label, source); return card;

  }

  items.forEach(item => track.append(createCard(item)));

  // A second visual copy makes the end join the beginning without a rewind.

  // Only the original cards are in the keyboard/screen-reader order.

  items.forEach(item => {

    const copy = createCard(item); copy.dataset.loopCopy = 'true'; copy.setAttribute('aria-hidden', 'true');

    copy.querySelectorAll('button, a').forEach(el => el.tabIndex = -1); track.append(copy);

  });

  function stepWidth() { return (track.firstElementChild?.getBoundingClientRect().width || 1) + parseFloat(getComputedStyle(track).columnGap || 0); }

  function canMove() { return !section.hidden && inView && !document.hidden && !reduced.matches && !userPaused && !hovered && !focused && !activeCard && performance.now() >= pauseUntil; }

  function tick(now) {

    frameId = 0;

    if (!canMove()) { lastTime = 0; return; }

    const cycle = stepWidth() * items.length;

    offset += Math.min(lastTime ? now - lastTime : 0, 50) * .024;

    if (offset >= cycle) offset -= cycle;

    track.scrollLeft = offset; lastTime = now; frameId = requestAnimationFrame(tick);

  }

  function syncMotion() {

    toggle.textContent = userPaused ? '▶' : 'Ⅱ';

    toggle.setAttribute('aria-label', userPaused ? 'Resume automatic reel scrolling' : 'Pause automatic reel scrolling');

    toggle.setAttribute('aria-pressed', String(userPaused));

    toggle.hidden = reduced.matches;

    if (canMove()) { if (!frameId) { offset = track.scrollLeft; lastTime = 0; frameId = requestAnimationFrame(tick); } }

    else { cancelAnimationFrame(frameId); frameId = 0; lastTime = 0; }

  }

  function interact() { pauseUntil = performance.now() + 4000; clearTimeout(resumeTimer); resumeTimer = setTimeout(syncMotion, 4050); syncMotion(); }

  function update() {

    previous.disabled = next.disabled = items.length < 2;

    const step = stepWidth();

    const current = Math.floor((track.scrollLeft + 2) / step) % items.length + 1;

    status.textContent = `${String(current).padStart(2, '0')} / ${String(items.length).padStart(2, '0')}`;

    if (activeCard && track.contains(activeCard)) {

      const a = activeCard.getBoundingClientRect(), b = track.getBoundingClientRect();

      if (a.right < b.left + 20 || a.left > b.right - 20) stop();

    }

  }

  function slide(direction) {

    interact();

    const first = track.firstElementChild;

    if (!first) return;

    const step = stepWidth(), cycle = step * items.length;

    if (track.scrollLeft >= cycle - 2) track.scrollLeft -= cycle;

    if (direction < 0 && track.scrollLeft < 2) track.scrollLeft = cycle;

    track.scrollBy({left: direction * step, behavior: reduced.matches ? 'auto' : 'smooth'});

  }

  toggle.addEventListener('click', () => { userPaused = !userPaused; syncMotion(); });

  section.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') { hovered = true; syncMotion(); } });

  section.addEventListener('pointerleave', () => { hovered = false; syncMotion(); });

  section.addEventListener('focusin', () => { focused = true; syncMotion(); });

  section.addEventListener('focusout', () => { setTimeout(() => { focused = section.contains(document.activeElement); syncMotion(); }, 0); });

  track.addEventListener('pointerdown', interact, {passive: true});

  track.addEventListener('wheel', interact, {passive: true});

  if ('IntersectionObserver' in window) new IntersectionObserver(entries => { inView = entries[0].isIntersecting; syncMotion(); }, {threshold: .1}).observe(section);

  else inView = true;

  reduced.addEventListener('change', syncMotion);

  previous.addEventListener('click', () => slide(-1));

  next.addEventListener('click', () => slide(1));

  track.addEventListener('scroll', update, {passive: true});

  track.addEventListener('keydown', event => {

    if (event.target !== track || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;

    event.preventDefault(); slide(event.key === 'ArrowRight' ? 1 : -1);

  });

  window.addEventListener('resize', update, {passive: true});

  document.addEventListener('play', event => {if (event.target instanceof HTMLVideoElement && !activeCard?.contains(event.target)) stop()}, true);

  document.addEventListener('visibilitychange', () => {if (document.hidden) stop(); syncMotion()});

  window.featuredReelGallery = {

    createCard,

    setVisible(visible) { stop(); section.hidden = !visible; syncMotion(); if (visible) requestAnimationFrame(update) },

    stop

  };

})();

