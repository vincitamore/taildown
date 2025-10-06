# Pull Request: Fix Inline Attribute Parsing and Shorthand Resolution Bugs

## Summary

Fixes two critical bugs in the Taildown compiler that prevented inline style attributes from rendering correctly in compiled HTML.

## Problem

When compiling documents with inline attributes like `# Heading {huge-bold center primary}`, the attributes were appearing as literal text in the HTML output instead of being converted to CSS classes:

```html
<!-- Before (broken) -->
<h1>Heading {huge-bold center primary}</h1>

<!-- After (fixed) -->
<h1 class="text-4xl font-bold text-center text-primary-600 hover:text-primary-700">Heading</h1>
```

## Root Causes

### Bug #1: Incorrect Attribute Block Regex
**Location:** `packages/shared/src/constants.ts`

The `ATTRIBUTE_BLOCK_REGEX` was matching attributes at the **beginning** of text (`/^\s*\{([^}]+)\}/`) instead of at the **end** where they should be according to SYNTAX.md.

**Fix:** Changed regex to `/\{([^}]+)\}\s*$/` to match attribute blocks at the end of text content.

### Bug #2: Wrong Resolution Order
**Location:** `packages/compiler/src/resolver/style-resolver.ts`

The style resolver was checking if something "looked like" a CSS class (by detecting hyphens) **before** checking the shorthand mappings. This caused compound shorthands like `huge-bold`, `large-bold`, etc. to be incorrectly identified as already-resolved CSS classes and passed through unchanged.

**Fix:** Reordered resolution logic to check shorthand mappings first (highest priority), ensuring all registered shorthands are properly resolved.

## Changes

- Updated `ATTRIBUTE_BLOCK_REGEX` to match attributes at end of text: `/\{([^}]+)\}\s*$/`
- Reordered style resolution to prioritize shorthand mappings over CSS class detection
- Updated resolution order documentation in `style-resolver.ts`
- Recompiled `ASSESSMENT.html` with inline styles to verify fix

## Testing

- Compiled ASSESSMENT.td successfully with inline attributes resolved
- Verified all shorthand mappings (huge-bold, large-bold, badge, etc.) now resolve correctly
- Confirmed icons and semantic colors still work as expected

## Impact

This fix ensures that the plain English shorthand system works correctly, which is a core feature of Taildown. Users can now write intuitive attribute syntax that properly compiles to styled HTML.

---

## Create PR

**Branch:** `cursor/debug-and-recompile-td-with-inline-styles-a3eb`  
**Base:** `main`  
**Status:** ✅ Branch pushed and ready

**Direct PR Creation Link:**
https://github.com/vincitamore/taildown/compare/main...cursor/debug-and-recompile-td-with-inline-styles-a3eb?expand=1

Simply click the link above to create the pull request on GitHub with these details pre-filled!
