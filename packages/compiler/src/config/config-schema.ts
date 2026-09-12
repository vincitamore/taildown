/**
 * Configuration Schema for Taildown
 * Phase 2: Type definitions and structure for taildown.config.js
 * 
 * This file defines the complete configuration structure for Taildown,
 * including theme, components, output settings, and validation rules.
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §3 for configuration system design
 */

import type {ColorScale, ColorConfig, ColorOverrides, FontConfig, ComponentsConfig} from '@taildown/shared';
export type {ColorScale, ColorConfig, ColorOverrides, FontConfig, ComponentVariant, ComponentConfig, ComponentsConfig} from '@taildown/shared';

/**
 * Glassmorphism configuration
 */
export interface GlassConfig {
  /** Blur intensity: sm | md | lg | xl */
  blur: 'sm' | 'md' | 'lg' | 'xl';
  
  /** Background opacity (0-100) */
  opacity: number;
  
  /** Border opacity (0-100) */
  borderOpacity: number;
}

/**
 * Animation configuration
 */
export interface AnimationConfig {
  /** Animation speed: fast | normal | slow */
  speed: 'fast' | 'normal' | 'slow';
  
  /** Easing function */
  easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

/**
 * Dark mode configuration
 */
export interface DarkModeConfig {
  /** Enable dark mode support */
  enabled: boolean;
  
  /** Dark mode toggle method: class | media | manual */
  toggle: 'class' | 'media' | 'manual';
  
  /** Transition speed in milliseconds */
  transitionSpeed: number;
}

/**
 * Theme configuration
 * Contains all visual styling options
 */
export interface ThemeConfig {
  /** Color palette */
  colors: ColorConfig;
  
  /** Font stacks */
  fonts: FontConfig;
  
  /** Glassmorphism settings */
  glass: GlassConfig;
  
  /** Animation settings */
  animations: AnimationConfig;
  
  /** Dark mode configuration */
  darkMode: DarkModeConfig;
}

/**
 * Output configuration
 * Controls how Taildown generates output files
 */
export interface OutputConfig {
  /** Minify HTML and CSS output */
  minify?: boolean;
  
  /** Inline CSS in HTML output */
  inlineStyles?: boolean;
  
  /** Include dark mode toggle and styles */
  darkMode?: boolean;
  
  /** Include source maps */
  sourceMaps?: boolean;
}

/**
 * Plugin configuration
 * For future plugin system (Phase 3)
 */
export interface PluginConfig {
  /** Plugin name or path */
  name: string;
  
  /** Plugin options */
  options?: Record<string, any>;
}

/**
 * Complete Taildown configuration
 * This is the root configuration object
 */
export interface TaildownConfig {
  /** Theme configuration (colors, fonts, effects) */
  theme: ThemeConfig;
  
  /** Component configurations */
  components?: ComponentsConfig;
  
  /** Output settings */
  output?: OutputConfig;
  
  /** Plugins (Phase 3) */
  plugins?: PluginConfig[];
}

/**
 * Partial configuration for merging
 * Allows users to specify only what they want to override
 */
export type PartialTaildownConfig = {
  theme?: {
    colors?: ColorOverrides;
    fonts?: Partial<FontConfig>;
    glass?: Partial<GlassConfig>;
    animations?: Partial<AnimationConfig>;
    darkMode?: Partial<DarkModeConfig>;
  };
  components?: ComponentsConfig;
  output?: Partial<OutputConfig>;
  plugins?: PluginConfig[];
};

/**
 * Type guard to check if value is a ColorScale
 */
export function isColorScale(value: any): value is ColorScale {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.DEFAULT !== undefined ||
      value[50] !== undefined ||
      value[100] !== undefined ||
      value[500] !== undefined ||
      value[600] !== undefined)
  );
}

/**
 * Type guard to check if value is a color string
 */
export function isColorString(value: any): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}

/**
 * Validate color configuration
 * Ensures colors are properly formatted
 */
export function validateColorConfig(colors: ColorConfig): string[] {
  const errors: string[] = [];

  // Validate required colors
  if (!colors.primary) {
    errors.push('Missing required color: primary');
  }
  if (!colors.secondary) {
    errors.push('Missing required color: secondary');
  }
  if (!colors.accent) {
    errors.push('Missing required color: accent');
  }

  // Validate color values
  for (const [name, value] of Object.entries(colors)) {
    if (isColorScale(value)) {
      // Validate hex colors in scale
      for (const [shade, hex] of Object.entries(value)) {
        if (hex && !isColorString(hex)) {
          errors.push(`Invalid color value for ${name}.${shade}: ${hex}`);
        }
      }
    } else if (typeof value === 'string' && !isColorString(value)) {
      errors.push(`Invalid color value for ${name}: ${value}`);
    }
  }

  return errors;
}

/**
 * Validate theme configuration
 */
export function validateThemeConfig(theme: ThemeConfig): string[] {
  const errors: string[] = [];

  // Validate colors
  errors.push(...validateColorConfig(theme.colors));

  // Font stacks are CSS values, not declarations or markup.
  for (const [name, value] of Object.entries(theme.fonts)) {
    if (typeof value !== 'string' || !value.trim() || /[;{}<>\r\n\u0000]/.test(value)) {
      errors.push(`Invalid font stack for ${name}: use a non-empty font-family value without declarations or markup`);
    }
  }

  // Validate glass config
  if (theme.glass.opacity < 0 || theme.glass.opacity > 100) {
    errors.push('Glass opacity must be between 0 and 100');
  }
  if (theme.glass.borderOpacity < 0 || theme.glass.borderOpacity > 100) {
    errors.push('Glass borderOpacity must be between 0 and 100');
  }

  // Validate dark mode config
  if (theme.darkMode.transitionSpeed < 0) {
    errors.push('Dark mode transitionSpeed must be positive');
  }

  return errors;
}

/**
 * Validate complete configuration
 */
export function validateConfig(config: TaildownConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate theme
  if (!config.theme) {
    errors.push('Missing required field: theme');
  } else {
    errors.push(...validateThemeConfig(config.theme));
  }

  for (const key of ['minify', 'inlineStyles', 'darkMode', 'sourceMaps'] as const) {
    const value = config.output?.[key];
    if (value !== undefined && typeof value !== 'boolean') errors.push(`output.${key} must be a boolean`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Configuration validation result
 */
export interface ConfigValidation {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate and return detailed validation result
 */
export function validateConfigDetailed(config: TaildownConfig): ConfigValidation {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Validate theme
  if (!config.theme) {
    errors.push('Missing required field: theme');
    return { valid: false, errors, warnings };
  }

  errors.push(...validateThemeConfig(config.theme));

  // Warnings for recommended but optional fields
  if (!config.theme.fonts.sans) {
    warnings.push('No custom sans-serif font specified, using default');
  }

  if (!config.theme.colors.gray) {
    warnings.push('No gray scale defined, using default gray palette');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

