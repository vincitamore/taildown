import {expect, it} from 'vitest';
import {isCodePosition} from '../authoring-context';

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
