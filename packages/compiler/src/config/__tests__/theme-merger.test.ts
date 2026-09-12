import { expect, it } from 'vitest';
import { getDefaultConfig } from '../default-config';
import { mergeConfig } from '../theme-merger';

it('preserves default sizes and isolates component class collections in both directions', () => {
  const defaults = getDefaultConfig();
  defaults.components = { card: { defaultSize: 'small', variants: { quiet: { classes: ['border'] } } } };
  const card = {
    defaultClasses: ['p-4'],
    variants: { editorial: { classes: ['font-serif'], description: 'Editorial' } },
    sizes: { large: { classes: ['p-8'] } },
  };
  const custom = { defaultClasses: ['rounded'], variants: { quiet: { classes: ['opacity-50'] } } };
  const merged = mergeConfig(defaults, { components: { card, custom } });
  card.defaultClasses.push('hidden');
  card.variants.editorial.classes.push('hidden');
  card.sizes.large.classes.push('hidden');
  custom.defaultClasses.push('hidden');
  expect(merged.components?.card).toEqual({
    defaultVariant: undefined, defaultSize: 'small', defaultClasses: ['p-4'],
    variants: { quiet: { classes: ['border'] }, editorial: { classes: ['font-serif'], description: 'Editorial' } },
    sizes: { large: { classes: ['p-8'] } },
  });
  expect(merged.components?.custom?.defaultClasses).toEqual(['rounded']);
  merged.components!.custom!.variants!.quiet!.classes.push('hidden');
  merged.components!.card!.variants!.quiet!.classes.push('hidden');
  expect(custom.variants.quiet.classes).toEqual(['opacity-50']);
  expect(defaults.components.card?.variants?.quiet?.classes).toEqual(['border']);
  expect(mergeConfig(defaults, { components: { card: { defaultSize: 'large' } } }).components?.card?.defaultSize).toBe('large');
});

it('accepts component overrides when a base configuration omits components', () => {
  const defaults = getDefaultConfig();
  delete defaults.components;
  expect(mergeConfig(defaults, {components: {card: {defaultSize: 'large'}}}).components?.card?.defaultSize).toBe('large');
});
