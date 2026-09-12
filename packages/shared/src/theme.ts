/**
 * Color scale configuration
 * Standard Tailwind-style color scale with shades 50-900
 */
export interface ColorScale {
  /** Default shade (typically 500 or 600) */
  DEFAULT?: string;

  /** Lightest shade */
  50?: string;
  100?: string;
  200?: string;
  300?: string;
  400?: string;
  500?: string;
  600?: string;
  700?: string;
  800?: string;
  900?: string;

  /** Darkest shade */
  950?: string;
}

/**
 * Color configuration
 * Defines the complete color palette for the theme
 */
export interface ColorConfig {
  /** Primary brand color */
  primary: ColorScale;

  /** Secondary brand color */
  secondary: ColorScale;

  /** Accent color for CTAs */
  accent: ColorScale;

  /** Gray scale for neutral elements */
  gray?: ColorScale;

  /** Semantic colors */
  success?: string;
  warning?: string;
  error?: string;
  info?: string;

  /** Additional custom colors */
  [key: string]: ColorScale | string | undefined;
}

/**
 * Font configuration
 */
export interface FontConfig {
  /** Sans-serif font stack */
  sans?: string;

  /** Serif font stack */
  serif?: string;

  /** Monospace font stack */
  mono?: string;

  /** Additional custom fonts */
  [key: string]: string | undefined;
}
