import { expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { scrollAnimationsBehavior } from '../scroll-animations';

function setup(reduced = false, available = true) {
  const dom = new JSDOM(
    '<section class="animate-slide-up"><a href="#end">Read on</a></section><div id="end" class="animate-fade-in">End</div>',
    { runScripts: 'outside-only', pretendToBeVisual: true }
  );
  const motion = Object.assign(new dom.window.EventTarget(), { matches: reduced });
  Object.defineProperty(dom.window, 'matchMedia', { value: () => motion });
  let callback:
    | ((entries: Array<Pick<IntersectionObserverEntry, 'target' | 'isIntersecting'>>) => void)
    | undefined;
  const observer = { observe: vi.fn(), unobserve: vi.fn(), disconnect: vi.fn() };
  if (available)
    Object.defineProperty(dom.window, 'IntersectionObserver', {
      value: class {
        constructor(cb: NonNullable<typeof callback>, options: IntersectionObserverInit) {
          callback = cb;
          expect(options.threshold).toBe(0);
          return observer;
        }
      },
    });
  dom.window.eval(scrollAnimationsBehavior.code);
  const elements = [...dom.window.document.querySelectorAll('section, #end')];
  return {
    dom,
    motion,
    observer,
    elements,
    enter: () => {
      if (!callback) throw new Error('Observer not initialized');
      callback(elements.map((target) => ({ target, isIntersecting: true })));
    },
  };
}

it.each([
  [true, true],
  [false, false],
])('leaves content visible with reduced motion=%s, observer=%s', (reduced, available) => {
  const { dom, elements } = setup(reduced, available);
  try {
    expect(elements.every((el) => !el.classList.contains('animation-paused'))).toBe(true);
  } finally {
    dom.window.close();
  }
});

it('reveals waiting content and cancels staggered entrances when preference changes', async () => {
  const { dom, motion, elements, enter, observer } = setup();
  try {
    enter();
    motion.matches = true;
    motion.dispatchEvent(new dom.window.Event('change'));
    expect(observer.disconnect).toHaveBeenCalled();
    await new Promise((resolve) => setTimeout(resolve, 120));
    expect(
      elements.every(
        (el) =>
          !el.classList.contains('animation-paused') && !el.classList.contains('animation-playing')
      )
    ).toBe(true);
    motion.matches = false;
    motion.dispatchEvent(new dom.window.Event('change'));
    expect(elements.every((el) => !el.classList.contains('animation-paused'))).toBe(true);
  } finally {
    dom.window.close();
  }
});

it('reveals a focused section immediately and cancels its pending entrance', async () => {
  const { dom, elements, enter } = setup();
  try {
    enter();
    dom.window.document.querySelector('a')!.focus();
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(elements[0]!.classList.contains('animation-paused')).toBe(false);
    expect(elements[0]!.classList.contains('animation-playing')).toBe(false);
  } finally {
    dom.window.close();
  }
});
