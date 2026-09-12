import {expect, it} from 'vitest';
import {compile, getAuthoringReference} from '../index';

it('compiles configured defaults, explicit variants and sizes without changing other documents', async () => {
  const componentConfig = {card: {
    defaultVariant: 'editorial', defaultSize: 'roomy', defaultClasses: ['border'],
    variants: {editorial: {classes: ['font-serif', 'p-4']}},
    sizes: {roomy: {classes: ['p-8']}},
  }};
  const pending = compile(':::card\nHello\n:::', {componentConfig, inlineStyles: true});
  componentConfig.card.variants.editorial.classes.push('hidden');
  const [result, normal, explicit] = await Promise.all([
    pending, compile(':::card\nHello\n:::'),
    compile(':::card{editorial roomy p-2}\nHello\n:::', {componentConfig}),
  ]);
  expect(result.html).toMatch(/class="[^"]*font-serif[^"]*p-8/);
  expect(result.html).not.toMatch(/class="[^"]*hidden/);
  expect(result.css).toContain('.font-serif');
  expect(normal.html).not.toMatch(/class="[^"]*font-serif/);
  expect(explicit.html).toMatch(/class="[^"]*p-2/);
  expect(explicit.html).not.toMatch(/class="[^"]*p-8/);
});

it('derives authoring attributes from the same isolated presets, including custom components', async () => {
  const options = {components: {panel: {name: 'panel', htmlElement: 'section', defaultClasses: ['border']}},
    componentConfig: {card: {variants: {editorial: {classes: ['font-serif']}}}, panel: {sizes: {roomy: {classes: ['p-8']}}, defaultSize: 'roomy'}}};
  const pending = getAuthoringReference(options);
  options.componentConfig.card.variants.editorial.classes.push('hidden');
  const reference = await pending;
  expect(reference.components.filter(component => component.name === 'card')).toHaveLength(1);
  expect(reference.components.find(component => component.name === 'card')?.attributes).toContain('editorial');
  expect(reference.components.find(component => component.name === 'panel')?.attributes).toContain('roomy');
  expect((await getAuthoringReference()).components.find(component => component.name === 'card')?.attributes).not.toContain('editorial');
  expect((await compile(':::panel\nHello\n:::', options)).html).toMatch(/<section[^>]*p-8/);
});

it('rejects unknown components, unknown defaults and malformed class arrays consistently', async () => {
  for (const componentConfig of [
    {missing: {}}, {card: {defaultVariant: 'missing'}}, {card: {defaultSize: 'missing'}},
    {card: {defaultClasses: 'p-4' as unknown as string[]}},
  ]) {
    await expect(compile('Hello', {componentConfig})).rejects.toThrow();
    await expect(getAuthoringReference({componentConfig})).rejects.toThrow();
  }
});
it('applies presets to attached components and keeps interactive component behavior', async () => {
  const result = await compile('# Heading {card}\n\n:::tabs\n## First\n\nOne\n\n## Second\n\nTwo\n:::', {
    componentConfig: {card: {defaultClasses: ['font-serif']}, tabs: {defaultClasses: ['border']}},
    inlineStyles: true, inlineScripts: true,
  });
  expect(result.html).toMatch(/<h1[^>]*font-serif/);
  expect(result.html).toMatch(/class="[^"]*component-tabs[^"\n]*border/);
  expect(result.html).toContain('role="tab"');
  expect(result.js).toContain('tab');
});
