/**
 * Theme Resolver for Taildown
 * Resolves theme values from config and applies them to components
 * 
 * Responsibilities:
 * - Load theme from config
 * - Resolve color variables
 * - Apply dark mode classes
 * - Generate theme-aware CSS
 */

import type { TaildownConfig } from '../config/config-schema';
import { generateDarkModeCSS, getDarkModeOptions, isDarkModeEnabled } from './dark-mode';
import { generateGlassmorphismCSS } from './glassmorphism';
import { generateAnimationCSS } from './animations';

/**
 * Theme resolver class
 */
export class ThemeResolver {
  private config: TaildownConfig;
  
  constructor(config: TaildownConfig) {
    this.config = config;
  }
  
  /**
   * Generate complete theme CSS
   * Includes colors, dark mode, glassmorphism, and animations
   */
  generateThemeCSS(): string {
    const sections: string[] = [];
    
    // Dark mode CSS (includes color palette)
    if (isDarkModeEnabled(this.config)) {
      sections.push(generateDarkModeCSS(this.config));
    }
    
    // Glassmorphism effects
    sections.push(generateGlassmorphismCSS());
    
    // Animations
    sections.push(generateAnimationCSS());
    
    return sections.join('\n\n');
  }
  
  /**
   * Get resolved color value
   */
  getColor(colorName: string, shade?: number): string {
    const colors = this.config.theme?.colors;
    
    if (!colors) {
      return this.getFallbackColor(colorName, shade);
    }
    
    // Handle semantic colors (single values)
    if (colorName === 'success') return colors.success || '#10b981';
    if (colorName === 'warning') return colors.warning || '#f59e0b';
    if (colorName === 'error') return colors.error || '#ef4444';
    if (colorName === 'info') return colors.info || '#82a0ff';
    
    // Handle color objects with shades
    const colorObj = colors[colorName as keyof typeof colors];
    
    if (typeof colorObj === 'object' && colorObj !== null && 'DEFAULT' in colorObj) {
      if (shade) {
        return (colorObj as any)[shade] || (colorObj as any).DEFAULT || this.getFallbackColor(colorName, shade);
      }
      return (colorObj as any).DEFAULT || this.getFallbackColor(colorName, shade);
    }
    
    return this.getFallbackColor(colorName, shade);
  }
  
  /**
   * Get fallback color when config doesn't have the color
   */
  private getFallbackColor(colorName: string, shade?: number): string {
    const fallbacks: Record<string, string> = {
      primary: '#82a0ff',
      secondary: '#8b5cf6',
      accent: '#ec4899',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#82a0ff',
      gray: '#6b7280',
    };
    
    return fallbacks[colorName] || '#6b7280';
  }
  
  /**
   * Check if dark mode is enabled
   */
  isDarkModeEnabled(): boolean {
    return isDarkModeEnabled(this.config);
  }
  
  /**
   * Get dark mode options
   */
  getDarkModeOptions() {
    return getDarkModeOptions(this.config);
  }
  
  /**
   * Get font family
   */
  getFont(type: 'sans' | 'serif' | 'mono'): string {
    const fonts = this.config.theme?.fonts;
    
    if (!fonts) {
      return this.getFallbackFont(type);
    }
    
    return fonts[type] || this.getFallbackFont(type);
  }
  
  /**
   * Get fallback font when config doesn't have it
   */
  private getFallbackFont(type: 'sans' | 'serif' | 'mono'): string {
    const fallbacks = {
      sans: 'Inter, system-ui, -apple-system, sans-serif',
      serif: 'Georgia, serif',
      mono: 'Menlo, Monaco, Consolas, monospace',
    };
    
    return fallbacks[type];
  }
}

/**
 * Create theme resolver from config
 */
export function createThemeResolver(config: TaildownConfig): ThemeResolver {
  return new ThemeResolver(config);
}
