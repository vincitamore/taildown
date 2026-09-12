import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';
import {generateCSS} from '../css';

it('emits adaptive grid defaults before explicit breakpoint overrides without priority locks', () => {
  const css = generateCSS(new Set(['grid', 'grid-cols-3', 'sm:grid-cols-2', 'lg:grid-cols-4']));
  const adaptive = css.indexOf('/* grid-cols-3:');
  expect(adaptive).toBeGreaterThan(-1);
  expect(css.indexOf('.sm\\:grid-cols-2')).toBeGreaterThan(adaptive);
  expect(css.indexOf('.lg\\:grid-cols-4')).toBeGreaterThan(css.indexOf('.sm\\:grid-cols-2'));
  expect(css).not.toMatch(/grid-template-columns:[^;}]+!important/);
});

it('uses the requested literal column count for every explicit breakpoint grid utility', () => {
  for (const breakpoint of ['sm', 'md', 'lg', 'xl', '2xl']) {
    for (let count = 1; count <= 5; count++) {
      const css = generateCSS(new Set([`${breakpoint}:grid-cols-${count}`]));
      expect(css).toContain(`.${breakpoint}\\:grid-cols-${count} { grid-template-columns: repeat(${count}, minmax(0, 1fr)); }`);
    }
  }
});

it('preserves a nested grid as a grid instead of replacing its layout with flex', async () => {
  const result = await compile(':::grid{cols-2}\n:::grid{cols-2}\n:::card\nOne\n:::\n:::card\nTwo\n:::\n:::\n:::card\nSibling\n:::\n:::', {inlineStyles:true});
  const dom = new JSDOM(result.html);
  try {
    const nested = dom.window.document.querySelector('.component-grid > .component-grid')!;
    expect(nested).not.toBeNull();
    expect(dom.window.getComputedStyle(nested).display).toBe('grid');
    expect(dom.window.getComputedStyle(nested).marginBottom).toBe('0px');
  } finally {dom.window.close();}
});
