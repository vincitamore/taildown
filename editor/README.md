# Taildown Live Editor

The browser editor combines CodeMirror, the Taildown compiler, live preview, and portable HTML export. Try the [live editor](https://taildown.dev/editor) or build the offline version below. See the [Getting Started guide](../docs-site/getting-started.td) and [syntax reference](../docs-site/syntax-guide.td) for document authoring.

## Build and run

From the repository root, use the pnpm version pinned in `package.json`:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm build:editor
```

Open `editor/dist/editor.html` in a modern browser. This file contains the editor, compiler, and diagram runtime for offline use. Remote images, video embeds, and other external resources referenced by your document still require their original hosts.

For UI development, edit the template or modules in `editor/`, then rebuild and open `editor/dist/editor.html`. The source template imports TypeScript and built compiler modules; it is a build input and cannot be served directly as a browser application.

## Install and work offline

The hosted editor can be installed from **File → Install app** when the browser offers installation, or from the browser's install/add-to-home-screen menu. It launches directly into the editor in its own window and supports either orientation. After **Editor ready offline** appears, the editor, compiler, diagram runtime and downloadable offline editor are available without a network connection. Remote media authored into a document still depends on its original host.

**File → Update app** appears when a new version is ready. Close other Taildown editor windows first. The editor saves the current source and applied design before requesting the update; it will not reload if draft storage fails or Design settings are still open. Closing and reopening all editor windows also allows the browser to activate an already downloaded update. Keep source downloads as durable backups: browser storage can be cleared by the user or operating system.

On supported browsers, **File → Share source** sends the current document through the system share sheet. An installed Taildown editor can receive plain text or Taildown/Markdown/text files from Android sharing. Shared content is stored locally and opens a review dialog. **Download current & open** backs up the current source before importing the selected file; **Cancel** keeps the incoming files under **File → Shared files**, and **Discard shared copy** removes an unwanted item. Each share accepts up to 10 files totaling 8 MB, with at most 10 pending shares. Desktop browsers supporting PWA file handlers can also launch the editor with `.td`, `.tdown`, `.taildown` or `.md` files. Other browsers retain File → Open and Download source.

The service worker handles only the editor and its declared assets, leaving ordinary documentation navigation on the network. `editor/build-pwa.mjs` generates a content-addressed shell after the documentation build finishes; `editor/service-worker.js` owns its offline and activation behavior. Opening the portable HTML file does not register a service worker.

## Authoring

- **Insert / Ctrl+K / Cmd+K:** Search formatting actions and compiler-derived component starters. Use arrows to choose, Enter to insert, and Escape to close. The palette also opens Design settings.
- **Slash menu:** Type `/` at the start of a line or after whitespace, outside literal code. Type to filter, use arrows to choose, and press **Tab** or click to insert. Escape closes the menu.
- **Completions:** Component names, style attributes, and icons come from the compiler's authoring reference. Use Tab to accept or Ctrl+Space to request suggestions. Applied custom aliases and components join the relevant suggestions.
- **Selection toolbar:** Select text for bold, italic, code, heading, and link actions.
- **Compilation notices:** Expand the notices beneath the toolbar. Activate a reported line/column to focus and scroll the editor to that position. Inline attribute notices point to the affected heading, paragraph, or link.

Preview compilation and browser draft recovery run after a one-second pause in typing. Actual compilation cost depends on the document and device; the status bar reports the latest compilation time.

Compilation normally runs in a background worker so it does not block editing. The editor also obtains its icon previews from that worker, keeping a single copy of the complete icon library in the download. If workers cannot start, the editor uses the same compiler on the main thread. Both paths support the complete offline editor.

Section links such as `[Read more](#details)` navigate within the preview when the document contains that ID. They keep their ordinary fragment URLs in downloaded HTML.

### Phones and narrow windows

At phone widths, **Edit** and **Preview** each use the available workspace. Switching views preserves the document and preview. Long source lines wrap; **Undo**, **Redo** and **Find** are available below the editor. **Insert**, **Save** and **Design** remain directly accessible, while **File** contains opening, source downloads, HTML export and the welcome template.

Selecting a compilation notice returns to the source view before focusing its location. Wider windows retain the resizable side-by-side layout. Browser file capabilities determine whether Save writes through a file picker or downloads a source file.

### Shortcuts

These shortcuts apply while the editor has focus. `Mod` means Ctrl on Windows/Linux and Cmd on macOS.

| Shortcut | Action |
| --- | --- |
| Mod+K | Open insertion palette |
| Mod+Shift+K | Add a link around the selection |
| Mod+B / Mod+I | Bold / italic |
| Mod+N | New document |
| Mod+O | Open source file |
| Mod+S | Save source file |
| Mod+E | Export HTML |
| Mod+F | Search |
| Mod+Z | Undo |
| Tab | Accept the active slash-menu item or completion |
| Escape | Close the active menu |

The editor also uses CodeMirror's standard editing, history, folding, and search bindings.

### Syntax highlighting

The editor and exported `td`, `tdown`, and `taildown` code examples share one tokenizer. It distinguishes component structure, complete attribute words and values, inline directives, Markdown links, tasks, footnotes, math, and literal code. The theme toggle changes the editor palette; exported code blocks use the corresponding dark palette. Highlighting helps read source; compilation notices remain the authority on invalid syntax.

## Files and recovery

**New** asks before replacing the current document, starts with `# New Document`, resets the filename to `untitled.td`, and replaces the browser recovery draft. **Template** loads the welcome document, asking first when the current document has content.

**Open** accepts `.td`, `.tdown`, and `.taildown`. When the browser exposes a native file picker, the editor retains the selected handle for saving; otherwise it uses a file input. **Save** writes through an existing writable handle, offers a native save picker when available, or downloads the source as a fallback. **Download** always downloads a source copy. Picker availability depends on browser capabilities and context.

**Export HTML** compiles the current source and design settings into a document with inline styles and runtime scripts. This is the rendered document, separate from the editable `.td` source and the offline editor application.

Browser recovery stores one content/filename snapshot in localStorage and restores it on reload. Another editor tab on the same origin can replace that snapshot. Storage failure displays a warning while editing and file operations remain available. Clearing browser data removes recovery. Save or download important work; recovery is not a file backup.

### Design settings

Open **Design settings** from the insertion palette to edit JSON containing `theme`, `styleMappings`, `components`, and `componentConfig`. Applying settings validates them and compiles the current document before replacing the active design. An invalid draft preserves the last working settings and preview.

Settings apply across documents in this browser workspace and are recovered separately from document text. Import loads a settings draft; choose **Apply settings** to activate it. Download the settings JSON alongside the `.td` file when sharing editable work. Source files alone do not embed these settings. See the [design settings guide](../docs-site/syntax-guide.td) for supported fields and examples.

## Offline and hosted distribution

The editor build creates two variants:

| Build output | Purpose |
| --- | --- |
| `editor/dist/editor.html` | Complete single-file offline editor, including diagram support |
| `editor/dist/editor-hosted.html` | Hosted editor; loads the diagram runtime on first use |
| `editor/dist/assets/` | Diagram runtime required by the hosted editor |

To distribute the offline editor, share `editor/dist/editor.html`. To host the smaller variant with its **Offline editor** download button, publish these mappings together:

| Build output | Published path |
| --- | --- |
| `editor/dist/editor-hosted.html` | `editor.html` |
| `editor/dist/editor.html` | `offline-editor.html` |
| `editor/dist/assets/` | `assets/` alongside those pages |

`node docs-site/build.mjs` builds the compiler/browser/editor artifacts and applies these mappings in `docs-site/dist/` for the documentation site. Preserve relative paths when hosting the directory. A downloaded copy of the hosted page alone is not the complete offline editor.

## Implementation and verification

- `editor/index.html`: UI, CodeMirror setup, preview and file operations.
- `editor/authoring.ts`: typed autocomplete shared by the editor and its tests.
- `editor/commands.ts`: command palette and slash menu, shared templates, search, and selection-aware insertion.
- `editor/icons.ts`: toolbar and completion SVG rendering from compiler-supplied icon data.
- `editor/preview.ts`: debounced compilation, stale-result guards, diagnostics navigation, preview fragment navigation and scroll restoration.
- `editor/divider.ts`: responsive split-pane resizing with pointer and keyboard controls.
- `editor/mobile.ts`: mobile pane navigation, focus boundaries and zoom-aware viewport sizing.
- `editor/pwa.ts`: installation prompts and updates gated on durable drafts and open dialogs.
- `editor/incoming.ts`: system sharing and incoming file review with source backup before replacement.
- `editor/service-worker.js` and `editor/build-pwa.mjs`: content-addressed offline shell and local shared-file intake.
- `editor/recovery.ts`: restores saved drafts and checks for unsaved changes before closing.
- `editor/files.ts`: open/save/download/export operations, document identity checks, and per-handle write queues.
- `editor/design-settings.js`: design JSON validation and persistence.
- `editor/draft-store.js`: atomic browser recovery snapshots and storage-failure handling.
- `editor/compiler-client.js`: background requests, settings snapshots, error handling, and worker-unavailable fallback.
- `editor/build.mjs`: bundles the editor module and produces offline/hosted variants.
- `packages/compiler/src/browser-bundle.ts`: combined public browser API; `editor-bundle.ts` provides UI/authoring exports separately.
- `packages/compiler/src/worker-entry.ts`: compiler worker protocol and shared fallback exports.
- `editor/__tests__/`: editor integration contracts and regression tests.

After source changes, rebuild and run relevant tests with `pnpm exec vitest run`. Verify the built editor in a browser: insert components, edit styles, open/save source, export HTML, and inspect the downloaded result offline. Changes to component syntax or defaults must also reach authoring references, completions, command insertion, and public documentation.

## Troubleshooting

- **Editor does not initialize:** Open the built file, confirm JavaScript is enabled, and inspect the browser console for loading errors. Rebuild after changing compiler code.
- **Hosted diagrams do not render:** Confirm the adjacent `assets/` directory was published and its runtime URL returns the actual asset. Use the complete offline editor when distributing a single file.
- **Compilation fails:** Read the status message and available compilation notices. Check directive closing fences and attribute syntax. A failed compilation retains the previous working preview.
- **Save downloads instead of writing directly:** Use the downloaded file; native picker support is optional. The toolbar remains available when a browser reserves a keyboard shortcut.
- **Recovery is unavailable:** Save/download source and design settings before leaving. Restore storage availability without clearing the only copy of unsaved work.
