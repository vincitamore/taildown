/**
 * Constants for Taildown
 * See SYNTAX.md for specification details
 */

import type { ComponentDefinition, StandardComponent } from './types';

/**
 * Standard components required in Phase 1
 * See SYNTAX.md §3.4
 */
export const STANDARD_COMPONENTS: Record<StandardComponent, ComponentDefinition> = {
  card: {
    name: 'card',
    defaultClasses: [
      'p-6',
      'rounded-lg',
      'shadow-md',
      'bg-white',
      'max-w-full',
      'overflow-auto',
    ],
    htmlElement: 'div',
  },
  grid: {
    name: 'grid',
    defaultClasses: [
      'grid',
      'gap-4',
      'grid-cols-1',
      'sm:grid-cols-2',
      'lg:grid-cols-3',
    ],
    htmlElement: 'div',
  },
  container: {
    name: 'container',
    defaultClasses: [
      'max-w-screen-2xl',
      'mx-auto',
      'px-4',
      'sm:px-6',
      'lg:px-8',
      'xl:px-12',
    ],
    htmlElement: 'div',
  },
};

/**
 * Valid file extensions for Taildown documents
 * Primary: .td
 * Alternatives: .tdown, .taildown
 */
export const TAILDOWN_EXTENSIONS = ['.td', '.tdown', '.taildown'] as const;

/**
 * Component name validation regex
 * See SYNTAX.md §3.2.2
 * Must start with lowercase letter, contain only lowercase letters, digits, and hyphens
 */
export const COMPONENT_NAME_REGEX = /^[a-z][a-z0-9-]*$/;

/**
 * Class name validation regex
 * See SYNTAX.md §2.2.2
 * Must start with dot, followed by alphanumeric, hyphens, or underscores
 */
export const CLASS_NAME_REGEX = /^\.[a-zA-Z][a-zA-Z0-9_-]*$/;

/**
 * Attribute block pattern for extraction
 * See SYNTAX.md §2.2.5
 * Updated: Matches attribute blocks anywhere in text, not just at end
 */
export const ATTRIBUTE_BLOCK_REGEX = /^\s*\{([^}]+)\}/;

/**
 * Version of Taildown syntax specification
 */
export const SYNTAX_VERSION = '0.1.0';

