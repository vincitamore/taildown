import { expect, it } from 'vitest';
import { getDefaultConfig } from '../../config/default-config';
import { createThemeResolver } from '../theme-resolver';

it('retains custom semantic colors when dark-mode controls are disabled', () => {
  const config = getDefaultConfig();
  config.theme.darkMode.enabled = false;
  config.theme.colors.primary.DEFAULT = '#126456';
  const css = createThemeResolver(config).generateThemeCSS();
  expect(css).toContain('--primary: #126456;');
  expect(css).toContain('--background:');
  expect(css).toContain('--foreground:');
  expect(css).not.toContain('.dark-mode-toggle');
});

it('resolves an explicitly requested shade in a custom scale without DEFAULT', () => {
  const config = getDefaultConfig();
  config.theme.colors.brand = { 200: '#123456' };
  const resolver = createThemeResolver(config);
  expect(resolver.getColor('brand', 200)).toBe('#123456');
  expect(resolver.getColor('brand')).toBe('#6b7280');
  expect(resolver.getColor('brand', 500)).toBe('#6b7280');
});
