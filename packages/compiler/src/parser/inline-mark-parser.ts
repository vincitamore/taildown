/**
 * Inline Mark/Highlight Parser for Taildown
 * Parses ==highlighted text== syntax for semantic text highlighting
 * 
 * Syntax: ==text=={variant}
 * 
 * Similar to inline badge parser, this converts ==text== to <mark> elements
 * with optional semantic color variants.
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Text } from 'mdast';
import { resolveComponentClasses } from '../components/variant-system';

// Matches ==text=={optional attributes}
const INLINE_MARK_REGEX = /==([^=]+)==(?:\{([^}]+)\})?/g;

function parseAttributes(input?: string): string[] {
  if (!input) return [];
  // Split on whitespace, ignore empties
  return input
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * unified plugin to parse ==text== as <mark> elements
 * 
 * Examples:
 * - ==highlighted== → <mark class="highlight">highlighted</mark>
 * - ==important=={warning} → <mark class="highlight highlight-warning">important</mark>
 * - ==success=={success} → <mark class="highlight highlight-success">success</mark>
 */
export const parseInlineMarks: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || typeof node.value !== 'string' || !node.value.includes('==')) return;

      const parts: any[] = [];
      let lastIndex = 0;
      const value = node.value;
      let match: RegExpExecArray | null;

      INLINE_MARK_REGEX.lastIndex = 0;
      while ((match = INLINE_MARK_REGEX.exec(value)) !== null) {
        const [full, text, attrsRaw] = match;
        const start = match.index;
        const end = start + full.length;

        // Preceding text
        if (start > lastIndex) {
          parts.push({ type: 'text', value: value.slice(lastIndex, start) });
        }

        // Parse variant attributes
        const modifiers = parseAttributes(attrsRaw);
        
        // Build class list for mark element
        const classes = ['highlight'];
        
        // Add variant class if specified
        if (modifiers.length > 0) {
          // Support semantic variants
          for (const mod of modifiers) {
            if (['warning', 'success', 'error', 'info', 'primary', 'muted'].includes(mod)) {
              classes.push(`highlight-${mod}`);
            }
          }
        }

        const markNode: any = {
          type: 'mark',
          data: {
            hName: 'mark',
            hProperties: {
              className: classes,
            },
          },
          children: [{ type: 'text', value: text }],
        };

        parts.push(markNode);
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

