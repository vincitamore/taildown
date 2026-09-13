# Layout Improvements Plan

## Problems Identified (2025-10-04)

From user feedback on `examples/10-complete-page.html`:

1. **Poor Viewport Utilization**
   - Content squeezed into narrow column on large screens
   - Container `max-w-6xl` (72rem) leaves huge margins on 2560px screens
   - Grids don't expand to use available space effectively

2. **No Responsive Text Sizing**
   - Text doesn't scale with container/card size
   - Fixed `text-xl`, `text-2xl` etc. don't adapt
   - Tiny cards have same font size as large cards

3. **Deep Nesting Breaks Layout**
   - Card inside card inside card compounds padding
   - No minimum dimensions prevent cards from becoming unusable
   - Overflow issues when nesting gets deep

4. **Non-Adaptive Grids**
   - `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` is too conservative
   - On 2560px screen, should show 4-6 columns, not 3
   - Need container-query based grids (or better breakpoints)

## Current Default Classes

```typescript
card: ['p-6', 'rounded-lg', 'shadow-md', 'bg-white']
grid: ['grid', 'gap-4', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-3']
container: ['max-w-6xl', 'mx-auto', 'px-4', 'sm:px-6', 'lg:px-8']
```

## Proposed Solutions

### 1. Improve Container Widths
```typescript
container: [
  'max-w-screen-2xl',  // 1536px instead of 72rem
  'mx-auto',
  'px-4',
  'sm:px-6',
  'lg:px-8',
  'xl:px-12'
]
```

### 2. Better Grid Responsiveness
```typescript
grid: [
  'grid',
  'gap-4',
  'grid-cols-1',
  'sm:grid-cols-2',
  'md:grid-cols-2',
  'lg:grid-cols-3',
  'xl:grid-cols-4',
  '2xl:grid-cols-5'
]
```

### 3. Add Responsive Text Base
In CSS generator, add:
```css
body {
  font-size: clamp(0.875rem, 0.5vw + 0.75rem, 1.125rem);
}
```

### 4. Card Constraints
```typescript
card: [
  'p-6',
  'rounded-lg',
  'shadow-md',
  'bg-white',
  'min-w-[200px]',     // Prevent tiny cards
  'max-w-full',        // Don't overflow parent
  'overflow-auto'      // Handle overflow gracefully
]
```

### 5. Nested Component Padding Reduction

Add CSS rule:
```css
.component-card .component-card {
  padding: 1rem; /* Reduce padding for nested cards */
}

.component-card .component-card .component-card {
  padding: 0.75rem; /* Further reduce for deep nesting */
}
```

### 6. Additional Responsive Breakpoints

Add to CSS generator:
- `xl:` (1280px)
- `2xl:` (1536px)
- `3xl:` (1920px) for ultra-wide

## Implementation Priority

1. ✅ Fix grid columns to use more viewport
2. ✅ Increase container max-width
3. ✅ Add nested card padding reduction
4. ✅ Add min-width to cards
5. Add responsive text sizing
6. Add ultra-wide breakpoints

## Testing

Test on:
- Mobile (375px)
- Tablet (768px)
- Laptop (1440px)
- Desktop (1920px)
- Ultra-wide (2560px)

Focus on `examples/10-complete-page.html` as comprehensive test case.

