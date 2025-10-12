/**
 * Step Indicator Parser for Taildown
 * Marks headings with {step} attributes for later processing by renderer
 * 
 * This parser just marks the headings - the actual restructuring happens
 * in the renderSteps function in component-handlers.ts (after mdast-to-hast conversion)
 * 
 * Detects:
 * - Headings with {step}, {step current}, {step completed}
 * - Marks them with data attributes for renderer
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import type { Root, Heading } from 'mdast';

/**
 * Extract state from heading attributes
 * Looks for {step}, {step current}, {step completed} patterns
 */
function extractStepState(heading: Heading): 'pending' | 'current' | 'completed' | null {
  const data = heading.data as any;
  if (!data?.hProperties?.className) return null;
  
  const classes = Array.isArray(data.hProperties.className) 
    ? data.hProperties.className 
    : [data.hProperties.className];
  
  // Check for step markers in classes
  if (classes.includes('step') || classes.includes('current') || classes.includes('completed')) {
    if (classes.includes('completed')) return 'completed';
    if (classes.includes('current')) return 'current';
    return 'pending';
  }
  
  return null;
}

/**
 * unified plugin to mark step headings
 * The actual HTML structure is built by renderSteps in component-handlers.ts
 */
export const parseStepIndicators: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'steps') return;
      
      // Mark this as a steps component that needs custom rendering
      node.data = node.data || {};
      node.data.needsCustomRenderer = 'steps';
      
      // Auto-number the steps
      let stepNumber = 0;
      for (const child of node.children) {
        if (child.type === 'heading') {
          const stepState = extractStepState(child);
          
          if (stepState !== null) {
            stepNumber++;
            // Mark heading with step data - use hProperties so it transfers to HTML attributes
            child.data = child.data || {};
            child.data.hProperties = child.data.hProperties || {};
            child.data.hProperties['data-step-number'] = stepNumber;
            child.data.hProperties['data-step-state'] = stepState;
            child.data.hProperties['data-is-step-marker'] = 'true';
          }
        }
      }
    });
  };
};

export default parseStepIndicators;

