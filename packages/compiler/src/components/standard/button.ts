/**
 * Button Component Definition
 * Interactive button elements with semantic variants
 * 
 * Variants:
 * - primary: Main call-to-action button
 * - secondary: Secondary actions
 * - outline: Outlined button with transparent background
 * - ghost: Minimal button with hover effect
 * - link: Button styled as a link
 * - destructive: Dangerous/delete actions (red)
 * - success: Success/confirm actions (green)
 * - warning: Warning actions (yellow)
 * 
 * Sizes:
 * - sm: Compact button
 * - md: Normal button (default)
 * - lg: Large button
 * - xl: Extra large button for hero sections
 * 
 * Usage:
 * ```taildown
 * [Click Me](#){button primary}
 * [Delete](#){button destructive}
 * [Learn More](#){button outline lg}
 * ```
 * 
 * Note: Buttons are created from links with {button} attribute
 */

import { defineComponent } from '../component-registry';
import type { ComponentDefinition } from '../component-registry';

/**
 * Button component definition
 * Applied to links to create button-styled elements
 */
export const buttonComponent: ComponentDefinition = defineComponent({
  name: 'button',
  htmlElement: 'a', // Applied to links
  
  // Base classes for all buttons
  defaultClasses: [
    'inline-block',
    'px-6',
    'py-3',
    'rounded-lg',
    'font-medium',
    'text-center',
    'transition-all',
    'duration-200',
    'cursor-pointer',
    'no-underline',
  ],
  
  // Default variant
  defaultVariant: 'primary',
  
  // Visual/semantic variants
  variants: {
    // Primary: Main CTA with solid color
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'active:bg-blue-800',
      'shadow-md',
      'hover:shadow-lg',
    ],
    
    // Secondary: Secondary actions
    secondary: [
      'bg-purple-600',
      'text-white',
      'hover:bg-purple-700',
      'active:bg-purple-800',
      'shadow-md',
      'hover:shadow-lg',
    ],
    
    // Outline: Bordered with transparent background
    outline: [
      'border-2',
      'border-gray-300',
      'text-gray-700',
      'hover:bg-gray-100',
      'active:bg-gray-200',
      'bg-transparent',
    ],
    
    // Ghost: Minimal with hover effect
    ghost: [
      'bg-transparent',
      'text-gray-700',
      'hover:bg-gray-100',
      'active:bg-gray-200',
    ],
    
    // Link: Styled as link
    link: [
      'bg-transparent',
      'text-blue-600',
      'hover:text-blue-700',
      'underline',
      'px-0',
      'py-0',
      'shadow-none',
    ],
    
    // Destructive: Dangerous actions (delete, remove)
    destructive: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-700',
      'active:bg-red-800',
      'shadow-md',
      'hover:shadow-lg',
    ],
    
    // Success: Success/confirm actions
    success: [
      'bg-green-600',
      'text-white',
      'hover:bg-green-700',
      'active:bg-green-800',
      'shadow-md',
      'hover:shadow-lg',
    ],
    
    // Warning: Warning actions
    warning: [
      'bg-amber-600',
      'text-white',
      'hover:bg-amber-700',
      'active:bg-amber-800',
      'shadow-md',
      'hover:shadow-lg',
    ],
  },
  
  // Size variants
  sizes: {
    sm: ['px-4', 'py-2', 'text-sm'],
    md: ['px-6', 'py-3', 'text-base'],
    lg: ['px-8', 'py-4', 'text-lg'],
    xl: ['px-10', 'py-5', 'text-xl'],
  },
  
  description: 'Interactive button for user actions',
  hasChildren: true,
});

/**
 * Register button component with the registry
 */
export function registerButtonComponent() {
  const { registry } = require('../component-registry');
  registry.register(buttonComponent);
}

/**
 * Get button classes for a specific variant and size
 * 
 * @param variant - Button variant name
 * @param size - Button size
 * @returns Array of CSS classes
 */
export function getButtonClasses(
  variant?: string,
  size?: string
): string[] {
  const classes = [...buttonComponent.defaultClasses];
  
  // Add variant classes
  const variantName = variant || buttonComponent.defaultVariant;
  if (variantName && buttonComponent.variants[variantName]) {
    classes.push(...buttonComponent.variants[variantName]);
  }
  
  // Add size classes
  if (size && buttonComponent.sizes[size]) {
    classes.push(...buttonComponent.sizes[size]);
  }
  
  return classes;
}

/**
 * Button variant documentation
 */
export const buttonVariants = {
  primary: {
    name: 'Primary',
    description: 'Main call-to-action button with solid blue background',
    example: '[Click Me](#){button primary}',
    color: 'Blue',
    use: 'Primary actions like submit, save, continue',
  },
  secondary: {
    name: 'Secondary',
    description: 'Secondary action with purple background',
    example: '[Learn More](#){button secondary}',
    color: 'Purple',
    use: 'Secondary actions that support the primary action',
  },
  outline: {
    name: 'Outline',
    description: 'Outlined button with transparent background',
    example: '[Cancel](#){button outline}',
    color: 'Gray',
    use: 'Alternative actions, cancellation',
  },
  ghost: {
    name: 'Ghost',
    description: 'Minimal button with subtle hover effect',
    example: '[Options](#){button ghost}',
    color: 'Gray',
    use: 'Tertiary actions, menu items',
  },
  link: {
    name: 'Link',
    description: 'Button styled as a text link',
    example: '[Read More](#){button link}',
    color: 'Blue',
    use: 'Text-based actions, navigation',
  },
  destructive: {
    name: 'Destructive',
    description: 'Dangerous action button in red',
    example: '[Delete](#){button destructive}',
    color: 'Red',
    use: 'Delete, remove, destructive actions',
  },
  success: {
    name: 'Success',
    description: 'Success or confirmation action in green',
    example: '[Confirm](#){button success}',
    color: 'Green',
    use: 'Confirm, accept, success actions',
  },
  warning: {
    name: 'Warning',
    description: 'Warning action in amber/yellow',
    example: '[Warning](#){button warning}',
    color: 'Amber',
    use: 'Warning, caution actions',
  },
};

/**
 * Button size documentation
 */
export const buttonSizes = {
  sm: {
    name: 'Small',
    description: 'Compact button for dense layouts',
    padding: '0.5rem 1rem (py-2 px-4)',
    fontSize: '0.875rem (text-sm)',
  },
  md: {
    name: 'Medium',
    description: 'Default button size',
    padding: '0.75rem 1.5rem (py-3 px-6)',
    fontSize: '1rem (text-base)',
  },
  lg: {
    name: 'Large',
    description: 'Large button for emphasis',
    padding: '1rem 2rem (py-4 px-8)',
    fontSize: '1.125rem (text-lg)',
  },
  xl: {
    name: 'Extra Large',
    description: 'Hero button for maximum impact',
    padding: '1.25rem 2.5rem (py-5 px-10)',
    fontSize: '1.25rem (text-xl)',
  },
};

/**
 * Export button component as default
 */
export default buttonComponent;

