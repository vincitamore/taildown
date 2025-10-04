# Taildown Syntax Change Management Process

**Version:** 1.0.0  
**Date:** 2025-10-04  
**Status:** Active

---

## Purpose

This document defines the process for proposing, evaluating, and implementing changes to the Taildown syntax specification. Following this process ensures that:

1. **Syntax remains stable** - Changes are deliberate and well-considered
2. **Breaking changes are minimized** - Backward compatibility is preserved when possible
3. **Community can participate** - Changes are discussed openly
4. **Documentation stays synchronized** - All docs reflect current syntax
5. **Implementations stay compliant** - Parser updates follow spec changes

---

## Principles

### Stability Over Features
- **Favor stability**: Only add syntax when there's a clear, compelling need
- **Minimize breaking changes**: Preserve backward compatibility whenever possible
- **Deprecate gracefully**: Give users time to migrate when changes are necessary

### Community-Driven
- **Open discussion**: All changes discussed publicly before implementation
- **Diverse input**: Seek feedback from different user perspectives
- **Document rationale**: Explain why each change is needed

### Specification-First
- **Spec before code**: Update SYNTAX.md before implementing
- **Test fixtures first**: Write test cases demonstrating desired behavior
- **Implementation follows**: Code implements the spec, not the other way around

---

## Change Categories

### Category 1: Clarifications
**Definition:** Changes that clarify ambiguous language without changing behavior

**Examples:**
- Rewording confusing sections
- Adding examples to illustrate existing rules
- Fixing typos or grammatical errors

**Impact:** None - no parser changes needed  
**Version Bump:** Patch (e.g., 0.1.0 → 0.1.1)  
**Process:** Lightweight (see below)

---

### Category 2: Additions
**Definition:** New syntax that doesn't conflict with existing valid documents

**Examples:**
- Adding support for images with attributes
- Introducing new component types
- Adding new shorthand style mappings

**Impact:** Backward compatible - old documents still parse correctly  
**Version Bump:** Minor (e.g., 0.1.0 → 0.2.0 pre-1.0, or 1.0.0 → 1.1.0 post-1.0)  
**Process:** Standard (see below)

---

### Category 3: Breaking Changes
**Definition:** Changes that alter parsing of previously valid documents

**Examples:**
- Changing attribute syntax from `{.class}` to `[.class]`
- Changing component fence from `:::` to `+++`
- Removing support for previously valid syntax

**Impact:** Breaking - old documents may parse differently or fail  
**Version Bump:** Major (e.g., 0.1.0 → 0.2.0 pre-1.0, or 1.0.0 → 2.0.0 post-1.0)  
**Process:** Extensive (see below)

---

### Category 4: Deprecations
**Definition:** Marking syntax as deprecated with intent to remove in future

**Examples:**
- Announcing that old attribute syntax will be removed in v2.0
- Deprecating specific component names in favor of new ones

**Impact:** Warning - syntax still works but generates deprecation warnings  
**Version Bump:** Minor (deprecation announcement), Major (removal)  
**Process:** Phased (see below)

---

## Process Workflows

### Lightweight Process (Clarifications)

1. **Open Issue** 
   - Title: `[CLARIFICATION] Brief description`
   - Label: `syntax`, `clarification`
   - Describe the confusing section and proposed clarification

2. **Quick Review**
   - Maintainer reviews within 48 hours
   - Confirms no behavioral change

3. **PR with Changes**
   - Update `SYNTAX.md`
   - Update version history
   - Link to issue

4. **Merge**
   - Single maintainer approval required
   - Patch version bump

**Timeline:** 1-3 days

---

### Standard Process (Additions)

1. **Proposal Phase** (1-2 weeks)
   
   **Open RFC Issue:**
   - Title: `[RFC] Feature name`
   - Label: `syntax`, `rfc`, `addition`
   - Include:
     - **Motivation**: Why is this needed?
     - **Use cases**: Real-world examples
     - **Proposed syntax**: Concrete examples
     - **Alternatives considered**: What else was explored?
     - **Backward compatibility**: Confirm no breaking changes

   **Community Discussion:**
   - Gather feedback from users and maintainers
   - Iterate on proposal based on feedback
   - Reach rough consensus

2. **Specification Phase** (1 week)
   
   **Create Draft PR:**
   - Update `SYNTAX.md` with:
     - New syntax rules
     - Grammar additions
     - Examples
     - Test references
   - Create test fixtures in `syntax-tests/fixtures/`
     - Input `.tdown` files
     - Expected `.ast.json` files
   - Update `SYNTAX.md` version history

3. **Implementation Phase** (1-2 weeks)
   
   **Reference Implementation:**
   - Implement in reference parser (TypeScript)
   - Pass all new test fixtures
   - Pass all existing tests (regression check)
   - Update phase-1 implementation plan if needed

4. **Documentation Phase** (1 week)
   
   **Update All Docs:**
   - Update README.md if needed
   - Update tech-spec.md if architecture affected
   - Update examples if relevant
   - Add migration notes if needed

5. **Review & Approval**
   
   **Requirements:**
   - Two maintainer approvals
   - All tests passing in CI
   - No unresolved feedback

6. **Merge & Release**
   - Merge PR
   - Bump minor version
   - Tag release
   - Update changelog
   - Announce in discussions

**Timeline:** 3-5 weeks

---

### Extensive Process (Breaking Changes)

Breaking changes follow the Standard Process with these additional requirements:

1. **Justification Phase** (2-4 weeks)
   
   **Higher Bar for Approval:**
   - Must demonstrate significant value
   - Must show no reasonable non-breaking alternative
   - Must include migration path
   - Must consider ecosystem impact

   **Gather Evidence:**
   - Survey existing documents (how many affected?)
   - Analyze parser complexity improvement
   - Evaluate user experience gains

2. **Extended Discussion**
   - Minimum 2-week discussion period
   - Post in multiple channels (issues, discussions, discord)
   - Explicitly call out breaking nature

3. **Migration Tools** (if feasible)
   
   **Provide Migration Support:**
   - Write migration guide
   - Consider automated migration tool (`taildown migrate`)
   - Provide codemod or script if possible

4. **Staged Rollout** (Pre-1.0 only)
   
   **For Pre-1.0 Breaking Changes:**
   - Can be bundled in minor version (e.g., 0.1.0 → 0.2.0)
   - Must be clearly documented in changelog
   
   **For Post-1.0 Breaking Changes:**
   - Require major version bump (e.g., 1.0.0 → 2.0.0)
   - Consider deprecation path first

5. **Review & Approval**
   
   **Requirements:**
   - Three maintainer approvals (vs two for additions)
   - Community consensus (no strong objections)
   - Migration guide complete

**Timeline:** 6-12 weeks

---

### Phased Process (Deprecations)

1. **Phase 1: Deprecation Announcement**
   
   **In Current Version:**
   - Mark syntax as `[DEPRECATED]` in SYNTAX.md
   - Parser emits deprecation warnings
   - Document replacement syntax
   - Set sunset date (minimum 6 months out, 12 months for post-1.0)

2. **Phase 2: Deprecation Period**
   
   **During Deprecation:**
   - All docs show new syntax
   - Migration guide available
   - Parser warnings guide to new syntax
   - Support both old and new syntax

3. **Phase 3: Removal**
   
   **In Future Major Version:**
   - Remove deprecated syntax
   - Update parser to reject old syntax
   - Clear error messages pointing to migration guide
   - Major version bump

**Timeline:** Minimum 6 months (pre-1.0), 12 months (post-1.0)

---

## Roles & Responsibilities

### Proposer (Anyone)
- Open RFC issue
- Respond to feedback
- Revise proposal
- Create PR if approved

### Maintainers (Core Team)
- Review proposals
- Guide discussion
- Approve/reject changes
- Merge approved PRs

### Community (All Users)
- Provide feedback
- Share use cases
- Test proposals
- Report issues

---

## Decision Making

### Consensus Model
- Aim for rough consensus, not unanimity
- Address substantial objections
- Maintainers make final call if consensus unclear

### Veto Power
- Maintainers can veto breaking changes
- Must provide detailed reasoning
- Can be overridden by unanimous maintainer vote

---

## Version Numbering

### Pre-1.0 (Current)
- **Major (0.x.0)**: Breaking changes allowed
- **Minor (0.0.x)**: Additions and clarifications
- **Patch (0.0.0)**: Clarifications only

### Post-1.0 (Semantic Versioning)
- **Major (x.0.0)**: Breaking changes only
- **Minor (0.x.0)**: Backward-compatible additions
- **Patch (0.0.x)**: Backward-compatible fixes/clarifications

---

## Communication

### Channels
- **GitHub Issues**: Formal proposals and RFCs
- **GitHub Discussions**: Informal discussion and questions
- **Discord**: Real-time chat (planned)
- **Blog**: Major change announcements

### Templates

#### RFC Issue Template
```markdown
## Summary
Brief one-sentence description.

## Motivation
Why is this change needed? What problem does it solve?

## Use Cases
Real-world examples of when this would be used.

## Proposed Syntax
Concrete examples showing the proposed syntax.

## Alternatives Considered
What other approaches were considered and why were they rejected?

## Backward Compatibility
Does this break existing documents? If so, how many and what's the migration path?

## Implementation Complexity
How difficult is this to implement? Any special parser considerations?

## Related Issues
Links to related discussions or issues.
```

#### Deprecation Notice Template
```markdown
## Syntax Deprecation Notice

**Syntax:** `old-syntax-here`  
**Status:** Deprecated in v0.X.0  
**Removal:** Planned for v0.Y.0 (Date)  
**Replacement:** `new-syntax-here`

### Reason
Why is this being deprecated?

### Migration Guide
How to update your documents:

1. Find usage: `grep -r "old-syntax" .`
2. Replace with: `new-syntax`
3. Test: `taildown compile`

### Automated Migration
```bash
taildown migrate --from=0.X.0 --to=0.Y.0 file.tdown
```

### Questions?
Open an issue with label `deprecated-syntax`.
```

---

## Examples

### Example 1: Clarification (Lightweight)

**Scenario:** Users confused about whether spaces are required around attribute blocks.

**Process:**
1. Open issue: "[CLARIFICATION] Spaces around attribute blocks"
2. Maintainer reviews, confirms no behavioral change
3. PR updates SYNTAX.md:
   - Add examples: `{.class}` vs `{ .class }`
   - Clarify: "Whitespace inside braces is trimmed"
4. Merge, patch bump: 0.1.0 → 0.1.1

**Timeline:** 2 days

---

### Example 2: Addition (Standard)

**Scenario:** Users want to add attributes to images.

**Process:**
1. RFC issue: "[RFC] Image attributes support"
   - Motivation: Images should support styling like other elements
   - Syntax: `![alt](url){.class}`
2. Discussion: 2 weeks, consensus reached
3. Draft PR:
   - Update SYNTAX.md Rule 2.3: Add images to supported elements
   - Create test fixtures: `02-inline-attributes/03-images.tdown`
4. Implement in parser
5. Update README examples
6. Two approvals, merge, minor bump: 0.1.0 → 0.2.0

**Timeline:** 4 weeks

---

### Example 3: Breaking Change (Extensive)

**Scenario:** Component fence syntax conflicts with other tools, propose change from `:::` to `+++`.

**Process:**
1. RFC issue: "[RFC][BREAKING] Change component fence to +++"
   - Motivation: `:::` conflicts with Asciidoc, causes issues in mixed docs
   - Evidence: Survey shows 15% of users affected
   - Migration: Automated script provided
2. Extended discussion: 4 weeks
   - Pushback: "Why not both?"
   - Conclusion: Consistency > compatibility, must choose one
3. Draft PR with migration tool
4. Test migration on all example docs
5. Three approvals after extensive review
6. Merge in v0.2.0 with clear breaking change notice
7. Deprecation period: Support both for 6 months
8. Remove `:::` in v1.0.0

**Timeline:** 12 weeks + 6 month deprecation period

---

## Frequently Asked Questions

### Q: Who can propose syntax changes?
**A:** Anyone! Open an issue with the RFC template.

### Q: How long does the process take?
**A:** 
- Clarifications: 1-3 days
- Additions: 3-5 weeks
- Breaking changes: 6-12 weeks

### Q: Can I propose multiple changes at once?
**A:** Yes, but each should be a separate RFC for focused discussion.

### Q: What if my proposal is rejected?
**A:** Maintainers will explain the reasoning. You can revise and resubmit, or accept the decision.

### Q: How do I stay updated on syntax changes?
**A:** 
- Watch the GitHub repo
- Subscribe to the `syntax` label
- Check the CHANGELOG

### Q: What's the difference between SYNTAX.md and this document?
**A:**
- **SYNTAX.md**: What the syntax IS (specification)
- **SYNTAX-CHANGES.md**: How the syntax CHANGES (process)

---

## Document History

### v1.0.0 (2025-10-04)
- Initial version
- Defined four change categories
- Established three process workflows
- Created communication templates

---

## References

- **SYNTAX.md** - Canonical syntax specification
- **RFC 2119** - Key words for standards (MUST, SHOULD, etc.)
- **Semantic Versioning** - https://semver.org/
- **Rust RFC Process** - Inspiration for our RFC process
- **Python PEP Process** - Inspiration for our proposal workflow

---

**Maintained by:** Taildown Core Team  
**Questions?** Open an issue with label `syntax-process`  
**License:** CC BY 4.0
