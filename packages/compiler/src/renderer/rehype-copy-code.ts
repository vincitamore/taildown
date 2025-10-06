/**
 * Rehype plugin to add copy buttons to code blocks
 * 
 * Adds a copy button to each pre > code block for better UX.
 * Follows Taildown's professional standards and zero-config philosophy.
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';

/**
 * HAST Element interface
 */
interface Element {
  type: 'element';
  tagName: string;
  properties?: Record<string, any>;
  children: Array<Element | TextNode | RawNode>;
}

interface TextNode {
  type: 'text';
  value: string;
}

interface RawNode {
  type: 'raw';
  value: string;
}

/**
 * Extract text content from code element
 */
function extractCodeText(codeElement: Element): string {
  let text = '';
  
  function traverse(node: Element | TextNode | RawNode) {
    if (node.type === 'text') {
      text += node.value;
    } else if (node.type === 'raw') {
      // For syntax highlighted content, strip HTML tags
      text += node.value.replace(/<[^>]*>/g, '');
    } else if (node.type === 'element' && 'children' in node) {
      node.children.forEach(traverse);
    }
  }
  
  traverse(codeElement);
  return text;
}

/**
 * Create copy button element
 */
function createCopyButton(codeText: string): Element {
  // Generate unique ID for this code block
  const codeId = `code-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    type: 'element',
    tagName: 'button',
    properties: {
      className: ['code-copy-btn'],
      'data-code-id': codeId,
      'data-code-text': codeText,
      'aria-label': 'Copy code to clipboard',
      title: 'Copy code',
      type: 'button'
    },
    children: [
      {
        type: 'raw',
        value: `<svg class="copy-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
          <path d="m4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
        </svg>
        <svg class="check-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display: none;">
          <path d="M20 6 9 17l-5-5"/>
        </svg>
        <span class="copy-text">Copy</span>
        <span class="copied-text" style="display: none;">Copied!</span>`
      }
    ]
  };
}

/**
 * Rehype plugin to add copy buttons to code blocks
 */
export const rehypeCopyCode: Plugin = () => {
  return (tree) => {
    visit(tree, 'element', (node: Element, index, parent) => {
      // Look for pre elements containing code
      if (node.tagName === 'pre' && parent && typeof index === 'number') {
        const codeElement = node.children.find((child): child is Element => 
          child.type === 'element' && child.tagName === 'code'
        );
        
        if (codeElement) {
          // Extract the code text
          const codeText = extractCodeText(codeElement);
          
          // Create copy button
          const copyButton = createCopyButton(codeText);
          
          // Add copy button to the pre element
          node.children.push(copyButton);
          
          // Add data attribute to mark this as having a copy button
          node.properties = node.properties || {};
          node.properties['data-copyable'] = 'true';
        }
      }
    });
  };
};