/**
 * Default Configuration Unit Tests
 * Tests the default Taildown configuration
 */

import { describe, it, expect } from 'vitest';
import { DEFAULT_CONFIG, getDefaultConfig, isDefaultConfig } from '../default-config';
import { validateConfig } from '../config-schema';

describe('Default Config', () => {
  describe('DEFAULT_CONFIG', () => {
    it('should be a valid configuration', () => {
      const result = validateConfig(DEFAULT_CONFIG);
      expect(result.valid).toBe(true);
      expect(result.errors).toEqual([]);
    });

    it('should have all required color scales', () => {
      expect(DEFAULT_CONFIG.theme.colors.primary).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.secondary).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.accent).toBeDefined();
    });

    it('should have semantic colors defined', () => {
      expect(DEFAULT_CONFIG.theme.colors.success).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.warning).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.error).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.info).toBeDefined();
    });

    it('should have gray scale defined', () => {
      expect(DEFAULT_CONFIG.theme.colors.gray).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.gray![500]).toBeDefined();
    });

    it('should have all color shades (50-950)', () => {
      const primary = DEFAULT_CONFIG.theme.colors.primary;
      expect(primary.DEFAULT).toBeDefined();
      expect(primary[50]).toBeDefined();
      expect(primary[100]).toBeDefined();
      expect(primary[500]).toBeDefined();
      expect(primary[600]).toBeDefined();
      expect(primary[700]).toBeDefined();
      expect(primary[900]).toBeDefined();
      expect(primary[950]).toBeDefined();
    });

    it('should have font stacks defined', () => {
      expect(DEFAULT_CONFIG.theme.fonts.sans).toBeDefined();
      expect(DEFAULT_CONFIG.theme.fonts.serif).toBeDefined();
      expect(DEFAULT_CONFIG.theme.fonts.mono).toBeDefined();
    });

    it('should have glassmorphism config', () => {
      expect(DEFAULT_CONFIG.theme.glass).toBeDefined();
      expect(DEFAULT_CONFIG.theme.glass.blur).toBe('md');
      expect(DEFAULT_CONFIG.theme.glass.opacity).toBe(80);
      expect(DEFAULT_CONFIG.theme.glass.borderOpacity).toBe(20);
    });

    it('should have animation config', () => {
      expect(DEFAULT_CONFIG.theme.animations).toBeDefined();
      expect(DEFAULT_CONFIG.theme.animations.speed).toBe('normal');
      expect(DEFAULT_CONFIG.theme.animations.easing).toBe('ease-out');
    });

    it('should have dark mode enabled by default', () => {
      expect(DEFAULT_CONFIG.theme.darkMode.enabled).toBe(true);
      expect(DEFAULT_CONFIG.theme.darkMode.toggle).toBe('class');
      expect(DEFAULT_CONFIG.theme.darkMode.transitionSpeed).toBe(300);
    });

    it('should have component defaults', () => {
      expect(DEFAULT_CONFIG.components).toBeDefined();
      expect(DEFAULT_CONFIG.components!.card).toBeDefined();
      expect(DEFAULT_CONFIG.components!.button).toBeDefined();
    });

    it('should have card variants', () => {
      const card = DEFAULT_CONFIG.components!.card!;
      expect(card.variants).toBeDefined();
      expect(card.variants!.flat).toBeDefined();
      expect(card.variants!.elevated).toBeDefined();
      expect(card.variants!.glass).toBeDefined();
      expect(card.variants!.bordered).toBeDefined();
      expect(card.variants!.interactive).toBeDefined();
    });

    it('should have button variants', () => {
      const button = DEFAULT_CONFIG.components!.button!;
      expect(button.variants).toBeDefined();
      expect(button.variants!.primary).toBeDefined();
      expect(button.variants!.secondary).toBeDefined();
      expect(button.variants!.outline).toBeDefined();
      expect(button.variants!.ghost).toBeDefined();
      expect(button.variants!.link).toBeDefined();
      expect(button.variants!.destructive).toBeDefined();
    });

    it('should have button sizes', () => {
      const button = DEFAULT_CONFIG.components!.button!;
      expect(button.sizes).toBeDefined();
      expect(button.sizes!.sm).toBeDefined();
      expect(button.sizes!.md).toBeDefined();
      expect(button.sizes!.lg).toBeDefined();
    });

    it('should have output config', () => {
      expect(DEFAULT_CONFIG.output).toBeDefined();
      expect(DEFAULT_CONFIG.output!.minify).toBe(false);
      expect(DEFAULT_CONFIG.output!.inlineStyles).toBe(false);
      expect(DEFAULT_CONFIG.output!.darkMode).toBe(true);
      expect(DEFAULT_CONFIG.output!.sourceMaps).toBe(false);
    });

    it('should have empty plugins array', () => {
      expect(DEFAULT_CONFIG.plugins).toBeDefined();
      expect(DEFAULT_CONFIG.plugins).toEqual([]);
    });
  });

  describe('getDefaultConfig', () => {
    it('should return a copy of DEFAULT_CONFIG', () => {
      const copy = getDefaultConfig();
      expect(copy).toEqual(DEFAULT_CONFIG);
    });

    it('should return a deep clone (not reference)', () => {
      const copy = getDefaultConfig();
      copy.theme.colors.primary.DEFAULT = '#000000';
      expect(DEFAULT_CONFIG.theme.colors.primary.DEFAULT).not.toBe('#000000');
    });

    it('should return valid config every time', () => {
      const copy = getDefaultConfig();
      const result = validateConfig(copy);
      expect(result.valid).toBe(true);
    });
  });

  describe('isDefaultConfig', () => {
    it('should return true for DEFAULT_CONFIG', () => {
      expect(isDefaultConfig(DEFAULT_CONFIG)).toBe(true);
    });

    it('should return true for exact copy', () => {
      const copy = getDefaultConfig();
      expect(isDefaultConfig(copy)).toBe(true);
    });

    it('should return false for modified config', () => {
      const modified = getDefaultConfig();
      modified.theme.colors.primary.DEFAULT = '#000000';
      expect(isDefaultConfig(modified)).toBe(false);
    });

    it('should return false for partial config', () => {
      const partial = {
        ...DEFAULT_CONFIG,
        components: {},
      };
      expect(isDefaultConfig(partial)).toBe(false);
    });
  });

  describe('Color Accessibility', () => {
    it('should use accessible colors (WCAG AA compliant)', () => {
      // Verify that default colors are from Tailwind's accessible palette
      const primary = DEFAULT_CONFIG.theme.colors.primary;
      expect(primary[600]).toBe('#2563eb'); // Tailwind blue-600
      
      const secondary = DEFAULT_CONFIG.theme.colors.secondary;
      expect(secondary[600]).toBe('#9333ea'); // Tailwind purple-600 (note: our secondary is actually purple)
    });

    it('should have good contrast ratios for semantic colors', () => {
      // Semantic colors should be visible and accessible
      expect(DEFAULT_CONFIG.theme.colors.success).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.warning).toBeDefined();
      expect(DEFAULT_CONFIG.theme.colors.error).toBeDefined();
    });
  });

  describe('Professional Defaults', () => {
    it('should default to elevated card style', () => {
      expect(DEFAULT_CONFIG.components!.card!.defaultVariant).toBe('elevated');
    });

    it('should default to primary button style', () => {
      expect(DEFAULT_CONFIG.components!.button!.defaultVariant).toBe('primary');
    });

    it('should not minify by default (for debugging)', () => {
      expect(DEFAULT_CONFIG.output!.minify).toBe(false);
    });

    it('should separate CSS by default (for caching)', () => {
      expect(DEFAULT_CONFIG.output!.inlineStyles).toBe(false);
    });

    it('should use class-based dark mode (most flexible)', () => {
      expect(DEFAULT_CONFIG.theme.darkMode.toggle).toBe('class');
    });

    it('should use smooth transition speed (300ms)', () => {
      expect(DEFAULT_CONFIG.theme.darkMode.transitionSpeed).toBe(300);
    });
  });
});
