# Taildown Live Editor

A fully self-contained, browser-based editor for Taildown with modern UX features inspired by Notion and Tiptap.

## Features

### Core Editing
- **Full Syntax Highlighting**: CodeMirror 6 with custom Taildown language support
- **Modern Monospace Font**: JetBrains Mono for beautiful code editing
- **Live Preview**: Split-pane view with real-time compilation (300ms debounced)
- **Smart Insertions**: Cursor positioned intelligently after insertions

### Slash Commands (NEW!)
- **Quick Insert Menu**: Type `/` to access 20 common commands
- **Keyboard Navigation**: Arrow keys (↑↓), Enter to select, Escape to cancel
- **Fuzzy Search**: Filter commands by typing (e.g., `/card` shows Card component)
- **Smart Cursor**: Automatically positions cursor for immediate editing
- **Categories**: Headings, Formatting, Lists, Links, Tables, Components, Diagrams

### Smart Autocomplete (NEW!)
- **Context-Aware Suggestions**: Intelligent completions based on what you're typing
- **Tab to Accept**: Press Tab to accept any suggestion
- **Chained Completions**: Automatically triggers next completion after acceptance
- **Real-Time Filtering**: Type to filter suggestions instantly
- **Beautiful UI**: Styled menu with icons and type badges

**Triggers:**
- Type `:` → Suggests `:::` (component fence) or `:icon[]` (inline icon)
- Type `:::` → Shows all 23 component names (card, button, alert, etc.)
- Type `{` → Shows 50+ style attributes (primary, bold, glass, etc.)
- Type `:icon[` → Shows 157 icons with visual previews
- Type `:icon[name]{` → Shows icon-specific styles (xs, large, primary, etc.)

**Smart Features:**
- **Auto-fencing**: Selecting `:::card` creates `:::card\n\n:::` with cursor in middle
- **Auto-bracketing**: Selecting `:icon[]` creates brackets with cursor between them
- **Continuous filtering**: Autocomplete stays open while you type valid characters

### Bubble Menu (NEW!)
- **Floating Toolbar**: Appears automatically when you select text
- **Quick Formatting**: Bold, italic, code, heading, and link actions
- **Keyboard Shortcuts**: Works with standard shortcuts (Ctrl+B, Ctrl+I, Ctrl+K)
- **Smart Positioning**: Menu appears centered above your selection
- **Instant Feedback**: Formatting applied immediately

**Actions:**
- **Bold** (`Ctrl+B`): Wraps selection in `**text**`
- **Italic** (`Ctrl+I`): Wraps selection in `*text*`
- **Code** (click): Wraps selection in `` `code` ``
- **Heading** (click): Adds `## ` to start of line
- **Link** (`Ctrl+K`): Converts to `[text](url)` with cursor at `url`

### Mermaid Diagrams (NEW!)
- **Live Rendering**: Flowcharts, sequence diagrams, and graphs render in preview
- **Dynamic Loading**: 2.6MB bundle loads only when diagrams are detected
- **Smart Path Resolution**: Works with `file://`, `localhost`, and `https://` URLs
- **Slash Command**: Type `/mermaid` for instant diagram template

### File Management
- **Save/Load**: File System API (Chrome/Edge) or traditional download/upload
- **Export HTML**: Compile and download production-ready HTML files
- **Auto-Save**: Automatic localStorage persistence every 5 seconds
- **Keyboard Shortcuts**: Professional editor shortcuts (Ctrl+S, Ctrl+O, Ctrl+E, etc.)

### UI/UX
- **Draggable Divider**: Resize editor and preview panes
- **Responsive Design**: Adapts to mobile devices
- **Modern Interactions**: Slash commands, autocomplete, bubble menu
- **Smart Debouncing**: 1s delay for smoother preview updates
- **Offline Capable**: Fully standalone HTML file (~1.55MB + 2.6MB Mermaid optional)

## Quick Start

### Development Mode

Open `index.html` directly in your browser:

```bash
# Open in default browser (Windows)
start editor/index.html

# Or use a local server
npx serve editor
```

The development version loads the browser bundle from the relative path.

### Production Build

Build the standalone file with everything inlined:

```bash
pnpm build:editor
```

This creates `editor/dist/editor.html` - a single HTML file containing:
- CodeMirror 6 editor (~400KB)
- Taildown compiler (~1000KB)
- All UI and styling

You can then:
1. Open it directly in any browser
2. Host it on any web server
3. Email it or share via USB drive
4. Use it completely offline

## Usage

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `/` | Trigger slash command menu |
| `↑` / `↓` | Navigate slash menu (when open) |
| `Enter` | Select slash command (when open) |
| `Escape` | Close slash menu |
| `Tab` | Accept autocomplete suggestion |
| `Ctrl+B` / `Cmd+B` | Bold (wraps selection) |
| `Ctrl+I` / `Cmd+I` | Italic (wraps selection) |
| `Ctrl+K` / `Cmd+K` | Link (wraps selection) |
| `Ctrl+N` / `Cmd+N` | New document |
| `Ctrl+O` / `Cmd+O` | Open file |
| `Ctrl+S` / `Cmd+S` | Save file |
| `Ctrl+E` / `Cmd+E` | Export HTML |
| `Ctrl+F` / `Cmd+F` | Search |
| `Ctrl+H` / `Cmd+H` | Find & Replace |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |

### Slash Commands

Type `/` at the start of a line or after a space to open the command menu:

| Command | Shortcut | Description |
|---------|----------|-------------|
| **Heading 1** | `/h1` or `/head` | Insert H1 heading |
| **Heading 2** | `/h2` | Insert H2 heading |
| **Heading 3** | `/h3` | Insert H3 heading |
| **Bold** | `/bold` | Insert bold formatting |
| **Italic** | `/italic` | Insert italic formatting |
| **Code Block** | `/code` | Insert fenced code block |
| **Inline Code** | `/inline` | Insert inline code |
| **Quote** | `/quote` | Insert blockquote |
| **List** | `/list` | Insert bullet list |
| **Numbered List** | `/num` | Insert numbered list |
| **Link** | `/link` | Insert hyperlink |
| **Image** | `/image` | Insert image |
| **Divider** | `/div` | Insert horizontal rule |
| **Table** | `/table` | Insert 2-column table |
| **Card** | `/card` | Insert card component |
| **Alert** | `/alert` | Insert alert box |
| **Callout** | `/call` | Insert callout box |
| **Button** | `/button` | Insert button component |
| **Tabs** | `/tabs` | Insert tabbed interface |
| **Mermaid** | `/mermaid` | Insert Mermaid diagram |

**Tips:**
- Type to filter commands (e.g., `/card` shows only Card)
- Use arrow keys to navigate
- Press Enter to insert selected command
- Cursor automatically positioned for editing

### File Operations

#### New Document
- Click "New" or press `Ctrl+N`
- Loads the default welcome template
- Clears localStorage

#### Open File
- **Chrome/Edge**: Uses File System API (persistent file handle)
- **Firefox/Safari**: Traditional file upload dialog
- Supports `.td` and `.taildown` extensions

#### Save File
- **Chrome/Edge**: Saves directly to disk with File System API
- **Firefox/Safari**: Downloads file to default download folder
- Auto-saves to localStorage every 5 seconds

#### Download
- Always downloads the `.td` file
- Useful for sharing or backing up

#### Export HTML
- Compiles and downloads production-ready HTML
- Includes inline CSS and JavaScript
- Supports all interactive components

### Browser Support

| Browser | File System API | Fallback |
|---------|----------------|----------|
| Chrome 86+ | ✅ Full support | N/A |
| Edge 86+ | ✅ Full support | N/A |
| Firefox | ❌ Not supported | ✅ Download/Upload |
| Safari | ❌ Not supported | ✅ Download/Upload |
| Mobile | ⚠️ Limited | ✅ Download/Upload |

**Note**: File System API allows direct file saving. Browsers without it use traditional download/upload.

### Performance

- **Compilation**: < 200ms for typical documents (< 1000 lines)
- **Initial Load**: < 2s on modern hardware (without Mermaid)
- **Preview Update**: Debounced 1s after typing stops (smoother UX)
- **Slash Menu**: Instant trigger, < 10ms filter time
- **Autocomplete**: Real-time filtering, < 5ms response
- **Bubble Menu**: Appears in < 50ms after selection
- **Bundle Sizes**:
  - Editor HTML: ~1.55MB (gzips to ~410KB)
  - Mermaid (optional): 2.6MB (loaded only when diagrams detected)
  - Total (with Mermaid): ~4.15MB (~1.25MB gzipped)

### localStorage

The editor automatically saves your work to `localStorage`:

- **Content**: Saved every 5 seconds
- **Filename**: Saved on every change
- **Persistence**: Restored on page reload
- **Limit**: ~5-10MB depending on browser

**Note**: Clear browser data will delete localStorage content.

## Architecture

### Tech Stack

- **CodeMirror 6**: Modern, extensible code editor
- **Taildown Compiler**: Full compilation engine bundled for browser
- **Vanilla JavaScript**: No framework dependencies
- **ES2022**: Modern JavaScript with top-level await support

### File Structure

```
editor/
├── index.html          # Development template (loads external bundle)
├── build.mjs           # Build script (inlines bundle)
├── dist/
│   └── editor.html     # Production: fully self-contained (~1.5MB)
└── README.md           # This file
```

### Build Process

1. **Browser Bundle**: `pnpm build:browser` creates `packages/compiler/dist/taildown-browser.js`
2. **Inline**: `editor/build.mjs` inlines the bundle into `index.html`
3. **Output**: Single `editor/dist/editor.html` file

## Development

### Making Changes

1. Edit `editor/index.html` for UI/behavior changes
2. Edit Taildown compiler source for compilation changes
3. Rebuild: `pnpm build:editor`
4. Test: Open `editor/dist/editor.html`

### Adding Features

The editor imports everything from the browser bundle:

```javascript
import {
  compile,
  EditorView,
  EditorState,
  // ... etc
} from '../packages/compiler/dist/taildown-browser.js';
```

To add CodeMirror extensions:
1. Add to `packages/compiler/src/browser-bundle.ts`
2. Rebuild browser bundle
3. Import in `editor/index.html`

## Deployment

### Static Hosting

Upload `editor/dist/editor.html` to any static host:

```bash
# Vercel
vercel editor/dist

# Netlify
netlify deploy --dir=editor/dist

# GitHub Pages
cp editor/dist/editor.html docs/editor.html
git add docs/editor.html
git commit -m "Add live editor"
git push
```

### CDN

The file is self-contained and can be served from any CDN:

```html
<iframe src="https://cdn.example.com/taildown-editor.html" 
        width="100%" 
        height="800px"></iframe>
```

### Offline Distribution

The standalone HTML file works completely offline:
- Download `editor/dist/editor.html`
- Share via email, USB, or internal network
- Open in any modern browser
- No internet connection required

## Troubleshooting

### Editor Won't Load

**Symptom**: Loading spinner never disappears

**Solution**:
1. Check browser console for errors
2. Ensure JavaScript is enabled
3. Try in a different browser
4. Clear cache and reload

### File System API Not Working

**Symptom**: Save always downloads, never saves directly

**Solution**:
- File System API requires Chrome/Edge 86+
- Check browser compatibility: `caniuse.com/native-filesystem-api`
- Use Download/Upload buttons as fallback

### Compilation Errors

**Symptom**: Preview shows error message

**Solution**:
1. Check syntax in editor (red underlines)
2. Ensure component blocks are properly closed (`:::`)
3. Check attribute syntax (`{valid-class}`)
4. Look at browser console for detailed error

### Performance Issues

**Symptom**: Editor lags or preview is slow

**Solution**:
1. Keep documents under 5000 lines
2. Close other browser tabs
3. Check for infinite loops in interactive components
4. Disable browser extensions

### localStorage Full

**Symptom**: "QuotaExceededError" in console

**Solution**:
1. Export/download important files
2. Clear browser data for the domain
3. Reduce document size
4. Use File System API instead

## Contributing

To improve the editor:

1. Test in multiple browsers
2. Add new features to `index.html`
3. Update this README
4. Rebuild with `pnpm build:editor`
5. Submit PR with before/after screenshots

## License

MIT - See root LICENSE file

---

**Built with ❤️ for the Taildown community**

