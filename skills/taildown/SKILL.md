---
name: taildown
description: Author or refine Taildown (.td) documents and portable HTML with the local CLI. Use when asked to make a Taildown page, improve its design, or verify its export. Skip ordinary Markdown edits and unrelated web applications; compiler implementation follows the repository engineering guides.
---

# Authoring Taildown

Work from this checkout's source and CLI. Taildown extends Markdown with readable styling attributes and components; keep the editable `.td` document as the deliverable alongside its compiled output.

## Maintaining this skill

Update this skill in the same change that alters its CLI recipe, reference locations, or a repeatable authoring constraint. Keep syntax and component details in [SYNTAX.md](../../SYNTAX.md) and the relevant site reference; update those when shipped behavior changes. The [CLI declaration](../../packages/cli/src/cli.ts) owns available commands, and compiler source plus regression tests establish implemented behavior when prose disagrees.

Keep standing workflow here, implementation rationale in [architecture](../../tech-spec.md), and release/task history outside the skill. Replace stale instructions rather than appending exceptions. Recheck links and exercise an affected recipe after edits; record a blocker with its concrete resolution condition instead of adding an undated future instruction.

## Find the right reference

Resolve these links relative to this skill; run commands from the repository root, two directories above it.

- Read [getting started](../../docs-site/getting-started.td) for compilation and supported configuration.
- Use [the practical syntax guide](../../docs-site/syntax-guide.td) and [SYNTAX.md](../../SYNTAX.md) to verify unfamiliar syntax or attachment rules.
- Look up component structure in [components](../../docs-site/components.td) and styling words in [plain English](../../docs-site/plain-english.td). Search the relevant component or attribute instead of loading every reference.
- Study a complete document from [the examples index](../../examples/README.md) when choosing a composition. Adapt the structure to the content instead of copying its decoration wholesale.
- For compiler/editor changes, follow [repository rules](../../PROJECT-RULES.md) and [contribution checks](../../CONTRIBUTING.md). Authoring a document does not require changing the language.

## Compose the document

Start with the reader's purpose, content hierarchy, and intended screen or print format. Use Markdown for the prose and add layout only where it clarifies relationships. Choose a coherent type scale, spacing rhythm, color emphasis, and surface treatment; avoid putting every paragraph in a card or making every section equally prominent.

Look up unfamiliar tokens before using them; highlighting is not syntax validation. A few authoring boundaries matter across components:

- Quote key-value attributes, including numbers: `{value="35" max="100"}`. Bare styling words and shorthand IDs follow separate syntax.
- Paragraph attributes belong at the end of the paragraph. Separate a styled label from following prose with a blank line; a mid-sentence attribute can remain literal text. Links and icons have their own inline attachment syntax.
- Component children carry meaning: tabs use headings for panels, and details uses its leading paragraph or heading as the summary. Check the component reference before substituting a generic card layout.
- Use native Markdown footnote references and definitions for notes; keep code examples in fences so their contents remain literal.
- Attached modal/tooltip content may reference an ID elsewhere in the document. Preserve those targets when reorganizing a page and test the trigger with keyboard focus as well as a pointer.

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
