import type { Root as MdastRoot } from 'mdast';
import { unified } from 'unified';
import { parse as parseTaildown } from '@taildown/compiler';
import type {
  LintRule,
  LintMessage,
  LintResult,
  FixResult,
  RuleContext,
  LinterConfig,
  Severity,
} from './types';

/**
 * Main Linter class that orchestrates rule checking and fixing
 */
export class Linter {
  private rules: Map<string, LintRule> = new Map();
  private config: LinterConfig;

  constructor(config: Partial<LinterConfig> = {}) {
    this.config = {
      rules: config.rules || {},
      autoFix: config.autoFix || { onSave: false, safeOnly: true },
      ignore: config.ignore || [],
    };
  }

  /**
   * Register a lint rule
   */
  registerRule(rule: LintRule): void {
    this.rules.set(rule.name, rule);
  }

  /**
   * Register multiple rules at once
   */
  registerRules(rules: LintRule[]): void {
    for (const rule of rules) {
      this.registerRule(rule);
    }
  }

  /**
   * Lint a Taildown source file
   */
  lint(source: string, filePath: string = 'unknown.td'): LintResult {
    // Parse source to MDAST
    const ast = this.parse(source);
    const lines = source.split('\n');
    const messages: LintMessage[] = [];

    // Run each enabled rule
    for (const [ruleName, rule] of this.rules) {
      // Check if rule is enabled in config
      const ruleConfig = this.config.rules[ruleName];
      if (ruleConfig === 'off') continue;

      // Override severity if configured
      const severity: Severity =
        typeof ruleConfig === 'string' && ruleConfig !== 'off'
          ? ruleConfig
          : rule.severity;

      // Create rule context
      const context: RuleContext = {
        ast,
        source,
        filePath,
        lines,
        report: (msg) => {
          messages.push({
            ...msg,
            rule: ruleName,
            fixable: rule.fixable,
            severity,
          });
        },
      };

      // Run the rule
      try {
        rule.check(context);
      } catch (error) {
        // Rule crashed - report as error
        messages.push({
          severity: 'error',
          rule: ruleName,
          message: `Rule '${ruleName}' crashed: ${error instanceof Error ? error.message : String(error)}`,
          line: 1,
          column: 1,
          fixable: false,
        });
      }
    }

    // Sort messages by line, then column
    messages.sort((a, b) => {
      if (a.line !== b.line) return a.line - b.line;
      return a.column - b.column;
    });

    // Calculate counts
    const errorCount = messages.filter((m) => m.severity === 'error').length;
    const warningCount = messages.filter((m) => m.severity === 'warning').length;
    const infoCount = messages.filter((m) => m.severity === 'info').length;
    const fixableCount = messages.filter((m) => m.fixable).length;

    return {
      filePath,
      messages,
      errorCount,
      warningCount,
      infoCount,
      fixableCount,
      hasErrors: errorCount > 0,
    };
  }

  /**
   * Auto-fix issues in source
   */
  fix(source: string, filePath: string = 'unknown.td'): FixResult {
    let currentSource = source;
    let currentAst = this.parse(currentSource);
    let fixCount = 0;
    const appliedRules = new Set<string>();

    // Apply fixes from each fixable rule
    for (const [ruleName, rule] of this.rules) {
      if (!rule.fixable || !rule.fix) continue;

      // Check if rule is enabled
      const ruleConfig = this.config.rules[ruleName];
      if (ruleConfig === 'off') continue;

      // Create context
      const lines = currentSource.split('\n');
      const context: RuleContext = {
        ast: currentAst,
        source: currentSource,
        filePath,
        lines,
        report: () => {}, // No reporting during fix
      };

      try {
        const transform = rule.fix(context);
        if (transform) {
          // Apply the transformation
          if (transform.source) {
            currentSource = transform.source;
            currentAst = this.parse(currentSource);
          } else if (transform.ast) {
            currentAst = transform.ast;
            // Serialize AST back to source if needed
          }
          fixCount++;
          appliedRules.add(ruleName);
        }
      } catch (error) {
        // Skip rule that fails during fix
        console.error(`Rule '${ruleName}' failed during fix:`, error);
      }
    }

    // Lint the fixed source to get remaining issues
    const lintResult = this.lint(currentSource, filePath);

    return {
      original: source,
      fixed: currentSource,
      modified: fixCount > 0,
      fixCount,
      messages: lintResult.messages,
    };
  }

  /**
   * Parse Taildown source to MDAST
   */
  private parse(source: string): MdastRoot {
    return parseTaildown(source);
  }

  /**
   * Get all registered rules
   */
  getRules(): LintRule[] {
    return Array.from(this.rules.values());
  }

  /**
   * Get a specific rule by name
   */
  getRule(name: string): LintRule | undefined {
    return this.rules.get(name);
  }
}

