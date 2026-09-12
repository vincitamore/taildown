import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';
import {parse} from '../index';

it.each([' ', '\n', '\r\n'])('preserves whitespace between attributed links (%j)', async separator => {
  const source = `[One](#){.font-bold}${separator}[Two](#){.italic}`;
  const ast = await parse(source);
  expect(ast.children[0]).toMatchObject({children: [{type: 'link'}, {type: 'text', value: separator.replace('\r\n', '\n')}, {type: 'link'}, {type: 'text', value: ''}]});
  const {html} = await compile(source, {minify: true});
  const paragraph = new JSDOM(html).window.document.querySelector('p')!;
  expect(paragraph.textContent).toBe('One Two');
  expect(paragraph.querySelectorAll('a')[0]!.classList.contains('font-bold')).toBe(true);
  expect(paragraph.querySelectorAll('a')[1]!.classList.contains('italic')).toBe(true);
});

it('leaves a trailing paragraph attribute on the paragraph after link prose', async () => {
  const {html} = await compile('[One](#) continues here {.font-bold}');
  const paragraph = new JSDOM(html).window.document.querySelector('p')!;
  expect(paragraph.classList.contains('font-bold')).toBe(true);
  expect(paragraph.querySelector('a')!.classList.contains('font-bold')).toBe(false);
  expect(paragraph.textContent).toBe('One continues here');
});
