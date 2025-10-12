/**
 * Timeline Parser
 * 
 * Parses timeline components with milestones
 * 
 * Syntax:
 * :::timeline
 * ## Date/Title {completed}
 * Content...
 * 
 * ## Date/Title {current}
 * Content...
 * :::
 * 
 * States: current, completed, pending (default)
 * H2 headings act as milestones automatically
 */

import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { ContainerDirectiveNode } from './directive-types';

export function parseTimeline() {
  return (tree: Root): void => {
    visit(tree, 'containerDirective', (node: ContainerDirectiveNode) => {
      if (node.name !== 'timeline') return;
      
      // Mark timeline as processed
      if (!node.data) {
        node.data = {};
      }
      node.data.isTimeline = true;
      
      // All H2 headings inside timeline become milestones
      if (!node.children) return;
      
      for (const child of node.children) {
        // H2 headings are milestones
        if (child.type === 'heading' && child.depth === 2) {
          if (!child.data) {
            child.data = {};
          }
          if (!child.data.hProperties) {
            child.data.hProperties = {};
          }
          
          // Check for state in className array (set by extractInlineAttributes)
          const classes = child.data.hProperties.className;
          const classArray = Array.isArray(classes) ? classes : (classes ? [classes] : []);
          
          // Determine state from classes
          const state = classArray.includes('completed') ? 'completed'
                      : classArray.includes('current') ? 'current'
                      : 'pending';
          
          // Store in hProperties so it transfers to HTML attributes
          child.data.hProperties['data-timeline-state'] = state;
          child.data.hProperties['data-is-milestone'] = 'true';
        }
      }
    });
  };
}

