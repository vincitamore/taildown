# Documentation Gaps - Critical Update Needed

## Major Features Built But Not Documented

### 1. JavaScript Generation System
**Status:** ✅ IMPLEMENTED, ❌ NOT DOCUMENTED

**What exists:**
- `packages/compiler/src/js-generator/` - Complete JS generation system
- Tree-shaking: Only includes JS for components actually used
- Outputs `.js` file alongside `.html` and `.css`
- Vanilla ES6+ JavaScript (~2-5KB total)
- Event delegation pattern
- Data attributes for targeting

**Needs documentation in:**
- [ ] SYNTAX.md - Section on JavaScript output
- [ ] README.md - Mention JS generation in features
- [ ] tech-spec.md - JS generation architecture
- [ ] Examples showing JS output

---

### 2. Interactive Components
**Status:** ✅ IMPLEMENTED, ❌ NOT DOCUMENTED

**Components with JavaScript behaviors:**
1. **Tabs** (`:::tabs`)
   - Zero-config: h2/h3 headings become tabs
   - Click to switch, keyboard navigation
   - ARIA roles and attributes

2. **Accordion** (`:::accordion`)
   - Zero-config: Bold text becomes triggers
   - Expand/collapse animation
   - First item open by default

3. **Carousel** (`:::carousel`)
   - Zero-config: `---` divides slides
   - Navigation buttons, indicators
   - Keyboard and swipe support
   - 3D card effects

4. **Modal** (`:::modal`)
   - Backdrop with blur effect
   - Focus trap, escape key
   - Body scroll lock
   - Can be attached to any element

5. **Tooltip** (`:::tooltip`)
   - Hover/focus to show
   - Fade animations
   - Touch support (click to toggle)
   - Can be attached to any element

**Needs documentation in:**
- [ ] SYNTAX.md - Section 3.7 "Interactive Components"
- [ ] Individual component examples
- [ ] Accessibility features (ARIA)
- [ ] Zero-config philosophy explanation

---

### 3. Attachable Components (REVOLUTIONARY FEATURE)
**Status:** ✅ IMPLEMENTED, ❌ NOT DOCUMENTED

**Two types of attachments:**

#### A. Inline Content
```taildown
[Click me](#){button modal="This is a simple alert!"}
[Hover here](#){tooltip="Helpful tip!"}
```

#### B. ID References
```taildown
[Open Dialog](#){button modal="#welcome-modal"}
[More Info](#){tooltip="#detailed-info"}

:::modal{id="welcome-modal"}
# Welcome!
Complex content with **markdown** support.
:::

:::tooltip{id="detailed-info"}
Detailed tooltip with *emphasis* and `code`.
:::
```

**Key features:**
- Plain English zero-config syntax
- Works on ANY element (links, text, buttons, badges)
- Supports both simple text and complex markdown content
- ID-referenced content defined once, used multiple times

**Needs documentation in:**
- [ ] SYNTAX.md - Section 2.8 "Attachable Components"
- [ ] SYNTAX.md - Section 3.8 "ID-Referenced Components"
- [ ] Examples in README.md
- [ ] tech-spec.md - Attachment architecture

---

### 4. Key-Value Attributes in Directives
**Status:** ✅ IMPLEMENTED, ❌ NOT DOCUMENTED

**Syntax:**
```taildown
:::component{id="unique-id" variant="primary" size="large"}
Content
:::
```

**Supported attributes:**
- `id="value"` - Unique identifier for component
- `modal="content"` - Attach modal with inline content
- `modal="#id"` - Attach modal by ID reference
- `tooltip="content"` - Attach tooltip with inline content
- `tooltip="#id"` - Attach tooltip by ID reference
- Any custom key-value pairs

**Parsing:**
- Regex: `/(\w+)=["']([^"']+)["']/g`
- Stored in `marker.attributes` object
- Separate from classes/variants

**Needs documentation in:**
- [ ] SYNTAX.md - Update Section 2.1 attribute grammar
- [ ] SYNTAX.md - Rule 2.2.7 "Key-Value Attributes"
- [ ] Examples with all attribute types

---

### 5. Component Variant System
**Status:** ✅ IMPLEMENTED, ❌ NOT DOCUMENTED

**How it works:**
```taildown
:::button{primary large}         → Resolves to primary button classes
:::badge{success small}          → Resolves to success badge classes
[Link](#){button secondary}      → Resolves to secondary button classes
```

**Architecture:**
- `packages/compiler/src/components/component-registry.ts` - Component definitions
- `packages/compiler/src/components/variant-system.ts` - Variant resolution
- Supports size, color, and style variants per component
- Natural English syntax (e.g., `primary large` not `large primary`)

**Needs documentation in:**
- [ ] SYNTAX.md - Section 2.9 "Component Variants"
- [ ] Component-specific variant lists
- [ ] Resolution order explanation

---

### 6. Registry System for ID-Referenced Components
**Status:** ✅ IMPLEMENTED, ❌ NOT DOCUMENTED

**Architecture:**
- `modalRegistry` - Stores modal content by ID
- `tooltipRegistry` - Stores tooltip content by ID
- `prepopulateRegistries()` - Pre-pass before HAST conversion
- Converts MDAST children to HAST for storage
- Lookup during `wrapWithModal` and `wrapWithTooltip`

**Process:**
1. Scan MDAST for `:::modal{id="..."}` and `:::tooltip{id="..."}`
2. Convert their children to HAST
3. Store in registry
4. When `modal="#id"` encountered, lookup from registry
5. Wrap trigger element with modal/tooltip

**Needs documentation in:**
- [ ] tech-spec.md - Section on registry architecture
- [ ] Explanation of two-pass rendering

---

### 7. Plain English Styling (Partially Documented)
**Status:** ✅ IMPLEMENTED, ⚠️ PARTIALLY DOCUMENTED

**What's working:**
- Natural word order: `large-bold` not `bold-large`
- Single descriptors: `rounded padded elevated`
- Component shorthands: `{button primary large}`
- Color-bg pairs: `{primary-bg}` → bg + contrast text

**What's not fully documented:**
- Component-specific variants
- How components and shorthands interact
- Resolution order between component variants and plain English

**Needs documentation in:**
- [ ] SYNTAX.md - Update Section 2.7 with component examples
- [ ] More comprehensive examples

---

## Documentation Priority Order

### HIGH PRIORITY (Core Features)
1. **Attachable Components** - This is our killer feature
2. **Interactive Components** - Major functionality users need to know
3. **JavaScript Generation** - Output format users need to understand
4. **Key-Value Attributes** - Syntax extension users need to learn

### MEDIUM PRIORITY (Important Details)
5. **Component Variant System** - Enhances usability
6. **Registry System** - Implementation detail for understanding

### LOW PRIORITY (Already Partially Done)
7. **Plain English Enhancements** - Expand existing docs

---

## Files That Need Updates

### SYNTAX.md
- [ ] Section 2.1 - Update attribute grammar for key-value pairs
- [ ] Section 2.8 (NEW) - Attachable Components
- [ ] Section 2.9 (NEW) - Component Variants  
- [ ] Section 3.7 (NEW) - Interactive Components
- [ ] Section 3.8 (NEW) - ID-Referenced Components
- [ ] Section 3.9 (NEW) - JavaScript Output
- [ ] Update version to 0.3.0 (breaking changes with new syntax)

### README.md
- [ ] Add "Interactive Components" to features
- [ ] Add "Attachable Modals & Tooltips" to features
- [ ] Update examples to show attachable syntax
- [ ] Mention JavaScript generation in output section
- [ ] Quick start should show a modal or tooltip example

### tech-spec.md
- [ ] Section on JavaScript Generation Architecture
- [ ] Section on Component Registry System
- [ ] Section on Attachment System (wrapWithModal/wrapWithTooltip)
- [ ] Update compilation pipeline diagram
- [ ] Add performance notes for JS generation

### New Documentation Needed
- [ ] ATTACHABLE-COMPONENTS.md - Comprehensive guide
- [ ] INTERACTIVE-COMPONENTS.md - Guide for each component
- [ ] JS-OUTPUT.md - Understanding the generated JavaScript

---

## Test Coverage Gaps

Related to documentation gaps:
- [ ] Syntax tests for attachable components
- [ ] Syntax tests for key-value attributes
- [ ] Integration tests for ID-referenced components
- [ ] Tests for registry system
- [ ] Browser tests for JavaScript behaviors

---

## Next Steps

1. Create TODO items for each documentation update
2. Update SYNTAX.md with new sections (priority 1)
3. Update README.md with new features (priority 2)
4. Update tech-spec.md with architecture (priority 3)
5. Create new guide documents (priority 4)
6. Add syntax test fixtures (priority 5)

