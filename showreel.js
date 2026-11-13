(() => {
  'use strict';
  const showreel = document.querySelector('#showreel-video');
  if (!showreel) return;
  // Keep the showreel and gallery players from running over one another.
  document.addEventListener('play', event => {
    if (!(event.target instanceof HTMLVideoElement)) return;
    document.querySelectorAll('video').forEach(video => {
      if (video !== event.target) video.pause();
    });
  }, true);
  showreel.addEventListener('error', () => {
    const fallback = document.querySelector('.showreel-fallback');
    if (fallback) fallback.hidden = false;
  });
})();
