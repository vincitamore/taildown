# Repository rules

These rules describe how to maintain Taildown's source and public documentation. See [CONTRIBUTING.md](CONTRIBUTING.md) for commands and [tech-spec.md](tech-spec.md) for architecture.

## Sources and generated output

- Keep package source in `packages/*/src/`, browser editor source in `editor/`, documentation-site source in `docs-site/`, and authored examples in `examples/`.
- Keep build output in ignored `dist/` directories and temporary work in ignored `.temp/`. Do not commit generated editor bundles, compiled documentation mirrors, local captures, logs, or machine-specific settings.
- Keep regression tests near the responsible module. Syntax inputs and reviewed AST expectations belong in `syntax-tests/fixtures/`; these are intentional test data, not disposable build output.
- Document reusable scripts in `scripts/README.md`. Consolidate overlapping tools instead of adding another wrapper for the same operation.

## Documentation roles

[README.md](README.md) is the short project entry point. [SYNTAX.md](SYNTAX.md) describes the language contract. [tech-spec.md](tech-spec.md) describes current architecture. [CONTRIBUTING.md](CONTRIBUTING.md) describes contribution and validation. This file owns repository-maintenance rules; [CLAUDE.md](CLAUDE.md) is a short agent entry point that links them.

Use Markdown for repository navigation and contributor guidance. Use Taildown for authored website pages and examples that demonstrate the language. Each subject needs one maintained authority; link to it instead of maintaining parallel `.md`, `.td`, and generated HTML versions. Historical plans and session reports must not appear to be current feature documentation. Preserve useful design rationale in maintained architecture notes; Git history retains superseded work.

Describe shipped behavior precisely. Do not present plans as APIs, old test failures as acceptable baselines, unsupported installation paths as releases, or unmeasured size/performance claims as guarantees. Keep public documentation independent of private workspace paths and account configuration.

## Public feature integration

A primitive or feature is finished when its complete supported path works:

1. Define its syntax, attributes, defaults, diagnostics, and interaction with existing features.
2. Implement parsing, resolution, rendering, styles, runtime behavior, and configuration where applicable.
3. Surface authorable features through the shared authoring reference, editor completions, and Command-K/slash insertion as appropriate. Custom settings must remain consistent with those surfaces.
4. Document it in the relevant site reference and language contract, with a useful example.
5. Verify Node/CLI output, browser preview, and ordinary/minified HTML exports. Preserve offline behavior and hosted asset loading where affected.
6. Check keyboard focus, semantic structure, light/dark presentation, responsive layout, and reduced motion for visual or interactive changes.

Prefer reusable primitives with composable defaults. A new feature should earn its maintenance cost through an actual authoring need.

## Verification and cleanup

Preserve literal source, user content, and diagnostics. Do not rewrite code examples to make a parser appear correct. Review snapshot differences against the intended language contract; never regenerate all expectations merely to silence failures.

Use focused regression tests for changed behavior and run the relevant build/type checks. Inspect rendered output for visual changes and exercise real interactions for runtime changes. Green unit tests alone do not establish browser or export correctness.

Review the tracked diff before publication. Remove obsolete references in the same change that removes a file or feature. Do not sweep unrelated edits into a cleanup or run broad destructive commands against computed paths.
