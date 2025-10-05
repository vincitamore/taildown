/**
 * Directive Builder - Phase 2 of Custom Directive Parser
 * Builds component tree from flat list of markers and content
 * See CUSTOM-DIRECTIVE-PARSER-PLAN.md for algorithm details
 */

import type { Content } from 'mdast';
import type { 
  ComponentMarker, 
  ComponentFrame, 
  ContainerDirectiveNode,
  ValidationError 
} from './directive-types';
import { isValidComponentName } from './directive-scanner';

/**
 * Build component tree from markers and content
 * See CUSTOM-DIRECTIVE-PARSER-PLAN.md - Phase 2: Build Component Tree
 * 
 * Algorithm:
 * 1. Use stack for tracking open components (LIFO per SYNTAX.md §3.2.4)
 * 2. Process items sequentially
 * 3. OPEN marker: push new frame to stack
 * 4. CLOSE marker: pop frame, add component to parent or root
 * 5. Content: add to current frame's children (or root if stack empty)
 * 6. At end: auto-close remaining frames with warnings
 * 
 * @param items - Markers and content in document order
 * @param options - Parser options including warning callback
 * @returns Array of content nodes with components properly nested
 */
export function buildComponentTree(
  items: Array<{ type: 'content'; node: Content } | { type: 'marker'; marker: ComponentMarker }>,
  options?: {
    onWarning?: (message: string, line?: number) => void;
  }
): Content[] {
  const stack: ComponentFrame[] = [];
  const rootChildren: Content[] = [];
  const warnings: ValidationError[] = [];

  const warn = (message: string, line?: number) => {
    if (options?.onWarning) {
      options.onWarning(message, line);
    }
  };

  for (const item of items) {
    if (item.type === 'marker') {
      const marker = item.marker;

      if (marker.type === 'open') {
        // Validate component name
        if (!marker.name || !isValidComponentName(marker.name)) {
          warn(
            `Invalid component name: "${marker.name}". Must match [a-z][a-z0-9-]*`,
            marker.lineNumber
          );
          continue;
        }

        // Create new containerDirective node
        const node: ContainerDirectiveNode = {
          type: 'containerDirective',
          name: marker.name,
          children: [],
          position: marker.position,
          attributes: marker.attributes,
        };

        // Add classes if present
        if (marker.classes && marker.classes.length > 0) {
          node.data = {
            hProperties: {
              className: marker.classes,
            },
          };
        }

        // Push new frame onto stack
        stack.push({
          node,
          name: marker.name,
          openPosition: marker.position,
          children: [],
        });
      } else if (marker.type === 'close') {
        // Pop from stack
        if (stack.length === 0) {
          warn(
            `Extra closing fence "::: " without matching opening fence`,
            marker.lineNumber
          );
          continue;
        }

        const frame = stack.pop()!;
        
        // Attach children to the component node
        frame.node.children = frame.children;

        // Add completed component to parent's children or root
        if (stack.length > 0) {
          // We're inside another component
          stack[stack.length - 1]!.children.push(frame.node);
        } else {
          // At root level
          rootChildren.push(frame.node);
        }
      }
    } else if (item.type === 'content') {
      // Add content to current component's children or root
      if (stack.length > 0) {
        stack[stack.length - 1]!.children.push(item.node);
      } else {
        rootChildren.push(item.node);
      }
    }
  }

  // Auto-close remaining open components (SYNTAX.md §3.2.5)
  while (stack.length > 0) {
    const frame = stack.pop()!;
    warn(
      `Unclosed component "${frame.name}" opened at line ${frame.openPosition.start.line}`,
      frame.openPosition.start.line
    );

    // Attach children
    frame.node.children = frame.children;

    // Add to parent or root
    if (stack.length > 0) {
      stack[stack.length - 1]!.children.push(frame.node);
    } else {
      rootChildren.push(frame.node);
    }
  }

  return rootChildren;
}

/**
 * Create a containerDirective node
 * Helper function for consistent node creation
 */
export function createContainerDirective(
  name: string,
  options?: {
    classes?: string[];
    position?: import('unist').Position;
  }
): ContainerDirectiveNode {
  const node: ContainerDirectiveNode = {
    type: 'containerDirective',
    name,
    children: [],
  };

  if (options?.position) {
    node.position = options.position;
  }

  if (options?.classes && options.classes.length > 0) {
    node.data = {
      hProperties: {
        className: options.classes,
      },
    };
  }

  return node;
}

/**
 * Validate that a component tree is well-formed
 * Used for testing and debugging
 */
export function validateComponentTree(nodes: Content[]): ValidationError[] {
  const errors: ValidationError[] = [];

  function walk(node: any, depth: number = 0) {
    if (node.type === 'containerDirective') {
      // Validate name
      if (!node.name || !isValidComponentName(node.name)) {
        errors.push({
          type: 'invalid-name',
          message: `Invalid component name: "${node.name}"`,
          position: node.position,
        });
      }

      // Validate children exist
      if (!Array.isArray(node.children)) {
        errors.push({
          type: 'malformed-attributes',
          message: `Component "${node.name}" has invalid children`,
          position: node.position,
        });
      }

      // Recursively validate children
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          walk(child, depth + 1);
        }
      }
    } else if (Array.isArray(node.children)) {
      // Regular nodes with children
      for (const child of node.children) {
        walk(child, depth);
      }
    }
  }

  for (const node of nodes) {
    walk(node);
  }

  return errors;
}

