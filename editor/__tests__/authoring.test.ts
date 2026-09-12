// @vitest-environment jsdom
import { expect, it, vi } from 'vitest';
import { EditorState, EditorView } from '../../packages/compiler/src/editor-bundle';
import { createTaildownAutocomplete } from '../authoring';
import { getAuthoringReference } from '../../packages/compiler/src/authoring-reference';
import { registry } from '../../packages/compiler/src/components/component-registry';
import { getAllShorthands } from '../../packages/compiler/src/resolver/shorthand-mappings';
import { isCodePosition } from '../../packages/compiler/src/authoring-context';

async function suggestions(input: string) {
  const reference = await getAuthoringReference();
  const complete = createTaildownAutocomplete({
    reference: () => reference,
    iconNames: () => [],
    isCodePosition,
    startCompletion: () => false,
  });
  return complete({ pos: input.length, state: EditorState.create({ doc: input }) });
}

async function requiredSuggestions(input: string) {
  const result = await suggestions(input);
  if (!result) throw new Error(`No suggestions for ${input}`);
  return result;
}

it.each(['```js\nconst value = {', '    :icon[sta', '~~~td\n:::car'])(
  'does not suggest Taildown syntax inside code: %s',
  async (input) => {
    expect(await suggestions(input)).toBeNull();
  }
);

it('waits for compiler definitions and exposes their names, variants, sizes and shorthands', async () => {
  const reference = await getAuthoringReference();
  expect(reference.components.map((item) => item.name).sort()).toEqual(registry.getNames().sort());
  expect(reference.styles).toEqual(getAllShorthands().sort());
  expect(reference.components.find((item) => item.name === 'grid')?.attributes).toContain('5');
  expect(reference.components.find((item) => item.name === 'container')?.attributes).toContain(
    'extra-wide'
  );
});

it('offers current components when completion is opened after a partial name', async () => {
  const input = ':::vid';
  const result = await requiredSuggestions(input);
  expect(result.from).toBe(3);
  expect(result.options.map((item) => item.label)).toEqual(
    expect.arrayContaining(['video', 'diff', 'definitions'])
  );
});

it('retains earlier attributes and includes component-specific variants', async () => {
  const input = ':::container{primary extra-w';
  const result = await requiredSuggestions(input);
  expect(input.slice(0, result.from)).toBe(':::container{primary ');
  expect(result.options.map((item) => item.label)).toContain('extra-wide');
  expect(result.options.find((item) => item.label === 'extra-wide')?.apply).toBe('extra-wide');
});

it('offers compiler shorthands after whitespace within an attribute block', async () => {
  const input = '# Heading {primary extra-';
  const result = await requiredSuggestions(input);
  expect(input.slice(0, result.from)).toBe('# Heading {primary ');
  expect(result.options.map((item) => item.label)).toContain('extra-light');
});

it('offers documented grid column aliases while preserving gap selection', async () => {
  const input = ':::grid{loose cols-';
  const result = await requiredSuggestions(input);
  expect(input.slice(0, result.from)).toBe(':::grid{loose ');
  expect(result.options.map((item) => item.label)).toEqual(
    expect.arrayContaining(['cols-1', 'cols-2', 'cols-3', 'cols-4', 'cols-5'])
  );
});

it('offers icon-specific sizes while preserving earlier icon attributes', async () => {
  const input = ':icon[star]{primary ti';
  const result = await requiredSuggestions(input);
  expect(input.slice(0, result.from)).toBe(':icon[star]{primary ');
  expect(result.options.find((item) => item.label === 'tiny')?.info).toBe('icon-style');
});

it('offers inline badge variants from the badge definition', async () => {
  const input = ':badge[Ready]{success de';
  const result = await requiredSuggestions(input);
  expect(input.slice(0, result.from)).toBe(':badge[Ready]{success ');
  expect(result.options.find((item) => item.label === 'default')?.info).toBe('badge-style');
});

it('offers only supported platform hints for keyboard markup', async () => {
  const result = await requiredSuggestions(':kbd[Ctrl]{');
  expect(result.options.map((item) => item.label).sort()).toEqual([
    'apple',
    'mac',
    'macos',
    'win',
    'windows',
  ]);
  expect(result.options.every((item) => item.info === 'platform')).toBe(true);
});

it('reads refreshed component and style settings without rebuilding the completion source', async () => {
  let reference = await getAuthoringReference();
  const complete = createTaildownAutocomplete({
    reference: () => reference,
    iconNames: () => [],
    isCodePosition,
    startCompletion: () => false,
  });
  reference = await getAuthoringReference({
    components: { feature: { name: 'feature', defaultClasses: ['p-4'] } },
    styleMappings: { 'brand-space': 'p-8' },
  });
  const componentSource = ':::fea';
  expect(
    complete({
      pos: componentSource.length,
      state: EditorState.create({ doc: componentSource }),
    })?.options.map((item) => item.label)
  ).toContain('feature');
  const styleSource = '# Heading {brand-';
  expect(
    complete({
      pos: styleSource.length,
      state: EditorState.create({ doc: styleSource }),
    })?.options.map((item) => item.label)
  ).toContain('brand-space');
});

it('applies inline and component completions to a real editor and retriggers only when requested', async () => {
  const reference = await getAuthoringReference();
  const startCompletion = vi.fn(() => true);
  const complete = createTaildownAutocomplete({
    reference: () => reference,
    iconNames: () => ['star'],
    isCodePosition,
    startCompletion,
  });
  const view = new EditorView({ state: EditorState.create({ doc: ':' }), parent: document.body });
  vi.useFakeTimers();
  try {
    const result = complete({ state: view.state, pos: 1 });
    const icon = result?.options.find((item) => item.label === ':icon[]');
    if (!result || !icon || typeof icon.apply !== 'function')
      throw new Error('Missing icon completion');
    icon.apply(view, icon, result.from, 1);
    expect(view.state.doc.toString()).toBe(':icon[]');
    expect(view.state.selection.main.head).toBe(6);
    expect(startCompletion).not.toHaveBeenCalled();
    vi.advanceTimersByTime(10);
    expect(startCompletion).toHaveBeenCalledWith(view);

    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: ':::car' } });
    const componentResult = complete({ state: view.state, pos: 6 });
    const card = componentResult?.options.find((item) => item.label === 'card');
    if (!componentResult || !card || typeof card.apply !== 'function')
      throw new Error('Missing card completion');
    card.apply(view, card, componentResult.from, 6);
    expect(view.state.doc.toString()).toBe(':::card\n\n:::');
    expect(view.state.selection.main.head).toBe(8);
    vi.advanceTimersByTime(10);
    expect(startCompletion).toHaveBeenCalledTimes(1);
  } finally {
    view.destroy();
    vi.useRealTimers();
  }
});
