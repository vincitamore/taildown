# Taildown MCP server

This workspace package exposes Taildown compilation and reference tools over MCP's stdio transport. It runs locally with the filesystem access of the account launching it. It does not host an HTTP service or use the browser editor's stored design settings.

## Build and connect

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm build
node packages/mcp/dist/index.js
```

The last command starts the protocol server; it is not an interactive terminal prompt. An MCP client normally starts this process for you. Configure its stdio command as `node` with an absolute path to `packages/mcp/dist/index.js` as the argument. For clients using an `mcpServers` JSON configuration:

```json
{
  "mcpServers": {
    "taildown": {
      "command": "node",
      "args": ["/absolute/path/to/taildown/packages/mcp/dist/index.js"]
    }
  }
}
```

Replace the example path with your checkout path. Use an absolute path to Node as well if the client cannot find it on PATH. Keep the checkout's `SYNTAX.md` available: the full syntax resource is read from the repository, not embedded in the server bundle. Startup messages go to stderr; stdout carries MCP messages.

## Tools

| Tool | Arguments | Result or effect |
| --- | --- | --- |
| `taildown_compile` | `source`; optional `title`, `minify`, `darkMode` | Self-contained HTML and compilation metadata; no file write |
| `taildown_compile_file` | `inputPath`; optional `outputPath`, `minify` | Compiles a local source and writes HTML; defaults to its basename with `.html` |
| `taildown_validate` | `source` | Parser warnings, validity and node count; does not perform browser or rendering verification |
| `taildown_components` | Optional `name` | Registered component catalog or one definition's variants, sizes and syntax |
| `taildown_styles` | `keywords` | Built-in shorthand lookup; unknown tokens are returned with `found: false`, not certified as valid CSS |
| `taildown_behaviors` | Optional `name` | Interactive behavior reference |
| `taildown_scaffold` | `template`; optional `title` | Editable source for `page`, `landing`, `blog`, `docs`, or `portfolio`; no file write |
| `taildown_syntax` | `topic` | A topic quick reference, or the topic index when no entry matches |

Tool replies use MCP text content. Compilation, validation, catalog and style results encode JSON in that text; scaffold and syntax results are document text. Failures return `isError: true` with an error message.

File compilation accepts `.td`, `.tdown`, and `.taildown` sources. Input and output must be distinct regular files; existing symbolic or hard-link aliases to the source are rejected. An existing unrelated output file is replaced, so choose its path deliberately. Paths are resolved against the server process's working directory; absolute paths avoid ambiguity. Parent output directories must already exist.

The exposed compilation options are a subset of the compiler API. These tools do not discover CLI configuration files, apply editor design JSON, or install plugins. Metadata warnings should be reviewed even when compilation succeeds. Authored external images or embeds still require network access when reading an exported document.

Syntax quick-reference topics include card, icon, glass, animation, tabs, modal, tooltip, accordion, badge, attributes, typography, spacing and grid. Common plural forms such as cards, icons and animations are accepted.

## Resources

| URI | Content |
| --- | --- |
| `taildown://syntax/full` | Repository [SYNTAX.md](../../SYNTAX.md) |
| `taildown://styles/mappings` | Built-in shorthand mappings as JSON; context-dependent entries are labeled |
| `taildown://components/catalog` | Registered component metadata as JSON |

See [the compiler architecture](../../tech-spec.md), [authoring guides](../../docs-site/README.md), and [editor guide](../../editor/README.md) for the other clients and their behavior.
