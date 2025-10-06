/**
 * Configuration Schema Unit Tests
 * Tests validation and type guards for Taildown configuration
 */

import { describe, it, expect } from 'vitest';
import {
  isColorScale,
  isColorString,
  validateColorConfig,
  validateThemeConfig,
  validateConfig,
  validateConfigDetailed,
  type TaildownConfig,
  type ColorConfig,
  type ThemeConfig,
} from '../config-schema';

describe('Config Schema', () => {
  describe('Type Guards', () => {
    describe('isColorScale', () => {
      it('should identify valid color scales with DEFAULT', () => {
        expect(isColorScale({ DEFAULT: '#3B82F6', 600: '#2563EB' })).toBe(true);
      });

      it('should identify color scales with numeric shades', () => {
        expect(isColorScale({ 50: '#EFF6FF', 100: '#DBEAFE' })).toBe(true);
        expect(isColorScale({ 500: '#3B82F6', 600: '#2563EB' })).toBe(true);
        expect(isColorScale({ 600: '#2563EB' })).toBe(true);
      });

      it('should return false for non-object values', () => {
        expect(isColorScale(null)).toBe(false);
        expect(isColorScale(undefined)).toBe(false);
        expect(isColorScale('#3B82F6')).toBe(false);
        expect(isColorScale(123)).toBe(false);
      });

      it('should return false for empty objects', () => {
        expect(isColorScale({})).toBe(false);
      });

      it('should return false for objects without color properties', () => {
        expect(isColorScale({ foo: 'bar' })).toBe(false);
      });
    });

    describe('isColorString', () => {
      it('should identify valid 6-digit hex colors', () => {
        expect(isColorString('#3B82F6')).toBe(true);
        expect(isColorString('#000000')).toBe(true);
        expect(isColorString('#FFFFFF')).toBe(true);
        expect(isColorString('#abc123')).toBe(true);
      });

      it('should reject invalid hex formats', () => {
        expect(isColorString('#3B8')).toBe(false); // Too short
        expect(isColorString('#3B82F6F')).toBe(false); // Too long
        expect(isColorString('3B82F6')).toBe(false); // No hash
        expect(isColorString('#GGGGGG')).toBe(false); // Invalid hex chars
        expect(isColorString('')).toBe(false);
      });

      it('should reject non-string values', () => {
        expect(isColorString(123)).toBe(false);
        expect(isColorString(null)).toBe(false);
        expect(isColorString(undefined)).toBe(false);
        expect(isColorString({})).toBe(false);
      });
    });
  });

  describe('Validation', () => {
    const validColorConfig: ColorConfig = {
      primary: {
        DEFAULT: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
      secondary: {
        DEFAULT: '#6B7280',
        600: '#6B7280',
      },
      accent: {
        DEFAULT: '#8B5CF6',
        600: '#8B5CF6',
      },
    };

    describe('validateColorConfig', () => {
      it('should pass for valid color configuration', () => {
        const errors = validateColorConfig(validColorConfig);
        expect(errors).toEqual([]);
      });

      it('should error on missing primary color', () => {
        const config = {
          secondary: validColorConfig.secondary,
          accent: validColorConfig.accent,
        } as ColorConfig;
        const errors = validateColorConfig(config);
        expect(errors).toContain('Missing required color: primary');
      });

      it('should error on missing secondary color', () => {
        const config = {
          primary: validColorConfig.primary,
          accent: validColorConfig.accent,
        } as ColorConfig;
        const errors = validateColorConfig(config);
        expect(errors).toContain('Missing required color: secondary');
      });

      it('should error on missing accent color', () => {
        const config = {
          primary: validColorConfig.primary,
          secondary: validColorConfig.secondary,
        } as ColorConfig;
        const errors = validateColorConfig(config);
        expect(errors).toContain('Missing required color: accent');
      });

      it('should error on invalid hex colors in scale', () => {
        const config: ColorConfig = {
          ...validColorConfig,
          primary: {
            DEFAULT: 'not-a-color',
            600: '#2563EB',
          },
        };
        const errors = validateColorConfig(config);
        expect(errors.some(e => e.includes('not-a-color'))).toBe(true);
      });

      it('should error on invalid simple color values', () => {
        const config: ColorConfig = {
          ...validColorConfig,
          success: 'invalid-color',
        };
        const errors = validateColorConfig(config);
        expect(errors.some(e => e.includes('invalid-color'))).toBe(true);
      });
    });

    describe('validateThemeConfig', () => {
      const validThemeConfig: ThemeConfig = {
        colors: validColorConfig,
        fonts: {
          sans: 'Inter, sans-serif',
        },
        glass: {
          blur: 'md',
          opacity: 80,
          borderOpacity: 50,
        },
        animations: {
          speed: 'normal',
          easing: 'ease-out',
        },
        darkMode: {
          enabled: true,
          toggle: 'class',
          transitionSpeed: 300,
        },
      };

      it('should pass for valid theme configuration', () => {
        const errors = validateThemeConfig(validThemeConfig);
        expect(errors).toEqual([]);
      });

      it('should error on invalid glass opacity (too high)', () => {
        const config = {
          ...validThemeConfig,
          glass: {
            ...validThemeConfig.glass,
            opacity: 150,
          },
        };
        const errors = validateThemeConfig(config);
        expect(errors.some(e => e.includes('opacity must be between 0 and 100'))).toBe(true);
      });

      it('should error on invalid glass opacity (negative)', () => {
        const config = {
          ...validThemeConfig,
          glass: {
            ...validThemeConfig.glass,
            opacity: -10,
          },
        };
        const errors = validateThemeConfig(config);
        expect(errors.some(e => e.includes('opacity must be between 0 and 100'))).toBe(true);
      });

      it('should error on invalid border opacity', () => {
        const config = {
          ...validThemeConfig,
          glass: {
            ...validThemeConfig.glass,
            borderOpacity: 200,
          },
        };
        const errors = validateThemeConfig(config);
        expect(errors.some(e => e.includes('borderOpacity must be between 0 and 100'))).toBe(true);
      });

      it('should error on negative transition speed', () => {
        const config = {
          ...validThemeConfig,
          darkMode: {
            ...validThemeConfig.darkMode,
            transitionSpeed: -100,
          },
        };
        const errors = validateThemeConfig(config);
        expect(errors.some(e => e.includes('transitionSpeed must be positive'))).toBe(true);
      });

      it('should propagate color validation errors', () => {
        const config = {
          ...validThemeConfig,
          colors: {
            secondary: validColorConfig.secondary,
            accent: validColorConfig.accent,
          } as ColorConfig,
        };
        const errors = validateThemeConfig(config);
        expect(errors.some(e => e.includes('Missing required color: primary'))).toBe(true);
      });
    });

    describe('validateConfig', () => {
      const validConfig: TaildownConfig = {
        theme: {
          colors: validColorConfig,
          fonts: { sans: 'Inter' },
          glass: { blur: 'md', opacity: 80, borderOpacity: 50 },
          animations: { speed: 'normal', easing: 'ease-out' },
          darkMode: { enabled: true, toggle: 'class', transitionSpeed: 300 },
        },
      };

      it('should pass for valid configuration', () => {
        const result = validateConfig(validConfig);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should error on missing theme', () => {
        const config = {} as TaildownConfig;
        const result = validateConfig(config);
        expect(result.valid).toBe(false);
        expect(result.errors).toContain('Missing required field: theme');
      });

      it('should propagate theme validation errors', () => {
        const config = {
          theme: {
            ...validConfig.theme,
            glass: {
              ...validConfig.theme.glass,
              opacity: 150,
            },
          },
        };
        const result = validateConfig(config);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });

    describe('validateConfigDetailed', () => {
      const validConfig: TaildownConfig = {
        theme: {
          colors: validColorConfig,
          fonts: { sans: 'Inter' },
          glass: { blur: 'md', opacity: 80, borderOpacity: 50 },
          animations: { speed: 'normal', easing: 'ease-out' },
          darkMode: { enabled: true, toggle: 'class', transitionSpeed: 300 },
        },
      };

      it('should provide detailed validation with warnings', () => {
        const config = {
          ...validConfig,
          theme: {
            ...validConfig.theme,
            fonts: {},
          },
        };
        const result = validateConfigDetailed(config);
        expect(result.valid).toBe(true);
        expect(result.warnings.length).toBeGreaterThan(0);
        expect(result.warnings.some(w => w.includes('sans-serif font'))).toBe(true);
      });

      it('should warn about missing gray scale', () => {
        const config = {
          ...validConfig,
          theme: {
            ...validConfig.theme,
            colors: {
              ...validColorConfig,
              gray: undefined,
            },
          },
        };
        const result = validateConfigDetailed(config);
        expect(result.warnings.some(w => w.includes('gray'))).toBe(true);
      });

      it('should return errors and warnings separately', () => {
        const config = {
          theme: {
            colors: {
              secondary: validColorConfig.secondary,
              accent: validColorConfig.accent,
            } as ColorConfig,
            fonts: {},
            glass: { blur: 'md' as const, opacity: 80, borderOpacity: 50 },
            animations: { speed: 'normal' as const, easing: 'ease-out' as const },
            darkMode: { enabled: true, toggle: 'class' as const, transitionSpeed: 300 },
          },
        };
        const result = validateConfigDetailed(config);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
        expect(result.warnings.length).toBeGreaterThan(0);
      });

      it('should have valid=true when no errors', () => {
        const result = validateConfigDetailed(validConfig);
        expect(result.valid).toBe(true);
        expect(result.errors).toEqual([]);
      });

      it('should have valid=false when errors exist', () => {
        const config = {} as TaildownConfig;
        const result = validateConfigDetailed(config);
        expect(result.valid).toBe(false);
        expect(result.errors.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Edge Cases', () => {
    const validColorConfig: ColorConfig = {
      primary: {
        DEFAULT: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
      secondary: {
        DEFAULT: '#6B7280',
        600: '#6B7280',
      },
      accent: {
        DEFAULT: '#8B5CF6',
        600: '#8B5CF6',
      },
    };

    it('should handle null values in color config gracefully', () => {
      const config: any = {
        primary: null,
        secondary: validColorConfig.secondary,
        accent: validColorConfig.accent,
      };
      const errors = validateColorConfig(config);
      expect(errors).toContain('Missing required color: primary');
    });

    it('should handle undefined color scales', () => {
      const config: any = {
        primary: undefined,
        secondary: validColorConfig.secondary,
        accent: validColorConfig.accent,
      };
      const errors = validateColorConfig(config);
      expect(errors).toContain('Missing required color: primary');
    });

    it('should validate all shades in a color scale', () => {
      const config: ColorConfig = {
        ...validColorConfig,
        primary: {
          DEFAULT: '#3B82F6',
          500: 'invalid',
          600: '#2563EB',
        },
      };
      const errors = validateColorConfig(config);
      expect(errors.some(e => e.includes('primary.500'))).toBe(true);
    });
  });
});
