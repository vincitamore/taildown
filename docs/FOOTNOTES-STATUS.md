# Footnotes System - Implementation Status

## Executive Summary

The Footnotes System is **partially complete** with CSS and JavaScript fully implemented, but the parser requires additional work due to issues with the deprecated `remark-footnotes` plugin.

---

## ✅ Completed Components

### 1. CSS Styles (`packages/compiler/src/renderer/css.ts`)

**Status:** ✅ **COMPLETE** (~195 lines)

- Footnote section styling with proper separators
- Superscript reference styling (`[1]` format)
- Footnote list with custom markers
- Backlink styling (↩ arrows)
- Hover preview tooltip styles (positioned, animated)
- Target highlighting when navigating via anchors
- Dark mode support
- Responsive adjustments for mobile
- **Location:** Lines 5500-5696

### 2. JavaScript Behavior (`packages/compiler/src/js-generator/behaviors/footnote.ts`)

**Status:** ✅ **COMPLETE** (~800 bytes, ~0.8KB)

- Hover preview on footnote references (300ms delay)
- Tooltip positioning (centered below reference, stays on-screen)
- Smooth scroll to footnotes and back
- Auto-close on scroll
- Event delegation for performance
- **Features:**
  - Preview shows footnote content without backlink
  - Fade-in/fade-out animations
  - Mobile-friendly touch support
  - Accessible keyboard navigation

### 3. JavaScript Registration

**Status:** ✅ **COMPLETE**

- Registered in `packages/compiler/src/js-generator/index.ts`
- Behavior name: `footnotes`
- Tree-shaken (only included if footnotes are used)

---

## ❌ Incomplete Components

### 1. Parser (`packages/compiler/src/parser/footnote-parser.ts`)

**Status:** ❌ **BLOCKED**

**Issue:** The `remark-footnotes` npm package is deprecated and has ES module resolution issues. It cannot be reliably imported in our ESM-based compiler.

**What Exists:**
- Parser file created with logic for processing footnotes
- Expects `footnoteReference` and `footnoteDefinition` MDAST nodes
- Auto-numbering logic implemented
- Footnote section generation implemented

**What's Needed:**
A custom parser that directly transforms Markdown source into MDAST nodes, without relying on `remark-footnotes`. This requires:

#### Implementation Tasks

1. **Reference Pattern Parser** (`[^id]`)
   - Regex: `/\[\^([a-zA-Z0-9-]+)\]/g`
   - Convert matches to `footnoteReference` nodes
   - Track order of appearance for numbering

2. **Definition Pattern Parser** (`[^id]: content`)
   - Regex: `/^\[\^([a-zA-Z0-9-]+)\]:\s+(.+)$/gm`
   - Support multi-paragraph definitions (indented continuation)
   - Convert to `footnoteDefinition` nodes
   - Handle inline formatting within definitions

3. **Inline Footnote Parser** (`^[content]`)
   - Regex: `/\^\[([^\]]+)\]/g`
   - Generate auto-numbered IDs (`inline-1`, `inline-2`, etc.)
   - Convert to reference + definition pair

4. **AST Transformation**
   - Insert footnote nodes into the MDAST tree
   - Auto-number based on first appearance
   - Generate footnote section at document end
   - Add ARIA roles and semantic HTML attributes

5. **Edge Cases**
   - Escaped brackets (`\[^id\]`)
   - Footnotes in code blocks (should be ignored)
   - Nested formatting in footnotes
   - Multiple references to same footnote
   - Unused footnote definitions

#### Alternative Approaches

**Option A:** Custom Regex Parser (Recommended)
- Full control over syntax
- No external dependencies
- Can handle Taildown-specific extensions
- Estimated: 200-250 LOC

**Option B:** Directive-Based Syntax
- Use existing directive system: `:::footnote {id="ref1"}`
- References: `[text](#fn-ref1)`
- Simpler to implement
- Less Markdown-like syntax
- Estimated: 50-100 LOC

**Option C:** Wait for `remark-gfm` Update
- GFM spec may add footnotes in future
- Would require `remark-gfm` v5+
- Timeline uncertain
- May not align with our desired syntax

---

## Current Files

### Created
- ✅ `packages/compiler/src/parser/footnote-parser.ts` (303 lines, needs modification)
- ✅ `packages/compiler/src/js-generator/behaviors/footnote.ts` (complete)
- ✅ `packages/compiler/src/types/remark-footnotes.d.ts` (type declarations, can be deleted)
- ✅ `test-files/footnotes-test.td` (test file ready)

### Modified
- ✅ `packages/compiler/src/renderer/css.ts` (footnote styles added)
- ✅ `packages/compiler/src/js-generator/index.ts` (behavior registered)
- ⚠️ `packages/compiler/src/parser/index.ts` (imports commented out, needs parser integration)

---

## Estimated Completion

- **Option A (Custom Parser):** 4-6 hours
- **Option B (Directive-Based):** 1-2 hours
- **Option C (Wait):** Unknown, not recommended

---

## Recommendation

**Proceed with Option A** (Custom Regex Parser) to:
1. Maintain standard Markdown syntax (`[^id]`)
2. Avoid external dependency issues
3. Have full control over features and edge cases
4. Align with academic/documentation conventions

The CSS and JavaScript are production-ready and waiting for parser integration.

---

## Next Steps

1. Implement custom regex-based parser in `footnote-parser.ts`
2. Uncomment parser imports in `packages/compiler/src/parser/index.ts`
3. Test with `test-files/footnotes-test.td`
4. Update `SYNTAX.md` with footnote documentation
5. Create syntax test fixtures

---

## Test File Status

`test-files/footnotes-test.td` is ready and includes:
- Reference-style footnotes (`[^1]`, `[^long]`, etc.)
- Inline footnotes (`^[content]`)
- Multi-paragraph footnotes
- Code blocks in footnotes
- Multiple references to same footnote
- Mixed usage scenarios

Once the parser is complete, this file can be compiled immediately to verify full functionality.

