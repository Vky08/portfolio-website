(() => {
  const tools = document.querySelectorAll('.tool-chip');
  tools.forEach(tool => {
    tool.addEventListener('click', () => {
      const show = tool.getAttribute('aria-pressed') !== 'true';
      tools.forEach(other => other.setAttribute('aria-pressed', String(other === tool && show)));
    });
    tool.addEventListener('keydown', event => {
      if (event.key === 'Escape') tool.setAttribute('aria-pressed', 'false');
    });
  });
  document.addEventListener('pointerdown', event => {
    if (!event.target.closest('.tool-chip')) tools.forEach(tool => tool.setAttribute('aria-pressed', 'false'));
  });
})();

