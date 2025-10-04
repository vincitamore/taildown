---
name: Syntax RFC
about: Propose a change to the Taildown syntax specification
title: '[RFC] '
labels: ['syntax', 'rfc']
assignees: ''
---

## Summary
<!-- Brief one-sentence description of the proposed change -->

## Change Category
<!-- Check one -->
- [ ] Clarification (no behavioral change)
- [ ] Addition (backward compatible new syntax)
- [ ] Breaking Change (alters parsing of existing documents)
- [ ] Deprecation (mark syntax for future removal)

## Motivation
<!-- Why is this change needed? What problem does it solve? -->

## Use Cases
<!-- Real-world examples of when this would be used -->

```taildown
<!-- Example Taildown code showing the proposed syntax -->
```

## Proposed Syntax
<!-- Concrete examples with before/after if applicable -->

### Grammar
<!-- EBNF or BNF grammar if relevant -->

```ebnf
```

### Examples
<!-- Multiple examples showing different scenarios -->

```taildown
```

## Alternatives Considered
<!-- What other approaches were considered and why were they rejected? -->

## Backward Compatibility
<!-- Does this break existing documents? If so, how many and what's the migration path? -->
- [ ] Fully backward compatible
- [ ] Potentially breaking (explain below)
- [ ] Definitely breaking (explain migration below)

### Migration Path
<!-- If breaking, how should users update their documents? -->

## Implementation Complexity
<!-- How difficult is this to implement? Any special parser considerations? -->
- [ ] Simple (few lines of code)
- [ ] Moderate (new parser rules)
- [ ] Complex (significant refactoring)

### Implementation Notes
<!-- Technical details for implementers -->

## Test Fixtures
<!-- Propose test cases that should be added to syntax-tests/ -->

### Input
```taildown
```

### Expected AST
```json
```

## Related Issues
<!-- Links to related discussions or issues -->
- Related to #
- Depends on #
- Blocks #

## Checklist
<!-- Before submitting -->
- [ ] I have read [`SYNTAX-CHANGES.md`](../../SYNTAX-CHANGES.md)
- [ ] I have searched for similar proposals
- [ ] I have considered backward compatibility
- [ ] I have provided concrete examples
- [ ] I am prepared to help with implementation (if approved)

---

**For Maintainers:**
- [ ] Categorized correctly
- [ ] Sufficient detail provided
- [ ] Community discussion period: ___ to ___
- [ ] Decision: Approved / Needs revision / Rejected
