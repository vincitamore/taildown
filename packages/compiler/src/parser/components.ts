/**
 * Component Block Parser for Taildown
 * See SYNTAX.md §3 for component block specification
 */

import { visit } from 'unist-util-visit';
import type { Root, Content } from 'mdast';
import type { Plugin } from 'unified';
import type { CompilationWarning, TaildownNodeData } from '@taildown/shared';
import { COMPONENT_NAME_REGEX } from '@taildown/shared';
import { registry } from '../components/component-registry';
import type {ComponentDefinition} from '../components/component-registry';
import { progressValues } from '../components/progress-values';
import { resolveComponentClasses } from '../components/variant-system';

// remark-directive creates these node types
interface ContainerDirective {
  type: 'containerDirective';
  name: string;
  attributes?: Record<string, string | null | undefined> | null;
  children: Content[];
  data?: TaildownNodeData;
  position?: import('unist').Position;
}

interface TextDirective {
  type: 'textDirective';
  name: string;
  attributes?: Record<string, string | null | undefined> | null;
  children: Content[];
  data?: TaildownNodeData;
  position?: import('unist').Position;
}

function hasLabelContent(nodes: readonly Content[]): boolean {
  return nodes.some(node =>
    ('value' in node && node.type !== 'html' && node.value.trim().length > 0) ||
    ('alt' in node && Boolean(node.alt?.trim())) ||
    ('children' in node && hasLabelContent(node.children))
  );
}

interface ComponentPluginOptions {
  warnings: CompilationWarning[];
  styleMappings?: Record<string, string>;
  components?: ReadonlyMap<string, ComponentDefinition>;
}

/**
 * Helper function to process a directive node (container or text)
 */
function processDirectiveNode(
  node: ContainerDirective | TextDirective,
  warnings: CompilationWarning[],
  styleMappings?: Record<string, string>,
  components?: ReadonlyMap<string, ComponentDefinition>
): void {
      const componentName = node.name;

      // Validate component name - See SYNTAX.md §3.2.2
      if (!COMPONENT_NAME_REGEX.test(componentName)) {
        warnings.push({
          type: 'validation',
          message: `Invalid component name: ${componentName}. Must match [a-z][a-z0-9-]*`,
        });
        return;
      }

      // Get component definition from registry
      const component = components?.get(componentName) ?? registry.get(componentName);
      if (!component) {
        warnings.push({
          type: 'validation',
          message: `Unknown component: ${componentName}`,
          line: node.position?.start.line,
          column: node.position?.start.column,
        });
      }

      // Initialize data
      node.data = node.data || {};
      const data = node.data;

      // Set HTML element name (default to div)
      data.hName = component?.htmlElement || 'div';

      // Initialize hProperties
      data.hProperties = data.hProperties || {};

      // Collect raw attributes from directive parser (variant names, size names, plain English)
      // Attributes come from the directive parser as node.attributes (e.g., {horizontal sm} becomes {horizontal: '', sm: ''})
      const rawAttributes: string[] = [];
      if (node.attributes && node.type === 'textDirective') {
        // Inline directive flags can be represented as empty attributes. Block
        // scanning already separates style tokens into hProperties.className;
        // its explicit key-value attributes must never become style tokens.
        rawAttributes.push(...Object.entries(node.attributes)
          .filter(([, value]) => value == null || value === '')
          .map(([key]) => key));
      }
      // Also include any existing classes from data.hProperties
      const existingClasses = data.hProperties.className || [];
      if (Array.isArray(existingClasses)) {
        rawAttributes.push(...existingClasses);
      } else if (existingClasses) {
        rawAttributes.push(existingClasses);
      }

      // Add component class prefix
      const classNames = ['taildown-component', `component-${componentName}`];

      // If component is registered, use the variant system to resolve classes
      if (component) {
        // Use variant system to resolve all component classes (defaults + variants + sizes)
        const result = resolveComponentClasses(
          componentName,
          rawAttributes,
          { includeDefaults: true, warnOnUnknown: false, styleMappings, componentDefinition: component }
        );
        classNames.push(...result.classes);
      } else {
        // Fallback: just add raw attributes as classes for custom components
        classNames.push(...rawAttributes);
      }

      if (componentName === 'progress') {
        const messages = progressValues(node.attributes ?? {}, [...rawAttributes, ...classNames]).warnings;
        if (!hasLabelContent(node.children) && !node.attributes?.['aria-label']?.trim() && !node.attributes?.['aria-labelledby']?.trim()) {
          messages.push('Progress needs visible label content, aria-label, or aria-labelledby.');
        }
        for (const message of messages) warnings.push({type: 'validation', message, line: node.position?.start.line, column: node.position?.start.column});
      }

      // Store component metadata
      data.component = {
        name: componentName,
        attributes: rawAttributes, // Store the raw attributes that were applied
      };

      // Set className with resolved classes
      data.hProperties.className = classNames;
      data.hProperties['data-component'] = componentName;
}

/**
 * unified plugin to process component blocks and inline components
 * See SYNTAX.md §3.1-3.3 for component block specification
 */
export const processComponents: Plugin<[ComponentPluginOptions?], Root> = (options) => {
  const warnings = options?.warnings ?? [];

  return (tree) => {
    // Process block-level components (:::card)
    visit(tree, 'containerDirective', (node: ContainerDirective) => {
      processDirectiveNode(node, warnings, options?.styleMappings, options?.components);
    });

    // Process inline components (:badge:, :alert:)
    visit(tree, 'textDirective', (node: TextDirective) => {
      processDirectiveNode(node, warnings, options?.styleMappings, options?.components);
    });
  };
};

