/**
 * Taildown Linter
 * 
 * Professional linter for Taildown syntax with auto-fix capabilities.
 * Provides helpful, informative feedback on syntax errors and potential issues.
 */

export { Linter } from './Linter';
export { BaseRule } from './rules/BaseRule';

// Export all rules
export { TabsHeadingLevelRule } from './rules/TabsHeadingLevelRule';
export { InvalidComponentNameRule } from './rules/InvalidComponentNameRule';

// Export types
export type {
  LintRule,
  LintMessage,
  LintResult,
  FixResult,
  RuleContext,
  FixTransform,
  LinterConfig,
  Severity,
} from './types';

// Create a default linter instance with all rules
import { Linter } from './Linter';
import { TabsHeadingLevelRule } from './rules/TabsHeadingLevelRule';
import { InvalidComponentNameRule } from './rules/InvalidComponentNameRule';

/**
 * Create a linter with all built-in rules registered
 */
export function createLinter(config?: Partial<import('./types').LinterConfig>): Linter {
  const linter = new Linter(config);
  
  // Register all built-in rules
  linter.registerRules([
    new TabsHeadingLevelRule(),
    new InvalidComponentNameRule(),
    // More rules will be added here
  ]);
  
  return linter;
}

