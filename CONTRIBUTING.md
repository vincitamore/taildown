# Contributing to Taildown

Contributions should make Taildown easier to author with, maintain, and share. Report bugs with a minimal source document, the observed and expected behavior, and your runtime/browser version. Discuss substantial syntax changes before implementing them so the language contract stays coherent.

Read [PROJECT-RULES.md](PROJECT-RULES.md) for repository organization and the complete feature-integration contract. [tech-spec.md](tech-spec.md) maps the implementation.

## Set up

Use Node.js and the repository's pinned **pnpm 8.11.0**. Clone your fork, create a branch from `main`, and run:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm exec vitest run
pnpm typecheck
```

`pnpm test` starts Vitest in watch mode. Use `pnpm exec vitest run` for a terminating check. Package builds do not build the editor or documentation website:

```sh
pnpm build:editor
node docs-site/build.mjs
```

The offline editor is `editor/dist/editor.html`; the website output is `docs-site/dist/`. See the [editor](editor/README.md) and [site](docs-site/README.md) guides for previewing them.

## Make and verify a change

Keep a change focused on its intended behavior. Add a regression test when it meaningfully protects a bug fix or new contract. For example, a parser fix should assert preserved content and structure; an export fix should check the downloaded document, not just an internal helper.

```sh
# One test file or suite
pnpm exec vitest run syntax-tests/reference.test.ts

# Full suite and static checks
pnpm exec vitest run
pnpm typecheck
pnpm lint

# Coverage, when assessing coverage changes
pnpm exec vitest run --coverage
```

Coverage thresholds are configured in `vitest.config.ts`; an ordinary test run does not measure coverage. Format the files you changed with Prettier. The root `pnpm format` command rewrites broadly, so review its scope before using it.

Choose verification that covers the affected surface:

| Change | Additional verification |
| --- | --- |
| Parser or resolver | Source preservation, located diagnostics, nesting, literal code, configuration isolation |
| Component or CSS | Complete compositions, mobile/desktop, light/dark, authored overrides |
| Runtime interaction | Keyboard and focus, nested components, reduced motion, exported HTML |
| CLI | Actual files, configuration precedence, inline/separate output, failure without overwrites |
| Editor | Built editor, insertion/completions, source open/save, recovery, design settings, HTML export |
| Browser/worker build | Worker and fallback, offline editor, hosted assets, browser errors |
| Documentation | Commands, examples, links, diagnostics, generated site |

Report exactly what you tested and any remaining limitations. Avoid broad claims from a narrow sample.

## Syntax and public features

[SYNTAX.md](SYNTAX.md) is the detailed syntax contract. Use the [syntax RFC template](.github/ISSUE_TEMPLATE/syntax-rfc.md) for substantial additions or incompatible changes. Explain the authoring need, concrete syntax, ambiguity/compatibility concerns, and expected output.

Implement public additions through parsing, styles/rendering/runtime, configuration, authoring reference, editor insertion/completions, reference documentation, and examples where applicable. Check Node/CLI and browser/export behavior together. A working parser branch alone is not a finished feature.

Syntax fixtures live in `syntax-tests/fixtures/`. Follow the [fixture guide](syntax-tests/README.md): inspect expected AST changes against source and intended semantics. Do not bulk-regenerate expectations to hide a regression.

## Documentation

Use the [documentation map](README.md#documentation) to find the maintained source for a topic. Keep contributor guidance in Markdown and authored website/examples in Taildown. Update affected references in the same change as behavior; retire superseded prose instead of maintaining contradictory versions. Generated output belongs in ignored build directories.

Code examples should run against this checkout. Distinguish implemented APIs from proposals, and avoid hardcoded performance, bundle-size, component-count, or test-count claims that become stale without a measurement process.

## Submit a pull request

Use a descriptive commit and PR title, such as `fix(parser): preserve spaces around link attributes`. Explain the user-visible problem, resulting behavior, and validation. Include a small reproduction or before/after example when it makes the change clearer. Use the [syntax-change template](.github/PULL_REQUEST_TEMPLATE/syntax-change.md) for syntax work.

Before submitting:

- Review the complete diff for unrelated edits, generated artifacts, and accidental local configuration.
- Run checks appropriate to the change and investigate failures.
- Update documentation and examples that describe the changed behavior.
- Include browser/export evidence for visual or interactive changes.

Be respectful and concrete in review. Questions and bug reports belong in the [repository issues](https://github.com/vincitamore/taildown/issues).
