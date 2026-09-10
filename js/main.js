(() => {
  const usedMaterialsButton = document.querySelector('.used-button');
  const usedMaterials = document.querySelector('#used-materials');

  if (usedMaterialsButton && usedMaterials) {
    usedMaterialsButton.addEventListener('click', () => {
      const isExpanded = usedMaterialsButton.getAttribute('aria-expanded') === 'true';
      usedMaterialsButton.setAttribute('aria-expanded', String(!isExpanded));
      usedMaterialsButton.querySelector('b').textContent = isExpanded ? '+' : '−';
      usedMaterials.hidden = isExpanded;
    });
  }

  const hero = document.querySelector('.hero');
  const desktopMotion = window.matchMedia('(min-width: 1280px)');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let disposeHeroMotion = () => {};

  const setupHeroMotion = () => {
    disposeHeroMotion();

    if (!hero || !desktopMotion.matches || reducedMotion.matches || !window.gsap) return;

    const { gsap } = window;
    const stroke = hero.querySelector('.art-stroke-orange');
    const titleChars = [...hero.querySelectorAll('.hero-char')];
    const blackTitleChars = titleChars.filter((char) => !char.closest('em'));
    const orangeTitleChars = titleChars.filter((char) => char.closest('em'));
    const artObjects = [
      { outer: '.obj-tube', inner: '.art-tube', fromY: -164, fromRotation: -2, rotation: 9, delay: .08, duration: .78, floatY: 8, floatRotation: 0, floatDuration: 3.8, depth: .8 },
      { outer: '.obj-marker', inner: '.art-marker', fromY: -220, fromRotation: 29, rotation: 17, delay: .13, duration: .72, floatY: 10, floatRotation: 0, floatDuration: 4.4, depth: 1 },
      { outer: '.obj-pencil', inner: '.art-pencil', fromY: -128, fromRotation: -23, rotation: -10, delay: .2, duration: .68, floatY: 7, floatRotation: 1.3, floatDuration: 3.2, depth: .95 },
      { outer: '.obj-palette', inner: '.art-palette', fromY: -144, fromRotation: -3, rotation: 5, delay: .17, duration: .85, floatY: 8, floatRotation: .7, floatDuration: 5, depth: .55 },
      { outer: '.obj-eraser', inner: '.art-eraser', fromY: -178, fromRotation: -25, rotation: -12, delay: .27, duration: .75, floatY: 8, floatRotation: .7, floatDuration: 4.1, depth: .75 },
      { outer: '.obj-ribbon', inner: '.art-ribbon-blue', fromY: -110, fromRotation: 2, rotation: -8, delay: .24, duration: .8, floatY: 9, floatRotation: 0, floatDuration: 4.8, depth: .35 },
      { outer: '.obj-blob-orange', inner: '.blob-orange', fromY: -96, fromRotation: 8, rotation: 26, delay: .22, duration: .55, floatY: 10, floatRotation: 0, floatDuration: 3.6, depth: .62 },
      { outer: '.obj-blob-yellow', inner: '.blob-yellow', fromY: -80, fromRotation: -46, rotation: -29, delay: .16, duration: .52, floatY: 9, floatRotation: 0, floatDuration: 3.4, depth: .58 },
      { outer: '.obj-blob-blue', inner: '.blob-blue', fromY: -104, fromRotation: 10, rotation: 27, delay: .29, duration: .58, floatY: 12, floatRotation: 0, floatDuration: 4.6, depth: .7 }
    ].map((item) => ({ ...item, outerElement: hero.querySelector(item.outer), innerElement: hero.querySelector(item.inner) }))
      .filter((item) => item.outerElement && item.innerElement);
    const card = { outerElement: hero.querySelector('.obj-card'), innerElement: hero.querySelector('.art-card') };
    const floatingTweens = [];

    gsap.set(stroke, { autoAlpha: 1, clipPath: 'inset(0 100% 0 0)' });
    titleChars.forEach((char) => {
      gsap.set(char, {
        autoAlpha: 0,
        y: gsap.utils.random(-180, -80, 1),
        rotation: gsap.utils.random(-8, 8, 1),
        transformOrigin: 'center bottom'
      });
    });
    gsap.set(artObjects.map((item) => item.innerElement), { autoAlpha: 0 });
    artObjects.forEach((item) => gsap.set(item.innerElement, { y: item.fromY, rotation: item.fromRotation }));
    if (card.outerElement && card.innerElement) gsap.set(card.innerElement, { autoAlpha: 0, y: -95, rotation: -23 });

    const timeline = gsap.timeline();
    gsap.utils.shuffle(blackTitleChars).forEach((char, index) => {
      timeline.to(char, {
        y: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: gsap.utils.random(.48, .58, .01),
        ease: 'back.out(1.35)'
      }, .02 + index * .04);
    });
    gsap.utils.shuffle(orangeTitleChars).forEach((char, index) => {
      timeline.to(char, {
        y: 0,
        rotation: 0,
        autoAlpha: 1,
        duration: gsap.utils.random(.48, .58, .01),
        ease: 'back.out(1.45)'
      }, .02 + blackTitleChars.length * .04 + .13 + index * .04);
    });
    timeline.to(stroke, { clipPath: 'inset(0 0% 0 0)', duration: .72, ease: 'power2.out' }, .42);
    artObjects.forEach((item) => {
      timeline.to(item.innerElement, { y: 0, rotation: item.rotation, autoAlpha: 1, duration: item.duration, ease: 'back.out(1.12)' }, .5 + item.delay);
    });
    if (card.outerElement && card.innerElement) {
      timeline.to(card.innerElement, { y: 0, rotation: -14, autoAlpha: 1, duration: .62, ease: 'back.out(1.06)' }, '+=.06');
    }
    timeline.call(() => {
      artObjects.forEach((item) => {
        floatingTweens.push(gsap.to(item.innerElement, {
          y: -item.floatY,
          rotation: item.rotation + item.floatRotation,
          duration: item.floatDuration,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        }));
      });
      if (card.outerElement && card.innerElement) {
        floatingTweens.push(gsap.to(card.innerElement, { y: -5, rotation: -13.4, duration: 4.7, ease: 'sine.inOut', repeat: -1, yoyo: true }));
      }
    });

    const parallaxItems = [{ outerElement: hero.querySelector('.obj-stroke'), depth: .2 }, ...artObjects];
    const moveParallax = (event) => {
      const bounds = hero.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      parallaxItems.forEach((item) => {
        if (!item.outerElement) return;
        gsap.to(item.outerElement, { x: x * 16 * item.depth, y: y * 16 * item.depth, duration: .7, ease: 'power2.out', overwrite: 'auto' });
      });
    };
    const resetParallax = () => parallaxItems.forEach((item) => item.outerElement && gsap.to(item.outerElement, { x: 0, y: 0, duration: .9, ease: 'power2.out', overwrite: 'auto' }));

    hero.addEventListener('pointermove', moveParallax);
    hero.addEventListener('pointerleave', resetParallax);
    disposeHeroMotion = () => {
      timeline.kill();
      floatingTweens.forEach((tween) => tween.kill());
      hero.removeEventListener('pointermove', moveParallax);
      hero.removeEventListener('pointerleave', resetParallax);
      gsap.set(stroke, { clearProps: 'clipPath,opacity,visibility' });
      gsap.set(titleChars, { clearProps: 'transform,opacity,visibility' });
      gsap.set(artObjects.map((item) => [item.outerElement, item.innerElement]).flat(), { clearProps: 'transform,opacity,visibility' });
      if (card.outerElement && card.innerElement) gsap.set([card.outerElement, card.innerElement], { clearProps: 'transform,opacity,visibility' });
      disposeHeroMotion = () => {};
    };
  };

  window.addEventListener('load', setupHeroMotion, { once: true });
  desktopMotion.addEventListener('change', setupHeroMotion);
  reducedMotion.addEventListener('change', setupHeroMotion);

  const floatingPaintConfigs = [
    { name: 'blue', selector: '.floating-paint--blue', shadowSelector: '.floating-paint-shadow--blue', startX: 212, startY: 22, speedX: -.029, speedY: .025, rotation: -18, rotationRange: 12, rotationVelocity: .0024, scale: 1 },
    { name: 'sepia', selector: '.floating-paint--sepia', shadowSelector: '.floating-paint-shadow--sepia', startX: 18, startY: 370, speedX: .036, speedY: -.021, rotation: 28, rotationRange: 14, rotationVelocity: -.0021, scale: 1 },
    { name: 'vermilion', selector: '.floating-paint--vermilion', shadowSelector: '.floating-paint-shadow--vermilion', startX: 278, startY: 385, speedX: -.024, speedY: -.034, rotation: -32, rotationRange: 13, rotationVelocity: .0027, scale: 1 }
  ];
  const featureArt = document.querySelector('.feature-art');
  let disposeFloatingPaint = () => {};

  const setupFloatingPaint = () => {
    disposeFloatingPaint();
    if (!featureArt || !desktopMotion.matches || reducedMotion.matches) return;

    const paints = floatingPaintConfigs.map((config) => {
      const element = featureArt.querySelector(config.selector);
      const shadow = featureArt.querySelector(config.shadowSelector);
      return element ? { ...config, element, shadow, x: config.startX, y: config.startY, velocityX: config.speedX, velocityY: config.speedY, baseRotation: config.rotation, rotation: config.rotation, rotationVelocity: config.rotationVelocity } : null;
    }).filter(Boolean);
    if (!paints.length) return;

    let previousTime = 0;
    let frameId = 0;
    const getBounds = (paint) => {
      const radians = Math.abs(paint.rotation) * Math.PI / 180;
      const width = paint.element.offsetWidth * paint.scale;
      const height = paint.element.offsetHeight * paint.scale;
      const visualWidth = Math.abs(width * Math.cos(radians)) + Math.abs(height * Math.sin(radians));
      const visualHeight = Math.abs(width * Math.sin(radians)) + Math.abs(height * Math.cos(radians));
      const extraX = (visualWidth - width) / 2;
      const extraY = (visualHeight - height) / 2;
      return { width, height, minX: extraX, maxX: Math.max(extraX, featureArt.clientWidth - width - extraX), minY: extraY, maxY: Math.max(extraY, featureArt.clientHeight - height - extraY), left: paint.x - extraX, right: paint.x - extraX + visualWidth, top: paint.y - extraY, bottom: paint.y - extraY + visualHeight };
    };
    const containPaint = (paint) => {
      const bounds = getBounds(paint);
      paint.x = Math.min(Math.max(paint.x, bounds.minX), bounds.maxX);
      paint.y = Math.min(Math.max(paint.y, bounds.minY), bounds.maxY);
    };
    const nudgeRotation = (paint) => {
      paint.rotationVelocity = Math.min(Math.max(-paint.rotationVelocity + (Math.random() - .5) * .0014, -.004), .004);
    };
    const resolvePaintCollision = (first, second) => {
      const a = getBounds(first);
      const b = getBounds(second);
      const overlapX = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const overlapY = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (overlapX <= 0 || overlapY <= 0) return;
      if (overlapX < overlapY) {
        const direction = a.left < b.left ? -1 : 1;
        first.x += direction * overlapX / 2;
        second.x -= direction * overlapX / 2;
        first.velocityX *= -1;
        second.velocityX *= -1;
      } else {
        const direction = a.top < b.top ? -1 : 1;
        first.y += direction * overlapY / 2;
        second.y -= direction * overlapY / 2;
        first.velocityY *= -1;
        second.velocityY *= -1;
      }
      nudgeRotation(first);
      nudgeRotation(second);
      containPaint(first);
      containPaint(second);
    };
    const frame = (time) => {
      const delta = previousTime ? Math.min(time - previousTime, 34) : 16;
      previousTime = time;
      paints.forEach((paint) => {
        paint.rotation += paint.rotationVelocity * delta;
        const minRotation = paint.baseRotation - paint.rotationRange;
        const maxRotation = paint.baseRotation + paint.rotationRange;
        if (paint.rotation <= minRotation || paint.rotation >= maxRotation) {
          paint.rotation = Math.min(Math.max(paint.rotation, minRotation), maxRotation);
          paint.rotationVelocity *= -1;
        }
        const bounds = getBounds(paint);
        paint.x += paint.velocityX * delta;
        paint.y += paint.velocityY * delta;
        if (paint.x <= bounds.minX || paint.x >= bounds.maxX) { paint.x = Math.min(Math.max(paint.x, bounds.minX), bounds.maxX); paint.velocityX *= -1; nudgeRotation(paint); }
        if (paint.y <= bounds.minY || paint.y >= bounds.maxY) { paint.y = Math.min(Math.max(paint.y, bounds.minY), bounds.maxY); paint.velocityY *= -1; nudgeRotation(paint); }
      });
      for (let firstIndex = 0; firstIndex < paints.length; firstIndex += 1) for (let secondIndex = firstIndex + 1; secondIndex < paints.length; secondIndex += 1) resolvePaintCollision(paints[firstIndex], paints[secondIndex]);
      paints.forEach((paint) => {
        const bounds = getBounds(paint);
        paint.element.style.transform = `translate3d(${paint.x}px, ${paint.y}px, 0) rotate(${paint.rotation}deg) scale(${paint.scale})`;
        if (paint.shadow) {
          paint.shadow.style.width = `${bounds.width * .62}px`;
          paint.shadow.style.transform = `translate3d(${paint.x + bounds.width * .19}px, ${paint.y + bounds.height * .86}px, 0)`;
        }
      });
      frameId = window.requestAnimationFrame(frame);
    };
    paints.forEach((paint) => {
      paint.element.style.left = '0px';
      paint.element.style.top = '0px';
      if (paint.shadow) { paint.shadow.style.left = '0px'; paint.shadow.style.top = '0px'; }
      containPaint(paint);
    });
    frameId = window.requestAnimationFrame(frame);
    const resizeObserver = new ResizeObserver(() => paints.forEach(containPaint));
    resizeObserver.observe(featureArt);
    disposeFloatingPaint = () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      paints.forEach((paint) => {
        paint.element.style.removeProperty('left');
        paint.element.style.removeProperty('top');
        paint.element.style.removeProperty('transform');
        if (paint.shadow) { paint.shadow.style.removeProperty('left'); paint.shadow.style.removeProperty('top'); paint.shadow.style.removeProperty('width'); paint.shadow.style.removeProperty('transform'); }
      });
      disposeFloatingPaint = () => {};
    };
  };

  window.addEventListener('load', setupFloatingPaint, { once: true });
  desktopMotion.addEventListener('change', setupFloatingPaint);
  reducedMotion.addEventListener('change', setupFloatingPaint);

  const startPaths = document.querySelector('.start-paths');
  let disposeStartAccordion = () => {};

  const setupStartAccordion = () => {
    disposeStartAccordion();
    if (!startPaths || !desktopMotion.matches) return;

    const panels = [...startPaths.querySelectorAll('[data-start-panel]')];
    const canAnimate = Boolean(window.gsap) && !reducedMotion.matches;
    const revealItems = (panel) => [...panel.querySelectorAll('.panel-keywords,.panel-label,.artwork-placeholder,.visual-item img')];
    const activate = (panel) => {
      panels.forEach((item) => item.classList.toggle('is-active', item === panel));
      if (!canAnimate) return;
      const items = revealItems(panel);
      window.gsap.killTweensOf(items);
      window.gsap.to(items, { autoAlpha: 1, y: 0, rotation: 0, duration: .46, stagger: .055, ease: 'power3.out', overwrite: 'auto' });
    };
    const reset = () => {
      panels.forEach((panel) => panel.classList.remove('is-active'));
      if (!canAnimate) return;
      panels.forEach((panel) => window.gsap.to(revealItems(panel), { autoAlpha: 0, y: 20, duration: .2, ease: 'power2.in', overwrite: 'auto' }));
    };
    const onPointerLeave = () => reset();
    const onFocusOut = () => requestAnimationFrame(() => {
      if (!startPaths.contains(document.activeElement)) reset();
    });

    if (canAnimate) {
      panels.forEach((panel) => window.gsap.set(revealItems(panel), { autoAlpha: 0, y: 24, rotation: -1 }));
    }
    const panelHandlers = panels.map((panel) => ({ panel, pointerEnter: () => activate(panel), focus: () => activate(panel) }));
    panelHandlers.forEach(({ panel, pointerEnter, focus }) => {
      panel.addEventListener('pointerenter', pointerEnter);
      panel.addEventListener('focus', focus);
      panel.addEventListener('focusout', onFocusOut);
    });
    startPaths.addEventListener('pointerleave', onPointerLeave);

    disposeStartAccordion = () => {
      panelHandlers.forEach(({ panel, pointerEnter, focus }) => {
        panel.classList.remove('is-active');
        panel.removeEventListener('pointerenter', pointerEnter);
        panel.removeEventListener('focus', focus);
        panel.removeEventListener('focusout', onFocusOut);
        if (window.gsap) window.gsap.set(revealItems(panel), { clearProps: 'transform,opacity,visibility' });
      });
      startPaths.removeEventListener('pointerleave', onPointerLeave);
      disposeStartAccordion = () => {};
    };
  };

  window.addEventListener('load', setupStartAccordion, { once: true });
  desktopMotion.addEventListener('change', setupStartAccordion);
  reducedMotion.addEventListener('change', setupStartAccordion);
})();
