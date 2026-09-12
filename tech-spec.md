# Taildown architecture

This document describes the current implementation and its boundaries. The language contract lives in [SYNTAX.md](SYNTAX.md); practical authoring examples live in the [documentation site](docs-site/README.md). See [CONTRIBUTING.md](CONTRIBUTING.md) for build and validation commands.

## Compilation

Taildown transforms a source string into an HTML document, CSS, JavaScript, and diagnostic metadata:

```text
Taildown source
  → Markdown and Taildown parsing
  → MDAST with resolved attributes/components
  → HAST and component rendering
  → CSS and selected runtime behavior
  → HTML + CSS + JavaScript + metadata
```

The entry point is [packages/compiler/src/index.ts](packages/compiler/src/index.ts). `compile` is asynchronous. It validates theme options, parses without automatically rewriting source, renders the document, collects used styles and behaviors, and returns `html`, `css`, `js`, and `metadata`. Diagnostics are in `metadata.warnings`; compilation time and node count are also reported.

Within a workspace package that depends on `@taildown/compiler`:

```ts
import {compile} from '@taildown/compiler';

const result = await compile('# Hello {primary}', {
  inlineStyles: true,
  inlineScripts: true,
  title: 'Hello',
});

console.log(result.html);
console.log(result.metadata.warnings);
```

The API returns separate assets unless inline options are enabled. The CLI chooses inline output by default. Public types in [packages/shared/src/types.ts](packages/shared/src/types.ts) define the result and options; a type field alone does not prove that every client supports it.

## Parser and style resolution

[parser/index.ts](packages/compiler/src/parser/index.ts) owns the ordered unified/remark pipeline. CommonMark/GFM parsing is followed by Taildown transformations for directives, attributes, icons, math, footnotes, tables, and other syntax. The in-house directive scanner/builder handles component nesting. Literal fences and code must remain literal through subsequent transformations.

Ordering is significant: directive structure must exist before component processing, and inline attributes must be available before dependent step, timeline, and video transformations. Consult the actual pipeline when changing a parser stage instead of copying an old plugin list.

`parse` returns the AST; `parseWithWarnings` also returns diagnostics. Parser options snapshot custom style mappings, component definitions, and presets before awaiting registry initialization. Changes for one compilation must not mutate another document's configuration.

The [component registry](packages/compiler/src/components/component-registry.ts) supplies built-in definitions. The resolver maps supported plain-English tokens and utility syntax into classes. Component presets provide defaults, variants, and sizes. Custom components add named containers; they do not replace the built-in registry or install arbitrary render plugins.

## Rendering and runtime

[renderer/](packages/compiler/src/renderer/) transforms the AST into HAST, supplies component markup, and generates styles. Node compilation uses Shiki for code highlighting; browser builds substitute a CodeMirror/Lezer static highlighter. Literal code contents must survive both highlighting paths and minification.

[js-generator/](packages/compiler/src/js-generator/) selects behavior needed by the document. Interactive components use generated browser JavaScript rather than a client application framework. Selection includes behavior discovered from rendered markup, including attached dialogs and tooltips. Tests must cover combinations and focus ownership, not just each component in isolation.

Diagrams use Mermaid. The compiler includes the diagram runtime in documents that need it; a diagram-bearing export is consequently larger than a text-only export. Math uses Temml. Embedded runtime support does not make authored remote images, videos, or other URLs available offline.

Entrance motion is progressive enhancement: content remains usable without IntersectionObserver and under reduced motion. Keyboard focus reveals waiting content. Appearance and timing should be documented as user behavior in the reference rather than duplicated as constants throughout repository guides.

## Configuration boundaries

Compiler options support theme colors/fonts, style aliases, custom container definitions, and component presets. See the [getting-started configuration guide](docs-site/getting-started.td) and [shared types](packages/shared/src/types.ts) for examples and exact shapes.

The Node-only `@taildown/compiler/config` entry loads and validates JavaScript configuration files. The [CLI compile command](packages/cli/src/commands/compile.ts) applies its supported fields and output settings, with command-line overrides. Configuration modules execute as JavaScript. Unsupported non-default settings fail explicitly; the presence of legacy schema fields does not imply plugin loading, source-map output, or full glass/animation configuration support in the CLI.

The editor's Design settings accept a JSON subset and validate/compile it before replacing the active settings. Source documents and design JSON are separate editable artifacts. See [editor/README.md](editor/README.md) for persistence and sharing semantics.

## Browser editor and distribution

The editor separates UI/authoring code from compilation:

| Source | Responsibility |
| --- | --- |
| `editor/index.html` | UI, CodeMirror, authoring actions, preview, file operations |
| `editor/compiler-client.js` | Worker requests, option snapshots, failure handling and fallback |
| `editor/design-settings.js` | Design validation and persistence |
| `editor/draft-store.js` | Browser recovery snapshot |
| `packages/compiler/src/worker-entry.ts` | Compiler worker protocol and fallback exports |
| `packages/compiler/src/editor-bundle.ts` | UI/authoring exports |
| `packages/compiler/src/browser-bundle.ts` | Combined public browser API |
| `packages/compiler/build-browser.mjs` | Browser substitutions and bundle variants |

Compilation normally runs in a worker; the same compiler can run on the main thread if workers cannot start. Request IDs and preview revisions prevent older results from replacing newer work. The editor obtains icon preview data from the compiler worker to avoid including the full icon library twice.

The offline build embeds compiler and diagram runtime in one editor HTML file. The hosted build loads its adjacent diagram asset on first use and offers the complete offline build as a separate download. These are distinct distributions. [editor/build.mjs](editor/build.mjs) creates them, and [docs-site/build.mjs](docs-site/build.mjs) assembles the published directory. See the [editor distribution guide](editor/README.md#offline-and-hosted-distribution) for exact mappings.

## Repository packages

| Location | Role |
| --- | --- |
| `packages/compiler` | Parser, resolver, renderer, configuration and browser builds |
| `packages/shared` | Public types and shared definitions |
| `packages/cli` | Source-file compilation and output/configuration handling |
| `packages/linter` | Asynchronous lint/fix API; see its [guide](packages/linter/README.md) |
| `packages/mcp` | Local stdio compilation/reference server; see its [guide](packages/mcp/README.md) |
| `editor` | Browser editing application |
| `docs-site` | Authored public website and deployment build |
| `examples` | Complete Taildown documents |
| `syntax-tests` | Executable syntax fixtures |

`pnpm build` builds workspace packages. Browser/editor builds are explicit; site generation builds its required artifacts and emits `docs-site/dist/`. Generated directories are not source authorities.

## Correctness and extension

A successful compile establishes only that the given input compiled. It does not prove semantic HTML, accessibility, responsiveness, runtime behavior, source preservation, or output portability. [syntax-tests/README.md](syntax-tests/README.md) defines fixture comparison scope and limitations; module tests and browser/export checks cover additional contracts.

New features follow the [full integration contract](PROJECT-RULES.md#public-feature-integration). Keep authoring suggestions tied to the same definitions used by compilation, preserve configuration isolation, and verify the complete path from authored source through downloaded output. Measure performance against named documents and runtime conditions rather than assuming a fixed universal compilation time or bundle size.
