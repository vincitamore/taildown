import { visit } from 'unist-util-visit';
import type { ContainerDirective, Heading } from 'mdast';
import { BaseRule } from './BaseRule';
import type { RuleContext, FixTransform } from '../types';

/**
 * Rule: Tabs component must use h2 or h3 headings, not h4 or higher
 * 
 * This catches the common mistake of using #### in tabs, which won't be
 * recognized as tab labels (only ## and ### work).
 */
export class TabsHeadingLevelRule extends BaseRule {
  readonly name = 'tabs-heading-level';
  readonly description = 'Tabs component requires h2 or h3 headings for tab labels';
  readonly severity = 'error';
  readonly category = 'component';
  readonly fixable = true;

  check(context: RuleContext): void {
    const { ast, source } = context;

    visit(ast, 'containerDirective', (node: ContainerDirective) => {
      if (node.name !== 'tabs') return;

      // Check children for invalid heading levels
      const children = node.children || [];
      for (const child of children) {
        if (child.type === 'heading') {
          const heading = child as Heading;
          
          // Only h2 (depth 2) and h3 (depth 3) are valid
          if (heading.depth > 3) {
            const position = heading.position;
            if (!position) continue;

            const line = position.start.line;
            const column = position.start.column;
            const hashes = '#'.repeat(heading.depth);
            const correctHashes = '###';

            context.report({
              severity: this.severity,
              message: `Tabs component requires h2 (##) or h3 (###) headings, found h${heading.depth} (${hashes})`,
              line,
              column,
              suggestion: `Change ${hashes} to ${correctHashes} for proper tab parsing`,
              snippet: this.getLineContext(context, line),
            });
          }
        }
      }
    });
  }

  fix(context: RuleContext): FixTransform | null {
    let { source } = context;
    let modified = false;
    const lines = source.split('\n');

    // Find and fix heading levels in tabs
    visit(context.ast, 'containerDirective', (node: ContainerDirective) => {
      if (node.name !== 'tabs') return;

      const children = node.children || [];
      for (const child of children) {
        if (child.type === 'heading') {
          const heading = child as Heading;
          
          if (heading.depth > 3 && heading.position) {
            // Get the line (0-indexed in array, 1-indexed in position)
            const lineIndex = heading.position.start.line - 1;
            const line = lines[lineIndex];
            
            // Replace #### or higher with ###
            const hashes = '#'.repeat(heading.depth);
            const regex = new RegExp(`^${hashes}\\s+`);
            
            if (regex.test(line)) {
              lines[lineIndex] = line.replace(regex, '### ');
              modified = true;
            }
          }
        }
      }
    });

    if (!modified) return null;

    return {
      source: lines.join('\n'),
      description: 'Fixed heading levels in tabs component (h4+ → h3)',
    };
  }
}

