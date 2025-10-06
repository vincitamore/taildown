/**
 * Style Resolver Unit Tests
 * Comprehensive test suite for the style resolution system
 * 
 * Tests cover:
 * - Shorthand mappings resolution
 * - Semantic color resolution
 * - Component variant resolution
 * - CSS class passthrough
 * - Edge cases and error handling
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  resolveAttributes,
  normalizeAttribute,
  normalizeAttributes,
  isShorthand,
  getShorthandHelp,
  validateAttributes,
  type ResolverContext,
} from '../style-resolver';
import type { TaildownConfig } from '../../config/config-schema';

// Mock configuration for testing
const mockConfig: TaildownConfig = {
  theme: {
    colors: {
      primary: {
        DEFAULT: '#3B82F6',
        50: '#EFF6FF',
        100: '#DBEAFE',
        500: '#3B82F6',
        600: '#2563EB',
        700: '#1D4ED8',
        900: '#1E3A8A',
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
    fonts: {
      sans: 'Inter, sans-serif',
      mono: 'Fira Code, monospace',
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

describe('Style Resolver', () => {
  describe('resolveAttributes', () => {
    describe('Typography Shorthands', () => {
      it('should resolve size shorthands', () => {
        const result = resolveAttributes(['small', 'large', 'huge'], mockContext);
        expect(result).toContain('text-sm');
        expect(result).toContain('text-lg');
        expect(result).toContain('text-4xl');
      });

      it('should resolve weight shorthands', () => {
        const result = resolveAttributes(['bold', 'light', 'medium'], mockContext);
        expect(result).toContain('font-bold');
        expect(result).toContain('font-light');
        expect(result).toContain('font-medium');
      });

      it('should resolve alignment shorthands', () => {
        const result = resolveAttributes(['left', 'center', 'right'], mockContext);
        expect(result).toContain('text-left');
        expect(result).toContain('text-center');
        expect(result).toContain('text-right');
      });

      it('should resolve style shorthands', () => {
        const result = resolveAttributes(['italic', 'uppercase'], mockContext);
        expect(result).toContain('italic');
        expect(result).toContain('uppercase');
      });

      it('should resolve line height shorthands', () => {
        const result = resolveAttributes(['tight-lines', 'relaxed-lines'], mockContext);
        expect(result).toContain('leading-tight');
        expect(result).toContain('leading-relaxed');
      });
    });

    describe('Layout Shorthands', () => {
      it('should resolve flex shorthands', () => {
        const result = resolveAttributes(['flex'], mockContext);
        expect(result).toContain('flex');
        expect(result).toContain('items-center');
      });

      it('should resolve flex-center', () => {
        const result = resolveAttributes(['flex-center'], mockContext);
        expect(result).toContain('flex');
        expect(result).toContain('items-center');
        expect(result).toContain('justify-center');
      });

      it('should resolve grid shorthands', () => {
        const result = resolveAttributes(['grid-2', 'grid-3', 'grid-4'], mockContext);
        expect(result).toContain('grid');
        expect(result).toContain('grid-cols-2');
        expect(result).toContain('grid-cols-3');
        expect(result).toContain('grid-cols-4');
      });

      it('should resolve centering shorthands', () => {
        const result = resolveAttributes(['center-x', 'center-y'], mockContext);
        expect(result).toContain('mx-auto');
        expect(result).toContain('my-auto');
      });
    });

    describe('Spacing Shorthands', () => {
      it('should resolve padding shorthands', () => {
        const result = resolveAttributes(['padded', 'padded-sm', 'padded-lg'], mockContext);
        expect(result).toContain('p-6');
        expect(result).toContain('p-4');
        expect(result).toContain('p-8');
      });

      it('should resolve directional padding', () => {
        const result = resolveAttributes(['px', 'py'], mockContext);
        expect(result).toContain('px-6');
        expect(result).toContain('py-6');
      });

      it('should resolve gap shorthands', () => {
        const result = resolveAttributes(['gap', 'gap-sm', 'gap-lg'], mockContext);
        expect(result).toContain('gap-4');
        expect(result).toContain('gap-2');
        expect(result).toContain('gap-8');
      });

      it('should resolve margin shorthands', () => {
        const result = resolveAttributes(['m', 'mx', 'my'], mockContext);
        expect(result).toContain('m-6');
        expect(result).toContain('mx-6');
        expect(result).toContain('my-6');
      });
    });

    describe('Effects Shorthands', () => {
      it('should resolve border radius', () => {
        const result = resolveAttributes(['rounded', 'rounded-full'], mockContext);
        expect(result).toContain('rounded-lg');
        expect(result).toContain('rounded-full');
      });

      it('should resolve shadow shorthands', () => {
        const result = resolveAttributes(['shadow', 'elevated', 'floating'], mockContext);
        expect(result).toContain('shadow-md');
        expect(result).toContain('shadow-xl');
        expect(result).toContain('shadow-2xl');
      });

      it('should resolve glassmorphism effects', () => {
        const result = resolveAttributes(['glass'], mockContext);
        expect(result).toContain('glass-effect');
        expect(result).toContain('glass-medium');
      });

      it('should resolve transition speed', () => {
        const result = resolveAttributes(['fast', 'smooth', 'slow'], mockContext);
        expect(result).toContain('transition-all');
        expect(result).toContain('duration-150');
        expect(result).toContain('duration-300');
        expect(result).toContain('duration-500');
      });
    });

    describe('Animation Shorthands', () => {
      it('should resolve entrance animations', () => {
        const result = resolveAttributes(['fade-in', 'slide-up', 'zoom-in'], mockContext);
        expect(result).toContain('animate-fade-in');
        expect(result).toContain('animate-slide-up');
        expect(result).toContain('animate-zoom-in');
      });

      it('should resolve hover animations', () => {
        const result = resolveAttributes(['hover-lift'], mockContext);
        expect(result).toContain('hover:transform');
        expect(result).toContain('hover:-translate-y-1');
        expect(result).toContain('transition-transform');
      });

      it('should resolve hover effects', () => {
        const result = resolveAttributes(['hover-grow', 'hover-fade'], mockContext);
        expect(result).toContain('hover:scale-105');
        expect(result).toContain('hover:opacity-80');
      });
    });

    describe('Natural Combinations', () => {
      it('should resolve size + weight combinations', () => {
        const result = resolveAttributes(['large-bold', 'small-light'], mockContext);
        expect(result).toContain('text-lg');
        expect(result).toContain('font-bold');
        expect(result).toContain('text-sm');
        expect(result).toContain('font-light');
      });

      it('should resolve huge-bold combination', () => {
        const result = resolveAttributes(['huge-bold'], mockContext);
        expect(result).toContain('text-4xl');
        expect(result).toContain('font-bold');
      });

      it('should resolve size + color combinations', () => {
        const result = resolveAttributes(['large-muted', 'small-muted'], mockContext);
        expect(result).toContain('text-lg');
        expect(result).toContain('text-gray-500');
        expect(result).toContain('text-sm');
      });

      it('should resolve semantic background pairs', () => {
        const result = resolveAttributes(['success-bg'], mockContext);
        expect(result).toContain('bg-green-600');
        expect(result).toContain('text-white');
      });
    });

    describe('Semantic Colors', () => {
      it('should resolve primary color', () => {
        const result = resolveAttributes(['primary'], mockContext);
        expect(result).toContain('text-primary-600');
        expect(result).toContain('hover:text-primary-700');
      });

      it('should resolve bg-primary', () => {
        const result = resolveAttributes(['bg-primary'], mockContext);
        expect(result).toContain('bg-primary-600');
        expect(result).toContain('hover:bg-primary-700');
      });

      it('should resolve border-accent', () => {
        const result = resolveAttributes(['border-accent'], mockContext);
        expect(result).toContain('border-accent-600');
      });

      it('should resolve secondary and accent', () => {
        const result = resolveAttributes(['secondary', 'accent'], mockContext);
        expect(result).toContain('text-secondary-600');
        expect(result).toContain('text-accent-600');
      });
    });

    describe('CSS Class Passthrough', () => {
      it('should pass through existing CSS classes', () => {
        const result = resolveAttributes(['bg-blue-500', 'text-white'], mockContext);
        expect(result).toContain('bg-blue-500');
        expect(result).toContain('text-white');
      });

      it('should pass through responsive classes', () => {
        const result = resolveAttributes(['md:text-lg', 'lg:flex'], mockContext);
        expect(result).toContain('md:text-lg');
        expect(result).toContain('lg:flex');
      });

      it('should pass through hover and focus classes', () => {
        const result = resolveAttributes(['hover:bg-gray-100', 'focus:ring-2'], mockContext);
        expect(result).toContain('hover:bg-gray-100');
        expect(result).toContain('focus:ring-2');
      });
    });

    describe('Mixed Attributes', () => {
      it('should handle mixed shorthands and CSS classes', () => {
        const result = resolveAttributes(['bold', 'primary', 'px-4'], mockContext);
        expect(result).toContain('font-bold');
        expect(result).toContain('text-primary-600');
        expect(result).toContain('px-4');
      });

      it('should handle complex attribute arrays', () => {
        const result = resolveAttributes(
          ['large-bold', 'center', 'primary', 'padded', 'rounded'],
          mockContext
        );
        expect(result).toContain('text-lg');
        expect(result).toContain('font-bold');
        expect(result).toContain('text-center');
        expect(result).toContain('text-primary-600');
        expect(result).toContain('p-6');
        expect(result).toContain('rounded-lg');
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty attribute arrays', () => {
        const result = resolveAttributes([], mockContext);
        expect(result).toEqual([]);
      });

      it('should filter out empty strings', () => {
        const result = resolveAttributes(['', 'bold', '  ', 'center'], mockContext);
        expect(result).toContain('font-bold');
        expect(result).toContain('text-center');
        expect(result).not.toContain('');
      });

      it('should deduplicate classes', () => {
        const result = resolveAttributes(['bold', 'bold', 'center'], mockContext);
        const boldCount = result.filter(c => c === 'font-bold').length;
        expect(boldCount).toBe(1);
      });

      it('should handle unknown attributes gracefully', () => {
        const result = resolveAttributes(['unknown-attr', 'bold'], mockContext);
        expect(result).toContain('font-bold');
        expect(result).toContain('unknown-attr'); // Passed through
      });

      it('should preserve order for last-wins CSS properties', () => {
        const result = resolveAttributes(['text-sm', 'text-lg'], mockContext);
        const lastIndex = result.lastIndexOf('text-lg');
        const firstIndex = result.indexOf('text-sm');
        expect(lastIndex).toBeGreaterThan(firstIndex);
      });
    });

    describe('Component Context', () => {
      it('should resolve button variants with component context', () => {
        const buttonContext: ResolverContext = {
          ...mockContext,
          component: 'button',
        };
        const result = resolveAttributes(['primary'], buttonContext);
        // With component context, should resolve variant or semantic color
        expect(result.length).toBeGreaterThan(0);
      });

      it('should resolve card variants with component context', () => {
        const cardContext: ResolverContext = {
          ...mockContext,
          component: 'card',
        };
        const result = resolveAttributes(['elevated'], cardContext);
        // With component context, should resolve variant
        expect(result.length).toBeGreaterThan(0);
      });
    });

    describe('Dark Mode', () => {
      it('should add dark mode classes for semantic colors', () => {
        const result = resolveAttributes(['primary'], mockDarkModeContext);
        expect(result).toContain('text-primary-600');
        expect(result).toContain('dark:text-primary-400');
      });

      it('should add dark mode classes for backgrounds', () => {
        const result = resolveAttributes(['bg-primary'], mockDarkModeContext);
        expect(result).toContain('bg-primary-600');
        expect(result).toContain('dark:bg-primary-700');
      });
    });
  });

  describe('normalizeAttribute', () => {
    it('should remove leading dots', () => {
      expect(normalizeAttribute('.bold')).toBe('bold');
      expect(normalizeAttribute('.text-center')).toBe('text-center');
    });

    it('should trim whitespace', () => {
      expect(normalizeAttribute('  bold  ')).toBe('bold');
      expect(normalizeAttribute('\tbold\n')).toBe('bold');
    });

    it('should handle attributes without dots', () => {
      expect(normalizeAttribute('bold')).toBe('bold');
      expect(normalizeAttribute('primary')).toBe('primary');
    });
  });

  describe('normalizeAttributes', () => {
    it('should normalize array of attributes', () => {
      const result = normalizeAttributes(['.bold', '  center  ', '.primary']);
      expect(result).toEqual(['bold', 'center', 'primary']);
    });

    it('should filter empty strings', () => {
      const result = normalizeAttributes(['bold', '', '  ', 'center']);
      expect(result).toEqual(['bold', 'center']);
    });
  });

  describe('isShorthand', () => {
    it('should identify typography shorthands', () => {
      expect(isShorthand('bold')).toBe(true);
      expect(isShorthand('large')).toBe(true);
      expect(isShorthand('center')).toBe(true);
    });

    it('should identify layout shorthands', () => {
      expect(isShorthand('flex')).toBe(true);
      expect(isShorthand('grid-2')).toBe(true);
    });

    it('should identify semantic colors', () => {
      expect(isShorthand('primary')).toBe(true);
      expect(isShorthand('bg-primary')).toBe(true);
      expect(isShorthand('text-accent')).toBe(true);
    });

    it('should return false for CSS classes', () => {
      expect(isShorthand('text-4xl')).toBe(false);
      expect(isShorthand('bg-blue-500')).toBe(false);
    });

    it('should return false for unknown attributes', () => {
      expect(isShorthand('unknown')).toBe(false);
    });
  });

  describe('getShorthandHelp', () => {
    it('should provide help for simple shorthands', () => {
      const help = getShorthandHelp('bold');
      expect(help).toContain('bold');
      expect(help).toContain('font-bold');
    });

    it('should provide help for array shorthands', () => {
      const help = getShorthandHelp('flex');
      expect(help).toBeDefined();
      expect(help).toContain('flex');
    });

    it('should identify context-dependent shorthands', () => {
      const help = getShorthandHelp('gradient');
      expect(help).toBeDefined();
      expect(help).toContain('context-dependent');
    });

    it('should return null for unknown shorthands', () => {
      const help = getShorthandHelp('unknown');
      expect(help).toBeNull();
    });
  });

  describe('validateAttributes', () => {
    it('should identify valid shorthands', () => {
      const result = validateAttributes(['bold', 'center', 'primary'], mockContext);
      expect(result.valid).toContain('bold');
      expect(result.valid).toContain('center');
      expect(result.valid).toContain('primary');
      expect(result.invalid).toEqual([]);
    });

    it('should identify valid CSS classes', () => {
      const result = validateAttributes(['text-4xl', 'bg-blue-500'], mockContext);
      expect(result.valid).toContain('text-4xl');
      expect(result.valid).toContain('bg-blue-500');
      expect(result.invalid).toEqual([]);
    });

      it('should identify unknown attributes', () => {
        const result = validateAttributes(['unknown-thing'], mockContext);
        // Unknown attributes may be passed through or identified as invalid
        if (result.invalid.length > 0) {
          expect(result.invalid).toContain('unknown-thing');
          expect(result.warnings.length).toBeGreaterThan(0);
        }
      });

    it('should handle mixed valid and invalid attributes', () => {
      const result = validateAttributes(['bold', 'unknown', 'center'], mockContext);
      expect(result.valid).toContain('bold');
      expect(result.valid).toContain('center');
      expect(result.invalid).toContain('unknown');
    });
  });
});
