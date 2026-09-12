---
name: taildown
description: Author and refine Taildown (.td) documents using the repository CLI, current syntax references, and rendered browser checks. Use for creating pages, improving document design, or preparing portable HTML exports.
---

# Authoring Taildown

Work from this checkout's source and CLI. Taildown extends Markdown with readable styling attributes and components; keep the editable `.td` document as the deliverable alongside its compiled output.

## Find the right reference

Resolve these links relative to this skill; run commands from the repository root, two directories above it.

- Read [getting started](../../docs-site/getting-started.td) for compilation and supported configuration.
- Use [the practical syntax guide](../../docs-site/syntax-guide.td) and [SYNTAX.md](../../SYNTAX.md) to verify unfamiliar syntax or attachment rules.
- Look up component structure in [components](../../docs-site/components.td) and styling words in [plain English](../../docs-site/plain-english.td). Search the relevant component or attribute instead of loading every reference.
- Study a complete document from [the examples index](../../examples/README.md) when choosing a composition. Adapt the structure to the content instead of copying its decoration wholesale.
- For compiler/editor changes, follow [repository rules](../../PROJECT-RULES.md) and [contribution checks](../../CONTRIBUTING.md). Authoring a document does not require changing the language.

## Compose the document

Start with the reader's purpose, content hierarchy, and intended screen or print format. Use Markdown for the prose and add layout only where it clarifies relationships. Choose a coherent type scale, spacing rhythm, color emphasis, and surface treatment; avoid putting every paragraph in a card or making every section equally prominent.

Check the reference before inventing a styling token or component. Nest containers according to their documented child structure. Prefer semantic links, headings, lists, and component behavior over raw HTML workarounds. Use meaningful link labels and image descriptions, readable contrast, and motion that leaves content usable with reduced motion.

When refining an existing document, preserve its wording, code examples, URLs, IDs, and data unless the requested change calls for editing them. Keep generated HTML separate from the source. Inspect the diff for accidental content loss.

## Compile with the local CLI

Use the Node.js requirement and pnpm version in [package.json](../../package.json). If this checkout has not been built, install and build its local packages:

```sh
pnpm install --frozen-lockfile
pnpm build
```

Compile an existing example without discovering unrelated configuration:

```sh
pnpm taildown compile examples/01-basic-markdown.td --no-config --inline -o .temp/authoring-check.html
```

Replace the source/output paths with the document being authored. Quote paths containing spaces. `--inline` embeds CSS and JavaScript; `--separate` writes companion assets. Use `--config path/to/taildown.config.js` when the task needs an explicit configuration, or omit `--no-config` to discover configuration in the current working directory. Configuration files execute as JavaScript; use the project's intended file. See the getting-started reference for supported settings rather than assuming every compiler API option is exposed by the CLI.

Use `pnpm taildown compile --help` for the implemented flags, including `--minify`. The CLI prints compilation diagnostics; review them rather than treating a zero exit status as proof of a finished page. There are no separate CLI lint, preview, or watch commands.

## Inspect the result

Open the generated HTML in a browser and review the actual composition at desktop and narrow widths. Check long headings, tables, code blocks, and images for overflow. Exercise the interactive components you used with pointer and keyboard, including focus returning from dialogs. Check light/dark presentation and reduced motion when relevant.

For portable output, open the compiled file directly and test with network access disabled. Embedded styles and behavior do not make remote images, videos, fonts, or authored URLs available offline. If separate assets were requested, keep them with the HTML and verify their relative paths. Recheck the final minified artifact if that is what will be delivered.

The browser editor is another review surface: [its guide](../../editor/README.md) explains opening source, Design settings, HTML export, and the offline editor. Verify exported behavior separately from the editor preview.

Deliver the source path, compiled output path, and a concise account of the checks performed and any remaining external-resource dependencies.
