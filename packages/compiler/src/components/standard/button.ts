/**
 * Button Component Definition
 * Interactive button elements with semantic variants using theme color system
 * 
 * All button variants use CSS variables from the theme, ensuring consistent
 * soft, pastel coloring that matches the high-class aesthetic throughout the app.
 * 
 * Variants:
 * - primary: Main call-to-action button (theme primary color)
 * - secondary: Secondary actions (theme secondary color)
 * - accent: Eye-catching accent button (theme accent color)
 * - info: Informational actions (theme info color)
 * - outline: Outlined button with transparent background
 * - ghost: Minimal button with hover effect
 * - link: Button styled as a link
 * - destructive: Dangerous/delete actions (theme error color)
 * - success: Success/confirm actions (theme success color)
 * - warning: Warning actions (theme warning color)
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
    // Primary: Main CTA with solid color using theme system
    primary: [
      'bg-primary',
      'text-primary-foreground',
      'hover:bg-primary',
      'hover:brightness-110',
      'active:brightness-95',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
    ],
    
    // Secondary: Secondary actions using theme system
    secondary: [
      'bg-secondary',
      'text-secondary-foreground',
      'hover:bg-secondary',
      'hover:brightness-110',
      'active:brightness-95',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
    ],
    
    // Outline: Bordered with transparent background
    outline: [
      'border-2',
      'border-border',
      'text-foreground',
      'hover:bg-muted',
      'active:bg-muted',
      'bg-transparent',
      'transition-all',
    ],
    
    // Ghost: Minimal with hover effect
    ghost: [
      'bg-transparent',
      'text-foreground',
      'hover:bg-muted',
      'active:bg-muted',
      'transition-all',
    ],
    
    // Link: Styled as link using theme primary color
    link: [
      'bg-transparent',
      'text-primary',
      'hover:text-primary',
      'hover:brightness-110',
      'px-0',
      'py-0',
      'shadow-none',
      'transition-all',
    ],
    
    // Destructive: Dangerous actions using theme error color
    destructive: [
      'bg-error',
      'text-error-foreground',
      'hover:bg-error',
      'hover:brightness-110',
      'active:brightness-95',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
    ],
    
    // Success: Success/confirm actions using theme success color
    success: [
      'bg-success',
      'text-success-foreground',
      'hover:bg-success',
      'hover:brightness-110',
      'active:brightness-95',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
    ],
    
    // Warning: Warning actions using theme warning color
    warning: [
      'bg-warning',
      'text-warning-foreground',
      'hover:bg-warning',
      'hover:brightness-110',
      'active:brightness-95',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
    ],
    
    // Accent: Eye-catching accent actions using theme accent color
    accent: [
      'bg-accent',
      'text-accent-foreground',
      'hover:bg-accent',
      'hover:brightness-110',
      'active:brightness-95',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
    ],
    
    // Info: Informational actions using theme info color
    info: [
      'bg-info',
      'text-info-foreground',
      'hover:bg-info',
      'hover:brightness-110',
      'active:brightness-95',
      'shadow-md',
      'hover:shadow-lg',
      'transition-all',
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
    description: 'Main call-to-action button using theme primary color (soft, pastel aesthetic)',
    example: '[Click Me](#){button primary}',
    color: 'Theme Primary',
    use: 'Primary actions like submit, save, continue',
  },
  secondary: {
    name: 'Secondary',
    description: 'Secondary action using theme secondary color (soft, elegant)',
    example: '[Learn More](#){button secondary}',
    color: 'Theme Secondary',
    use: 'Secondary actions that support the primary action',
  },
  accent: {
    name: 'Accent',
    description: 'Eye-catching accent button using theme accent color',
    example: '[Special Offer](#){button accent}',
    color: 'Theme Accent',
    use: 'Special actions, promotions, unique features',
  },
  info: {
    name: 'Info',
    description: 'Informational button using theme info color',
    example: '[Learn More](#){button info}',
    color: 'Theme Info',
    use: 'Informational actions, help, documentation',
  },
  outline: {
    name: 'Outline',
    description: 'Outlined button with transparent background',
    example: '[Cancel](#){button outline}',
    color: 'Theme Border',
    use: 'Alternative actions, cancellation',
  },
  ghost: {
    name: 'Ghost',
    description: 'Minimal button with subtle hover effect',
    example: '[Options](#){button ghost}',
    color: 'Theme Muted',
    use: 'Tertiary actions, menu items',
  },
  link: {
    name: 'Link',
    description: 'Button styled as a text link using theme primary color',
    example: '[Read More](#){button link}',
    color: 'Theme Primary',
    use: 'Text-based actions, navigation',
  },
  destructive: {
    name: 'Destructive',
    description: 'Dangerous action button using theme error color',
    example: '[Delete](#){button destructive}',
    color: 'Theme Error',
    use: 'Delete, remove, destructive actions',
  },
  success: {
    name: 'Success',
    description: 'Success or confirmation action using theme success color',
    example: '[Confirm](#){button success}',
    color: 'Theme Success',
    use: 'Confirm, accept, success actions',
  },
  warning: {
    name: 'Warning',
    description: 'Warning action using theme warning color',
    example: '[Warning](#){button warning}',
    color: 'Theme Warning',
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

