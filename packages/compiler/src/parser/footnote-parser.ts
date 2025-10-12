/**
 * Hybrid Footnote Parser for Taildown
 * 
 * Combines the best of both worlds:
 * - Inline references: Standard Markdown [^id] syntax
 * - Definitions container: :::footnotes directive
 * 
 * Example:
 * ```
 * This needs a citation[^1]. Another reference[^smith].
 * 
 * :::footnotes
 * [^1]: Smith, John. *Book Title*. 2024.
 * [^smith]: Detailed citation with **formatting**.
 * :::
 * ```
 */

import type { Root, Text, Paragraph } from 'mdast';
import { visit } from 'unist-util-visit';
import type { ContainerDirectiveNode } from './directive-types';

/**
 * Footnote reference tracking
 */
interface FootnoteData {
  id: string;
  number: number;
  definition?: string;
  hasReference: boolean;
}

/**
 * Parse inline footnote references [^id]
 * Converts them to custom nodes for later rendering
 */
export function parseFootnoteReferences() {
  return (tree: Root): void => {
    const footnoteMap = new Map<string, FootnoteData>();
    let footnoteCounter = 1;

    // First pass: Find all [^id] references in text nodes
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === undefined) return;

      const text = node.value;
      const footnoteRegex = /\[\^([a-zA-Z0-9_-]+)\]/g;
      
      // Check if this text contains footnote references
      if (!footnoteRegex.test(text)) return;

      // Reset regex
      footnoteRegex.lastIndex = 0;

      // Split text and create new nodes
      const newNodes: any[] = [];
      let lastIndex = 0;
      let match;

      while ((match = footnoteRegex.exec(text)) !== null) {
        const id = match[1];
        
        // Add text before the reference
        if (match.index > lastIndex) {
          newNodes.push({
            type: 'text',
            value: text.slice(lastIndex, match.index),
          });
        }

        // Track footnote (auto-number on first appearance)
        if (!footnoteMap.has(id)) {
          footnoteMap.set(id, {
            id,
            number: footnoteCounter++,
            hasReference: true,
          });
        } else {
          footnoteMap.get(id)!.hasReference = true;
        }

        const footnoteData = footnoteMap.get(id)!;

        // Create footnote reference node
        newNodes.push({
          type: 'footnoteReference',
          identifier: id,
          label: id,
          number: footnoteData.number,
          data: {
            hName: 'a',
            hProperties: {
              href: `#fn-${id}`,
              id: `fnref-${id}`,
              role: 'doc-noteref',
              'aria-describedby': `fn-${id}`,
              'data-footnote-number': footnoteData.number,
              className: ['footnote-ref'],
            },
          },
          children: [{
            type: 'text',
            value: String(footnoteData.number),
          }],
        });

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        newNodes.push({
          type: 'text',
          value: text.slice(lastIndex),
        });
      }

      // Replace the text node with new nodes
      if (newNodes.length > 0) {
        parent.children.splice(index, 1, ...newNodes);
      }
    });

    // Store footnote map in tree data for use by definition parser
    if (!tree.data) {
      tree.data = {};
    }
    tree.data.footnoteMap = footnoteMap;
  };
}

/**
 * Parse :::footnotes directive and extract definitions
 * Matches definitions to references and builds footnote section
 */
export function parseFootnoteDefinitions() {
  return (tree: Root): void => {
    const footnoteMap = (tree.data?.footnoteMap as Map<string, FootnoteData>) || new Map();
    
    // Find :::footnotes container
    visit(tree, 'containerDirective', (node: ContainerDirectiveNode, index, parent) => {
      if (node.name !== 'footnotes') return;

      // Extract all text content from the container
      const fullText = extractTextContent(node);
      
      // Parse [^id]: definition format
      const definitionRegex = /^\[\^([a-zA-Z0-9_-]+)\]:\s+(.+?)(?=^\[\^[a-zA-Z0-9_-]+\]:|$)/gms;
      let match;

      while ((match = definitionRegex.exec(fullText)) !== null) {
        const id = match[1];
        let definition = match[2].trim();

        // Handle multi-line definitions (indented continuation)
        definition = definition.replace(/\n\s{2,}/g, '\n'); // Preserve line breaks

        // Store definition
        if (!footnoteMap.has(id)) {
          // Definition without reference - create entry anyway
          footnoteMap.set(id, {
            id,
            number: 0, // Will be numbered if referenced
            definition,
            hasReference: false,
          });
        } else {
          footnoteMap.get(id)!.definition = definition;
        }
      }

      // Build footnote section HTML
      const footnoteListItems: any[] = [];

      // Sort by number (references only)
      const referencedFootnotes = Array.from(footnoteMap.values())
        .filter(fn => fn.hasReference)
        .sort((a, b) => a.number - b.number);

      for (const footnote of referencedFootnotes) {
        if (!footnote.definition) {
          console.warn(`Taildown: Footnote [^${footnote.id}] referenced but not defined`);
          footnote.definition = `Missing definition for footnote ${footnote.id}`;
        }

        // Parse definition content as inline Markdown
        const definitionContent = parseInlineMarkdown(footnote.definition);

        footnoteListItems.push({
          type: 'listItem',
          spread: false,
          data: {
            hProperties: {
              id: `fn-${footnote.id}`,
              role: 'doc-footnote',
              className: ['footnote-item'],
            },
          },
          children: [
            {
              type: 'paragraph',
              children: [
                ...definitionContent,
                // Add backlink
                {
                  type: 'text',
                  value: ' ',
                },
                {
                  type: 'link',
                  url: `#fnref-${footnote.id}`,
                  data: {
                    hProperties: {
                      className: ['footnote-backlink'],
                      'aria-label': 'Back to content',
                    },
                  },
                  children: [{
                    type: 'text',
                    value: '↩',
                  }],
                },
              ],
            },
          ],
        });
      }

      // Replace :::footnotes directive with formatted section
      if (parent && index !== undefined && footnoteListItems.length > 0) {
        const footnoteSection = {
          type: 'containerDirective',
          name: 'footnotes',
          data: {
            hName: 'section',
            hProperties: {
              className: ['footnotes'],
              role: 'doc-endnotes',
              'data-component': 'footnotes', // For JS behavior
            },
          },
          children: [
            {
              type: 'heading',
              depth: 2,
              children: [{
                type: 'text',
                value: 'Footnotes',
              }],
            },
            {
              type: 'list',
              ordered: true,
              start: 1,
              spread: false,
              children: footnoteListItems,
            },
          ],
        };

        parent.children[index] = footnoteSection;
      }
    });
  };
}

/**
 * Extract all text content from a node recursively
 */
function extractTextContent(node: any): string {
  if (node.type === 'text') {
    return node.value;
  }
  
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextContent).join('');
  }
  
  return '';
}

/**
 * Parse inline Markdown formatting in footnote definitions
 * Supports **bold**, *italic*, `code`, and [links](url)
 */
function parseInlineMarkdown(text: string): any[] {
  const nodes: any[] = [];
  
  // Simple inline parsing (bold, italic, code, links)
  // For MVP, we'll just return text nodes and let the existing parser handle it
  // In the future, we can enhance this with proper inline parsing
  
  // For now, parse basic formatting
  const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[([^\]]+)\]\(([^)]+)\))/g);
  
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    if (!segment) continue;

    // Bold
    if (segment.startsWith('**') && segment.endsWith('**')) {
      nodes.push({
        type: 'strong',
        children: [{
          type: 'text',
          value: segment.slice(2, -2),
        }],
      });
    }
    // Italic
    else if (segment.startsWith('*') && segment.endsWith('*') && !segment.startsWith('**')) {
      nodes.push({
        type: 'emphasis',
        children: [{
          type: 'text',
          value: segment.slice(1, -1),
        }],
      });
    }
    // Code
    else if (segment.startsWith('`') && segment.endsWith('`')) {
      nodes.push({
        type: 'inlineCode',
        value: segment.slice(1, -1),
      });
    }
    // Link (captured groups)
    else if (i + 2 < segments.length && segments[i + 1] && segments[i + 2]) {
      nodes.push({
        type: 'link',
        url: segments[i + 2],
        children: [{
          type: 'text',
          value: segments[i + 1],
        }],
      });
      i += 2; // Skip captured groups
    }
    // Plain text
    else {
      nodes.push({
        type: 'text',
        value: segment,
      });
    }
  }

  return nodes.length > 0 ? nodes : [{ type: 'text', value: text }];
}
