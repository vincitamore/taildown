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
 * See tech-spec.md for current architecture and docs-site/ for authoring references.
 */

import { visit } from 'unist-util-visit';
import type { Root, Text } from 'mdast';
import type { Plugin } from 'unified';
import type { CompilationWarning, TaildownNodeData } from '@taildown/shared';
import { textSlicePosition } from '../parser/text-position';
import { hasLucideIcon } from './lucide-icons';
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

// Icon dimensions are independent of the text-size shorthands. Resolve them
// into ordinary width/height utilities so later explicit dimensions can win.
export const ICON_SIZES: Readonly<Record<string, number>> = {
  tiny: 12, xs: 16, sm: 20, small: 20, md: 24, medium: 24,
  lg: 32, large: 32, xl: 40, '2xl': 48, huge: 64,
};

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
  warnings?: CompilationWarning[];
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
      const separator = token.lastIndexOf(':');
      const keyword = token.slice(separator + 1);
      const prefix = token.slice(0, separator + 1);
      const custom = resolverContext?.styleMappings && Object.hasOwn(resolverContext.styleMappings, token);
      const size = !custom && Object.hasOwn(ICON_SIZES, keyword) ? ICON_SIZES[keyword] : undefined;
      if (size !== undefined) rawAttributes.push(`${prefix}w-${size / 4}`, `${prefix}h-${size / 4}`);
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
interface IconFragment {
  type: 'text' | 'icon';
  start: number;
  end: number;
  value?: string;
  icon?: {name: string; classes: string[]};
}

function extractIconsFromText(
  text: string,
  resolverContext?: ResolverContext,
  node?: Text,
  source?: string,
): IconFragment[] {
  const results: IconFragment[] = [];
  
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex
  ICON_REGEX.lastIndex = 0;

  while ((match = ICON_REGEX.exec(text)) !== null) {
    const position = node && textSlicePosition(node, match.index, ICON_REGEX.lastIndex, source);
    const rawStart = position?.start.offset;
    if (source !== undefined && rawStart !== undefined && !source.slice(rawStart).startsWith(':icon[')) continue;
    // Add text before icon
    if (match.index > lastIndex) {
      const textBefore = text.substring(lastIndex, match.index);
      if (textBefore) {
        results.push({ type: 'text', value: textBefore, start: lastIndex, end: match.index });
      }
    }

    // Add icon
    const iconName = match[1];
    const attributeBlock = match[2] || '';
    
    if (iconName) {
      const classes = parseIconAttributes(attributeBlock, resolverContext);
      results.push({
        type: 'icon',
        start: match.index,
        end: ICON_REGEX.lastIndex,
        icon: { name: iconName, classes },
      });
    }

    lastIndex = ICON_REGEX.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textAfter = text.substring(lastIndex);
    if (textAfter) {
      results.push({ type: 'text', value: textAfter, start: lastIndex, end: text.length });
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

  return (tree, file) => {
    const source = typeof file.value === 'string' && file.value.length > 0 ? file.value : undefined;
    // Visit all text nodes and replace icon syntax
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || index === null || index === undefined) {
        return;
      }

      const text = node.value;
      
      // Check if text contains icon syntax
      ICON_REGEX.lastIndex = 0;
      if (!ICON_REGEX.test(text)) {
        return;
      }

      // Reset regex
      ICON_REGEX.lastIndex = 0;

      // Extract icons and text fragments
      const fragments = extractIconsFromText(text, resolverContext, node, source);

      if (!fragments.some(fragment => fragment.type === 'icon')) {
        return;
      }

      // Replace the text node with fragments
      const newNodes: any[] = [];
      
      for (const fragment of fragments) {
        const position = textSlicePosition(node, fragment.start, fragment.end, source);
        if (fragment.type === 'text' && fragment.value) {
          newNodes.push({
            type: 'text',
            value: fragment.value,
            position,
          });
        } else if (fragment.type === 'icon' && fragment.icon) {
          // Create icon node
          const iconNode: any = {
            type: 'icon',
            name: fragment.icon.name,
            position,
            data: {
              hName: 'svg',
              hProperties: {
                className: ['icon', `icon-${fragment.icon.name}`, ...fragment.icon.classes],
                'data-icon': fragment.icon.name,
              },
            },
          };
          if (!hasLucideIcon(fragment.icon.name)) {
            options?.warnings?.push({
              type: 'parse',
              message: `Unknown icon: ${fragment.icon.name}`,
              ...(position ? {line: position.start.line, column: position.start.column} : {}),
            });
          }
          newNodes.push(iconNode);
        }
      }

      // Replace the text node with new nodes
      parent.children.splice(index, 1, ...newNodes);
    });
  };
};

