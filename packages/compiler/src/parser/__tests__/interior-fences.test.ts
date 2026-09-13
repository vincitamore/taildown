import { expect, it } from 'vitest';
import { parse } from '../index';
import { compile } from '../../index';

it.each(['\n', '\r\n'])('recognizes interior fences between formatted runs (%j)', async newline => {
  const source = [':::accordion','**Outer**',':::accordion','**Inner**','Content',':::',':::'].join(newline);
  const ast = await parse(source);
  const outer = ast.children[0];
  expect(outer?.type).toBe('containerDirective');
  if (outer?.type !== 'containerDirective') throw new Error('Missing outer');
  const inner = outer.children.find(child => child.type === 'containerDirective');
  expect(inner?.position?.start.offset).toBe(source.indexOf(':::accordion', 1));
  expect(inner?.position?.end.offset).toBe(source.length - newline.length - 3);
  const result = await compile(source);
  expect(result.html.match(/data-accordion-trigger/g)).toHaveLength(2);
});

it('does not mistake a fence fragment beside formatted content for a block', async () => {
  const ast = await parse('**Before** :::card\nText\n`:::tabs`');
  expect(ast.children.some(node => node.type === 'containerDirective')).toBe(false);
});

it('preserves links, inline code and emphasis around interior component boundaries', async () => {
  const source = ':::card\n[Before](https://example.com)\n:::card\n**Inside** and `code`\n:::\n*After*\n:::';
  const result = await compile(source);
  expect(result.html).toContain('href="https://example.com"');
  expect(result.html).toContain('<strong>Inside</strong>');
  expect(result.html).toContain('<em>After</em>');
  expect(result.metadata.warnings).toEqual([]);
});

it.each(['$x$', 'Text[^note]', '**Text**  '])('keeps fences around transformed content %s', async body => {
  const ast = await parse(':::card\n' + body + '\n:::');
  expect(ast.children[0]?.type).toBe('containerDirective');
  expect(ast.children[0]?.position?.end.line).toBe(3);
});

it('keeps escaped and entity-encoded fences as text', async () => {
  for (const fence of ['\\:::card', '&#58;::card']) {
    const ast = await parse(fence + '\nText');
    expect(ast.children.some(node => node.type === 'containerDirective')).toBe(false);
  }
});

it('retains the source span of plain content split away from fences', async () => {
  const source = ':::card\nPlain content\n:::';
  const ast = await parse(source);
  const card = ast.children[0];
  if (card?.type !== 'containerDirective') throw new Error('Missing card');
  expect(card.children[0]?.position?.start.line).toBe(2);
  expect(card.children[0]?.position?.end.line).toBe(2);
});

it('retains empty quoted attribute values', async () => {
  const ast = await parse(':::card {id=""}\nText\n:::');
  const card = ast.children[0];
  if (card?.type !== 'containerDirective') throw new Error('Missing card');
  expect(card.attributes).toEqual({id: ''});
});

it('bounds text positions at formatted siblings', async () => {
  const ast = await parse(':::card\nA **B** C\n:::');
  const card = ast.children[0];
  if (card?.type !== 'containerDirective') throw new Error('Missing card');
  const paragraph = card.children[0];
  if (paragraph?.type !== 'paragraph') throw new Error('Missing paragraph');
  expect(paragraph.children[0]?.position?.end).toEqual({line: 2, column: 3, offset: 10});
  expect(paragraph.children[2]?.position?.start).toEqual({line: 2, column: 8, offset: 15});
});

it('does not consume an entity newline as a source fence line', async () => {
  const result = await compile(':::card\nA&#10;B\n:::');
  expect(result.metadata.warnings).toEqual([]);
  expect(result.html).toContain('A\nB');
});

it('maps entity-containing text and subsequent math to raw source columns', async () => {
  const ast = await parse(':::card\nA &amp; $x$ B\n:::');
  const card = ast.children[0];
  if (card?.type !== 'containerDirective') throw new Error('Missing card');
  const paragraph = card.children[0];
  if (paragraph?.type !== 'paragraph') throw new Error('Missing paragraph');
  expect(paragraph.children[1]?.position?.start.column).toBe(9);
});

it.each([['R&amp;D', 'R&D'], ['a\\*b', 'a*b']])('decodes attributes without rejecting a literal fence (%s)', async (encoded, expected) => {
  const source = ':::card {title="' + encoded + '"}\nText\n:::';
  const ast = await parse(source);
  const card = ast.children[0];
  if (card?.type !== 'containerDirective') throw new Error('Missing card');
  expect(card.attributes?.title).toBe(expected);
  expect((await compile(source)).metadata.warnings).toEqual([]);
});
