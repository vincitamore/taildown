import { describe, expect, it, vi } from 'vitest';

describe('parser initialization', () => {
  it.each(['parse', 'parseWithWarnings'] as const)('resolves components on the first %s call', async (entry) => {
    vi.resetModules();
    const parser = await import('../index');
    const source = ':::card {padded-lg}\nHello\n:::';
    const first = entry === 'parse' ? await parser.parse(source) : (await parser.parseWithWarnings(source)).ast;
    const next = await parser.parse(source);
    expect(first).toEqual(next);
    expect(first.children[0]?.data?.hProperties?.className).toContain('p-8');
    expect(first.children[0]?.data?.hProperties?.className).toContain('glass-effect');
  });

  it('leaves ordinary Markdown free of unrelated footnote state', async () => {
    const { parse } = await import('../index');
    const ast = await parse('# Hello');
    expect(ast.data).toBeUndefined();
  });
});
