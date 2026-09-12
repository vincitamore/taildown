# Taildown Syntax Tests

`reference.test.ts` discovers every `.td`, `.tdown`, and `.taildown` input under `fixtures/` and runs one structural comparison per `.ast.json` expectation. Integration mismatches fail. Missing or malformed expectations fail instead of being silently skipped.

Source positions and empty attribute objects are excluded from comparison. CRLF is normalized to LF for portable checkouts. Nonempty attributes, content, classes, IDs, and attachment references are compared.

## Run

```sh
pnpm exec vitest run syntax-tests/reference.test.ts
pnpm exec vitest run syntax-tests/reference.test.ts -t 08-components-advanced
pnpm exec vitest run
```

The repository declares pnpm 8.11.0. `pnpm test:syntax` starts the syntax runner in watch mode.

## Coverage

| Category | Contract |
| --- | --- |
| 01-markdown-compatibility | CommonMark/GFM AST |
| 02-inline-attributes | Heading, paragraph and link attributes |
| 03-component-blocks | Attributes, nesting, blank lines and edge cases |
| 04-edge-cases | Parsing precedence |
| 05-integration | Complete document AST, including resolved classes |
| 06-plain-english | Shorthands, combinations and resolution order |
| 07-icons | Icon syntax and composition |
| 08-components-advanced | Attachments, definitions and shared ID references |
| 10-content-components | Rendered enhanced-table structure, content and variants |

The HTML-only enhanced-table fixture has an explicit executable verifier in the runner. Its historical `.html` output is a reference artifact, not a byte-for-byte golden file; it contains generated CSS/runtime details. New HTML-only inputs must register a rendered verifier or add an AST expectation.

Passing this suite establishes the covered cases. It does not certify every rule in SYNTAX.md, visual appearance, accessibility, browser interaction, or every feature combination. Runtime and export regressions also live under `packages/compiler/src/**/__tests__/` and `editor/__tests__/`.

## Maintain

Add input and expected AST files with a matching base name (`NN-description.td` and `NN-description.ast.json`). New categories are discovered automatically. For rendered contracts, register an executable verifier in `reference.test.ts`.

Review mismatches against the source and [SYNTAX.md](../SYNTAX.md). Do not regenerate snapshots just to pass. A snapshot can preserve an old defect: the revival audit found compact modal definitions stored as literal paragraphs and attributes consuming the space between links.

The revival corrections update obsolete theme-token/default-class expectations, preserve source content and references, and replace incorrect literal-fence expectations after compact syntax was repaired. Nonempty attributes are never discarded to make comparisons pass.
