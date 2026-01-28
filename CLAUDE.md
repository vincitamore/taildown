# Taildown Compiler

> A TypeScript markup language compiler extending Markdown with plain English styling, 32 UI components, tree-shaken JS behaviors, and self-contained HTML output.

**Live site:** https://taildown.dev
**Pipeline:** `.td` → Parser (unified/remark, 19 plugins) → MDAST → HAST → HTML + CSS + JS

## Quick Start

```bash
pnpm install          # Install dependencies
pnpm build            # Build all packages
pnpm test             # Run tests (expect 11 fixture drift failures)
pnpm typecheck        # Check types (~90 errors, see Known Issues)
pnpm taildown <file>  # Compile a .td file
```

## Project Structure

```
taildown/
├── packages/
│   ├── compiler/           # Core compilation engine (427KB bundle)
│   │   ├── src/
│   │   │   ├── parser/     # 19-plugin parser pipeline
│   │   │   ├── renderer/   # HTML/CSS generation
│   │   │   ├── components/ # 32 component definitions
│   │   │   ├── resolver/   # Style shorthand resolution
│   │   │   ├── js-generator/   # Tree-shaken JS behaviors
│   │   │   ├── icons/      # Lucide icon integration
│   │   │   ├── themes/     # Colors, glass, animations
│   │   │   ├── config/     # Config schema and loader
│   │   │   └── syntax-highlighting/  # CodeMirror 6 + Shiki
│   │   └── dist/
│   ├── cli/                # Command-line interface
│   ├── shared/             # Shared types and constants
│   └── linter/             # Syntax linter (2 rules)
├── editor/                 # Browser-based live editor
├── examples/               # 14 example .td files
├── docs-site/              # Documentation website (built with Taildown)
├── syntax-tests/           # Parser conformance tests
└── SYNTAX.md               # Canonical syntax reference (~25K tokens)
```

## Architecture Overview

### Parser Plugin Chain (Critical Ordering)

The parser uses unified's processing pipeline. **Plugin order matters** - some plugins must run before others:

```
Source → autoFixSyntax → remarkParse → remarkGfm → remarkDirective
       → containerDirectiveParser → iconParser → inlineBadgeParser
       → kbdParser → mathParser → footnoteParser → diffParser
       → imageCompareParser → stepParser → timelineParser → videoParser
       → taskListParser → tableParser → inlineMarkParser
       → attributeParser → componentParser → MDAST Output
```

**Critical ordering constraints:**
1. `remarkDirective` BEFORE `containerDirectiveParser` - creates raw directive nodes
2. `iconParser` BEFORE `inlineBadgeParser` - similar `:syntax[]{}` patterns
3. `attributeParser` BEFORE `componentParser` - attributes need parsing first
4. `diffParser` BEFORE syntax highlighting - marks diff blocks with flags

### Component Registry

32 components registered in `component-registry.ts`:

| Category | Components |
|----------|------------|
| **Layout** | grid, container, columns, sidebar |
| **Content** | card, alert, callout, badge, avatar, stats, divider |
| **Interactive** | tabs, accordion, modal, carousel, tooltip, navbar |
| **Navigation** | breadcrumb, pagination, steps, timeline |
| **Media** | video, image-compare, mermaid, code-diff |
| **Data** | table-enhanced, definitions, tree, flow |
| **Utility** | button, button-group, progress, skeleton, details |

Each component defines: variants (e.g., `glass`, `elevated`), sizes (sm/md/lg), default classes.

### Style Resolver

Plain English → Tailwind CSS via ~120 shorthand mappings:

```
"large-bold primary glass" → ["text-lg", "font-bold", "text-primary-600", "glass-effect", ...]
```

Key files:
- `resolver/shorthand-mappings.ts` - 120+ mappings
- `resolver/semantic-colors.ts` - primary/success/warning/error resolution
- `resolver/variant-resolver.ts` - Component-specific variants

### JS Generation (Tree-Shaking)

Only includes JS for components actually used in the document:

| Behavior | Trigger | Size |
|----------|---------|------|
| tabs | `:::tabs` | ~1.2KB |
| accordion | `:::accordion` | ~1KB |
| carousel | `:::carousel` | ~2.4KB |
| modal | `:::modal` | ~1.5KB |
| tooltip | `:::tooltip` | ~1.8KB |
| navbar | `:::navbar` | ~400B |
| table | `data-sortable="true"` | ~1.1KB |
| compare-images | `:::image-compare` | ~2KB |
| dark-mode | Always included | ~1.8KB |

## Key Files

| File | Purpose | Lines |
|------|---------|-------|
| `compiler/src/index.ts` | Main `compile()` entry | ~256 |
| `compiler/src/parser/index.ts` | Parser pipeline orchestration | ~150 |
| `compiler/src/renderer/html.ts` | HTML document rendering | ~493 |
| `compiler/src/renderer/css.ts` | CSS generation (800+ lines of utilities) | ~800 |
| `compiler/src/renderer/component-handlers.ts` | Component rendering | ~1815 |
| `compiler/src/components/component-registry.ts` | Component definitions | ~393 |
| `compiler/src/resolver/shorthand-mappings.ts` | Plain English → CSS | ~459 |
| `SYNTAX.md` | Canonical syntax reference | ~1800 |

## Before You Change Anything

1. **Parser ordering matters.** Adding a new parser? Check the constraints above.
2. **Registry is async.** Components use `await ensureRegistryInitialized()` before access.
3. **CSS.ts is massive.** 800+ lines of TAILWIND_UTILITIES inline - consider if your change belongs there.
4. **Test fixtures may be stale.** 11 tests fail due to fixture drift, not bugs.
5. **TypeScript strict mode fails.** ~90 type errors exist (unused imports, undefined narrowing).

## Common Tasks

### Add a New Component

1. Create `packages/compiler/src/components/standard/my-component.ts`:
```typescript
import type { ComponentDefinition } from '@taildown/shared';

export const myComponentDefinition: ComponentDefinition = {
  name: 'my-component',
  htmlElement: 'div',
  defaultClasses: ['...'],
  variants: { default: [...], glass: [...] },
  sizes: { sm: [...], md: [...], lg: [...] },
  hasChildren: true,
};
```

2. Register in `component-registry.ts`:
```typescript
import { myComponentDefinition } from './standard/my-component';
// Add to registerStandardComponents()
registry.register(myComponentDefinition);
```

3. If interactive, add behavior in `js-generator/behaviors/my-component.ts`

### Add a Plain English Shorthand

Edit `resolver/shorthand-mappings.ts`:
```typescript
export const SHORTHAND_MAPPINGS: Record<string, string[]> = {
  // ...existing mappings
  'my-shorthand': ['tailwind-class-1', 'tailwind-class-2'],
};
```

### Add a Parser Plugin

1. Create `packages/compiler/src/parser/my-parser.ts`
2. Import in `parser/index.ts`
3. Add to pipeline in correct position (check ordering constraints!)

## Known Issues

### Build Health (as of 2026-01-28)

| Metric | Status |
|--------|--------|
| Build | PASSES (all 4 packages) |
| Tests | 332/343 pass (11 fixture drift failures) |
| TypeScript | ~90 type errors |
| Security | 7 vulnerabilities (1 high dev-only, 6 moderate transitive) |

### Test Failures

All 11 failures are **fixture drift**, not bugs:
- `syntax-tests/reference.test.ts` (10): AST comparison mismatches - regenerate fixtures
- `default-config.test.ts` (1): Color test expects Tailwind blue-600, config has custom primary-600

**To fix:** Regenerate expected AST fixtures from current parser output.

### TypeScript Errors

~90 errors in these categories:
- Unused imports/variables (TS6133, TS6196) - ~25 errors
- Possibly undefined (TS2532, TS18048) - ~30 errors
- Type mismatches - ~20 errors
- ContainerDirective vs mdast Nodes gap - ~10 errors

The code **works** but isn't strict-mode compliant. Build succeeds because tsup uses esbuild which strips types.

### Outdated Dependencies

| Package | Current | Latest |
|---------|---------|--------|
| vitest | 1.6.1 | 4.0.18 |
| eslint | 8.57.1 | 9.39.2 |
| @typescript-eslint/* | 6.21.0 | 8.54.0 |

### Security Vulnerabilities

- **HIGH:** `glob` CLI command injection (dev-only, via tsup > sucrase)
- **MODERATE:** Various in vitest/vite/mermaid chains (all transitive dev deps)

## Documentation Drift Warning

The README and tech-spec.md are **significantly outdated**:
- README claims "7 of 15+" components - actually 32
- Phase roadmap shows features as "planned" that are complete
- FAQ says dark mode "planned" - it's fully implemented
- 12 components completely undocumented in README

**SYNTAX.md is more accurate** for syntax reference.

## Syntax Quick Reference

### Block Directives
```taildown
:::card {glass elevated}
Content here
:::
```

### Inline Attributes
```taildown
# Heading {large-bold primary}

Paragraph with {italic muted} inline styles.
```

### Icons, Badges, Keys
```taildown
:icon[home]{large primary}
:badge[beta]{warning}
:kbd[Ctrl+C]{mac}
```

### Plain English Shorthands

| Category | Examples |
|----------|----------|
| Typography | `xs`, `large`, `huge`, `bold`, `italic`, `center` |
| Spacing | `padded`, `padded-lg`, `gap`, `m-lg` |
| Layout | `flex`, `flex-center`, `grid-2`, `grid-3` |
| Effects | `glass`, `subtle-glass`, `elevated`, `floating` |
| Animation | `fade-in`, `slide-up`, `hover-lift`, `animated` |
| Colors | `primary`, `success`, `warning`, `error`, `muted` |
| Combos | `large-bold`, `huge-bold`, `small-muted`, `primary-bg` |

## Editor

Browser-based live editor at `editor/index.html`:
- CodeMirror 6 with custom Taildown language
- Split-pane preview with debounced updates
- Slash commands, Mermaid diagrams, dark mode
- Save/load with File System API

Build standalone: `pnpm build:editor` → `editor/dist/editor.html`

## Cross-Project Integration

This project is tracked in the claude-org organization system:
- Task: `tasks/taildown-native-integration.md`
- Knowledge base: `C:\Users\AlexMoyer\Documents\claude-org\`

When working on Taildown, relevant patterns may exist in:
- `knowledge/mcp-integration-patterns.md` - For the upcoming MCP server
- `knowledge/javascript-regex-crlf-gotcha.md` - Parser gotchas
- `context/project-map.md` - Project relationships

---
*Last updated: 2026-01-28*
*Build status: Functional with known issues*
