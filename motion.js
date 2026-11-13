(() => {

  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!('IntersectionObserver' in window)) return;



  const activeAnimations = new Set();

  const registered = new WeakSet();

  const revealStates = new WeakMap();

  const revealSelector = '.showreel-heading, .showreel-player, .hero-mobile-copy > p, .hero-tools, .skills-intro > .section-lead, .skills-intro > .muted, .skills-groups > div, .work-heading, .work-controls, .ai-collection-intro, #work-grid > .card, .details > div, .metric-grid > div, .contact-inner > div, footer';



  function cancelReveal(element) {

    const state = revealStates.get(element);

    if (!state) return;

    state.inView = false;

    state.animation?.cancel();

  }



  const revealObserver = new IntersectionObserver(entries => {

    for (const entry of entries) {

      const element = entry.target;

      const state = revealStates.get(element);

      if (!state) continue;

      // Re-arm only once the element has left the viewport, avoiding scroll jitter.

      if (!entry.isIntersecting) { cancelReveal(element); continue; }

      if (state.inView) continue;

      state.inView = true;

      if (reducedMotion.matches || typeof element.animate !== 'function') continue;

      const isMetric = element.classList.contains('metric-tile');

      const index = Array.from(element.parentElement.children).indexOf(element);

      const stagger = isMetric ? (index % 4) * 75 : element.classList.contains('card') ? (index % 3) * 60 : 0;

      const animation = element.animate([

        { opacity: 0, translate: '0 28px' },

        { opacity: 1, translate: '0 0' }

      ], {

        duration: 780,

        delay: stagger,

        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',

        fill: 'backwards'

      });

      animation.id = 'portfolio-slide-in';

      state.animation = animation;

      activeAnimations.add(animation);

      animation.onfinish = animation.oncancel = () => {

        activeAnimations.delete(animation);

        if (state.animation === animation) state.animation = null;

      };

    }

  }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });



  function observeReveals() {

    document.querySelectorAll(revealSelector).forEach(element => {

      if (registered.has(element)) return;

      registered.add(element);

      revealStates.set(element, { inView: false, animation: null });

      revealObserver.observe(element);

    });

  }

  observeReveals();

  const workGrid = document.querySelector('#work-grid');

  if (workGrid) {

    new MutationObserver(records => {

      records.forEach(record => record.removedNodes.forEach(node => {

        if (node.nodeType === 1) {

          cancelReveal(node);

          revealObserver.unobserve(node);

        }

      }));

      observeReveals();

    }).observe(workGrid, { childList: true });

  }



  const metricGrid = document.querySelector('.metric-grid');

  if (!metricGrid) return;

  const formatter = new Intl.NumberFormat('en-US');

  const compactFormatter = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

  const counters = [];

  let frame = null;

  let counted = false;



  function finishCounters() {

    if (frame !== null) cancelAnimationFrame(frame);

    frame = null;

    counters.forEach(counter => { counter.display.textContent = counter.finalText; });

  }



  const counterObserver = new IntersectionObserver(entries => {

    if (counted || !entries.some(entry => entry.isIntersecting)) return;

    counted = true;

    counterObserver.disconnect();

    if (reducedMotion.matches) return;

    metricGrid.querySelectorAll('strong').forEach(element => {

      const finalText = element.textContent.trim();

      const parts = (element.dataset.count || finalText).match(/^([\d,]+)(\+?)$/);

      if (!parts) return;

      const target = Number(parts[1].replace(/,/g, ''));

      const suffix = element.dataset.suffix || parts[2];

      const numberFormatter = element.dataset.format === 'compact' ? compactFormatter : formatter;

      const display = document.createElement('span');

      display.className = 'metric-value';

      display.setAttribute('aria-hidden', 'true');

      display.textContent = '0' + suffix;

      const accessible = document.createElement('span');

      accessible.className = 'visually-hidden';

      accessible.textContent = formatter.format(target) + parts[2];

      element.replaceChildren(display, accessible);

      counters.push({ display, target, finalText, suffix, numberFormatter });

    });

    let started = null;

    function tick(now) {

      if (reducedMotion.matches) { finishCounters(); return; }

      if (started === null) started = now;

      const progress = Math.min((now - started) / 1500, 1);

      const eased = 1 - Math.pow(1 - progress, 3);

      counters.forEach(counter => {

        counter.display.textContent = counter.numberFormatter.format(Math.round(counter.target * eased)) + counter.suffix;

      });

      if (progress < 1) frame = requestAnimationFrame(tick);

      else finishCounters();

    }

    frame = requestAnimationFrame(tick);

  }, { threshold: 0.2 });

  counterObserver.observe(metricGrid);



  reducedMotion.addEventListener('change', event => {

    if (!event.matches) return;

    activeAnimations.forEach(animation => animation.cancel());

    activeAnimations.clear();

    finishCounters();

  });

})();

