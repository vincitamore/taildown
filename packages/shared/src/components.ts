/**
 * Component variant definition
 */
export interface ComponentVariant {
  /** CSS classes for this variant */
  classes: string[];

  /** Description of the variant */
  description?: string;
}

/**
 * Component configuration
 */
export interface ComponentConfig {
  /** Default variant to use when none specified */
  defaultVariant?: string;

  /** Default size to use when none specified */
  defaultSize?: string;

  /** Additional CSS classes to always apply */
  defaultClasses?: string[];

  /** Variant definitions */
  variants?: Record<string, ComponentVariant>;

  /** Size definitions */
  sizes?: Record<string, ComponentVariant>;
}

/**
 * Components configuration
 * Defines behavior and styling for all components
 */
export interface ComponentsConfig {
  /** Card component */
  card?: ComponentConfig;

  /** Button component */
  button?: ComponentConfig;

  /** Alert component */
  alert?: ComponentConfig;

  /** Badge component */
  badge?: ComponentConfig;

  /** Avatar component */
  avatar?: ComponentConfig;

  /** Grid component */
  grid?: ComponentConfig;

  /** Container component */
  container?: ComponentConfig;

  /** Additional custom components */
  [key: string]: ComponentConfig | undefined;
}
