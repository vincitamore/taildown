# Flow Component CSS Fixes

## Issues Fixed (2025-10-06)

### 1. Center-Aligned Flow Labels (Default)

**Issue:** Flow element labels were left-aligned by default.

**Fix:** Added `text-align: center;` to `.flow-container li`

**Result:** All flow items are now center-justified by default for better visual balance.

```css
.flow-container li {
  position: relative;
  padding: 0.75rem 1rem;
  margin: 0.5rem 0;
  background: white;
  border: 2px solid rgb(229 231 235);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;  /* ← NEW */
}
```

### 2. Mobile-Optimized Stepped Flow

**Issue:** On mobile, stepped process numbers were obscuring/overlapping the step labels.

**Fixes Applied:**

1. **Increased desktop padding** - Changed from `3rem` to `3.5rem` left padding for more breathing room
2. **Override alignment** - Set `text-align: left;` specifically for stepped flow (since numbers are on the left)
3. **Mobile responsive adjustments** - Added media query to reduce number size and adjust spacing on mobile

```css
/* Stepped flow with numbers */
.flow-stepped {
  counter-reset: step-counter;
}

.flow-stepped li {
  counter-increment: step-counter;
  padding-left: 3.5rem;           /* ← INCREASED from 3rem */
  border-left: 4px solid rgb(59 130 246);
  text-align: left;                /* ← ADDED for proper alignment */
}

.flow-stepped li::before {
  content: counter(step-counter);
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.75rem;
  height: 1.75rem;
  background: rgb(59 130 246);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
  flex-shrink: 0;                  /* ← ADDED to prevent shrinking */
}

/* Mobile adjustments for stepped flow */
@media (max-width: 640px) {
  .flow-stepped li {
    padding-left: 3rem;            /* ← REDUCED for mobile */
    padding-right: 0.75rem;        /* ← BALANCED padding */
    padding-top: 0.875rem;         /* ← VERTICAL breathing room */
    padding-bottom: 0.875rem;
  }
  
  .flow-stepped li::before {
    left: 0.5rem;                  /* ← ADJUSTED position */
    width: 1.5rem;                 /* ← SMALLER on mobile */
    height: 1.5rem;
    font-size: 0.75rem;            /* ← SMALLER font */
  }
}
```

## Testing

Compiled and verified in:
- `test-files/test-tree-flow.html`
- `examples/11-text-illustrations.html`

## Files Modified

- `packages/compiler/src/renderer/css.ts`
  - Line 1568: Added `text-align: center;` to default flow items
  - Line 1620: Added `text-align: left;` to stepped flow
  - Line 1618: Increased padding-left from `3rem` to `3.5rem`
  - Lines 1643-1657: Added mobile media query for stepped flow

## Results

✅ Flow labels are now centered by default  
✅ Stepped flow numbers no longer obscure labels on mobile  
✅ Proper spacing maintained across all viewport sizes  
✅ Text remains readable on all devices
