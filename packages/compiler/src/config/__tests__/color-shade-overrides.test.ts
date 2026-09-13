import {expect, it} from 'vitest';
import {getDefaultConfig} from '../default-config';
import {mergeConfig} from '../theme-merger';
import {isColorScale, validateColorConfig} from '../config-schema';

it.each([50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950])('merges a lone %i color override without discarding other shades', shade => {
  const defaults = getDefaultConfig();
  const color = '#123456';
  expect(isColorScale({[shade]: color})).toBe(true);
  const result = mergeConfig(defaults, {theme: {colors: {primary: {[shade]: color}}}});
  expect(result.theme.colors.primary).toEqual({...defaults.theme.colors.primary, [shade]: color});
});

it('rejects empty or unsupported color scales instead of accepting unusable configuration', () => {
  const defaults = getDefaultConfig().theme.colors;
  expect(validateColorConfig({...defaults, primary: {}})).not.toEqual([]);
  expect(validateColorConfig({...defaults, primary: {200: ''}})).not.toEqual([]);
  expect(isColorScale({200: 42})).toBe(false);
  expect(isColorScale(['#123456'])).toBe(false);
});