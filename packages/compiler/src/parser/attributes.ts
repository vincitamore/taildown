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
 * Phase 3: Now also extracts ID anchors (#anchor-id)
 * 
 * @param text - Text content to extract from
 * @param resolverContext - Context for resolving plain English (optional)
 * @returns Object with extracted/resolved classes, remaining text, attachable components, and ID
 */
function extractAttributesFromText(
  text: string,
  resolverContext?: ResolverContext
): {
  classes: string[];
  remainingText: string;
  id?: string;
  modal?: string;
  tooltip?: string;
} {
  // Try to match attribute block at the END first (standard case)
  let match = text.match(ATTRIBUTE_BLOCK_REGEX);
  let attributeBlockRaw: string | null = null;
  let remainingAfterRemoval: string = text;

  if (match && match[1]) {
    attributeBlockRaw = match[1].trim();
    // Remove trailing attribute block from text
    remainingAfterRemoval = text.replace(ATTRIBUTE_BLOCK_REGEX, '').trimEnd();
  } else {
    // Fallback: Match attribute block at the START (common after links)
    // CRITICAL FIX: Match the block but preserve the space after it
    // Pattern: optional whitespace + { + content + } (but DON'T consume trailing space)
    const START_BLOCK_REGEX = /^\s*\{([^}]+)\}/;
    const startMatch = text.match(START_BLOCK_REGEX);
    if (startMatch && startMatch[1]) {
      attributeBlockRaw = startMatch[1].trim();
      // Remove ONLY the attribute block, preserve everything after including spaces
      // Replace the matched block with empty string, keeping any trailing space
      remainingAfterRemoval = text.substring(startMatch[0].length);
    }
  }

  if (!attributeBlockRaw) {
    return { classes: [], remainingText: text };
  }

  const attributeBlock = attributeBlockRaw;
  if (!attributeBlock) {
    // Empty attribute block {}
    return { classes: [], remainingText: remainingAfterRemoval };
  }
  
  // Extract key-value attributes (modal="..." tooltip="...") and ID (#anchor-id)
  const kvAttrs: { id?: string; modal?: string; tooltip?: string } = {};
  let cleanedBlock = attributeBlock;
  
  // Match modal="..." or modal='...' FIRST (before extracting IDs)
  const modalMatch = attributeBlock.match(/modal=["']([^"']+)["']/);
  if (modalMatch) {
    kvAttrs.modal = modalMatch[1];
    cleanedBlock = cleanedBlock.replace(modalMatch[0], '').trim();
  }
  
  // Match tooltip="..." or tooltip='...' FIRST (before extracting IDs)
  const tooltipMatch = attributeBlock.match(/tooltip=["']([^"']+)["']/);
  if (tooltipMatch) {
    kvAttrs.tooltip = tooltipMatch[1];
    cleanedBlock = cleanedBlock.replace(tooltipMatch[0], '').trim();
  }
  
  // Match #anchor-id (ID syntax) - AFTER removing quoted values
  // This prevents #id inside tooltip="#id" from being extracted as anchor
  // ID must start with letter or underscore, can contain letters, numbers, hyphens, underscores
  const idMatch = cleanedBlock.match(/#([a-zA-Z_][\w-]*)/);
  if (idMatch) {
    kvAttrs.id = idMatch[1];
    cleanedBlock = cleanedBlock.replace(idMatch[0], '').trim();
  }

  // Phase 2: Extract both CSS classes and plain English
  // - ID anchors start with hash: #anchor-id (extracted above)
  // - CSS classes start with dot: .text-4xl
  // - Plain English doesn't: primary, large, bold
  // - Component keywords: button, badge, alert, etc.
  const rawAttributes: string[] = [];
  const tokens = cleanedBlock.split(/\s+/).filter((t) => t.length > 0);

  for (const token of tokens) {
    if (token.startsWith('#')) {
      // ID was already extracted above, skip
      continue;
    } else if (CLASS_NAME_REGEX.test(token)) {
      // CSS class with dot - remove dot and add
      rawAttributes.push(token.substring(1));
    } else if (token && !token.startsWith('.')) {
      // Plain English (no dot) - add as-is
      rawAttributes.push(token);
    }
    // Invalid tokens are silently ignored (graceful degradation)
  }

  // Phase 2: Find component name (if any) - prefer LAST occurrence for natural English
  // English grammar: adjective adjective NOUN (e.g., "large primary button")
  // NOT: NOUN adjective adjective (CSS style)
  let classes: string[];
  let componentToken: string | null = null;
  let componentIndex = -1;
  
  // Scan for component names, preferring the last one (noun position)
  for (let i = rawAttributes.length - 1; i >= 0; i--) {
    const token = rawAttributes[i];
    if (registry.get(token)) {
      componentToken = token;
      componentIndex = i;
      break; // Found the component (scanning backwards, so first match is last in array)
    }
  }
  
  if (componentToken && componentIndex >= 0) {
    // Found a component - extract modifiers (all tokens except component name)
    const modifiers = [
      ...rawAttributes.slice(0, componentIndex),
      ...rawAttributes.slice(componentIndex + 1)
    ];
    const result = resolveComponentClasses(componentToken, modifiers, {
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

  return { classes, remainingText: remainingAfterRemoval, ...kvAttrs };
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
        
        // Extract attributes including modal/tooltip attachments and ID
        const { classes, remainingText, id, modal, tooltip } = extractAttributesFromText(
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
        
        // Apply ID if present
        if (id) {
          data.hProperties.id = id;
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
        const { classes, remainingText, id, modal, tooltip } = extractAttributesFromText(
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
        
        // Apply ID if present (for anchor targets)
        if (id) {
          data.hProperties.id = id;
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
        const { classes, remainingText, id, modal, tooltip } = extractAttributesFromText(
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
        
        // Apply ID if present
        if (id) {
          data.hProperties.id = id;
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

