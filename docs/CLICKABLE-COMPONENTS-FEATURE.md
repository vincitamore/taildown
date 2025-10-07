# Clickable Components Feature

**Date:** 2025-10-07  
**Type:** Feature Addition (Category 2)  
**Version Impact:** Minor (0.1.x → 0.2.0)  
**Status:** Implemented

---

## Summary

Added support for clickable components via `href` attribute. Any component (card, grid-item, container, etc.) can now be made clickable by adding an `href` attribute, rendering as an `<a>` tag instead of its default element.

## Motivation

Modern UX best practices favor large, obvious click targets over small text links. Navigation cards, feature grids, and call-to-action sections benefit from making the entire component clickable rather than just embedded links.

**Problem:** Previous approach required wrapping text in links within cards, leading to:
- Small click targets (poor mobile UX)
- Visual clutter from link styling (underlines, colors)
- Inconsistent hover states
- Awkward syntax to achieve the desired effect

**Solution:** Allow `href` attribute directly on components to make entire component a link.

## Syntax

### Basic Usage
```taildown
:::card {glass padded href="#destination"}
Entire card is clickable
:::
```

### Navigation Grid Example
```taildown
:::grid {cols-3}
:::card {subtle-glass padded center hover-lift href="#features"}
:icon[star]{primary huge}
**Features**
Learn about our features
:::

:::card {subtle-glass padded center hover-lift href="#pricing"}
:icon[dollar-sign]{success huge}
**Pricing**
View pricing plans
:::

:::card {subtle-glass padded center hover-lift href="#contact"}
:icon[mail]{info huge}
**Contact**
Get in touch
:::
:::
```

## Implementation Details

### Renderer Changes
Modified `renderGenericComponent()` in `packages/compiler/src/renderer/component-handlers.ts`:

1. Check if component has `href` attribute
2. If present and default element is `div`, change to `a` tag
3. Automatically add `no-underline` and `cursor-pointer` classes
4. Pass href attribute through to HTML

### Generated HTML
```html
<a class="taildown-component component-card glass-effect glass-subtle 
          no-underline cursor-pointer" 
   href="#layout" 
   data-component="card">
  <!-- Card content -->
</a>
```

## Backward Compatibility

✅ **Fully backward compatible** - This is a pure addition:
- No existing syntax is changed
- Documents without `href` render exactly as before
- Opt-in feature that doesn't affect existing documents

## Documentation Updates

### Updated Files
1. **SYNTAX.md** - Added § 3.4.1 "Clickable Components"
2. **docs-site/components.td** - Added "Clickable Cards" section with examples
3. **packages/compiler/src/components/standard/card.ts** - Updated component documentation

### Demo Site
Updated Quick Navigation section in components.td to use clickable cards:
```taildown
:::card {subtle-glass padded center hover-lift href="#layout"}
:icon[layout]{primary huge}
**Layout** {huge-bold}
Card, Grid, Button Group
:::
```

## Best Practices

### ✅ Recommended
- Use with `hover-lift` for visual feedback
- Combine with cards for navigation grids
- Use for call-to-action sections
- Prefer for mobile-friendly interfaces

### ⚠️ Avoid
- Nesting interactive elements inside clickable components
- Making large blocks of content clickable without clear indication
- Using without visual hover feedback

## Testing

### Manual Testing
- ✅ Cards render as `<a>` tags with href
- ✅ No underline styling applied
- ✅ Cursor changes to pointer on hover
- ✅ Navigation works correctly (anchor links, relative, external)
- ✅ Hover-lift animation works with clickable cards
- ✅ All existing card styling preserved

### Browser Compatibility
- Modern browsers: Full support (Chrome, Firefox, Safari, Edge)
- `<a>` tags are universal HTML, no compatibility issues
- CSS classes use standard properties

## Examples in Wild

See live examples at:
- docs-site/components.html - Quick Navigation section
- docs-site/components.html - "Clickable Cards" section

## Future Enhancements

Potential future additions:
- `target` attribute support for `_blank` links
- `rel` attribute for external link security
- Analytics/tracking attributes
- Custom click handlers via data attributes

## Related Issues

Addresses user feedback about poor UX for navigation links in demo site.

## Author

Background Agent  
Reviewed by: User feedback on demo site UX

---

**Change Category:** Addition (Category 2)  
**Backward Compatible:** Yes  
**Breaking Change:** No  
**Version Bump:** Minor (0.1.x → 0.2.0)
