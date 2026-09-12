import {expect, it} from 'vitest';
import {taildownLanguage} from '../codemirror6-language';

it.each([
  ['````td\n```\n:::card\n````\n# Outside', ':::card'],
  ['~~~td\n```\n:::card\n~~~~\n# Outside', ':::card'],
  ['   ```td\n:::card\n   ````\n# Outside', ':::card'],
])('highlights literal code until a matching closing fence: %s', (source, literal) => {
  const tree = taildownLanguage.parser.parse(source);
  const offset = source.indexOf(literal) + 2;
  expect(tree.resolveInner(offset).name).toBe('monospace');
  expect(tree.resolveInner(source.indexOf('Outside') + 1).name).not.toBe('monospace');
});

it.each([
  ['Text ``one ` :icon[star]`` after', ':icon'],
  ['Text ``one ``` {primary} `` after', '{primary}'],
])('uses matching-length backtick runs for inline code: %s', (source, literal) => {
  const tree = taildownLanguage.parser.parse(source);
  expect(tree.resolveInner(source.indexOf(literal) + 2).name).toBe('monospace');
  expect(tree.resolveInner(source.indexOf('after') + 1).name).not.toBe('monospace');
});

it('does not treat a shorter delimiter as the end of an unmatched inline run', () => {
  const source = 'Text ``one ` :icon[star]';
  expect(taildownLanguage.parser.parse(source).resolveInner(source.indexOf(':icon') + 2).name).not.toBe('monospace');
});

it('keeps escaped attribute openers from changing subsequent text highlighting', () => {
  const source = 'Literal \\{ primary and normal text';
  const tree = taildownLanguage.parser.parse(source);
  expect(tree.resolveInner(source.indexOf('primary') + 2).name).not.toBe('className');
  expect(tree.resolveInner(source.indexOf('\\{') + 1).name).toBe('escape');
});

it('does not mistake escaped backticks for an inline code opener', () => {
  const source = 'Literal \\`before :icon[star]`';
  expect(taildownLanguage.parser.parse(source).resolveInner(source.indexOf(':icon') + 2).name).toBe('keyword');
});
