# Taildown Linter Architecture

## Overview

The Taildown Linter provides helpful, professional feedback on syntax errors and potential issues in `.td` files. It's designed to be joyful to use, not annoying - concise, informative, and with intelligent auto-fix capabilities.

## Core Philosophy

1. **Helpful, Not Pedantic**: Only flag real issues that affect compilation or user experience
2. **Informative Messages**: Clear explanations with actionable suggestions
3. **Smart Auto-Fix**: Safe, predictable fixes that preserve user intent
4. **Performance**: Fast enough to run on every save
5. **Extensible**: Easy to add new rules as syntax evolves

## Architecture

### Core Components

```typescript
// 1. LintMessage - The output format
interface LintMessage {
  severity: 'error' | 'warning' | 'info';
  rule: string;              // e.g., 'tabs-heading-level'
  message: string;           // Human-readable message
  line: number;              // 1-based line number
  column: number;            // 1-based column number
  suggestion?: string;       // Suggested fix
  fixable: boolean;          // Can be auto-fixed?
}

// 2. LintRule - Individual rule interface
interface LintRule {
  name: string;              // Unique rule identifier
  description: string;       // What the rule checks
  severity: 'error' | 'warning' | 'info';
  
  // Check AST for violations
  check(ast: MdastRoot, source: string): LintMessage[];
  
  // Apply auto-fix (if fixable)
  fix?(ast: MdastRoot, source: string): { ast: MdastRoot; source: string };
}

// 3. Linter - Main orchestrator
class Linter {
  private rules: Map<string, LintRule>;
  private config: LinterConfig;
  
  registerRule(rule: LintRule): void;
  lint(source: string): LintResult;
  fix(source: string): FixResult;
}
```

### Data Flow

```
.td file
   |
   v
Parser → MDAST
   |
   v
Linter.lint()
   |
   +-- Rule 1 → check() → LintMessage[]
   +-- Rule 2 → check() → LintMessage[]
   +-- Rule 3 → check() → LintMessage[]
   |
   v
Collect & Sort Messages
   |
   v
Display to User
```

### Auto-Fix Flow

```
.td file
   |
   v
Parser → MDAST
   |
   v
Linter.fix()
   |
   +-- Rule 1 → fix() → Modified MDAST
   +-- Rule 2 → fix() → Modified MDAST
   |
   v
MDAST → Serialize → Fixed .td file
```

## Rule Categories

### 1. Component Structure Rules
- **tabs-heading-level**: Tabs must use h2/h3, not h4+
- **accordion-structure**: Accordion uses bold text, not headings
- **carousel-separators**: Carousel needs `---` between slides
- **unclosed-components**: Detect missing closing `::`

### 2. Attribute Rules
- **invalid-anchor-id**: IDs must start with letter, no spaces
- **multiple-anchor-ids**: Only one `#id` per attribute block
- **malformed-attributes**: Detect unclosed `{}`, missing quotes
- **unknown-plain-english**: Detect typos in shorthands

### 3. Component-Specific Rules
- **modal-without-content**: Modal needs content or ID reference
- **tooltip-without-trigger**: Tooltip must attach to element
- **invalid-component-name**: Detect typos (tabes, acordion)

### 4. Syntax Rules
- **link-attribute-spacing**: No space between `](url){attrs}`
- **heading-attribute-position**: Attributes at end of line only

## Message Format

### Error Example
```
[ERROR] tabs-heading-level (line 45, col 1)
Tabs component requires h2 or h3 headings, found h4

  43 | :::tabs
  44 | ### Tab One
> 45 | #### Tab Two
     | ^^^^ Use ### instead of ####
  46 | Content here
  
Suggestion: Change to ### for proper tab parsing
Auto-fix available: taildown lint --fix
```

### Warning Example
```
[WARNING] unknown-plain-english (line 12, col 15)
Unknown shorthand 'primry', did you mean 'primary'?

> 12 | # Title {large-boldd primry}
     |                      ^^^^^^
     
Suggestion: Use 'primary' instead
```

### Info Example
```
[INFO] modal-best-practice (line 8, col 1)
Consider using ID reference for reusable modal content

> 8 | [Click](#){button modal="Long content here..."}
    
Suggestion: Define modal with :::modal{id="my-modal"} for reusability
```

## Auto-Fix Strategy

### Safe Fixes (Always Applied)
- Heading level corrections (h4 → h3 in tabs)
- Typo corrections with high confidence (tabes → tabs)
- Adding missing closing `::`
- Removing multiple anchor IDs (keep first)
- Normalizing whitespace in attributes

### Suggested Fixes (Require Confirmation)
- Plain English typo corrections with lower confidence
- Structural changes (bold → heading, heading → bold)
- Component name changes

### No Fix (Manual Intervention)
- Malformed markdown structure
- Ambiguous intent (could mean multiple things)
- Breaking changes to content meaning

## Configuration

`.taildownrc.json`:
```json
{
  "rules": {
    "tabs-heading-level": "error",
    "accordion-structure": "error",
    "unknown-plain-english": "warning",
    "modal-best-practice": "info"
  },
  "autoFix": {
    "onSave": true,
    "safeOnly": true
  },
  "ignore": [
    "examples/**",
    "test-files/**"
  ]
}
```

## CLI Integration

```bash
# Lint single file
taildown lint file.td

# Lint with auto-fix
taildown lint --fix file.td

# Lint entire directory
taildown lint docs-site/

# Show only errors
taildown lint --severity error file.td

# Output as JSON
taildown lint --format json file.td
```

## Performance Targets

- Lint 1000-line file: < 50ms
- Auto-fix 1000-line file: < 100ms
- Memory usage: < 10MB per file
- Zero dependencies beyond existing @taildown packages

## Testing Strategy

Each rule has:
1. **Valid cases** - Should produce no messages
2. **Invalid cases** - Should catch the error
3. **Fix cases** - Auto-fix produces correct output
4. **Edge cases** - Boundary conditions

Example test structure:
```typescript
describe('TabsHeadingLevelRule', () => {
  it('passes valid tabs with h2 headings', () => {
    const result = lint(':::tabs\n## Tab\nContent\n:::');
    expect(result.messages).toHaveLength(0);
  });
  
  it('flags h4 in tabs', () => {
    const result = lint(':::tabs\n#### Tab\nContent\n:::');
    expect(result.messages[0].rule).toBe('tabs-heading-level');
  });
  
  it('auto-fixes h4 to h3', () => {
    const fixed = fix(':::tabs\n#### Tab\nContent\n:::');
    expect(fixed.source).toContain('### Tab');
  });
});
```

## Future Enhancements

1. **VSCode Integration**: Real-time linting in editor
2. **Quick Fixes**: Click to apply suggestions
3. **Batch Fixes**: Fix all instances of a rule
4. **Custom Rules**: User-defined lint rules
5. **Rule Explanations**: Detailed docs for each rule
6. **Performance Metrics**: Track lint time and memory

## Philosophy: "Joyful Linting"

A great linter is:
- **Fast**: No noticeable lag
- **Accurate**: Low false positive rate
- **Helpful**: Clear, actionable messages
- **Smart**: Context-aware suggestions
- **Respectful**: Assumes competence, not incompetence
- **Delightful**: Makes writing Taildown easier and more fun

