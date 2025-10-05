# Plain English Shorthand Audit

**Date:** October 4, 2025  
**Status:** In Progress

## Prime Directive

**All styling and shorthand MUST follow natural English grammar and word order, NOT CSS conventions.**

### Natural Language Order Examples

**CORRECT (Plain English)**
- `subtle-glass` (adjective-noun)
- `heavy-glass` (adjective-noun)  
- `large-text` (adjective-noun)
- `bold-primary` (adjective-adjective)
- `rounded-corners` (adjective-noun)

**INCORRECT (CSS Style)**
- `glass-subtle` (noun-adjective)
- `text-large` (noun-adjective)
- `primary-bold` (noun-adjective)
- `leading-tight` (property-value)

## Audit Results

### Issues Found in `shorthand-mappings.ts`

#### 1. Line Height Shorthands (Lines 80-83)
**Current:**
```typescript
'leading-tight': 'leading-tight',
'leading-normal': 'leading-normal',
'leading-relaxed': 'leading-relaxed',
'leading-loose': 'leading-loose',
```

**Problem:** CSS-style property-value order (`leading-tight` = "leading: tight")

**Solution:** Remove these. We already have natural descriptors:
- `tight` → `space-y-1` (line 154)
- `relaxed` → `space-y-4` (line 156)
- `loose` → `space-y-8` (line 157)

For line-height specifically, users can use direct classes or we add:
- `tight-lines` → `leading-tight`
- `relaxed-lines` → `leading-relaxed`
- `loose-lines` → `leading-loose`

**Decision:** Remove CSS-style, add natural alternatives

#### 2. Hover Effects (Lines 239-254)
**Current:**
```typescript
'hover-lift': [...],
'hover-grow': [...],
'hover-shrink': [...],
'hover-glow': [...],
```

**Analysis:** These are actually fine! "hover" is a modifier describing the interaction state, similar to "dark-mode" or "focus-state". The pattern is `[state]-[effect]` which is natural.

**Decision:** Keep as-is

#### 3. Gradient Directions (Lines 206-207)
**Current:**
```typescript
'gradient-vertical': 'bg-gradient-to-b',
'gradient-diagonal': 'bg-gradient-to-br',
```

**Analysis:** Pattern is `[effect]-[direction]` which is natural ("gradient that's vertical")

**Decision:** Keep as-is

### Missing Combinations

We should add natural combinations for common patterns:

#### Text Size + Weight
```typescript
'large-bold': ['text-lg', 'font-bold'],
'huge-bold': ['text-4xl', 'font-bold'],
'small-light': ['text-sm', 'font-light'],
```

#### Text Size + Color (Semantic)
```typescript
'large-primary': ['text-lg', 'text-blue-600'],
'large-muted': ['text-lg', 'text-gray-500'],
'small-muted': ['text-sm', 'text-gray-500'],
```

#### Background + Text (Semantic Pairs)
```typescript
'primary-bg': ['bg-blue-600', 'text-white'],
'secondary-bg': ['bg-gray-600', 'text-white'],
'muted-bg': ['bg-gray-100', 'text-gray-700'],
```

## Action Plan

### Phase 1: Remove CSS-Style Shorthands
1. Remove `leading-tight`, `leading-normal`, `leading-relaxed`, `leading-loose` - COMPLETE
2. Add natural alternatives: `tight-lines`, `normal-lines`, `relaxed-lines`, `loose-lines` - COMPLETE

### Phase 2: Add Natural Combinations
1. Add text size + weight combinations
2. Add text size + color combinations  
3. Add background + text semantic pairs

### Phase 3: Documentation
1. Update SYNTAX.md with §2.8 "Plain English Grammar Rules"
2. Add examples to every section
3. Create style guide for future additions

## Grammar Rules for Future Development

### Rule 1: Adjective-Noun Order
Always use adjective-noun order, never noun-adjective.
- CORRECT: `large-text`, `bold-heading`, `rounded-card`
- INCORRECT: `text-large`, `heading-bold`, `card-rounded`

### Rule 2: Descriptive States First
For state-based modifiers, state comes first.
- CORRECT: `hover-lift`, `focus-ring`, `active-scale`
- CORRECT: `dark-background`, `mobile-hidden`

### Rule 3: Single Word Descriptors
When possible, use single descriptive words.
- CORRECT: `bold`, `rounded`, `padded`, `elevated`
- INCORRECT: `font-bold`, `border-rounded`, `padding-large`

### Rule 4: Natural Phrases
Multi-word shorthands should read like natural English phrases.
- CORRECT: `flex-center` (flex and center)
- CORRECT: `rounded-full` (rounded fully)
- CORRECT: `hover-lift` (lift on hover)

### Rule 5: Avoid CSS Property Names
Never use CSS property names as prefixes unless they're common English words.
- AVOID: `leading-tight` (CSS property "line-height")
- AVOID: `tracking-wide` (CSS property "letter-spacing")
- USE INSTEAD: `tight-lines`, `wide-spacing`

## Testing Plan

After updates:
1. Compile all example .td files
2. Verify all shorthands resolve correctly
3. Update example documentation to use only plain English
4. Add tests for new combination shorthands

---

**Next Steps:**
1. Implement Phase 1 changes
2. Update SYNTAX.md
3. Add tests

