/**
 * Semantic Color Resolver
 * Phase 2: Resolves primary/secondary/accent with prefixes
 * 
 * Handles patterns like:
 * - primary => text-primary-600 + hover:text-primary-700
 * - bg-primary => bg-primary-600 + hover:bg-primary-700
 * - border-accent => border-accent-600
 * 
 * See PLAIN-ENGLISH-REFERENCE.md for usage examples
 */

import type { ResolverContext } from './style-resolver';

/**
 * Semantic color names supported by Taildown
 */
export const SEMANTIC_COLORS = ['primary', 'secondary', 'accent'] as const;
export type SemanticColor = (typeof SEMANTIC_COLORS)[number];

/**
 * Prefixes that can be used with semantic colors
 */
export const COLOR_PREFIXES = ['text', 'bg', 'border', 'ring', 'divide'] as const;
export type ColorPrefix = (typeof COLOR_PREFIXES)[number];

/**
 * Resolve semantic color attributes to CSS classes
 * 
 * Supports patterns:
 * - 'primary' => ['text-primary-600', 'hover:text-primary-700']
 * - 'bg-primary' => ['bg-primary-600', 'hover:bg-primary-700']
 * - 'border-accent' => ['border-accent-600']
 * 
 * @param attr - Attribute string to resolve
 * @param context - Resolver context with theme configuration
 * @returns Array of CSS classes, or null if not a semantic color
 * 
 * @example
 * resolveSemanticColor('primary', context)
 * // => ['text-primary-600', 'hover:text-primary-700']
 * 
 * @example
 * resolveSemanticColor('bg-secondary', context)
 * // => ['bg-secondary-600', 'hover:bg-secondary-700']
 */
export function resolveSemanticColor(
  attr: string,
  context: ResolverContext
): string[] | null {
  // Match patterns: primary, bg-primary, text-primary, border-primary, etc.
  const match = attr.match(/^(bg-|text-|border-|ring-|divide-)?(primary|secondary|accent)$/);
  
  if (!match) {
    return null;
  }

  const [, prefixWithDash = 'text-', color] = match;
  const prefix = prefixWithDash.replace(/-$/, '') as ColorPrefix; // Remove trailing dash

  // Get the color configuration from theme
  const theme = context.config.theme;
  const colorConfig = theme?.colors?.[color as SemanticColor];

  // If no color config, return null (let it fall through)
  if (!colorConfig) {
    return null;
  }

  // Determine which shades to use
  const baseShade = getBaseShade(prefix, colorConfig);
  const hoverShade = getHoverShade(prefix, colorConfig);

  // Build CSS classes
  const classes: string[] = [];

  // Base class
  classes.push(`${prefix}-${color}-${baseShade}`);

  // Add hover for text and bg (but not border/ring/divide)
  if (prefix === 'text' || prefix === 'bg') {
    classes.push(`hover:${prefix}-${color}-${hoverShade}`);
  }

  // Add dark mode variants if dark mode is enabled
  if (context.darkMode && theme?.darkMode?.enabled) {
    const darkShade = getDarkModeShade(prefix, colorConfig);
    classes.push(`dark:${prefix}-${color}-${darkShade}`);
  }

  return classes;
}

/**
 * Get the base shade for a color prefix
 * Default to 600 for most cases
 */
function getBaseShade(prefix: ColorPrefix, colorConfig: any): number {
  // Check if config has DEFAULT
  if (colorConfig.DEFAULT) {
    return 600; // Standard shade
  }

  // Check if config has 600
  if (colorConfig[600]) {
    return 600;
  }

  // Check if config has 500
  if (colorConfig[500]) {
    return 500;
  }

  // Fallback to 600 (will use theme default)
  return 600;
}

/**
 * Get the hover shade for a color prefix
 * Typically one shade darker (700)
 */
function getHoverShade(prefix: ColorPrefix, colorConfig: any): number {
  const baseShade = getBaseShade(prefix, colorConfig);
  
  // Hover is typically 100 darker
  const hoverShade = baseShade + 100;

  // Check if that shade exists
  if (colorConfig[hoverShade]) {
    return hoverShade;
  }

  // If not, return base shade (no hover effect)
  return baseShade;
}

/**
 * Get the dark mode shade for a color prefix
 * Typically lighter shade for dark backgrounds
 */
function getDarkModeShade(prefix: ColorPrefix, colorConfig: any): number {
  // For dark mode, use lighter shades
  if (prefix === 'text') {
    // Text should be lighter in dark mode
    return 400;
  }

  if (prefix === 'bg') {
    // Backgrounds should be slightly darker
    return 700;
  }

  // Border, ring, divide stay the same
  return getBaseShade(prefix, colorConfig);
}

/**
 * Check if an attribute is a semantic color
 * 
 * @param attr - Attribute to check
 * @returns true if it's a semantic color pattern
 */
export function isSemanticColor(attr: string): boolean {
  return /^(bg-|text-|border-|ring-|divide-)?(primary|secondary|accent)$/.test(attr);
}

/**
 * Get all variations of a semantic color for autocomplete/docs
 * 
 * @param color - Semantic color name
 * @returns Array of all possible variations
 * 
 * @example
 * getSemanticColorVariations('primary')
 * // => ['primary', 'bg-primary', 'text-primary', 'border-primary', ...]
 */
export function getSemanticColorVariations(color: SemanticColor): string[] {
  const variations = [color]; // Base (defaults to text)
  
  for (const prefix of COLOR_PREFIXES) {
    variations.push(`${prefix}-${color}`);
  }
  
  return variations;
}

/**
 * Get all semantic colors and their variations
 * Useful for documentation and autocomplete
 */
export function getAllSemanticColors(): Record<SemanticColor, string[]> {
  const result: any = {};
  
  for (const color of SEMANTIC_COLORS) {
    result[color] = getSemanticColorVariations(color);
  }
  
  return result;
}

/**
 * Resolve a background color with its text color pairing
 * Ensures good contrast
 * 
 * @param color - Semantic color
 * @param context - Resolver context
 * @returns Array with bg and text classes
 * 
 * @example
 * resolveColorPair('primary', context)
 * // => ['bg-primary-600', 'text-white', 'hover:bg-primary-700']
 */
export function resolveColorPair(
  color: SemanticColor,
  context: ResolverContext
): string[] {
  const classes: string[] = [];

  // Background color
  classes.push(`bg-${color}-600`);
  classes.push(`hover:bg-${color}-700`);

  // Text color (white for contrast on colored backgrounds)
  classes.push('text-white');

  // Dark mode adjustments
  if (context.darkMode && context.config.theme?.darkMode?.enabled) {
    classes.push(`dark:bg-${color}-700`);
    classes.push(`dark:hover:bg-${color}-800`);
  }

  return classes;
}

