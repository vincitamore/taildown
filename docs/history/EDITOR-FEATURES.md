# Taildown Live Editor - Features Guide

**Version:** 0.1.0  
**Last Updated:** October 13, 2025

A comprehensive guide to all features in the Taildown Live Editor, a modern browser-based editor with Notion-inspired UX.

---

## Table of Contents

1. [Core Editing Features](#core-editing-features)
2. [Slash Commands](#slash-commands)
3. [Mermaid Diagrams](#mermaid-diagrams)
4. [File Management](#file-management)
5. [Keyboard Shortcuts](#keyboard-shortcuts)
6. [UI/UX Features](#uiux-features)
7. [Browser Compatibility](#browser-compatibility)
8. [Performance Metrics](#performance-metrics)

---

## Core Editing Features

### Syntax Highlighting

The editor uses CodeMirror 6 with custom Taildown language support:

- **Markdown Syntax**: Full CommonMark + GFM support
- **Taildown Extensions**: Component blocks (`:::card`), attributes (`{primary}`), icons (`:icon[name]`)
- **Real-time Highlighting**: Updates as you type with zero lag
- **Theme**: Custom Taildown theme with excellent contrast

### Live Preview

Split-pane view with real-time compilation:

- **300ms Debounce**: Waits for typing to stop before compiling
- **Error Handling**: Shows friendly error messages when syntax is invalid
- **Scroll Sync**: Preview scrolls independently from editor
- **Iframe Isolation**: Preview runs in sandboxed iframe for safety

### Modern Font

**JetBrains Mono** - A beautiful, modern monospace font optimized for code:

- Loaded via Google Fonts CDN
- Crisp rendering at all sizes
- Excellent ligatures for code symbols
- Fallbacks to system monospace if offline

### Smart Insertions

When inserting content via slash commands, the cursor is intelligently positioned:

| Insertion | Cursor Position | Example |
|-----------|----------------|---------|
| **Bold** | Between asterisks | `**█**` |
| **Link** | In text area | `[█](url)` |
| **Card** | In title attribute | `:::card title="█"` |
| **Alert** | Between fences | `:::alert\n█\n:::` |
| **Table** | In first cell | `\| Header 1 \| Header 2 \|\n\|----------|----------\|\n\| █ \| \|` |
| **Code Block** | Inside block | ` ```\n█\n``` ` |

This allows you to immediately start typing content without manually navigating.

---

## Slash Commands

### Overview

Type `/` at the start of a line or after whitespace to trigger a beautiful command menu with 20 quick-insert options.

### Features

- **Instant Trigger**: Menu appears immediately when `/` is typed
- **Fuzzy Search**: Filter by typing (e.g., `/card` shows Card component)
- **Keyboard Navigation**:
  - `↑` / `↓` - Navigate commands
  - `Enter` - Select highlighted command
  - `Escape` - Close menu
- **Mouse Support**: Click any command to insert
- **Visual Feedback**: Selected item highlighted with accent color
- **Lucide Icons**: Each command has a descriptive icon

### Available Commands

#### Headings

| Command | Insert | Description |
|---------|--------|-------------|
| **Heading 1** | `# ` | Large section heading |
| **Heading 2** | `## ` | Medium section heading |
| **Heading 3** | `### ` | Small section heading |

#### Formatting

| Command | Insert | Cursor Position |
|---------|--------|-----------------|
| **Bold** | `****` | Between asterisks |
| **Italic** | `**` | Between asterisks |
| **Inline Code** | ` `` ` | Between backticks |
| **Code Block** | ` ```\n\n``` ` | Inside block |
| **Quote** | `> ` | After `>` |

#### Lists

| Command | Insert | Description |
|---------|--------|-------------|
| **List** | `- ` | Bullet point list |
| **Numbered List** | `1. ` | Numbered list |

#### Links & Media

| Command | Insert | Cursor Position |
|---------|--------|-----------------|
| **Link** | `[](url)` | In text area `[█](url)` |
| **Image** | `![](url)` | In alt text `![█](url)` |
| **Divider** | `\n---\n` | After divider |

#### Tables

| Command | Insert | Cursor Position |
|---------|--------|-----------------|
| **Table** | 2-column table with headers | In first cell |

```markdown
| Header 1 | Header 2 |
|----------|----------|
| █ |  |
```

#### Components

| Command | Insert | Cursor Position |
|---------|--------|-----------------|
| **Card** | `:::card title=""\n\n:::` | In title attribute |
| **Alert** | `:::alert\n\n:::` | Between fences |
| **Callout** | `:::callout\n\n:::` | Between fences |
| **Button** | `:::button\n\n:::` | Between fences |
| **Tabs** | `:::tabs\n## Tab 1\n\n## Tab 2\n\n:::` | After first heading |

#### Diagrams

| Command | Insert | Description |
|---------|--------|-------------|
| **Mermaid** | Mermaid template with example | Insert flowchart diagram |

```markdown
:::mermaid
graph TD
  A --> B█
:::
```

### Usage Tips

1. **Quick Access**: Type `/` at the start of any line
2. **Filter Fast**: Type `/card` to jump directly to Card component
3. **Mouse or Keyboard**: Use whichever is faster for you
4. **Fuzzy Matching**: Searches name and description
5. **Escape Anytime**: Press `Escape` to cancel without inserting

---

## Mermaid Diagrams

### Overview

The editor supports live Mermaid diagram rendering with dynamic loading for optimal performance.

### Features

- **Live Rendering**: Diagrams render in real-time in the preview pane
- **Dynamic Loading**: 2.6MB Mermaid bundle loads only when diagrams are detected
- **Smart Path Resolution**: Automatically handles:
  - `file://` protocol (local files)
  - `localhost` development servers
  - `https://` hosted deployments
- **Multiple Diagrams**: Supports unlimited diagrams per document
- **Mermaid v11+**: Uses latest Mermaid API

### Supported Diagram Types

```markdown
:::mermaid
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Action]
  B -->|No| D[End]
:::
```

- **Flowcharts**: `graph TD`, `graph LR`
- **Sequence Diagrams**: `sequenceDiagram`
- **Class Diagrams**: `classDiagram`
- **State Diagrams**: `stateDiagram`
- **Entity Relationship**: `erDiagram`
- **User Journey**: `journey`
- **Gantt Charts**: `gantt`
- **Pie Charts**: `pie`
- **Git Graphs**: `gitGraph`

### Quick Start

1. Type `/mermaid` to insert template
2. Edit the diagram syntax
3. Preview updates automatically

### Troubleshooting

**Diagram not rendering?**
- Check Mermaid syntax is valid
- Ensure `:::mermaid` fences are properly closed
- Look for errors in browser console

**Mermaid not loading?**
- Verify `mermaid.min.js` exists in `editor/dist/lib/`
- Check network tab for loading errors
- Ensure JavaScript is enabled

---

## File Management

### File System API (Chrome/Edge)

**Direct file saving** with persistent file handles:

1. **Save**: Writes directly to disk
2. **Open**: Maintains file handle for future saves
3. **Permissions**: Asks for permission on first save

**Advantages:**
- No downloads folder clutter
- Updates original file
- Faster workflow

### Fallback Mode (Firefox/Safari)

**Traditional download/upload** for browsers without File System API:

1. **Save**: Downloads `.td` file to default download folder
2. **Open**: Upload dialog to select file
3. **No Permissions**: Standard file upload/download

### Auto-Save

**localStorage backup** every 5 seconds:

- Saves content automatically
- Restores on page reload
- Prevents data loss
- ~5-10MB storage limit (browser-dependent)

### Export HTML

Compile to production-ready HTML:

1. Click "Export HTML" or press `Ctrl+E`
2. Downloads `.html` file with embedded CSS/JS
3. Fully self-contained and ready to deploy

---

## Keyboard Shortcuts

### Global Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+N` / `Cmd+N` | New document |
| `Ctrl+O` / `Cmd+O` | Open file |
| `Ctrl+S` / `Cmd+S` | Save file |
| `Ctrl+E` / `Cmd+E` | Export HTML |
| `Ctrl+F` / `Cmd+F` | Search |
| `Ctrl+H` / `Cmd+H` | Find & Replace |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Tab` | Insert 2 spaces (or indent selection) |

### Slash Menu Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Trigger slash menu |
| `↑` / `↓` | Navigate commands |
| `Enter` | Select command |
| `Escape` | Close menu |

### Editor Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+A` | Select all |
| `Ctrl+D` | Delete line |
| `Ctrl+/` | Toggle comment |
| `Alt+↑` / `Alt+↓` | Move line up/down |

---

## UI/UX Features

### Split Pane View

- **Editor Pane**: Left side, full CodeMirror editor
- **Preview Pane**: Right side, live-compiled HTML
- **Draggable Divider**: Resize panes by dragging the center divider
- **Responsive**: Automatically stacks on mobile devices

### Status Bar

Bottom bar shows:

- **Filename**: Current file name (e.g., `untitled.td`)
- **Line/Column**: Cursor position (e.g., `Line 42, Col 18`)
- **Character Count**: Total characters in document

### Toolbar

Top bar with quick actions:

- **New**: Create new document
- **Open**: Open `.td` file
- **Save**: Save current file
- **Download**: Download `.td` file
- **Export HTML**: Compile and download HTML

### Loading States

- **Initial Load**: Animated spinner on editor initialization
- **Compilation**: Brief loading indicator during preview update
- **Mermaid**: Loading indicator when Mermaid bundle is fetching

### Error Handling

- **Compilation Errors**: Friendly error messages in preview pane
- **File Errors**: Alert dialogs for file operation failures
- **Validation**: Real-time syntax validation with error highlights

---

## Browser Compatibility

### Fully Supported

| Browser | Version | Features |
|---------|---------|----------|
| **Chrome** | 86+ | Full File System API, all features |
| **Edge** | 86+ | Full File System API, all features |

### Partial Support

| Browser | Version | Limitations |
|---------|---------|-------------|
| **Firefox** | Latest | No File System API (uses download/upload) |
| **Safari** | Latest | No File System API (uses download/upload) |

### Mobile Support

| Platform | Support | Notes |
|----------|---------|-------|
| **iOS Safari** | ✅ Works | Touch-optimized, limited File System API |
| **Android Chrome** | ✅ Works | Full features on Chrome 86+ |
| **Android Firefox** | ✅ Works | Download/upload only |

### Feature Detection

The editor automatically detects browser capabilities and adapts:

- **File System API**: Uses if available, falls back to download/upload
- **Touch Support**: Enables touch-friendly controls on mobile
- **Viewport Size**: Responsive layout for all screen sizes

---

## Performance Metrics

### Bundle Sizes

| Bundle | Size | Gzipped | Loads |
|--------|------|---------|-------|
| **Editor HTML** | 1.5 MB | 400 KB | Always |
| **Mermaid** | 2.6 MB | 800 KB | When diagrams detected |
| **Total (with Mermaid)** | 4.1 MB | 1.2 MB | Conditionally |

### Load Times

| Metric | Time | Notes |
|--------|------|-------|
| **Initial Load** | < 2s | Modern hardware, no Mermaid |
| **With Mermaid** | < 4s | Includes Mermaid fetch + parse |
| **Preview Update** | < 200ms | Typical document (< 1000 lines) |
| **Slash Menu** | < 10ms | Filter + render |

### Memory Usage

| Scenario | Memory | Notes |
|----------|--------|-------|
| **Empty Document** | ~15 MB | Base editor + compiler |
| **Large Document** | ~30 MB | 5000 lines with components |
| **With Mermaid** | ~50 MB | Includes Mermaid runtime |

### Optimization Strategies

1. **Tree-Shaking**: Only 157 Lucide icons bundled (90% reduction)
2. **Lazy Loading**: Mermaid loads on-demand
3. **Debouncing**: 300ms preview update delay
4. **Code Splitting**: Separate bundles for editor core and Mermaid
5. **Compression**: Gzip reduces transfer size by 70%

---

## Future Enhancements

### Planned Features

- [ ] **Smart Autocomplete**: Context-aware suggestions for components and attributes
- [ ] **Bubble Menu**: Floating toolbar on text selection for formatting
- [ ] **Collaborative Editing**: Real-time collaboration (future)
- [ ] **Themes**: Light/dark mode toggle
- [ ] **Export Options**: PDF, Markdown, LaTeX
- [ ] **Plugin System**: Extensible architecture for custom commands

### Performance Goals

- [ ] Bundle size < 1.2 MB (without Mermaid)
- [ ] Initial load < 1.5s
- [ ] Preview update < 100ms
- [ ] Tree-shake Mermaid to essential diagrams only

---

## Troubleshooting

### Common Issues

**Editor won't load**
- Check browser console for errors
- Ensure JavaScript is enabled
- Try different browser
- Clear cache and reload

**Slash menu not appearing**
- Type `/` at start of line or after space
- Check keyboard is working
- Refresh page
- Check browser console for errors

**Mermaid diagrams not rendering**
- Verify syntax is valid (test on mermaid.live)
- Check `:::mermaid` fences are closed
- Ensure Mermaid bundle exists in `dist/lib/`
- Check browser console for loading errors

**File save not working**
- Chrome/Edge 86+: Should use File System API
- Other browsers: Use Download button
- Check file permissions
- Try different filename

**Preview not updating**
- Wait 300ms after typing stops
- Check for syntax errors
- Refresh page
- Check browser console

### Getting Help

- **Documentation**: [editor/README.md](../editor/README.md)
- **Syntax Guide**: [SYNTAX.md](../SYNTAX.md)
- **Issues**: GitHub Issues
- **Discussions**: GitHub Discussions

---

**Built with ❤️ for the Taildown community**

