import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {navbarBehavior} from '../navbar';

it('tracks wrapped fixed navigation without double-counting sticky flow', () => {
  const dom = new JSDOM('<nav class="navbar" style="position:fixed"></nav><nav class="navbar" style="position:sticky;top:4px"></nav>', {runScripts:'outside-only'});
  try {
    const {window} = dom;
    const navs = [...window.document.querySelectorAll('nav')];
    let height = 80;
    for (const nav of navs) {
      nav.getClientRects = () => [{height}] as unknown as DOMRectList;
      nav.getBoundingClientRect = () => ({height,bottom:height} as DOMRect);
    }
    let resize = () => {};
    (window as any).ResizeObserver = class {constructor(callback:()=>void){resize=callback;} observe() {}};
    window.eval(navbarBehavior.code);
    const value = (name:string) => window.document.documentElement.style.getPropertyValue(name);
    expect(value('--navbar-offset')).toBe('80px');
    expect(value('--navbar-anchor-offset')).toBe('84px');
    height = 134;
    resize();
    expect(value('--navbar-offset')).toBe('134px');
    navs[0]!.remove();
    window.dispatchEvent(new window.Event('resize'));
    expect(value('--navbar-offset')).toBe('0px');
    expect(value('--navbar-anchor-offset')).toBe('138px');
  } finally {dom.window.close();}
});
