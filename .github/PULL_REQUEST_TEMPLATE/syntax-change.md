---
name: Syntax Change PR
about: Pull request implementing a syntax specification change
---

## Related RFC
<!-- Link to the RFC issue that was approved -->
Implements #

## Change Summary
<!-- Brief description of what's changing -->

## Change Category
<!-- Check one -->
- [ ] Clarification (patch version)
- [ ] Addition (minor version)
- [ ] Breaking Change (major version)
- [ ] Deprecation (minor version for deprecation, major for removal)

## Changes Made

### 1. SYNTAX.md Updated
- [ ] Grammar updated
- [ ] Parsing rules documented
- [ ] Examples added
- [ ] Edge cases documented
- [ ] Version history updated

### 2. Test Fixtures Created
- [ ] Input `.td` files added to `syntax-tests/fixtures/` (primary extension)
- [ ] Expected `.ast.json` files created
- [ ] Tests cover all examples from SYNTAX.md
- [ ] Edge cases have tests

> Note: Test files should use `.td` extension. The compiler also accepts `.tdown` and `.taildown`.

### 3. Implementation Complete
- [ ] Parser implementation updated
- [ ] All new tests passing
- [ ] All existing tests still passing (no regressions)
- [ ] Code references SYNTAX.md section (e.g., `// See SYNTAX.md §2.1`)

### 4. Documentation Updated
- [ ] README.md updated (if user-facing)
- [ ] tech-spec.md updated (if architecture affected)
- [ ] phase-1-implementation-plan.md updated (if in Phase 1 scope)
- [ ] Examples updated (if relevant)

### 5. Migration (Breaking Changes Only)
- [ ] Migration guide written
- [ ] Migration tool provided (if feasible)
- [ ] Deprecation warnings added (if phased)

## Testing

### Conformance Level
<!-- Which conformance level tests must pass? -->
- [ ] Level 1 (Core): 01, 02, 03
- [ ] Level 2 (Standard): 01, 02, 03, 04
- [ ] Level 3 (Full): 01, 02, 03, 04, 05

### Test Results
```
# Paste test output here
pnpm test:syntax
```

### Manual Testing
<!-- Describe manual testing performed -->
- [ ] Compiled example documents
- [ ] Tested edge cases manually
- [ ] Verified error messages are clear

## Breaking Changes
<!-- If this is a breaking change, explain impact -->

### Impact Assessment
- Number of test documents affected:
- Percentage of example docs requiring changes:
- Estimated user impact (low/medium/high):

### Migration Example
<!-- Show before/after for affected documents -->

**Before:**
```taildown
```

**After:**
```taildown
```

## Version Bump
<!-- What version number should this be? -->
- Current: v0.1.0
- Proposed: v
- Justification:

## Checklist

### For All Changes
- [ ] I have read and followed [`SYNTAX-CHANGES.md`](../../SYNTAX-CHANGES.md)
- [ ] SYNTAX.md is updated first (spec-driven)
- [ ] Test fixtures demonstrate all examples
- [ ] All tests pass
- [ ] No regressions in existing tests
- [ ] Documentation is synchronized

### For Additions
- [ ] Change is backward compatible
- [ ] Doesn't conflict with reserved syntax
- [ ] Examples in SYNTAX.md are comprehensive

### For Breaking Changes
- [ ] Justification is compelling
- [ ] No reasonable non-breaking alternative exists
- [ ] Migration path is clear and documented
- [ ] Community discussion period completed
- [ ] Three maintainer approvals obtained

### For Deprecations
- [ ] Deprecation notice added to SYNTAX.md
- [ ] Parser emits deprecation warnings
- [ ] Sunset date set (minimum 6 months out)
- [ ] Replacement syntax documented

## Reviewer Notes
<!-- Additional context for reviewers -->

---

**For Maintainers:**
- [ ] RFC was approved
- [ ] Discussion period completed
- [ ] Sufficient approvals (2 for additions, 3 for breaking)
- [ ] CI passing
- [ ] Version bump appropriate
- [ ] CHANGELOG entry prepared
