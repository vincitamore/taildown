/**
 * Math Parser
 * 
 * Parses LaTeX math equations with $ and $$ delimiters
 * - $ ... $ for inline math
 * - $$ ... $$ for display math (block-level, centered)
 * 
 * Converts LaTeX to MathML at compile time using temml
 */

import type { Root, Text, Parent } from 'mdast';
import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import temml from 'temml';

/**
 * Math node type (extends MDAST)
 */
interface MathNode {
  type: 'math';
  value: string; // LaTeX source
  data: {
    hName: 'span' | 'div';
    hProperties: {
      className: string[];
      'data-math-type': 'inline' | 'display';
    };
    hChildren: Array<{ type: 'raw'; value: string }>;
  };
}

/**
 * Inline math node
 */
interface InlineMathNode extends MathNode {
  data: {
    hName: 'span';
    hProperties: {
      className: ['math', 'math-inline'];
      'data-math-type': 'inline';
    };
    hChildren: Array<{ type: 'raw'; value: string }>;
  };
}

/**
 * Display math node (block-level)
 */
interface DisplayMathNode extends MathNode {
  data: {
    hName: 'div';
    hProperties: {
      className: ['math', 'math-display'];
      'data-math-type': 'display';
    };
    hChildren: Array<{ type: 'raw'; value: string }>;
  };
}

/**
 * Parse math equations from text nodes
 * 
 * Syntax:
 * - Inline: $x^2 + y^2 = z^2$
 * - Display: $$\int_0^\infty e^{-x^2} dx = \frac{\sqrt{\pi}}{2}$$
 * 
 * Escaping:
 * - \$ to escape a dollar sign
 * - $$ at start of line for display math (centered)
 * - $ anywhere else for inline math
 */
export function remarkMath() {
  return (tree: Root): void => {
    // Visit text nodes directly (like footnote parser does)
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined) return;
      
      const text = node.value;
      
      // Check if text contains math delimiters
      if (!text.includes('$')) return;
      
      const newNodes: any[] = [];
      let lastIndex = 0;
      
      // Create a list of all math matches with their positions
      const mathMatches: Array<{start: number; end: number; latex: string; isDisplay: boolean}> = [];
      
      // Find all display math ($$...$$) first
      const displayMathRegex = /\$\$([\s\S]+?)\$\$/g;
      let match: RegExpExecArray | null;
      while ((match = displayMathRegex.exec(text)) !== null) {
        mathMatches.push({
          start: match.index,
          end: match.index + match[0].length,
          latex: match[1],
          isDisplay: true,
        });
      }
      
      // Find all inline math ($...$) - skip positions overlapping with display math
      const inlineMathRegex = /\$([^\$\n]+?)\$/g;
      while ((match = inlineMathRegex.exec(text)) !== null) {
        const start = match.index;
        const end = start + match[0].length;
        
        // Check if this position overlaps with any display math
        const overlaps = mathMatches.some(m => 
          (start >= m.start && start < m.end) || (end > m.start && end <= m.end)
        );
        
        if (!overlaps) {
          mathMatches.push({
            start,
            end,
            latex: match[1],
            isDisplay: false,
          });
        }
      }
      
      // If no math found, return early
      if (mathMatches.length === 0) return;
      
      // Sort matches by position
      mathMatches.sort((a, b) => a.start - b.start);
      
      // Build new nodes
      for (const mathMatch of mathMatches) {
        // Add text before math
        if (mathMatch.start > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, mathMatch.start),
          });
        }
        
        // Convert LaTeX to MathML using temml
        let mathML: string;
        try {
          mathML = temml.renderToString(mathMatch.latex, {
            displayMode: mathMatch.isDisplay,
            throwOnError: false,
            trust: false,
          });
        } catch (error) {
          console.warn(`[Math Parser] Failed to convert LaTeX: ${mathMatch.latex}`, error);
          mathML = `<span class="math-error" title="LaTeX conversion failed">${escapeHtml(mathMatch.latex)}</span>`;
        }
        
        // Create math node - custom handler in html.ts will convert to HAST
        if (mathMatch.isDisplay) {
          newNodes.push({
            type: 'math',
            value: mathMatch.latex,
            mathML: mathML, // Store MathML for custom handler
            data: {
              hName: 'div',
              hProperties: {
                className: ['math', 'math-display'],
                'data-math-type': 'display',
              },
            },
          });
        } else {
          newNodes.push({
            type: 'math',
            value: mathMatch.latex,
            mathML: mathML, // Store MathML for custom handler
            data: {
              hName: 'span',
              hProperties: {
                className: ['math', 'math-inline'],
                'data-math-type': 'inline',
              },
            },
          });
        }
        
        lastIndex = mathMatch.end;
      }
      
      // Add remaining text
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }
      
      // Replace the text node with new nodes (same as footnote parser)
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });
  };
};

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

