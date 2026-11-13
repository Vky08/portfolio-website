(() => {

  'use strict';

  const work = document.querySelector('#work');

  const about = document.querySelector('#about');

  const contact = document.querySelector('#contact');

  if (!work) return;

  const fine = matchMedia('(hover: hover) and (pointer: fine)');

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  const cursor = document.createElement('div');

  cursor.className = 'work-eyes-cursor';

  cursor.setAttribute('aria-hidden', 'true');

  const pair = document.createElement('span');

  pair.className = 'work-eyes-pair';

  for (let i = 0; i < 2; i++) {

    const eye = document.createElement('span');

    eye.className = 'work-eye';

    const pupil = document.createElement('span');

    pupil.className = 'work-eye-pupil';

    eye.append(pupil);

    pair.append(eye);

  }

  cursor.append(pair);

  document.body.append(cursor);



  const hat = document.createElement('div');

  hat.className = 'about-hat-cursor';

  hat.setAttribute('aria-hidden', 'true');

  const hatArt = document.createElement('span');

  hatArt.className = 'about-hat-art';

  for (const part of ['brim', 'crown', 'band']) {

    const shape = document.createElement('span');

    shape.className = `about-hat-${part}`;

    hatArt.append(shape);

  }

  hat.append(hatArt);

  document.body.append(hat);



  const phone = document.createElement('div');

  phone.className = 'contact-phone-cursor';

  phone.setAttribute('aria-hidden', 'true');

  const phoneArt = document.createElement('img');

  phoneArt.className = 'contact-phone-art';

  phoneArt.src = 'https://vignesh-m-creative-portfolio.netlify.app/assets/contact-phone-cursor.svg';

  phoneArt.alt = '';

  phoneArt.width = 48;

  phoneArt.height = 48;

  phone.append(phoneArt);

  document.body.append(phone);





  const halo = document.createElement('div');

  halo.className = 'smooth-pointer-halo';

  halo.setAttribute('aria-hidden', 'true');

  document.body.append(halo);

  let position = null, displayed = null, frame = null, lastTime = 0;

  function hide() {

    for (const element of [cursor, hat, phone, halo]) element.classList.remove('is-visible', 'is-interactive');

    work.classList.remove('work-eyes-active');

    about?.classList.remove('about-hat-active');

    contact?.classList.remove('contact-phone-active');

    displayed = null;

    lastTime = 0;

  }

  function render(now) {

    frame = null;

    if (!fine.matches || !position || document.hidden) { hide(); return; }

    const { x, y } = position;

    const target = document.elementFromPoint(x, y);

    const section = target?.closest('#work, #about, #contact');

    const video = target?.closest('video');

    const controls = video && y >= video.getBoundingClientRect().bottom - 56;

    if (!target || document.fullscreenElement || controls || target.closest('iframe, input, textarea, select, [contenteditable="true"]')) { hide(); return; }

    const elapsed = lastTime ? Math.min(now - lastTime, 40) : 16.67;

    const ease = reduced.matches ? 1 : 1 - Math.exp(-elapsed / 82);

    if (!displayed) displayed = { x, y };

    const oldX = displayed.x, oldY = displayed.y;

    displayed.x += (x - displayed.x) * ease;

    displayed.y += (y - displayed.y) * ease;

    const moving = Math.hypot(x - displayed.x, y - displayed.y) > .15;

    if (!moving) { displayed.x = x; displayed.y = y; }

    const isWork = section === work;

    const isAbout = section === about;

    const isContact = section === contact && phoneArt.complete && phoneArt.naturalWidth > 0;

    const isHalo = !section && !reduced.matches;

    cursor.style.transform = `translate3d(${displayed.x - 24}px, ${displayed.y - 17}px, 0)`;

    hat.style.transform = `translate3d(${displayed.x - 28}px, ${displayed.y - 22}px, 0)`;

    phone.style.transform = `translate3d(${displayed.x - 24}px, ${displayed.y - 24}px, 0)`;

    halo.style.transform = `translate3d(${displayed.x - 13}px, ${displayed.y - 13}px, 0)`;

    const interactive = !!target.closest('a, button');

    for (const [element, visible] of [[cursor,isWork],[hat,isAbout],[phone,isContact],[halo,isHalo]]) {

      element.classList.toggle('is-visible',visible);

      element.classList.toggle('is-interactive',visible && interactive);

    }

    work.classList.toggle('work-eyes-active',isWork);

    about?.classList.toggle('about-hat-active',isAbout);

    contact?.classList.toggle('contact-phone-active',isContact);

    const dx = moving && !reduced.matches ? Math.max(-3,Math.min(3,(displayed.x-oldX)*.2)) : 0;

    const dy = moving && !reduced.matches ? Math.max(-2,Math.min(2,(displayed.y-oldY)*.2)) : 0;

    cursor.style.setProperty('--pupil-x',`${dx}px`);

    cursor.style.setProperty('--pupil-y',`${dy}px`);

    hat.style.setProperty('--hat-lean',`${dx*1.5}deg`);

    phone.style.setProperty('--phone-lean',`${dx*1.5}deg`);

    lastTime = moving ? now : 0;

    if (moving) schedule();

  }

  function schedule() { if (frame === null) frame = requestAnimationFrame(render); }

  function reset() {

    position = null;

    if (frame !== null) cancelAnimationFrame(frame);

    frame = null;

    hide();

  }

  document.addEventListener('pointermove', event => {

    if (event.pointerType !== 'mouse' || !fine.matches) { reset(); return; }

    position = { x:event.clientX, y:event.clientY };

    schedule();

  }, { passive:true });

  document.addEventListener('pointerdown', event => {

    if (event.pointerType !== 'mouse' || !fine.matches) return;

    position = displayed = { x:event.clientX,y:event.clientY };

    schedule();

  }, { passive:true });

  document.documentElement.addEventListener('pointerleave',reset);

  document.addEventListener('visibilitychange',reset);

  document.addEventListener('fullscreenchange',reset);

  document.addEventListener('keydown',event=>{if(event.key==='Tab')reset();});

  window.addEventListener('blur',reset);

  window.addEventListener('scroll',schedule,{passive:true});

  window.addEventListener('resize',schedule,{passive:true});

  fine.addEventListener('change',reset);

  reduced.addEventListener('change',reset);

})();

