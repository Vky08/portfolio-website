(() => {

  const section = document.querySelector('#brands');

  if (!section) return;

  const observer = new IntersectionObserver(entries => {

    section.dataset.inView = String(entries[0].isIntersecting && !document.hidden);

  }, {rootMargin: '60px'});

  observer.observe(section);

  document.addEventListener('visibilitychange', () => {

    const rect = section.getBoundingClientRect();

    section.dataset.inView = String(!document.hidden && rect.bottom > 0 && rect.top < innerHeight);

  });

})();

