#!/usr/bin/env node
/**
 * Taildown MCP Server
 *
 * Exposes Taildown compilation and syntax reference capabilities via Model Context Protocol.
 * Provides tools for compiling .td files, querying syntax, components, and styles.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { join, dirname, basename } from 'path';
import { fileURLToPath } from 'url';
import {resolveCompileOutput} from './file-output.js';

// Import compiler functionality
import {
  compile,
  parseWithWarnings,
  registry,
  registerStandardComponents,
  SHORTHAND_MAPPINGS,
  hasInteractiveBehavior,
} from '@taildown/compiler';

// Resolve paths for SYNTAX.md
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = join(__dirname, '..', '..', '..');

// Initialize registry once at startup
let registryInitialized = false;

async function ensureRegistry() {
  if (!registryInitialized) {
    await registerStandardComponents();
    registryInitialized = true;
  }
  return registry;
}

function getMappings() {
  return SHORTHAND_MAPPINGS;
}

// Create MCP Server
const server = new Server(
  {
    name: 'taildown-mcp',
    version: '0.1.0',
  },
  {
    capabilities: {
      tools: {},
      resources: {},
    },
  }
);

// Define available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'taildown_compile',
        description:
          'Compile Taildown (.td) source to HTML. Returns self-contained HTML with embedded CSS and JavaScript.',
        inputSchema: {
          type: 'object',
          properties: {
            source: {
              type: 'string',
              description: 'Taildown source code to compile',
            },
            title: {
              type: 'string',
              description: 'Document title (optional)',
            },
            minify: {
              type: 'boolean',
              description: 'Minify output (default: false)',
            },
            darkMode: {
              type: 'boolean',
              description: 'Include dark mode support (default: true)',
            },
          },
          required: ['source'],
        },
      },
      {
        name: 'taildown_compile_file',
        description: 'Compile a Taildown file from disk to HTML.',
        inputSchema: {
          type: 'object',
          properties: {
            inputPath: {
              type: 'string',
              description: 'Path to the .td file to compile',
            },
            outputPath: {
              type: 'string',
              description: 'Path for output HTML file (optional, defaults to same name with .html)',
            },
            minify: {
              type: 'boolean',
              description: 'Minify output (default: false)',
            },
          },
          required: ['inputPath'],
        },
      },
      {
        name: 'taildown_validate',
        description: 'Validate Taildown source without compiling. Returns parse warnings and errors.',
        inputSchema: {
          type: 'object',
          properties: {
            source: {
              type: 'string',
              description: 'Taildown source code to validate',
            },
          },
          required: ['source'],
        },
      },
      {
        name: 'taildown_components',
        description:
          'List or describe Taildown components. Without a name, lists the registered components. With a name, shows detailed info.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Component name to get details for (optional)',
            },
          },
        },
      },
      {
        name: 'taildown_styles',
        description:
          'Query the Taildown style resolver. Input plain English keywords, get resolved CSS classes.',
        inputSchema: {
          type: 'object',
          properties: {
            keywords: {
              type: 'string',
              description: 'Space-separated plain English keywords (e.g., "huge-bold primary glass")',
            },
          },
          required: ['keywords'],
        },
      },
      {
        name: 'taildown_behaviors',
        description:
          'List available JavaScript behaviors for interactive components.',
        inputSchema: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Behavior name to get details for (optional)',
            },
          },
        },
      },
      {
        name: 'taildown_scaffold',
        description:
          'Generate Taildown boilerplate for common page types.',
        inputSchema: {
          type: 'object',
          properties: {
            template: {
              type: 'string',
              enum: ['page', 'landing', 'blog', 'docs', 'portfolio'],
              description: 'Template type to generate',
            },
            title: {
              type: 'string',
              description: 'Page title',
            },
          },
          required: ['template'],
        },
      },
      {
        name: 'taildown_syntax',
        description:
          'Query Taildown syntax reference by topic.',
        inputSchema: {
          type: 'object',
          properties: {
            topic: {
              type: 'string',
              description: 'Topic to look up (e.g., "cards", "icons", "glass", "animations", "tabs")',
            },
          },
          required: ['topic'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'taildown_compile': {
        const { source, title, minify = false, darkMode = true } = args as {
          source: string;
          title?: string;
          minify?: boolean;
          darkMode?: boolean;
        };

        const result = await compile(source, {
          title,
          minify,
          darkMode,
          inlineStyles: true,
          inlineScripts: true,
        });

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                html: result.html,
                metadata: {
                  compileTime: `${result.metadata.compileTime.toFixed(2)}ms`,
                  nodeCount: result.metadata.nodeCount,
                  warnings: result.metadata.warnings,
                  cssSize: result.css.length,
                  jsSize: result.js.length,
                },
              }, null, 2),
            },
          ],
        };
      }

      case 'taildown_compile_file': {
        const { inputPath, outputPath, minify = false } = args as {
          inputPath: string;
          outputPath?: string;
          minify?: boolean;
        };

        if (!existsSync(inputPath)) {
          throw new Error(`File not found: ${inputPath}`);
        }

        const outPath = resolveCompileOutput(inputPath, outputPath);
        const source = readFileSync(inputPath, 'utf-8');
        const result = await compile(source, {
          minify,
          inlineStyles: true,
          inlineScripts: true,
        });

        writeFileSync(outPath, result.html, 'utf-8');

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: true,
                outputPath: outPath,
                metadata: {
                  compileTime: `${result.metadata.compileTime.toFixed(2)}ms`,
                  nodeCount: result.metadata.nodeCount,
                  warnings: result.metadata.warnings,
                },
              }, null, 2),
            },
          ],
        };
      }

      case 'taildown_validate': {
        const { source } = args as { source: string };

        const result = await parseWithWarnings(source);

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                valid: result.warnings.length === 0,
                warnings: result.warnings,
                nodeCount: countNodes(result.ast),
              }, null, 2),
            },
          ],
        };
      }

      case 'taildown_components': {
        const { name: componentName } = args as { name?: string };
        const reg = await ensureRegistry();

        if (componentName) {
          const component = reg.get(componentName);
          if (!component) {
            throw new Error(`Component not found: ${componentName}`);
          }

          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  name: component.name,
                  htmlElement: component.htmlElement,
                  description: component.description,
                  defaultClasses: component.defaultClasses,
                  defaultVariant: component.defaultVariant,
                  defaultSize: component.defaultSize,
                  variants: Object.keys(component.variants || {}),
                  sizes: Object.keys(component.sizes || {}),
                  hasChildren: component.hasChildren,
                  requiredAttributes: component.requiredAttributes,
                  syntax: `:::${component.name} {variant size}\nContent here\n:::`,
                }, null, 2),
              },
            ],
          };
        }

        // List all components
        const components = reg.getAll();
        const summary = components.map((c: any) => ({
          name: c.name,
          variants: Object.keys(c.variants || {}).length,
          sizes: Object.keys(c.sizes || {}).length,
          hasJS: hasInteractiveBehavior(c.name),
        }));

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                count: components.length,
                components: summary,
              }, null, 2),
            },
          ],
        };
      }

      case 'taildown_styles': {
        const { keywords } = args as { keywords: string };
        const mappings = getMappings();

        const tokens = keywords.split(/\s+/).filter(Boolean);
        const results: Array<{ keyword: string; cssClasses: string[]; found: boolean }> = [];

        for (const token of tokens) {
          const mapping = mappings[token];
          if (mapping) {
            const classes = typeof mapping === 'function'
              ? mapping({} as any) // Call with empty context (most shorthands don't need it)
              : Array.isArray(mapping)
                ? mapping
                : [mapping];
            results.push({ keyword: token, cssClasses: classes, found: true });
          } else {
            // Check if it might be a direct CSS class
            results.push({ keyword: token, cssClasses: [token], found: false });
          }
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                input: keywords,
                resolved: results,
                allClasses: results.flatMap(r => r.cssClasses),
              }, null, 2),
            },
          ],
        };
      }

      case 'taildown_behaviors': {
        const { name: behaviorName } = args as { name?: string };

        const behaviors = [
          { name: 'tabs', description: 'Tabbed interface with keyboard navigation and ARIA support', size: '~1.2KB' },
          { name: 'accordion', description: 'Collapsible sections with smooth animations', size: '~1KB' },
          { name: 'modal', description: 'Dialog boxes with backdrop blur and focus trap', size: '~1.5KB' },
          { name: 'tooltip', description: 'Contextual help on hover with smart positioning', size: '~1.8KB' },
          { name: 'carousel', description: 'Image/content slider with touch and keyboard support', size: '~2.4KB' },
          { name: 'navbar', description: 'Navigation bar with scroll effects', size: '~400B' },
          { name: 'table', description: 'Sortable table columns with type detection', size: '~1.1KB' },
          { name: 'compare-images', description: 'Before/after image comparison slider', size: '~2KB' },
          { name: 'diff', description: 'Synchronized scrolling for side-by-side code diff', size: '~800B' },
          { name: 'footnotes', description: 'Footnote hover preview and smooth scroll', size: '~800B' },
          { name: 'task-list', description: 'Interactive task list with localStorage persistence', size: '~1.8KB' },
          { name: 'scroll-animations', description: 'Intersection Observer triggered animations', size: '~1.2KB' },
          { name: 'copy-code', description: 'Copy code button with clipboard API', size: '~1.2KB' },
          { name: 'dark-mode', description: 'Theme toggle with system preference detection', size: '~1.8KB' },
        ];

        if (behaviorName) {
          const behavior = behaviors.find(b => b.name === behaviorName);
          if (!behavior) {
            throw new Error(`Behavior not found: ${behaviorName}`);
          }
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(behavior, null, 2),
              },
            ],
          };
        }

        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                count: behaviors.length,
                behaviors,
                note: 'JS behaviors are tree-shaken - only included for components actually used.',
              }, null, 2),
            },
          ],
        };
      }

      case 'taildown_scaffold': {
        const { template, title = 'Taildown Page' } = args as {
          template: 'page' | 'landing' | 'blog' | 'docs' | 'portfolio';
          title?: string;
        };

        const templates: Record<string, string> = {
          page: `# ${title} {huge-bold center primary}

Welcome to your new page! {large muted center}

:::card {glass slide-up}
## Getting Started

This is a basic page template. Edit the content below to build your page.

[Learn More](#){button primary}
:::
`,
          landing: `# ${title} {huge-bold center}

Your tagline goes here. {xl muted center}

:::grid
:::card {glass slide-up}
### :icon[zap]{warning} Feature One
Description of your first key feature.
:::

:::card {glass slide-up}
### :icon[shield]{success} Feature Two
Description of your second key feature.
:::

:::card {glass slide-up}
### :icon[heart]{error} Feature Three
Description of your third key feature.
:::
:::

---

:::container {center}
## Ready to get started? {huge-bold}

[Get Started](#){button primary large} [Learn More](#){button secondary large}
:::
`,
          blog: `# ${title} {huge-bold}

*Published on January 28, 2026* {small muted}

:::callout {tip}
This is a blog post template. Use callouts for important notes.
:::

## Introduction

Your introduction paragraph goes here. {large}

## Main Content

Write your main content here. Use **bold** and *italic* for emphasis.

### Subheading

More detailed content under a subheading.

\`\`\`javascript
// Code examples are syntax highlighted
console.log('Hello, Taildown!');
\`\`\`

## Conclusion

Your concluding thoughts.

---

*Thanks for reading!* {muted}
`,
          docs: `# ${title} {huge-bold}

Welcome to the documentation. {large muted}

:::tabs
## Overview
A brief overview of what this documentation covers.

## Installation
\`\`\`bash
npm install your-package
\`\`\`

## Usage
Basic usage instructions go here.

## API Reference
Detailed API documentation.
:::

---

:::alert {info}
Need help? Check the FAQ below.
:::

:::accordion
**How do I get started?**
Follow the Installation tab above.

**Where can I find examples?**
Check out the examples directory.

**How do I report bugs?**
Open an issue on GitHub.
:::
`,
          portfolio: `# ${title} {huge-bold center}

Designer • Developer • Creator {xl muted center}

---

## Featured Work {huge-bold center}

:::grid
:::card {glass interactive hover-lift}
### Project One
![Project One](/images/project1.jpg)
A brief description of your first project.
[View Project](#){button primary}
:::

:::card {glass interactive hover-lift}
### Project Two
![Project Two](/images/project2.jpg)
A brief description of your second project.
[View Project](#){button primary}
:::

:::card {glass interactive hover-lift}
### Project Three
![Project Three](/images/project3.jpg)
A brief description of your third project.
[View Project](#){button primary}
:::
:::

---

## About Me {huge-bold center}

A paragraph about yourself and your work. {large center}

[Contact Me](#){button primary large center-x}
`,
        };

        const content = templates[template];
        if (!content) {
          throw new Error(`Unknown template: ${template}`);
        }

        return {
          content: [
            {
              type: 'text',
              text: content,
            },
          ],
        };
      }

      case 'taildown_syntax': {
        const { topic } = args as { topic: string };
        const syntaxReference = getSyntaxReference(topic.toLowerCase());

        return {
          content: [
            {
              type: 'text',
              text: syntaxReference,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${errorMessage}`,
        },
      ],
      isError: true,
    };
  }
});

// Helper function to count nodes in AST
function countNodes(node: any): number {
  let count = 1;
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child);
    }
  }
  return count;
}

// Helper to check if component has JS behavior
function hasJsBehavior(componentName: string): boolean {
  return hasInteractiveBehavior(componentName);
}

// Syntax reference lookup
function getSyntaxReference(topic: string): string {
  const references: Record<string, string> = {
    card: `## Card Component

\`\`\`taildown
:::card {variant size}
Content here
:::
\`\`\`

**Variants:** flat, elevated, floating, outlined, bordered, interactive, glass, subtle-glass, light-glass, heavy-glass

**Sizes:** sm, md, lg, xl

**Example:**
\`\`\`taildown
:::card {glass slide-up}
### Card Title
Card content with **markdown** support.
[Button](#){button primary}
:::
\`\`\``,

    icon: `## Icon Syntax

\`\`\`taildown
:icon[name]{size color}
\`\`\`

**Sizes:** tiny (12px), xs (16px), sm (20px), md (24px), lg (32px), xl (40px), 2xl (48px), huge (64px)

**Colors:** primary, secondary, success, warning, error, info, muted

**Example:**
\`\`\`taildown
:icon[heart]{primary large}
:icon[check-circle]{success}
:icon[arrow-right]{xs}
\`\`\`

Uses Lucide icons. See https://lucide.dev for icon names.`,

    glass: `## Glassmorphism

Apply frosted glass effects with plain English:

\`\`\`taildown
:::card {subtle-glass}    # 95% opacity, 4px blur
:::card {light-glass}     # 85% opacity, 8px blur
:::card {glass}           # 75% opacity, 12px blur (default)
:::card {heavy-glass}     # 65% opacity, 16px blur
\`\`\`

Glass effects work on cards, alerts, callouts, and other container components.`,

    animation: `## Animations

**Entrance Animations:**
- \`{fade-in}\` - Fade in smoothly
- \`{slide-up}\` - Slide up from below
- \`{slide-down}\` - Slide down from above
- \`{zoom-in}\` - Zoom in from small

**Hover Effects:**
- \`{hover-lift}\` - Lift on hover
- \`{hover-scale}\` - Scale up on hover
- \`{interactive}\` - Enable hover effects

**Example:**
\`\`\`taildown
:::card {elevated fade-in hover-lift}
Animated card content
:::
\`\`\`

Animations are triggered on scroll via Intersection Observer.`,

    tabs: `## Tabs Component

\`\`\`taildown
:::tabs {variant}
## Tab One
Content for first tab

## Tab Two
Content for second tab

## Tab Three
Content for third tab
:::
\`\`\`

**Variants:** default, glass, boxed, pills, minimal

**Features:**
- Keyboard navigation (arrow keys)
- ARIA accessibility
- First tab active by default`,

    modal: `## Modal Component

**Inline Modal:**
\`\`\`taildown
[Click Me](#){modal="Your message here"}
\`\`\`

**Rich Modal with ID:**
\`\`\`taildown
[Open Modal](#){modal="#my-modal"}

:::modal{id="my-modal"}
## Modal Title
Full **markdown** support in modals.
[Close](#){button}
:::
\`\`\`

**Features:**
- Backdrop click to close
- Escape key support
- Focus trap
- Body scroll lock`,

    tooltip: `## Tooltip Component

\`\`\`taildown
[Hover me](#){tooltip="Helpful information"}
\`\`\`

Tooltips can be attached to any element. They support:
- Smart positioning (stays in viewport)
- Hover persistence
- Mobile touch support`,

    accordion: `## Accordion Component

\`\`\`taildown
:::accordion {variant}
**Section Title**
Content for this section

**Another Section**
More content here
:::
\`\`\`

**Variants:** default, bordered, flush, separated

**Features:**
- First section open by default
- Smooth animations
- ARIA accessibility`,

    badge: `## Badge Syntax

**Inline Badge:**
\`\`\`taildown
:badge[text]{variant}
\`\`\`

**Variants:** default, primary, secondary, success, warning, error, info, muted

**Example:**
\`\`\`taildown
:badge[beta]{warning}
:badge[v2.0]{info}
:badge[active]{success}
\`\`\``,

    attributes: `## Inline Attributes

Apply styles to any element with curly braces:

\`\`\`taildown
# Heading {huge-bold primary}

Paragraph text {large muted center}

[Link](#){button primary}
\`\`\`

**Categories:**
- Typography: xs, small, large, huge, bold, italic, center
- Spacing: padded, padded-lg, gap, m-lg
- Effects: glass, elevated, shadow, rounded
- Colors: primary, secondary, success, warning, error, muted
- Animations: fade-in, slide-up, hover-lift`,

    typography: `## Typography

**Sizes:** xs, small, base, large, xl, 2xl, 3xl, 4xl, 5xl, 6xl, huge, massive

**Weights:** thin, light, normal, medium, semibold, bold, extra-bold, black

**Alignment:** left, center, right, justify

**Combinations:**
- \`{huge-bold}\` - Large and bold
- \`{large-muted}\` - Large with gray color
- \`{small-light}\` - Small and light weight`,

    spacing: `## Spacing

**Padding:**
- \`{padded}\` - Standard padding (p-6)
- \`{padded-sm}\` - Small padding (p-4)
- \`{padded-lg}\` - Large padding (p-8)

**Margin:**
- \`{m}\` - Standard margin
- \`{m-lg}\` - Large margin

**Gap (for grids/flex):**
- \`{gap}\` - Standard gap
- \`{gap-lg}\` - Large gap`,

    grid: `## Grid Component

\`\`\`taildown
:::grid {columns gap}
:::card
Item 1
:::
:::card
Item 2
:::
:::card
Item 3
:::
:::
\`\`\`

**Columns:** Auto-responsive (1→2→3) or specify {2}, {3}, {4}

**Gap variants:** tight, normal, loose, extra-loose

Grid automatically adapts: 1 column on mobile, 2 on tablet, 3 on desktop.`,

    default: `## Taildown Syntax Reference

Taildown extends Markdown with plain English styling and 32 UI components.

**Basic Syntax:**
\`\`\`taildown
# Heading {huge-bold primary}

Paragraph with {muted} styling.

:icon[star]{warning} Icon syntax

:::card {glass}
Component block
:::
\`\`\`

**Available topics:**
- card, icon, glass, animation
- tabs, modal, tooltip, accordion
- badge, attributes, typography
- spacing, grid

Use \`taildown_syntax\` with a topic name for detailed reference.`,
  };

  const aliases: Record<string, string> = {cards:'card', icons:'icon', animations:'animation', modals:'modal', tooltips:'tooltip', accordions:'accordion', badges:'badge', grids:'grid'};
  return references[aliases[topic] ?? topic] || references.default;
}

// Define available resources (SYNTAX.md sections)
server.setRequestHandler(ListResourcesRequestSchema, async () => {
  return {
    resources: [
      {
        uri: 'taildown://syntax/full',
        name: 'Complete Syntax Reference',
        mimeType: 'text/markdown',
      },
      {
        uri: 'taildown://styles/mappings',
        name: 'Shorthand Mappings Table',
        mimeType: 'application/json',
      },
      {
        uri: 'taildown://components/catalog',
        name: 'Component Catalog',
        mimeType: 'application/json',
      },
    ],
  };
});

// Handle resource reads
server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  if (uri === 'taildown://syntax/full') {
    const syntaxPath = join(ROOT_DIR, 'SYNTAX.md');
    if (existsSync(syntaxPath)) {
      const content = readFileSync(syntaxPath, 'utf-8');
      return {
        contents: [{ uri, mimeType: 'text/markdown', text: content }],
      };
    }
    throw new Error('SYNTAX.md not found');
  }

  if (uri === 'taildown://styles/mappings') {
    const mappings = getMappings();
    const simplified: Record<string, string | string[]> = {};
    for (const [key, value] of Object.entries(mappings)) {
      if (typeof value === 'function') {
        simplified[key] = '(context-dependent)';
      } else {
        simplified[key] = value as string | string[];
      }
    }
    return {
      contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(simplified, null, 2) }],
    };
  }

  if (uri === 'taildown://components/catalog') {
    const reg = await ensureRegistry();
    const components = reg.getAll().map((c: any) => ({
      name: c.name,
      htmlElement: c.htmlElement,
      defaultVariant: c.defaultVariant,
      variants: Object.keys(c.variants || {}),
      sizes: Object.keys(c.sizes || {}),
      hasChildren: c.hasChildren,
    }));
    return {
      contents: [{ uri, mimeType: 'application/json', text: JSON.stringify(components, null, 2) }],
    };
  }

  throw new Error(`Unknown resource URI: ${uri}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Taildown MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
