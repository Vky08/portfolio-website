(() => {

  const sections = document.querySelectorAll('.skills, .work, .details, .metrics, .contact');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const fine = matchMedia('(hover: hover) and (pointer: fine)');

  let active = null, tile = null, frame = null, x = 0, y = 0;

  let portraitX = 0, portraitY = 0, portraitReady = false, lastFrameTime = 0;

  sections.forEach(section => section.classList.add('ambient-section'));

  function clear() {

    if (frame !== null) cancelAnimationFrame(frame);

    frame = null;

    if (active) active.classList.remove('glow-active');

    if (tile) tile.classList.remove('metric-hover');

    active = null;

    tile = null;

    portraitReady = false;

    lastFrameTime = 0;

  }

  function paint(time) {

    frame = null;

    if (!active) return;

    const bounds = active.getBoundingClientRect();

    const localX = x - bounds.left, localY = y - bounds.top;

    active.style.setProperty('--glow-x', `${localX}px`);

    active.style.setProperty('--glow-y', `${localY}px`);

    let following = false;

    if (active.classList.contains('details')) {

      if (!portraitReady) {

        portraitX = localX;

        portraitY = localY;

        portraitReady = true;

      } else {

        // Frame-rate independent easing; stop rendering once the spotlight settles.

        const elapsed = lastFrameTime ? Math.min(time - lastFrameTime, 40) : 16;

        const ease = 1 - Math.exp(-elapsed / 55);

        portraitX += (localX - portraitX) * ease;

        portraitY += (localY - portraitY) * ease;

        following = Math.hypot(localX - portraitX, localY - portraitY) > .2;

        if (!following) { portraitX = localX; portraitY = localY; }

      }

      active.style.setProperty('--portrait-x', `${portraitX}px`);

      active.style.setProperty('--portrait-y', `${portraitY}px`);

    }

    active.classList.add('glow-active');

    if (tile) {

      const tileBounds = tile.getBoundingClientRect();

      const horizontal = Math.max(-1, Math.min(1, (x - tileBounds.left) / tileBounds.width * 2 - 1));

      const vertical = Math.max(-1, Math.min(1, (y - tileBounds.top) / tileBounds.height * 2 - 1));

      tile.style.setProperty('--tilt-x', `${-vertical * 2}deg`);

      tile.style.setProperty('--tilt-y', `${horizontal * 2}deg`);

      tile.classList.add('metric-hover');

    }

    lastFrameTime = following ? time : 0;

    if (following) frame = requestAnimationFrame(paint);

  }

  document.addEventListener('pointermove', event => {

    if (reduced.matches || !fine.matches || event.pointerType === 'touch') { clear(); return; }

    const section = event.target.closest('.ambient-section');

    if (!section) { clear(); return; }

    if (active !== section) {

      if (active) active.classList.remove('glow-active');

      active = section;

      portraitReady = false;

      lastFrameTime = 0;

    }

    const nextTile = event.target.closest('.metric-tile');

    if (tile !== nextTile) {

      if (tile) tile.classList.remove('metric-hover');

      tile = nextTile;

    }

    x = event.clientX; y = event.clientY;

    if (frame !== null) return;

    frame = requestAnimationFrame(paint);

  }, { passive: true });

  document.documentElement.addEventListener('pointerleave', clear);

  window.addEventListener('blur', clear);

  window.addEventListener('scroll', clear, { passive: true });

  reduced.addEventListener('change', clear);

  fine.addEventListener('change', clear);

})();

