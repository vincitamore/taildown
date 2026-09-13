# Accordion and Carousel Component Theming Fix

**Date**: 2025-10-07  
**Issue**: Accordion and carousel components were using hardcoded colors instead of CSS theme variables, breaking dark mode and custom theming.

## Problem

The accordion and carousel components had hardcoded color values that didn't respect the application's theming system:

### Accordion Issues
- Border using `rgb(229 231 235)` instead of `var(--border)`
- Accordion item borders using `border-gray-200` instead of `border-border`

### Carousel Issues
- Navigation buttons using `bg-white` and `border-gray-200` instead of theme variables
- Indicator colors hardcoded as `rgb(17 24 39)` and `rgb(156 163 175)` instead of theme variables
- JavaScript dynamically setting hardcoded background colors on indicators
- Container background using hardcoded gradient `from-gray-50 to-gray-100`

## Solution

### Files Modified

1. **packages/compiler/src/renderer/css.ts**
   - Changed `.component-accordion` border to use `var(--border)`
   - Changed `.carousel-prev, .carousel-next` to use `var(--background)` and `var(--border)`
   - Changed `.carousel-indicator[aria-current="true"]` to use `var(--foreground)`
   - Changed `.carousel-indicator[aria-current="false"]` to use `var(--muted-foreground)`
   - Added proper base styling for carousel indicators (height, width, border-radius, transition)

2. **packages/compiler/src/renderer/component-handlers.ts**
   - Changed accordion item className from `border-gray-200` to `border-border`
   - Removed hardcoded color classes from carousel prev/next buttons
   - Removed hardcoded color classes from carousel indicators
   - Removed hardcoded gradient background from carousel container

3. **packages/compiler/src/js-generator/behaviors/carousel.ts**
   - Removed inline style setting for indicator `backgroundColor`
   - Removed inline style setting for indicator `width` (now handled by CSS)
   - Indicators now rely entirely on CSS for styling based on `aria-current` attribute

## Result

Both components now properly:
- Respect the application's light/dark theme
- Use CSS custom properties for all colors
- Support custom theming through CSS variable overrides
- Maintain high-grade professional appearance across all themes

## Theme Variables Used

- `--background`: Main background color
- `--foreground`: Main foreground/text color
- `--border`: Border colors
- `--muted`: Muted background for hover states
- `--muted-foreground`: Muted text colors

## Testing

Rebuilt the docs-site and verified:
- ✅ No hardcoded `gray-*` colors in generated HTML
- ✅ All CSS uses theme variables
- ✅ Components respect the theme system
- ✅ Dark mode compatibility maintained
