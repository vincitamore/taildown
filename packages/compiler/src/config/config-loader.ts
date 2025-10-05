/**
 * Configuration Loader for Taildown
 * Loads and validates taildown.config.js from the file system
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §3 for configuration system design
 */

import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { pathToFileURL } from 'url';
import type { TaildownConfig, PartialTaildownConfig } from './config-schema';
import { validateConfig } from './config-schema';
import { DEFAULT_CONFIG } from './default-config';
import { deepMergeConfig } from './theme-merger';

/**
 * Configuration file names to search for (in order of priority)
 */
const CONFIG_FILES = [
  'taildown.config.js',
  'taildown.config.mjs',
  'taildown.config.cjs',
  '.taildownrc.js',
  '.taildownrc.mjs',
];

/**
 * Result of loading configuration
 */
export interface LoadConfigResult {
  /** The loaded configuration */
  config: TaildownConfig;
  
  /** Path to the config file that was loaded */
  configPath?: string;
  
  /** Whether a user config was found */
  hasUserConfig: boolean;
  
  /** Validation warnings */
  warnings: string[];
}

/**
 * Options for loading configuration
 */
export interface LoadConfigOptions {
  /** Directory to search for config file (default: cwd) */
  cwd?: string;
  
  /** Specific config file path to load */
  configPath?: string;
  
  /** Whether to throw on validation errors (default: false) */
  throwOnError?: boolean;
}

/**
 * Load and validate Taildown configuration
 * 
 * This function:
 * 1. Searches for taildown.config.js (or variants)
 * 2. Loads the config file if found
 * 3. Validates the configuration
 * 4. Merges with DEFAULT_CONFIG
 * 5. Returns the final configuration
 * 
 * @param options - Loading options
 * @returns Load result with merged configuration
 */
export async function loadConfig(
  options: LoadConfigOptions = {}
): Promise<LoadConfigResult> {
  const cwd = options.cwd || process.cwd();
  const warnings: string[] = [];
  
  // If specific config path provided, load it directly
  if (options.configPath) {
    try {
      const userConfig = await loadConfigFile(options.configPath);
      const validation = validateConfig(userConfig as TaildownConfig);
      
      if (!validation.valid) {
        const errorMsg = `Config validation failed:\n${validation.errors.join('\n')}`;
        if (options.throwOnError) {
          throw new Error(errorMsg);
        }
        warnings.push(...validation.errors);
      }
      
      const mergedConfig = deepMergeConfig(DEFAULT_CONFIG, userConfig);
      
      return {
        config: mergedConfig,
        configPath: resolve(options.configPath),
        hasUserConfig: true,
        warnings,
      };
    } catch (error) {
      const msg = `Failed to load config from ${options.configPath}: ${(error as Error).message}`;
      if (options.throwOnError) {
        throw new Error(msg);
      }
      warnings.push(msg);
      return {
        config: DEFAULT_CONFIG,
        hasUserConfig: false,
        warnings,
      };
    }
  }
  
  // Search for config file in standard locations
  const configPath = await findConfigFile(cwd);
  
  if (!configPath) {
    // No config file found, use defaults
    return {
      config: DEFAULT_CONFIG,
      hasUserConfig: false,
      warnings: [],
    };
  }
  
  // Load the config file
  try {
    const userConfig = await loadConfigFile(configPath);
    
    // Validate
    const validation = validateConfig(userConfig as TaildownConfig);
    
    if (!validation.valid) {
      const errorMsg = `Config validation failed:\n${validation.errors.join('\n')}`;
      if (options.throwOnError) {
        throw new Error(errorMsg);
      }
      warnings.push(...validation.errors);
    }
    
    // Merge with defaults
    const mergedConfig = deepMergeConfig(DEFAULT_CONFIG, userConfig);
    
    return {
      config: mergedConfig,
      configPath,
      hasUserConfig: true,
      warnings,
    };
  } catch (error) {
    const msg = `Failed to load config from ${configPath}: ${(error as Error).message}`;
    if (options.throwOnError) {
      throw new Error(msg);
    }
    warnings.push(msg);
    return {
      config: DEFAULT_CONFIG,
      hasUserConfig: false,
      warnings,
    };
  }
}

/**
 * Find configuration file in the given directory
 * Searches for standard config file names
 * 
 * @param cwd - Directory to search
 * @returns Path to config file, or null if not found
 */
export async function findConfigFile(cwd: string): Promise<string | null> {
  for (const filename of CONFIG_FILES) {
    const filePath = resolve(cwd, filename);
    try {
      await readFile(filePath, 'utf-8');
      return filePath;
    } catch {
      // File doesn't exist, try next
      continue;
    }
  }
  
  return null;
}

/**
 * Load configuration from a file
 * Supports both ESM and CommonJS
 * 
 * @param configPath - Absolute path to config file
 * @returns Parsed configuration object
 */
export async function loadConfigFile(
  configPath: string
): Promise<PartialTaildownConfig> {
  const absolutePath = resolve(configPath);
  
  try {
    // For ESM (.mjs) or .js files in ESM mode
    if (configPath.endsWith('.mjs') || configPath.endsWith('.js')) {
      const fileUrl = pathToFileURL(absolutePath).href;
      const module = await import(fileUrl);
      return module.default || module;
    }
    
    // For CommonJS (.cjs)
    if (configPath.endsWith('.cjs')) {
      // Use dynamic require in a way that works in ESM
      const module = await import(absolutePath);
      return module.default || module;
    }
    
    // Default: try as ESM first, fall back to CJS
    try {
      const fileUrl = pathToFileURL(absolutePath).href;
      const module = await import(fileUrl);
      return module.default || module;
    } catch {
      const module = await import(absolutePath);
      return module.default || module;
    }
  } catch (error) {
    throw new Error(
      `Failed to load config file: ${(error as Error).message}`
    );
  }
}

/**
 * Load configuration synchronously (for CLI use)
 * Note: This is less flexible than the async version
 * and may not work with all module types
 * 
 * @param cwd - Directory to search for config
 * @returns Configuration or DEFAULT_CONFIG
 */
export function loadConfigSync(cwd: string = process.cwd()): TaildownConfig {
  // For now, just return default config
  // Synchronous loading of ESM modules is complex in Node.js
  // We'll use the async version in most cases
  console.warn('[Taildown] Synchronous config loading not fully supported, using defaults');
  return DEFAULT_CONFIG;
}

/**
 * Create a configuration object programmatically
 * Useful for testing and programmatic usage
 * 
 * @param userConfig - Partial configuration to merge with defaults
 * @returns Complete configuration
 */
export function createConfig(
  userConfig: PartialTaildownConfig
): TaildownConfig {
  return deepMergeConfig(DEFAULT_CONFIG, userConfig);
}

