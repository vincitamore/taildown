/**
 * Icon Renderer for Taildown
 * Converts icon nodes to SVG markup in HTML output
 * 
 * Integrates with rehype to render icons as inline SVG elements
 */

import { visit } from 'unist-util-visit';
import type { Plugin } from 'unified';
import { getLucideIconElements, hasLucideIcon } from './lucide-icons';

/**
 * Icon size mappings for plain English size classes
 */
const SIZE_MAPPINGS: Record<string, number> = {
  tiny: 12,
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 40,
  '2xl': 48,
  huge: 64,
};

/**
 * Extract icon size from classes
 * 
 * @param classes - Array of CSS class names
 * @returns Icon size in pixels
 */
function getIconSize(classes: string[]): number {
  // Check for size keywords
  for (const cls of classes) {
    if (cls in SIZE_MAPPINGS) {
      return SIZE_MAPPINGS[cls];
    }
    
    // Check for width classes (w-4, w-6, etc.)
    if (cls.startsWith('w-')) {
      const size = parseInt(cls.substring(2), 10);
      if (!isNaN(size)) {
        return size * 4; // Tailwind sizes are in 0.25rem increments
      }
    }
  }

  // Default size
  return 24;
}

/**
 * Extract stroke width from classes
 * 
 * @param classes - Array of CSS class names
 * @returns Stroke width
 */
function getStrokeWidth(classes: string[]): number {
  // Check for stroke-width keywords
  if (classes.includes('thin')) return 1;
  if (classes.includes('thick')) return 3;
  if (classes.includes('bold')) return 3;

  // Default
  return 2;
}

/**
 * unified plugin to render icon nodes as SVG
 * This runs in the rehype (HTML) stage, after toHast conversion
 * We look for SVG elements with data-icon attribute (which were icon nodes)
 * 
 * @returns unified transformer
 */
export const renderIcons: Plugin = () => {
  return (tree: any) => {
    visit(tree, 'element', (node: any) => {
      // Only process SVG elements with data-icon attribute
      if (node.tagName !== 'svg' || !node.properties?.['data-icon']) {
        return;
      }

      const iconName = node.properties['data-icon'];
      const classes = node.properties.className || [];

      // Check if icon exists
      if (!hasLucideIcon(iconName)) {
        console.warn(`[Taildown] Icon not found: ${iconName}`);
        // Replace with placeholder
        node.tagName = 'span';
        node.properties = {
          className: ['icon-missing', ...classes],
          'data-icon': iconName,
        };
        node.children = [
          {
            type: 'text',
            value: `[${iconName}]`,
          },
        ];
        return;
      }

      // Get SVG elements from Lucide
      const elements = getLucideIconElements(iconName);

      if (!elements || elements.length === 0) {
        // Fallback to placeholder
        node.tagName = 'span';
        node.properties = {
          className: ['icon-error', ...classes],
          'data-icon': iconName,
        };
        node.children = [
          {
            type: 'text',
            value: `[${iconName}]`,
          },
        ];
        return;
      }

      // Extract icon configuration from classes
      const size = getIconSize(classes);
      const strokeWidth = getStrokeWidth(classes);

      // Update SVG properties
      node.properties = {
        ...node.properties,
        width: size,
        height: size,
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: strokeWidth,
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
      };

      // Convert Lucide elements [tagName, attributes] to rehype nodes
      node.children = elements.map(([tagName, attributes]) => ({
        type: 'element',
        tagName: tagName,
        properties: attributes,
        children: [],
      }));
    });
  };
};

/**
 * Generate icon CSS utilities
 * Creates CSS classes for icon sizing and styling
 * 
 * @returns CSS string
 */
export function generateIconCSS(): string {
  return `
/* Icon Utilities */
.icon {
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}

.icon-missing,
.icon-error {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: rgb(254 202 202);
  color: rgb(153 27 27);
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: monospace;
}

/* Icon size utilities */
.icon.tiny { width: 12px; height: 12px; }
.icon.xs { width: 16px; height: 16px; }
.icon.sm { width: 20px; height: 20px; }
.icon.md { width: 24px; height: 24px; }
.icon.lg { width: 32px; height: 32px; }
.icon.xl { width: 40px; height: 40px; }
.icon.\\32xl { width: 48px; height: 48px; }
.icon.huge { width: 64px; height: 64px; }
`.trim();
}

