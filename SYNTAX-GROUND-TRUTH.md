# Taildown Syntax Ground Truth System

**Established:** 2025-10-04  
**Purpose:** Document the implementation of Taildown's singular ground truth syntax source

---

## Overview

This document describes the "gold standard" syntax specification system established for Taildown, ensuring coherence and preventing contradictions throughout the project's lifecycle.

---

## The Ground Truth Architecture

### Three Pillars

1. **Formal Specification** (`SYNTAX.md`)
   - Single source of truth for all syntax rules
   - Complete EBNF grammar
   - Detailed parsing rules for all edge cases
   - Versioned with semantic versioning
   - Cross-referenced by all other documentation

2. **Executable Tests** (`syntax-tests/`)
   - Test fixtures that ARE the specification
   - Input `.tdown` files + expected `.ast.json` output
   - Organized by conformance level
   - Impossible for implementation to drift from spec
   - Automated validation on every commit

3. **Change Management** (`SYNTAX-CHANGES.md`)
   - Rigorous process for syntax evolution
   - Different workflows for clarifications, additions, breaking changes
   - Community RFC process
   - Specification-first development (spec → tests → implementation)
   - Clear versioning policy

---

## Key Design Decisions

### 1. Specification-Driven Development

**Principle:** Specification always comes before implementation.

**Process:**
1. Propose change in RFC
2. Update `SYNTAX.md` with new rules
3. Create test fixtures demonstrating behavior
4. Implement parser to match specification
5. Update all documentation

**Why:** Prevents implementation quirks from becoming accidental specification.

---

### 2. Test Fixtures as Executable Specification

**Principle:** If your parser passes all test fixtures, it conforms to Taildown syntax.

**Structure:**
```
syntax-tests/fixtures/
├── 01-markdown-compatibility/    [REQUIRED]
├── 02-inline-attributes/          [REQUIRED]
├── 03-component-blocks/           [REQUIRED]
├── 04-edge-cases/                 [REQUIRED]
└── 05-integration/                [RECOMMENDED]
```

**Each test:**
- `NN-test-name.tdown` - Input
- `NN-test-name.ast.json` - Expected AST
- `NN-test-name.html` - Expected HTML (Phase 1+)
- `NN-test-name.css` - Expected CSS (Phase 1+)

**Why:** Tests can't lie. If the test passes, the behavior is correct.

---

### 3. Conformance Levels

**Level 1 (Core):** Pass tests 01, 02, 03
- Basic Markdown compatibility
- Inline attributes
- Component blocks

**Level 2 (Standard):** Pass tests 01, 02, 03, 04
- Everything in Level 1
- Edge cases and error handling

**Level 3 (Full):** Pass tests 01, 02, 03, 04, 05
- Everything in Level 2
- Complex integration scenarios

**Why:** Allows incremental implementation while maintaining clear compliance targets.

---

### 4. Change Categories with Appropriate Processes

| Category | Impact | Process | Timeline |
|----------|--------|---------|----------|
| **Clarification** | None (docs only) | Lightweight | 1-3 days |
| **Addition** | Backward compatible | Standard RFC | 3-5 weeks |
| **Breaking Change** | Potentially breaking | Extended RFC + migration | 6-12 weeks |
| **Deprecation** | Warning (phased removal) | Deprecation notice + grace period | 6-12 months |

**Why:** Different changes need different levels of scrutiny and community involvement.

---

### 5. Documentation Hierarchy

**Primary (Source of Truth):**
- `SYNTAX.md` - What the syntax IS

**Secondary (References Primary):**
- `README.md` - User-facing overview, links to SYNTAX.md
- `tech-spec.md` - Technical architecture, defers to SYNTAX.md for syntax details
- `phase-1-implementation-plan.md` - Implementation guide, references SYNTAX.md

**Process:**
- `SYNTAX-CHANGES.md` - How the syntax CHANGES
- `CONTRIBUTING.md` - How to contribute (including syntax)

**Why:** Clear hierarchy prevents conflicting information and documentation drift.

---

## Implementation Safeguards

### 1. Cross-References in Code

All parser implementation code references the specification:

```typescript
// See SYNTAX.md §2.2.1 - Attribute Position
if (node.type === 'heading') {
  // Implementation follows spec
}
```

**Why:** Makes it easy to trace implementation back to authoritative spec.

---

### 2. Automated Test Suite

```bash
# Reference test suite validates conformance
pnpm test:syntax

# Runs against all fixtures in syntax-tests/
# Parser must match expected AST exactly
```

**Why:** Continuous validation prevents regressions and drift.

---

### 3. PR Templates and Issue Templates

- `.github/ISSUE_TEMPLATE/syntax-rfc.md` - Structured syntax proposals
- `.github/PULL_REQUEST_TEMPLATE/syntax-change.md` - Ensures all steps followed

**Why:** Process enforcement at the tooling level.

---

### 4. Version Control in SYNTAX.md

Every syntax version has:
- **Version number** (semantic versioning)
- **Date** of specification
- **Change history** documenting what changed
- **Stability level** (Experimental, Stable, Deprecated)

**Why:** Clear audit trail of syntax evolution.

---

## Benefits of This System

### For Implementation
✅ **No ambiguity** - Every edge case documented  
✅ **Clear target** - Test fixtures show exactly what behavior is expected  
✅ **Regression prevention** - Tests catch breaking changes immediately  
✅ **Multiple implementations possible** - Any language can implement against same spec

### For Users
✅ **Stability** - Syntax won't change without notice  
✅ **Predictability** - Documented behavior for all edge cases  
✅ **Clear documentation** - Single source of truth, no conflicts  
✅ **Upgrade confidence** - Migration paths for any breaking changes

### For Contributors
✅ **Clear process** - Know exactly how to propose changes  
✅ **Fair evaluation** - All proposals follow same process  
✅ **Specification-first** - Write the spec before the code  
✅ **Community involvement** - Open discussion for all changes

### For Maintainers
✅ **Change control** - Rigorous process prevents hasty decisions  
✅ **Documentation sync** - Impossible for docs to drift from reality  
✅ **Version management** - Clear versioning policy  
✅ **Quality assurance** - All changes validated by tests

---

## File Structure

```
taildown/
├── SYNTAX.md                          # ⭐ Canonical specification
├── SYNTAX-CHANGES.md                  # Change management process
├── syntax-tests/                      # ⭐ Executable specification
│   ├── fixtures/                      # Test input/output pairs
│   │   ├── 01-markdown-compatibility/
│   │   ├── 02-inline-attributes/
│   │   ├── 03-component-blocks/
│   │   ├── 04-edge-cases/
│   │   └── 05-integration/
│   ├── reference.test.ts              # Test runner
│   └── README.md                      # Test documentation
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   └── syntax-rfc.md              # RFC template
│   └── PULL_REQUEST_TEMPLATE/
│       └── syntax-change.md           # Syntax PR template
├── CONTRIBUTING.md                    # Contributor guide
├── README.md                          # → References SYNTAX.md
├── tech-spec.md                       # → References SYNTAX.md
└── phase-1-implementation-plan.md     # → References SYNTAX.md
```

---

## Comparison to Other Approaches

### What We Didn't Do (And Why Not)

❌ **Scattered Examples**
- Problem: Examples in multiple docs can contradict each other
- Our solution: Single canonical spec with all examples

❌ **Implementation as Spec**
- Problem: Implementation bugs become accidental specification
- Our solution: Specification written first, implementation follows

❌ **No Formal Grammar**
- Problem: Ambiguous parsing rules, incompatible implementations
- Our solution: Complete EBNF grammar in SYNTAX.md

❌ **Ad-Hoc Changes**
- Problem: Syntax evolves without consideration or notice
- Our solution: Rigorous change management process

❌ **Test-Only Specification**
- Problem: Hard to understand what's valid without running tests
- Our solution: Human-readable spec + machine-validated tests

---

## Evolution Strategy

### Pre-1.0 (Current)
- **Experimentation allowed** - Can make breaking changes
- **Rapid iteration** - Shorter RFC timelines acceptable
- **Breaking changes bundled** - Can include multiple in one minor version
- **Stability increasing** - Each version should be more stable than last

### Post-1.0 (Future)
- **Stability paramount** - Breaking changes only when absolutely necessary
- **Long deprecation periods** - Minimum 12 months for deprecated syntax
- **Semantic versioning** - Major version for breaking changes only
- **LTS support** - Long-term support for major versions

---

## Success Metrics

### Specification Quality
✅ Every syntax feature documented in SYNTAX.md  
✅ All edge cases have explicit parsing rules  
✅ Complete EBNF grammar covers all valid syntax  
✅ Version history tracks all changes

### Test Coverage
✅ Test fixture for every example in SYNTAX.md  
✅ Edge cases have dedicated test files  
✅ Integration tests for complex documents  
✅ 100% of syntax features covered by tests

### Documentation Coherence
✅ No contradictions between documents  
✅ All docs reference SYNTAX.md as authority  
✅ Examples work as written  
✅ Cross-references maintained

### Process Compliance
✅ All syntax changes follow SYNTAX-CHANGES.md process  
✅ RFC discussions before implementation  
✅ Specification updated before code  
✅ Community involvement in decisions

---

## Lessons Learned (Future Reference)

### What Worked Well
1. **Specification-first approach** prevents implementation quirks
2. **Test fixtures as spec** makes compliance unambiguous
3. **Clear change categories** with different processes
4. **Conformance levels** allow incremental implementation
5. **Cross-referencing** keeps all docs in sync

### What to Watch For
1. **Specification becoming too rigid** - Balance stability with evolution
2. **Process becoming too heavy** - Adjust if slowing necessary changes
3. **Test maintenance burden** - Keep fixtures focused and maintainable
4. **Community participation** - Ensure process doesn't discourage contributions
5. **Breaking change pressure** - Resist unless truly necessary

---

## Related Documents

- [`SYNTAX.md`](SYNTAX.md) - Canonical syntax specification
- [`SYNTAX-CHANGES.md`](SYNTAX-CHANGES.md) - Change management process
- [`syntax-tests/README.md`](syntax-tests/README.md) - Test suite documentation
- [`CONTRIBUTING.md`](CONTRIBUTING.md) - Contributor guidelines
- [`README.md`](README.md) - Project overview

---

## Maintenance

This document should be updated when:
- Ground truth system structure changes
- New types of safeguards are added
- Process improvements are discovered
- Lessons learned need to be documented

**Last Updated:** 2025-10-04  
**Maintained by:** Taildown Core Team
