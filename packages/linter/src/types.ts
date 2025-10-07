import type { Root as MdastRoot } from 'mdast';

/**
 * Severity levels for lint messages
 */
export type Severity = 'error' | 'warning' | 'info';

/**
 * A lint message describing a problem found in the source
 */
export interface LintMessage {
  /** Severity level */
  severity: Severity;
  
  /** Rule identifier (e.g., 'tabs-heading-level') */
  rule: string;
  
  /** Human-readable message */
  message: string;
  
  /** 1-based line number */
  line: number;
  
  /** 1-based column number */
  column: number;
  
  /** End line (for multi-line issues) */
  endLine?: number;
  
  /** End column (for multi-line issues) */
  endColumn?: number;
  
  /** Suggested fix description */
  suggestion?: string;
  
  /** Whether this issue can be auto-fixed */
  fixable: boolean;
  
  /** Code snippet context */
  snippet?: string;
}

/**
 * Result of linting a file
 */
export interface LintResult {
  /** Source file path */
  filePath: string;
  
  /** All lint messages */
  messages: LintMessage[];
  
  /** Count by severity */
  errorCount: number;
  warningCount: number;
  infoCount: number;
  
  /** Number of fixable issues */
  fixableCount: number;
  
  /** Whether the file has any errors */
  hasErrors: boolean;
}

/**
 * Result of auto-fixing a file
 */
export interface FixResult {
  /** Original source */
  original: string;
  
  /** Fixed source */
  fixed: string;
  
  /** Whether any fixes were applied */
  modified: boolean;
  
  /** Number of fixes applied */
  fixCount: number;
  
  /** Remaining messages after fixes */
  messages: LintMessage[];
}

/**
 * Context provided to rules during checking
 */
export interface RuleContext {
  /** The MDAST tree */
  ast: MdastRoot;
  
  /** Original source text */
  source: string;
  
  /** Source file path */
  filePath: string;
  
  /** Lines of source (for context) */
  lines: string[];
  
  /** Report a lint message */
  report(message: Omit<LintMessage, 'rule' | 'fixable'>): void;
}

/**
 * Fix transformation result
 */
export interface FixTransform {
  /** Modified AST (if changed) */
  ast?: MdastRoot;
  
  /** Modified source (if changed) */
  source?: string;
  
  /** Description of what was fixed */
  description: string;
}

/**
 * Base interface for lint rules
 */
export interface LintRule {
  /** Unique rule identifier */
  name: string;
  
  /** Human-readable description */
  description: string;
  
  /** Default severity */
  severity: Severity;
  
  /** Rule category */
  category: 'component' | 'attribute' | 'syntax' | 'best-practice';
  
  /** Whether this rule can auto-fix */
  fixable: boolean;
  
  /** Check for violations */
  check(context: RuleContext): void;
  
  /** Apply auto-fix (if fixable) */
  fix?(context: RuleContext): FixTransform | null;
}

/**
 * Linter configuration
 */
export interface LinterConfig {
  /** Rule configurations */
  rules: Record<string, Severity | 'off'>;
  
  /** Auto-fix settings */
  autoFix?: {
    /** Auto-fix on save */
    onSave?: boolean;
    
    /** Only apply safe fixes */
    safeOnly?: boolean;
  };
  
  /** Files/patterns to ignore */
  ignore?: string[];
}

