import { describe, expect, it } from 'vitest';
import { compile } from '../../index';
import { resolveAttributes } from '../style-resolver';
import { DEFAULT_CONFIG } from '../../config/default-config';
import { mergeClasses } from '../merge-classes';
import { generateCSS } from '../../renderer/css';

describe('style precedence', () => {
  it('keeps element-local intent when unrelated heading order changes', async () => {
    const first = '# First {large small}';
    const second = '# Second {small large}';
    for (const source of [`${first}\n\n${second}`, `${second}\n\n${first}`]) {
      const result = await compile(source, { autoFix: false });
      expect(result.html).toContain('<h1 class="text-sm">First</h1>');
      expect(result.html).toContain('<h1 class="text-lg">Second</h1>');
    }
  });

  it('keeps independent typography, colors, breakpoints and states', () => {
    expect(mergeClasses(['text-sm', 'text-primary-600', 'md:text-lg', 'hover:text-red-600', 'font-bold', 'text-xl']))
      .toEqual(['text-primary-600', 'md:text-lg', 'hover:text-red-600', 'font-bold', 'text-xl']);
    expect(mergeClasses(['px-2', 'py-4', 'p-8'])).toEqual(['p-8']);
    expect(mergeClasses(['p-8', 'px-2'])).toEqual(['p-8', 'px-2']);
    expect(mergeClasses(['glass-effect', 'glass-subtle', 'glass-heavy', 'custom-card']))
      .toEqual(['glass-effect', 'glass-heavy', 'custom-card']);
    expect(mergeClasses(['animate-fade-in', 'animate-slide-up'])).toEqual(['animate-slide-up']);
    expect(mergeClasses(['transition-smooth', 'transition-none'])).toEqual(['transition-none']);
  });

  it('emits broad declarations before partial overrides regardless of first use', () => {
    for (const [broad, narrow] of [['p-8', 'px-2'], ['px-2', 'pt-0'], ['text-lg', 'leading-tight'], ['transition', 'duration-500'], ['grid', 'gap-2']]) {
      const forward = generateCSS(new Set([broad!, narrow!]));
      const reversed = generateCSS(new Set([narrow!, broad!]));
      expect(forward).toBe(reversed);
      expect(forward.indexOf(`.${broad} {`)).toBeLessThan(forward.indexOf(`.${narrow} {`));
    }
  });

  it('preserves author order between component styles and explicit utilities', async () => {
    const result = await compile(':::card {padded-sm .p-12}\nFirst\n:::\n\n:::card {.p-12 padded-sm}\nSecond\n:::', { autoFix: false });
    const cards = [...result.html.matchAll(/class="([^"]*component-card[^"]*)"/g)].map(match => match[1]);
    expect(cards).toHaveLength(2);
    expect(cards[0]).toContain('p-12');
    expect(cards[0]).not.toMatch(/\bp-4\b/);
    expect(cards[1]).toContain('p-4');
    expect(cards[1]).not.toContain('p-12');
  });

  it('emits responsive overrides from small to large breakpoints', () => {
    const css = generateCSS(new Set(['lg:grid-cols-4', 'sm:grid-cols-2', 'md:grid-cols-3']));
    const small = css.indexOf('.sm\\:grid-cols-2');
    const medium = css.indexOf('.md\\:grid-cols-3');
    const large = css.indexOf('.lg\\:grid-cols-4');
    expect(small).toBeGreaterThan(-1);
    expect(small).toBeLessThan(medium);
    expect(medium).toBeLessThan(large);
  });

  it('resolves semantic compound aliases through the same theme-aware path', () => {
    const context = { config: DEFAULT_CONFIG, darkMode: true };
    for (const [alias, expanded] of [
      ['large-primary', ['large', 'primary']],
      ['bold-primary', ['bold', 'primary']],
      ['primary-bg', ['bg-primary', 'text-white']],
      ['secondary-bg', ['bg-secondary', 'text-white']],
    ] as const) {
      expect(resolveAttributes([alias], context)).toEqual(resolveAttributes([...expanded], context));
    }
  });
});
