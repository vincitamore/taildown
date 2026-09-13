import {expect, it} from 'vitest';
import {parseWithWarnings} from '../index';
import {compile} from '../../index';
import {JSDOM} from 'jsdom';

it.each(['\n', '\r\n'])('closes a card immediately after a table (%j)', async newline => {
  const source = [':::card', '| A | B |', '|---|---|', '| One | Two |', ':::', 'Outside **bold**'].join(newline);
  const {ast, warnings} = await parseWithWarnings(source);
  expect(warnings).toEqual([]);
  expect(ast.children).toHaveLength(2);
  expect(ast.children[0]).toMatchObject({type: 'containerDirective', name: 'card', children: [{type: 'table', children: [{type: 'tableRow'}, {type: 'tableRow'}]}]});
  expect(ast.children[1]?.position?.start.offset).toBe(source.indexOf('Outside'));
  expect(ast.children[1]).toMatchObject({children: [{value: 'Outside '}, {type: 'strong'}]});
  const doc = new JSDOM((await compile(source, {autoFix: false})).html).window.document;
  expect(doc.querySelectorAll('tbody tr')).toHaveLength(1);
  expect(doc.body.textContent).not.toContain(':::');
});

it('preserves literal fence text in piped, escaped, and code table cells', async () => {
  const {ast} = await parseWithWarnings('| A |\n|---|\n| ::: |\n\\:::\n`:::`');
  expect(ast.children[0]).toMatchObject({type: 'table', children: [{type: 'tableRow'}, {type: 'tableRow'}, {type: 'tableRow'}, {type: 'tableRow'}]});
});

it.each(['\n', '\r\n'])('includes the delimiter in a header-only table source span (%j)', async newline => {
  const source = [':::card', '| A |', '|---|', ':::'].join(newline);
  const {ast, warnings} = await parseWithWarnings(source);
  expect(warnings).toEqual([]);
  const card = ast.children[0];
  if (card?.type !== 'containerDirective') throw new Error('Missing card');
  expect(card.children[0]?.position?.end).toEqual({line: 3, column: 6, offset: source.indexOf('|---|') + 5});
});

it('keeps the restored suffix and later inline transforms inside its blockquote', async () => {
  const source = '> :::card\n> | A |\n> |---|\n> | One |\n> :::\n> Outside $x$';
  const {ast, warnings} = await parseWithWarnings(source);
  expect(warnings).toEqual([]);
  expect(ast.children[0]).toMatchObject({type: 'blockquote', children: [{type: 'containerDirective', name: 'card', children: [{type: 'table', children: [{type: 'tableRow'}, {type: 'tableRow'}]}]}, {type: 'paragraph', children: [{value: 'Outside '}, {type: 'math'}]}]});
});

it.each([false, true])('preserves external link and image reference definitions (before=%s)', async before => {
  const definitions = '[ref]: https://example.com "Guide"\n\n[image]: https://example.com/image.png "Diagram"';
  const content = ':::card\n| A |\n|---|\n| Row |\n:::\n[Docs][ref] ![Diagram][image]';
  const source = before ? definitions + '\n\n' + content : content + '\n\n' + definitions;
  const doc = new JSDOM((await compile(source, {autoFix: false})).html).window.document;
  expect(doc.querySelector('a[href="https://example.com"]')?.textContent).toBe('Docs');
  expect(doc.querySelector('img')?.getAttribute('src')).toBe('https://example.com/image.png');
});
