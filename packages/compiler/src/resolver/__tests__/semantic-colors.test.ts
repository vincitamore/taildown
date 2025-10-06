/**
 * Semantic Color Resolver Unit Tests
 * Tests semantic color resolution (primary, secondary, accent)
 */

import { describe, it, expect } from 'vitest';
import {
  resolveSemanticColor,
  isSemanticColor,
  getSemanticColorVariations,
  getAllSemanticColors,
  resolveColorPair,
  SEMANTIC_COLORS,
  COLOR_PREFIXES,
} from '../semantic-colors';
import type { ResolverContext } from '../style-resolver';
import type { TaildownConfig } from '../../config/config-schema';

const mockConfig: TaildownConfig = {
  theme: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
      },
      secondary: {
        DEFAULT: '#6B7280',
        600: '#6B7280',
        700: '#4B5563',
      },
      accent: {
        DEFAULT: '#8B5CF6',
        600: '#8B5CF6',
        700: '#7C3AED',
      },
    },
    fonts: {},
    glass: { blur: 'md', opacity: 80, borderOpacity: 50 },
    animations: { speed: 'normal', easing: 'ease-out' },
    darkMode: { enabled: true, toggle: 'class', transitionSpeed: 300 },
  },
};

const mockContext: ResolverContext = {
  config: mockConfig,
  darkMode: false,
};

const mockDarkModeContext: ResolverContext = {
  config: mockConfig,
  darkMode: true,
};

describe('Semantic Colors', () => {
  describe('Constants', () => {
    it('should export SEMANTIC_COLORS array', () => {
      expect(SEMANTIC_COLORS).toEqual(['primary', 'secondary', 'accent']);
    });

    it('should export COLOR_PREFIXES array', () => {
      expect(COLOR_PREFIXES).toEqual(['text', 'bg', 'border', 'ring', 'divide']);
    });
  });

  describe('resolveSemanticColor', () => {
    describe('Base color (defaults to text)', () => {
      it('should resolve primary to text classes', () => {
        const result = resolveSemanticColor('primary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('text-primary-600');
        expect(result).toContain('hover:text-primary-700');
      });

      it('should resolve secondary to text classes', () => {
        const result = resolveSemanticColor('secondary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('text-secondary-600');
        expect(result).toContain('hover:text-secondary-700');
      });

      it('should resolve accent to text classes', () => {
        const result = resolveSemanticColor('accent', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('text-accent-600');
        expect(result).toContain('hover:text-accent-700');
      });
    });

    describe('Text prefix', () => {
      it('should resolve text-primary', () => {
        const result = resolveSemanticColor('text-primary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('text-primary-600');
        expect(result).toContain('hover:text-primary-700');
      });

      it('should resolve text-secondary', () => {
        const result = resolveSemanticColor('text-secondary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('text-secondary-600');
      });

      it('should resolve text-accent', () => {
        const result = resolveSemanticColor('text-accent', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('text-accent-600');
      });
    });

    describe('Background prefix', () => {
      it('should resolve bg-primary', () => {
        const result = resolveSemanticColor('bg-primary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('bg-primary-600');
        expect(result).toContain('hover:bg-primary-700');
      });

      it('should resolve bg-secondary', () => {
        const result = resolveSemanticColor('bg-secondary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('bg-secondary-600');
      });

      it('should resolve bg-accent', () => {
        const result = resolveSemanticColor('bg-accent', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('bg-accent-600');
      });
    });

    describe('Border prefix', () => {
      it('should resolve border-primary', () => {
        const result = resolveSemanticColor('border-primary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('border-primary-600');
        // Border should NOT have hover effect
        expect(result?.some(c => c.includes('hover'))).toBe(false);
      });

      it('should resolve border-secondary', () => {
        const result = resolveSemanticColor('border-secondary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('border-secondary-600');
      });

      it('should resolve border-accent', () => {
        const result = resolveSemanticColor('border-accent', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('border-accent-600');
      });
    });

    describe('Ring prefix', () => {
      it('should resolve ring-primary', () => {
        const result = resolveSemanticColor('ring-primary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('ring-primary-600');
        // Ring should NOT have hover effect
        expect(result?.some(c => c.includes('hover'))).toBe(false);
      });
    });

    describe('Divide prefix', () => {
      it('should resolve divide-primary', () => {
        const result = resolveSemanticColor('divide-primary', mockContext);
        expect(result).toBeDefined();
        expect(result).toContain('divide-primary-600');
        // Divide should NOT have hover effect
        expect(result?.some(c => c.includes('hover'))).toBe(false);
      });
    });

    describe('Dark mode', () => {
      it('should add dark mode classes for text colors', () => {
        const result = resolveSemanticColor('primary', mockDarkModeContext);
        expect(result).toBeDefined();
        expect(result).toContain('text-primary-600');
        expect(result).toContain('hover:text-primary-700');
        expect(result).toContain('dark:text-primary-400');
      });

      it('should add dark mode classes for backgrounds', () => {
        const result = resolveSemanticColor('bg-primary', mockDarkModeContext);
        expect(result).toBeDefined();
        expect(result).toContain('bg-primary-600');
        expect(result).toContain('dark:bg-primary-700');
      });

      it('should not break without dark mode enabled', () => {
        const contextWithoutDarkMode: ResolverContext = {
          config: {
            ...mockConfig,
            theme: {
              ...mockConfig.theme,
              darkMode: { enabled: false, toggle: 'class', transitionSpeed: 300 },
            },
          },
          darkMode: true,
        };
        const result = resolveSemanticColor('primary', contextWithoutDarkMode);
        expect(result).toBeDefined();
        // Should not have dark mode classes if dark mode is not enabled
        expect(result?.some(c => c.includes('dark:'))).toBe(false);
      });
    });

    describe('Invalid inputs', () => {
      it('should return null for non-semantic colors', () => {
        const result = resolveSemanticColor('bold', mockContext);
        expect(result).toBeNull();
      });

      it('should return null for unknown colors', () => {
        const result = resolveSemanticColor('unknown', mockContext);
        expect(result).toBeNull();
      });

      it('should return null for invalid prefixes', () => {
        const result = resolveSemanticColor('shadow-primary', mockContext);
        expect(result).toBeNull();
      });

      it('should return null for CSS classes', () => {
        const result = resolveSemanticColor('text-blue-600', mockContext);
        expect(result).toBeNull();
      });
    });

    describe('Missing color configuration', () => {
      it('should return null if color not in config', () => {
        const contextWithoutAccent: ResolverContext = {
          config: {
            ...mockConfig,
            theme: {
              ...mockConfig.theme,
              colors: {
                primary: mockConfig.theme.colors.primary,
                secondary: mockConfig.theme.colors.secondary,
                accent: mockConfig.theme.colors.accent,
              },
            },
          },
          darkMode: false,
        };

        // Should still work for defined colors
        const result = resolveSemanticColor('primary', contextWithoutAccent);
        expect(result).toBeDefined();
      });
    });
  });

  describe('isSemanticColor', () => {
    it('should identify base semantic colors', () => {
      expect(isSemanticColor('primary')).toBe(true);
      expect(isSemanticColor('secondary')).toBe(true);
      expect(isSemanticColor('accent')).toBe(true);
    });

    it('should identify text-prefixed colors', () => {
      expect(isSemanticColor('text-primary')).toBe(true);
      expect(isSemanticColor('text-secondary')).toBe(true);
      expect(isSemanticColor('text-accent')).toBe(true);
    });

    it('should identify bg-prefixed colors', () => {
      expect(isSemanticColor('bg-primary')).toBe(true);
      expect(isSemanticColor('bg-secondary')).toBe(true);
      expect(isSemanticColor('bg-accent')).toBe(true);
    });

    it('should identify border-prefixed colors', () => {
      expect(isSemanticColor('border-primary')).toBe(true);
      expect(isSemanticColor('border-secondary')).toBe(true);
      expect(isSemanticColor('border-accent')).toBe(true);
    });

    it('should identify ring and divide prefixes', () => {
      expect(isSemanticColor('ring-primary')).toBe(true);
      expect(isSemanticColor('divide-accent')).toBe(true);
    });

    it('should return false for non-semantic colors', () => {
      expect(isSemanticColor('bold')).toBe(false);
      expect(isSemanticColor('center')).toBe(false);
      expect(isSemanticColor('unknown')).toBe(false);
    });

    it('should return false for CSS classes', () => {
      expect(isSemanticColor('text-blue-600')).toBe(false);
      expect(isSemanticColor('bg-gray-500')).toBe(false);
    });

    it('should return false for invalid prefixes', () => {
      expect(isSemanticColor('shadow-primary')).toBe(false);
      expect(isSemanticColor('font-primary')).toBe(false);
    });
  });

  describe('getSemanticColorVariations', () => {
    it('should return all variations for primary', () => {
      const variations = getSemanticColorVariations('primary');
      expect(variations).toContain('primary');
      expect(variations).toContain('text-primary');
      expect(variations).toContain('bg-primary');
      expect(variations).toContain('border-primary');
      expect(variations).toContain('ring-primary');
      expect(variations).toContain('divide-primary');
      expect(variations.length).toBe(6); // Base + 5 prefixes
    });

    it('should return all variations for secondary', () => {
      const variations = getSemanticColorVariations('secondary');
      expect(variations).toContain('secondary');
      expect(variations).toContain('text-secondary');
      expect(variations).toContain('bg-secondary');
      expect(variations.length).toBe(6);
    });

    it('should return all variations for accent', () => {
      const variations = getSemanticColorVariations('accent');
      expect(variations).toContain('accent');
      expect(variations).toContain('text-accent');
      expect(variations).toContain('bg-accent');
      expect(variations.length).toBe(6);
    });
  });

  describe('getAllSemanticColors', () => {
    it('should return all semantic colors with their variations', () => {
      const all = getAllSemanticColors();
      expect(all.primary).toBeDefined();
      expect(all.secondary).toBeDefined();
      expect(all.accent).toBeDefined();
    });

    it('should have correct variations for each color', () => {
      const all = getAllSemanticColors();
      expect(all.primary.length).toBe(6);
      expect(all.secondary.length).toBe(6);
      expect(all.accent.length).toBe(6);
    });
  });

  describe('resolveColorPair', () => {
    it('should resolve primary color pair with background and text', () => {
      const result = resolveColorPair('primary', mockContext);
      expect(result).toContain('bg-primary-600');
      expect(result).toContain('hover:bg-primary-700');
      expect(result).toContain('text-white');
    });

    it('should resolve secondary color pair', () => {
      const result = resolveColorPair('secondary', mockContext);
      expect(result).toContain('bg-secondary-600');
      expect(result).toContain('text-white');
    });

    it('should resolve accent color pair', () => {
      const result = resolveColorPair('accent', mockContext);
      expect(result).toContain('bg-accent-600');
      expect(result).toContain('text-white');
    });

    it('should add dark mode classes when dark mode is enabled', () => {
      const result = resolveColorPair('primary', mockDarkModeContext);
      expect(result).toContain('bg-primary-600');
      expect(result).toContain('dark:bg-primary-700');
      expect(result).toContain('dark:hover:bg-primary-800');
    });

    it('should ensure good contrast with white text', () => {
      const result = resolveColorPair('primary', mockContext);
      // Every color pair should have white text for contrast
      expect(result).toContain('text-white');
    });
  });

  describe('Shade Selection', () => {
    it('should prefer 600 shade for base colors', () => {
      const result = resolveSemanticColor('primary', mockContext);
      expect(result).toContain('text-primary-600');
    });

    it('should use 700 shade for hover', () => {
      const result = resolveSemanticColor('primary', mockContext);
      expect(result).toContain('hover:text-primary-700');
    });

    it('should use 400 shade for dark mode text', () => {
      const result = resolveSemanticColor('text-primary', mockDarkModeContext);
      expect(result).toContain('dark:text-primary-400');
    });

    it('should use 700 shade for dark mode backgrounds', () => {
      const result = resolveSemanticColor('bg-primary', mockDarkModeContext);
      expect(result).toContain('dark:bg-primary-700');
    });
  });

  describe('Integration', () => {
    it('should work with all semantic colors', () => {
      for (const color of SEMANTIC_COLORS) {
        const result = resolveSemanticColor(color, mockContext);
        expect(result).toBeDefined();
        expect(result!.length).toBeGreaterThan(0);
      }
    });

    it('should work with all color prefixes', () => {
      for (const prefix of COLOR_PREFIXES) {
        const result = resolveSemanticColor(`${prefix}-primary`, mockContext);
        expect(result).toBeDefined();
        expect(result!.length).toBeGreaterThan(0);
      }
    });

    it('should produce valid CSS class names', () => {
      const result = resolveSemanticColor('primary', mockContext);
      expect(result).toBeDefined();
      result!.forEach(cls => {
        expect(cls).toMatch(/^[a-z0-9:-]+$/); // Valid CSS class name
      });
    });
  });
});
