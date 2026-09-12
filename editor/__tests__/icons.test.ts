import {readFileSync} from 'node:fs';
import {JSDOM} from 'jsdom';
import {expect, it} from 'vitest';
import * as icons from '../../packages/compiler/src/icons/lucide-icons';
import {isCodePosition} from '../../packages/compiler/src/authoring-context';

const source = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const registry = source.slice(source.indexOf('    const iconNames ='), source.indexOf('    // Slash command registry'));
const autocomplete = source.slice(source.indexOf('    // Helper to render autocomplete items'), source.indexOf('    // Bubble Menu'));
function setup() {
  const document = new JSDOM('<body></body>').window.document;
  const iconData = Object.fromEntries(icons.getAllLucideIconNames().map(name => [name, icons.getLucideIconElements(name)]));
  const editor = new Function('iconData', 'document', 'isCodePosition', registry + autocomplete + '\nreturn {iconNames, taildownAutocomplete, renderIconCompletion};')(iconData, document, isCodePosition);
  return {document, ...editor};
}

it('uses the complete compiler registry for editor icon suggestions', () => {
  const editor = setup();
  expect(editor.iconNames).toEqual(icons.getAllLucideIconNames());
  const input = ':icon[yout';
  const result = editor.taildownAutocomplete({pos: input.length, matchBefore: () => null, state: {doc: {toString:()=>input, lineAt: () => ({text: input, from: 0})}}});
  expect(result.from).toBe(6);
  expect(result.options.map((option: any) => option.label)).toContain('youtube');
});

it('renders the selected icon SVG instead of a generic fallback preview', () => {
  const editor = setup();
  const input = ':icon[biceps';
  const result = editor.taildownAutocomplete({pos: input.length, matchBefore: () => null, state: {doc: {toString:()=>input, lineAt: () => ({text: input, from: 0})}}});
  const option = result.options.find((item: any) => item.label === 'biceps-flexed');
  const svg = editor.renderIconCompletion(option).querySelector('svg');
  expect([...svg.children].map((child: Element) => [child.tagName, Object.fromEntries([...child.attributes].map(attr => [attr.name, attr.value]))])).toEqual(icons.getLucideIconElements('biceps-flexed'));
  expect(svg.getAttribute('aria-hidden')).toBe('true');
});
