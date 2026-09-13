import {expect, it} from 'vitest';
import {unified} from 'unified';
import type {Root, Element} from 'hast';
import {renderIcons} from '../icon-renderer';

it('reads space-separated icon classes without treating characters as size tokens', async () => {
  const icon: Element = {type:'element',tagName:'svg',properties:{'data-icon':'star',className:'icon w-8 thick'},children:[]};
  const root: Root = {type:'root',children:[icon]};
  await unified().use(renderIcons).run(root);
  expect(icon.properties.width).toBe(32);
  expect(icon.properties.height).toBe(32);
  expect(icon.properties.strokeWidth).toBe(3);
  expect(icon.children.length).toBeGreaterThan(0);
});

it('leaves unrelated SVG metadata untouched', async () => {
  const icon: Element = {type:'element',tagName:'svg',properties:{'data-icon':42},children:[]};
  await unified().use(renderIcons).run({type:'root',children:[icon]} satisfies Root);
  expect(icon.tagName).toBe('svg');
  expect(icon.properties).toEqual({'data-icon':42});
});
