/**
 * Variant System for Taildown Components
 * Handles component variants, sizes, and state-based styling
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §4 for component variant design
 */

import type { ComponentDefinition } from './component-registry';
import { registry } from './component-registry';
import { resolveAttributes } from '../resolver/style-resolver';
import { DEFAULT_CONFIG } from '../config/default-config';

/**
 * Variant application result
 * Contains resolved classes and metadata
 */
export interface VariantResult {
  /** Final CSS classes to apply */
  classes: string[];
  
  /** Applied variant name */
  variant?: string;
  
  /** Applied size name */
  size?: string;
  
  /** Any warnings during variant resolution */
  warnings: string[];
}

/**
 * Options for applying variants
 */
export interface VariantOptions {
  /** Custom classes from user attributes */
  customClasses?: string[];
  
  /** Whether to include default classes */
  includeDefaults?: boolean;
  
  /** Whether to warn on unknown variants */
  warnOnUnknown?: boolean;
}

/**
 * Apply variant to a component
 * Resolves variant name to CSS classes and merges with defaults
 * 
 * @param componentName - Name of the component
 * @param variant - Variant name (e.g., "primary", "outlined")
 * @param options - Application options
 * @returns Variant result with resolved classes
 */
export function applyVariant(
  componentName: string,
  variant?: string,
  options: VariantOptions = {}
): VariantResult {
  const warnings: string[] = [];
  const component = registry.get(componentName);
  
  if (!component) {
    warnings.push(`Unknown component: ${componentName}`);
    return {
      classes: options.customClasses || [],
      warnings,
    };
  }
  
  const classes: string[] = [];
  
  // Add default classes if requested
  if (options.includeDefaults !== false) {
    classes.push(...component.defaultClasses);
  }
  
  // Apply variant
  let appliedVariant: string | undefined;
  if (variant) {
    if (component.variants[variant]) {
      classes.push(...component.variants[variant]);
      appliedVariant = variant;
    } else if (options.warnOnUnknown !== false) {
      warnings.push(
        `Unknown variant "${variant}" for component "${componentName}". ` +
        `Available: ${Object.keys(component.variants).join(', ')}`
      );
    }
  } else if (component.defaultVariant) {
    // Apply default variant if no variant specified
    if (component.variants[component.defaultVariant]) {
      classes.push(...component.variants[component.defaultVariant]);
      appliedVariant = component.defaultVariant;
    }
  }
  
  // Add custom classes last (so they can override)
  if (options.customClasses) {
    classes.push(...options.customClasses);
  }
  
  return {
    classes,
    variant: appliedVariant,
    warnings,
  };
}

/**
 * Apply size to a component
 * Resolves size name to CSS classes
 * 
 * @param componentName - Name of the component
 * @param size - Size name (e.g., "sm", "lg")
 * @param options - Application options
 * @returns Variant result with resolved classes
 */
export function applySize(
  componentName: string,
  size?: string,
  options: VariantOptions = {}
): VariantResult {
  const warnings: string[] = [];
  const component = registry.get(componentName);
  
  if (!component) {
    warnings.push(`Unknown component: ${componentName}`);
    return {
      classes: options.customClasses || [],
      warnings,
    };
  }
  
  const classes: string[] = [];
  
  // Add default classes if requested
  if (options.includeDefaults !== false) {
    classes.push(...component.defaultClasses);
  }
  
  // Apply size
  let appliedSize: string | undefined;
  if (size) {
    if (component.sizes[size]) {
      classes.push(...component.sizes[size]);
      appliedSize = size;
    } else if (options.warnOnUnknown !== false) {
      warnings.push(
        `Unknown size "${size}" for component "${componentName}". ` +
        `Available: ${Object.keys(component.sizes).join(', ')}`
      );
    }
  }
  
  // Add custom classes last
  if (options.customClasses) {
    classes.push(...options.customClasses);
  }
  
  return {
    classes,
    size: appliedSize,
    warnings,
  };
}

/**
 * Apply both variant and size to a component
 * 
 * @param componentName - Name of the component
 * @param variant - Variant name
 * @param size - Size name
 * @param options - Application options
 * @returns Variant result with resolved classes
 */
export function applyVariantAndSize(
  componentName: string,
  variant?: string,
  size?: string,
  options: VariantOptions = {}
): VariantResult {
  const warnings: string[] = [];
  const component = registry.get(componentName);
  
  if (!component) {
    warnings.push(`Unknown component: ${componentName}`);
    return {
      classes: options.customClasses || [],
      warnings,
    };
  }
  
  const classes: string[] = [];
  
  // Add default classes
  if (options.includeDefaults !== false) {
    classes.push(...component.defaultClasses);
  }
  
  // Apply variant
  let appliedVariant: string | undefined;
  if (variant) {
    if (component.variants[variant]) {
      classes.push(...component.variants[variant]);
      appliedVariant = variant;
    } else if (options.warnOnUnknown !== false) {
      warnings.push(
        `Unknown variant "${variant}" for component "${componentName}"`
      );
    }
  } else if (component.defaultVariant && component.variants[component.defaultVariant]) {
    classes.push(...component.variants[component.defaultVariant]);
    appliedVariant = component.defaultVariant;
  }
  
  // Apply size
  let appliedSize: string | undefined;
  if (size) {
    if (component.sizes[size]) {
      classes.push(...component.sizes[size]);
      appliedSize = size;
    } else if (options.warnOnUnknown !== false) {
      warnings.push(`Unknown size "${size}" for component "${componentName}"`);
    }
  }
  
  // Add custom classes last
  if (options.customClasses) {
    classes.push(...options.customClasses);
  }
  
  return {
    classes,
    variant: appliedVariant,
    size: appliedSize,
    warnings,
  };
}

/**
 * Parse variant and size from attribute strings
 * Supports syntax like: {primary}, {large}, {primary large}
 * 
 * @param attributes - Array of attribute tokens
 * @param component - Component definition
 * @returns Parsed variant and size
 */
export function parseVariantAttributes(
  attributes: string[],
  component: ComponentDefinition
): {
  variant?: string;
  size?: string;
  remainingAttributes: string[];
} {
  let variant: string | undefined;
  let size: string | undefined;
  const remainingAttributes: string[] = [];
  
  for (const attr of attributes) {
    // Check if it's a known variant
    if (component.variants[attr]) {
      variant = attr;
      continue;
    }
    
    // Check if it's a known size
    if (component.sizes[attr]) {
      size = attr;
      continue;
    }
    
    // Not a variant or size, keep it
    remainingAttributes.push(attr);
  }
  
  return { variant, size, remainingAttributes };
}

/**
 * Deduplicate CSS classes
 * Removes duplicate classes while preserving order
 * Later classes override earlier ones
 * 
 * @param classes - Array of CSS classes
 * @returns Deduplicated array
 */
export function deduplicateClasses(classes: string[]): string[] {
  // Use a map to track the last occurrence of each class
  const classMap = new Map<string, number>();
  
  classes.forEach((cls, index) => {
    classMap.set(cls, index);
  });
  
  // Build array in original order, but only including the last occurrence
  const result: string[] = [];
  const seen = new Set<string>();
  
  for (let i = classes.length - 1; i >= 0; i--) {
    const cls = classes[i];
    if (!seen.has(cls)) {
      result.unshift(cls);
      seen.add(cls);
    }
  }
  
  return result;
}

/**
 * Resolve component classes with all features
 * Main entry point for component class resolution
 * 
 * @param componentName - Component name
 * @param rawAttributes - Raw attribute tokens from parser
 * @param options - Resolution options
 * @returns Fully resolved variant result
 */
export function resolveComponentClasses(
  componentName: string,
  rawAttributes: string[] = [],
  options: VariantOptions = {}
): VariantResult {
  const component = registry.get(componentName);
  
  if (!component) {
    return {
      classes: [],
      warnings: [`Unknown component: ${componentName}`],
    };
  }
  
  // Parse variant and size from attributes
  const { variant, size, remainingAttributes } = parseVariantAttributes(
    rawAttributes,
    component
  );
  
  // Resolve remaining attributes through shorthand mapper
  // This allows plain English shorthands like 'fade-in', 'bold', etc.
  const resolvedCustomClasses = resolveAttributes(remainingAttributes, {
    config: DEFAULT_CONFIG,
    darkMode: false,
  });
  
  // Apply variant and size
  const result = applyVariantAndSize(componentName, variant, size, {
    ...options,
    customClasses: resolvedCustomClasses,
  });
  
  // Deduplicate classes
  result.classes = deduplicateClasses(result.classes);
  
  return result;
}

/**
 * Helper to check if an attribute is a component variant
 * 
 * @param attribute - Attribute string
 * @param componentName - Component name
 * @returns True if attribute is a known variant
 */
export function isVariant(attribute: string, componentName: string): boolean {
  const component = registry.get(componentName);
  return component ? attribute in component.variants : false;
}

/**
 * Helper to check if an attribute is a component size
 * 
 * @param attribute - Attribute string
 * @param componentName - Component name
 * @returns True if attribute is a known size
 */
export function isSize(attribute: string, componentName: string): boolean {
  const component = registry.get(componentName);
  return component ? attribute in component.sizes : false;
}

/**
 * Get all available variants for a component
 * 
 * @param componentName - Component name
 * @returns Array of variant names
 */
export function getAvailableVariants(componentName: string): string[] {
  const component = registry.get(componentName);
  return component ? Object.keys(component.variants) : [];
}

/**
 * Get all available sizes for a component
 * 
 * @param componentName - Component name
 * @returns Array of size names
 */
export function getAvailableSizes(componentName: string): string[] {
  const component = registry.get(componentName);
  return component ? Object.keys(component.sizes) : [];
}

