/**
 * Color Palette Generator for Dark Mode
 * Generates CSS variables for light and dark color schemes
 * 
 * Design Philosophy:
 * - Semantic color names (primary, success, warning, error)
 * - CSS variables for dynamic theme switching
 * - WCAG AA compliant contrast ratios
 * - Smooth transitions between themes
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md for dark mode spec
 */

import type { TaildownConfig } from '../config/config-schema';

/**
 * Color variable mapping for light mode
 */
export interface LightModeColors {
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  
  // Semantic colors
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  
  // Status colors
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  error: string;
  errorForeground: string;
  info: string;
  infoForeground: string;
  
  // Card and component backgrounds
  card: string;
  cardForeground: string;
}

/**
 * Color variable mapping for dark mode
 */
export interface DarkModeColors extends LightModeColors {}

/**
 * Generate light mode color palette from config
 */
export function getLightModeColors(config: TaildownConfig): LightModeColors {
  return {
    background: '#ffffff',
    foreground: config.theme?.colors?.gray?.[900] || '#111827',
    muted: config.theme?.colors?.gray?.[100] || '#f3f4f6',
    mutedForeground: config.theme?.colors?.gray?.[600] || '#4b5563',
    border: config.theme?.colors?.gray?.[200] || '#e5e7eb',
    input: config.theme?.colors?.gray?.[200] || '#e5e7eb',
    ring: config.theme?.colors?.primary?.DEFAULT || '#3b82f6',
    
    primary: config.theme?.colors?.primary?.DEFAULT || '#3b82f6',
    primaryForeground: '#ffffff',
    secondary: config.theme?.colors?.secondary?.DEFAULT || '#8b5cf6',
    secondaryForeground: '#ffffff',
    accent: config.theme?.colors?.accent?.DEFAULT || '#ec4899',
    accentForeground: '#ffffff',
    
    success: config.theme?.colors?.success || '#10b981',
    successForeground: '#ffffff',
    warning: config.theme?.colors?.warning || '#f59e0b',
    warningForeground: '#ffffff',
    error: config.theme?.colors?.error || '#ef4444',
    errorForeground: '#ffffff',
    info: config.theme?.colors?.info || '#3b82f6',
    infoForeground: '#ffffff',
    
    card: '#ffffff',
    cardForeground: config.theme?.colors?.gray?.[900] || '#111827',
  };
}

/**
 * Generate dark mode color palette from config
 * Uses Twitter/X "Dim" mode inspired colors - dark blue-gray instead of pure black
 */
export function getDarkModeColors(config: TaildownConfig): DarkModeColors {
  return {
    background: '#15202b',  // Twitter dim mode background
    foreground: '#f5f5f5',  // Soft white, easier on eyes than pure white
    muted: '#1c2938',       // Slightly lighter blue-gray for subtle backgrounds
    mutedForeground: '#b8c5d0',  // Muted text - lighter for better readability
    border: '#2f3c4c',      // Visible but subtle borders
    input: '#1c2938',       // Input backgrounds
    ring: '#60a5fa',        // Focus ring (keep bright for visibility)
    
    primary: config.theme?.colors?.primary?.[500] || '#3b82f6',
    primaryForeground: '#f5f5f5',
    secondary: config.theme?.colors?.secondary?.[600] || '#9333ea',
    secondaryForeground: '#f5f5f5',
    accent: config.theme?.colors?.accent?.[500] || '#ec4899',
    accentForeground: '#f5f5f5',
    
    success: config.theme?.colors?.success || '#10b981',
    successForeground: '#15202b',  // Dark text on bright success
    warning: config.theme?.colors?.warning || '#f59e0b',
    warningForeground: '#15202b',  // Dark text on bright warning
    error: config.theme?.colors?.error || '#ef4444',
    errorForeground: '#ffffff',
    info: config.theme?.colors?.info || '#3b82f6',
    infoForeground: '#ffffff',
    
    card: '#192734',        // Slightly lighter than background for depth
    cardForeground: '#f5f5f5',
  };
}

/**
 * Generate CSS variables for light and dark modes
 */
export function generateColorPaletteCSS(config: TaildownConfig): string {
  const light = getLightModeColors(config);
  const dark = getDarkModeColors(config);
  
  return `
/* Color Palette - Light Mode */
:root {
  --background: ${light.background};
  --foreground: ${light.foreground};
  --muted: ${light.muted};
  --muted-foreground: ${light.mutedForeground};
  --border: ${light.border};
  --input: ${light.input};
  --ring: ${light.ring};
  
  --primary: ${light.primary};
  --primary-foreground: ${light.primaryForeground};
  --secondary: ${light.secondary};
  --secondary-foreground: ${light.secondaryForeground};
  --accent: ${light.accent};
  --accent-foreground: ${light.accentForeground};
  
  --success: ${light.success};
  --success-foreground: ${light.successForeground};
  --warning: ${light.warning};
  --warning-foreground: ${light.warningForeground};
  --error: ${light.error};
  --error-foreground: ${light.errorForeground};
  --info: ${light.info};
  --info-foreground: ${light.infoForeground};
  
  --card: ${light.card};
  --card-foreground: ${light.cardForeground};
}

/* Color Palette - Dark Mode */
.dark {
  --background: ${dark.background};
  --foreground: ${dark.foreground};
  --muted: ${dark.muted};
  --muted-foreground: ${dark.mutedForeground};
  --border: ${dark.border};
  --input: ${dark.input};
  --ring: ${dark.ring};
  
  --primary: ${dark.primary};
  --primary-foreground: ${dark.primaryForeground};
  --secondary: ${dark.secondary};
  --secondary-foreground: ${dark.secondaryForeground};
  --accent: ${dark.accent};
  --accent-foreground: ${dark.accentForeground};
  
  --success: ${dark.success};
  --success-foreground: ${dark.successForeground};
  --warning: ${dark.warning};
  --warning-foreground: ${dark.warningForeground};
  --error: ${dark.error};
  --error-foreground: ${dark.errorForeground};
  --info: ${dark.info};
  --info-foreground: ${dark.infoForeground};
  
  --card: ${dark.card};
  --card-foreground: ${dark.cardForeground};
}

/* CSS Variable utilities - background colors */
.bg-background { background-color: var(--background); }
.bg-foreground { background-color: var(--foreground); }
.bg-muted { background-color: var(--muted); }
.bg-card { background-color: var(--card); }
.bg-primary { background-color: var(--primary); }
.bg-secondary { background-color: var(--secondary); }
.bg-accent { background-color: var(--accent); }
.bg-success { background-color: var(--success); }
.bg-warning { background-color: var(--warning); }
.bg-error { background-color: var(--error); }
.bg-info { background-color: var(--info); }

/* CSS Variable utilities - text colors */
.text-foreground { color: var(--foreground); }
.text-muted-foreground { color: var(--muted-foreground); }
.text-card-foreground { color: var(--card-foreground); }
.text-primary { color: var(--primary); }
.text-primary-foreground { color: var(--primary-foreground); }
.text-secondary { color: var(--secondary); }
.text-secondary-foreground { color: var(--secondary-foreground); }
.text-accent { color: var(--accent); }
.text-accent-foreground { color: var(--accent-foreground); }
.text-success { color: var(--success); }
.text-success-foreground { color: var(--success-foreground); }
.text-warning { color: var(--warning); }
.text-warning-foreground { color: var(--warning-foreground); }
.text-error { color: var(--error); }
.text-error-foreground { color: var(--error-foreground); }
.text-info { color: var(--info); }
.text-info-foreground { color: var(--info-foreground); }

/* CSS Variable utilities - border colors */
.border-border { border-color: var(--border); }
.border-input { border-color: var(--input); }
.border-primary { border-color: var(--primary); }
.border-secondary { border-color: var(--secondary); }
.border-accent { border-color: var(--accent); }
.border-success { border-color: var(--success); }
.border-warning { border-color: var(--warning); }
.border-error { border-color: var(--error); }
.border-info { border-color: var(--info); }

/* Ring color for focus states */
.ring-ring { --tw-ring-color: var(--ring); }
`.trim();
}
