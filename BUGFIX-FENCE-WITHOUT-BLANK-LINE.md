# Bug Fix: Closing Fences Without Blank Lines

## Problem
Closing `:::` fence markers were appearing as literal text in the HTML output when they appeared immediately after certain content types without a preceding blank line.

### Affected Cases
1. **After lists**: `1. Item\n:::`
2. **After links with attributes**: `[Link](#){.class}\n:::`
3. **Multiple consecutive fences**: `[Link](#){.class}\n:::\n:::`

## Root Cause
When `remark-parse` encounters content followed immediately by `:::` without a blank line, it combines them into a single AST node:
- Lists: The `:::` becomes part of the last list item's text
- Links: The `:::` becomes a text node after the link within the same paragraph
- Multiple fences: Both `:::` markers end up in the same text node

The directive scanner was only checking for a single fence at the end of text nodes, not handling:
1. Fences embedded within list structures
2. Multiple consecutive fences in the same text node

## Solution

### 1. Recursive List Scanning (directive-scanner.ts lines 352-412)
Added logic to recursively scan list nodes and their children for fence markers:
- When a list is encountered, scan each list item's children
- Extract any fence markers found within list items
- Reconstruct the list without the fence markers
- Add the cleaned list to content, then add the extracted markers in document order

This ensures fences appearing after list items (even without blank lines) are correctly extracted.

### 2. Multiple Fence Extraction (directive-scanner.ts lines 60-149)
Refactored paragraph fence extraction to handle multiple consecutive fences:
- Changed from checking only the last line to checking if text contains ANY `:::` markers
- Use `processLinesForMarkers` to extract ALL fences from the text node
- Properly interleave content and markers in document order
- Handle edge cases where text nodes only contain fences (remove empty nodes)

This ensures that patterns like `[Link](#){.class}\n:::\n:::` are fully parsed.

## Testing
All affected cases now work correctly:
- ✅ Lists followed by fences without blank lines
- ✅ Links followed by fences without blank lines
- ✅ Multiple consecutive fences
- ✅ All 19/19 syntax tests passing

## User Experience Improvement
Users no longer need to remember to add blank lines before closing fences in these specific contexts. The following syntax now works as expected:

```taildown
:::container
1. [Item](#)
:::

:::card
[Button](#){.primary}
:::
:::
```

This makes Taildown syntax more forgiving and intuitive, aligning with the "zero config beauty" principle.

