/**
 * Configuration Loader for Taildown
 * Loads and validates taildown.config.js from the file system
 * 
 * See tech-spec.md for current architecture and docs-site/ for authoring references.
 */

import { stat } from 'fs/promises';
import { resolve } from 'path';
import { pathToFileURL } from 'url';
import type { TaildownConfig, PartialTaildownConfig } from './config-schema';
import { validateConfig } from './config-schema';
import { getDefaultConfig } from './default-config';
import { mergeConfig } from './theme-merger';

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
  const cwd = resolve(options.cwd || process.cwd());
  let configPath: string | undefined;
  try {
    configPath = options.configPath
      ? resolve(cwd, options.configPath)
      : await findConfigFile(cwd) ?? undefined;
    if (!configPath) return {config: getDefaultConfig(), hasUserConfig: false, warnings: []};
    const config = createConfig(await loadConfigFile(configPath));
    return {config, configPath, hasUserConfig: true, warnings: []};
  } catch (error) {
    const message = `Failed to load config from ${configPath ?? cwd}: ${(error as Error).message}`;
    if (options.throwOnError) throw new Error(message);
    return {config: getDefaultConfig(), configPath, hasUserConfig: false, warnings: [message]};
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
      const info = await stat(filePath);
      if (!info.isFile()) throw new Error(`Configuration path is not a file: ${filePath}`);
      return filePath;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
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
export async function loadConfigFile(configPath: string): Promise<PartialTaildownConfig> {
  try {
    // file: URLs work for ESM and CommonJS, including Windows drive letters.
    const module: unknown = await import(pathToFileURL(resolve(configPath)).href);
    const config: unknown = module !== null && typeof module === 'object' && Object.hasOwn(module, 'default') ? Reflect.get(module, 'default') : module;
    assertConfigurationObject(config);
    return config;
  } catch (error) {
    throw new Error(`Failed to load config file: ${(error as Error).message}`);
  }
}

function assertConfigurationObject(value: unknown): asserts value is PartialTaildownConfig {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error('Expected a configuration object');
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
export function loadConfigSync(_cwd: string = process.cwd()): TaildownConfig {
  // For now, just return default config
  // Synchronous loading of ESM modules is complex in Node.js
  // We'll use the async version in most cases
  console.warn('[Taildown] Synchronous config loading not fully supported, using defaults');
  return getDefaultConfig();
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
  assertConfigurationObject(userConfig);
  const config = mergeConfig(getDefaultConfig(), userConfig);
  const validation = validateConfig(config);
  if (!validation.valid) throw new Error(`Config validation failed:\n${validation.errors.join('\n')}`);
  return config;
}

