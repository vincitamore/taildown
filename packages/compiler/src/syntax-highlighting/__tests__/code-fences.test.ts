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
