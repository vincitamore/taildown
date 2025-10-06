/**
 * Component Registry for Taildown
 * Central registry for all standard and custom components
 * 
 * See PHASE-2-IMPLEMENTATION-PLAN.md §4 for component system design
 */

import type { ComponentConfig } from '../config/config-schema';

/**
 * Component definition in the registry
 * Extends the config with runtime metadata
 */
export interface ComponentDefinition {
  /** Component name (lowercase, kebab-case) */
  name: string;
  
  /** HTML element to render as */
  htmlElement: string;
  
  /** Default CSS classes applied to all instances */
  defaultClasses: string[];
  
  /** Default variant (if none specified) */
  defaultVariant?: string;
  
  /** Default size (if none specified) */
  defaultSize?: string;
  
  /** Available variants and their classes */
  variants: Record<string, string[]>;
  
  /** Available sizes and their classes */
  sizes: Record<string, string[]>;
  
  /** Component description */
  description?: string;
  
  /** Whether component supports children */
  hasChildren: boolean;
  
  /** Whether component requires specific attributes */
  requiredAttributes?: string[];
}

/**
 * Global component registry
 * Singleton that holds all registered components
 */
class ComponentRegistry {
  private components: Map<string, ComponentDefinition> = new Map();
  
  /**
   * Register a component
   * @param definition - Component definition
   */
  register(definition: ComponentDefinition): void {
    this.components.set(definition.name, definition);
  }
  
  /**
   * Register multiple components at once
   * @param definitions - Array of component definitions
   */
  registerMany(definitions: ComponentDefinition[]): void {
    for (const definition of definitions) {
      this.register(definition);
    }
  }
  
  /**
   * Get a component by name
   * @param name - Component name
   * @returns Component definition or undefined
   */
  get(name: string): ComponentDefinition | undefined {
    return this.components.get(name);
  }
  
  /**
   * Check if a component is registered
   * @param name - Component name
   * @returns True if registered
   */
  has(name: string): boolean {
    return this.components.has(name);
  }
  
  /**
   * Get all registered component names
   * @returns Array of component names
   */
  getNames(): string[] {
    return Array.from(this.components.keys());
  }
  
  /**
   * Get all registered components
   * @returns Array of component definitions
   */
  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values());
  }
  
  /**
   * Remove a component from the registry
   * @param name - Component name
   */
  unregister(name: string): boolean {
    return this.components.delete(name);
  }
  
  /**
   * Clear all registered components
   */
  clear(): void {
    this.components.clear();
  }
  
  /**
   * Get component with variant classes resolved
   * @param name - Component name
   * @param variant - Variant name
   * @returns Component classes including variant
   */
  getComponentClasses(name: string, variant?: string): string[] {
    const component = this.get(name);
    if (!component) {
      return [];
    }
    
    const classes = [...component.defaultClasses];
    
    // Add variant classes if specified
    if (variant && component.variants[variant]) {
      classes.push(...component.variants[variant]);
    } else if (component.defaultVariant && component.variants[component.defaultVariant]) {
      // Use default variant if no variant specified
      classes.push(...component.variants[component.defaultVariant]);
    }
    
    return classes;
  }
  
  /**
   * Get component with size classes resolved
   * @param name - Component name
   * @param size - Size name
   * @returns Component classes including size
   */
  getComponentClassesWithSize(name: string, size?: string): string[] {
    const component = this.get(name);
    if (!component) {
      return [];
    }
    
    const classes = [...component.defaultClasses];
    
    // Add size classes if specified
    if (size && component.sizes[size]) {
      classes.push(...component.sizes[size]);
    }
    
    return classes;
  }
  
  /**
   * Merge user config into registry
   * Allows users to override or extend component definitions
   * @param name - Component name
   * @param config - User component config
   */
  mergeConfig(name: string, config: ComponentConfig): void {
    const existing = this.get(name);
    if (!existing) {
      return;
    }
    
    // Merge default classes
    if (config.defaultClasses) {
      existing.defaultClasses.push(...config.defaultClasses);
    }
    
    // Override default variant
    if (config.defaultVariant) {
      existing.defaultVariant = config.defaultVariant;
    }
    
    // Override default size
    if (config.defaultSize) {
      existing.defaultSize = config.defaultSize;
    }
    
    // Merge variants
    if (config.variants) {
      for (const [variantName, variant] of Object.entries(config.variants)) {
        existing.variants[variantName] = variant.classes;
      }
    }
    
    // Merge sizes
    if (config.sizes) {
      for (const [sizeName, size] of Object.entries(config.sizes)) {
        existing.sizes[sizeName] = size.classes;
      }
    }
  }
}

// Export singleton instance
export const registry = new ComponentRegistry();

/**
 * Helper function to create a component definition
 * Provides defaults and validation
 */
export function defineComponent(
  definition: Partial<ComponentDefinition> & Pick<ComponentDefinition, 'name'>
): ComponentDefinition {
  return {
    htmlElement: 'div',
    defaultClasses: [],
    variants: {},
    sizes: {},
    hasChildren: true,
    ...definition,
  };
}

/**
 * Register standard Taildown components
 * This is called during initialization
 */
export async function registerStandardComponents(): Promise<void> {
  // Use dynamic imports to avoid circular dependencies
  const { cardComponent } = await import('./standard/card.js');
  const { buttonComponent } = await import('./standard/button.js');
  const { alertComponent } = await import('./standard/alert.js');
  const { badgeComponent } = await import('./standard/badge.js');
  const { avatarComponent } = await import('./standard/avatar.js');
  const { tabsComponent } = await import('./standard/tabs.js');
  const { accordionComponent } = await import('./standard/accordion.js');
  const { modalComponent } = await import('./standard/modal.js');
  const { navbarComponent } = await import('./standard/navbar.js');
  const { sidebarComponent } = await import('./standard/sidebar.js');
  const { breadcrumbComponent } = await import('./standard/breadcrumb.js');
  const { paginationComponent } = await import('./standard/pagination.js');
  const { progressComponent } = await import('./standard/progress.js');
  const { skeletonComponent } = await import('./standard/skeleton.js');
  const { tooltipComponent } = await import('./standard/tooltip.js');
  const { carouselComponent } = await import('./standard/carousel.js');
  const { treeComponent } = await import('./standard/tree.js');
  const { flowComponent } = await import('./standard/flow.js');
  
  // Register all components
  registry.register(cardComponent);
  registry.register(buttonComponent);
  registry.register(alertComponent);
  registry.register(badgeComponent);
  registry.register(avatarComponent);
  registry.register(tabsComponent);
  registry.register(accordionComponent);
  registry.register(modalComponent);
  registry.register(navbarComponent);
  registry.register(sidebarComponent);
  registry.register(breadcrumbComponent);
  registry.register(paginationComponent);
  registry.register(progressComponent);
  registry.register(skeletonComponent);
  registry.register(tooltipComponent);
  registry.register(carouselComponent);
  registry.register(treeComponent);
  registry.register(flowComponent);
  
  // Grid Component
  registry.register(
    defineComponent({
      name: 'grid',
      htmlElement: 'div',
      defaultClasses: ['grid', 'gap-4'],
      defaultSize: '3', // Default to 3-column responsive grid
      variants: {
        tight: ['gap-2'],
        normal: ['gap-4'],
        loose: ['gap-6'],
        'extra-loose': ['gap-8'],
      },
      sizes: {
        '1': ['grid-cols-1'],
        '2': ['grid-cols-1', 'sm:grid-cols-2'],
        '3': ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3'],
        '4': ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4'],
        '5': ['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-3', 'xl:grid-cols-5'],
      },
      description: 'Responsive grid layout system',
      hasChildren: true,
    })
  );
  
  // Container Component
  registry.register(
    defineComponent({
      name: 'container',
      htmlElement: 'div',
      defaultClasses: ['mx-auto', 'px-4', 'sm:px-6', 'lg:px-8', 'max-w-6xl'],
      variants: {
        narrow: ['max-w-2xl'],
        normal: ['max-w-4xl'],
        wide: ['max-w-6xl'],
        'extra-wide': ['max-w-screen-2xl'],
        full: ['max-w-full'],
      },
      sizes: {
        sm: ['max-w-2xl'],
        md: ['max-w-4xl'],
        lg: ['max-w-6xl'],
        xl: ['max-w-screen-2xl'],
      },
      description: 'Centered container with max-width constraints',
      hasChildren: true,
    })
  );
}

/**
 * Initialize the component registry with standard components
 * Call this during compiler initialization
 */
export async function initializeRegistry(): Promise<void> {
  await registerStandardComponents();
}

// Auto-initialize registry on module load
// Store the promise so we can await it if needed
export const registryInitialized = initializeRegistry();

/**
 * Get component definition by name with fallback
 * Returns undefined if not found
 */
export function getComponent(name: string): ComponentDefinition | undefined {
  return registry.get(name);
}

/**
 * Check if component exists in registry
 */
export function hasComponent(name: string): boolean {
  return registry.has(name);
}

/**
 * Get all component names
 */
export function getAllComponentNames(): string[] {
  return registry.getNames();
}

/**
 * Export the registry for advanced usage
 */
export { ComponentRegistry };
export default registry;

