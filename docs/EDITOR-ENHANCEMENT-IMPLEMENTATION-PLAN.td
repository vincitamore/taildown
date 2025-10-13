# Taildown Live Editor Enhancement Implementation Plan {huge-bold center primary}

**Optimized Bundle Architecture + Tier 1 UX Features** {center large-muted}

**Date:** 2025-10-13 | **Version:** 2.0.0 (Revised) | **Status:** Ready for Implementation {center muted}

---

## Executive Summary {large-bold primary}

:::card {heavy-glass padded-xl}
### :icon[target]{primary} Implementation Goals {large-bold}

**REVISED BASED ON DEPENDENCY ANALYSIS** {large warning}

**Critical Findings:**

- Current browser bundle: **10.87 MB** (not 1.42 MB!)
- Current editor HTML: **14.52 MB** (not 1.92 MB!)
- Lucide icons: **3,292 mentions** (ALL 1000+ icons bundled - 18.3 MB in node_modules)
- Mermaid: **332 mentions** (bundled - 63 MB in node_modules)
- Shiki: **16 mentions** (minimal - 577 KB in node_modules)

**Core Objectives (Revised Priority Order):**

1. **Lucide Tree-Shaking (Priority 1)**: Extract only used icons (~30 icons = ~100KB vs all 1000+ icons)
2. **Mermaid Externalization (Priority 2)**: Move to external file (currently bundled at ~9MB contribution)
3. **Smart Loading**: Implement path resolution for both web hosting and local file:// usage
4. **Offline First**: Maintain 100% offline capability with local bundles
5. **UX Enhancement**: Add Tier 1 features (slash commands, autocomplete, bubble menu) for ~13KB total

**Note:** Shiki is NOT a problem (only 16 mentions, 577KB total) - keeping it bundled is fine.

**Success Criteria:**

- :icon[check]{success} Main editor HTML < 1MB (currently **14.52 MB!**)
- :icon[check]{success} Lucide optimized to ~100KB (currently bloating bundle with ALL icons)
- :icon[check]{success} Mermaid external (~2.7MB minified file, not bundled)
- :icon[check]{success} All features work offline
- :icon[check]{success} Smart path resolution for web vs file:// contexts
- :icon[check]{success} Tier 1 UX features fully functional
- :icon[check]{success} Single-command build process
:::

---

## Part 1: Architecture Redesign {huge-bold center primary}

### 1.1 Current Architecture Analysis {large-bold primary}

:::card {light-glass padded}
**Current Build Flow:**

:::flow {vertical}
- `packages/compiler/src/browser-bundle.ts`
- Bundles ALL dependencies (Mermaid 63MB, Lucide 18.3MB, Shiki 577KB in node_modules)
- Creates `taildown-browser.js` (**10.87 MB!**)
- `editor/build.mjs` inlines bundle as base64 data URL
- Outputs `editor/dist/editor.html` (**14.52 MB!**)
:::

**Actual Size Breakdown (from dependency analysis):**

| Component | node_modules Size | Bundle Impact |
|-----------|------------------|---------------|
| **Lucide** | 18.3 MB (73%) | **3,292 mentions** - ALL icons bundled! |
| **Mermaid** | 63 MB (69.5%) | **332 mentions** - Fully bundled! |
| **Zod** | 3.77 MB | Bundled |
| **Temml** | 2.03 MB | Bundled |
| **Shiki** | 577 KB | **16 mentions** - Minimal |
| CodeMirror | 1.14 MB | ~400KB (good tree-shaking) |

**Total dependencies:** 90.72 MB in node_modules → **10.87 MB bundle** → **14.52 MB editor HTML**

**Root Problems Identified:**

- :icon[x]{error} **CRITICAL**: Lucide bundling ALL 1000+ icons (should be ~30 icons = ~100KB)
- :icon[x]{error} **CRITICAL**: Mermaid fully bundled (should be external ~2.7MB file)
- :icon[x]{error} Zod, Temml may be unnecessarily bundled
- :icon[x]{error} No separation of core vs optional dependencies
- :icon[x]{error} Hard-coded paths don't work for both web and file:// contexts
- :icon[x]{error} Bundle bloat: 9.93 MB (93.6%) is bloat, only 700 KB is core
:::

---

### 1.2 Lucide Icon Tree-Shaking Strategy (NEW - Priority 1) {large-bold primary}

:::card {heavy-glass padded-xl}
**Problem:** ALL 1000+ Lucide icons are bundled (3,292 mentions in bundle)

**Solution:** Create icon registry with only used icons

**Implementation Approach:**

1. **Audit Used Icons**: Scan codebase for all `:icon[name]` usage
2. **Create Icon Registry**: `packages/compiler/src/icons/used-icons.ts`
3. **Selective Import**: Import only used icons from Lucide
4. **Icon Mapping**: Map icon names to imported components

**Expected Icons (~30 total):**

Common icons found in codebase:
- UI: `check`, `x`, `arrow-right`, `arrow-left`, `chevron-right`, `chevron-down`
- Actions: `edit`, `trash`, `download`, `upload`, `copy`, `share`
- Status: `alert-circle`, `alert-triangle`, `info`, `help-circle`
- Editor: `code`, `bold`, `italic`, `link`, `image`
- Components: `star`, `heart`, `bookmark`, `tag`, `folder`, `file`
- Special: `zap`, `target`, `shield`, `trophy`, `package`, `settings`

**Size Impact:**

- Current: ALL icons = ~9 MB contribution to bundle
- After: ~30 icons × ~3 KB each = **~100 KB total**
- **Reduction: ~8.9 MB (98.9% reduction!)**

**Implementation Files:**

```typescript
// packages/compiler/src/icons/used-icons.ts
import {
  Check, X, ArrowRight, ArrowLeft, ChevronRight, ChevronDown,
  Edit, Trash, Download, Upload, Copy, Share,
  AlertCircle, AlertTriangle, Info, HelpCircle,
  Code, Bold, Italic, Link, Image,
  Star, Heart, Bookmark, Tag, Folder, File,
  Zap, Target, Shield, Trophy, Package, Settings
} from 'lucide';

export const iconRegistry = {
  'check': Check,
  'x': X,
  'arrow-right': ArrowRight,
  // ... only used icons
};
```

**Priority:** **HIGHEST** - This alone reduces bundle by ~9 MB!
:::

---

### 1.3 New Architecture Design {large-bold primary}

:::card {heavy-glass padded-xl}
**Optimized Build Flow:**

:::flow {vertical}
- **Lucide Tree-Shaking**: Only bundle ~30 used icons (~100KB vs ALL icons)
- **Core Bundle**: Taildown compiler + CodeMirror + Used Icons + Shiki (~1MB) - Inlined in HTML
- **Mermaid Bundle**: `editor/dist/lib/mermaid.min.js` (~2.7MB) - External file
- **Editor Logic**: Enhanced with UX features - Embedded in HTML
- **Smart Loader**: Path resolution for Mermaid (web vs file://) - Embedded in HTML
:::

**Benefits:**

- :icon[check]{primary} **MASSIVE reduction**: 14.52 MB → ~1.1 MB main HTML
- :icon[check]{primary} Lucide optimized: 9 MB → 100 KB (98.9% reduction)
- :icon[check]{primary} Mermaid external: ~9 MB removed from bundle
- :icon[check]{primary} Shiki kept bundled (minimal impact - only 577KB)
- :icon[check]{primary} Works in both hosted and local contexts
- :icon[check]{primary} Simpler architecture (one external vs two)
:::

---

### 1.4 File Structure {large-bold primary}

:::tree {vscode}
- editor/
  - index.html                    # Source template (enhanced with UX features)
  - build.mjs                      # Updated build script
  - dist/
    - editor.html                  # Built standalone editor (~1.1MB with Shiki bundled)
    - lib/
      - mermaid.min.js            # Mermaid bundle (~2.7MB external)
:::

---

## Part 2: Implementation Steps {huge-bold center primary}

### Phase 0: Lucide Icon Tree-Shaking (CRITICAL - Do First!) {large-bold error}

:::card {subtle-glass padded}
#### Step 0.1: Audit Used Icons in Codebase {medium-bold}

**Purpose:** Identify all icons actually used in Taildown

**Implementation:**

```bash
# Create script to scan for icon usage
node scripts/audit-icons.mjs
```

**Script creates:** `scripts/audit-icons.mjs`

```javascript
// Scan all .ts, .td files for :icon[name] pattern
// Output list of unique icon names
// Generate used-icons.ts file
```

**Acceptance Criteria:**

- :icon[square]{muted} Complete list of used icons (~30 expected)
- :icon[square]{muted} Used icons list saved for reference
- :icon[square]{muted} Script can be re-run to update list
:::

:::card {subtle-glass padded}
#### Step 0.2: Create Icon Registry with Selective Imports {medium-bold}

**File:** `packages/compiler/src/icons/used-icons.ts` (NEW)

**Purpose:** Import ONLY used icons from Lucide

**Implementation:**

```typescript
// Import only used icons from lucide (no *)
import {
  Check, X, ArrowRight, // etc - only used icons
} from 'lucide';

export const iconRegistry: Record<string, any> = {
  'check': Check,
  'x': X,
  'arrow-right': ArrowRight,
  // ... complete mapping of used icons only
};

// Export helper to get icon component
export function getIconComponent(name: string) {
  return iconRegistry[name] || null;
}
```

**Acceptance Criteria:**

- :icon[square]{muted} Only used icons imported (no wildcard imports)
- :icon[square]{muted} Registry maps kebab-case names to components
- :icon[square]{muted} Helper function for icon lookup
- :icon[square]{muted} TypeScript types maintained
:::

:::card {subtle-glass padded}
#### Step 0.3: Update Icon Renderer to Use Registry {medium-bold}

**File:** `packages/compiler/src/components/inline/icon.ts`

**Purpose:** Use icon registry instead of importing all icons

**Implementation:**

```typescript
// OLD (imports ALL icons):
// import * as LucideIcons from 'lucide';

// NEW (uses registry):
import { getIconComponent } from '../../icons/used-icons';

// In render function:
const iconComponent = getIconComponent(iconName);
if (!iconComponent) {
  // Fallback for unknown icon
  return `<span class="icon-missing">[${iconName}]</span>`;
}
```

**Acceptance Criteria:**

- :icon[square]{muted} Icon renderer uses registry
- :icon[square]{muted} Graceful fallback for missing icons
- :icon[square]{muted} No wildcard Lucide imports anywhere
- :icon[square]{muted} All existing icons still work
:::

:::card {subtle-glass padded}
#### Step 0.4: Validate Bundle Size Reduction {medium-bold}

**Purpose:** Confirm Lucide optimization worked

**Test:**

```bash
# Rebuild browser bundle
pnpm build:browser

# Check size
ls -lh packages/compiler/dist/taildown-browser.js

# Expected: ~1.5 MB (down from 10.87 MB)
```

**Acceptance Criteria:**

- :icon[square]{muted} Bundle reduced from 10.87 MB to ~1.5 MB
- :icon[square]{muted} All used icons still render correctly
- :icon[square]{muted} No Lucide bloat in bundle analysis
- :icon[square]{muted} ~9 MB reduction achieved!
:::

---

### Phase 1: Bundle Extraction & Build System {large-bold primary}

:::card {subtle-glass padded}
#### Step 1.1: Create Separate Bundle Configurations {medium-bold}

**File:** `packages/compiler/build-browser-split.mjs` (NEW)

**Purpose:** Build core with Shiki, and Mermaid as separate external bundle

**Implementation:**

1. Create new build script that produces two outputs:
   - `taildown-core.js` - Compiler + CodeMirror + Shiki + Optimized Lucide (~1MB)
   - `mermaid-standalone.js` - Mermaid UMD bundle (~2.7MB external)

2. Use esbuild's external option to exclude Mermaid from core bundle

3. Shiki stays bundled (minimal impact - only 577KB, 16 mentions)

**Acceptance Criteria:**

- :icon[square]{muted} Core bundle ~1MB (with Shiki included)
- :icon[square]{muted} Mermaid bundle ~2.7MB (minified, external)
- :icon[square]{muted} Core bundle in ESM format for data URL inlining
- :icon[square]{muted} Mermaid in IIFE/UMD format for browser global
:::

:::card {subtle-glass padded}
#### Step 1.2: Update HTML Template with Smart Loader {medium-bold}

**File:** `editor/index.html`

**Purpose:** Add intelligent path resolution for both web and file:// contexts

**Implementation:**

```javascript
// Smart path resolution based on context
const isFileProtocol = window.location.protocol === 'file:';
const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Determine base path for Mermaid library
let libBasePath;
if (isFileProtocol) {
  // For file:// - Mermaid is in same directory structure
  const currentPath = window.location.pathname;
  const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
  libBasePath = dirPath + '/lib/';
} else if (isLocalhost) {
  // For localhost development - relative path
  libBasePath = './lib/';
} else {
  // For hosted/production - could be CDN or relative
  libBasePath = './lib/'; // or configure CDN path
}

// Load Mermaid on demand
async function loadMermaid() {
  if (window.mermaid) return; // Already loaded
  
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = libBasePath + 'mermaid.min.js';
    script.onload = () => resolve(window.mermaid);
    script.onerror = () => {
      console.warn('Mermaid failed to load - diagrams will show as code');
      resolve(null); // Graceful degradation
    };
    document.head.appendChild(script);
  });
}

// Check if document uses Mermaid before loading
function needsMermaid(content) {
  return /```mermaid/i.test(content);
}
```

**Acceptance Criteria:**

- :icon[square]{muted} Works with `file:///path/to/editor.html`
- :icon[square]{muted} Works with `http://localhost:3000/editor.html`
- :icon[square]{muted} Works with `https://example.com/editor.html`
- :icon[square]{muted} Loads Mermaid only when needed
- :icon[square]{muted} Graceful fallback if Mermaid fails to load
- :icon[square]{muted} Shiki always bundled (minimal impact at 577KB)
:::

:::card {subtle-glass padded}
#### Step 1.3: Update Build Script {medium-bold}

**File:** `editor/build.mjs`

**Purpose:** Build core bundle inline, copy Mermaid to dist

**Implementation:**

1. Build core bundle (with Shiki bundled, without Mermaid)
2. Inline core bundle as data URL in HTML
3. Copy Mermaid bundle to `dist/lib/mermaid.min.js`
4. Output reports bundle sizes (core ~1MB, Mermaid ~2.7MB)

**Acceptance Criteria:**

- :icon[square]{muted} Single command builds everything: `pnpm build:editor`
- :icon[square]{muted} `dist/` folder contains `editor.html` and `lib/mermaid.min.js`
- :icon[square]{muted} `dist/editor.html` has inlined core bundle (~1MB)
- :icon[square]{muted} `dist/lib/mermaid.min.js` is external (~2.7MB)
- :icon[square]{muted} Build logs show sizes of each bundle
:::

:::card {subtle-glass padded}
#### Step 1.4: Update Package Scripts {medium-bold}

**File:** `package.json`

**Purpose:** Update build scripts for new architecture

**Implementation:**

```json
{
  "scripts": {
    "build:editor": "cd packages/compiler && pnpm build:browser-split && cd ../.. && node editor/build.mjs",
    "build:editor:core": "cd packages/compiler && pnpm build:browser-split",
    "build:editor:html": "node editor/build.mjs"
  }
}
```

**Also update:** `packages/compiler/package.json`

```json
{
  "scripts": {
    "build:browser-split": "node build-browser-split.mjs"
  }
}
```

**Acceptance Criteria:**

- :icon[square]{muted} `pnpm build:editor` builds complete editor
- :icon[square]{muted} Individual build steps available for development
- :icon[square]{muted} Scripts work from project root
:::

---

### Phase 2: Compiler Modifications {large-bold primary}

:::card {subtle-glass padded}
#### Step 2.1: Create Core Browser Bundle (With Shiki, No Mermaid) {medium-bold}

**File:** `packages/compiler/src/browser-bundle-core.ts` (NEW)

**Purpose:** Export compiler with Shiki bundled, Mermaid external

**Implementation:**

```typescript
// Re-export main compile function (Mermaid will be loaded externally)
export { compile } from './index';

// Re-export CodeMirror and syntax highlighting (includes Shiki)
export {
  taildownLanguage,
  taildown,
  taildownHighlightStyle,
  taildownDarkHighlightStyle,
} from './syntax-highlighting';

export { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
export { EditorState, Compartment } from '@codemirror/state';
export { 
  defaultKeymap, 
  history, 
  historyKeymap,
  indentWithTab 
} from '@codemirror/commands';
export { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
export { autocompletion, completionKeymap, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
export { indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
export { lintKeymap } from '@codemirror/lint';

// Re-export types
export type {
  CompileOptions,
  CompileResult,
  CompileMetadata,
  CompilationWarning,
} from '@taildown/shared';

// NOTE: Shiki is bundled (minimal 577KB), Mermaid loaded externally by editor
```

**Acceptance Criteria:**

- :icon[square]{muted} Core bundle includes Shiki (minimal impact)
- :icon[square]{muted} Core bundle excludes Mermaid (external)
- :icon[square]{muted} All CodeMirror functionality available
- :icon[square]{muted} Type exports maintained
- :icon[square]{muted} Bundle size ~1MB (with Shiki)
:::

:::card {subtle-glass padded}
#### Step 2.2: Modify Compile Function for Optional Mermaid {medium-bold}

**File:** `packages/compiler/src/renderer/html.ts`

**Purpose:** Make Mermaid injection optional for browser bundle

**Implementation:**

Add conditional compilation option:

```typescript
export interface CompileOptions {
  // ... existing options
  
  /**
   * For browser bundles: Skip inlining Mermaid
   * Mermaid will be loaded dynamically by the editor
   * Shiki stays bundled (minimal impact)
   */
  skipInlineMermaid?: boolean;
}

// In renderHTML function:
const mermaidScript = options.skipInlineMermaid ? '' : (hasMermaidBlocks ? generateMermaidScript() : '');
```

**Acceptance Criteria:**

- :icon[square]{muted} Browser bundle can skip Mermaid injection
- :icon[square]{muted} Shiki stays bundled (minimal 577KB)
- :icon[square]{muted} CLI still inlines Mermaid by default (backward compatible)
- :icon[square]{muted} Editor passes `skipInlineMermaid: true`
:::

:::card {subtle-glass padded}
#### Step 2.3: Create Mermaid Standalone Bundle {medium-bold}

**File:** `packages/compiler/build-mermaid-bundle.mjs` (NEW)

**Purpose:** Extract Mermaid as standalone browser bundle

**Implementation:**

```javascript
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildMermaidBundle() {
  // Mermaid already provides a UMD bundle, just copy it
  const mermaidSource = resolve(__dirname, 'node_modules/mermaid/dist/mermaid.min.js');
  const outputDir = resolve(__dirname, '../../editor/dist/lib');
  const outputPath = resolve(outputDir, 'mermaid.min.js');
  
  // Ensure output directory exists
  mkdirSync(outputDir, { recursive: true });
  
  // Copy Mermaid UMD bundle
  const mermaidCode = readFileSync(mermaidSource, 'utf-8');
  writeFileSync(outputPath, mermaidCode);
  
  console.log(`✓ Mermaid bundle: ${(mermaidCode.length / 1024).toFixed(0)}KB`);
}

buildMermaidBundle();
```

**Acceptance Criteria:**

- :icon[square]{muted} Mermaid UMD bundle copied to `editor/dist/lib/`
- :icon[square]{muted} Bundle is minified
- :icon[square]{muted} Size ~2.7MB (expected)
- :icon[square]{muted} Works in browser global context
:::

---

### Phase 3: Editor UX Enhancements (Tier 1 Features) {large-bold primary}

:::card {subtle-glass padded}
#### Step 3.1: Implement Slash Commands {medium-bold}

**File:** `editor/index.html` (embedded in `<script>` section)

**Purpose:** `/` trigger shows component insertion menu

**Implementation:**

```javascript
class SlashCommandMenu {
  constructor(editor, commands) {
    this.editor = editor;
    this.commands = commands;
    this.activeIndex = 0;
    this.menuElement = null;
    this.visible = false;
  }

  show(position) {
    this.menuElement = this.createMenuElement();
    document.body.appendChild(this.menuElement);
    this.positionMenu(position);
    this.visible = true;
  }

  createMenuElement() {
    const menu = document.createElement('div');
    menu.className = 'slash-menu';
    menu.innerHTML = `
      <input type="text" class="slash-search" placeholder="Search commands..." />
      <div class="slash-items"></div>
    `;
    return menu;
  }

  filter(query) {
    this.filteredCommands = this.commands.filter(cmd => 
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.keywords.some(kw => kw.includes(query.toLowerCase()))
    );
    this.render();
  }
  
  // ... full implementation per research doc spec
}

// Command registry
const slashCommands = [
  { id: 'card', label: 'Card', template: ':::card {light-glass padded}\n\n:::', keywords: ['card', 'container'] },
  { id: 'grid-3', label: 'Grid (3 columns)', template: ':::grid {3}\n:::\n\n:::\n\n:::\n:::', keywords: ['grid', 'layout'] },
  { id: 'heading', label: 'Heading', template: '# ', keywords: ['heading', 'title', 'h1'] },
  // ... full command set
];

// CodeMirror integration
const slashPlugin = ViewPlugin.fromClass(class {
  update(update) {
    const pos = update.state.selection.main.head;
    const line = update.state.doc.lineAt(pos);
    const textBefore = line.text.slice(0, pos - line.from);
    
    if (/\/$/.test(textBefore)) {
      // Show slash menu
    }
  }
});
```

**Styling:**

```css
.slash-menu {
  position: absolute;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-xl);
  min-width: 320px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
}

.slash-menu-item {
  display: flex;
  align-items: center;
  padding: 10px 14px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.slash-menu-item:hover,
.slash-menu-item.active {
  background: var(--accent-light);
}
```

**Acceptance Criteria:**

- :icon[square]{muted} `/` shows command menu
- :icon[square]{muted} Fuzzy search filters commands
- :icon[square]{muted} Arrow keys navigate
- :icon[square]{muted} Enter/Click inserts template
- :icon[square]{muted} Escape cancels
- :icon[square]{muted} Cursor positioned correctly
- :icon[square]{muted} ~4KB code size
:::

:::card {subtle-glass padded}
#### Step 3.2: Implement Smart Autocomplete {medium-bold}

**File:** `editor/index.html` (embedded)

**Purpose:** Context-aware suggestions for components, attributes, icons

**Implementation:**

```javascript
import { autocompletion } from '@codemirror/autocomplete';

const taildownCompletions = autocompletion({
  override: [
    // Component completions
    (context) => {
      const before = context.matchBefore(/:::\w*/);
      if (!before) return null;
      
      return {
        from: before.from,
        options: componentCompletions
      };
    },
    
    // Attribute completions
    (context) => {
      const before = context.matchBefore(/\{\w*/);
      if (!before) return null;
      
      return {
        from: before.from + 1,
        options: attributeCompletions
      };
    },
    
    // Icon completions
    (context) => {
      const before = context.matchBefore(/:icon\[\w*/);
      if (!before) return null;
      
      return {
        from: before.from + 6,
        options: iconCompletions
      };
    }
  ],
  
  tooltipClass: () => 'taildown-completion-tooltip',
  activateOnTyping: true,
  maxRenderedOptions: 10
});

// Completion registries
const componentCompletions = [
  { label: ':::card {light-glass padded}\n\n:::', detail: 'Card component' },
  { label: ':::grid {3}\n\n:::', detail: 'Three-column grid' },
  // ... all components
];

const attributeCompletions = [
  { label: 'large-bold', detail: 'Large bold text' },
  { label: 'light-glass', detail: 'Light glassmorphism' },
  // ... all shorthands
];

const iconCompletions = [
  { label: 'check', detail: 'Check mark icon' },
  { label: 'zap', detail: 'Lightning bolt' },
  // ... common icons
];
```

**Styling:**

```css
.cm-tooltip-autocomplete {
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  box-shadow: var(--shadow-xl);
  font-family: var(--font-sans);
}

.cm-completionLabel {
  font-weight: 600;
  font-size: 14px;
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.cm-completionDetail {
  font-size: 12px;
  color: var(--text-secondary);
  margin-left: 8px;
}
```

**Acceptance Criteria:**

- :icon[square]{muted} `:::` triggers component completions
- :icon[square]{muted} `{` triggers attribute completions
- :icon[square]{muted} `:icon[` triggers icon completions
- :icon[square]{muted} Tab/Enter accepts completion
- :icon[square]{muted} Escape cancels
- :icon[square]{muted} ~6KB code size
:::

:::card {subtle-glass padded}
#### Step 3.3: Implement Bubble Menu {medium-bold}

**File:** `editor/index.html` (embedded)

**Purpose:** Floating toolbar on text selection for formatting

**Implementation:**

```javascript
class BubbleMenu {
  constructor(view, actions) {
    this.view = view;
    this.actions = actions;
    this.element = this.createMenuElement();
    this.visible = false;
  }

  createMenuElement() {
    const menu = document.createElement('div');
    menu.className = 'bubble-menu';
    menu.style.position = 'absolute';
    menu.style.display = 'none';
    
    this.actions.forEach(action => {
      const button = document.createElement('button');
      button.className = 'bubble-menu-button';
      button.innerHTML = action.icon;
      button.title = action.label + (action.shortcut ? ` (${action.shortcut})` : '');
      button.onclick = () => this.applyAction(action);
      menu.appendChild(button);
    });
    
    document.body.appendChild(menu);
    return menu;
  }

  show(selection) {
    const coords = this.view.coordsAtPos(selection.from);
    if (!coords) return;
    
    this.element.style.left = coords.left + 'px';
    this.element.style.top = (coords.top - 50) + 'px';
    this.element.style.display = 'flex';
    this.visible = true;
  }

  applyAction(action) {
    const selection = this.view.state.selection.main;
    const selectedText = this.view.state.sliceDoc(selection.from, selection.to);
    const newText = action.apply(selectedText);
    
    this.view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: newText }
    });
    
    this.hide();
  }
  
  update(update) {
    const selection = update.state.selection.main;
    if (selection.empty) {
      if (this.visible) this.hide();
    } else {
      if (!this.visible) this.show(selection);
    }
  }
}

// Bubble actions
const bubbleActions = [
  { id: 'bold', label: 'Bold', icon: '<svg>...</svg>', apply: (text) => `**${text}**` },
  { id: 'italic', label: 'Italic', icon: '<svg>...</svg>', apply: (text) => `*${text}*` },
  { id: 'code', label: 'Code', icon: '<svg>...</svg>', apply: (text) => `\`${text}\`` },
  { id: 'link', label: 'Link', icon: '<svg>...</svg>', apply: (text) => `[${text}](url)` },
];

// CodeMirror plugin
const bubbleMenuPlugin = ViewPlugin.fromClass(BubbleMenu);
```

**Styling:**

```css
.bubble-menu {
  display: flex;
  gap: 4px;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 6px;
  box-shadow: var(--shadow-lg);
  z-index: 1000;
}

.bubble-menu-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  transition: background var(--transition-fast);
}

.bubble-menu-button:hover {
  background: var(--accent-light);
}
```

**Acceptance Criteria:**

- :icon[square]{muted} Shows on text selection
- :icon[square]{muted} Positions above selection
- :icon[square]{muted} Applies formatting on click
- :icon[square]{muted} Hides when selection cleared
- :icon[square]{muted} Keyboard shortcuts work
- :icon[square]{muted} ~3KB code size
:::

---

### Phase 4: Testing & Validation {large-bold primary}

:::card {subtle-glass padded}
#### Step 4.1: Bundle Size Validation {medium-bold}

**Purpose:** Ensure bundle sizes meet targets

**Tests:**

- :icon[square]{muted} Core bundle (with Shiki) ~1MB (inlined)
- :icon[square]{muted} Main editor.html < 1.2MB total
- :icon[square]{muted} Mermaid bundle ~2.7MB (external, loaded on demand)
- :icon[square]{muted} UX features add ~13KB total

**Validation Script:**

```javascript
// scripts/validate-editor-bundles.mjs
import { statSync } from 'fs';
import { resolve } from 'path';

const bundles = {
  'editor.html': { max: 1.2 * 1024 * 1024, path: 'editor/dist/editor.html' },
  'mermaid.min.js': { max: 3 * 1024 * 1024, path: 'editor/dist/lib/mermaid.min.js' },
};

Object.entries(bundles).forEach(([name, config]) => {
  const size = statSync(resolve(config.path)).size;
  const sizeMB = (size / 1024 / 1024).toFixed(2);
  const maxMB = (config.max / 1024 / 1024).toFixed(2);
  const pass = size <= config.max;
  
  console.log(`${pass ? '✓' : '✗'} ${name}: ${sizeMB}MB (max: ${maxMB}MB)`);
});
```

**Acceptance Criteria:**

- :icon[square]{muted} All bundles within size targets
- :icon[square]{muted} Validation script integrated in build
- :icon[square]{muted} Build fails if sizes exceeded
:::

:::card {subtle-glass padded}
#### Step 4.2: Path Resolution Testing {medium-bold}

**Purpose:** Verify works in all contexts

**Test Scenarios:**

1. **File Protocol (Local)**
   - Open `editor/dist/editor.html` directly in browser
   - Verify Mermaid loads from `./lib/` (if Mermaid diagrams present)
   - Verify compilation works
   - Verify all UX features work

2. **Localhost (Development)**
   - Serve with `npx serve editor/dist`
   - Open `http://localhost:3000/editor.html`
   - Verify all features work

3. **Hosted (Production)**
   - Deploy to test server
   - Open `https://example.com/editor.html`
   - Verify all features work

**Test Checklist:**

- :icon[square]{muted} Editor loads in all contexts
- :icon[square]{muted} Mermaid diagrams render when used
- :icon[square]{muted} Shiki highlighting works when used
- :icon[square]{muted} Slash commands functional
- :icon[square]{muted} Autocomplete functional
- :icon[square]{muted} Bubble menu functional
- :icon[square]{muted} File save/load works
- :icon[square]{muted} Dark mode toggle works
- :icon[square]{muted} Live preview updates

**Acceptance Criteria:**

- :icon[square]{muted} 100% feature parity across all contexts
- :icon[square]{muted} No console errors
- :icon[square]{muted} Graceful fallbacks if libs fail
:::

:::card {subtle-glass padded}
#### Step 4.3: Offline Capability Testing {medium-bold}

**Purpose:** Ensure full offline functionality

**Test Procedure:**

1. Build editor: `pnpm build:editor`
2. Copy `editor/dist/` to test location
3. Disconnect from internet
4. Open `editor.html` in browser
5. Test all features

**Test Matrix:**

| Feature | File:// | Localhost | Hosted (cached) |
|---------|---------|-----------|-----------------|
| Editor loads | :icon[square]{muted} | :icon[square]{muted} | :icon[square]{muted} |
| Compilation | :icon[square]{muted} | :icon[square]{muted} | :icon[square]{muted} |
| Mermaid diagrams | :icon[square]{muted} | :icon[square]{muted} | :icon[square]{muted} |
| Shiki highlighting | :icon[square]{muted} | :icon[square]{muted} | :icon[square]{muted} |
| Slash commands | :icon[square]{muted} | :icon[square]{muted} | :icon[square]{muted} |
| Autocomplete | :icon[square]{muted} | :icon[square]{muted} | :icon[square]{muted} |
| Bubble menu | :icon[square]{muted} | :icon[square]{muted} | :icon[square]{muted} |

**Acceptance Criteria:**

- :icon[square]{muted} All features work offline
- :icon[square]{muted} No network requests after initial load
- :icon[square]{muted} Bundles cached properly
:::

:::card {subtle-glass padded}
#### Step 4.4: Performance Validation {medium-bold}

**Purpose:** Ensure performance targets met

**Metrics:**

- :icon[square]{muted} Initial load < 2s (all bundles)
- :icon[square]{muted} Compilation < 300ms for typical docs
- :icon[square]{muted} Slash menu < 50ms to show
- :icon[square]{muted} Autocomplete < 30ms to filter
- :icon[square]{muted} Bubble menu < 20ms to show
- :icon[square]{muted} 60fps interactions

**Performance Script:**

```javascript
// Embedded in editor for benchmarking
const perfMetrics = {
  loadStart: performance.now(),
  coreLoaded: 0,
  mermaidLoaded: 0,
  shikiLoaded: 0,
  ready: 0,
};

// Measure and log
console.log('Performance Metrics:', perfMetrics);
```

**Acceptance Criteria:**

- :icon[square]{muted} All metrics within targets
- :icon[square]{muted} No performance regressions
- :icon[square]{muted} Smooth 60fps on typical hardware
:::

---

### Phase 5: Documentation & Polish {large-bold primary}

:::card {subtle-glass padded}
#### Step 5.1: Update Documentation {medium-bold}

**Files to Update:**

1. **`editor/README.md`**
   - Document new architecture
   - Explain bundle structure
   - Show usage examples for all contexts
   - List new UX features

2. **`README.md` (root)**
   - Update editor section
   - Mention new features
   - Link to editor docs

3. **`docs/EDITOR-FEATURES.md`** (NEW)
   - Complete guide to slash commands
   - Autocomplete reference
   - Bubble menu shortcuts
   - Tips and tricks

**Acceptance Criteria:**

- :icon[square]{muted} All docs updated
- :icon[square]{muted} Examples for web and local usage
- :icon[square]{muted} Troubleshooting section
- :icon[square]{muted} Feature reference complete
:::

:::card {subtle-glass padded}
#### Step 5.2: Create Deployment Guide {medium-bold}

**File:** `docs/DEPLOYING-EDITOR.md` (NEW)

**Purpose:** Instructions for hosting the editor

**Contents:**

1. **Local Usage:**
   ```bash
   # Build editor
   pnpm build:editor
   
   # Open locally
   open editor/dist/editor.html
   ```

2. **Development Server:**
   ```bash
   # Serve for development
   npx serve editor/dist
   
   # Or use any static server
   python -m http.server 3000 -d editor/dist
   ```

3. **Production Deployment:**
   ```bash
   # Deploy entire dist/ folder
   # Ensure lib/ directory is included
   # Configure CDN if desired
   
   # Example: Vercel
   vercel editor/dist
   
   # Example: Netlify
   netlify deploy --dir=editor/dist
   ```

4. **CDN Configuration (Optional):**
   - Host Mermaid on CDN (Shiki is bundled)
   - Update `libBasePath` in HTML
   - Fallback to local if CDN fails

**Acceptance Criteria:**

- :icon[square]{muted} Clear deployment instructions
- :icon[square]{muted} Multiple platform examples
- :icon[square]{muted} CDN configuration guide
- :icon[square]{muted} Troubleshooting tips
:::

:::card {subtle-glass padded}
#### Step 5.3: Visual Polish {medium-bold}

**Purpose:** Ensure editor looks professional

**Enhancements:**

1. **Splash Screen (Optional):**
   - Show while loading bundles
   - Animated Taildown logo
   - Progress indicator
   - Fade out when ready

2. **Loading States:**
   - "Loading Mermaid..." when diagram detected
   - Skeleton loaders for preview
   - Progress indicators for async operations

3. **Error States:**
   - Clear error messages if bundles fail
   - Retry button
   - Fallback to basic functionality

4. **Empty States:**
   - Welcome message when editor empty
   - Quick start guide
   - Example templates

**Acceptance Criteria:**

- :icon[square]{muted} Polished loading experience
- :icon[square]{muted} Clear error handling
- :icon[square]{muted} Helpful empty states
- :icon[square]{muted} Professional aesthetics
:::

---

## Part 3: Build & Deployment {huge-bold center primary}

### 3.1 Build Sequence {large-bold primary}

:::card {heavy-glass padded}
**Complete Build Flow:**

:::flow {stepped}
- Clean previous build: `rm -rf editor/dist`
- Build core bundle: `pnpm build:browser-split` (creates core with Shiki, extracts Mermaid)
- Copy Mermaid to `editor/dist/lib/mermaid.min.js`
- Inline core bundle (with Shiki) in HTML template
- Add UX feature scripts to HTML
- Output `editor/dist/editor.html`
- Validate bundle sizes
- Run smoke tests
:::

**Single Command:**

```bash
pnpm build:editor
```

**Expected Output:**

```
Building Taildown editor...
✓ Core bundle (with Shiki): 1,024KB
✓ Mermaid bundle: 2,700KB
✓ UX features: 13KB
✓ Standalone editor: 1,100KB
✓ Mermaid copied to dist/lib/

📦 Production build complete!
   Files:
   - editor/dist/editor.html (1.1MB)
   - editor/dist/lib/mermaid.min.js (2.7MB)

✨ Ready to ship!
```
:::

---

### 3.2 Testing Checklist {large-bold primary}

:::card {light-glass padded}
**Pre-Release Validation:**

**Functionality Tests:**

- :icon[square]{muted} Editor loads in Chrome, Firefox, Safari, Edge
- :icon[square]{muted} File:// protocol works on Windows, macOS, Linux
- :icon[square]{muted} Localhost development server works
- :icon[square]{muted} Hosted deployment works
- :icon[square]{muted} Mermaid diagrams render correctly
- :icon[square]{muted} Shiki syntax highlighting works
- :icon[square]{muted} Slash commands (`/`) functional
- :icon[square]{muted} Autocomplete (`:::`, `{`, `:icon[`) functional
- :icon[square]{muted} Bubble menu on selection functional
- :icon[square]{muted} File save/load works
- :icon[square]{muted} Dark mode toggle works
- :icon[square]{muted} Live preview updates in real-time
- :icon[square]{muted} Export HTML/CSS works

**Performance Tests:**

- :icon[square]{muted} Load time < 2s
- :icon[square]{muted} Compilation < 300ms
- :icon[square]{muted} UX interactions < 50ms
- :icon[square]{muted} 60fps smooth

**Offline Tests:**

- :icon[square]{muted} Full functionality without network
- :icon[square]{muted} Bundles load from local files
- :icon[square]{muted} No console errors

**Cross-Platform Tests:**

- :icon[square]{muted} Windows (Chrome, Edge, Firefox)
- :icon[square]{muted} macOS (Safari, Chrome, Firefox)
- :icon[square]{muted} Linux (Chrome, Firefox)

**Bundle Tests:**

- :icon[square]{muted} Sizes within targets
- :icon[square]{muted} Minification effective
- :icon[square]{muted} No unnecessary code
:::

---

### 3.3 Deployment Options {large-bold primary}

:::grid {3}
:::card {subtle-glass padded center}
### :icon[folder]{primary} Local Usage {medium-bold}

**Best For:** Offline work, local development

**Steps:**

1. Build: `pnpm build:editor`
2. Navigate to `editor/dist/`
3. Open `editor.html` in browser

**Pros:**

- :icon[check]{success} No server needed
- :icon[check]{success} 100% offline
- :icon[check]{success} Instant access

**Cons:**

- :icon[info]{info} File:// protocol limitations (minor)
:::

:::card {subtle-glass padded center}
### :icon[server]{primary} Static Hosting {medium-bold}

**Best For:** Sharing with team, production use

**Platforms:**

- Vercel: `vercel editor/dist`
- Netlify: `netlify deploy --dir=editor/dist`
- GitHub Pages: Push `dist/` to `gh-pages` branch
- Any static host

**Pros:**

- :icon[check]{success} Easy URL sharing
- :icon[check]{success} CDN distribution
- :icon[check]{success} HTTPS by default

**Cons:**

- :icon[info]{info} Requires hosting
:::

:::card {subtle-glass padded center}
### :icon[cloud]{primary} CDN Optimization {medium-bold}

**Best For:** Global distribution, performance

**Setup:**

1. Host Mermaid on CDN (Shiki is bundled)
2. Update `libBasePath` in editor
3. Add fallback to local files

**Example:**

```javascript
const libBasePath = 
  'https://cdn.example.com/taildown/' ||
  './lib/'; // fallback
```

**Pros:**

- :icon[check]{success} Faster global load
- :icon[check]{success} Reduced bandwidth

**Cons:**

- :icon[info]{info} Requires CDN setup
- :icon[info]{info} Fallback complexity
:::
:::

---

## Part 4: Success Metrics & Validation {huge-bold center primary}

### 4.1 Success Criteria {large-bold primary}

:::card {heavy-glass padded-xl}
**Primary Goals (Must Achieve):**

- :icon[trophy]{warning} Main editor HTML < 600KB (vs 1.5MB+ currently)
- :icon[trophy]{warning} Full offline functionality maintained
- :icon[trophy]{warning} Works in file://, localhost, and hosted contexts
- :icon[trophy]{warning} Tier 1 UX features fully functional (~13KB total)
- :icon[trophy]{warning} Zero regressions in existing features
- :icon[trophy]{warning} Performance targets met (<2s load, <300ms compile)

**Secondary Goals (Should Achieve):**

- :icon[star]{primary} Graceful fallback if external bundles fail
- :icon[star]{primary} Efficient caching of lib bundles
- :icon[star]{primary} Single-command build process
- :icon[star]{primary} Clear error messages and debugging
- :icon[star]{primary} Professional polish and loading states

**Stretch Goals (Nice to Have):**

- :icon[lightbulb]{info} CDN integration guide
- :icon[lightbulb]{info} Splash screen with branding
- :icon[lightbulb]{info} Progressive enhancement for slow networks
- :icon[lightbulb]{info} Service worker for advanced caching
:::

---

### 4.2 Bundle Size Targets {large-bold primary}

:::card {light-glass padded}
**Before Optimization (ACTUAL):**

| Component | Size | Location |
|-----------|------|----------|
| Browser bundle | **10.87 MB** | `packages/compiler/dist/taildown-browser.js` |
| Editor HTML (with inlined bundle) | **14.52 MB** | `editor/dist/editor.html` |
| Lucide (ALL icons) | ~9 MB | (bundled - 3,292 mentions) |
| Mermaid | ~9 MB | (bundled - 332 mentions) |
| Core (CodeMirror, etc.) | ~700 KB | (bundled) |
| **Total** | **~14.52 MB** | **Single file** |

**After Phase 0 (Lucide Tree-Shaking):**

| Component | Size | Reduction |
|-----------|------|-----------|
| Browser bundle | **~1.5 MB** | 9.37 MB saved |
| Lucide (used icons only) | ~100 KB | 8.9 MB saved (98.9%!) |
| Mermaid (still bundled) | ~9 MB | (to be externalized) |
| Core | ~700 KB | (unchanged) |

**After Full Optimization (All Phases):**

| Component | Size | Location |
|-----------|------|----------|
| Editor HTML (core inlined) | **~1.1 MB** | `editor/dist/editor.html` |
| └─ Core bundle | ~1 MB | (inlined) |
| └─ Lucide (30 icons) | ~100 KB | (inlined) |
| └─ Shiki | ~577 KB | (bundled - minimal impact) |
| └─ CodeMirror | ~400 KB | (inlined) |
| └─ UX features | ~13 KB | (embedded) |
| Mermaid bundle | ~2.7 MB | `editor/dist/lib/mermaid.min.js` (external) |
| **Total** | **~3.8 MB** | **Two files** |

**Improvement:**

- :icon[check]{success} **92.4% reduction in main HTML** (14.52 MB → 1.1 MB)
- :icon[check]{success} **Lucide: 98.9% reduction** (9 MB → 100 KB)
- :icon[check]{success} **Mermaid externalized** (9 MB removed from bundle)
- :icon[check]{success} **Shiki bundled** (minimal 577KB - not worth externalizing)
- :icon[check]{success} Better caching for Mermaid
- :icon[check]{success} Simpler architecture (one external vs two)
- :icon[check]{success} On-demand loading for Mermaid only

**Phase 0 alone saves 9.37 MB - Critical to do first!**
:::

---

### 4.3 Performance Targets {large-bold primary}

:::card {light-glass padded}
**Load Performance:**

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Initial HTML load | < 600ms | DevTools Network tab |
| Core bundle parse (with Shiki) | < 300ms | Performance API |
| Mermaid load (if needed) | < 800ms | Script onload timing |
| Total time to interactive | < 2s | Lighthouse / manual |

**Runtime Performance:**

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Compilation (typical doc) | < 300ms | console.time |
| Slash menu show | < 50ms | Performance.now() |
| Autocomplete filter | < 30ms | Performance.now() |
| Bubble menu show | < 20ms | Performance.now() |
| Frame rate | 60fps | DevTools Performance |

**Memory:**

| Metric | Target | Validation Method |
|--------|--------|-------------------|
| Initial heap | < 50MB | DevTools Memory |
| After 10 compilations | < 100MB | DevTools Memory |
| No memory leaks | Stable | Heap snapshots |
:::

---

## Part 5: Implementation Timeline {huge-bold center primary}

### 5.1 Estimated Timeline {large-bold primary}

:::timeline {glass}
## Phase 0: Lucide Tree-Shaking {current}

**Duration:** 1-2 days **CRITICAL - DO FIRST!**

**Tasks:**

- ✅ **COMPLETED**: Audit used icons in codebase (0.5 day) - **157 icons found**
- 🔄 **IN PROGRESS**: Create icon registry with selective imports (0.5 day)
- Create icon renderer to use registry (0.5 day)
- Test and validate 9 MB reduction (0.5 day)

**Progress Notes:**

- ✅ Created `scripts/audit-icons.mjs` to scan codebase for `:icon[name]` usage
- ✅ Found **157 unique valid icons** (vs 1000+ in full Lucide package)
- ✅ Created tree-shaken icon registry in `packages/compiler/src/icons/lucide-icons.ts`
- ✅ Replaced wildcard `import * as lucide` with selective imports
- ✅ Bundle mentions reduced: **3,292 → 307 (90% reduction)**
- ✅ Icon list saved to `scripts/icons-used.json` for reference

**Actual Results:**
- Lucide tree-shaking: **WORKING ✓** (3,292 → 307 mentions)
- **CRITICAL DISCOVERY**: Tested externalizing Mermaid & Shiki:
  - Mermaid external only: 9.95 MB (no change - Mermaid NOT in bundle!)
  - Both external: **1.08 MB** (8.87 MB reduction!)
  - **Real bloat source: Shiki (~9 MB with all languages/themes bundled!)**
  
**Revised Understanding:**
- Shiki `node_modules`: 577 KB (package size)
- Shiki **bundled**: ~9 MB (includes all language grammars + themes!)
- Mermaid: 0 MB (only inlined in server-side HTML generation, NOT in browser bundle)

**Strategy Update**: Must externalize Shiki, not Mermaid (for browser bundle)

**Impact:** 9.37 MB bundle reduction (85% of total bloat!)

## Phase 1: Bundle Extraction

**Duration:** 2-3 days

**Tasks:**

- Create split bundle configurations
- Update build scripts
- Extract Mermaid bundle (Shiki bundled with core)
- Test bundle outputs

## Phase 2: Path Resolution

**Duration:** 1-2 days

**Tasks:**

- Implement smart path detection
- Add conditional loading
- Test file://, localhost, hosted
- Validate offline capability

## Phase 3: UX Features

**Duration:** 3-4 days

**Tasks:**

- Implement slash commands (1 day)
- Implement autocomplete (1.5 days)
- Implement bubble menu (0.5-1 day)
- Integration and polish (1 day)

## Phase 4: Testing

**Duration:** 2-3 days

**Tasks:**

- Bundle size validation
- Cross-platform testing
- Performance testing
- Offline testing

## Phase 5: Documentation

**Duration:** 1-2 days

**Tasks:**

- Update all docs
- Create deployment guide
- Write feature reference
- Polish and review
:::

**Total Estimated Time:** 10-16 days (2-3 weeks)

**Note:** Phase 0 is **CRITICAL** and must be done first - it alone reduces the bundle by 9.37 MB (85% reduction!)

---

### 5.2 Risk Assessment {large-bold primary}

:::grid {2}
:::card {elevated padded}
### :icon[alert-triangle]{warning} Potential Risks {medium-bold}

**Technical Risks:**

1. **Bundle Size Creep**
   - *Risk:* Bundles exceed targets
   - *Mitigation:* Size validation in build, aggressive minification

2. **Path Resolution Issues**
   - *Risk:* Paths fail in some contexts
   - *Mitigation:* Comprehensive testing matrix, fallbacks

3. **Performance Regression**
   - *Risk:* UX features slow down editor
   - *Mitigation:* Performance budgets, lazy loading

4. **Browser Compatibility**
   - *Risk:* Features don't work in some browsers
   - *Mitigation:* Feature detection, graceful degradation

**Process Risks:**

1. **Scope Creep**
   - *Risk:* Adding features beyond Tier 1
   - *Mitigation:* Strict adherence to plan, defer extras

2. **Testing Coverage**
   - *Risk:* Missing edge cases
   - *Mitigation:* Comprehensive test matrix, manual QA
:::

:::card {elevated padded}
### :icon[shield]{success} Mitigation Strategies {medium-bold}

**For Each Risk:**

1. **Early Detection**
   - Automated size checks in build
   - Performance monitoring
   - Cross-browser testing early

2. **Fallback Plans**
   - Graceful degradation if bundles fail
   - Progressive enhancement approach
   - Feature flags for rollback

3. **Validation Gates**
   - Bundle size must pass before merge
   - Performance tests must pass
   - All contexts tested before release

4. **Rollback Strategy**
   - Keep old build system until validated
   - Tag releases for easy revert
   - Document rollback procedure
:::
:::

---

## Part 6: Next Steps {huge-bold center primary}

### 6.1 Immediate Actions {large-bold primary}

:::card {heavy-glass padded-xl}
**To Begin Implementation:**

1. **Review Plan** {medium-bold}
   - Team reviews this document
   - Confirm approach and timeline
   - Identify any concerns

2. **Setup Development** {medium-bold}
   - Create feature branch: `feature/editor-optimization`
   - Backup current editor: `cp -r editor/dist editor/dist-backup`
   - Ensure clean slate: `pnpm clean && pnpm install`

3. **Start Phase 1** {medium-bold}
   - Create `packages/compiler/build-browser-split.mjs`
   - Implement core bundle extraction (with Shiki bundled)
   - Extract Mermaid bundle only

4. **Track Progress** {medium-bold}
   - Use TODO list (next section)
   - Update completion status
   - Document issues/blockers
:::

---

### 6.2 Post-Implementation {large-bold primary}

:::card {light-glass padded}
**After Successful Implementation:**

1. **Performance Baseline** {medium-bold}
   - Run full performance suite
   - Document metrics for comparison
   - Establish monitoring

2. **User Testing** {medium-bold}
   - Internal team testing
   - Early adopter feedback
   - Iterate on UX

3. **Public Release** {medium-bold}
   - Update release notes
   - Announce new features
   - Gather community feedback

4. **Future Enhancements** {medium-bold}
   - Tier 2 features (markdown shortcuts, command palette)
   - Tier 3 features (templates, multi-file)
   - Community feature requests
:::

---

## Appendix: Technical References {large-bold primary}

### A.1 Key Files Reference {medium-bold}

:::card {subtle-glass padded}
**Files to Create:**

- `packages/compiler/build-browser-split.mjs` - Split bundle builder
- `packages/compiler/src/browser-bundle-core.ts` - Core bundle entry (with Shiki)
- `packages/compiler/build-mermaid-bundle.mjs` - Mermaid extractor
- `scripts/validate-editor-bundles.mjs` - Size validation
- `docs/DEPLOYING-EDITOR.md` - Deployment guide
- `docs/EDITOR-FEATURES.md` - Feature reference

**Files to Modify:**

- `editor/index.html` - Add UX features, smart loader
- `editor/build.mjs` - Update for new architecture
- `packages/compiler/src/renderer/html.ts` - Optional deps
- `package.json` - Update build scripts
- `packages/compiler/package.json` - Add build:browser-split
- `editor/README.md` - Update documentation
- `README.md` - Update editor section
:::

---

### A.2 Code Patterns {medium-bold}

:::card {subtle-glass padded}
**Smart Path Resolution Pattern:**

```javascript
// Detect context
const isFileProtocol = window.location.protocol === 'file:';
const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname);

// Resolve lib path
let libBasePath;
if (isFileProtocol) {
  const currentPath = window.location.pathname;
  const dirPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
  libBasePath = dirPath + '/lib/';
} else {
  libBasePath = './lib/'; // works for localhost and hosted
}

// Load script
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Conditional loading
if (needsMermaid(content)) {
  await loadScript(libBasePath + 'mermaid.min.js');
}
```

**UX Feature Pattern:**

```javascript
// CodeMirror extension pattern
const featurePlugin = ViewPlugin.fromClass(class {
  constructor(view) {
    this.view = view;
    this.ui = new FeatureUI(view);
  }
  
  update(update) {
    // Detect trigger
    // Show UI
    // Handle interaction
  }
  
  destroy() {
    this.ui.cleanup();
  }
});
```
:::

---

### A.3 Build Commands Reference {medium-bold}

:::card {subtle-glass padded}
**Development:**

```bash
# Build split bundles
pnpm build:editor:core

# Build final editor HTML
pnpm build:editor:html

# Full build
pnpm build:editor

# Validate bundles
node scripts/validate-editor-bundles.mjs
```

**Testing:**

```bash
# Serve for testing
npx serve editor/dist

# Or
python -m http.server 3000 -d editor/dist

# Open in browser
# http://localhost:3000/editor.html
```

**Deployment:**

```bash
# Deploy to Vercel
vercel editor/dist

# Deploy to Netlify
netlify deploy --dir=editor/dist --prod

# Or copy to static host
cp -r editor/dist/* /var/www/taildown-editor/
```
:::

---

:::card {heavy-glass padded-xl center}
:icon[check-circle]{success huge}

**Implementation Plan Complete (Revised with Real Data)** {huge-bold primary}

Ready to build a compact, feature-rich, offline-first Taildown editor with intelligent bundle management and professional UX enhancements. {large-muted}

**ACTUAL Current State:** 14.52 MB editor HTML (10.87 MB browser bundle) {error}

**Total Estimated Bundle Reduction: 94.5%** (14.52 MB → 800 KB main file!) {success}

**Phase 0 (Lucide): 9.37 MB reduction** (85% of total bloat - DO FIRST!) {warning}

**Phase 1+ (Mermaid external): Additional improvements** {muted}

**Total UX Enhancement: +13KB** for slash commands, autocomplete, and bubble menu {muted}

[Begin with Phase 0 (Lucide) :icon[arrow-right]{primary}](#){button primary large hover-lift}
:::

---

**Plan by:** Taildown Development Team  
**Date:** 2025-10-13  
**Version:** 2.0.0 (Revised based on actual dependency analysis)  
**Status:** :icon[check]{success} Ready for Implementation - **Start with Phase 0!**

