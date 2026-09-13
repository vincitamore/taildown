import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { navbarBehavior } from '../navbar';

it('marks the current document across clean and static routes without marking section or external links', () => {
  const dom = new JSDOM(
    '<nav class="navbar"><a href="/guide.html">Guide</a><a href="/guide#section">Section</a><a href="https://elsewhere.test/guide">External</a><a href="/guide?other=1">Query</a></nav>',
    { url: 'https://taildown.test/guide', runScripts: 'outside-only' }
  );
  try {
    dom.window.eval(navbarBehavior.code);
    const current = dom.window.document.querySelectorAll('[aria-current="page"]');
    expect(current).toHaveLength(1);
    expect(current[0]?.textContent).toBe('Guide');
  } finally {
    dom.window.close();
  }
});

it('recognizes index routes while preserving authored current-state semantics', () => {
  const dom = new JSDOM(
    '<nav class="navbar"><a class="navbar-brand" href="/index.html">Brand</a><a href="/index.html">Home</a></nav><nav class="navbar"><a href="/elsewhere" aria-current="step">Authored</a><a href="/">Automatic</a></nav>',
    { url: 'https://taildown.test/', runScripts: 'outside-only' }
  );
  try {
    dom.window.eval(navbarBehavior.code);
    expect(dom.window.document.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
    expect(dom.window.document.querySelector('[aria-current="page"]')?.textContent).toBe('Home');
    expect(dom.window.document.querySelector('[aria-current="step"]')?.textContent).toBe(
      'Authored'
    );
  } finally {
    dom.window.close();
  }
});

it('tracks wrapped fixed navigation without double-counting sticky flow', () => {
  const dom = new JSDOM(
    '<nav class="navbar" style="position:fixed"></nav><nav class="navbar" style="position:sticky;top:4px"></nav>',
    { runScripts: 'outside-only' }
  );
  try {
    const { window } = dom;
    const navs = [...window.document.querySelectorAll('nav')];
    let height = 80;
    for (const nav of navs) {
      nav.getClientRects = () => [{ height }] as unknown as DOMRectList;
      nav.getBoundingClientRect = () => ({ height, bottom: height }) as DOMRect;
    }
    let resize = () => {};
    Object.defineProperty(window, 'ResizeObserver', {
      value: class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {}
      },
    });
    window.eval(navbarBehavior.code);
    const value = (name: string) => window.document.documentElement.style.getPropertyValue(name);
    expect(value('--navbar-offset')).toBe('80px');
    expect(value('--navbar-anchor-offset')).toBe('84px');
    height = 134;
    resize();
    expect(value('--navbar-offset')).toBe('134px');
    navs[0]!.remove();
    window.dispatchEvent(new window.Event('resize'));
    expect(value('--navbar-offset')).toBe('0px');
    expect(value('--navbar-anchor-offset')).toBe('138px');
  } finally {
    dom.window.close();
  }
});
it('collapses mobile navigation without rebuilding links and restores desktop access', () => {
  const dom = new JSDOM(
    '<nav class="navbar"><h1>Project</h1><p><a href="#one">First</a> <a href="#two">Second</a></p></nav>',
    { url: 'https://taildown.test/', runScripts: 'outside-only' }
  );
  try {
    const media = Object.assign(new dom.window.EventTarget(), { matches: true });
    dom.window.matchMedia = () => media as unknown as MediaQueryList;
    const original = dom.window.document.querySelector('a');
    dom.window.eval(navbarBehavior.code);
    const toggle = dom.window.document.querySelector<HTMLButtonElement>('.navbar-menu-toggle')!;
    const links = dom.window.document.querySelector<HTMLElement>('.navbar-links')!;
    expect(links.inert).toBe(true);
    toggle.click();
    expect(links.inert).toBe(false);
    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(links.querySelector('a')).toBe(original);
    toggle.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(links.inert).toBe(true);
    expect(dom.window.document.activeElement).toBe(toggle);
    media.matches = false;
    media.dispatchEvent(new dom.window.Event('change'));
    expect(links.inert).toBe(false);
  } finally {
    dom.window.close();
  }
});
it('keeps a brand visible when it shares a paragraph with navigation links', () => {
  const dom = new JSDOM(
    '<nav class="navbar"><p><a class="navbar-brand" href="/">Project</a> <a href="#one">First</a> <a href="#two">Second</a></p></nav>',
    { url: 'https://taildown.test/', runScripts: 'outside-only' }
  );
  try {
    dom.window.matchMedia = () =>
      Object.assign(new dom.window.EventTarget(), { matches: true }) as unknown as MediaQueryList;
    dom.window.eval(navbarBehavior.code);
    expect(dom.window.document.querySelector('.navbar > .navbar-brand')?.textContent).toBe(
      'Project'
    );
    expect(dom.window.document.querySelectorAll('.navbar-links a')).toHaveLength(2);
  } finally {
    dom.window.close();
  }
});
