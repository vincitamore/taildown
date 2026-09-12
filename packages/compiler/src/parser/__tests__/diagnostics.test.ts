import { expect, it } from 'vitest';
import { compile } from '../../index';
import {JSDOM} from 'jsdom';

it('returns an unclosed directive diagnostic with its source line', async () => {
  const result = await compile('# Intro\n\n:::card\nContent', {autoFix: false});
  expect(result.metadata.warnings).toContainEqual(expect.objectContaining({type: 'parse', line: 3, message: expect.stringContaining('Unclosed')}));
});
it('accepts compact attributes without reporting a spurious correction', async () => {
  const result = await compile(':::card{elevated}\nContent\n:::');
  expect(result.metadata.warnings).toEqual([]);
  expect(result.html).toContain('data-component="card"');
});

it.each(['\n', '\r\n'])('preserves compact syntax inside code examples (%j)', async newline => {
  const literal = ':::card{elevated}\nContent\n:::';
  const result = await compile(['```taildown', ...literal.split('\n'), '```'].join(newline));
  expect(new JSDOM(result.html).window.document.querySelector('pre code')?.textContent).toBe(literal + '\n');
  expect(result.metadata.warnings).toEqual([]);
});

it('keeps compilation output independent of deprecated correction flags', async () => {
  const source = ':::card{id="sample"}\nContent\n:::';
  const normal = await compile(source);
  const legacy = await compile(source, {autoFix: true, logSyntaxFixes: true});
  expect(legacy.html).toBe(normal.html);
  expect(legacy.metadata.warnings).toEqual([]);
});
it('locates unknown component names', async () => {
  const result = await compile('# Intro\n\n:::missing-widget\nText\n:::');
  expect(result.metadata.warnings).toContainEqual(expect.objectContaining({type: 'validation', line: 3, message: 'Unknown component: missing-widget'}));
});

it('recognizes parser-owned footnotes as a supported component', async () => {
  const result = await compile(':::footnotes\nText\n:::');
  expect(result.metadata.warnings).not.toContainEqual(expect.objectContaining({message: 'Unknown component: footnotes'}));
});
