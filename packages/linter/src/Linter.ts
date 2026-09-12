import type { Root as MdastRoot } from 'mdast';
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
  async lint(source: string, filePath: string = 'unknown.td'): Promise<LintResult> {
    // Parse source to MDAST
    const ast = await this.parse(source);
    const lines = source.split('\n');
    const messages: LintMessage[] = [];

    // Run each enabled rule
    for (const [ruleName, rule] of this.rules) {
      // Check if rule is enabled in config
      const ruleConfig = this.config.rules[ruleName];
      if (ruleConfig === 'off') continue;

      // Override severity if configured
      const severity: Severity =
        typeof ruleConfig === 'string'
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
  async fix(source: string, filePath: string = 'unknown.td'): Promise<FixResult> {
    let currentSource = source;
    let currentAst = await this.parse(currentSource);
    let fixCount = 0;
    const failures: LintMessage[] = [];

    for (const [ruleName, rule] of this.rules) {
      if (!rule.fixable || !rule.fix || this.config.rules[ruleName] === 'off') continue;
      const context: RuleContext = {
        // A failed or unsupported custom fix must not mutate the next rule's AST.
        ast: structuredClone(currentAst),
        source: currentSource,
        filePath,
        lines: currentSource.split('\n'),
        report: () => {},
      };
      try {
        const transform = rule.fix(context);
        if (!transform) continue;
        if (typeof transform.source !== 'string') {
          throw new Error('Fixes must return source text; AST-only fixes cannot be serialized');
        }
        if (transform.source === currentSource) continue;
        const nextAst = await this.parse(transform.source);
        currentSource = transform.source;
        currentAst = nextAst;
        fixCount++;
      } catch (error) {
        failures.push({
          severity: 'error', rule: ruleName, line: 1, column: 1, fixable: false,
          message: `Rule '${ruleName}' failed during fix: ${error instanceof Error ? error.message : String(error)}`,
        });
      }
    }

    const lintResult = await this.lint(currentSource, filePath);
    return {
      original: source,
      fixed: currentSource,
      modified: currentSource !== source,
      fixCount,
      messages: [...failures, ...lintResult.messages].sort((a, b) => a.line - b.line || a.column - b.column),
    };
  }
  /**
   * Parse Taildown source to MDAST
   */
  private parse(source: string): Promise<MdastRoot> {
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

