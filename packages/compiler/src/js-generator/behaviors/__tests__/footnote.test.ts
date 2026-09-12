import { expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { compile } from '../../../index';
import { footnoteBehavior } from '../footnote';
const source =
  'First[^note] and again[^note].\n\n[^note]: **Detailed** [source](https://example.com).';
it('includes hover behavior for native footnotes without a wrapper', async () => {
  const result = await compile(source);
  expect(result.metadata.warnings).toEqual([]);
  expect(result.js).toContain('Footnote hover preview');
  const plain = await compile('No notes.');
  expect(plain.js).not.toContain('Footnote hover preview');
});
it('previews native formatted notes without repeated backlinks', async () => {
  const result = await compile(source);
  const dom = new JSDOM(result.html, { runScripts: 'outside-only', pretendToBeVisual: true });
  try {
    dom.window.eval(footnoteBehavior.code);
    const ref = dom.window.document.querySelector('[data-footnote-ref]');
    if (!ref) throw new Error('Missing native reference');
    ref.dispatchEvent(new dom.window.MouseEvent('mouseenter'));
    await vi.waitFor(() =>
      expect(dom.window.document.querySelector('.footnote-preview')).not.toBeNull()
    );
    const preview = dom.window.document.querySelector('.footnote-preview');
    expect(preview?.querySelector('strong')?.textContent).toBe('Detailed');
    expect(preview?.querySelector('a[href="https://example.com"]')).not.toBeNull();
    expect(preview?.querySelector('[data-footnote-backref]')).toBeNull();
    expect(
      dom.window.document.querySelectorAll('section[data-footnotes] [data-footnote-backref]')
    ).toHaveLength(2);
  } finally {
    dom.window.close();
  }
});
it.each([true, false])(
  'navigates native references and backlinks with reduced motion=%s',
  async (reduced) => {
    const result = await compile(source);
    const dom = new JSDOM(result.html, { runScripts: 'outside-only' });
    try {
      Object.defineProperty(dom.window, 'matchMedia', { value: () => ({ matches: reduced }) });
      const scroll = vi.fn();
      dom.window.HTMLElement.prototype.scrollIntoView = scroll;
      dom.window.eval(footnoteBehavior.code);
      for (const selector of ['[data-footnote-ref]', '[data-footnote-backref]']) {
        const link = dom.window.document.querySelector<HTMLAnchorElement>(selector);
        if (!link) throw new Error('Missing footnote link');
        const event = new dom.window.MouseEvent('click', { cancelable: true });
        link.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(scroll).toHaveBeenLastCalledWith({
          behavior: reduced ? 'auto' : 'smooth',
          block: 'center',
        });
        expect(dom.window.document.activeElement?.id).toBe(decodeURIComponent(link.hash.slice(1)));
      }
      const link = dom.window.document.querySelector('[data-footnote-ref]');
      if (!link) throw new Error('Missing reference');
      const modified = new dom.window.MouseEvent('click', { cancelable: true, ctrlKey: true });
      link.dispatchEvent(modified);
      expect(modified.defaultPrevented).toBe(false);
    } finally {
      dom.window.close();
    }
  }
);

it('finds generated footnote destinations with non-ASCII identifiers', async () => {
  const result = await compile('Reference[^café].\n\n[^café]: Detail.');
  const dom = new JSDOM(result.html, { runScripts: 'outside-only' });
  try {
    dom.window.HTMLElement.prototype.scrollIntoView = vi.fn();
    dom.window.eval(footnoteBehavior.code);
    const link = dom.window.document.querySelector<HTMLAnchorElement>('[data-footnote-ref]');
    if (!link) throw new Error('Missing reference');
    const event = new dom.window.MouseEvent('click', { cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(dom.window.document.activeElement?.textContent).toContain('Detail.');
  } finally {
    dom.window.close();
  }
});

it('keeps a new preview when an older dismissal finishes and clamps oversized previews', async () => {
  const result = await compile(source);
  const dom = new JSDOM(result.html, { runScripts: 'outside-only' });
  try {
    const timers = new Map<number, { callback: () => void; delay: number }>();
    let sequence = 0;
    Object.defineProperty(dom.window, 'setTimeout', {
      value: (callback: () => void, delay: number) => {
        const id = ++sequence;
        timers.set(id, { callback, delay });
        return id;
      },
    });
    Object.defineProperty(dom.window, 'clearTimeout', { value: (id: number) => timers.delete(id) });
    Object.defineProperty(dom.window, 'requestAnimationFrame', {
      value: (callback: FrameRequestCallback) => {
        callback(0);
        return 0;
      },
    });
    const run = (delay: number) => {
      for (const [id, timer] of [...timers])
        if (timer.delay === delay) {
          timers.delete(id);
          timer.callback();
        }
    };
    dom.window.HTMLElement.prototype.getBoundingClientRect = function () {
      return this.classList.contains('footnote-preview')
        ? {
            x: 0,
            y: 0,
            width: 2000,
            height: 2000,
            top: 0,
            left: 0,
            bottom: 2000,
            right: 2000,
            toJSON: () => ({}),
          }
        : {
            x: 20,
            y: 20,
            width: 10,
            height: 10,
            top: 20,
            left: 20,
            bottom: 30,
            right: 30,
            toJSON: () => ({}),
          };
    };
    const scrollListener = vi.spyOn(dom.window, 'addEventListener');
    dom.window.eval(footnoteBehavior.code);
    expect(scrollListener.mock.calls.filter(([event]) => event === 'scroll')).toHaveLength(1);
    const [first, second] = dom.window.document.querySelectorAll('[data-footnote-ref]');
    if (!first || !second) throw new Error('Missing repeated references');
    first.dispatchEvent(new dom.window.MouseEvent('mouseenter'));
    run(300);
    const old = dom.window.document.querySelector('.footnote-preview');
    first.dispatchEvent(new dom.window.MouseEvent('mouseleave'));
    second.dispatchEvent(new dom.window.MouseEvent('mouseenter'));
    run(300);
    run(200);
    const current = dom.window.document.querySelector<HTMLElement>('.footnote-preview');
    expect(current).not.toBe(old);
    expect(current?.classList.contains('visible')).toBe(true);
    expect(current?.style.left).toBe('8px');
    expect(current?.style.top).toBe('8px');
    expect(dom.window.document.querySelectorAll('.footnote-preview')).toHaveLength(1);
    dom.window.dispatchEvent(new dom.window.Event('scroll'));
    run(200);
    expect(dom.window.document.querySelector('.footnote-preview')).toBeNull();
  } finally {
    dom.window.close();
  }
});
it('restores temporary target focusability while keeping native backlink destinations tabbable', async () => {
  const result = await compile(source);
  const dom = new JSDOM(result.html, { runScripts: 'outside-only' });
  try {
    dom.window.HTMLElement.prototype.scrollIntoView = vi.fn();
    dom.window.eval(footnoteBehavior.code);
    const ref = dom.window.document.querySelector<HTMLAnchorElement>('[data-footnote-ref]');
    const back = dom.window.document.querySelector<HTMLAnchorElement>('[data-footnote-backref]');
    if (!ref || !back) throw new Error('Missing note links');
    ref.click();
    const target = dom.window.document.activeElement;
    expect(target?.getAttribute('tabindex')).toBe('-1');
    back.click();
    expect(target?.hasAttribute('tabindex')).toBe(false);
    expect(dom.window.document.activeElement).toBe(ref);
    expect(ref.hasAttribute('tabindex')).toBe(false);
    expect(ref.tabIndex).toBe(0);
    ref.setAttribute('tabindex', '3');
    back.click();
    expect(ref.getAttribute('tabindex')).toBe('3');
  } finally {
    dom.window.close();
  }
});
