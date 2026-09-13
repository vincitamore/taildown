import { expect, it } from 'vitest';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { JSDOM } from 'jsdom';
import { compile } from '../../index';
import { getAllLucideIconNames, getLucideIconElements, hasLucideIcon } from '../lucide-icons';

it('supports every canonical icon in the installed Lucide package', async () => {
  const require = createRequire(import.meta.url);
  const root = dirname(require.resolve('lucide/package.json'));
  const names = (await readdir(join(root, 'dist/esm/icons')))
    .filter(file => file.endsWith('.js') && file !== 'index.js')
    .map(file => file.slice(0, -3));
  expect(names.length).toBeGreaterThan(1000);
  expect(names.filter(name => !hasLucideIcon(name))).toEqual([]);
  const available = new Set(getAllLucideIconNames());
  expect(names.filter(name => !available.has(name))).toEqual([]);
  for (const name of names) expect(getLucideIconElements(name)?.length).toBeGreaterThan(0);
});

it('renders documented icons outside the old subset and preserves the wave alias', async () => {
  const result = await compile(':icon[chevron-down] :icon[youtube] :icon[biceps-flexed] :icon[grid-2x2] :icon[wave]');
  const document = new JSDOM(result.html).window.document;
  expect(document.querySelectorAll('svg[data-icon]')).toHaveLength(5);
  expect(document.querySelector('.icon-missing')).toBeNull();
  expect(getLucideIconElements('wave')).toEqual(getLucideIconElements('waves'));
});

it('does not treat inherited object properties as icons', () => {
  for (const name of ['constructor', '__proto__', 'toString', 'missing-icon']) {
    expect(hasLucideIcon(name)).toBe(false);
    expect(getLucideIconElements(name)).toBeNull();
  }
});

it.each([['tiny',12], ['xs',16], ['sm',20], ['md',24], ['lg',32], ['xl',40], ['2xl',48], ['huge',64], ['large',32]])('renders %s icons at the documented size', async (keyword, size) => {
  const result = await compile(`:icon[star]{${keyword}}`);
  const icon = new JSDOM(result.html).window.document.querySelector('svg[data-icon]');
  expect(icon?.getAttribute('width')).toBe(String(size));
  expect(icon?.getAttribute('height')).toBe(String(size));
  expect(icon?.classList.contains(`w-${Number(size) / 4}`)).toBe(true);
  expect(icon?.classList.contains(`h-${Number(size) / 4}`)).toBe(true);
});

it('preserves responsive sizes and lets later explicit dimensions override size keywords', async () => {
  const result = await compile(':icon[star]{small md:huge .w-10 .h-8}');
  const icon = new JSDOM(result.html).window.document.querySelector('svg[data-icon]');
  expect(icon?.classList.contains('w-10')).toBe(true);
  expect(icon?.classList.contains('h-8')).toBe(true);
  expect(icon?.classList.contains('w-5')).toBe(false);
  expect(icon?.classList.contains('md:w-16')).toBe(true);
  expect(icon?.classList.contains('md:h-16')).toBe(true);
  expect(result.css).toContain('@media (min-width: 768px)');
  expect(result.css).toContain('.md\\:w-16 { width: 4rem; }');
  expect(result.css).toContain('.md\\:h-16 { height: 4rem; }');
});
