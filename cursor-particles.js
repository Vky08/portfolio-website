(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  if (!context) return;
  canvas.className = 'cursor-particles';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.append(canvas);

  const particles = [];
  let frame = null, previous = null, lastSpawn = 0, lastFrame = 0;
  let width = 0, height = 0;
  const enabled = () => fine.matches && !reduced.matches && !document.hidden;

  function clear() {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    particles.length = 0;
    previous = null;
    lastFrame = 0;
    context.clearRect(0, 0, width, height);
  }

  function resize() {
    clear();
    width = window.innerWidth;
    height = window.innerHeight;
    const scale = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    context.setTransform(scale, 0, 0, scale, 0, 0);
  }

  function draw(now) {
    frame = null;
    if (!enabled()) { clear(); return; }
    const step = Math.min(lastFrame ? now - lastFrame : 16, 32) / 16;
    lastFrame = now;
    context.clearRect(0, 0, width, height);
    const color = document.documentElement.dataset.theme === 'dark' ? '210,236,247' : '25,65,86';
    context.lineCap = 'round';
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      const age = (now - p.born) / p.life;
      if (age >= 1) { particles.splice(i, 1); continue; }
      p.x += p.vx * step;
      p.y += p.vy * step;
      p.vx *= Math.pow(.95, step);
      p.vy *= Math.pow(.95, step);
      const alpha = (1 - age) * .46;
      context.strokeStyle = `rgba(${color},${alpha})`;
      context.fillStyle = `rgba(${color},${alpha})`;
      if (p.fiber) {
        const length = p.length * (1 - age * .5);
        const dx = Math.cos(p.angle) * length, dy = Math.sin(p.angle) * length;
        context.lineWidth = .7;
        context.beginPath();
        context.moveTo(p.x, p.y);
        context.quadraticCurveTo(p.x + dx * .45 - dy * .2, p.y + dy * .45 + dx * .2, p.x + dx, p.y + dy);
        context.stroke();
      } else {
        context.beginPath();
        context.arc(p.x, p.y, .7, 0, Math.PI * 2);
        context.fill();
      }
    }
    if (particles.length) frame = requestAnimationFrame(draw);
    else lastFrame = 0;
  }

  document.addEventListener('pointermove', event => {
    if (!enabled() || event.pointerType === 'touch') { clear(); return; }
    // Keep the native pointer and media controls clear; particles never intercept input.
    if (event.target.closest('#work, #about, #contact, video, input, textarea, select')) { clear(); return; }
    const now = performance.now();
    if (now - lastSpawn < 30) return;
    const x = event.clientX, y = event.clientY;
    if (!previous) { previous = { x, y }; return; }
    const dx = x - previous.x, dy = y - previous.y;
    previous = { x, y };
    if (Math.hypot(dx, dy) < 2) return;
    lastSpawn = now;
    const direction = Math.atan2(dy, dx) + Math.PI;
    for (let i = 0; i < 3; i++) {
      const angle = direction + (Math.random() - .5) * 2.4;
      particles.push({
        x: x + Math.cos(angle) * 5, y: y + Math.sin(angle) * 5,
        vx: Math.cos(angle) * (.3 + Math.random() * .55),
        vy: Math.sin(angle) * (.3 + Math.random() * .55),
        angle, length: 5 + Math.random() * 10, fiber: i !== 2,
        born: now, life: 300 + Math.random() * 260
      });
    }
    if (particles.length > 42) particles.splice(0, particles.length - 42);
    if (frame === null) frame = requestAnimationFrame(draw);
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', clear);
  document.addEventListener('visibilitychange', clear);
  window.addEventListener('blur', clear);
  window.addEventListener('scroll', clear, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  reduced.addEventListener('change', clear);
  fine.addEventListener('change', clear);
  resize();
})();
