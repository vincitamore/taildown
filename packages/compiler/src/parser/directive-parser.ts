/**
 * Custom Directive Parser - Main Entry Point
 * Replaces remark-directive with spec-compliant implementation
 * See SYNTAX.md §3 and CUSTOM-DIRECTIVE-PARSER-PLAN.md
 */

import type { Plugin } from 'unified';
import type { Root } from 'mdast';
import { scanForMarkers } from './directive-scanner';
import { buildComponentTree } from './directive-builder';
import { visit } from 'unist-util-visit';

/** Restore absolute source offsets after scanning component fences. */
function locateDirectives(tree: Root, source: string): void {
  const lines = source.split('\n');
  const offsets: number[] = [];
  let offset = 0;
  for (const line of lines) { offsets.push(offset); offset += line.length + 1; }
  visit(tree, 'containerDirective', node => {
    if (!node.position) return;
    for (const edge of ['start', 'end'] as const) {
      const point = node.position[edge];
      const line = lines[point.line - 1];
      const lineOffset = offsets[point.line - 1];
      if (line === undefined || lineOffset === undefined) continue;
      const fence = edge === 'start' ? line.indexOf(':::' + node.name) : line.lastIndexOf(':::');
      if (fence >= 0) {
        point.column = edge === 'start' ? fence + 1 : line.replace(/\r$/, '').length + 1;
      }
      point.offset = lineOffset + point.column - 1;
    }
  });
}

/**
 * unified plugin to parse component directives (:::component syntax)
 * 
 * This is a custom implementation that correctly handles blank lines
 * between nested sibling components, which remark-directive does not.
 * 
 * See SYNTAX.md §3 for full component block specification
 * See CUSTOM-DIRECTIVE-PARSER-PLAN.md for implementation details
 * 
 * Algorithm:
 * 1. Scan MDAST for ::: fence markers
 * 2. Build component tree using stack-based nesting (LIFO)
 * 3. Support blank lines between siblings
 * 4. Auto-close unclosed components at document end
 * 5. Validate component names and emit warnings
 * 
 * @returns unified transformer
 */
export const parseDirectives: Plugin<[], Root> = () => {
  return (tree, file) => {
    const warnings: Array<{ message: string; line?: number }> = [];

    // Callback for collecting warnings
    const onWarning = (message: string, line?: number) => {
      warnings.push({ message, line });
      // Optionally add to file messages
      if (file && line) {
        file.message(message, {
          line,
          column: 1,
        });
      }
    };

    // Phase 1: Scan for markers
    const { items } = scanForMarkers(tree.children);

    // Phase 2: Build component tree
    const transformedChildren = buildComponentTree(
      items.map((item) => {
        if (item.type === 'marker') {
          return { type: 'marker', marker: item.marker };
        } else {
          return { type: 'content', node: item.node };
        }
      }),
      { onWarning, endPosition: tree.position?.end }
    );

    // Replace tree children with transformed content
    tree.children = transformedChildren;
    if (file.value !== undefined) locateDirectives(tree, String(file));

    // Log warnings for debugging (in development)
    if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
      console.warn(`[Taildown] Directive parser warnings:`);
      for (const warning of warnings) {
        console.warn(
          `  Line ${warning.line ?? '?'}: ${warning.message}`
        );
      }
    }
  };
};

/**
 * Parse directives with explicit warning collection
 * Useful for testing and debugging
 */
export function parseDirectivesWithWarnings(tree: Root): {
  tree: Root;
  warnings: Array<{ message: string; line?: number }>;
} {
  const warnings: Array<{ message: string; line?: number }> = [];

  const onWarning = (message: string, line?: number) => {
    warnings.push({ message, line });
  };

  const { items } = scanForMarkers(tree.children);

  const transformedChildren = buildComponentTree(
    items.map((item) => {
      if (item.type === 'marker') {
        return { type: 'marker', marker: item.marker };
      } else {
        return { type: 'content', node: item.node };
      }
    }),
    { onWarning, endPosition: tree.position?.end }
  );

  tree.children = transformedChildren;

  return { tree, warnings };
}
