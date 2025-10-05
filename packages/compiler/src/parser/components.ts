/**
 * Component Block Parser for Taildown
 * See SYNTAX.md §3 for component block specification
 */

import { visit } from 'unist-util-visit';
import type { Root } from 'mdast';
import type { Plugin } from 'unified';
import type { CompilationWarning, TaildownNodeData } from '@taildown/shared';
import { COMPONENT_NAME_REGEX } from '@taildown/shared';
import { registry } from '../components/component-registry';
import { resolveComponentClasses } from '../components/variant-system';

// remark-directive creates these node types
interface ContainerDirective {
  type: 'containerDirective';
  name: string;
  attributes?: Record<string, string | null | undefined> | null;
  children: any[];
  data?: TaildownNodeData;
}

interface TextDirective {
  type: 'textDirective';
  name: string;
  attributes?: Record<string, string | null | undefined> | null;
  children: any[];
  data?: TaildownNodeData;
}

interface ComponentPluginOptions {
  warnings: CompilationWarning[];
}

/**
 * Helper function to process a directive node (container or text)
 */
function processDirectiveNode(
  node: ContainerDirective | TextDirective,
  warnings: CompilationWarning[]
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
      const component = registry.get(componentName);

      // Initialize data
      node.data = node.data || {};
      const data = node.data as TaildownNodeData;

      // Set HTML element name (default to div)
      data.hName = component?.htmlElement || 'div';

      // Initialize hProperties
      data.hProperties = data.hProperties || {};

      // Collect raw attributes from directive parser (variant names, size names, plain English)
      const existingClasses = data.hProperties.className || [];
      const rawAttributes = Array.isArray(existingClasses) ? existingClasses : [existingClasses];

      // Add component class prefix
      const classNames = ['taildown-component', `component-${componentName}`];

      // If component is registered, use the variant system to resolve classes
      if (component) {
        // Use variant system to resolve all component classes (defaults + variants + sizes)
        const result = resolveComponentClasses(
          componentName,
          rawAttributes,
          { includeDefaults: true, warnOnUnknown: false }
        );
        classNames.push(...result.classes);
      } else {
        // Fallback: just add raw attributes as classes for custom components
        classNames.push(...rawAttributes);
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
      processDirectiveNode(node, warnings);
    });

    // Process inline components (:badge:, :alert:)
    visit(tree, 'textDirective', (node: TextDirective) => {
      processDirectiveNode(node, warnings);
    });
  };
};

