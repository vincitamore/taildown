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
