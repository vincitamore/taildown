/**
 * Syntax Auto-Fixer for Taildown
 * Automatically corrects common syntax errors to improve developer experience
 * 
 * Philosophy:
 * - Fix common mistakes that don't change semantic meaning
 * - Follow the principle of least surprise
 * - Maintain backward compatibility with correct syntax
 * - Only fix unambiguous errors
 * 
 * Design Principles:
 * 1. **Safety First**: Only fix errors that have one clear correct interpretation
 * 2. **Non-Breaking**: Correct syntax must remain unchanged
 * 3. **Transparent**: Fixes should be obvious and intuitive
 * 4. **Minimal**: Only fix the most common, well-defined errors
 * 
 * See SYNTAX.md §3.2.3 for component attribute syntax specification
 */

/**
 * Configuration for syntax fixing behavior
 */
export interface SyntaxFixerOptions {
  /** Enable auto-fixing of common syntax errors (default: true) */
  enabled: boolean;
  
  /** Fix missing space between component name and attributes (default: true) */
  fixComponentAttributeSpacing: boolean;
  
  /** Log warnings when fixes are applied (default: false in production) */
  logWarnings: boolean;
}

/**
 * Default fixer options
 */
const DEFAULT_OPTIONS: SyntaxFixerOptions = {
  enabled: true,
  fixComponentAttributeSpacing: true,
  logWarnings: process.env.NODE_ENV === 'development',
};

/**
 * Statistics about fixes applied
 */
export interface FixerStats {
  /** Number of missing spaces fixed */
  componentAttributeSpacesFixes: number;
  
  /** Total number of fixes applied */
  totalFixes: number;
  
  /** Specific locations where fixes were applied */
  fixedLocations: Array<{
    line: number;
    original: string;
    fixed: string;
    type: string;
  }>;
}

/**
 * Apply automatic syntax fixes to Taildown source code
 * 
 * This function corrects common syntax errors that have unambiguous fixes:
 * - Missing space between component name and attributes: `:::card{attr}` → `:::card {attr}`
 * 
 * @param source - Raw Taildown source code
 * @param options - Fixer configuration options
 * @returns Fixed source code and statistics about fixes applied
 * 
 * @example
 * ```typescript
 * const { fixed, stats } = autoFixSyntax(':::card{elevated}\nContent\n:::');
 * // fixed = ':::card {elevated}\nContent\n:::'
 * // stats.componentAttributeSpacesFixes = 1
 * ```
 */
export function autoFixSyntax(
  source: string,
  options: Partial<SyntaxFixerOptions> = {}
): { fixed: string; stats: FixerStats } {
  const opts: SyntaxFixerOptions = { ...DEFAULT_OPTIONS, ...options };
  
  const stats: FixerStats = {
    componentAttributeSpacesFixes: 0,
    totalFixes: 0,
    fixedLocations: [],
  };
  
  if (!opts.enabled) {
    return { fixed: source, stats };
  }
  
  let fixed = source;
  
  // Fix 1: Missing space between component name and attributes
  // Pattern: :::component-name{attributes}
  // Fix:     :::component-name {attributes}
  if (opts.fixComponentAttributeSpacing) {
    fixed = fixComponentAttributeSpacing(fixed, stats, opts.logWarnings);
  }
  
  return { fixed, stats };
}

/**
 * Fix missing space between component name and attributes
 * 
 * Per SYNTAX.md §3.2.3:
 * "One space required between component name and attribute block"
 * 
 * Pattern matched:
 * - Starts with `:::` (component fence marker)
 * - Followed by component name: lowercase letters, digits, hyphens
 * - Immediately followed by `{` (no space)
 * 
 * Examples:
 * - `:::card{elevated}` → `:::card {elevated}`
 * - `:::grid{3}` → `:::grid {3}`
 * - `:::alert{type="info"}` → `:::alert {type="info"}`
 * 
 * Non-matches (preserved as-is):
 * - `:::card {elevated}` - Already correct
 * - `::card{attr}` - Wrong number of colons (not a component)
 * - Code blocks containing `:::` - Handled by parser, not by fixer
 * 
 * @param source - Source code to fix
 * @param stats - Statistics object to update
 * @param logWarnings - Whether to log warnings
 * @returns Fixed source code
 */
function fixComponentAttributeSpacing(
  source: string,
  stats: FixerStats,
  logWarnings: boolean
): string {
  // Regex explanation:
  // ^          - Start of line
  // :::        - Exactly three colons (component fence)
  // ([a-z]     - Component name must start with lowercase letter
  // [a-z0-9-]* - Followed by lowercase letters, digits, or hyphens
  // )          - Capture group 1: component name
  // \{         - Opening brace (NO space before it - this is the error)
  // ([^}]+)    - Capture group 2: attribute content (anything except closing brace)
  // \}         - Closing brace
  
  const componentAttributePattern = /^(:::)([a-z][a-z0-9-]*)\{([^}]+)\}/gm;
  
  const lines = source.split('\n');
  const fixedLines: string[] = [];
  
  lines.forEach((line, index) => {
    const match = componentAttributePattern.exec(line);
    
    if (match) {
      const [fullMatch, fence, componentName, attributes] = match;
      const fixed = `${fence}${componentName} {${attributes}}`;
      const lineNumber = index + 1;
      
      // Record the fix
      stats.componentAttributeSpacesFixes++;
      stats.totalFixes++;
      stats.fixedLocations.push({
        line: lineNumber,
        original: fullMatch,
        fixed,
        type: 'component-attribute-spacing',
      });
      
      // Log warning if enabled
      if (logWarnings) {
        console.warn(
          `[Taildown Syntax Fixer] Line ${lineNumber}: Added missing space\n` +
          `  Before: ${fullMatch}\n` +
          `  After:  ${fixed}`
        );
      }
      
      // Apply the fix to the line
      fixedLines.push(line.replace(fullMatch, fixed));
    } else {
      // No fix needed for this line
      fixedLines.push(line);
    }
    
    // Reset regex state for next iteration
    componentAttributePattern.lastIndex = 0;
  });
  
  return fixedLines.join('\n');
}

/**
 * Check if source contains common syntax errors
 * This can be used for validation/linting without applying fixes
 * 
 * @param source - Source code to check
 * @returns Array of syntax errors found
 */
export function checkSyntax(source: string): Array<{
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning';
  code: string;
}> {
  const errors: Array<{
    line: number;
    column: number;
    message: string;
    severity: 'error' | 'warning';
    code: string;
  }> = [];
  
  const lines = source.split('\n');
  const componentAttributePattern = /^:::([a-z][a-z0-9-]*)\{([^}]+)\}/;
  
  lines.forEach((line, index) => {
    const match = componentAttributePattern.exec(line);
    
    if (match) {
      const [fullMatch, componentName] = match;
      const column = line.indexOf(fullMatch);
      
      errors.push({
        line: index + 1,
        column: column + 3 + componentName.length, // Position of the {
        message: `Missing space between component name '${componentName}' and attributes. Should be ':::${componentName} {...}'.`,
        severity: 'warning',
        code: 'missing-component-attribute-space',
      });
    }
  });
  
  return errors;
}

/**
 * Format fixer stats for human-readable output
 * 
 * @param stats - Statistics from autoFixSyntax
 * @returns Formatted string
 */
export function formatFixerStats(stats: FixerStats): string {
  if (stats.totalFixes === 0) {
    return 'No syntax fixes needed ✓';
  }
  
  const lines: string[] = [
    `Applied ${stats.totalFixes} syntax fix${stats.totalFixes === 1 ? '' : 'es'}:`,
  ];
  
  if (stats.componentAttributeSpacesFixes > 0) {
    lines.push(
      `  - Fixed ${stats.componentAttributeSpacesFixes} missing space${stats.componentAttributeSpacesFixes === 1 ? '' : 's'} in component attributes`
    );
  }
  
  return lines.join('\n');
}

/**
 * Export default fixer options for external configuration
 */
export { DEFAULT_OPTIONS as defaultFixerOptions };
