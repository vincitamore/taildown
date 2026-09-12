# Custom Directive Parser Implementation Plan

**Date:** 2025-10-04  
**Status:** Planning  
**Priority:** Critical - Phase 1 Blocker

---

## Executive Summary

We need to replace `remark-directive` with a custom component block parser that correctly implements SYNTAX.md §3. The third-party library does not handle blank lines between nested components correctly, and attempting to fix it post-parse with AST transformations leads to unreliable, hacky code that will be a maintenance nightmare.

**Decision:** Write a custom, specification-compliant directive parser as a unified plugin.

---

## Problem Statement

### Current Issues with remark-directive

1. **Blank Line Handling**: When a blank line appears after a nested component's closing `:::`, remark-directive interprets it as closing ALL parent directives, not just the inner one.

2. **Specification Violation**: SYNTAX.md §3.3.2 explicitly states "Indentation is NOT significant" and examples in README.md show blank lines between sibling components in grids.

3. **Non-Standard Behavior**: The closing `:::` should close the most recently opened component (stack-based, LIFO), but remark-directive treats blank lines as significant delimiters.

4. **Orphaned Fences**: Causes `<p>:::</p>` to appear in output when parsing fails.

5. **Incorrect Nesting**: Only the first nested component ends up inside parent containers; subsequent siblings are rendered at the wrong nesting level.

### Example of Broken Behavior

**Input:**
```taildown
:::grid
:::card
Item 1
:::

:::card
Item 2
:::

:::card
Item 3
:::
:::
```

**Expected:** Grid contains 3 cards as children  
**Actual:** Grid contains only 1 card; cards 2 and 3 are siblings of the grid

---

## Requirements

### Functional Requirements

1. **FR-1**: Parse `:::component-name` fence markers at the start of lines
2. **FR-2**: Parse `:::` close markers at the start of lines
3. **FR-3**: Support optional attribute blocks after component name: `:::card {.class}`
4. **FR-4**: Implement stack-based nesting (LIFO - Last In, First Out)
5. **FR-5**: Allow blank lines between nested sibling components
6. **FR-6**: Support unlimited nesting depth
7. **FR-7**: Parse content inside components as standard Taildown (recursive)
8. **FR-8**: Auto-close unclosed components at document end (with warning)
9. **FR-9**: Validate component names against regex `[a-z][a-z0-9-]*`
10. **FR-10**: Extract inline attributes from fence lines

### Non-Functional Requirements

1. **NFR-1**: Performance: Parse in O(n) time relative to document length
2. **NFR-2**: Integration: Work as a unified remark plugin
3. **NFR-3**: Testing: 100% code coverage with comprehensive test suite
4. **NFR-4**: Maintainability: Clear, well-documented code with inline spec references
5. **NFR-5**: Compatibility: Preserve all standard Markdown parsing via remark-parse
6. **NFR-6**: Error Handling: Graceful degradation with helpful warnings

---

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│  Input: Taildown Source (.td)                              │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: remark-parse (Standard Markdown)                  │
│  Output: MDAST with no directive awareness                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Custom Directive Parser (NEW)                     │
│  - Scan for ::: markers in text nodes and paragraphs       │
│  - Extract component blocks with correct nesting           │
│  - Create containerDirective nodes                         │
│  - Parse content inside components recursively             │
│  Output: MDAST with proper containerDirective nodes        │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3: Extract Inline Attributes                         │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 4: Process Components (add metadata)                 │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│  Final AST: TaildownRoot                                    │
└─────────────────────────────────────────────────────────────┘
```

### Why Post-Parse Instead of Pre-Parse?

**Option A: Pre-process source text**
- ❌ Lose positional information for error reporting
- ❌ Risk breaking other Markdown syntax
- ❌ Complex string manipulation

**Option B: Post-process MDAST (CHOSEN)**
- ✅ Work with structured AST
- ✅ Preserve positional information
- ✅ Can recursively parse component content
- ✅ Clean separation of concerns

---

## Implementation Details

### Parser Algorithm

**Phase 1: Flatten and Mark**
1. Walk MDAST depth-first
2. Identify lines starting with `:::` (these become "markers")
3. Classify markers as OPEN (has name) or CLOSE (just `:::`)
4. Build a flat list of (marker, sourcePosition) tuples

**Phase 2: Build Component Tree**
1. Use a stack to track open components
2. Iterate through content and markers sequentially
3. When OPEN marker found:
   - Parse component name and attributes
   - Create containerDirective node
   - Push to stack
   - Start collecting children
4. When CLOSE marker found:
   - Pop from stack
   - Attach collected children to popped component
   - Add component to parent's children (or root)
5. When regular content found:
   - Add to current component's children (or root if stack empty)
6. At end: auto-close remaining stack items (emit warnings)

**Phase 3: Recursive Content Parsing**
1. For each component's children, recursively parse as Taildown
2. This allows nested Markdown, attributes, and components

### Data Structures

```typescript
interface ComponentMarker {
  type: 'open' | 'close';
  name?: string;          // Only for 'open'
  attributes?: string[];  // Extracted from {.class} syntax
  position: Position;     // For error reporting
  lineNumber: number;
}

interface ComponentFrame {
  node: ContainerDirective;
  name: string;
  openPosition: Position;
  children: Content[];    // Accumulate children here
}

type Content = Paragraph | Heading | List | /* any MDAST node */;
```

### Integration Points

**Input:** MDAST from remark-parse  
**Output:** MDAST with containerDirective nodes

**Plugin Signature:**
```typescript
import type { Plugin } from 'unified';
import type { Root } from 'mdast';

export const parseDirectives: Plugin<[], Root> = () => {
  return (tree: Root, file: VFile) => {
    // Transform tree in place
    tree.children = extractDirectives(tree.children, file);
  };
};
```

---

## Implementation Phases

### Phase 1: Core Parser (High Priority)

**Files to Create:**
- `packages/compiler/src/parser/directive-parser.ts` - Main parser logic
- `packages/compiler/src/parser/directive-types.ts` - Type definitions
- `packages/compiler/src/parser/directive-scanner.ts` - Scan for ::: markers
- `packages/compiler/src/parser/directive-builder.ts` - Build component tree

**Key Functions:**
```typescript
// Scan AST for ::: markers
function scanForMarkers(nodes: Content[]): ComponentMarker[]

// Parse component name and attributes from marker
function parseComponentMarker(text: string): ComponentMarker | null

// Build component tree from flat list of markers and content
function buildComponentTree(
  content: Content[], 
  markers: ComponentMarker[]
): Content[]

// Validate component name
function isValidComponentName(name: string): boolean

// Extract attributes from fence line
function extractFenceAttributes(text: string): string[]
```

**Integration:**
```typescript
// In packages/compiler/src/parser/index.ts
import { parseDirectives } from './directive-parser';

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(parseDirectives)  // REPLACE remark-directive
  .use(extractInlineAttributes, { warnings })
  .use(processComponents, { warnings });
```

### Phase 2: Testing (Concurrent with Phase 1)

**Test Files:**
- `packages/compiler/src/parser/__tests__/directive-scanner.test.ts`
- `packages/compiler/src/parser/__tests__/directive-parser.test.ts`
- `packages/compiler/src/parser/__tests__/directive-nesting.test.ts`
- `packages/compiler/src/parser/__tests__/directive-edge-cases.test.ts`

**Test Categories:**
1. **Basic Parsing**
   - Single component
   - Component with content
   - Empty component
   - Component with attributes

2. **Nesting**
   - Two-level nesting
   - Three-level nesting
   - Siblings at same level
   - Blank lines between siblings

3. **Edge Cases**
   - Unclosed components
   - Extra closing fences
   - Invalid component names
   - ::: in code blocks (should not parse)
   - ::: in inline code (should not parse)
   - Component names with uppercase (invalid)
   - Component names with special chars (invalid)

4. **Integration**
   - Components with Markdown content
   - Nested Markdown in components
   - Components with inline attributes
   - Mixed content and components

### Phase 3: Validation & Error Handling

**Error Types:**
```typescript
interface DirectiveError {
  type: 'unclosed-component' | 'invalid-name' | 'extra-close';
  message: string;
  position: Position;
  suggestion?: string;
}
```

**Validation Rules:**
1. Component names must match `[a-z][a-z0-9-]*`
2. Unclosed components trigger warnings
3. Extra `:::` without matching open triggers warning
4. Provide helpful error messages with line numbers

### Phase 4: Performance Optimization

**Targets:**
- Single-pass scanning where possible
- Avoid repeated regex compilation
- Reuse string buffers
- Profile with documents of various sizes (10 KB, 100 KB, 1 MB)

**Benchmarks:**
- Small doc (<50 nodes): <10ms
- Medium doc (50-200 nodes): <50ms
- Large doc (200-1000 nodes): <200ms

### Phase 5: Documentation

**Documents to Update:**
1. **SYNTAX.md**: Add implementation notes section
2. **tech-spec.md**: Document custom parser architecture
3. **CONTRIBUTING.md**: Add notes about directive parser
4. **Code Comments**: JSDoc for all public functions with SYNTAX.md references

---

## Testing Strategy

### Unit Tests

**Test Coverage Targets:**
- `directive-scanner.ts`: 100% coverage
- `directive-parser.ts`: 100% coverage
- `directive-builder.ts`: 100% coverage

**Key Test Cases:**
```typescript
describe('Directive Parser', () => {
  describe('Basic Parsing', () => {
    it('should parse single component');
    it('should parse component with content');
    it('should parse empty component');
    it('should parse component with attributes');
  });

  describe('Nesting', () => {
    it('should parse two-level nesting');
    it('should parse siblings without blank lines');
    it('should parse siblings with blank lines'); // CRITICAL
    it('should parse three-level nesting');
    it('should handle mixed nesting depths');
  });

  describe('Edge Cases', () => {
    it('should auto-close unclosed components');
    it('should ignore ::: in code blocks');
    it('should ignore ::: in inline code');
    it('should reject invalid component names');
    it('should handle empty document');
    it('should handle document with no components');
  });

  describe('Error Handling', () => {
    it('should warn on unclosed components');
    it('should warn on invalid component names');
    it('should warn on extra closing fences');
    it('should provide line numbers in warnings');
  });
});
```

### Integration Tests

**Use Existing Fixtures:**
- `syntax-tests/fixtures/03-component-blocks/`
- All existing test cases should pass with new parser

**New Fixtures:**
- `03-component-blocks/04-blank-lines.td` - Siblings with blank lines
- `03-component-blocks/05-deep-nesting.td` - 5+ level nesting
- `03-component-blocks/06-error-handling.td` - Malformed syntax

### Regression Tests

**Ensure No Breaking Changes:**
- All existing tests must continue to pass
- Markdown parsing unaffected
- Inline attributes still work
- Component metadata still added correctly

---

## Migration Plan

### Step 1: Development (Week 1)

**Day 1-2: Scaffold**
- Create new files
- Define interfaces
- Write function signatures
- Add TODO comments

**Day 3-4: Core Logic**
- Implement scanner
- Implement marker parser
- Implement tree builder
- Add validation

**Day 5: Testing**
- Write unit tests
- Fix bugs found in testing
- Achieve 100% coverage

### Step 2: Integration (Week 1)

**Day 6: Replace remark-directive**
- Update `parser/index.ts`
- Remove `remark-directive` dependency
- Update `package.json`
- Remove `fix-nesting.ts` workaround

**Day 7: Verification**
- Run full test suite
- Fix any integration issues
- Update test fixtures if needed
- Run manual tests with example documents

### Step 3: Cleanup (Week 1)

- Delete `fix-nesting.ts`
- Remove `remark-directive` from dependencies
- Update documentation
- Commit with detailed message

---

## Risk Assessment

### Technical Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Parser bug causes incorrect nesting | High | Medium | Comprehensive test suite, TDD approach |
| Performance regression | Medium | Low | Benchmark before/after, O(n) algorithm |
| Breaking existing tests | High | Medium | Run tests continuously during dev |
| Edge cases not handled | Medium | Medium | Extensive edge case testing |

### Timeline Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Implementation takes longer than 1 week | Medium | Start immediately, focus on core first |
| Bugs found late in testing | High | TDD approach, test as we build |
| Integration issues | Medium | Plan integration carefully, small steps |

---

## Success Criteria

### Definition of Done

- [ ] Custom directive parser fully implements SYNTAX.md §3
- [ ] All existing tests pass (19/19)
- [ ] New tests for blank line handling pass
- [ ] No `<p>:::</p>` in rendered output
- [ ] Grid components properly contain all child cards
- [ ] No orphaned closing fences
- [ ] 100% code coverage for new parser code
- [ ] Performance benchmarks met (<200ms for large docs)
- [ ] Documentation updated
- [ ] `remark-directive` dependency removed
- [ ] All warning/error messages helpful and clear

### Verification Steps

1. **Automated Tests:** `pnpm test` shows 19/19 passing
2. **Manual Verification:** Compile test-example.td and verify HTML structure
3. **Edge Case Testing:** Test with pathological inputs
4. **Performance Testing:** Benchmark with large documents
5. **Documentation Review:** Ensure all docs updated

---

## Code Quality Standards

### Requirements

1. **TypeScript Strict Mode**: All code must pass strict type checking
2. **ESLint**: Zero linting errors
3. **Prettier**: All code formatted consistently
4. **Comments**: JSDoc for all exported functions
5. **Spec References**: Comment with SYNTAX.md section numbers
6. **Tests**: TDD approach, write tests first
7. **Coverage**: Minimum 100% for parser code
8. **No any**: Avoid `any` types; use proper typing

### Code Review Checklist

- [ ] All functions have JSDoc comments
- [ ] Complex logic has inline comments
- [ ] Error messages are helpful
- [ ] SYNTAX.md section references included
- [ ] No hardcoded values (use constants)
- [ ] Types are specific (no `any`)
- [ ] Edge cases handled
- [ ] Performance considered
- [ ] Tests written and passing

---

## Alternative Approaches Considered

### ❌ Option 1: Fix remark-directive with AST transformations
**Rejected because:** Leads to unreliable, hacky code that's hard to maintain

### ❌ Option 2: Pre-process source text before parsing
**Rejected because:** Loses positional information, risks breaking other syntax

### ❌ Option 3: Fork and modify remark-directive
**Rejected because:** Maintenance burden, not aligned with our spec

### ✅ Option 4: Write custom parser as unified plugin (CHOSEN)
**Selected because:** 
- Full control over behavior
- Spec-compliant by design
- Clean integration with unified pipeline
- Maintainable long-term
- No external dependency issues

---

## Future Enhancements

### Post-Phase 1

1. **Attribute Parsing**: Support more complex attributes beyond classes
2. **Named Slots**: Allow named content regions in components
3. **Component Validation**: Validate component existence
4. **Custom Components**: User-defined component types
5. **Conditional Rendering**: `:::if` type directives
6. **Loops**: `:::for` type directives

These are explicitly out of scope for Phase 1 but documented for future reference.

---

## References

- **SYNTAX.md §3**: Component Blocks specification
- **README.md**: User-facing examples with blank lines
- **tech-spec.md**: Overall architecture
- **remark-directive source**: Understanding current behavior
- **unified plugin docs**: Plugin architecture patterns

---

## Questions for Final Review

Before implementation begins, confirm:

1. ✅ Custom parser approach approved?
2. ✅ Timeline of 1 week acceptable?
3. ✅ 100% test coverage requirement understood?
4. ✅ Breaking changes to test fixtures acceptable if needed?
5. ✅ Performance targets reasonable?

---

**Next Steps:**
1. Review and approve this plan
2. Create feature branch: `feature/custom-directive-parser`
3. Begin implementation following TDD approach
4. Daily progress updates
5. Final review and merge

---

**Document Status:** Ready for Review  
**Approved By:** [Pending]  
**Implementation Start Date:** [TBD]

