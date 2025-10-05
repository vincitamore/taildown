/**
 * Custom Directive Parser - Main Entry Point
 * Replaces remark-directive with spec-compliant implementation
 * See SYNTAX.md §3 and CUSTOM-DIRECTIVE-PARSER-PLAN.md
 */

import type { Plugin } from 'unified';
import type { Root, Content } from 'mdast';
import type { VFile } from 'vfile';
import { scanForMarkers } from './directive-scanner';
import { buildComponentTree } from './directive-builder';

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
  return (tree: Root, file: VFile) => {
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
      { onWarning }
    );

    // Replace tree children with transformed content
    tree.children = transformedChildren;

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
    { onWarning }
  );

  tree.children = transformedChildren;

  return { tree, warnings };
}

