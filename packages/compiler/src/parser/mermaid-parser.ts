import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import { SKIP, visit } from 'unist-util-visit';
import { parseFenceLine } from './directive-scanner';

/** Give Mermaid fence metadata the same attribute and style pipeline as directives. */
export const parseMermaidFences: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'code', (node, index, parent) => {
    if (node.lang !== 'mermaid' || !node.meta?.trim() || index === undefined || !parent) return;
    if (parent.type === 'containerDirective' && parent.name === 'mermaid') return;
    const marker = parseFenceLine(':::mermaid ' + node.meta.trim(), node.position?.start.line ?? 1);
    if (!marker || marker.type !== 'open') return;
    parent.children[index] = {
      type: 'containerDirective',
      name: 'mermaid',
      attributes: marker.attributes,
      data: { hProperties: { className: marker.classes ?? [] } },
      children: [node],
      position: node.position,
    };
    return SKIP;
  });
};
