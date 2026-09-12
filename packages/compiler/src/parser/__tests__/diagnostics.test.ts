import { expect, it } from 'vitest';
import { compile } from '../../index';

it('returns an unclosed directive diagnostic with its source line', async () => {
  const result = await compile('# Intro\n\n:::card\nContent', {autoFix: false});
  expect(result.metadata.warnings).toContainEqual(expect.objectContaining({type: 'parse', line: 3, message: expect.stringContaining('Unclosed')}));
});
it('reports syntax corrections instead of silently changing the source', async () => {
  const result = await compile(':::card{elevated}\nContent\n:::');
  expect(result.metadata.warnings).toContainEqual(expect.objectContaining({line: 1, message: expect.stringContaining('Automatically corrected')}));
});
it('locates unknown component names', async () => {
  const result = await compile('# Intro\n\n:::missing-widget\nText\n:::');
  expect(result.metadata.warnings).toContainEqual(expect.objectContaining({type: 'validation', line: 3, message: 'Unknown component: missing-widget'}));
});

it('recognizes parser-owned footnotes as a supported component', async () => {
  const result = await compile(':::footnotes\nText\n:::');
  expect(result.metadata.warnings).not.toContainEqual(expect.objectContaining({message: 'Unknown component: footnotes'}));
});
