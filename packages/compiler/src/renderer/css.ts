/**
 * CSS Generator for Taildown
 * Collects classes from AST and generates CSS
 */

import { visit } from 'unist-util-visit';
import type { TaildownRoot, TaildownNodeData } from '@taildown/shared';
import { generateIconCSS } from '../icons/icon-renderer';
import { generateGlassmorphismCSS } from '../themes/glassmorphism';
import { generateAnimationCSS } from '../themes/animations';

/**
 * Tailwind CSS utility class definitions
 * Phase 1: Basic utilities needed for standard components
 */
const TAILWIND_UTILITIES: Record<string, string> = {
  // Padding
  'p-2': 'padding: 0.5rem;',
  'p-3': 'padding: 0.75rem;',
  'p-4': 'padding: 1rem;',
  'p-5': 'padding: 1.25rem;',
  'p-6': 'padding: 1.5rem;',
  'p-8': 'padding: 2rem;',
  'p-10': 'padding: 2.5rem;',
  'p-12': 'padding: 3rem;',
  'px-2': 'padding-left: 0.5rem; padding-right: 0.5rem;',
  'px-3': 'padding-left: 0.75rem; padding-right: 0.75rem;',
  'px-4': 'padding-left: 1rem; padding-right: 1rem;',
  'px-6': 'padding-left: 1.5rem; padding-right: 1.5rem;',
  'px-8': 'padding-left: 2rem; padding-right: 2rem;',
  'px-10': 'padding-left: 2.5rem; padding-right: 2.5rem;',
  'px-12': 'padding-left: 3rem; padding-right: 3rem;',
  'py-0.5': 'padding-top: 0.125rem; padding-bottom: 0.125rem;',
  'py-1': 'padding-top: 0.25rem; padding-bottom: 0.25rem;',
  'py-1.5': 'padding-top: 0.375rem; padding-bottom: 0.375rem;',
  'py-2': 'padding-top: 0.5rem; padding-bottom: 0.5rem;',
  'py-2.5': 'padding-top: 0.625rem; padding-bottom: 0.625rem;',
  'py-3': 'padding-top: 0.75rem; padding-bottom: 0.75rem;',
  'py-4': 'padding-top: 1rem; padding-bottom: 1rem;',
  'py-5': 'padding-top: 1.25rem; padding-bottom: 1.25rem;',
  'py-6': 'padding-top: 1.5rem; padding-bottom: 1.5rem;',
  'pb-4': 'padding-bottom: 1rem;',
  'pt-0': 'padding-top: 0;',

  // Margin
  'mx-auto': 'margin-left: auto; margin-right: auto;',
  'm-4': 'margin: 1rem;',
  'm-6': 'margin: 1.5rem;',
  'mt-6': 'margin-top: 1.5rem;',
  'ml-2': 'margin-left: 0.5rem;',
  '-mb-px': 'margin-bottom: -1px;',

  // Width & Height
  'w-2': 'width: 0.5rem;',
  'w-4': 'width: 1rem;',
  'w-6': 'width: 1.5rem;',
  'w-8': 'width: 2rem;',
  'w-10': 'width: 2.5rem;',
  'w-12': 'width: 3rem;',
  'w-16': 'width: 4rem;',
  'w-20': 'width: 5rem;',
  'w-full': 'width: 100%;',
  'h-2': 'height: 0.5rem;',
  'h-4': 'height: 1rem;',
  'h-6': 'height: 1.5rem;',
  'h-8': 'height: 2rem;',
  'h-10': 'height: 2.5rem;',
  'h-12': 'height: 3rem;',
  'h-16': 'height: 4rem;',
  'h-20': 'height: 5rem;',
  'min-h-[400px]': 'min-height: 400px;',
  'max-h-[90vh]': 'max-height: 90vh;',
  'inset-0': 'top: 0; right: 0; bottom: 0; left: 0;',
  'max-w-6xl': 'max-width: 72rem;',
  'max-w-4xl': 'max-width: 56rem;',
  'max-w-2xl': 'max-width: 42rem;',
  'max-w-screen-2xl': 'max-width: 1536px;',
  'max-w-full': 'max-width: 100%;',
  'min-w-[200px]': 'min-width: 200px;',

  // Display
  grid: 'display: grid;',
  flex: 'display: flex;',
  'inline-flex': 'display: inline-flex;',
  block: 'display: block;',
  'inline-block': 'display: inline-block;',
  
  // Position
  relative: 'position: relative;',
  absolute: 'position: absolute;',
  fixed: 'position: fixed;',
  
  // Z-index
  'z-10': 'z-index: 10;',
  'z-50': 'z-index: 50;',
  
  // Flexbox
  'items-center': 'align-items: center;',
  'items-start': 'align-items: flex-start;',
  'justify-center': 'justify-content: center;',
  'justify-between': 'justify-content: space-between;',
  'justify-start': 'justify-content: flex-start;',
  'flex-col': 'flex-direction: column;',
  'flex-1': 'flex: 1 1 0%;',
  'shrink-0': 'flex-shrink: 0;',
  'flex-shrink-0': 'flex-shrink: 0;',

  // Grid
  'grid-cols-1': 'grid-template-columns: repeat(1, minmax(0, 1fr));',
  'grid-cols-2': 'grid-template-columns: repeat(2, minmax(0, 1fr));',
  'grid-cols-3': 'grid-template-columns: repeat(3, minmax(0, 1fr));',
  'grid-cols-4': 'grid-template-columns: repeat(4, minmax(0, 1fr));',
  'grid-cols-5': 'grid-template-columns: repeat(5, minmax(0, 1fr));',
  'gap-2': 'gap: 0.5rem;',
  'gap-3': 'gap: 0.75rem;',
  'gap-4': 'gap: 1rem;',
  'gap-6': 'gap: 1.5rem;',
  'gap-8': 'gap: 2rem;',

  // Border radius
  rounded: 'border-radius: 0.25rem;',
  'rounded-md': 'border-radius: 0.375rem;',
  'rounded-lg': 'border-radius: 0.5rem;',
  'rounded-xl': 'border-radius: 0.75rem;',
  'rounded-2xl': 'border-radius: 1rem;',
  'rounded-full': 'border-radius: 9999px;',
  'rounded-t-lg': 'border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem;',
  
  // Borders
  border: 'border-width: 1px; border-style: solid;',
  'border-2': 'border-width: 2px; border-style: solid;',
  'border-b': 'border-bottom-width: 1px; border-style: solid;',
  'border-b-2': 'border-bottom-width: 2px; border-style: solid;',
  'border-b-0': 'border-bottom-width: 0;',
  'border-gray-200': 'border-color: rgb(229 231 235);',
  'border-gray-300': 'border-color: rgb(209 213 219);',
  'border-blue-600': 'border-color: rgb(37 99 235);',
  'border-transparent': 'border-color: transparent;',
  'border-gray-200/50': 'border-color: rgb(229 231 235 / 0.5);',
  'border-gray-300/50': 'border-color: rgb(209 213 219 / 0.5);',
  'border-blue-200': 'border-color: rgb(191 219 254);',
  'border-green-200': 'border-color: rgb(187 247 208);',
  'border-amber-200': 'border-color: rgb(253 230 138);',
  'border-red-200': 'border-color: rgb(254 202 202);',
  'border-white/10': 'border-color: rgb(255 255 255 / 0.1);',
  'border-white/20': 'border-color: rgb(255 255 255 / 0.2);',
  'border-white/30': 'border-color: rgb(255 255 255 / 0.3);',
  'border-white/40': 'border-color: rgb(255 255 255 / 0.4);',
  'border-white/50': 'border-color: rgb(255 255 255 / 0.5);',
  'border-white/60': 'border-color: rgb(255 255 255 / 0.6);',
  'shadow-none': 'box-shadow: none;',

  // Shadow
  shadow: 'box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);',
  'shadow-md':
    'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
  'shadow-lg':
    'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
  'shadow-xl':
    'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
  'shadow-2xl':
    'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);',
  'shadow-3xl':
    'box-shadow: 0 35px 60px -15px rgb(0 0 0 / 0.3);',

  // Transitions
  transition:
    'transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'transition-all':
    'transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 150ms;',
  'duration-150': 'transition-duration: 150ms;',
  'duration-200': 'transition-duration: 200ms;',
  'duration-300': 'transition-duration: 300ms;',
  'duration-500': 'transition-duration: 500ms;',
  'ease-in': 'transition-timing-function: cubic-bezier(0.4, 0, 1, 1);',
  'ease-out': 'transition-timing-function: cubic-bezier(0, 0, 0.2, 1);',
  'ease-in-out': 'transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);',

  // Overflow
  'overflow-auto': 'overflow: auto;',
  'overflow-hidden': 'overflow: hidden;',
  'overflow-y-auto': 'overflow-y: auto;',
  
  // Cursor
  'cursor-pointer': 'cursor: pointer;',
  'cursor-default': 'cursor: default;',
  'cursor-not-allowed': 'cursor: not-allowed;',
  
  // Opacity
  'opacity-0': 'opacity: 0;',
  'opacity-50': 'opacity: 0.5;',
  'opacity-100': 'opacity: 1;',
  
  // Focus/Ring States
  'outline-none': 'outline: 2px solid transparent; outline-offset: 2px;',
  'ring-2': 'box-shadow: 0 0 0 2px rgb(59 130 246 / 0.5);',
  'ring-offset-2': 'box-shadow: 0 0 0 2px white, 0 0 0 4px rgb(59 130 246 / 0.5);',
  
  // Transform
  transform: 'transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));',
  'scale-110': 'transform: scale(1.1);',
  'scale-100': 'transform: scale(1);',
  'scale-[1.02]': 'transform: scale(1.02);',
  'rotate-180': 'transform: rotate(180deg);',
  '-translate-y-1/2': 'transform: translateY(-50%);',
  '-translate-x-1/2': 'transform: translateX(-50%);',
  'translate-x-0': 'transform: translateX(0);',
  
  // SVG
  'stroke-current': 'stroke: currentColor;',
  'fill-none': 'fill: none;',
  'fill-current': 'fill: currentColor;',
  
  // Backdrop Filters (for glassmorphism)
  'backdrop-blur-sm': 'backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);',
  'backdrop-blur-md': 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);',
  'backdrop-blur-lg': 'backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);',
  'backdrop-blur-xl': 'backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);',

  // Background - Neutral
  'bg-white': 'background-color: rgb(255 255 255);',
  'bg-gray-50': 'background-color: rgb(249 250 251);',
  'bg-gray-100': 'background-color: rgb(243 244 246);',
  'bg-gray-200': 'background-color: rgb(229 231 235);',
  'bg-gray-300': 'background-color: rgb(209 213 219);',
  'bg-gray-400': 'background-color: rgb(156 163 175);',
  'bg-black': 'background-color: rgb(0 0 0);',
  'bg-opacity-50': 'background-color: rgba(0, 0, 0, 0.5);',
  'bg-gradient-to-br': 'background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));',
  'from-gray-50': '--tw-gradient-from: rgb(249 250 251); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(249 250 251 / 0));',
  'to-gray-100': '--tw-gradient-to: rgb(243 244 246);',
  
  // Background - Blue
  'bg-blue-50': 'background-color: rgb(239 246 255);',
  'bg-blue-100': 'background-color: rgb(219 234 254);',
  'bg-blue-600': 'background-color: rgb(37 99 235);',
  'bg-blue-700': 'background-color: rgb(29 78 216);',
  'bg-blue-800': 'background-color: rgb(30 64 175);',
  
  // Background - Green
  'bg-green-50': 'background-color: rgb(240 253 244);',
  'bg-green-100': 'background-color: rgb(220 252 231);',
  'bg-green-200': 'background-color: rgb(187 247 208);',
  'bg-green-600': 'background-color: rgb(22 163 74);',
  'bg-green-700': 'background-color: rgb(21 128 61);',
  'bg-green-800': 'background-color: rgb(22 101 52);',
  
  // Background - Red
  'bg-red-50': 'background-color: rgb(254 242 242);',
  'bg-red-100': 'background-color: rgb(254 226 226);',
  'bg-red-200': 'background-color: rgb(254 202 202);',
  'bg-red-600': 'background-color: rgb(220 38 38);',
  'bg-red-700': 'background-color: rgb(185 28 28);',
  'bg-red-800': 'background-color: rgb(153 27 27);',
  
  // Background - Amber
  'bg-amber-50': 'background-color: rgb(255 251 235);',
  'bg-amber-100': 'background-color: rgb(254 243 199);',
  'bg-amber-200': 'background-color: rgb(253 230 138);',
  'bg-amber-600': 'background-color: rgb(217 119 6);',
  'bg-amber-700': 'background-color: rgb(180 83 9);',
  'bg-amber-800': 'background-color: rgb(146 64 14);',
  
  // Background - Sky (Light Blue)
  'bg-sky-50': 'background-color: rgb(240 249 255);',
  'bg-sky-100': 'background-color: rgb(224 242 254);',
  'bg-sky-700': 'background-color: rgb(3 105 161);',
  
  // Background - Purple
  'bg-purple-600': 'background-color: rgb(147 51 234);',
  'bg-purple-700': 'background-color: rgb(126 34 206);',
  'bg-purple-800': 'background-color: rgb(107 33 168);',
  
  // Background - Opacity (for glass effects)
  'bg-white/25': 'background-color: rgb(255 255 255 / 0.25);',
  'bg-white/30': 'background-color: rgb(255 255 255 / 0.3);',
  'bg-white/40': 'background-color: rgb(255 255 255 / 0.4);',
  'bg-white/45': 'background-color: rgb(255 255 255 / 0.45);',
  'bg-white/50': 'background-color: rgb(255 255 255 / 0.5);',
  'bg-white/65': 'background-color: rgb(255 255 255 / 0.65);',
  'bg-white/70': 'background-color: rgb(255 255 255 / 0.7);',
  'bg-white/80': 'background-color: rgb(255 255 255 / 0.8);',
  'bg-white/85': 'background-color: rgb(255 255 255 / 0.85);',
  'bg-white/90': 'background-color: rgb(255 255 255 / 0.9);',
  'bg-white/95': 'background-color: rgb(255 255 255 / 0.95);',
  'bg-white/98': 'background-color: rgb(255 255 255 / 0.98);',
  'bg-transparent': 'background-color: transparent;',
  
  // Tinted glass backgrounds (blue-tinted for professional glassmorphism)
  'bg-glass-subtle': 'background-color: rgba(248, 250, 252, 0.9);',
  'bg-glass-light': 'background-color: rgba(241, 245, 249, 0.75);',
  'bg-glass-medium': 'background-color: rgba(226, 232, 240, 0.6);',
  'bg-glass-heavy': 'background-color: rgba(203, 213, 225, 0.4);',

  // Text
  'text-center': 'text-align: center;',
  'text-left': 'text-align: left;',
  'text-right': 'text-align: right;',
  'text-white': 'color: rgb(255 255 255);',
  'whitespace-nowrap': 'white-space: nowrap;',
  
  // Text decoration
  'underline': 'text-decoration: underline;',
  'no-underline': 'text-decoration: none;',

  // Typography
  'text-xs': 'font-size: 0.75rem; line-height: 1rem;',
  'text-sm': 'font-size: 0.875rem; line-height: 1.25rem;',
  'text-base': 'font-size: 1rem; line-height: 1.5rem;',
  'text-lg': 'font-size: 1.125rem; line-height: 1.75rem;',
  'text-xl': 'font-size: 1.25rem; line-height: 1.75rem;',
  'text-2xl': 'font-size: 1.5rem; line-height: 2rem;',
  'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem;',
  'text-4xl': 'font-size: 2.25rem; line-height: 2.5rem;',
  'text-5xl': 'font-size: 3rem; line-height: 1;',
  'text-6xl': 'font-size: 3.75rem; line-height: 1;',
  'font-normal': 'font-weight: 400;',
  'font-medium': 'font-weight: 500;',
  'font-semibold': 'font-weight: 600;',
  'font-bold': 'font-weight: 700;',
  'font-extrabold': 'font-weight: 800;',

  // Text color - Gray scale
  'text-gray-400': 'color: rgb(156 163 175);',
  'text-gray-500': 'color: rgb(107 114 128);',
  'text-gray-600': 'color: rgb(75 85 99);',
  'text-gray-700': 'color: rgb(55 65 81);',
  'text-gray-800': 'color: rgb(31 41 55);',
  'text-gray-900': 'color: rgb(17 24 39);',

  // Text color - Primary (Blue)
  'text-primary-500': 'color: rgb(59 130 246);',
  'text-primary-600': 'color: rgb(37 99 235);',
  'text-primary-700': 'color: rgb(29 78 216);',
  'text-blue-500': 'color: rgb(59 130 246);',
  'text-blue-600': 'color: rgb(37 99 235);',
  'text-blue-700': 'color: rgb(29 78 216);',
  'text-blue-800': 'color: rgb(30 64 175);',
  'text-blue-900': 'color: rgb(30 58 138);',

  // Text color - Secondary (Purple)
  'text-secondary-500': 'color: rgb(168 85 247);',
  'text-secondary-600': 'color: rgb(147 51 234);',
  'text-secondary-700': 'color: rgb(126 34 206);',
  'text-purple-500': 'color: rgb(168 85 247);',
  'text-purple-600': 'color: rgb(147 51 234);',
  'text-purple-700': 'color: rgb(126 34 206);',

  // Text color - Accent (Pink)
  'text-accent-500': 'color: rgb(236 72 153);',
  'text-accent-600': 'color: rgb(219 39 119);',
  'text-accent-700': 'color: rgb(190 24 93);',
  'text-pink-500': 'color: rgb(236 72 153);',
  'text-pink-600': 'color: rgb(219 39 119);',
  'text-pink-700': 'color: rgb(190 24 93);',

  // Text color - Success (Green)
  'text-success-500': 'color: rgb(34 197 94);',
  'text-success-600': 'color: rgb(22 163 74);',
  'text-success-700': 'color: rgb(21 128 61);',
  'text-green-500': 'color: rgb(34 197 94);',
  'text-green-600': 'color: rgb(22 163 74);',
  'text-green-700': 'color: rgb(21 128 61);',
  'text-green-800': 'color: rgb(22 101 52);',
  'text-green-900': 'color: rgb(20 83 45);',

  // Text color - Warning (Yellow/Amber)
  'text-warning-500': 'color: rgb(245 158 11);',
  'text-warning-600': 'color: rgb(217 119 6);',
  'text-warning-700': 'color: rgb(180 83 9);',
  'text-yellow-500': 'color: rgb(234 179 8);',
  'text-yellow-600': 'color: rgb(202 138 4);',
  'text-amber-500': 'color: rgb(245 158 11);',
  'text-amber-600': 'color: rgb(217 119 6);',
  'text-amber-700': 'color: rgb(180 83 9);',
  'text-amber-800': 'color: rgb(146 64 14);',
  'text-amber-900': 'color: rgb(120 53 15);',
  
  // Text color - Info (Sky)
  'text-sky-600': 'color: rgb(2 132 199);',
  'text-sky-700': 'color: rgb(3 105 161);',

  // Text color - Error/Danger (Red)
  'text-error-500': 'color: rgb(239 68 68);',
  'text-error-600': 'color: rgb(220 38 38);',
  'text-error-700': 'color: rgb(185 28 28);',
  'text-red-500': 'color: rgb(239 68 68);',
  'text-red-600': 'color: rgb(220 38 38);',
  'text-red-700': 'color: rgb(185 28 28);',
  'text-red-800': 'color: rgb(153 27 27);',
  'text-red-900': 'color: rgb(127 29 29);',

  // NOTE: Hover states are generated dynamically (see generateCSS function)
  // DO NOT add hover: prefixed classes here - they're handled automatically

  // Leading (line-height)
  'leading-relaxed': 'line-height: 1.625;',
  'leading-loose': 'line-height: 2;',

  // Responsive breakpoints (simplified for Phase 1)
  'sm:px-6': '@media (min-width: 640px) { padding-left: 1.5rem; padding-right: 1.5rem; }',
  'sm:grid-cols-2':
    '@media (min-width: 640px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
  'md:grid-cols-2':
    '@media (min-width: 768px) { grid-template-columns: repeat(2, minmax(0, 1fr)); }',
  'lg:px-8': '@media (min-width: 1024px) { padding-left: 2rem; padding-right: 2rem; }',
  'lg:grid-cols-3':
    '@media (min-width: 1024px) { grid-template-columns: repeat(3, minmax(0, 1fr)); }',
  'xl:px-12': '@media (min-width: 1280px) { padding-left: 3rem; padding-right: 3rem; }',
  'xl:grid-cols-4':
    '@media (min-width: 1280px) { grid-template-columns: repeat(4, minmax(0, 1fr)); }',
  '2xl:grid-cols-5':
    '@media (min-width: 1536px) { grid-template-columns: repeat(5, minmax(0, 1fr)); }',
};

/**
 * Collect all CSS classes used in the AST
 * 
 * @param ast - Taildown AST
 * @returns Set of unique class names
 */
export function collectClasses(ast: TaildownRoot): Set<string> {
  const classes = new Set<string>();

  visit(ast, (node) => {
    if (node.data) {
      const data = node.data as TaildownNodeData;
      if (data.hProperties?.className) {
        for (const className of data.hProperties.className) {
          classes.add(className);
        }
      }
    }
  });

  return classes;
}

/**
 * Collect all CSS classes from HAST (HTML AST)
 * 
 * @param hast - HAST node
 * @returns Set of unique class names
 */
export function collectClassesFromHast(hast: any): Set<string> {
  const classes = new Set<string>();
  
  function traverse(node: any) {
    if (node.properties?.className) {
      const classNames = Array.isArray(node.properties.className)
        ? node.properties.className
        : [node.properties.className];
      for (const className of classNames) {
        // Handle both string and array formats
        if (typeof className === 'string') {
          // Split space-separated classes
          className.split(/\s+/).forEach(cls => {
            if (cls) classes.add(cls);
          });
        }
      }
    }
    
    if (node.children) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  
  traverse(hast);
  return classes;
}

/**
 * Generate CSS from collected classes
 * 
 * @param classes - Set of class names to generate CSS for
 * @param minify - Whether to minify CSS
 * @returns Generated CSS string
 */
export function generateCSS(classes: Set<string>, minify: boolean = false): string {
  const cssRules: string[] = [];

  // Add base reset/normalization
  cssRules.push(`
/* Taildown Generated Styles */
*, ::before, ::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: currentColor;
}

body {
  margin: 0;
  padding: 2rem;
  font-family: system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  font-size: clamp(0.875rem, 0.5vw + 0.75rem, 1.125rem);
  min-height: 100vh;
  /* Clean light background */
  background: #f5f5f7;
  background-attachment: fixed;
}

/* NO overlay - keep it simple */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: none;
  pointer-events: none;
  z-index: 0;
}

/* Default spacing for all direct children of body */
body > * {
  position: relative;
  z-index: 1;
  margin-bottom: 1.5rem;
}

body > *:last-child {
  margin-bottom: 0;
}

/* Add breathing room to components */
.taildown-component {
  margin-bottom: 1.5rem;
}

.taildown-component:last-child {
  margin-bottom: 0;
}

/* ========================================
 * CODE BLOCK STYLING
 * Modern, terminal-inspired code blocks with syntax highlighting support
 * ======================================== */

/* Inline code */
code {
  background-color: rgba(30, 41, 59, 0.05);
  color: rgb(219, 39, 119);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Fira Code', monospace;
  font-size: 0.875em;
  font-weight: 500;
}

/* Code blocks - Terminal-inspired modern design */
pre {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  border-radius: 0.75rem;
  padding: 0;
  margin: 1.5rem 0;
  overflow: hidden;
  box-shadow: 
    0 20px 25px -5px rgba(0, 0, 0, 0.3),
    0 10px 10px -5px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 0 rgba(255, 255, 255, 0.05);
  position: relative;
  font-size: 0.875rem;
  line-height: 1.6;
}

/* Terminal header bar */
pre::before {
  content: '';
  display: block;
  height: 2.5rem;
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
}

/* Terminal traffic lights */
pre::after {
  content: '';
  position: absolute;
  top: 1rem;
  left: 1rem;
  width: 0.75rem;
  height: 0.75rem;
  background: #ef4444;
  border-radius: 50%;
  box-shadow:
    1.25rem 0 0 #f59e0b,
    2.5rem 0 0 #10b981;
}

/* Code inside pre */
pre > code {
  display: block;
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  background: transparent;
  color: #e2e8f0;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'Fira Code', monospace;
  font-size: inherit;
  font-weight: 400;
  line-height: inherit;
  overflow-x: auto;
  border-radius: 0;
  -webkit-overflow-scrolling: touch;
}

/* Scrollbar styling for code blocks */
pre > code::-webkit-scrollbar {
  height: 0.5rem;
}

pre > code::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 0.25rem;
}

pre > code::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 0.25rem;
}

pre > code::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.3);
}

/* Line highlighting */
pre .line-highlight {
  background: rgba(255, 255, 255, 0.05);
  display: inline-block;
  width: 100%;
}

/* ========================================
 * SYNTAX HIGHLIGHTING - One Dark Pro Theme
 * Modern, professional color scheme inspired by VS Code
 * ======================================== */

/* Comments */
pre .token.comment,
pre .token.prolog,
pre .token.doctype,
pre .token.cdata {
  color: #5c6370;
  font-style: italic;
}

/* Strings */
pre .token.string,
pre .token.attr-value {
  color: #98c379;
}

/* Keywords & Control Flow */
pre .token.keyword,
pre .token.control,
pre .token.directive,
pre .token.unit,
pre .token.statement,
pre .token.regex,
pre .token.at-rule {
  color: #c678dd;
  font-weight: 500;
}

/* Functions */
pre .token.function,
pre .token.method,
pre .token.function-name {
  color: #61afef;
}

/* Classes & Types */
pre .token.class-name,
pre .token.type-annotation,
pre .token.type,
pre .token.builtin,
pre .token.maybe-class-name {
  color: #e5c07b;
}

/* Variables & Properties */
pre .token.variable,
pre .token.property,
pre .token.attr-name,
pre .token.constant {
  color: #e06c75;
}

/* Numbers */
pre .token.number,
pre .token.boolean,
pre .token.hexcode {
  color: #d19a66;
}

/* Operators & Punctuation */
pre .token.operator,
pre .token.entity,
pre .token.url,
pre .token.symbol {
  color: #56b6c2;
}

pre .token.punctuation,
pre .token.delimiter,
pre .token.tag {
  color: #abb2bf;
}

/* Special tokens */
pre .token.selector,
pre .token.important,
pre .token.atrule {
  color: #c678dd;
  font-weight: 600;
}

pre .token.important {
  font-weight: 700;
}

/* Markup languages (HTML, XML, etc.) */
pre .token.tag .token.punctuation {
  color: #abb2bf;
}

pre .token.tag .token.tag,
pre .token.tag .token.tag .token.punctuation {
  color: #e06c75;
}

pre .token.attr-name {
  color: #d19a66;
}

/* CSS-specific */
pre .language-css .token.property {
  color: #56b6c2;
}

pre .language-css .token.selector {
  color: #d19a66;
}

/* JavaScript/TypeScript specific */
pre .token.imports .token.maybe-class-name {
  color: #e5c07b;
}

pre .token.console {
  color: #61afef;
}

pre .token.parameter {
  color: #e06c75;
}

/* JSON-specific */
pre .language-json .token.property {
  color: #e06c75;
}

pre .language-json .token.string {
  color: #98c379;
}

/* Shell/Bash-specific */
pre .language-bash .token.function,
pre .language-sh .token.function {
  color: #61afef;
}

/* Diff highlighting */
pre .token.inserted {
  color: #98c379;
  background: rgba(152, 195, 121, 0.1);
}

pre .token.deleted {
  color: #e06c75;
  background: rgba(224, 108, 117, 0.1);
}

/* Bold and italic */
pre .token.bold {
  font-weight: 700;
}

pre .token.italic {
  font-style: italic;
}

/* Line highlighting (for specific line emphasis) */
pre .highlight-line {
  background: rgba(255, 255, 255, 0.05);
  display: block;
  margin: 0 -1.5rem;
  padding: 0 1.5rem;
  border-left: 3px solid #61afef;
}

${generateIconCSS()}

${generateGlassmorphismCSS()}

${generateAnimationCSS()}
`);

  // Generate utility classes
  const utilityRules: string[] = [];
  const mediaQueries: Map<string, string[]> = new Map();

  for (const className of classes) {
    let cssDeclarations = TAILWIND_UTILITIES[className];

    // Handle hover: prefix dynamically
    if (!cssDeclarations && className.startsWith('hover:')) {
      const baseClass = className.substring(6); // Remove 'hover:' prefix
      const baseDeclarations = TAILWIND_UTILITIES[baseClass];
      if (baseDeclarations && !baseDeclarations.startsWith('@media')) {
        // Generate hover variant
        const escapedClassName = className.replace(/:/g, '\\:');
        utilityRules.push(`.${escapedClassName}:hover { ${baseDeclarations} }`);
        continue;
      }
    }
    
    // Handle active: prefix dynamically
    if (!cssDeclarations && className.startsWith('active:')) {
      const baseClass = className.substring(7); // Remove 'active:' prefix
      const baseDeclarations = TAILWIND_UTILITIES[baseClass];
      if (baseDeclarations && !baseDeclarations.startsWith('@media')) {
        // Generate active variant
        const escapedClassName = className.replace(/:/g, '\\:');
        utilityRules.push(`.${escapedClassName}:active { ${baseDeclarations} }`);
        continue;
      }
    }
    
    // Handle focus-visible: prefix dynamically
    if (!cssDeclarations && className.startsWith('focus-visible:')) {
      const baseClass = className.substring(14); // Remove 'focus-visible:' prefix
      const baseDeclarations = TAILWIND_UTILITIES[baseClass];
      if (baseDeclarations && !baseDeclarations.startsWith('@media')) {
        const escapedClassName = className.replace(/:/g, '\\:');
        utilityRules.push(`.${escapedClassName}:focus-visible { ${baseDeclarations} }`);
        continue;
      }
    }
    
    // Handle disabled: prefix dynamically
    if (!cssDeclarations && className.startsWith('disabled:')) {
      const baseClass = className.substring(9); // Remove 'disabled:' prefix
      const baseDeclarations = TAILWIND_UTILITIES[baseClass];
      if (baseDeclarations && !baseDeclarations.startsWith('@media')) {
        const escapedClassName = className.replace(/:/g, '\\:');
        utilityRules.push(`.${escapedClassName}:disabled { ${baseDeclarations} }`);
        continue;
      }
    }
    
    // Handle last: prefix dynamically
    if (!cssDeclarations && className.startsWith('last:')) {
      const baseClass = className.substring(5); // Remove 'last:' prefix
      const baseDeclarations = TAILWIND_UTILITIES[baseClass];
      if (baseDeclarations && !baseDeclarations.startsWith('@media')) {
        const escapedClassName = className.replace(/:/g, '\\:');
        utilityRules.push(`.${escapedClassName}:last-child { ${baseDeclarations} }`);
        continue;
      }
    }

    if (cssDeclarations) {
      // Escape special CSS characters in class names
      // Colons (:) in class names (like md:grid-cols-2) must be escaped as \:
      // See: https://www.w3.org/TR/CSS21/syndata.html#characters
      const escapedClassName = className.replace(/:/g, '\\:');

      if (cssDeclarations.startsWith('@media')) {
        // Extract media query and content
        const match = cssDeclarations.match(/@media ([^{]+) \{ (.+) \}/);
        if (match && match[1] && match[2]) {
          const mediaQuery = match[1];
          const declarations = match[2];
          if (!mediaQueries.has(mediaQuery)) {
            mediaQueries.set(mediaQuery, []);
          }
          mediaQueries.get(mediaQuery)!.push(`.${escapedClassName} { ${declarations} }`);
        }
      } else {
        utilityRules.push(`.${escapedClassName} { ${cssDeclarations} }`);
      }
    }
  }

  cssRules.push(utilityRules.join('\n'));

  // Add media queries
  for (const [mediaQuery, rules] of mediaQueries) {
    cssRules.push(`@media ${mediaQuery} {\n  ${rules.join('\n  ')}\n}`);
  }

  // Add component-specific styles
  cssRules.push(`
/* ========================================
 * COMPONENT STYLES
 * ======================================== */

/* Base Component */
.taildown-component {
  /* Base component styles */
}

/* Card Component */
.component-card {
  /* Additional card-specific styles */
}

.component-card .component-card {
  padding: 1rem;
}

.component-card .component-card .component-card {
  padding: 0.75rem;
}

.component-card .component-card .component-card .component-card {
  padding: 0.5rem;
}

.component-grid {
  /* Additional grid-specific styles */
}

.component-container {
  /* Additional container-specific styles */
}

/* ========================================
 * TABS COMPONENT
 * ======================================== */

.component-tabs {
  width: 100%;
}

.tabs-list {
  position: relative;
}

.tab-button {
  position: relative;
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;
}

.tab-button[aria-selected="true"] {
  color: rgb(37 99 235);
  border-color: rgb(37 99 235) !important;
}

.tab-button[aria-selected="false"]:hover {
  color: rgb(17 24 39);
  border-color: rgb(209 213 219);
}

.tab-panel[hidden] {
  display: none;
}

/* ========================================
 * ACCORDION COMPONENT
 * ======================================== */

.component-accordion {
  border: 1px solid rgb(229 231 235);
}

.accordion-item {
  position: relative;
}

.accordion-trigger {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 1rem;
}

.accordion-trigger:hover {
  background-color: rgb(249 250 251);
}

.accordion-content[hidden] {
  display: none;
}

.accordion-content {
  padding: 0 1rem 1rem 1rem;
  overflow: hidden;
}

.accordion-icon {
  transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.accordion-item.open .accordion-icon {
  transform: rotate(180deg);
}

/* ========================================
 * CAROUSEL COMPONENT
 * ======================================== */

.carousel-container {
  perspective: 1200px;
  perspective-origin: center;
}

.component-carousel {
  position: relative;
  width: 100%;
}

.carousel-track {
  display: flex;
  transition: all 500ms cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
}

.carousel-slide {
  min-width: 100%;
  flex-shrink: 0;
  padding: 0 2rem;
}

.carousel-slide[hidden] {
  display: none;
}

.carousel-card {
  transform-style: preserve-3d;
  will-change: transform, box-shadow;
}

/* Beautiful glassmorphism cards with depth */
.carousel-card:hover {
  transform: scale(1.02) translateZ(20px) !important;
  box-shadow: 0 35px 60px -15px rgb(0 0 0 / 0.3) !important;
}

.carousel-prev,
.carousel-next {
  position: absolute;
  z-index: 10;
  background: white;
  border: 1px solid rgb(229 231 235);
  cursor: pointer;
  outline: none;
}

.carousel-prev:hover,
.carousel-next:hover {
  background-color: rgb(243 244 246);
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}

.carousel-prev:disabled,
.carousel-next:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.carousel-indicators {
  display: flex;
  gap: 0.5rem;
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.carousel-indicator {
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.carousel-indicator[aria-current="true"] {
  background-color: rgb(17 24 39);
  width: 2rem;
}

.carousel-indicator[aria-current="false"] {
  background-color: rgb(156 163 175);
}

.carousel-indicator:hover {
  background-color: rgb(75 85 99);
}

/* ========================================
 * MODAL COMPONENT
 * ======================================== */

.modal-backdrop {
  transition: opacity 200ms ease-in-out;
}

.modal-backdrop[hidden] {
  display: none;
}

.modal-content {
  position: relative;
  animation: modalSlideIn 300ms cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-close {
  z-index: 10;
}

.modal-close:hover {
  transform: scale(1.1);
}

/* ========================================
 * TOOLTIP COMPONENT
 * ======================================== */

.component-tooltip {
  position: relative;
  display: inline-block;
}

.tooltip-content {
  position: absolute;
  z-index: 50;
  background-color: rgb(17 24 39);
  color: white;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.tooltip-content.visible {
  opacity: 1;
}

.tooltip-content[data-position="top"] {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-0.5rem);
}

.tooltip-content[data-position="bottom"] {
  top: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(0.5rem);
}

.tooltip-content[data-position="left"] {
  right: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(-0.5rem);
}

.tooltip-content[data-position="right"] {
  left: 100%;
  top: 50%;
  transform: translateY(-50%) translateX(0.5rem);
}

/* Button Styles - shadcn-inspired */
a.bg-blue-600 {
  display: inline-block;
  text-decoration: none;
  position: relative;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transform: translateY(0);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

a.bg-blue-600:hover {
  background-color: rgb(37 99 235); /* blue-700 */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
}

a.bg-blue-600:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}

a.bg-gray-200 {
  display: inline-block;
  text-decoration: none;
  position: relative;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05), 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transform: translateY(0);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

a.bg-gray-200:hover {
  background-color: rgb(229 231 235); /* gray-300 */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  transform: translateY(-1px);
}

a.bg-gray-200:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
}
`);

  const css = cssRules.join('\n');

  if (minify) {
    return css
      .replace(/\/\*[^*]*\*\//g, '') // Remove comments
      .replace(/\s+/g, ' ') // Collapse whitespace
      .replace(/\s*([{}:;,])\s*/g, '$1') // Remove whitespace around punctuation
      .trim();
  }

  return css;
}

/**
 * Generate CSS from AST
 * 
 * @param ast - Taildown AST
 * @param minify - Whether to minify CSS
 * @returns Generated CSS string
 */
export function renderCSS(ast: TaildownRoot, minify: boolean = false): string {
  const classes = collectClasses(ast);
  return generateCSS(classes, minify);
}

