(() => {
  'use strict';
  const hero = document.querySelector('.hero-orbits');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (hero) {
    hero.dataset.animated = String(!reduced.matches);
    if ('IntersectionObserver' in window && !reduced.matches) {
      const observer = new IntersectionObserver(entries => {
        if (entries.some(entry => entry.isIntersecting)) {
          hero.classList.add('is-drawing');
          observer.disconnect();
        }
      }, { threshold: .12 });
      observer.observe(hero);
    } else hero.classList.add('is-drawing');
  }
  const field = document.createElement('div');
  field.className = 'ambient-floating-particles';
  field.setAttribute('aria-hidden', 'true');
  for (let i = 0; i < 16; i++) {
    const dot = document.createElement('i');
    dot.style.cssText = `--x:${4 + ((i * 37) % 92)}%;--drift:${(i % 2 ? -1 : 1) * (18 + i * 2)}px;--duration:${100 + (i * 13) % 65}s;--delay:-${(i * 23 + 17) % 140}s;--size:${i % 4 === 0 ? 2 : 1.3}px`;
    field.append(dot);
  }
  document.body.append(field);
  function visibility() { document.documentElement.dataset.ambientPaused = String(document.hidden); }
  function playback() {
    const playing = Array.from(document.querySelectorAll('video')).some(video => !video.paused && !video.ended);
    document.body.classList.toggle('has-active-video', playing || !!document.fullscreenElement);
    document.querySelectorAll('.platform-hover-target').forEach(target => {
      const video = target.querySelector('video');
      if (video) target.dataset.videoPlaying = String(!video.paused && !video.ended);
    });
  }
  function decorate() {
    document.querySelectorAll('[data-filter="youtube"], [data-filter="instagram"], #work-grid .instagram-card, #work-grid a.card[href*="youtu"]').forEach(target => {
      if (target.dataset.hoverPlatform) return;
      const platform = target.matches('[data-filter="instagram"], .instagram-card') ? 'instagram' : 'youtube';
      target.dataset.hoverPlatform = platform;
      target.classList.add('platform-hover-target');
      const popup = document.createElement('span');
      popup.className = 'platform-hover-icon';
      popup.setAttribute('aria-hidden', 'true');
      const icon = document.createElement('img');
      icon.src = `https://vignesh-m-creative-portfolio.netlify.app/assets/platform-${platform}.svg`;
      icon.alt = '';
      icon.width = icon.height = 28;
      popup.append(icon);
      target.append(popup);
    });
  }
  decorate(); visibility(); playback();
  const grid = document.querySelector('#work-grid');
  if (grid) new MutationObserver(decorate).observe(grid, { childList: true });
  document.addEventListener('visibilitychange', visibility);
  document.addEventListener('fullscreenchange', playback);
  for (const event of ['play', 'pause', 'ended']) document.addEventListener(event, playback, true);
})();
