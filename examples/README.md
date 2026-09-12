# Example documents

These fourteen authored sources demonstrate Taildown from basic Markdown to complete pages. Edit a `.td` source; generated HTML belongs in ignored `dist/` output rather than beside it.

After installing dependencies and running `pnpm build` from the repository root:

```sh
node scripts/compile-examples.mjs
```

Open the resulting files under `examples/dist/`. The command fails on compiler diagnostics as well as errors. For one example with the local CLI:

```sh
pnpm taildown compile examples/01-basic-markdown.td -o examples/dist/01-basic-markdown.html --no-config
```

CSS and JavaScript are embedded by default; `--separate` writes companion assets. You can also open any `.td` source with the [browser editor](https://taildown.dev/editor), adapt it, and export HTML. External images, video embeds and links in an example still depend on their hosts.

| Source | Focus |
| --- | --- |
| [01 Basic Markdown](01-basic-markdown.td) | Headings, prose, lists, links and code |
| [02 Inline attributes](02-inline-attributes.td) | Styling text and other Markdown elements |
| [03 Component basics](03-component-basics.td) | Component syntax and composition |
| [04 Grid layouts](04-grid-layouts.td) | Responsive grids and content layout |
| [05 Nested components](05-nested-components.td) | Containers composed inside other containers |
| [06 Fieldnotes landing page](06-real-world-landing.td) | A complete product landing page |
| [07 API documentation](07-documentation-page.td) | A technical guide with navigation and examples |
| [08 Long-form article](08-blog-post.td) | Reading typography and supporting content |
| [09 Portfolio](09-portfolio-page.td) | Projects, skills and profile layout |
| [10 Complete page](10-complete-page.td) | A broader application of the component vocabulary |
| [11 Text illustrations](11-text-illustrations.td) | Diagrams and visual explanations in text |
| [12 Scroll animations](12-scroll-animations.td) | Entrance and hover motion |
| [13 Syntax highlighting](13-syntax-highlighting-showcase.td) | Fenced code across languages |
| [14 Syntax showcase](14-complete-syntax-showcase.td) | A broad sampling of authored syntax |

Use [the syntax guide](../docs-site/syntax-guide.td), [component reference](../docs-site/components.td), and [plain-English reference](../docs-site/plain-english.td) for exact syntax. The examples are compositions to adapt, not templates that constrain the language.

When changing an example, compile it and inspect it at narrow and wide widths, in light and dark mode. Exercise its keyboard controls and exported HTML. For motion, also check reduced-motion preferences. Compiler success alone does not establish those properties.
