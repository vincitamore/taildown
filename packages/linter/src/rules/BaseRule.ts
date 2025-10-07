import type { LintRule, Severity, RuleContext } from '../types';

/**
 * Base class for lint rules providing common functionality
 */
export abstract class BaseRule implements LintRule {
  abstract readonly name: string;
  abstract readonly description: string;
  abstract readonly severity: Severity;
  abstract readonly category: 'component' | 'attribute' | 'syntax' | 'best-practice';
  abstract readonly fixable: boolean;

  abstract check(context: RuleContext): void;

  fix?(context: RuleContext): any {
    return null;
  }

  /**
   * Get source line context for error messages
   */
  protected getLineContext(context: RuleContext, line: number, contextLines: number = 2): string {
    const { lines } = context;
    const start = Math.max(0, line - contextLines - 1);
    const end = Math.min(lines.length, line + contextLines);
    
    const snippet: string[] = [];
    for (let i = start; i < end; i++) {
      const lineNum = (i + 1).toString().padStart(4, ' ');
      const prefix = i === line - 1 ? '>' : ' ';
      snippet.push(`${prefix} ${lineNum} | ${lines[i]}`);
      
      // Add pointer for the error line
      if (i === line - 1) {
        snippet.push(`       | ${''.padStart(lines[i].length, '^')}`);
      }
    }
    
    return snippet.join('\n');
  }

  /**
   * Calculate line and column from position in source
   */
  protected getPosition(source: string, position: number): { line: number; column: number } {
    const before = source.substring(0, position);
    const lines = before.split('\n');
    return {
      line: lines.length,
      column: lines[lines.length - 1].length + 1,
    };
  }
}

