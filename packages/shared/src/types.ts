/**
 * Shared type definitions for Taildown
 * See SYNTAX.md for specification details
 */

import type { Root, Node, Data } from 'mdast';

/**
 * Open Graph meta tags for social media sharing
 */
export interface OpenGraphMetadata {
  /** Page title (og:title) */
  title?: string;

  /** Page description (og:description) */
  description?: string;

  /** Page type (og:type) - default: 'website' */
  type?: string;

  /** Full URL to the page (og:url) */
  url?: string;

  /** Full URL to the Open Graph image (og:image) */
  image?: string;

  /** Image alt text (og:image:alt) */
  imageAlt?: string;

  /** Site name (og:site_name) */
  siteName?: string;
}

/**
 * Compilation options for Taildown compiler
 */
export interface CompileOptions {
  /** Inline CSS in HTML output (default: false) */
  inlineStyles?: boolean;

  /** Inline JavaScript in HTML output (default: false) */
  inlineScripts?: boolean;

  /** Minify HTML and CSS output (default: false) */
  minify?: boolean;

  /** CSS filename for <link> tag (default: 'styles.css') */
  cssFilename?: string;

  /** JavaScript filename for <script> tag (default: 'script.js') */
  jsFilename?: string;

  /** Include source maps (default: false) */
  sourceMaps?: boolean;

  /** Auto-fix common syntax errors (default: true) */
  autoFix?: boolean;

  /** Log syntax fixes to console (default: false) */
  logSyntaxFixes?: boolean;

  /** Enable dark mode in generated output (default: true) */
  darkMode?: boolean;

  /** Custom component definitions */
  components?: Record<string, ComponentDefinition>;

  /** Custom style mappings (plain English to CSS classes) */
  styleMappings?: Record<string, string>;

  /** Page title for HTML document */
  title?: string;

  /** Meta description for SEO */
  description?: string;

  /** Open Graph metadata for social media sharing */
  openGraph?: OpenGraphMetadata;
}

/**
 * Result of compilation
 */
export interface CompileResult {
  /** Generated HTML */
  html: string;

  /** Generated CSS */
  css: string;

  /** Generated JavaScript (empty string if no interactive components) */
  js: string;

  /** Compilation metadata */
  metadata: CompileMetadata;
}

/**
 * Metadata about compilation process
 */
export interface CompileMetadata {
  /** Compilation time in milliseconds */
  compileTime: number;

  /** Number of AST nodes processed */
  nodeCount: number;

  /** Warnings generated during compilation */
  warnings: CompilationWarning[];
}

/**
 * Warning emitted during compilation
 */
export interface CompilationWarning {
  /** Warning type */
  type: 'parse' | 'validation' | 'semantic';

  /** Warning message */
  message: string;

  /** Line number (if available) */
  line?: number;

  /** Column number (if available) */
  column?: number;
}

/**
 * Component definition
 */
export interface ComponentDefinition {
  /** Component name (must match [a-z][a-z0-9-]*) */
  name: string;

  /** Default CSS classes applied to component */
  defaultClasses: string[];

  /** HTML element to render as */
  htmlElement?: string;
}

/**
 * Extended data properties for Taildown AST nodes
 * Following rehype conventions with hProperties
 */
export interface TaildownNodeData extends Data {
  /** HTML properties to apply to node */
  hProperties?: {
    /** CSS classes extracted from inline attributes */
    className?: string[];

    /** Data attributes */
    [key: string]: string | number | boolean | (string | number)[] | null | undefined;
  };

  /** HTML element name override */
  hName?: string;

  /** Component metadata (for component blocks) */
  component?: {
    /** Component name */
    name: string;

    /** Component attributes */
    attributes: string[];
  };

  /** Modal attachment (inline content or ID reference) */
  modal?: string;

  /** Tooltip attachment (inline content or ID reference) */
  tooltip?: string;
}

/**
 * Extended MDAST Root with Taildown metadata
 */
export interface TaildownRoot extends Root {
  data?: TaildownNodeData;
}

/**
 * Extended MDAST Node with Taildown metadata
 */
export interface TaildownNode extends Node {
  data?: TaildownNodeData;
}

/**
 * Standard component names in Phase 1
 */
export type StandardComponent = 'card' | 'grid' | 'container';

/**
 * File extensions supported by Taildown
 */
export type TaildownExtension = '.td' | '.tdown' | '.taildown';

/**
 * Parse result with optional warnings
 */
export interface ParseResult {
  /** Parsed AST */
  ast: TaildownRoot;

  /** Parse warnings */
  warnings: CompilationWarning[];
}

