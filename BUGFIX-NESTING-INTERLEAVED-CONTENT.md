# Bugfix: Component Nesting with Interleaved Content

**Date**: 2025-10-04  
**Status**: ✅ RESOLVED

## Problem

Component nesting was completely broken when `remark-parse` combined multiple consecutive lines (fence markers and content) into a single paragraph node. This caused:

1. **Cards nesting inside each other** instead of being siblings
2. **Content appearing outside components** instead of inside
3. **Missing closing fence markers** in the marker sequence

### Example of Broken Output

Input:
```taildown
:::grid
:::card
Card 1
:::
:::card
Card 2
:::
:::
```

Actual nesting (WRONG):
```
grid
  card
    card  ← Card 2 nested INSIDE Card 1!
```

Expected nesting (CORRECT):
```
grid
  card  ← Card 1
  card  ← Card 2 (sibling)
```

## Root Cause

The `extractMarkersFromParagraph` function in `directive-scanner.ts` was processing all lines in a paragraph and separating them into two groups:

1. All content lines → one contentNode
2. All fence markers → array of markers  

Then it added content FIRST, followed by ALL markers. This broke the document order.

For a paragraph like:
```
:::grid\n:::card\nCard 1\n:::\n:::card\nCard 2\n:::\n:::
```

The old scanner would produce:
1. CONTENT: "Card 1\nCard 2" (combined!)
2. MARKER: open grid
3. MARKER: open card
4. MARKER: close
5. MARKER: open card
6. MARKER: close
7. MARKER: close

This caused "Card 1\nCard 2" to be added before any components opened!

## Solution

**Refactored `extractMarkersFromParagraph` to return INTERLEAVED items** maintaining document order.

### Changes in `packages/compiler/src/parser/directive-scanner.ts`

**Before**: Returned `{ markers[], contentNode }`  
**After**: Returns `Array<{ type: 'marker' | 'content', marker?, contentNode? }>`

The function now:
1. Processes lines sequentially
2. Accumulates content lines in a buffer
3. Flushes content buffer **immediately before** each marker
4. Returns markers and content chunks in their original document order

### Key Code Change

```typescript
const flushContent = () => {
  if (accumulatedContent.length > 0) {
    const contentText = accumulatedContent.join('\n').trim();
    if (contentText) {
      items.push({
        type: 'content',
        contentNode: { type: 'paragraph', children: [{ type: 'text', value: contentText }] },
      });
    }
    accumulatedContent = [];
  }
};

for (const line of lines) {
  if (isFenceMarker(line)) {
    flushContent(); // ← Flush BEFORE marker
    items.push({ type: 'marker', marker: createMarker(line) });
  } else {
    accumulatedContent.push(line);
  }
}

flushContent(); // Final flush for trailing content
```

## Results

✅ **All 19/19 tests passing**  
✅ **Correct sibling nesting** with blank lines between components  
✅ **Content correctly placed inside components**  
✅ **No orphaned fence markers**  
✅ **Deep nesting works correctly**  

### Test Output

```
Component Tree:
container
  card
container
  card
grid
  card  ← Siblings!
  card  ← Siblings!
  card  ← Siblings!
```

## Related Files

- `packages/compiler/src/parser/directive-scanner.ts` (modified)
- `syntax-tests/fixtures/**/*.ast.json` (regenerated)
- `regenerate-fixtures.ps1` (created for test regeneration)

## Testing

Verified with:
- Simple grid with 2 cards
- Complex document with 6 grids, 28 cards
- Deep nesting (5+ levels)
- All syntax test fixtures

## Prevention

- Document order MUST be maintained when extracting markers
- Content and markers should be interleaved, not grouped by type
- Always test with `remark-parse`'s actual paragraph combination behavior

