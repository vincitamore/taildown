/**
 * Inline Attribute Parser for Taildown
 * See SYNTAX.md §2 for inline attribute specification
 * Phase 2: Integrates plain English style resolver
 */

import { visit } from 'unist-util-visit';
import type { Root, Heading, Paragraph, Link, Text } from 'mdast';
import type { Plugin } from 'unified';
import type { CompilationWarning, TaildownNodeData } from '@taildown/shared';
import { ATTRIBUTE_BLOCK_REGEX, CLASS_NAME_REGEX } from '@taildown/shared';
import { resolveAttributes, type ResolverContext } from '../resolver/style-resolver';
import { DEFAULT_CONFIG } from '../config/default-config';
import { registry } from '../components/component-registry';
import { resolveComponentClasses } from '../components/variant-system';

interface AttributePluginOptions {
  warnings: CompilationWarning[];
  /** Resolver context for plain English resolution (Phase 2) */
  resolverContext?: ResolverContext;
}

/**
 * Extract inline attributes from text content
 * See SYNTAX.md §2.2.5 for extraction algorithm
 * Phase 2: Now extracts both CSS classes (.class) and plain English (class)
 * Phase 2.5: Now also extracts attachable components (modal="..." tooltip="...")
 * 
 * @param text - Text content to extract from
 * @param resolverContext - Context for resolving plain English (optional)
 * @returns Object with extracted/resolved classes, remaining text, and attachable components
 */
function extractAttributesFromText(
  text: string,
  resolverContext?: ResolverContext
): {
  classes: string[];
  remainingText: string;
  modal?: string;
  tooltip?: string;
} {
  const match = text.match(ATTRIBUTE_BLOCK_REGEX);

  if (!match) {
    return { classes: [], remainingText: text };
  }

  const attributeBlock = match[1]?.trim();
  if (!attributeBlock) {
    // Empty attribute block {}
    return { classes: [], remainingText: text.replace(ATTRIBUTE_BLOCK_REGEX, '') };
  }
  
  // Extract key-value attributes (modal="..." tooltip="...")
  const kvAttrs: { modal?: string; tooltip?: string } = {};
  let cleanedBlock = attributeBlock;
  
  // Match modal="..." or modal='...'
  const modalMatch = attributeBlock.match(/modal=["']([^"']+)["']/);
  if (modalMatch) {
    kvAttrs.modal = modalMatch[1];
    cleanedBlock = cleanedBlock.replace(modalMatch[0], '').trim();
  }
  
  // Match tooltip="..." or tooltip='...'
  const tooltipMatch = attributeBlock.match(/tooltip=["']([^"']+)["']/);
  if (tooltipMatch) {
    kvAttrs.tooltip = tooltipMatch[1];
    cleanedBlock = cleanedBlock.replace(tooltipMatch[0], '').trim();
  }

  // Phase 2: Extract both CSS classes and plain English
  // - CSS classes start with dot: .text-4xl
  // - Plain English doesn't: primary, large, bold
  // - Component keywords: button, badge, alert, etc.
  const rawAttributes: string[] = [];
  const tokens = cleanedBlock.split(/\s+/).filter((t) => t.length > 0);

  for (const token of tokens) {
    if (CLASS_NAME_REGEX.test(token)) {
      // CSS class with dot - remove dot and add
      rawAttributes.push(token.substring(1));
    } else if (token && !token.startsWith('.')) {
      // Plain English (no dot) - add as-is
      rawAttributes.push(token);
    }
    // Invalid tokens are silently ignored (graceful degradation)
  }

  // Phase 2: Check if first token is a component name
  let classes: string[];
  const firstToken = rawAttributes[0];
  const component = firstToken ? registry.get(firstToken) : null;
  
  if (component) {
    // First token is a component (e.g., "button") - use component resolution
    const remainingAttrs = rawAttributes.slice(1); // Remove component name
    const result = resolveComponentClasses(firstToken, remainingAttrs, {
      includeDefaults: true,
      warnOnUnknown: false,
    });
    classes = result.classes;
  } else if (resolverContext) {
    // No component - use plain English resolver
    classes = resolveAttributes(rawAttributes, resolverContext);
  } else {
    // No resolver context - use raw attributes (backward compatible)
    classes = rawAttributes;
  }

  // Remove attribute block from text
  const remainingText = text.replace(ATTRIBUTE_BLOCK_REGEX, '').trimEnd();

  return { classes, remainingText, ...kvAttrs };
}

/**
 * unified plugin to extract and attach inline attributes
 * See SYNTAX.md §2.1-2.3 for supported elements
 * Phase 2: Now resolves plain English syntax
 */
export const extractInlineAttributes: Plugin<[AttributePluginOptions?], Root> = (
  options
) => {
  // Phase 2: Get resolver context (or create default)
  const resolverContext: ResolverContext = options?.resolverContext ?? {
    config: DEFAULT_CONFIG,
    darkMode: false,
  };

  return (tree) => {
    // Process links FIRST - See SYNTAX.md §2.3
    // Links must be processed before paragraphs to claim their attributes
    visit(tree, 'link', (node: Link, index, parent) => {
      // For links, attributes come after the closing parenthesis in the parent text
      if (!parent || index === null || index === undefined) {
        return;
      }

      const nextSibling = parent.children[index + 1];

      if (nextSibling && nextSibling.type === 'text') {
        const textNode = nextSibling as Text;
        
        // Extract attributes including modal/tooltip attachments
        const { classes, remainingText, modal, tooltip } = extractAttributesFromText(
          textNode.value,
          resolverContext
        );

        // Update text node
        textNode.value = remainingText;

        // Attach data to link node
        node.data = node.data || {};
        const data = node.data as TaildownNodeData;
        data.hProperties = data.hProperties || {};
        
        if (classes.length > 0) {
          data.hProperties.className = classes;
        }
        
        // Store modal/tooltip as data attributes for post-processing
        if (modal) {
          data.hProperties['data-modal-attach'] = modal;
        }
        if (tooltip) {
          data.hProperties['data-tooltip-attach'] = tooltip;
        }
      }
    });

    // Process headings - See SYNTAX.md §2.3
    visit(tree, 'heading', (node: Heading) => {
      const lastChild = node.children[node.children.length - 1];

      if (lastChild && lastChild.type === 'text') {
        const textNode = lastChild as Text;
        const { classes, remainingText, modal, tooltip } = extractAttributesFromText(
          textNode.value,
          resolverContext
        );

        // Update text content
        textNode.value = remainingText;

        // Attach data to node
        node.data = node.data || {};
        const data = node.data as TaildownNodeData;
        data.hProperties = data.hProperties || {};
        
        if (classes.length > 0) {
          data.hProperties.className = classes;
        }
        
        // Store modal/tooltip as data attributes for post-processing
        if (modal) {
          data.hProperties['data-modal-attach'] = modal;
        }
        if (tooltip) {
          data.hProperties['data-tooltip-attach'] = tooltip;
        }
      }
    });

    // Process paragraphs - See SYNTAX.md §2.3
    // Paragraphs are processed AFTER links so links can claim their attributes first
    visit(tree, 'paragraph', (node: Paragraph) => {
      const lastChild = node.children[node.children.length - 1];

      if (lastChild && lastChild.type === 'text') {
        const textNode = lastChild as Text;
        const { classes, remainingText, modal, tooltip } = extractAttributesFromText(
          textNode.value,
          resolverContext
        );

        textNode.value = remainingText;

        node.data = node.data || {};
        const data = node.data as TaildownNodeData;
        data.hProperties = data.hProperties || {};
        
        if (classes.length > 0) {
          data.hProperties.className = classes;
        }
        
        // Store modal/tooltip as data attributes for post-processing
        if (modal) {
          data.hProperties['data-modal-attach'] = modal;
        }
        if (tooltip) {
          data.hProperties['data-tooltip-attach'] = tooltip;
        }
      }
    });
  };
};

