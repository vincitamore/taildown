# Documentation site

The public Taildown site is authored in `.td` and built with the same compiler used by the editor. Edit the sources here; publish the generated `dist/` directory.

## Build and preview

From the repository root, after installing the workspace dependencies:

```sh
node docs-site/build.mjs
```

The build refreshes the shared and compiler packages, builds both editor variants, compiles every top-level `.td` page, copies site assets, and applies page metadata. It recreates `docs-site/dist/` and fails if a page cannot compile. Generated output is ignored by Git.

Open `docs-site/dist/index.html` to inspect document pages locally. Use a local HTTP server rooted at `docs-site/dist/` to exercise the hosted editor and its lazy diagram asset. For a standalone editor that works from a file with networking disabled, open `docs-site/dist/offline-editor.html`.

## Source map

| Source | Purpose |
| --- | --- |
| `index.td` | Product introduction |
| `getting-started.td` | First document and source-build setup |
| `syntax-guide.td` | Author-facing syntax reference |
| `components.td` | Component reference |
| `plain-english.td` | Styling vocabulary |
| `infinity-at-origin-v2.td`, `principle-of-transformative-representation.td` | Long-form document examples |
| `assets/` | Locally authored reference illustrations and silent demonstration video |
| `build.mjs` | Compilation, editor packaging, assets and page metadata |
| `vercel.json` | Deployment build/output contract and routing |
| `../editor/index.html` | Editor source; see [editor development](../editor/README.md) |

The build emits `editor.html`, the complete `offline-editor.html`, and `assets/` alongside the compiled pages. The hosted editor fetches the diagram runtime on first use; the offline editor embeds it. Exported documents carry the runtime needed by their content.

## Deploy

For a Vercel project connected to this workspace, set its root directory to `docs-site`. Keep the settings in `vercel.json`: install/build from the parent workspace, run `node build.mjs`, and publish `dist`. Include files outside the root directory so the workspace packages and editor sources are available. Do not deploy the source directory or copy previously generated HTML into another repository.

Before promotion, inspect the preview's document routes, editor, first diagram render and download. Open the downloaded editor and an exported document with networking disabled. After promotion, repeat the relevant checks on the production domain. A successful build alone does not prove that domain routing or downloads work.

## Editing

Keep examples executable and links relative to generated pages. Update metadata in `build.mjs` when adding or renaming a page. Verify authored examples in the editor and export, at narrow and wide widths and in both color schemes. Keep historical implementation notes out of the user-facing reference. See [project rules](../PROJECT-RULES.md) and [the syntax contract](../SYNTAX.md).
