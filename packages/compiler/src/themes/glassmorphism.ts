/**
 * Glassmorphism Theme System for Taildown
 * Provides modern glass-morphic effects with backdrop blur, transparency,
 * and subtle styling for a premium aesthetic
 * 
 * Design Philosophy:
 * - Subtle, fast, professional animations
 * - Cross-browser compatible with graceful degradation
 * - Optimized for performance (GPU-accelerated)
 * - Light and dark mode variants
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §4 for glassmorphism design spec
 */

/**
 * Glass effect intensity levels
 */
export enum GlassIntensity {
  SUBTLE = 'subtle',    // Very light blur, minimal opacity change
  LIGHT = 'light',      // Light blur, slight transparency
  MEDIUM = 'medium',    // Moderate blur and transparency (default)
  HEAVY = 'heavy',      // Strong blur, high transparency
  EXTREME = 'extreme',  // Maximum blur and transparency
}

/**
 * Glass effect configuration
 */
export interface GlassEffectConfig {
  /** Backdrop blur amount (e.g., '8px', '16px') */
  blur: string;
  /** Background opacity (0-1) */
  opacity: number;
  /** Border opacity (0-1) */
  borderOpacity: number;
  /** Shadow strength */
  shadowStrength: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Saturation boost (100-150 typical) */
  saturation?: number;
}

/**
 * Glass effect presets for different intensities
 */
export const GLASS_PRESETS: Record<GlassIntensity, GlassEffectConfig> = {
  [GlassIntensity.SUBTLE]: {
    blur: '4px',
    opacity: 0.95,
    borderOpacity: 0.1,
    shadowStrength: 'sm',
    saturation: 100,
  },
  [GlassIntensity.LIGHT]: {
    blur: '8px',
    opacity: 0.85,
    borderOpacity: 0.15,
    shadowStrength: 'md',
    saturation: 105,
  },
  [GlassIntensity.MEDIUM]: {
    blur: '12px',
    opacity: 0.75,
    borderOpacity: 0.2,
    shadowStrength: 'md',
    saturation: 110,
  },
  [GlassIntensity.HEAVY]: {
    blur: '16px',
    opacity: 0.65,
    borderOpacity: 0.25,
    shadowStrength: 'lg',
    saturation: 120,
  },
  [GlassIntensity.EXTREME]: {
    blur: '24px',
    opacity: 0.5,
    borderOpacity: 0.3,
    shadowStrength: 'xl',
    saturation: 130,
  },
};

/**
 * Generate CSS classes for a specific glass effect
 * 
 * @param intensity - Glass effect intensity
 * @param darkMode - Whether to use dark mode variant
 * @returns Array of CSS class names
 */
export function getGlassClasses(
  intensity: GlassIntensity = GlassIntensity.MEDIUM,
  darkMode: boolean = false
): string[] {
  const preset = GLASS_PRESETS[intensity];
  const classes: string[] = [];

  // Core glass effect classes
  classes.push('glass-effect'); // Base class for all glass elements
  classes.push(`glass-${intensity}`); // Specific intensity variant

  // Backdrop blur
  const blurClass = `backdrop-blur-${preset.blur.replace('px', '')}`;
  classes.push(blurClass);

  // Background with transparency
  if (darkMode) {
    // Dark mode: white overlay with opacity
    classes.push('bg-white/10', 'dark:bg-white/5');
  } else {
    // Light mode: white overlay with opacity
    classes.push('bg-white/70', 'dark:bg-black/40');
  }

  // Border styling
  classes.push('border', 'border-white/20', 'dark:border-white/10');

  // Shadow
  if (preset.shadowStrength !== 'none') {
    classes.push(`shadow-${preset.shadowStrength}`);
  }

  // Optional: Saturation boost
  if (preset.saturation && preset.saturation > 100) {
    classes.push('saturate-110');
  }

  return classes;
}

/**
 * Generate custom CSS rules for glassmorphism effects
 * These are added to the generated CSS file
 * 
 * @returns CSS string with glass effect utilities
 */
export function generateGlassmorphismCSS(): string {
  return `
/* Glassmorphism Effects */
.glass-effect {
  background-clip: padding-box;
  -webkit-backdrop-filter: blur(var(--glass-blur, 12px)) saturate(var(--glass-saturation, 110%));
  backdrop-filter: blur(var(--glass-blur, 12px)) saturate(var(--glass-saturation, 110%));
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Glass intensity variants - each includes full effect */
.glass-subtle {
  background: rgba(248, 250, 252, 0.9);
  background-clip: padding-box;
  -webkit-backdrop-filter: blur(4px) saturate(100%);
  backdrop-filter: blur(4px) saturate(100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-light {
  background: rgba(241, 245, 249, 0.75);
  background-clip: padding-box;
  -webkit-backdrop-filter: blur(8px) saturate(105%);
  backdrop-filter: blur(8px) saturate(105%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-medium {
  background: rgba(226, 232, 240, 0.6);
  background-clip: padding-box;
  -webkit-backdrop-filter: blur(12px) saturate(110%);
  backdrop-filter: blur(12px) saturate(110%);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-heavy {
  background: rgba(203, 213, 225, 0.4);
  background-clip: padding-box;
  -webkit-backdrop-filter: blur(16px) saturate(120%);
  backdrop-filter: blur(16px) saturate(120%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-extreme {
  --glass-blur: 24px;
  --glass-saturation: 130%;
}

/* Glass hover effects - subtle interactive feedback */
.glass-effect:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 16px -4px rgba(0, 0, 0, 0.1);
}

.glass-effect:active {
  transform: translateY(0);
}

/* Browser fallbacks for older browsers */
@supports not (backdrop-filter: blur(1px)) {
  .glass-effect {
    background: rgba(255, 255, 255, 0.85);
  }
  
  .dark .glass-effect {
    background: rgba(0, 0, 0, 0.7);
  }
}

/* Backdrop blur utilities (non-standard values) */
.backdrop-blur-4 {
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}

.backdrop-blur-8 {
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.backdrop-blur-12 {
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
}

.backdrop-blur-16 {
  -webkit-backdrop-filter: blur(16px);
  backdrop-filter: blur(16px);
}

.backdrop-blur-24 {
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
}

/* Saturation utilities */
.saturate-105 {
  filter: saturate(105%);
}

.saturate-110 {
  filter: saturate(110%);
}

.saturate-120 {
  filter: saturate(120%);
}

.saturate-130 {
  filter: saturate(130%);
}

/* Background opacity utilities */
.bg-white\\/5 {
  background-color: rgba(255, 255, 255, 0.05);
}

.bg-white\\/10 {
  background-color: rgba(255, 255, 255, 0.1);
}

.bg-white\\/20 {
  background-color: rgba(255, 255, 255, 0.2);
}

.bg-white\\/70 {
  background-color: rgba(255, 255, 255, 0.7);
}

.bg-black\\/40 {
  background-color: rgba(0, 0, 0, 0.4);
}

/* Border opacity utilities */
.border-white\\/10 {
  border-color: rgba(255, 255, 255, 0.1);
}

.border-white\\/20 {
  border-color: rgba(255, 255, 255, 0.2);
}

/* Dark mode overrides */
.dark .bg-white\\/5 {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .bg-white\\/10 {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .bg-black\\/40 {
  background-color: rgba(0, 0, 0, 0.4);
}

.dark .border-white\\/10 {
  border-color: rgba(255, 255, 255, 0.1);
}

.dark .border-white\\/20 {
  border-color: rgba(255, 255, 255, 0.1);
}
`.trim();
}

/**
 * Validate browser support for glassmorphism effects
 * 
 * @returns Object with browser support flags
 */
export function getGlassmorphismSupport(): {
  backdropFilter: boolean;
  webkitBackdropFilter: boolean;
  fullSupport: boolean;
} {
  // Note: This is compile-time, not runtime
  // For runtime detection, inject this into the generated HTML
  return {
    backdropFilter: true, // Assume modern browsers
    webkitBackdropFilter: true,
    fullSupport: true,
  };
}

/**
 * Get plain English shorthand for glass effects
 * These can be used in Taildown syntax
 * 
 * @returns Mapping of shorthand terms to CSS classes
 */
export function getGlassShorthands(): Record<string, string[]> {
  return {
    'glass': getGlassClasses(GlassIntensity.MEDIUM, false),
    'glass-subtle': getGlassClasses(GlassIntensity.SUBTLE, false),
    'glass-light': getGlassClasses(GlassIntensity.LIGHT, false),
    'glass-medium': getGlassClasses(GlassIntensity.MEDIUM, false),
    'glass-heavy': getGlassClasses(GlassIntensity.HEAVY, false),
    'glass-extreme': getGlassClasses(GlassIntensity.EXTREME, false),
    'glass-dark': getGlassClasses(GlassIntensity.MEDIUM, true),
    'glass-dark-heavy': getGlassClasses(GlassIntensity.HEAVY, true),
  };
}

