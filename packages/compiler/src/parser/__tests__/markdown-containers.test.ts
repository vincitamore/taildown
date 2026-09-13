import { visit } from 'unist-util-visit';
import type { Code } from 'mdast';
import type { ContainerDirectiveNode } from '../directive-types';
import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { parseWithWarnings } from '../index';
import { compile } from '../../index';

it.each(['\n', '\r\n'])('keeps cards inside quotes and list items (%j)', async (newline) => {
  for (const [lines, selector] of [
    [['> :::card', '> Inside **bold**', '> :::'], 'blockquote > [data-component="card"]'],
    [['- :::card', '  Inside **bold**', '  :::', '- Second'], 'li > [data-component="card"]'],
    [['> - :::card', '>   Inside **bold**', '>   :::'], 'blockquote li > [data-component="card"]'],
  ] as const) {
    const source = lines.join(newline);
    const result = await compile(source, { autoFix: false });
    expect(result.metadata.warnings).toEqual([]);
    const document = new JSDOM(result.html).window.document;
    expect(document.querySelector(selector)?.querySelector('strong')?.textContent).toBe('bold');
    expect(document.body.textContent).not.toContain(':::');
    const { ast } = await parseWithWarnings(source);
    const nodes: ContainerDirectiveNode[] = [];
    visit(ast, 'containerDirective', (node) => {
      nodes.push(node);
    });
    expect(nodes[0]?.position?.start.offset).toBe(source.indexOf(':::card'));
    expect(nodes[0]?.position?.end.offset).toBe(source.lastIndexOf(':::') + 3);
  }
});

it.each(['- Item', '> Quote'])('lets an outer card close immediately after %s', async (body) => {
  const { ast, warnings } = await parseWithWarnings(':::card\n' + body + '\n:::\nOutside');
  expect(warnings).toEqual([]);
  expect(ast.children).toHaveLength(2);
  expect(ast.children[0]).toMatchObject({ type: 'containerDirective', name: 'card' });
  expect(ast.children[1]).toMatchObject({ type: 'paragraph', children: [{ value: 'Outside' }] });
});

it('does not let unclosed components consume a sibling list item', async () => {
  const { ast, warnings } = await parseWithWarnings('- :::card\n  Inside\n- Outside');
  expect(warnings).toHaveLength(1);
  expect(warnings[0]?.message).toContain('Unclosed component');
  expect(ast.children[0]).toMatchObject({
    type: 'list',
    children: [
      {
        type: 'listItem',
        children: [{ type: 'containerDirective', children: [{ children: [{ value: 'Inside' }] }] }],
      },
      { type: 'listItem', children: [{ type: 'paragraph', children: [{ value: 'Outside' }] }] },
    ],
  });
});

it('preserves code, escaped fences and prose containing colons', async () => {
  const source = '> `:::card`\n> \\:::card\n> prose :::card\n\n```\n:::card\n```';
  const { ast, warnings } = await parseWithWarnings(source);
  expect(warnings).toEqual([]);
  expect(JSON.stringify(ast)).not.toContain('containerDirective');
});

it.each([
  '> :::mermaid\n>graph TD\n>   A-->B\n> :::',
  '- :::mermaid\n  graph TD\n    A-->B\n  :::',
  '> - :::mermaid\n>   graph TD\n>     A-->B\n>   :::',
  '10. > :::mermaid\n    > graph TD\n    >   A-->B\n    > :::',
  '- - > :::mermaid\n    > graph TD\n    >   A-->B\n    > :::',
  '-\t> :::mermaid\n    > graph TD\n    >   A-->B\n    > :::',
  '-\t:::mermaid\n\tgraph TD\n\t  A-->B\n\t:::',
])('strips Markdown container prefixes from Mermaid source: %s', async (source) => {
  const { ast, warnings } = await parseWithWarnings(source);
  expect(warnings).toEqual([]);
  const nodes: Code[] = [];
  visit(ast, 'code', (node) => {
    nodes.push(node);
  });
  expect(nodes).toMatchObject([{ lang: 'mermaid', value: 'graph TD\n  A-->B' }]);
});
