import {expect, it} from 'vitest';
import {isCodePosition, inlineCodeRanges} from '../authoring-context';

it.each([
  ['```js\n|\n```', true],
  ['````\n```\n|\n````', true],
  ['   ~~~text\n|\n   ~~~', true],
  ['    |', true],
  ['Text `some | code` after', true],
  ['```\nunfinished\n|', true],
  ['```\ncode\n```\n\n|', false],
  ['Ordinary text |', false],
  [':::card\n\n|\n:::', false],
] as const)('detects literal code at cursor in %s', (marked, expected) => {
  const position = marked.indexOf('|');
  expect(isCodePosition(marked.replace('|', ''), position)).toBe(expected);
});

it('finds multiline inline spans without accepting unmatched delimiters or blank paragraphs', () => {
  const source = 'Before ``a `\n:icon[star]`` after';
  expect(inlineCodeRanges(source).map(({from,to})=>source.slice(from,to))).toEqual(['``a `\n:icon[star]``']);
  expect(inlineCodeRanges('Before `a\n\nb` after')).toEqual([]);
  expect(inlineCodeRanges('Before `a\nunfinished')).toEqual([]);
});
