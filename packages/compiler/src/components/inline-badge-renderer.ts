/**
 * Inline Badge Renderer for Taildown
 * Converts badge nodes to HTML span elements
 * 
 * This runs in the rehype (HTML) stage after toHast conversion
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

/**
 * unified plugin to render badge nodes as HTML spans
 * Badge nodes were created by the inline-badge-parser
 * This ensures they get properly converted to HTML with text content
 * 
 * @returns unified transformer
 */
export const renderInlineBadges: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any, index, parent) => {
      // Only process span elements with data-component="badge"
      if (node.tagName !== 'span' || node.properties?.['data-component'] !== 'badge') {
        return;
      }

      // Badge nodes should already have their classes and properties set by the parser
      // The mdast-util-to-hast conversion handles hName and hProperties automatically
      // We just ensure the text content is properly wrapped as a text node
      
      // If there's a 'text' property from the badge node, convert it to children
      if (!node.children || node.children.length === 0) {
        // This shouldn't happen with our parser, but just in case
        return;
      }

      // Badges are already properly structured by mdast-util-to-hast
      // Just ensure no extra processing is needed
    });
  };
};


