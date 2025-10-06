/**
 * Glassmorphism Unit Tests
 * Tests glass effect generation and browser compatibility
 */

import { describe, it, expect } from 'vitest';
import {
  GlassIntensity,
  GLASS_PRESETS,
  getGlassClasses,
  generateGlassmorphismCSS,
  getGlassmorphismSupport,
  getGlassShorthands,
} from '../glassmorphism';

describe('Glassmorphism', () => {
  describe('GlassIntensity Enum', () => {
    it('should have all intensity levels', () => {
      expect(GlassIntensity.SUBTLE).toBe('subtle');
      expect(GlassIntensity.LIGHT).toBe('light');
      expect(GlassIntensity.MEDIUM).toBe('medium');
      expect(GlassIntensity.HEAVY).toBe('heavy');
      expect(GlassIntensity.EXTREME).toBe('extreme');
    });
  });

  describe('GLASS_PRESETS', () => {
    it('should have presets for all intensity levels', () => {
      expect(GLASS_PRESETS[GlassIntensity.SUBTLE]).toBeDefined();
      expect(GLASS_PRESETS[GlassIntensity.LIGHT]).toBeDefined();
      expect(GLASS_PRESETS[GlassIntensity.MEDIUM]).toBeDefined();
      expect(GLASS_PRESETS[GlassIntensity.HEAVY]).toBeDefined();
      expect(GLASS_PRESETS[GlassIntensity.EXTREME]).toBeDefined();
    });

    it('should have increasing blur values', () => {
      const subtle = GLASS_PRESETS[GlassIntensity.SUBTLE].blur;
      const light = GLASS_PRESETS[GlassIntensity.LIGHT].blur;
      const medium = GLASS_PRESETS[GlassIntensity.MEDIUM].blur;
      const heavy = GLASS_PRESETS[GlassIntensity.HEAVY].blur;
      const extreme = GLASS_PRESETS[GlassIntensity.EXTREME].blur;

      expect(parseInt(subtle)).toBeLessThan(parseInt(light));
      expect(parseInt(light)).toBeLessThan(parseInt(medium));
      expect(parseInt(medium)).toBeLessThan(parseInt(heavy));
      expect(parseInt(heavy)).toBeLessThan(parseInt(extreme));
    });

    it('should have decreasing opacity values', () => {
      const subtle = GLASS_PRESETS[GlassIntensity.SUBTLE].opacity;
      const light = GLASS_PRESETS[GlassIntensity.LIGHT].opacity;
      const medium = GLASS_PRESETS[GlassIntensity.MEDIUM].opacity;
      const heavy = GLASS_PRESETS[GlassIntensity.HEAVY].opacity;
      const extreme = GLASS_PRESETS[GlassIntensity.EXTREME].opacity;

      expect(subtle).toBeGreaterThan(light);
      expect(light).toBeGreaterThan(medium);
      expect(medium).toBeGreaterThan(heavy);
      expect(heavy).toBeGreaterThan(extreme);
    });

    it('should have valid opacity values (0-1)', () => {
      Object.values(GLASS_PRESETS).forEach(preset => {
        expect(preset.opacity).toBeGreaterThanOrEqual(0);
        expect(preset.opacity).toBeLessThanOrEqual(1);
      });
    });

    it('should have valid border opacity values (0-1)', () => {
      Object.values(GLASS_PRESETS).forEach(preset => {
        expect(preset.borderOpacity).toBeGreaterThanOrEqual(0);
        expect(preset.borderOpacity).toBeLessThanOrEqual(1);
      });
    });

    it('should have shadow strength defined', () => {
      Object.values(GLASS_PRESETS).forEach(preset => {
        expect(['none', 'sm', 'md', 'lg', 'xl']).toContain(preset.shadowStrength);
      });
    });

    it('should have valid blur values in px', () => {
      Object.values(GLASS_PRESETS).forEach(preset => {
        expect(preset.blur).toMatch(/^\d+px$/);
      });
    });
  });

  describe('getGlassClasses', () => {
    describe('Light Mode', () => {
      it('should generate classes for subtle intensity', () => {
        const classes = getGlassClasses(GlassIntensity.SUBTLE, false);
        expect(classes).toContain('glass-effect');
        expect(classes).toContain('glass-subtle');
        expect(classes.some(c => c.includes('backdrop-blur'))).toBe(true);
      });

      it('should generate classes for medium intensity', () => {
        const classes = getGlassClasses(GlassIntensity.MEDIUM, false);
        expect(classes).toContain('glass-effect');
        expect(classes).toContain('glass-medium');
      });

      it('should generate classes for extreme intensity', () => {
        const classes = getGlassClasses(GlassIntensity.EXTREME, false);
        expect(classes).toContain('glass-effect');
        expect(classes).toContain('glass-extreme');
      });

      it('should include light mode background', () => {
        const classes = getGlassClasses(GlassIntensity.MEDIUM, false);
        expect(classes.some(c => c.includes('bg-white'))).toBe(true);
      });

      it('should include border classes', () => {
        const classes = getGlassClasses(GlassIntensity.MEDIUM, false);
        expect(classes).toContain('border');
        expect(classes.some(c => c.includes('border-white'))).toBe(true);
      });

      it('should include shadow classes', () => {
        const classes = getGlassClasses(GlassIntensity.MEDIUM, false);
        expect(classes.some(c => c.includes('shadow'))).toBe(true);
      });

      it('should default to medium intensity', () => {
        const classes = getGlassClasses();
        expect(classes).toContain('glass-medium');
      });
    });

    describe('Dark Mode', () => {
      it('should generate dark mode classes', () => {
        const classes = getGlassClasses(GlassIntensity.MEDIUM, true);
        expect(classes).toContain('glass-effect');
        expect(classes).toContain('glass-medium');
      });

      it('should include dark mode background variants', () => {
        const classes = getGlassClasses(GlassIntensity.MEDIUM, true);
        expect(classes.some(c => c.includes('dark:'))).toBe(true);
      });

      it('should differ from light mode', () => {
        const lightClasses = getGlassClasses(GlassIntensity.MEDIUM, false);
        const darkClasses = getGlassClasses(GlassIntensity.MEDIUM, true);
        
        // Should have some different classes
        const lightBg = lightClasses.filter(c => c.includes('bg-'));
        const darkBg = darkClasses.filter(c => c.includes('bg-'));
        expect(lightBg).not.toEqual(darkBg);
      });
    });

    describe('All Intensities', () => {
      const intensities = [
        GlassIntensity.SUBTLE,
        GlassIntensity.LIGHT,
        GlassIntensity.MEDIUM,
        GlassIntensity.HEAVY,
        GlassIntensity.EXTREME,
      ];

      intensities.forEach(intensity => {
        it(`should generate valid classes for ${intensity}`, () => {
          const classes = getGlassClasses(intensity, false);
          
          expect(classes).toContain('glass-effect');
          expect(classes).toContain(`glass-${intensity}`);
          expect(classes.length).toBeGreaterThan(3);
        });
      });

      it('should always include glass-effect base class', () => {
        intensities.forEach(intensity => {
          const classes = getGlassClasses(intensity, false);
          expect(classes).toContain('glass-effect');
        });
      });

      it('should always include backdrop blur', () => {
        intensities.forEach(intensity => {
          const classes = getGlassClasses(intensity, false);
          expect(classes.some(c => c.includes('backdrop-blur'))).toBe(true);
        });
      });

      it('should always include border', () => {
        intensities.forEach(intensity => {
          const classes = getGlassClasses(intensity, false);
          expect(classes).toContain('border');
        });
      });
    });
  });

  describe('generateGlassmorphismCSS', () => {
    const css = generateGlassmorphismCSS();

    it('should return CSS string', () => {
      expect(typeof css).toBe('string');
      expect(css.length).toBeGreaterThan(0);
    });

    it('should include base glass-effect class', () => {
      expect(css).toContain('.glass-effect');
    });

    it('should include all intensity variants', () => {
      expect(css).toContain('.glass-subtle');
      expect(css).toContain('.glass-light');
      expect(css).toContain('.glass-medium');
      expect(css).toContain('.glass-heavy');
      expect(css).toContain('.glass-extreme');
    });

    it('should include backdrop-filter CSS', () => {
      expect(css).toContain('backdrop-filter');
      expect(css).toContain('-webkit-backdrop-filter');
    });

    it('should include blur utilities', () => {
      expect(css).toContain('.backdrop-blur-4');
      expect(css).toContain('.backdrop-blur-8');
      expect(css).toContain('.backdrop-blur-12');
      expect(css).toContain('.backdrop-blur-16');
      expect(css).toContain('.backdrop-blur-24');
    });

    it('should include saturation utilities', () => {
      expect(css).toContain('.saturate-105');
      expect(css).toContain('.saturate-110');
      expect(css).toContain('.saturate-120');
      expect(css).toContain('.saturate-130');
    });

    it('should include background opacity utilities', () => {
      expect(css).toContain('bg-white');
      expect(css).toContain('bg-black');
    });

    it('should include border opacity utilities', () => {
      expect(css).toContain('border-white');
    });

    it('should include dark mode overrides', () => {
      expect(css).toContain('.dark');
    });

    it('should include browser fallbacks', () => {
      expect(css).toContain('@supports not (backdrop-filter: blur(1px))');
    });

    it('should include hover effects', () => {
      expect(css).toContain('.glass-effect:hover');
      expect(css).toContain('transform');
    });

    it('should include active state', () => {
      expect(css).toContain('.glass-effect:active');
    });

    it('should use GPU-accelerated properties', () => {
      expect(css).toContain('transform');
      expect(css).toContain('transition');
    });

    it('should include proper easing curves', () => {
      expect(css).toContain('cubic-bezier');
    });

    it('should be valid CSS syntax', () => {
      // Check for balanced braces
      const openBraces = (css.match(/{/g) || []).length;
      const closeBraces = (css.match(/}/g) || []).length;
      expect(openBraces).toBe(closeBraces);
    });
  });

  describe('getGlassmorphismSupport', () => {
    it('should return support object', () => {
      const support = getGlassmorphismSupport();
      expect(support).toBeDefined();
      expect(typeof support).toBe('object');
    });

    it('should have all required flags', () => {
      const support = getGlassmorphismSupport();
      expect(support.backdropFilter).toBeDefined();
      expect(support.webkitBackdropFilter).toBeDefined();
      expect(support.fullSupport).toBeDefined();
    });

    it('should return boolean values', () => {
      const support = getGlassmorphismSupport();
      expect(typeof support.backdropFilter).toBe('boolean');
      expect(typeof support.webkitBackdropFilter).toBe('boolean');
      expect(typeof support.fullSupport).toBe('boolean');
    });

    it('should assume modern browser support', () => {
      const support = getGlassmorphismSupport();
      // Compile-time check assumes modern browsers
      expect(support.fullSupport).toBe(true);
    });
  });

  describe('getGlassShorthands', () => {
    const shorthands = getGlassShorthands();

    it('should return shorthand mappings', () => {
      expect(shorthands).toBeDefined();
      expect(typeof shorthands).toBe('object');
    });

    it('should have default glass shorthand', () => {
      expect(shorthands['glass']).toBeDefined();
      expect(Array.isArray(shorthands['glass'])).toBe(true);
    });

    it('should have all intensity shorthands', () => {
      expect(shorthands['glass-subtle']).toBeDefined();
      expect(shorthands['glass-light']).toBeDefined();
      expect(shorthands['glass-medium']).toBeDefined();
      expect(shorthands['glass-heavy']).toBeDefined();
      expect(shorthands['glass-extreme']).toBeDefined();
    });

    it('should have dark mode variants', () => {
      expect(shorthands['glass-dark']).toBeDefined();
      expect(shorthands['glass-dark-heavy']).toBeDefined();
    });

    it('should return class arrays', () => {
      Object.values(shorthands).forEach(classes => {
        expect(Array.isArray(classes)).toBe(true);
        expect(classes.length).toBeGreaterThan(0);
      });
    });

    it('should have consistent structure', () => {
      Object.entries(shorthands).forEach(([key, classes]) => {
        expect(typeof key).toBe('string');
        expect(Array.isArray(classes)).toBe(true);
        classes.forEach(cls => {
          expect(typeof cls).toBe('string');
        });
      });
    });

    it('should match getGlassClasses output', () => {
      const mediumClasses = getGlassClasses(GlassIntensity.MEDIUM, false);
      const shorthandClasses = shorthands['glass-medium'];
      expect(shorthandClasses).toEqual(mediumClasses);
    });
  });

  describe('Browser Compatibility', () => {
    const css = generateGlassmorphismCSS();

    it('should include -webkit- prefixes', () => {
      expect(css).toContain('-webkit-backdrop-filter');
    });

    it('should include standard properties', () => {
      expect(css).toContain('backdrop-filter:');
    });

    it('should have fallback styles', () => {
      expect(css).toContain('@supports not (backdrop-filter');
    });

    it('should provide reasonable fallbacks', () => {
      // Fallback should use solid colors
      const fallbackSection = css.substring(css.indexOf('@supports not'));
      expect(fallbackSection).toContain('background');
    });
  });

  describe('Performance', () => {
    it('should generate CSS efficiently', () => {
      const start = performance.now();
      generateGlassmorphismCSS();
      const end = performance.now();
      
      // Should be very fast (< 10ms)
      expect(end - start).toBeLessThan(10);
    });

    it('should generate classes efficiently', () => {
      const start = performance.now();
      for (let i = 0; i < 1000; i++) {
        getGlassClasses(GlassIntensity.MEDIUM, false);
      }
      const end = performance.now();
      
      // Should handle 1000 calls quickly (< 50ms)
      expect(end - start).toBeLessThan(50);
    });
  });
});
