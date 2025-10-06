/**
 * Style Resolver - Plain English to CSS Classes
 * Phase 2: Transforms intuitive keywords into precise CSS classes
 * 
 * See SYNTAX.md §2.7 for plain English shorthand specification
 * See PLAIN-ENGLISH-REFERENCE.md for complete shorthand vocabulary
 * 
 * @example
 * Input:  ['primary', 'large', 'bold', 'center']
 * Output: ['text-primary-600', 'hover:text-primary-700', 'text-4xl', 'font-bold', 'text-center']
 */

import type { TaildownConfig } from '../config/config-schema';
import { SHORTHAND_MAPPINGS, type ShorthandMapping } from './shorthand-mappings';
import { resolveSemanticColor } from './semantic-colors';
import { resolveVariant } from './variant-resolver';

/**
 * Context passed to resolver for theme-aware resolution
 */
export interface ResolverContext {
  /** User configuration with theme, colors, etc. */
  config: TaildownConfig;
  
  /** Whether dark mode is enabled */
  darkMode: boolean;
  
  /** Component context (for component-specific variants) */
  component?: string;
}

/**
 * Resolve plain English attributes to CSS classes
 * 
 * This is the main entry point for the style resolution system.
 * It processes an array of attribute strings and returns resolved CSS classes.
 * 
 * Resolution order:
 * 1. Check shorthand mappings (SHORTHAND_MAPPINGS) - highest priority
 * 2. Check semantic colors (primary, secondary, accent with prefixes)
 * 3. Check component variants (if in component context)
 * 4. Check if already a CSS class (contains '-' and not a known shorthand)
 * 5. Pass through as-is (could be custom class)
 * 
 * @param attributes - Array of plain English attribute strings
 * @param context - Resolver context with config and dark mode state
 * @returns Array of resolved CSS class names
 * 
 * @example
 * resolveAttributes(['primary', 'large', 'bold'], context)
 * // => ['text-primary-600', 'hover:text-primary-700', 'text-4xl', 'font-bold']
 * 
 * @example
 * resolveAttributes(['glass', 'elevated'], context)
 * // => ['backdrop-blur-md', 'bg-white/80', 'border', 'border-white/20', 'shadow-xl']
 */
export function resolveAttributes(
  attributes: string[],
  context: ResolverContext
): string[] {
  const resolved: string[] = [];

  for (const attr of attributes) {
    // Skip empty attributes
    if (!attr || attr.trim() === '') {
      continue;
    }

    const trimmedAttr = attr.trim();

    // 1. Check shorthand mappings FIRST (before CSS class check)
    // This ensures compound shorthands like 'huge-bold' are resolved correctly
    const shorthand = SHORTHAND_MAPPINGS[trimmedAttr];
    if (shorthand) {
      const resolvedClasses = resolveShorthand(shorthand, context);
      resolved.push(...resolvedClasses);
      continue;
    }

    // 2. Check semantic colors (primary, secondary, accent, bg-primary, etc.)
    const colorClasses = resolveSemanticColor(trimmedAttr, context);
    if (colorClasses && colorClasses.length > 0) {
      resolved.push(...colorClasses);
      continue;
    }

    // 3. Check component-specific variants
    if (context.component) {
      const variantClasses = resolveVariant(trimmedAttr, context);
      if (variantClasses && variantClasses.length > 0) {
        resolved.push(...variantClasses);
        continue;
      }
    }

    // 4. Already a CSS class (contains '-' and not a shorthand)
    // e.g., 'text-4xl', 'bg-blue-600', 'hover:shadow-xl'
    if (isCSSClass(trimmedAttr)) {
      resolved.push(trimmedAttr);
      continue;
    }

    // 5. Unknown attribute - pass through as-is
    // This allows custom classes or future extensions
    resolved.push(trimmedAttr);
  }

  // Deduplicate classes while preserving order
  return deduplicateClasses(resolved);
}

/**
 * Check if a string is already a CSS class
 * CSS classes typically contain hyphens or colons (for pseudo-classes/responsive)
 * 
 * @param attr - Attribute string to check
 * @returns true if it's a CSS class, false if it's likely a shorthand
 */
function isCSSClass(attr: string): boolean {
  // If it starts with a dot, remove it (from old syntax)
  const cleaned = attr.startsWith('.') ? attr.slice(1) : attr;
  
  // CSS classes usually have hyphens (e.g., text-4xl, bg-blue-600)
  // But shorthands can also have hyphens (e.g., bg-primary, gap-lg)
  // So we check if it's NOT a known shorthand pattern
  
  // Known shorthand patterns (these are NOT CSS classes)
  const shorthandPatterns = [
    /^(primary|secondary|accent)$/,
    /^(bg|text|border)-(primary|secondary|accent)$/,
    /^padded(-sm|-lg|-xl)?$/,
    /^gap(-sm|-lg)?$/,
    /^rounded(-sm|-full)?$/,
    /^grid-[2-4]$/,
    /^hover-(lift|grow|glow|scale)$/,
    /^glass(-dark)?$/,
    /^(fade|slide|zoom)-in$/,
    /^slide-(up|down|left|right)$/,
    /^scale-in$/,
  ];

  // If it matches a shorthand pattern, it's NOT a CSS class
  for (const pattern of shorthandPatterns) {
    if (pattern.test(cleaned)) {
      return false;
    }
  }

  // If it contains a colon (e.g., hover:, md:), it's a CSS class
  if (cleaned.includes(':')) {
    return true;
  }

  // If it contains a hyphen and doesn't match shorthand patterns, assume CSS class
  if (cleaned.includes('-')) {
    return true;
  }

  // Otherwise, it's likely a shorthand (single word like 'bold', 'center', etc.)
  return false;
}

/**
 * Resolve a shorthand mapping to CSS classes
 * Handles string, array, and function mappings
 * 
 * @param mapping - The shorthand mapping (string | string[] | function)
 * @param context - Resolver context
 * @returns Array of resolved CSS classes
 */
function resolveShorthand(
  mapping: ShorthandMapping,
  context: ResolverContext
): string[] {
  if (typeof mapping === 'string') {
    return [mapping];
  }
  
  if (Array.isArray(mapping)) {
    return mapping;
  }
  
  if (typeof mapping === 'function') {
    return mapping(context);
  }
  
  return [];
}

/**
 * Deduplicate CSS classes while preserving order
 * Later classes take precedence (last-wins for conflicting properties)
 * 
 * @param classes - Array of CSS classes (may contain duplicates)
 * @returns Deduplicated array
 */
function deduplicateClasses(classes: string[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  // Iterate in reverse to keep last occurrence
  for (let i = classes.length - 1; i >= 0; i--) {
    const cls = classes[i];
    if (!seen.has(cls)) {
      seen.add(cls);
      result.unshift(cls); // Add to front to maintain original order
    }
  }

  return result;
}

/**
 * Normalize attribute string by removing leading dots (legacy syntax)
 * 
 * @param attr - Attribute string
 * @returns Normalized attribute string
 */
export function normalizeAttribute(attr: string): string {
  const trimmed = attr.trim();
  return trimmed.startsWith('.') ? trimmed.slice(1) : trimmed;
}

/**
 * Normalize an array of attributes
 * 
 * @param attributes - Array of attribute strings
 * @returns Normalized array
 */
export function normalizeAttributes(attributes: string[]): string[] {
  return attributes.map(normalizeAttribute).filter(attr => attr.length > 0);
}

/**
 * Check if an attribute is a plain English shorthand
 * 
 * @param attr - Attribute string to check
 * @returns true if it's a shorthand, false otherwise
 */
export function isShorthand(attr: string): boolean {
  const normalized = normalizeAttribute(attr);
  
  // Check if it's in the shorthand mappings
  if (normalized in SHORTHAND_MAPPINGS) {
    return true;
  }
  
  // Check if it's a semantic color pattern
  if (/^(bg-|text-|border-)?(primary|secondary|accent)$/.test(normalized)) {
    return true;
  }
  
  return false;
}

/**
 * Get help text for a shorthand (for debugging/documentation)
 * 
 * @param shorthand - Shorthand to get help for
 * @returns Help text describing what the shorthand resolves to
 */
export function getShorthandHelp(shorthand: string): string | null {
  const mapping = SHORTHAND_MAPPINGS[shorthand];
  
  if (!mapping) {
    return null;
  }
  
  if (typeof mapping === 'string') {
    return `"${shorthand}" resolves to: ${mapping}`;
  }
  
  if (Array.isArray(mapping)) {
    return `"${shorthand}" resolves to: ${mapping.join(', ')}`;
  }
  
  if (typeof mapping === 'function') {
    return `"${shorthand}" is context-dependent (varies by theme/dark mode)`;
  }
  
  return null;
}

/**
 * Validate that all attributes can be resolved
 * Useful for development and debugging
 * 
 * @param attributes - Array of attribute strings
 * @param context - Resolver context
 * @returns Object with valid/invalid attributes
 */
export function validateAttributes(
  attributes: string[],
  context: ResolverContext
): {
  valid: string[];
  invalid: string[];
  warnings: string[];
} {
  const valid: string[] = [];
  const invalid: string[] = [];
  const warnings: string[] = [];

  for (const attr of attributes) {
    const trimmed = attr.trim();
    
    if (trimmed === '') {
      continue;
    }

    // Try to resolve
    const resolved = resolveAttributes([trimmed], context);
    
    // If it resolved to itself and it's not a known CSS class pattern
    if (resolved.length === 1 && resolved[0] === trimmed && !isCSSClass(trimmed)) {
      // Check if it's a known shorthand
      if (isShorthand(trimmed)) {
        valid.push(trimmed);
      } else {
        invalid.push(trimmed);
        warnings.push(`Unknown attribute: "${trimmed}" - will be passed through as-is`);
      }
    } else {
      valid.push(trimmed);
    }
  }

  return { valid, invalid, warnings };
}

