# Working with Taildown

For authoring or refining `.td` documents, read [the Taildown authoring skill](skills/taildown/SKILL.md) and use the local CLI. The skill links the maintained syntax, component, styling, and example references.

For repository implementation work, Taildown is a TypeScript Markdown-extension compiler, CLI, and browser editor. Start with [PROJECT-RULES.md](PROJECT-RULES.md), then use [CONTRIBUTING.md](CONTRIBUTING.md) for validation and [tech-spec.md](tech-spec.md) for implementation boundaries. [SYNTAX.md](SYNTAX.md) is the detailed language contract.

Use the pnpm version pinned in `package.json`. From a fresh checkout:

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm exec vitest run
pnpm typecheck
```

Do not accept historical test failures or type errors as the baseline. Investigate failures against source and intended behavior; do not regenerate fixtures simply to make them pass.

- Compiler behavior: `packages/compiler/src/`; public types: `packages/shared/src/`.
- CLI configuration and file output: `packages/cli/src/`.
- Browser UI and persistence: `editor/`; see its [guide](editor/README.md).
- Public authoring references and examples: `docs-site/*.td`, `SYNTAX.md`, `examples/`.
- Syntax conformance: [syntax-tests/README.md](syntax-tests/README.md).

Build the browser editor with `pnpm build:editor`. Build the site with `node docs-site/build.mjs`; deployable output is `docs-site/dist/`. Source templates and older compiled snapshots are not interchangeable release artifacts.

Public additions require the complete integration contract in PROJECT-RULES.md: compiler, configuration, authoring reference, editor insertion/completions, documentation, examples, and exports as applicable. Preserve source content and existing unrelated changes. Verify rendered and interactive behavior in a browser before claiming it works.
