/**
 * Type definitions for Custom Directive Parser
 * See SYNTAX.md §3 for component block specification
 * See CUSTOM-DIRECTIVE-PARSER-PLAN.md for implementation details
 */

import type { Position } from 'unist';
import type { Content } from 'mdast';

/**
 * Component marker found during scanning phase
 * Represents a ::: line in the source document
 */
export interface ComponentMarker {
  /** Type of marker - 'open' has a name, 'close' is just ::: */
  type: 'open' | 'close';
  
  /** Component name (e.g., 'card', 'grid') - only for 'open' markers */
  name?: string;
  
  /** CSS classes extracted from {.class} syntax on fence line */
  classes?: string[];
  
  /** Key-value attributes extracted from {key="value"} syntax on fence line */
  attributes?: Record<string, string | null | undefined> | null;
  
  /** Source position for error reporting */
  position: Position;
  
  /** Line number in source (1-indexed) */
  lineNumber: number;
  
  /** Original text of the marker line */
  originalText: string;
}

/**
 * Stack frame for tracking open components during tree building
 * Uses stack-based (LIFO) nesting per SYNTAX.md §3.2.4
 */
export interface ComponentFrame {
  /** The containerDirective node being built */
  node: ContainerDirectiveNode;
  
  /** Component name for validation */
  name: string;
  
  /** Position where component was opened (for error reporting) */
  openPosition: Position;
  
  /** Children accumulated so far */
  children: Content[];
}

/**
 * ContainerDirective node type matching remark-directive's structure
 * This is what we'll output to maintain compatibility
 */
export interface ContainerDirectiveNode {
  type: 'containerDirective';
  name: string;
  attributes?: Record<string, string | null | undefined> | null;
  children: Content[];
  data?: {
    hName?: string;
    hProperties?: {
      className?: string[];
      [key: string]: unknown;
    };
    component?: {
      name: string;
      attributes: string[];
    };
  };
  position?: Position;
}

/**
 * Scanning result containing content and markers in document order
 */
export interface ScanResult {
  /** Flat list of all content nodes */
  content: Content[];
  
  /** Flat list of all markers found */
  markers: ComponentMarker[];
  
  /** Combined list in document order for sequential processing */
  items: ScanItem[];
}

/**
 * Item in the sequential scan - either content or a marker
 */
export type ScanItem = 
  | { type: 'content'; node: Content; position: Position }
  | { type: 'marker'; marker: ComponentMarker };

/**
 * Options for the parseDirectives plugin
 */
export interface ParseDirectivesOptions {
  /** Whether to emit warnings for validation issues */
  warnings?: boolean;
  
  /** Callback for warning messages */
  onWarning?: (message: string, position?: Position) => void;
}

/**
 * Validation error for component markers
 */
export interface ValidationError {
  type: 'invalid-name' | 'unclosed-component' | 'extra-close' | 'malformed-attributes';
  message: string;
  position: Position;
  suggestion?: string;
}

