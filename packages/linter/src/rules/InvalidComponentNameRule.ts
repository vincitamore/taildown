import { visit } from 'unist-util-visit';
import type { ContainerDirective } from 'mdast';
import { BaseRule } from './BaseRule';
import type { RuleContext, FixTransform } from '../types';

/**
 * Rule: Detect typos in component names
 * 
 * Catches common misspellings like "tabes", "acordion", "carouse", etc.
 * and suggests the correct component name.
 */
export class InvalidComponentNameRule extends BaseRule {
  readonly name = 'invalid-component-name';
  readonly description = 'Detect typos in component names';
  readonly severity = 'error';
  readonly category = 'component';
  readonly fixable = true;

  // Valid component names
  private readonly validComponents = new Set([
    'tabs', 'accordion', 'carousel', 'card', 'grid', 'alert',
    'modal', 'tooltip', 'navbar', 'button-group', 'badge',
    'breadcrumb', 'pagination', 'progress', 'skeleton',
    'avatar', 'sidebar', 'tree', 'flow',
  ]);

  // Common typos and their corrections
  private readonly typoMap: Record<string, string> = {
    'tabes': 'tabs',
    'taps': 'tabs',
    'tab': 'tabs',
    'acordion': 'accordion',
    'accordion': 'accordion',
    'accordian': 'accordion',
    'carouse': 'carousel',
    'carosel': 'carousel',
    'carousell': 'carousel',
    'modals': 'modal',
    'tooltips': 'tooltip',
    'navbars': 'navbar',
    'navebar': 'navbar',
    'alerts': 'alert',
    'cards': 'card',
    'grids': 'grid',
  };

  check(context: RuleContext): void {
    const { ast } = context;

    visit(ast, 'containerDirective', (node: ContainerDirective) => {
      const componentName = node.name;
      
      // Check if it's a known valid component
      if (this.validComponents.has(componentName)) {
        return;
      }

      // Check if it's a known typo
      const suggestion = this.typoMap[componentName.toLowerCase()];
      const position = node.position;
      
      if (!position) return;

      if (suggestion) {
        // Known typo with suggestion
        context.report({
          severity: this.severity,
          message: `Unknown component '${componentName}', did you mean '${suggestion}'?`,
          line: position.start.line,
          column: position.start.column,
          suggestion: `Replace ':::${componentName}' with ':::${suggestion}'`,
          snippet: this.getLineContext(context, position.start.line),
        });
      } else {
        // Unknown component, might be a typo
        const similar = this.findSimilar(componentName);
        const suggestionText = similar.length > 0
          ? ` Did you mean: ${similar.slice(0, 3).map((s) => `'${s}'`).join(', ')}?`
          : '';

        context.report({
          severity: 'warning',
          message: `Unknown component '${componentName}'.${suggestionText}`,
          line: position.start.line,
          column: position.start.column,
          suggestion: similar.length > 0 ? `Use one of the valid components` : 'Check component name spelling',
          snippet: this.getLineContext(context, position.start.line),
        });
      }
    });
  }

  fix(context: RuleContext): FixTransform | null {
    let { source } = context;
    let modified = false;

    // Only fix known typos (high confidence)
    visit(context.ast, 'containerDirective', (node: ContainerDirective) => {
      const componentName = node.name;
      const suggestion = this.typoMap[componentName.toLowerCase()];
      
      if (suggestion && node.position) {
        // Replace the typo with correct name
        const start = node.position.start.offset;
        const openingTag = `:::${componentName}`;
        
        if (start !== undefined && source.substring(start, start + openingTag.length) === openingTag) {
          source = source.substring(0, start) + 
                   `:::${suggestion}` +
                   source.substring(start + openingTag.length);
          modified = true;
        }
      }
    });

    if (!modified) return null;

    return {
      source,
      description: 'Fixed component name typos',
    };
  }

  /**
   * Find similar component names using Levenshtein distance
   */
  private findSimilar(name: string): string[] {
    const similar: Array<{ name: string; distance: number }> = [];

    for (const valid of this.validComponents) {
      const distance = this.levenshtein(name.toLowerCase(), valid.toLowerCase());
      if (distance <= 2) {
        // Only suggest if within 2 character changes
        similar.push({ name: valid, distance });
      }
    }

    // Sort by distance
    similar.sort((a, b) => a.distance - b.distance);
    
    return similar.map((s) => s.name);
  }

  /**
   * Calculate Levenshtein distance between two strings
   */
  private levenshtein(a: string, b: string): number {
    const matrix: number[][] = [];

    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }
}

