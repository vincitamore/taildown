import {expect, it} from 'vitest';
import type {Element, Root} from 'hast';
import {applyTableVariants, rehypeEnhanceTables} from '../table-parser';
import {parseWithWarnings} from '../index';

it('preserves string-valued header classes while enhancing tables with text nodes', () => {
  const header: Element = {
    type: 'element', tagName: 'th', properties: {className: 'text-left font-bold'},
    children: [{type: 'text', value: 'Name'}],
  };
  const table: Element = {
    type: 'element', tagName: 'table', properties: {className: 'table-enhanced table-sortable'},
    children: [{type: 'text', value: '\n'}, {
      type: 'element', tagName: 'thead', properties: {}, children: [
        {type: 'text', value: '\n'},
        {type: 'element', tagName: 'tr', properties: {}, children: [header]},
      ],
    }],
  };
  applyTableVariants(table);
  expect(header.properties.className).toEqual(['text-left', 'font-bold', 'sortable-header']);
  expect(header.children[0]).toEqual({type: 'text', value: 'Name'});
  expect(header.children[1]).toMatchObject({type: 'element', tagName: 'span', properties: {ariaHidden: 'true'}});
  expect(table.properties.dataEnhanced).toBe('true');
});

it('recognizes an existing wrapper with string-valued classes', () => {
  const table: Element = {type: 'element', tagName: 'table', properties: {className: ['table-enhanced']}, children: []};
  const wrapper: Element = {type: 'element', tagName: 'div', properties: {className: 'padded table-wrapper'}, children: [table]};
  const tree: Root = {type: 'root', children: [wrapper]};
  rehypeEnhanceTables()(tree);
  expect(wrapper.children).toEqual([table]);
  expect(tree.children).toEqual([wrapper]);
});

it.each(['\n', '\r\n'])('applies each following attribute paragraph to its own table (%j)', async newline => {
  const source = ['| First |', '|---|', '| One |', '', '{sortable}', '', '| Second |', '|---|', '| Two |', '', '{zebra}', '', 'After both tables.'].join(newline);
  const {ast, warnings} = await parseWithWarnings(source);
  expect(warnings).toEqual([]);
  expect(ast.children).toHaveLength(3);
  expect(ast.children[0]).toMatchObject({type: 'table', data: {taildown: {variants: ['sortable']}}});
  expect(ast.children[1]).toMatchObject({type: 'table', data: {taildown: {variants: ['zebra']}}});
  expect(ast.children[1]?.position?.start.offset).toBe(source.indexOf('| Second |'));
  expect(ast.children[2]).toMatchObject({type: 'paragraph', children: [{type: 'text', value: 'After both tables.'}]});
});
