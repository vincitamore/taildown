import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../../index';
import {carouselBehavior} from '../carousel';

it.each([false,true])('wires autoplay with pause, focus and reduced motion (%s)', async reduced => {
  const result = await compile(':::carousel {autoplay}\nFirst\n\n---\n\nSecond\n:::');
  const dom = new JSDOM(result.html, {runScripts:'outside-only', pretendToBeVisual:true});
  try {
    const active = new Set<number>(); let id = 0;
    dom.window.setInterval = (() => { active.add(++id); return id; }) as typeof dom.window.setInterval;
    dom.window.clearInterval = (value) => {active.delete(Number(value));};
    const motion = Object.assign(new dom.window.EventTarget(), {matches:reduced});
    dom.window.matchMedia = (() => motion) as unknown as typeof dom.window.matchMedia;
    dom.window.eval('function getComponents(name){return document.querySelectorAll("[data-component="+name+"]")} function toggleClass(el,name,on){el.classList.toggle(name,on)}\n'+carouselBehavior.code);
    const carousel = dom.window.document.querySelector<HTMLElement>('[data-component="carousel"]')!;
    expect(carousel.hasAttribute('data-autoplay')).toBe(true);
    const toggle = carousel.querySelector<HTMLButtonElement>('.carousel-play-toggle')!;
    expect(active.size).toBe(reduced ? 0 : 1);
    if (reduced) toggle.click();
    expect(active.size).toBe(1);
    carousel.dispatchEvent(new dom.window.MouseEvent('mouseleave'));
    carousel.dispatchEvent(new dom.window.MouseEvent('mouseleave'));
    expect(active.size).toBe(1);
    carousel.querySelector<HTMLButtonElement>('[data-carousel-next]')!.focus();
    expect(active.size).toBe(0);
    toggle.click(); expect(active.size).toBe(1);
    motion.matches = true; motion.dispatchEvent(new dom.window.Event('change'));
    expect(active.size).toBe(0);
  } finally {dom.window.close();}
});
