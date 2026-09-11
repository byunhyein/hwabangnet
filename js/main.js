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
    { name: 'blue', selector: '.floating-paint--blue', shadowSelector: '.floating-paint-shadow--blue', startX: 212, startY: 22, speedX: -.029, speedY: .025, rotation: -18, scale: 1, alphaBounds: { left: .051, top: .048, right: .992, bottom: .952 } },
    { name: 'sepia', selector: '.floating-paint--sepia', shadowSelector: '.floating-paint-shadow--sepia', startX: 18, startY: 370, speedX: .036, speedY: -.021, rotation: 28, scale: 1, alphaBounds: { left: .041, top: .028, right: .978, bottom: .953 } },
    { name: 'vermilion', selector: '.floating-paint--vermilion', shadowSelector: '.floating-paint-shadow--vermilion', startX: 278, startY: 385, speedX: -.024, speedY: -.034, rotation: -32, scale: 1, alphaBounds: { left: .055, top: .045, right: .982, bottom: .988 } }
  ];
  const featureArt = document.querySelector('.feature-art');
  let disposeFloatingPaint = () => {};

  const setupFloatingPaint = () => {
    disposeFloatingPaint();
    if (!featureArt || !desktopMotion.matches || reducedMotion.matches) return;

    const paints = floatingPaintConfigs.map((config) => {
      const element = featureArt.querySelector(config.selector);
      const shadow = featureArt.querySelector(config.shadowSelector);
      return element ? { ...config, element, shadow, x: config.startX, y: config.startY, velocityX: config.speedX, velocityY: config.speedY, baseSpeedX: Math.abs(config.speedX), baseSpeedY: Math.abs(config.speedY), rotation: config.rotation, rotationTarget: config.rotation, lastRotationKick: -Infinity } : null;
    }).filter(Boolean);
    if (!paints.length) return;

    let previousTime = 0;
    let frameId = 0;
    const getBounds = (paint) => {
      const radians = paint.rotation * Math.PI / 180;
      const width = paint.element.offsetWidth * paint.scale;
      const height = paint.element.offsetHeight * paint.scale;
      const content = paint.alphaBounds;
      const centerX = width / 2;
      const centerY = height / 2;
      const corners = [[width * content.left, height * content.top], [width * content.right, height * content.top], [width * content.right, height * content.bottom], [width * content.left, height * content.bottom]].map(([x, y]) => ({
        x: centerX + (x - centerX) * Math.cos(radians) - (y - centerY) * Math.sin(radians),
        y: centerY + (x - centerX) * Math.sin(radians) + (y - centerY) * Math.cos(radians)
      }));
      const localLeft = Math.min(...corners.map((corner) => corner.x));
      const localRight = Math.max(...corners.map((corner) => corner.x));
      const localTop = Math.min(...corners.map((corner) => corner.y));
      const localBottom = Math.max(...corners.map((corner) => corner.y));
      return { width, height, contentWidth: localRight - localLeft, contentHeight: localBottom - localTop, left: paint.x + localLeft, right: paint.x + localRight, top: paint.y + localTop, bottom: paint.y + localBottom };
    };
    const containPaint = (paint) => {
      const bounds = getBounds(paint);
      if (bounds.left < 0) paint.x -= bounds.left;
      if (bounds.right > featureArt.clientWidth) paint.x -= bounds.right - featureArt.clientWidth;
      if (bounds.top < 0) paint.y -= bounds.top;
      if (bounds.bottom > featureArt.clientHeight) paint.y -= bounds.bottom - featureArt.clientHeight;
    };
    const kickRotation = (paint, turns, time) => {
      if (time - paint.lastRotationKick < 1600) return;
      const turn = turns[Math.floor(Math.random() * turns.length)];
      paint.rotationTarget = paint.rotation + turn;
      paint.lastRotationKick = time;
    };
    const settleVelocity = (velocity, naturalSpeed, delta) => {
      const target = Math.sign(velocity || 1) * naturalSpeed;
      return velocity + (target - velocity) * Math.min(delta * .0012, .045);
    };
    const mouseImpulseConfig = { radius: 360, velocityStrength: .0007, rotationStrength: .000004, maxVelocity: .075 };
    let lastPointer = null;
    const stirPaints = (event) => {
      const cardBounds = featureArt.getBoundingClientRect();
      const pointer = { x: event.clientX - cardBounds.left, y: event.clientY - cardBounds.top, time: event.timeStamp };
      if (!lastPointer) { lastPointer = pointer; return; }

      const moveX = pointer.x - lastPointer.x;
      const moveY = pointer.y - lastPointer.y;
      const moveDistance = Math.hypot(moveX, moveY);
      lastPointer = pointer;
      if (moveDistance < 2) return;

      paints.forEach((paint) => {
        const bounds = getBounds(paint);
        const centerX = (bounds.left + bounds.right) / 2;
        const centerY = (bounds.top + bounds.bottom) / 2;
        const distance = Math.hypot(pointer.x - centerX, pointer.y - centerY);
        const influence = Math.max(0, 1 - distance / mouseImpulseConfig.radius) ** 2;
        if (!influence) return;

        paint.velocityX = Math.min(Math.max(paint.velocityX + moveX * mouseImpulseConfig.velocityStrength * influence, -mouseImpulseConfig.maxVelocity), mouseImpulseConfig.maxVelocity);
        paint.velocityY = Math.min(Math.max(paint.velocityY + moveY * mouseImpulseConfig.velocityStrength * influence, -mouseImpulseConfig.maxVelocity), mouseImpulseConfig.maxVelocity);
        paint.rotationTarget += (moveX - moveY) * mouseImpulseConfig.rotationStrength * influence;
      });
    };
    const resolvePaintCollision = (first, second, time) => {
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
      kickRotation(first, [-48, 48, -90, 90], time);
      kickRotation(second, [-48, 48, -90, 90], time);
      containPaint(first);
      containPaint(second);
    };
    const frame = (time) => {
      const delta = previousTime ? Math.min(time - previousTime, 34) : 16;
      previousTime = time;
      paints.forEach((paint) => {
        paint.velocityX = settleVelocity(paint.velocityX, paint.baseSpeedX, delta);
        paint.velocityY = settleVelocity(paint.velocityY, paint.baseSpeedY, delta);
        paint.rotation += (paint.rotationTarget - paint.rotation) * Math.min(delta * .00055, .018);
        paint.x += paint.velocityX * delta;
        paint.y += paint.velocityY * delta;
        const bounds = getBounds(paint);
        const hitX = bounds.left <= 0 || bounds.right >= featureArt.clientWidth;
        const hitY = bounds.top <= 0 || bounds.bottom >= featureArt.clientHeight;
        if (hitX) { containPaint(paint); paint.velocityX *= -1; kickRotation(paint, [-90, 90, 180], time); }
        if (hitY) { containPaint(paint); paint.velocityY *= -1; kickRotation(paint, [-90, 90, 180], time); }
      });
      for (let firstIndex = 0; firstIndex < paints.length; firstIndex += 1) for (let secondIndex = firstIndex + 1; secondIndex < paints.length; secondIndex += 1) resolvePaintCollision(paints[firstIndex], paints[secondIndex], time);
      paints.forEach((paint) => {
        const bounds = getBounds(paint);
        paint.element.style.transform = `translate3d(${paint.x}px, ${paint.y}px, 0) rotate(${paint.rotation}deg) scale(${paint.scale})`;
        if (paint.shadow) {
          paint.shadow.style.width = `${bounds.contentWidth * .62}px`;
          paint.shadow.style.transform = `translate3d(${bounds.left + bounds.contentWidth * .19}px, ${bounds.top + bounds.contentHeight * .86}px, 0)`;
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
    const resetPointer = () => { lastPointer = null; };
    featureArt.addEventListener('pointermove', stirPaints);
    featureArt.addEventListener('pointerleave', resetPointer);
    frameId = window.requestAnimationFrame(frame);
    const resizeObserver = new ResizeObserver(() => paints.forEach(containPaint));
    resizeObserver.observe(featureArt);
    disposeFloatingPaint = () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      featureArt.removeEventListener('pointermove', stirPaints);
      featureArt.removeEventListener('pointerleave', resetPointer);
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
