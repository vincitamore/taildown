import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {generateCSS} from '../css';

it.each([false, true])('keeps size-specific comparison selectors valid (minify=%s)', minify => {
  const css = generateCSS(new Set(['image-compare', 'h-[280px]', 'max-h-[80vh]']), minify);
  const document = new JSDOM('<div class="image-compare h-[280px]"><span class="image-compare-handle"></span></div>', {url: 'https://example.test'}).window.document;
  const selectors = [...css.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/([^{}]+)\{[^{}]*width:\s*(?:36|56)px/g)]
    .map(match => match[1]?.trim() ?? '')
    .filter(selector => selector.includes('.image-compare.h-'));
  expect(selectors).toHaveLength(2);
  expect(document.querySelector(selectors[0]!) === document.querySelector('.image-compare-handle')).toBe(true);
  expect(document.querySelector(selectors[1]!)).toBeNull();
});
