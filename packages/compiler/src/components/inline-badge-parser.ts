import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text } from 'mdast';
import { resolveComponentClasses } from '../components/variant-system';

// Matches :badge[text]{optional attributes}
const INLINE_BADGE_REGEX = /:badge\[([^\]]+)\](?:\{([^}]+)\})?/g;

function parseAttributes(input?: string): string[] {
  if (!input) return [];
  // Split on whitespace, ignore empties
  return input
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

export const parseInlineBadges: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || typeof node.value !== 'string' || !node.value.includes(':badge[')) return;

      const parts: any[] = [];
      let lastIndex = 0;
      const value = node.value;
      let match: RegExpExecArray | null;

      INLINE_BADGE_REGEX.lastIndex = 0;
      while ((match = INLINE_BADGE_REGEX.exec(value)) !== null) {
        const [full, label, attrsRaw] = match;
        const start = match.index;
        const end = start + full.length;

        // Preceding text
        if (start > lastIndex) {
          parts.push({ type: 'text', value: value.slice(lastIndex, start) });
        }

        // Resolve classes via component registry/variant system
        const modifiers = parseAttributes(attrsRaw);
        const result = resolveComponentClasses('badge', modifiers, {
          includeDefaults: true,
          warnOnUnknown: false,
        });

        const badgeNode: any = {
          type: 'badge',
          data: {
            hName: 'span',
            hProperties: {
              className: result.classes,
              'data-component': 'badge',
            },
          },
          children: [{ type: 'text', value: label }],
        };

        parts.push(badgeNode);
        lastIndex = end;
      }

      // Trailing text
      if (lastIndex < value.length) {
        parts.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (parts.length > 0) {
        // Replace the single text node with multiple nodes
        parent.children.splice(index as number, 1, ...parts);
        return index! + parts.length;
      }
    });
  };
};
