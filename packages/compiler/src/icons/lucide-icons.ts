/**
 * Lucide Icons Integration
 * Provides SVG element data for Lucide icons
 * 
 * See: https://lucide.dev/
 * 
 * Lucide icons are stored as arrays of [tagName, attributes] tuples
 */

import * as lucide from 'lucide';

/**
 * Default icon configuration
 */
export const DEFAULT_ICON_CONFIG = {
  size: 24,
  strokeWidth: 2,
  fill: 'none',
  stroke: 'currentColor',
};

/**
 * SVG element from Lucide: [tagName, attributes]
 */
export type LucideIconElement = [string, Record<string, any>];

/**
 * Get Lucide icon SVG element data
 * 
 * @param iconName - Name of the icon (e.g., 'home', 'search', 'menu')
 * @returns Array of SVG elements as [tagName, attributes] tuples, or null if not found
 */
export function getLucideIconElements(iconName: string): LucideIconElement[] | null {
  // Convert kebab-case to PascalCase for Lucide icon names
  // e.g., 'arrow-right' -> 'ArrowRight'
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  // Get the icon from Lucide
  const iconData = (lucide as any)[pascalCase];

  if (!iconData) {
    console.warn(`[Taildown] Icon not found: ${iconName} (looked for: ${pascalCase})`);
    return null;
  }

  // Lucide icons are arrays of [tagName, attributes] tuples
  if (Array.isArray(iconData)) {
    return iconData as LucideIconElement[];
  }

  console.warn(`[Taildown] Invalid icon format for: ${iconName}`);
  return null;
}

/**
 * Check if an icon exists in Lucide
 * 
 * @param iconName - Name of the icon
 * @returns True if icon exists
 */
export function hasLucideIcon(iconName: string): boolean {
  const pascalCase = iconName
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return pascalCase in lucide;
}

/**
 * Get list of all available Lucide icon names
 * 
 * @returns Array of icon names in kebab-case
 */
export function getAllLucideIconNames(): string[] {
  return Object.keys(lucide)
    .filter((key) => key !== 'createIcons' && key !== 'default')
    .map((pascalName) => {
      // Convert PascalCase to kebab-case
      return pascalName
        .replace(/([A-Z])/g, '-$1')
        .toLowerCase()
        .replace(/^-/, '');
    });
}

