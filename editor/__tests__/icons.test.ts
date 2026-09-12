import { JSDOM } from 'jsdom';
import { expect, it } from 'vitest';
import * as icons from '../../packages/compiler/src/icons/lucide-icons';
import { isCodePosition } from '../../packages/compiler/src/authoring-context';
import { EditorState } from '../../packages/compiler/src/editor-bundle';
import { getAuthoringReference } from '../../packages/compiler/src/authoring-reference';
import { createTaildownAutocomplete } from '../authoring';
import { createIconRenderer } from '../icons';

async function setup() {
  const document = new JSDOM('<body></body>').window.document;
  const iconData = Object.fromEntries(
    icons.getAllLucideIconNames().map((name) => [name, icons.getLucideIconElements(name)])
  );
  const editor = createIconRenderer(iconData, document);
  const reference = await getAuthoringReference();
  const taildownAutocomplete = createTaildownAutocomplete({
    reference: () => reference,
    iconNames: () => editor.iconNames,
    isCodePosition,
    startCompletion: () => false,
  });
  return { document, ...editor, taildownAutocomplete };
}

it('uses the complete compiler registry for editor icon suggestions', async () => {
  const editor = await setup();
  expect(editor.iconNames).toEqual(icons.getAllLucideIconNames());
  const input = ':icon[yout';
  const result = editor.taildownAutocomplete({
    pos: input.length,
    state: EditorState.create({ doc: input }),
  });
  if (!result) throw new Error('Missing icon suggestions');
  expect(result.from).toBe(6);
  expect(result.options.map((option) => option.label)).toContain('youtube');
});

it('renders the selected icon SVG instead of a generic fallback preview', async () => {
  const editor = await setup();
  const input = ':icon[biceps';
  const result = editor.taildownAutocomplete({
    pos: input.length,
    state: EditorState.create({ doc: input }),
  });
  if (!result) throw new Error('Missing icon suggestions');
  const option = result.options.find((item) => item.label === 'biceps-flexed');
  if (!option) throw new Error('Missing selected icon');
  const svg = editor.renderIconCompletion(option)?.querySelector('svg');
  if (!svg) throw new Error('Missing icon preview');
  expect(
    [...svg.children].map((child: Element) => [
      child.tagName,
      Object.fromEntries([...child.attributes].map((attr) => [attr.name, attr.value])),
    ])
  ).toEqual(icons.getLucideIconElements('biceps-flexed'));
  expect(svg.getAttribute('aria-hidden')).toBe('true');
});

it('normalizes requested icon names without changing registry names or SVG attributes', () => {
  const document = new JSDOM('<body></body>').window.document;
  const renderer = createIconRenderer(
    { 'arrow-right': [['path', { d: 'M2 12h20', 'stroke-width': 3 }]] },
    document
  );
  expect(renderer.iconNames).toEqual(['arrow-right']);
  expect(renderer.lucideIcon('ArrowRight')).toBe(renderer.lucideIcon('ARROW-RIGHT'));
  const preview = renderer.renderIconCompletion({ label: 'arrow-right', info: 'icon' });
  expect(preview?.querySelector('path')?.getAttribute('stroke-width')).toBe('3');
  expect(preview?.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 24 24');
});

it('keeps missing icons empty and does not add previews to non-icon completions', () => {
  const document = new JSDOM('<body></body>').window.document;
  const renderer = createIconRenderer({ missing: null }, document);
  expect(renderer.renderIconCompletion({ label: 'card', info: 'component' })).toBeNull();
  const missing = renderer.renderIconCompletion({ label: 'missing', info: 'icon' });
  const unknown = renderer.renderIconCompletion({ label: 'unknown', info: 'icon' });
  expect(missing?.querySelector('svg')?.children.length).toBe(0);
  expect(unknown?.querySelector('svg')?.children.length).toBe(0);
  expect(missing?.className).toBe('autocomplete-icon');
});
