/**
 * Shorthand Mappings Unit Tests
 * Tests all 120+ shorthand mappings
 */

import { describe, it, expect } from 'vitest';
import {
  SHORTHAND_MAPPINGS,
  getAllShorthands,
  getShorthandsByCategory,
  hasShorthand,
  getShorthand,
  type ShorthandMapping,
} from '../shorthand-mappings';

describe('Shorthand Mappings', () => {
  describe('SHORTHAND_MAPPINGS', () => {
    it('should have all required typography size shorthands', () => {
      expect(SHORTHAND_MAPPINGS.xs).toBe('text-xs');
      expect(SHORTHAND_MAPPINGS.small).toBe('text-sm');
      expect(SHORTHAND_MAPPINGS.base).toBe('text-base');
      expect(SHORTHAND_MAPPINGS.large).toBe('text-lg');
      expect(SHORTHAND_MAPPINGS.xl).toBe('text-xl');
      expect(SHORTHAND_MAPPINGS['2xl']).toBe('text-2xl');
      expect(SHORTHAND_MAPPINGS['3xl']).toBe('text-3xl');
      expect(SHORTHAND_MAPPINGS['4xl']).toBe('text-4xl');
      expect(SHORTHAND_MAPPINGS['5xl']).toBe('text-5xl');
      expect(SHORTHAND_MAPPINGS['6xl']).toBe('text-6xl');
      expect(SHORTHAND_MAPPINGS.huge).toBe('text-4xl');
      expect(SHORTHAND_MAPPINGS.massive).toBe('text-6xl');
    });

    it('should have all font weight shorthands', () => {
      expect(SHORTHAND_MAPPINGS.thin).toBe('font-thin');
      expect(SHORTHAND_MAPPINGS['extra-light']).toBe('font-extralight');
      expect(SHORTHAND_MAPPINGS.light).toBe('font-light');
      expect(SHORTHAND_MAPPINGS.normal).toBe('font-normal');
      expect(SHORTHAND_MAPPINGS.medium).toBe('font-medium');
      expect(SHORTHAND_MAPPINGS.semibold).toBe('font-semibold');
      expect(SHORTHAND_MAPPINGS.bold).toBe('font-bold');
      expect(SHORTHAND_MAPPINGS['extra-bold']).toBe('font-extrabold');
      expect(SHORTHAND_MAPPINGS.black).toBe('font-black');
    });

    it('should have all alignment shorthands', () => {
      expect(SHORTHAND_MAPPINGS.left).toBe('text-left');
      expect(SHORTHAND_MAPPINGS.center).toBe('text-center');
      expect(SHORTHAND_MAPPINGS.right).toBe('text-right');
      expect(SHORTHAND_MAPPINGS.justify).toBe('text-justify');
    });

    it('should have text style shorthands', () => {
      expect(SHORTHAND_MAPPINGS.italic).toBe('italic');
      expect(SHORTHAND_MAPPINGS.uppercase).toBe('uppercase');
      expect(SHORTHAND_MAPPINGS.lowercase).toBe('lowercase');
      expect(SHORTHAND_MAPPINGS.capitalize).toBe('capitalize');
    });

    it('should have line height shorthands following plain English grammar', () => {
      expect(SHORTHAND_MAPPINGS['tight-lines']).toBe('leading-tight');
      expect(SHORTHAND_MAPPINGS['normal-lines']).toBe('leading-normal');
      expect(SHORTHAND_MAPPINGS['relaxed-lines']).toBe('leading-relaxed');
      expect(SHORTHAND_MAPPINGS['loose-lines']).toBe('leading-loose');
    });

    it('should have flex layout shorthands', () => {
      expect(SHORTHAND_MAPPINGS.flex).toEqual(['flex', 'items-center']);
      expect(SHORTHAND_MAPPINGS['flex-col']).toEqual(['flex', 'flex-col']);
      expect(SHORTHAND_MAPPINGS['flex-row']).toEqual(['flex', 'flex-row']);
      expect(SHORTHAND_MAPPINGS['flex-wrap']).toEqual(['flex', 'flex-wrap']);
      expect(SHORTHAND_MAPPINGS['flex-center']).toEqual(['flex', 'items-center', 'justify-center']);
    });

    it('should have grid shorthands', () => {
      expect(SHORTHAND_MAPPINGS['grid-1']).toEqual(['grid', 'grid-cols-1']);
      expect(SHORTHAND_MAPPINGS['grid-2']).toEqual(['grid', 'grid-cols-2']);
      expect(SHORTHAND_MAPPINGS['grid-3']).toEqual(['grid', 'grid-cols-3']);
      expect(SHORTHAND_MAPPINGS['grid-4']).toEqual(['grid', 'grid-cols-4']);
      expect(SHORTHAND_MAPPINGS['grid-5']).toEqual(['grid', 'grid-cols-5']);
      expect(SHORTHAND_MAPPINGS['grid-6']).toEqual(['grid', 'grid-cols-6']);
    });

    it('should have centering shorthands', () => {
      expect(SHORTHAND_MAPPINGS['center-x']).toBe('mx-auto');
      expect(SHORTHAND_MAPPINGS['center-y']).toBe('my-auto');
      expect(SHORTHAND_MAPPINGS['center-both']).toEqual(['mx-auto', 'my-auto']);
    });

    it('should have padding shorthands', () => {
      expect(SHORTHAND_MAPPINGS['padded-xs']).toBe('p-2');
      expect(SHORTHAND_MAPPINGS['padded-sm']).toBe('p-4');
      expect(SHORTHAND_MAPPINGS.padded).toBe('p-6');
      expect(SHORTHAND_MAPPINGS['padded-lg']).toBe('p-8');
      expect(SHORTHAND_MAPPINGS['padded-xl']).toBe('p-12');
      expect(SHORTHAND_MAPPINGS['padded-2xl']).toBe('p-16');
    });

    it('should have directional padding shorthands', () => {
      expect(SHORTHAND_MAPPINGS['px-sm']).toBe('px-4');
      expect(SHORTHAND_MAPPINGS.px).toBe('px-6');
      expect(SHORTHAND_MAPPINGS['px-lg']).toBe('px-8');
      expect(SHORTHAND_MAPPINGS['py-sm']).toBe('py-4');
      expect(SHORTHAND_MAPPINGS.py).toBe('py-6');
      expect(SHORTHAND_MAPPINGS['py-lg']).toBe('py-8');
    });

    it('should have margin shorthands', () => {
      expect(SHORTHAND_MAPPINGS['m-sm']).toBe('m-4');
      expect(SHORTHAND_MAPPINGS.m).toBe('m-6');
      expect(SHORTHAND_MAPPINGS['m-lg']).toBe('m-8');
    });

    it('should have gap shorthands', () => {
      expect(SHORTHAND_MAPPINGS['gap-xs']).toBe('gap-1');
      expect(SHORTHAND_MAPPINGS['gap-sm']).toBe('gap-2');
      expect(SHORTHAND_MAPPINGS.gap).toBe('gap-4');
      expect(SHORTHAND_MAPPINGS['gap-lg']).toBe('gap-8');
      expect(SHORTHAND_MAPPINGS['gap-xl']).toBe('gap-12');
    });

    it('should have border radius shorthands', () => {
      expect(SHORTHAND_MAPPINGS['rounded-none']).toBe('rounded-none');
      expect(SHORTHAND_MAPPINGS['rounded-sm']).toBe('rounded-md');
      expect(SHORTHAND_MAPPINGS.rounded).toBe('rounded-lg');
      expect(SHORTHAND_MAPPINGS['rounded-lg']).toBe('rounded-lg');
      expect(SHORTHAND_MAPPINGS['rounded-xl']).toBe('rounded-xl');
      expect(SHORTHAND_MAPPINGS['rounded-2xl']).toBe('rounded-2xl');
      expect(SHORTHAND_MAPPINGS['rounded-full']).toBe('rounded-full');
    });

    it('should have shadow shorthands', () => {
      expect(SHORTHAND_MAPPINGS.shadow).toBe('shadow-md');
      expect(SHORTHAND_MAPPINGS['shadow-sm']).toBe('shadow-sm');
      expect(SHORTHAND_MAPPINGS['shadow-lg']).toBe('shadow-lg');
      expect(SHORTHAND_MAPPINGS.elevated).toBe('shadow-xl');
      expect(SHORTHAND_MAPPINGS.floating).toBe('shadow-2xl');
    });

    it('should have glassmorphism shorthands', () => {
      const glass = SHORTHAND_MAPPINGS.glass;
      expect(Array.isArray(glass)).toBe(true);
      if (Array.isArray(glass)) {
        expect(glass).toContain('glass-effect');
        expect(glass).toContain('glass-medium');
      }

      const subtleGlass = SHORTHAND_MAPPINGS['subtle-glass'];
      expect(Array.isArray(subtleGlass)).toBe(true);
      if (Array.isArray(subtleGlass)) {
        expect(subtleGlass).toContain('glass-subtle');
      }
    });

    it('should have animation shorthands', () => {
      expect(SHORTHAND_MAPPINGS['fade-in']).toBe('animate-fade-in');
      expect(SHORTHAND_MAPPINGS['slide-up']).toBe('animate-slide-up');
      expect(SHORTHAND_MAPPINGS['slide-down']).toBe('animate-slide-down');
      expect(SHORTHAND_MAPPINGS['zoom-in']).toBe('animate-zoom-in');
      expect(SHORTHAND_MAPPINGS['hover-scale']).toBe('hover-scale');
    });

    it('should have transition speed shorthands', () => {
      expect(SHORTHAND_MAPPINGS.instant).toEqual(['transition-none']);
      expect(SHORTHAND_MAPPINGS.fast).toEqual(['transition-all', 'duration-150']);
      expect(SHORTHAND_MAPPINGS.smooth).toEqual(['transition-all', 'duration-300', 'ease-out']);
      expect(SHORTHAND_MAPPINGS.slow).toEqual(['transition-all', 'duration-500']);
    });

    it('should have hover effect shorthands', () => {
      const hoverLift = SHORTHAND_MAPPINGS['hover-lift'];
      expect(Array.isArray(hoverLift)).toBe(true);
      if (Array.isArray(hoverLift)) {
        expect(hoverLift).toContain('hover:transform');
        expect(hoverLift).toContain('hover:-translate-y-1');
        expect(hoverLift).toContain('transition-transform');
      }

      const hoverGrow = SHORTHAND_MAPPINGS['hover-grow'];
      expect(Array.isArray(hoverGrow)).toBe(true);
      if (Array.isArray(hoverGrow)) {
        expect(hoverGrow).toContain('hover:scale-105');
      }
    });

    it('should have semantic state colors', () => {
      expect(SHORTHAND_MAPPINGS.muted).toBe('text-gray-500');
      expect(SHORTHAND_MAPPINGS.success).toBe('text-green-600');
      expect(SHORTHAND_MAPPINGS.warning).toBe('text-yellow-600');
      expect(SHORTHAND_MAPPINGS.error).toBe('text-red-600');
      expect(SHORTHAND_MAPPINGS.info).toBe('text-blue-600');
    });

    it('should have natural combination shorthands', () => {
      expect(SHORTHAND_MAPPINGS['large-bold']).toEqual(['text-lg', 'font-bold']);
      expect(SHORTHAND_MAPPINGS['huge-bold']).toEqual(['text-4xl', 'font-bold']);
      expect(SHORTHAND_MAPPINGS['small-bold']).toEqual(['text-sm', 'font-bold']);
      expect(SHORTHAND_MAPPINGS['small-light']).toEqual(['text-sm', 'font-light']);
      expect(SHORTHAND_MAPPINGS['large-light']).toEqual(['text-lg', 'font-light']);
    });

    it('should have size + color combinations', () => {
      expect(SHORTHAND_MAPPINGS['large-muted']).toEqual(['text-lg', 'text-gray-500']);
      expect(SHORTHAND_MAPPINGS['small-muted']).toEqual(['text-sm', 'text-gray-500']);
    });

    it('should have semantic background pairs', () => {
      expect(SHORTHAND_MAPPINGS['primary-bg']).toEqual(['bg-blue-600', 'text-white']);
      expect(SHORTHAND_MAPPINGS['success-bg']).toEqual(['bg-green-600', 'text-white']);
      expect(SHORTHAND_MAPPINGS['warning-bg']).toEqual(['bg-yellow-600', 'text-white']);
      expect(SHORTHAND_MAPPINGS['error-bg']).toEqual(['bg-red-600', 'text-white']);
      expect(SHORTHAND_MAPPINGS['muted-bg']).toEqual(['bg-gray-100', 'text-gray-700']);
    });

    it('should have context-dependent mappings (functions)', () => {
      expect(typeof SHORTHAND_MAPPINGS.gradient).toBe('function');
      expect(typeof SHORTHAND_MAPPINGS.glow).toBe('function');
      expect(typeof SHORTHAND_MAPPINGS['hover-glow']).toBe('function');
    });

    it('should have display shorthands', () => {
      expect(SHORTHAND_MAPPINGS.block).toBe('block');
      expect(SHORTHAND_MAPPINGS.inline).toBe('inline');
      expect(SHORTHAND_MAPPINGS['inline-block']).toBe('inline-block');
      expect(SHORTHAND_MAPPINGS.hidden).toBe('hidden');
      expect(SHORTHAND_MAPPINGS.visible).toBe('visible');
    });

    it('should have position shorthands', () => {
      expect(SHORTHAND_MAPPINGS.relative).toBe('relative');
      expect(SHORTHAND_MAPPINGS.absolute).toBe('absolute');
      expect(SHORTHAND_MAPPINGS.fixed).toBe('fixed');
      expect(SHORTHAND_MAPPINGS.sticky).toBe('sticky');
    });

    it('should have cursor shorthands', () => {
      expect(SHORTHAND_MAPPINGS.pointer).toBe('cursor-pointer');
      expect(SHORTHAND_MAPPINGS['not-allowed']).toBe('cursor-not-allowed');
      expect(SHORTHAND_MAPPINGS.wait).toBe('cursor-wait');
    });

    it('should have z-index shorthands', () => {
      expect(SHORTHAND_MAPPINGS['z-0']).toBe('z-0');
      expect(SHORTHAND_MAPPINGS['z-10']).toBe('z-10');
      expect(SHORTHAND_MAPPINGS['z-20']).toBe('z-20');
      expect(SHORTHAND_MAPPINGS['z-30']).toBe('z-30');
      expect(SHORTHAND_MAPPINGS['z-40']).toBe('z-40');
      expect(SHORTHAND_MAPPINGS['z-50']).toBe('z-50');
    });
  });

  describe('getAllShorthands', () => {
    it('should return all shorthand names', () => {
      const shorthands = getAllShorthands();
      expect(Array.isArray(shorthands)).toBe(true);
      expect(shorthands.length).toBeGreaterThan(120);
      expect(shorthands).toContain('bold');
      expect(shorthands).toContain('muted'); // 'primary' is semantic color, not shorthand
      expect(shorthands).toContain('large-bold');
    });

    it('should not contain duplicate entries', () => {
      const shorthands = getAllShorthands();
      const uniqueShorthands = [...new Set(shorthands)];
      expect(shorthands.length).toBe(uniqueShorthands.length);
    });
  });

  describe('getShorthandsByCategory', () => {
    it('should return categorized shorthands', () => {
      const categories = getShorthandsByCategory();
      expect(categories).toBeDefined();
      expect(categories.typography).toBeDefined();
      expect(categories.layout).toBeDefined();
      expect(categories.spacing).toBeDefined();
      expect(categories.effects).toBeDefined();
      expect(categories.interactions).toBeDefined();
      expect(categories.colors).toBeDefined();
    });

    it('should have correct typography shorthands', () => {
      const categories = getShorthandsByCategory();
      expect(categories.typography).toContain('bold');
      expect(categories.typography).toContain('large');
      expect(categories.typography).toContain('small');
    });

    it('should have correct layout shorthands', () => {
      const categories = getShorthandsByCategory();
      expect(categories.layout).toContain('flex');
      expect(categories.layout).toContain('grid-2');
      expect(categories.layout).toContain('flex-center');
    });

    it('should have correct spacing shorthands', () => {
      const categories = getShorthandsByCategory();
      expect(categories.spacing).toContain('padded');
      expect(categories.spacing).toContain('gap');
    });

    it('should have correct effects shorthands', () => {
      const categories = getShorthandsByCategory();
      expect(categories.effects).toContain('rounded');
      expect(categories.effects).toContain('shadow');
      expect(categories.effects).toContain('glass');
    });
  });

  describe('hasShorthand', () => {
    it('should return true for existing shorthands', () => {
      expect(hasShorthand('bold')).toBe(true);
      expect(hasShorthand('large')).toBe(true);
      expect(hasShorthand('muted')).toBe(true); // 'primary' is semantic color
      expect(hasShorthand('flex-center')).toBe(true);
    });

    it('should return false for non-existent shorthands', () => {
      expect(hasShorthand('unknown')).toBe(false);
      expect(hasShorthand('not-a-shorthand')).toBe(false);
    });
  });

  describe('getShorthand', () => {
    it('should return mapping for existing shorthands', () => {
      expect(getShorthand('bold')).toBe('font-bold');
      expect(getShorthand('flex')).toEqual(['flex', 'items-center']);
    });

    it('should return undefined for non-existent shorthands', () => {
      expect(getShorthand('unknown')).toBeUndefined();
    });

    it('should return function for context-dependent shorthands', () => {
      const mapping = getShorthand('gradient');
      expect(typeof mapping).toBe('function');
    });
  });

  describe('Plain English Grammar Compliance', () => {
    it('should follow adjective-noun order, not CSS property-value', () => {
      // Correct: large-text, bold-primary
      // Incorrect: text-large, primary-bold
      expect(SHORTHAND_MAPPINGS['large-bold']).toBeDefined();
      expect(SHORTHAND_MAPPINGS['huge-bold']).toBeDefined();
      expect(SHORTHAND_MAPPINGS['tight-lines']).toBeDefined(); // not "leading-tight" as shorthand

      // Should not have CSS-style ordering
      expect(SHORTHAND_MAPPINGS['text-large']).toBeUndefined();
      expect(SHORTHAND_MAPPINGS['font-large']).toBeUndefined();
    });

    it('should use single descriptive words where possible', () => {
      // Single word shorthands
      expect(SHORTHAND_MAPPINGS.bold).toBeDefined();
      expect(SHORTHAND_MAPPINGS.center).toBeDefined();
      expect(SHORTHAND_MAPPINGS.rounded).toBeDefined();

      // Not compound CSS-style
      expect(SHORTHAND_MAPPINGS['font-bold']).toBeUndefined();
      expect(SHORTHAND_MAPPINGS['text-center']).toBeUndefined();
    });

    it('should use state modifiers first for hover effects', () => {
      // Correct: hover-lift, hover-glow
      expect(SHORTHAND_MAPPINGS['hover-lift']).toBeDefined();
      expect(SHORTHAND_MAPPINGS['hover-glow']).toBeDefined();
      expect(SHORTHAND_MAPPINGS['hover-grow']).toBeDefined();

      // Incorrect: lift-hover (not natural English)
      expect(SHORTHAND_MAPPINGS['lift-hover']).toBeUndefined();
      expect(SHORTHAND_MAPPINGS['glow-hover']).toBeUndefined();
    });
  });

  describe('Coverage', () => {
    it('should have at least 120 shorthands', () => {
      const count = getAllShorthands().length;
      expect(count).toBeGreaterThanOrEqual(120);
    });

    it('should cover all major categories', () => {
      const shorthands = getAllShorthands();
      
      // Typography
      expect(shorthands).toContain('bold');
      expect(shorthands).toContain('large');
      
      // Layout
      expect(shorthands).toContain('flex');
      expect(shorthands).toContain('grid-2');
      
      // Spacing
      expect(shorthands).toContain('padded');
      expect(shorthands).toContain('gap');
      
      // Effects
      expect(shorthands).toContain('rounded');
      expect(shorthands).toContain('shadow');
      expect(shorthands).toContain('glass');
      
      // Animations
      expect(shorthands).toContain('fade-in');
      expect(shorthands).toContain('hover-lift');
      
      // Colors (semantic colors like 'primary' are handled separately)
      expect(shorthands).toContain('muted');
      expect(shorthands).toContain('success');
    });
  });
});
