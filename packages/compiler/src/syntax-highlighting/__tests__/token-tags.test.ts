import {expect, it, vi} from 'vitest';
import {highlightTree, tagHighlighter, tags} from '@lezer/highlight';
import {taildownLanguage} from '../codemirror6-language';

it('uses valid modifiers and connects icon and animation tokens to their theme tags', () => {
  const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
  try {
    const source = ':icon[star]{fade-in}\n\n$x$\n\n```mermaid\ngraph TD\n```';
    const tree = taildownLanguage.parser.parse(source);
    const spans: string[] = [];
    highlightTree(tree, tagHighlighter([
      {tag: tags.function(tags.name), class: 'icon'},
      {tag: tags.function(tags.keyword), class: 'animation'},
      {tag: tags.special(tags.keyword), class: 'special'},
      {tag: tags.special(tags.monospace), class: 'math'},
    ]), (from, to, name) => spans.push(`${name}:${source.slice(from,to)}`));
    expect(spans).toContain('icon:[star]');
    expect(spans).toContain('animation:fade-in');
    expect(spans).toContain('math:$x$');
    expect(spans).toContain('special:```mermaid');
    expect(warn).not.toHaveBeenCalled();
  } finally {warn.mockRestore();}
});
