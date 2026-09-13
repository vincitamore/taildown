import { describe, expect, it } from 'vitest';
import { createLinter } from '../index';

describe('linter parser integration', () => {
  it('awaits parsing before running component rules', async () => {
    const result = await createLinter().lint(':::tabs\n#### One\nContent\n:::');
    expect(result.messages.some(message => message.rule === 'tabs-heading-level')).toBe(true);
    expect(result.hasErrors).toBe(true);
  });

  it('fixes tab headings and rechecks the resulting document', async () => {
    const result = await createLinter().fix(':::tabs\n#### One\nContent\n:::');
    expect(result.fixed).toBe(':::tabs\n### One\nContent\n:::');
    expect(result.messages).toEqual([]);
    expect(result.modified).toBe(true);
  });

  it('uses the compiler registry for all supported component names', async () => {
    const result = await createLinter().lint(':::stats\n42\n:::');
    expect(result.messages.filter(message => message.rule === 'invalid-component-name')).toEqual([]);
  });

  it('respects disabled rules', async () => {
    const result = await createLinter({ rules: { 'tabs-heading-level': 'off' } }).lint(':::tabs\n#### One\nContent\n:::');
    expect(result.messages).toEqual([]);
  });

  it('fixes component typos after preceding content', async () => {
    const result = await createLinter().fix('# Intro\n\n:::tabes\n### One\nContent\n:::');
    expect(result.fixed).toBe('# Intro\n\n:::tabs\n### One\nContent\n:::');
  });

  it('fixes multiple different-length names without shifting later edits', async () => {
    const source = ':::tabes\n### One\nContent\n:::\n\n:::acordion\nContent\n:::';
    const result = await createLinter().fix(source);
    expect(result.fixed).toBe(source.replace('tabes', 'tabs').replace('acordion', 'accordion'));
    expect((await createLinter().fix(result.fixed)).modified).toBe(false);
  });
});

it('repairs a name before applying component-specific heading fixes', async () => {
  const linter = createLinter();
  const result = await linter.fix(':::tabes\n#### One\nText\n:::');
  expect(result.fixed).toBe(':::tabs\n### One\nText\n:::');
  expect((await linter.fix(result.fixed)).modified).toBe(false);
});

it('preserves indentation while fixing heading markers', async () => {
  const result = await createLinter().fix('  :::tabs\n  #### One\n  Text\n  :::');
  expect(result.fixed).toContain('  ### One');
});

it('preserves valid custom names that resemble built-in typos', async () => {
  const { registry, parse } = await import('@taildown/compiler');
  await parse('');
  const card = registry.get('card');
  if (!card) throw new Error('Expected registered card');
  registry.register({ ...card, name: 'cards' });
  try {
    const result = await createLinter().fix(':::cards\nCustom\n:::');
    expect(result.modified).toBe(false);
    expect(result.messages).toEqual([]);
  } finally { registry.unregister('cards'); }
});
