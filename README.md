# Taildown

Taildown extends Markdown with plain-English styling, layout components, and interactive HTML output. Write a `.td` document, preview it in the browser editor, and export a page you can keep and share.

[Open the editor](https://taildown.dev/editor) · [Getting started](https://taildown.dev/getting-started) · [Component reference](https://taildown.dev/components)

```taildown
# A place for your ideas {huge-bold}

Markdown for the words. A little Taildown for the presentation.

:::grid{2 gap}
:::card
## Write naturally
Style headings, links, and paragraphs with readable attributes.
:::
:::card
## Share the result
Export HTML with styles and interactive behavior included.
:::
:::
```

## What you can make

Combine cards, grids, columns, navigation, tabs, accordions, dialogs, tables, timelines, diagrams, math, and icons. The same source can become a reference page, article, portfolio, or landing page. Theme colors, fonts, style aliases, custom containers, and component presets let you shape the presentation.

The editor includes live preview, searchable insertion with Ctrl+K or Cmd+K, completions, compilation notices, source-file operations, and HTML export. Its **Offline editor** download includes the compiler and diagram runtime. External images, embeds, and other authored remote resources still depend on their hosts. See the [editor guide](editor/README.md) for shortcuts, design settings, and recovery behavior.

## Build from source

Use Node.js and **pnpm 8.11.0**, the version pinned in [package.json](package.json). These instructions build this checkout; they do not require a published Taildown package.

```sh
git clone https://github.com/vincitamore/taildown.git
cd taildown
pnpm install --frozen-lockfile
pnpm build
```

Compile an example with the local CLI:

```sh
pnpm taildown compile examples/01-basic-markdown.td -o .temp/hello.html --no-config
```

The CLI embeds CSS and JavaScript by default. For separate assets:

```sh
pnpm taildown compile examples/01-basic-markdown.td --separate -o .temp/hello.html --no-config
```

Use `pnpm taildown compile --help` for output, configuration, and minification options. Configuration is discovered in the working directory unless `--no-config` is supplied. The [getting-started guide](docs-site/getting-started.td) describes supported configuration fields and precedence.

Build the complete offline editor:

```sh
pnpm build:editor
```

Open `editor/dist/editor.html` in your browser. To build the documentation website and both editor distributions, run `node docs-site/build.mjs`; its deployable output is `docs-site/dist/`. See [site build instructions](docs-site/README.md).

## Authoring with an agent

The repository includes a portable [Taildown authoring skill](skills/taildown/SKILL.md). Ask your agent to read it when creating or refining a document; it uses the local CLI and the same maintained references as human authors. [AGENTS.md](AGENTS.md) is the entry point for agents working in this checkout.

## Documentation

| Read | Purpose |
| --- | --- |
| [Getting started](docs-site/getting-started.td) | Authoring, compilation, configuration |
| [Syntax guide](docs-site/syntax-guide.td) | Practical syntax and editor design settings |
| [Components](docs-site/components.td) | Component usage and examples |
| [Plain-English reference](docs-site/plain-english.td) | Styling vocabulary |
| [SYNTAX.md](SYNTAX.md) | Detailed language contract |
| [Examples](examples/README.md) | Complete documents to study and adapt |
| [Authoring skill](skills/taildown/SKILL.md) | Agent workflow using the local CLI and rendered checks |
| [Editor guide](editor/README.md) | Files, shortcuts, recovery, offline use |
| [Architecture](tech-spec.md) | Compiler, runtime, packages, build boundaries |
| [Contributing](CONTRIBUTING.md) | Development and validation workflow |

## Development

```sh
pnpm exec vitest run
pnpm typecheck
pnpm lint
```

Run `pnpm test` for watch mode. Build and browser checks depend on the changed surface; the [contribution guide](CONTRIBUTING.md) explains how to verify compiler, editor, documentation, and export changes. Performance and accessibility should be assessed against actual documents and interactions rather than inferred from compilation success.

## License

[MIT](LICENSE). Taildown uses open-source projects including unified/remark, Lucide, CodeMirror, Shiki, Mermaid, and Temml; their licenses continue to apply to those dependencies.
