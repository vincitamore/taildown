# Additional Accordion and Carousel Fixes

**Date**: 2025-10-07  
**Follow-up to**: ACCORDION-CAROUSEL-THEMING-FIX.md

## Additional Issues Found

After the initial theming fix, two additional issues were discovered:

1. **Accordion title text was black** - Not respecting the theme's foreground color
2. **Carousel was broken on mobile** - Double-nested structure causing layout issues and appearing tall/narrow

## Solutions Implemented

### 1. Accordion Text Color Fix

**File**: `packages/compiler/src/renderer/css.ts`

Added `color: var(--foreground)` to `.accordion-trigger` to ensure the accordion title text respects the theme's foreground color:

```css
.accordion-trigger {
  width: 100%;
  text-align: left;
  background: transparent;
  border: none;
  cursor: pointer;
  outline: none;
  padding: 1rem;
  color: var(--foreground);  /* ✅ ADDED */
}
```

### 2. Carousel Structure Fix

**Problem**: The carousel component was creating a double-nested structure:
- Outer `<div>` from component definition (with `carousel`, `relative`, `overflow-hidden`, `bg-muted` classes)
- Inner `<div class="carousel-container">` wrapper from the handler

This caused the carousel to render with excessive nesting and broken mobile layout.

**Solution**: 

**File**: `packages/compiler/src/renderer/component-handlers.ts`

Changed the `renderCarousel` function to return a proper Element structure without creating an extra wrapper:

```typescript
// OLD (created double nesting):
return {
  type: 'element',
  tagName: 'div',
  properties: {
    className: [...existingClasses, 'carousel-container', ...],
    'data-component': dataComponent,
    style: 'perspective: 1000px'
  },
  children: [...]
};

// NEW (uses component's existing div):
return {
  type: 'element',
  tagName: 'div',
  properties: {
    className: existingClasses,
    'data-component': dataComponent
  },
  children: [...]
};
```

### 3. Mobile Responsiveness Improvements

**Files**: 
- `packages/compiler/src/renderer/css.ts`
- `packages/compiler/src/renderer/component-handlers.ts`

#### CSS Changes:
- Removed unnecessary horizontal padding from `.carousel-slide` (was causing width issues)
- Moved perspective and overflow properties from `.carousel-container` to `.component-carousel`
- Removed `.carousel-container` class entirely

#### HTML/Component Changes:
- Changed carousel card padding from `p-12` to `p-6 md:p-12` (responsive)
- Changed min-height from `min-h-[400px]` to `min-h-[300px] md:min-h-[400px]` (responsive)

## Result

✅ Accordion title text now properly uses theme colors  
✅ Carousel structure is now clean with no double nesting  
✅ Carousel properly responsive on mobile devices  
✅ All components maintain high-grade professional styling

## Testing

Verified:
- No `carousel-container` class in generated HTML
- Accordion trigger has `color: var(--foreground)` in CSS
- Carousel has proper single-level structure
- Mobile-responsive classes applied correctly
