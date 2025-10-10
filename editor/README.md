# Taildown Live Editor

A fully self-contained, browser-based editor for Taildown with live preview, syntax highlighting, and file management.

## Features

- **Full Syntax Highlighting**: CodeMirror 6 with custom Taildown language support
- **Live Preview**: Split-pane view with real-time compilation
- **File Management**: Save/load with File System API (Chrome/Edge) or traditional download/upload
- **Export HTML**: Compile and download production-ready HTML files
- **Auto-Save**: Automatic localStorage persistence every 5 seconds
- **Keyboard Shortcuts**: Professional editor shortcuts (Ctrl+S, Ctrl+O, Ctrl+E, etc.)
- **Draggable Divider**: Resize editor and preview panes
- **Responsive Design**: Adapts to mobile devices
- **Offline Capable**: Fully standalone HTML file (~1.5MB)

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
| `Ctrl+N` / `Cmd+N` | New document |
| `Ctrl+O` / `Cmd+O` | Open file |
| `Ctrl+S` / `Cmd+S` | Save file |
| `Ctrl+E` / `Cmd+E` | Export HTML |
| `Ctrl+F` / `Cmd+F` | Search |
| `Ctrl+H` / `Cmd+H` | Find & Replace |
| `Ctrl+Z` / `Cmd+Z` | Undo |
| `Ctrl+Y` / `Cmd+Y` | Redo |
| `Tab` | Insert 2 spaces (or indent selection) |

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
- **Initial Load**: < 2s on modern hardware
- **Preview Update**: Debounced 300ms after typing stops
- **Bundle Size**: ~1.5MB (gzips to ~400KB)

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

