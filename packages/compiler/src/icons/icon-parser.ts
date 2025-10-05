/**
 * Icon Parser for Taildown
 * Parses :icon[name]{classes} syntax and creates icon nodes
 * 
 * Syntax:
 * :icon[home] - Basic icon
 * :icon[home]{large} - Icon with plain English classes
 * :icon[home]{.text-blue-500 .w-8} - Icon with CSS classes
 * :icon[search]{primary large} - Icon with semantic styling
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §3 for icon system design
 */

import { visit } from 'unist-util-visit';
import type { Root, Text, Paragraph } from 'mdast';
import type { Plugin } from 'unified';
import type { TaildownNodeData } from '@taildown/shared';
import { resolveAttributes, type ResolverContext } from '../resolver/style-resolver';
import { DEFAULT_CONFIG } from '../config/default-config';

/**
 * Icon syntax regex
 * Matches :icon[iconName]{optional classes}
 * 
 * Examples:
 * - :icon[home]
 * - :icon[search]{large primary}
 * - :icon[menu]{.w-6 .h-6}
 */
const ICON_REGEX = /:icon\[([a-z0-9-]+)\](?:\{([^}]+)\})?/g;

/**
 * Icon node type
 * Represents an icon in the AST
 */
export interface IconNode {
  type: 'icon';
  name: string;
  classes: string[];
  data?: TaildownNodeData;
}

interface IconPluginOptions {
  /** Resolver context for plain English resolution */
  resolverContext?: ResolverContext;
}

/**
 * Parse icon attributes from attribute block
 * 
 * @param attributeBlock - Raw attribute string from {classes}
 * @param resolverContext - Context for resolving plain English
 * @returns Array of CSS class names
 */
function parseIconAttributes(
  attributeBlock: string,
  resolverContext?: ResolverContext
): string[] {
  if (!attributeBlock || !attributeBlock.trim()) {
    return [];
  }

  const rawAttributes: string[] = [];
  const tokens = attributeBlock.split(/\s+/).filter((t) => t.length > 0);

  for (const token of tokens) {
    if (token.startsWith('.')) {
      // Direct CSS class - remove dot
      rawAttributes.push(token.substring(1));
    } else {
      // Plain English shorthand
      rawAttributes.push(token);
    }
  }

  // Resolve plain English to CSS classes
  if (resolverContext && rawAttributes.length > 0) {
    return resolveAttributes(rawAttributes, resolverContext);
  }

  return rawAttributes;
}

/**
 * Extract icons from text content
 * Replaces :icon[name]{classes} with icon nodes
 * 
 * @param text - Text content containing icon syntax
 * @param resolverContext - Context for resolving attributes
 * @returns Array of text fragments and icon nodes
 */
function extractIconsFromText(
  text: string,
  resolverContext?: ResolverContext
): Array<{ type: 'text' | 'icon'; value?: string; icon?: { name: string; classes: string[] } }> {
  const results: Array<{ 
    type: 'text' | 'icon'; 
    value?: string; 
    icon?: { name: string; classes: string[] } 
  }> = [];
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex
  ICON_REGEX.lastIndex = 0;

  while ((match = ICON_REGEX.exec(text)) !== null) {
    // Add text before icon
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore) {
        results.push({ type: 'text', value: textBefore });
      }
    }

    // Add icon
    const iconName = match[1];
    const attributeBlock = match[2] || '';
    
    if (iconName) {
      const classes = parseIconAttributes(attributeBlock, resolverContext);
      results.push({
        type: 'icon',
        icon: { name: iconName, classes },
      });
    }

    lastIndex = ICON_REGEX.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    if (textAfter) {
      results.push({ type: 'text', value: textAfter });
    }
  }

  return results;
}

/**
 * unified plugin to parse icon syntax
 * Processes text nodes and replaces :icon[name]{classes} with icon nodes
 * 
 * @param options - Plugin options including resolver context
 * @returns unified transformer
 */
export const parseIcons: Plugin<[IconPluginOptions?], Root> = (options) => {
  const resolverContext: ResolverContext = options?.resolverContext ?? {
    config: DEFAULT_CONFIG,
    darkMode: false,
  };

  return (tree) => {
    // Visit all text nodes and replace icon syntax
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === null || index === undefined) {
        return;
      }

      const text = node.value;
      
      // Check if text contains icon syntax
      if (!ICON_REGEX.test(text)) {
        return;
      }

      // Reset regex
      ICON_REGEX.lastIndex = 0;

      // Extract icons and text fragments
      const fragments = extractIconsFromText(text, resolverContext);

      if (fragments.length === 0) {
        return;
      }

      // Replace the text node with fragments
      const newNodes: any[] = [];
      
      for (const fragment of fragments) {
        if (fragment.type === 'text' && fragment.value) {
          newNodes.push({
            type: 'text',
            value: fragment.value,
          });
        } else if (fragment.type === 'icon' && fragment.icon) {
          // Create icon node
          const iconNode: any = {
            type: 'icon',
            name: fragment.icon.name,
            data: {
              hName: 'svg',
              hProperties: {
                className: ['icon', `icon-${fragment.icon.name}`, ...fragment.icon.classes],
                'data-icon': fragment.icon.name,
              },
            },
          };
          newNodes.push(iconNode);
        }
      }

      // Replace the text node with new nodes
      parent.children.splice(index, 1, ...newNodes);
    });
  };
};

