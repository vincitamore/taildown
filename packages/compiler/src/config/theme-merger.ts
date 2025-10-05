/**
 * Theme Merger
 * Phase 2: Intelligently merge user configuration with defaults
 * 
 * Handles deep merging of nested configuration objects while preserving
 * user overrides and maintaining type safety.
 * 
 * Merging strategy:
 * - User values always take precedence
 * - Objects are deep merged recursively
 * - Arrays are replaced (not merged)
 * - Undefined values use defaults
 * - Null values clear defaults
 */

import type {
  TaildownConfig,
  PartialTaildownConfig,
  ColorConfig,
  ColorScale,
  ComponentsConfig,
  ComponentConfig,
} from './config-schema';
import { isColorScale } from './config-schema';
import { DEFAULT_CONFIG } from './default-config';

/**
 * Deep merge two objects
 * User values take precedence over defaults
 * 
 * @param target - Default values
 * @param source - User overrides
 * @returns Merged object
 */
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue === undefined) {
      // Undefined means use default - skip
      continue;
    }

    if (sourceValue === null) {
      // Null means explicitly clear - set to null
      result[key] = null as any;
      continue;
    }

    // Check if both are objects (not arrays, not null)
    if (
      isPlainObject(sourceValue) &&
      isPlainObject(targetValue)
    ) {
      // Recursively merge objects
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      // Primitive, array, or function - replace entirely
      result[key] = sourceValue;
    }
  }

  return result;
}

/**
 * Check if value is a plain object (not array, not null, not Date, etc.)
 */
function isPlainObject(value: any): value is Record<string, any> {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  // Check if it's a plain object (not Array, Date, etc.)
  const proto = Object.getPrototypeOf(value);
  return proto === null || proto === Object.prototype;
}

/**
 * Merge color configurations
 * Handles both ColorScale objects and string values
 */
function mergeColors(
  defaultColors: ColorConfig,
  userColors?: Partial<ColorConfig>
): ColorConfig {
  if (!userColors) {
    return defaultColors;
  }

  const merged = { ...defaultColors };

  for (const [name, userValue] of Object.entries(userColors)) {
    if (userValue === undefined) {
      continue;
    }

    const defaultValue = defaultColors[name];

    if (isColorScale(userValue) && isColorScale(defaultValue)) {
      // Both are color scales - merge them
      merged[name] = { ...defaultValue, ...userValue };
    } else {
      // One or both are strings, or new color - replace entirely
      merged[name] = userValue;
    }
  }

  return merged;
}

/**
 * Merge component configurations
 * Handles variants, sizes, and default classes specially
 */
function mergeComponents(
  defaultComponents: ComponentsConfig,
  userComponents?: ComponentsConfig
): ComponentsConfig {
  if (!userComponents) {
    return defaultComponents;
  }

  const merged: ComponentsConfig = { ...defaultComponents };

  for (const [componentName, userConfig] of Object.entries(userComponents)) {
    if (!userConfig) {
      continue;
    }

    const defaultConfig = defaultComponents[componentName];

    if (!defaultConfig) {
      // New component - add as-is
      merged[componentName] = userConfig;
      continue;
    }

    // Merge component configuration
    merged[componentName] = {
      defaultVariant: userConfig.defaultVariant ?? defaultConfig.defaultVariant,
      defaultClasses: userConfig.defaultClasses ?? defaultConfig.defaultClasses,
      variants: {
        ...defaultConfig.variants,
        ...userConfig.variants,
      },
      sizes: {
        ...defaultConfig.sizes,
        ...userConfig.sizes,
      },
    };
  }

  return merged;
}

/**
 * Merge user configuration with defaults
 * Main entry point for configuration merging
 * 
 * @param userConfig - User-provided configuration (partial)
 * @returns Complete merged configuration
 * 
 * @example
 * const config = mergeConfig(DEFAULT_CONFIG, {
 *   theme: {
 *     colors: {
 *       primary: { DEFAULT: '#ff0000' }
 *     }
 *   }
 * });
 */
export function mergeConfig(
  defaultConfig: TaildownConfig,
  userConfig: PartialTaildownConfig
): TaildownConfig {
  // Start with defaults
  const merged: TaildownConfig = JSON.parse(JSON.stringify(defaultConfig));

  // Merge theme if provided
  if (userConfig.theme) {
    // Merge colors specially
    if (userConfig.theme.colors) {
      merged.theme.colors = mergeColors(merged.theme.colors, userConfig.theme.colors);
    }

    // Merge fonts
    if (userConfig.theme.fonts) {
      merged.theme.fonts = {
        ...merged.theme.fonts,
        ...userConfig.theme.fonts,
      };
    }

    // Merge glass config
    if (userConfig.theme.glass) {
      merged.theme.glass = {
        ...merged.theme.glass,
        ...userConfig.theme.glass,
      };
    }

    // Merge animations config
    if (userConfig.theme.animations) {
      merged.theme.animations = {
        ...merged.theme.animations,
        ...userConfig.theme.animations,
      };
    }

    // Merge dark mode config
    if (userConfig.theme.darkMode) {
      merged.theme.darkMode = {
        ...merged.theme.darkMode,
        ...userConfig.theme.darkMode,
      };
    }
  }

  // Merge components if provided
  if (userConfig.components) {
    merged.components = mergeComponents(merged.components!, userConfig.components);
  }

  // Merge output config
  if (userConfig.output) {
    merged.output = {
      ...merged.output,
      ...userConfig.output,
    };
  }

  // Replace plugins (not merged)
  if (userConfig.plugins) {
    merged.plugins = userConfig.plugins;
  }

  return merged;
}

/**
 * Merge with default config
 * Convenience function that uses DEFAULT_CONFIG
 * 
 * @param userConfig - User-provided configuration
 * @returns Complete merged configuration
 */
export function mergeWithDefaults(userConfig: PartialTaildownConfig): TaildownConfig {
  return mergeConfig(DEFAULT_CONFIG, userConfig);
}

/**
 * Extract differences between two configs
 * Useful for debugging and showing what changed
 * 
 * @param defaultConfig - Default configuration
 * @param userConfig - User configuration
 * @returns Object containing only the differences
 */
export function extractDifferences(
  defaultConfig: TaildownConfig,
  userConfig: TaildownConfig
): Partial<TaildownConfig> {
  const differences: any = {};

  function compareObjects(path: string, defaultObj: any, userObj: any) {
    for (const key in userObj) {
      const defaultValue = defaultObj?.[key];
      const userValue = userObj[key];

      if (JSON.stringify(defaultValue) !== JSON.stringify(userValue)) {
        // Values differ
        const fullPath = path ? `${path}.${key}` : key;
        
        // Store the difference
        const keys = fullPath.split('.');
        let current = differences;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!current[keys[i]]) {
            current[keys[i]] = {};
          }
          current = current[keys[i]];
        }
        
        current[keys[keys.length - 1]] = userValue;
      }
    }
  }

  compareObjects('', defaultConfig, userConfig);
  
  return differences;
}

/**
 * Check if config has customizations
 * 
 * @param config - Configuration to check
 * @returns true if config differs from defaults
 */
export function hasCustomizations(config: TaildownConfig): boolean {
  const differences = extractDifferences(DEFAULT_CONFIG, config);
  return Object.keys(differences).length > 0;
}

/**
 * Get a summary of customizations
 * Useful for logging and debugging
 * 
 * @param config - Configuration to summarize
 * @returns Human-readable summary
 */
export function getCustomizationSummary(config: TaildownConfig): string[] {
  const summary: string[] = [];
  const diff = extractDifferences(DEFAULT_CONFIG, config);

  function traverse(obj: any, path: string = '') {
    for (const key in obj) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      if (isPlainObject(value)) {
        traverse(value, fullPath);
      } else {
        summary.push(`Custom: ${fullPath}`);
      }
    }
  }

  traverse(diff);

  return summary;
}

