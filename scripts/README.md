# Development scripts

Run these commands from the repository root with dependencies installed and `pnpm build` complete. Use the pinned pnpm version from `package.json`.

## Reviewed AST expectations

```sh
node scripts/generate-fixtures.mjs syntax-tests/fixtures/02-inline-attributes/01-headings.td
node scripts/generate-fixtures.mjs --all
```

The first command writes the adjacent `.ast.json` for one source. The second explicitly regenerates supported inputs under `syntax-tests/fixtures/`. Supported suffixes are `.td`, `.tdown`, and `.taildown`; invalid inputs and nonregular destinations are rejected before writing. Paths are passed as arguments, so quote a filename containing spaces in your shell.

Generation is a maintenance operation, not a test fix. Review every expectation against the source and [SYNTAX.md](../SYNTAX.md); a current parser can still be wrong. Preserve intentional rendered-only contracts in the [syntax suite](../syntax-tests/README.md). Run `pnpm exec vitest run syntax-tests/reference.test.ts` after reviewing a change. The generator does not silently rebuild the compiler or approve its output.

## Compile authored examples

```sh
node scripts/compile-examples.mjs
```

Compiles each top-level `examples/*.td` to a self-contained HTML document in ignored `examples/dist/`. Compiler failures or diagnostics produce a nonzero exit status. Open those files to review appearance and interactions; successful compilation alone is not a visual or accessibility check. See the [example guide](../examples/README.md).

For the public documentation site, use its dedicated build:

```sh
node docs-site/build.mjs
```

It writes `docs-site/dist/`; see the [site guide](../docs-site/README.md). Neither build writes compiled mirrors alongside authored sources.

## Measure output

```sh
node scripts/measure-bundles.mjs
node scripts/measure-bundles.mjs examples/dist/01-basic-markdown.html
```

With no arguments, reports raw and gzip byte counts for the two built editor distributions. With filenames, measures those files. Build the relevant artifacts first. These are artifact-size measurements, not network-transfer or startup-performance claims; actual server compression, cache state, device and document affect the user experience.

The former platform-specific fixture generators, source-adjacent documentation compiler, absent-extension installer and historical regex/size debugging reports have been retired. Use the current scripts and executable regression tests rather than old commands retained in Git history.

## Clean build output

`pnpm clean` removes package, editor, documentation-site and example `dist/` directories, coverage output, and root/package `node_modules/`. It preserves authored source and `.temp/`. Run `pnpm install --frozen-lockfile` before rebuilding afterward. Cleanup uses Node and works on Windows and POSIX shells.

To remove only one package's build output while keeping dependencies, run `pnpm --filter @taildown/compiler clean` (substitute another workspace package as needed). The cleaner validates all target ancestors before deletion and refuses paths redirected outside the checkout. Close running development/build processes before cleaning.
