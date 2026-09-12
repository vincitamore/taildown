import {readFileSync} from 'node:fs';
import {expect, it} from 'vitest';
import {getAuthoringReference} from '../../packages/compiler/src/authoring-reference';
import {registry} from '../../packages/compiler/src/components/component-registry';
import {getAllShorthands} from '../../packages/compiler/src/resolver/shorthand-mappings';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const data = source.slice(source.indexOf('    const authoringReference ='), source.indexOf('    const iconNames ='));
const code = source.slice(source.indexOf('    // Helper to render autocomplete items'), source.indexOf('    // Bubble Menu'));
async function suggestions(input: string) {
  const reference = await getAuthoringReference();
  const complete = new Function('reference', data.replace('await Taildown.getAuthoringReference()', 'reference') + code + '\nreturn taildownAutocomplete;')(reference);
  return complete({pos: input.length, matchBefore: () => null, state: {doc: {lineAt: () => ({text: input, from: 0})}}});
}

it('waits for compiler definitions and exposes their names, variants, sizes and shorthands', async () => {
  const reference = await getAuthoringReference();
  expect(reference.components.map(item => item.name).sort()).toEqual(registry.getNames().sort());
  expect(reference.styles).toEqual(getAllShorthands().sort());
  expect(reference.components.find(item => item.name === 'grid')?.attributes).toContain('5');
  expect(reference.components.find(item => item.name === 'container')?.attributes).toContain('extra-wide');
});

it('offers current components when completion is opened after a partial name', async () => {
  const input = ':::vid';
  const result = await suggestions(input);
  expect(result.from).toBe(3);
  expect(result.options.map((item: any) => item.label)).toEqual(expect.arrayContaining(['video', 'diff', 'definitions']));
});

it('retains earlier attributes and includes component-specific variants', async () => {
  const input = ':::container{primary extra-w';
  const result = await suggestions(input);
  expect(input.slice(0, result.from)).toBe(':::container{primary ');
  expect(result.options.map((item: any) => item.label)).toContain('extra-wide');
  expect(result.options.find((item: any) => item.label === 'extra-wide').apply).toBe('extra-wide');
});

it('offers compiler shorthands after whitespace within an attribute block', async () => {
  const input = '# Heading {primary extra-';
  const result = await suggestions(input);
  expect(input.slice(0, result.from)).toBe('# Heading {primary ');
  expect(result.options.map((item: any) => item.label)).toContain('extra-light');
});
