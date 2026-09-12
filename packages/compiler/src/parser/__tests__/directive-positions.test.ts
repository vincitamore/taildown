import { expect, it } from 'vitest';
import { parse } from '../index';

it.each(['\n', '\r\n'])('locates nested directive ranges within the original source (%j)', async newline => {
  const outer = [':::card', ':::tabs', '### One', 'Text', ':::', ':::'].join(newline);
  const source = ['# Intro 🖋', '', outer].join(newline);
  const ast = await parse(source);
  const card = ast.children.find(node => node.type === 'containerDirective');
  expect(card?.position?.start.offset).toBe(source.indexOf(':::card'));
  expect(card?.position?.end.offset).toBe(source.length);
  expect(source.slice(card?.position?.start.offset, card?.position?.end.offset)).toBe(outer);
  if (card?.type !== 'containerDirective') throw new Error('Expected card');
  const tabs = card.children.find(node => node.type === 'containerDirective');
  expect(tabs?.position?.start.offset).toBe(source.indexOf(':::tabs'));
  expect(tabs?.position?.end.offset).toBe(source.indexOf(':::', source.indexOf('Text')) + 3);
});

it('locates nested directives around formatted content', async () => {
  const source = ':::card\n:::tabs\n**Text**\n:::\n:::';
  const ast = await parse(source);
  const card = ast.children[0];
  expect(card?.position?.end.offset).toBe(source.length);
  if (card?.type !== 'containerDirective') throw new Error('Expected card');
  expect(card.children[0]?.position?.end.offset).toBe(source.length - 4);
});

it('extends an unclosed component through the end of its source', async () => {
  const source = ':::card\n\nLast paragraph';
  const ast = await parse(source);
  expect(ast.children[0]?.position?.end.offset).toBe(source.length);
});
