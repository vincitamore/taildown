import {expect, it} from 'vitest';
import {unified} from 'unified';
import type {Element, Root} from 'hast';
import {JSDOM} from 'jsdom';
import {rehypeCodeMirror6} from '../rehype-codemirror6';
import {compile} from '../../index';

async function highlight(source: string, language = 'td') {
  const code: Element = {type: 'element', tagName: 'code', properties: {className: [`language-${language}`]}, children: [{type: 'text', value: source}]};
  const tree: Root = {type: 'root', children: [code]};
  await unified().use(rehypeCodeMirror6).run(tree);
  const content = code.children[0];
  if (content?.type !== 'raw') throw new Error('Expected highlighted HTML');
  return new JSDOM(`<code>${content.value}</code>`).window.document;
}
it.each(['td', 'taildown', 'tdown', 'TD'])('preserves exact source and line boundaries in exported %s fences', async language => {
  const source = '# Heading <safe>\n\n  :icon[heart] {primary}\n';
  const document = await highlight(source, language);
  expect(document.querySelector('code')?.textContent).toBe(source);
  expect(document.querySelectorAll('.code-line')).toHaveLength(source.split('\n').length);
  expect(document.querySelector('safe')).toBeNull();
  expect(document.querySelector('.function')?.textContent).toBe('[heart]');
  expect(document.querySelector('.function')?.getAttribute('style')).toContain('color:');
});
it('shares literal-code and escape boundaries with the editor instead of highlighting syntax inside code', async () => {
  const source = '```js\n:icon[heart] {primary}\n```\n\\:icon[heart]\n:icon[star]';
  const document = await highlight(source);
  expect(Array.from(document.querySelectorAll('.keyword'), node => node.textContent)).toEqual([':icon']);
  expect(Array.from(document.querySelectorAll('.function'), node => node.textContent)).toEqual(['[star]']);
  expect(document.querySelector('code')?.textContent).toBe(source);
});
it('includes actual keyboard, mark, math, footnote and task syntax in static highlighting', async () => {
  const source = ':kbd[Ctrl+K] ==mark=={warning} $x^2$ [^note]\n\n[^note]: Note\n- [x] done';
  const document = await highlight(source);
  expect(document.querySelector('.keyword')?.textContent).toBe(':kbd');
  expect(document.querySelector('.inserted')?.textContent).toBe('==mark=={warning}');
  expect(document.querySelector('.code')?.textContent).toBe('$x^2$');
  expect(document.querySelector('.boolean')?.textContent).toBe('[x]');
  expect(Array.from(document.querySelectorAll('.url'), node => node.textContent)).toEqual(['[^note]', '[^note]:']);
});
it('keeps clipboard source unchanged through the actual compiler export path', async () => {
  const source = ':kbd[Ctrl+K]\n\n```js\n:icon[heart]\n```';
  const result = await compile(`~~~~td\n${source}\n~~~~`);
  const document = new JSDOM(result.html).window.document;
  expect(document.querySelector('pre code')?.textContent).toBe(source);
  expect(document.querySelector('.code-copy-btn')?.getAttribute('data-code-text')).toBe(source);
});

it('keeps Windows line endings from becoming extra lines between highlighted tokens', async () => {
  const source = ':::card\r\n#### A heading\r\nThe paragraph\r\n:::';
  const document = await highlight(source);
  expect(document.querySelector('code')?.textContent).toBe(source.replace(/\r\n/g, '\n'));
  expect(document.querySelectorAll('.code-line')).toHaveLength(4);
});
