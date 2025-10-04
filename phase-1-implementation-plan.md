# Taildown Phase 1 Implementation Plan - TypeScript

**Version:** 1.0.0  
**Date:** 2025-10-04  
**Language:** TypeScript  
**Target Duration:** 4 weeks  
**Status:** Ready to Execute

---

## Overview

This document provides a detailed, step-by-step implementation plan for **Phase 1: Foundation** of Taildown using TypeScript. The goal is to create a proof-of-concept compiler that can parse basic Taildown syntax and generate HTML/CSS output.

---

## Phase 1 Goals

**Primary Objective:** Build a working compiler that validates the core Taildown concept

**Key Deliverables:**
1. ✅ Canonical syntax specification ([`SYNTAX.md`](SYNTAX.md))
2. ✅ Executable syntax tests ([`syntax-tests/`](syntax-tests/))
3. ✅ Basic parser (Markdown + inline styles)
4. ✅ HTML/CSS generator
5. ✅ CLI compiler tool
6. ✅ 10 example documents
7. ✅ Test suite with >80% coverage

**Success Criteria:**
- Parse standard Markdown correctly
- Support inline style attributes `{.class-name}`
- Support component blocks `:::card ... :::`
- Generate semantic HTML5
- Compile sample document in <100ms
- All tests passing

---

## Technology Stack

### Core Dependencies
- **Runtime:** Node.js 18+ (LTS)
- **Language:** TypeScript 5.x
- **Parser Foundation:** unified + remark + rehype ecosystem
- **CSS Generation:** Custom style resolver + Tailwind CSS utilities
- **Testing:** Vitest
- **Build Tool:** tsup
- **CLI Framework:** commander
- **Package Manager:** pnpm

### Directory Structure
```
taildown/
├── packages/
│   ├── compiler/          # Core compiler logic
│   ├── cli/               # CLI tool
│   └── shared/            # Shared types and utilities
├── examples/              # Sample .tdown files
├── docs/                  # Documentation
├── .github/
│   └── workflows/         # CI/CD
├── package.json           # Monorepo root
├── pnpm-workspace.yaml    # Workspace config
├── tsconfig.json          # Root TS config
└── turbo.json             # Turborepo config (optional)
```

---

## Week 1: Project Setup & Infrastructure

### Day 1-2: Repository Setup

#### Task 1.1: Initialize Monorepo
**Priority:** P0 (Critical)  
**Estimated Time:** 2 hours

**Steps:**
1. Initialize git repository (if not done)
   ```bash
   git init
   git branch -M main
   ```

2. Create package.json for monorepo root
   ```json
   {
     "name": "taildown",
     "version": "0.1.0",
     "private": true,
     "workspaces": [
       "packages/*"
     ],
     "scripts": {
       "build": "pnpm -r build",
       "test": "pnpm -r test",
       "dev": "pnpm -r dev",
       "lint": "pnpm -r lint",
       "typecheck": "pnpm -r typecheck"
     },
     "devDependencies": {
       "@types/node": "^20.0.0",
       "typescript": "^5.3.0",
       "vitest": "^1.0.0",
       "tsup": "^8.0.0"
     }
   }
   ```

3. Create pnpm-workspace.yaml
   ```yaml
   packages:
     - 'packages/*'
   ```

4. Create root tsconfig.json
   ```json
   {
     "compilerOptions": {
       "target": "ES2022",
       "module": "ESNext",
       "lib": ["ES2022"],
       "moduleResolution": "bundler",
       "strict": true,
       "esModuleInterop": true,
       "skipLibCheck": true,
       "forceConsistentCasingInFileNames": true,
       "declaration": true,
       "declarationMap": true,
       "sourceMap": true,
       "composite": true
     }
   }
   ```

5. Install pnpm if needed
   ```bash
   npm install -g pnpm
   ```

6. Run initial install
   ```bash
   pnpm install
   ```

**Validation:**
- [ ] `pnpm install` completes without errors
- [ ] Workspace structure is recognized

---

#### Task 1.2: Create Package Structure
**Priority:** P0 (Critical)  
**Estimated Time:** 1 hour

**Steps:**
1. Create packages directory structure
   ```bash
   mkdir -p packages/compiler/src
   mkdir -p packages/cli/src
   mkdir -p packages/shared/src
   mkdir -p examples
   mkdir -p docs
   ```

2. Create packages/shared/package.json
   ```json
   {
     "name": "@taildown/shared",
     "version": "0.1.0",
     "type": "module",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.js"
       }
     },
     "scripts": {
       "build": "tsup src/index.ts --format esm --dts",
       "dev": "tsup src/index.ts --format esm --dts --watch",
       "test": "vitest",
       "typecheck": "tsc --noEmit"
     },
     "devDependencies": {
       "tsup": "^8.0.0",
       "typescript": "^5.3.0",
       "vitest": "^1.0.0"
     }
   }
   ```

3. Create packages/compiler/package.json
   ```json
   {
     "name": "@taildown/compiler",
     "version": "0.1.0",
     "type": "module",
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "exports": {
       ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.js"
       }
     },
     "scripts": {
       "build": "tsup src/index.ts --format esm --dts",
       "dev": "tsup src/index.ts --format esm --dts --watch",
       "test": "vitest",
       "typecheck": "tsc --noEmit"
     },
     "dependencies": {
       "@taildown/shared": "workspace:*",
       "unified": "^11.0.4",
       "remark-parse": "^11.0.0",
       "remark-directive": "^3.0.0",
       "remark-gfm": "^4.0.0",
       "remark-rehype": "^11.0.0",
       "rehype-stringify": "^10.0.0",
       "unist-util-visit": "^5.0.0",
       "vfile": "^6.0.1"
     },
     "devDependencies": {
       "@types/node": "^20.0.0",
       "tsup": "^8.0.0",
       "typescript": "^5.3.0",
       "vitest": "^1.0.0"
     }
   }
   ```

4. Create packages/cli/package.json
   ```json
   {
     "name": "@taildown/cli",
     "version": "0.1.0",
     "type": "module",
     "bin": {
       "taildown": "./dist/index.js"
     },
     "scripts": {
       "build": "tsup src/index.ts --format esm --dts",
       "dev": "tsup src/index.ts --format esm --dts --watch",
       "test": "vitest",
       "typecheck": "tsc --noEmit"
     },
     "dependencies": {
       "@taildown/compiler": "workspace:*",
       "@taildown/shared": "workspace:*",
       "commander": "^11.0.0",
       "chalk": "^5.3.0",
       "ora": "^8.0.0"
     },
     "devDependencies": {
       "@types/node": "^20.0.0",
       "tsup": "^8.0.0",
       "typescript": "^5.3.0",
       "vitest": "^1.0.0"
     }
   }
   ```

5. Install all dependencies
   ```bash
   pnpm install
   ```

**Validation:**
- [ ] All packages have package.json
- [ ] Dependencies installed successfully
- [ ] Workspace references working

---

#### Task 1.3: Configure Development Tools
**Priority:** P1 (High)  
**Estimated Time:** 1 hour

**Steps:**
1. Create .gitignore
   ```gitignore
   node_modules/
   dist/
   .turbo/
   coverage/
   *.log
   .DS_Store
   .env
   .vscode/
   *.tsbuildinfo
   ```

2. Create .prettierrc
   ```json
   {
     "semi": true,
     "singleQuote": true,
     "tabWidth": 2,
     "trailingComma": "es5",
     "printWidth": 100
   }
   ```

3. Create .eslintrc.json (optional but recommended)
   ```json
   {
     "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
     "parser": "@typescript-eslint/parser",
     "plugins": ["@typescript-eslint"],
     "root": true,
     "env": {
       "node": true,
       "es6": true
     }
   }
   ```

4. Create vitest.config.ts in root
   ```typescript
   import { defineConfig } from 'vitest/config';

   export default defineConfig({
     test: {
       globals: true,
       environment: 'node',
       coverage: {
         provider: 'v8',
         reporter: ['text', 'json', 'html'],
         exclude: ['**/node_modules/**', '**/dist/**', '**/*.test.ts']
       }
     }
   });
   ```

**Validation:**
- [ ] Git ignores correct files
- [ ] Code formatting configured
- [ ] Test runner configured

---

### Day 3: CI/CD Setup

#### Task 1.4: GitHub Actions Workflow
**Priority:** P1 (High)  
**Estimated Time:** 2 hours

**Steps:**
1. Create .github/workflows/ci.yml
   ```yaml
   name: CI

   on:
     push:
       branches: [main, develop]
     pull_request:
       branches: [main, develop]

   jobs:
     test:
       runs-on: ubuntu-latest
       strategy:
         matrix:
           node-version: [18.x, 20.x]
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
           with:
             version: 8
         - name: Use Node.js ${{ matrix.node-version }}
           uses: actions/setup-node@v4
           with:
             node-version: ${{ matrix.node-version }}
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm typecheck
         - run: pnpm test
         - run: pnpm build

     lint:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: pnpm/action-setup@v2
           with:
             version: 8
         - uses: actions/setup-node@v4
           with:
             node-version: 20.x
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm lint
   ```

2. Create .github/workflows/release.yml (placeholder for later)
   ```yaml
   name: Release

   on:
     push:
       tags:
         - 'v*'

   jobs:
     release:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - name: Placeholder
           run: echo "Release workflow - to be implemented"
   ```

**Validation:**
- [ ] CI workflow triggers on push
- [ ] Tests run in CI
- [ ] Build succeeds in CI

---

### Day 4-5: Define Core Types & Interfaces

#### Task 1.5: Create Shared Types
**Priority:** P0 (Critical)  
**Estimated Time:** 4 hours

**Steps:**
1. Create packages/shared/src/types.ts
   ```typescript
   /**
    * Core types for Taildown AST and compilation
    */

   // ============================================================================
   // AST Node Types
   // ============================================================================

   export interface TaildownNode {
     type: string;
     position?: Position;
     data?: Record<string, unknown>;
   }

   export interface Position {
     start: Point;
     end: Point;
   }

   export interface Point {
     line: number;
     column: number;
     offset: number;
   }

   // ============================================================================
   // Style Attributes
   // ============================================================================

   export interface StyleAttributes {
     classes: string[];
     rawClasses?: string[]; // Original classes before transformation
   }

   // ============================================================================
   // Component Types
   // ============================================================================

   export type ComponentType = 
     | 'card'
     | 'grid'
     | 'container'
     | 'section'
     | 'flex'
     | 'button'
     | 'alert'
     | 'badge';

   export interface ComponentDefinition {
     name: ComponentType;
     defaultClasses: string[];
     variants: Record<string, string[]>;
   }

   // ============================================================================
   // Compilation Options
   // ============================================================================

   export interface CompileOptions {
     /**
      * Whether to inline CSS in the output HTML
      * @default false
      */
     inlineStyles?: boolean;

     /**
      * Whether to minify the output
      * @default false
      */
     minify?: boolean;

     /**
      * Whether to include source maps
      * @default false
      */
     sourceMaps?: boolean;

     /**
      * Custom component definitions
      */
     components?: Partial<Record<ComponentType, Partial<ComponentDefinition>>>;

     /**
      * Custom style mappings (plain English -> CSS classes)
      */
     styleMappings?: Record<string, string>;
   }

   // ============================================================================
   // Compilation Result
   // ============================================================================

   export interface CompileResult {
     html: string;
     css: string;
     metadata: {
       compileTime: number; // milliseconds
       nodeCount: number;
       warnings: CompileWarning[];
     };
   }

   export interface CompileWarning {
     message: string;
     position?: Position;
     severity: 'warning' | 'info';
   }

   // ============================================================================
   // Plugin System (future)
   // ============================================================================

   export interface Plugin {
     name: string;
     version: string;
     transform?: (tree: TaildownNode) => TaildownNode | Promise<TaildownNode>;
   }
   ```

2. Create packages/shared/src/constants.ts
   ```typescript
   /**
    * Constants used across Taildown packages
    */

   export const COMPONENT_DELIMITER = ':::';
   export const ATTRIBUTE_DELIMITER = '{.';
   export const ICON_PREFIX = ':icon[';

   export const DEFAULT_STYLE_MAPPINGS: Record<string, string> = {
     // Size shorthands
     'large': 'text-4xl',
     'medium': 'text-2xl',
     'small': 'text-sm',
     
     // Color shorthands
     'primary': 'text-primary bg-primary',
     'secondary': 'text-secondary bg-secondary',
     
     // Layout shorthands
     'center': 'text-center mx-auto',
     'center-x': 'mx-auto',
     'center-y': 'my-auto',
     
     // Effects shorthands
     'rounded': 'rounded-lg',
     'shadow': 'shadow-md',
     'elevated': 'shadow-xl',
     'padded': 'p-6',
     
     // Typography
     'bold': 'font-bold',
     'italic': 'italic',
     
     // Responsive
     'responsive': 'responsive',
   };

   export const DEFAULT_COMPONENT_DEFINITIONS: Record<string, any> = {
     card: {
       defaultClasses: ['rounded-lg', 'shadow-md', 'p-6', 'bg-white'],
       variants: {
         elevated: ['shadow-xl'],
         flat: ['shadow-none', 'border', 'border-gray-200'],
       }
     },
     button: {
       defaultClasses: ['px-4', 'py-2', 'rounded', 'transition', 'cursor-pointer'],
       variants: {
         primary: ['bg-blue-600', 'text-white', 'hover:bg-blue-700'],
         secondary: ['bg-gray-600', 'text-white', 'hover:bg-gray-700'],
         outline: ['border', 'border-gray-300', 'hover:bg-gray-50'],
       }
     },
     grid: {
       defaultClasses: ['grid', 'gap-4'],
       variants: {}
     },
     container: {
       defaultClasses: ['container', 'mx-auto', 'px-4'],
       variants: {}
     }
   };
   ```

3. Create packages/shared/src/index.ts
   ```typescript
   export * from './types';
   export * from './constants';
   ```

4. Build the shared package
   ```bash
   cd packages/shared
   pnpm build
   ```

**Validation:**
- [ ] Types compile without errors
- [ ] Exports are accessible
- [ ] Build completes successfully

---

#### Task 1.6: Write Initial Tests for Types
**Priority:** P2 (Medium)  
**Estimated Time:** 1 hour

**Steps:**
1. Create packages/shared/src/types.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { DEFAULT_STYLE_MAPPINGS, DEFAULT_COMPONENT_DEFINITIONS } from './constants';

   describe('Constants', () => {
     it('should have default style mappings', () => {
       expect(DEFAULT_STYLE_MAPPINGS).toBeDefined();
       expect(DEFAULT_STYLE_MAPPINGS['primary']).toBe('text-primary bg-primary');
     });

     it('should have default component definitions', () => {
       expect(DEFAULT_COMPONENT_DEFINITIONS).toBeDefined();
       expect(DEFAULT_COMPONENT_DEFINITIONS.card).toBeDefined();
       expect(DEFAULT_COMPONENT_DEFINITIONS.button).toBeDefined();
     });
   });
   ```

2. Run tests
   ```bash
   cd packages/shared
   pnpm test
   ```

**Validation:**
- [ ] Tests pass
- [ ] Coverage report generated

---

## Week 2: Parser Implementation

### Day 6-7: Basic Markdown Parser

#### Task 2.1: Set Up Parser Foundation
**Priority:** P0 (Critical)  
**Estimated Time:** 3 hours

**Steps:**
1. Create packages/compiler/src/parser/index.ts
   ```typescript
   import { unified } from 'unified';
   import remarkParse from 'remark-parse';
   import remarkDirective from 'remark-directive';
   import remarkGfm from 'remark-gfm';
   import { Root } from 'mdast';

   export interface ParseOptions {
     filename?: string;
   }

   /**
    * Parse Taildown/Markdown source into an AST
    */
   export async function parse(source: string, options: ParseOptions = {}): Promise<Root> {
     const processor = unified()
       .use(remarkParse)
       .use(remarkGfm)
       .use(remarkDirective);

     const file = await processor.parse(source);
     return file as Root;
   }
   ```

2. Create packages/compiler/src/parser/parser.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { parse } from './index';

   describe('Parser', () => {
     it('should parse basic markdown', async () => {
       const source = '# Hello World\n\nThis is a paragraph.';
       const ast = await parse(source);
       
       expect(ast.type).toBe('root');
       expect(ast.children).toBeDefined();
       expect(ast.children.length).toBeGreaterThan(0);
     });

     it('should parse headings', async () => {
       const source = '# H1\n## H2\n### H3';
       const ast = await parse(source);
       
       const headings = ast.children.filter(n => n.type === 'heading');
       expect(headings).toHaveLength(3);
     });

     it('should parse lists', async () => {
       const source = '- Item 1\n- Item 2\n- Item 3';
       const ast = await parse(source);
       
       const lists = ast.children.filter(n => n.type === 'list');
       expect(lists).toHaveLength(1);
     });

     it('should parse code blocks', async () => {
       const source = '```javascript\nconsole.log("hello");\n```';
       const ast = await parse(source);
       
       const codeBlocks = ast.children.filter(n => n.type === 'code');
       expect(codeBlocks).toHaveLength(1);
     });
   });
   ```

3. Run tests
   ```bash
   cd packages/compiler
   pnpm test
   ```

**Validation:**
- [ ] Basic markdown parsing works
- [ ] All tests pass
- [ ] AST structure is correct

---

#### Task 2.2: Add Attribute Parsing
**Priority:** P0 (Critical)  
**Estimated Time:** 4 hours

**Steps:**
1. Create packages/compiler/src/parser/attributes.ts
   ```typescript
   import { visit } from 'unist-util-visit';
   import { Root, Node } from 'mdast';

   interface NodeWithData extends Node {
     data?: {
       hProperties?: Record<string, any>;
     };
   }

   /**
    * Extract class attributes from directive labels/text
    * Supports syntax: {.class-name .another-class}
    */
   export function extractAttributes(text: string): string[] {
     const match = text.match(/\{([^}]+)\}/);
     if (!match) return [];

     const content = match[1];
     const classes = content
       .split(/\s+/)
       .filter(c => c.startsWith('.'))
       .map(c => c.slice(1));

     return classes;
   }

   /**
    * Remove attribute syntax from text
    */
   export function removeAttributeSyntax(text: string): string {
     return text.replace(/\s*\{[^}]+\}\s*$/g, '').trim();
   }

   /**
    * Unified plugin to parse and attach attributes to nodes
    */
   export function remarkAttributes() {
     return (tree: Root) => {
       visit(tree, (node: NodeWithData) => {
         // Handle headings
         if (node.type === 'heading' && (node as any).children) {
           const lastChild = (node as any).children[(node as any).children.length - 1];
           if (lastChild && lastChild.type === 'text') {
             const classes = extractAttributes(lastChild.value);
             if (classes.length > 0) {
               lastChild.value = removeAttributeSyntax(lastChild.value);
               node.data = node.data || {};
               node.data.hProperties = node.data.hProperties || {};
               node.data.hProperties.className = classes;
             }
           }
         }

         // Handle paragraphs
         if (node.type === 'paragraph' && (node as any).children) {
           const lastChild = (node as any).children[(node as any).children.length - 1];
           if (lastChild && lastChild.type === 'text') {
             const classes = extractAttributes(lastChild.value);
             if (classes.length > 0) {
               lastChild.value = removeAttributeSyntax(lastChild.value);
               node.data = node.data || {};
               node.data.hProperties = node.data.hProperties || {};
               node.data.hProperties.className = classes;
             }
           }
         }

         // Handle links
         if (node.type === 'link' && (node as any).children) {
           const lastChild = (node as any).children[(node as any).children.length - 1];
           if (lastChild && lastChild.type === 'text') {
             const classes = extractAttributes(lastChild.value);
             if (classes.length > 0) {
               lastChild.value = removeAttributeSyntax(lastChild.value);
               node.data = node.data || {};
               node.data.hProperties = node.data.hProperties || {};
               node.data.hProperties.className = classes;
             }
           }
         }
       });
     };
   }
   ```

2. Update packages/compiler/src/parser/index.ts to include attribute parsing
   ```typescript
   import { unified } from 'unified';
   import remarkParse from 'remark-parse';
   import remarkDirective from 'remark-directive';
   import remarkGfm from 'remark-gfm';
   import { Root } from 'mdast';
   import { remarkAttributes } from './attributes';

   export interface ParseOptions {
     filename?: string;
   }

   /**
    * Parse Taildown/Markdown source into an AST
    */
   export async function parse(source: string, options: ParseOptions = {}): Promise<Root> {
     const processor = unified()
       .use(remarkParse)
       .use(remarkGfm)
       .use(remarkDirective)
       .use(remarkAttributes);

     const file = await processor.parse(source);
     return file as Root;
   }
   ```

3. Create packages/compiler/src/parser/attributes.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { extractAttributes, removeAttributeSyntax } from './attributes';

   describe('Attribute Parsing', () => {
     it('should extract single class', () => {
       const text = 'Hello {.text-blue-600}';
       const classes = extractAttributes(text);
       expect(classes).toEqual(['text-blue-600']);
     });

     it('should extract multiple classes', () => {
       const text = 'Hello {.text-blue-600 .font-bold .text-4xl}';
       const classes = extractAttributes(text);
       expect(classes).toEqual(['text-blue-600', 'font-bold', 'text-4xl']);
     });

     it('should return empty array if no attributes', () => {
       const text = 'Hello World';
       const classes = extractAttributes(text);
       expect(classes).toEqual([]);
     });

     it('should remove attribute syntax from text', () => {
       const text = 'Hello World {.class-name}';
       const cleaned = removeAttributeSyntax(text);
       expect(cleaned).toBe('Hello World');
     });

     it('should handle text without attributes', () => {
       const text = 'Hello World';
       const cleaned = removeAttributeSyntax(text);
       expect(cleaned).toBe('Hello World');
     });
   });
   ```

**Validation:**
- [ ] Attribute extraction works
- [ ] Classes are correctly parsed
- [ ] Text cleanup works
- [ ] Tests pass

---

### Day 8-9: Component Block Parser

#### Task 2.3: Parse Component Blocks
**Priority:** P0 (Critical)  
**Estimated Time:** 5 hours

**Steps:**
1. Create packages/compiler/src/parser/components.ts
   ```typescript
   import { visit } from 'unist-util-visit';
   import { Root } from 'mdast';
   import { extractAttributes } from './attributes';

   interface ContainerDirective {
     type: 'containerDirective';
     name: string;
     attributes?: Record<string, any>;
     children: any[];
     data?: any;
   }

   /**
    * Unified plugin to handle component blocks (:::component)
    */
   export function remarkComponents() {
     return (tree: Root) => {
       visit(tree, 'containerDirective', (node: ContainerDirective) => {
         // Component names are taken from the directive name
         const componentName = node.name;

         // Extract classes from attributes if present
         let classes: string[] = [];
         if (node.attributes && node.attributes.class) {
           classes = node.attributes.class.split(/\s+/);
         }

         // Also check for inline class syntax in directive label
         // This is handled by remark-directive automatically

         // Store component metadata
         node.data = node.data || {};
         node.data.hName = 'div';
         node.data.hProperties = {
           className: ['taildown-component', `component-${componentName}`, ...classes],
           'data-component': componentName
         };
       });
     };
   }
   ```

2. Update packages/compiler/src/parser/index.ts
   ```typescript
   import { unified } from 'unified';
   import remarkParse from 'remark-parse';
   import remarkDirective from 'remark-directive';
   import remarkGfm from 'remark-gfm';
   import { Root } from 'mdast';
   import { remarkAttributes } from './attributes';
   import { remarkComponents } from './components';

   export interface ParseOptions {
     filename?: string;
   }

   export async function parse(source: string, options: ParseOptions = {}): Promise<Root> {
     const processor = unified()
       .use(remarkParse)
       .use(remarkGfm)
       .use(remarkDirective)
       .use(remarkAttributes)
       .use(remarkComponents);

     const file = await processor.parse(source);
     return file as Root;
   }
   ```

3. Create packages/compiler/src/parser/components.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { parse } from './index';

   describe('Component Parsing', () => {
     it('should parse card component', async () => {
       const source = ':::card\nCard content\n:::';
       const ast = await parse(source);
       
       // Find container directive
       const hasDirective = ast.children.some(n => n.type === 'containerDirective');
       expect(hasDirective).toBe(true);
     });

     it('should parse nested components', async () => {
       const source = `:::grid
:::card
Content 1
:::
:::card
Content 2
:::
:::`;
       const ast = await parse(source);
       
       // Should have nested structure
       expect(ast.children).toBeDefined();
     });

     it('should parse component with attributes', async () => {
       const source = ':::card{.shadow-xl .rounded-lg}\nContent\n:::';
       const ast = await parse(source);
       
       // Directive should be parsed
       expect(ast.children.length).toBeGreaterThan(0);
     });
   });
   ```

**Validation:**
- [ ] Component blocks are parsed
- [ ] Nested components work
- [ ] Attributes on components work
- [ ] Tests pass

---

### Day 10: Style Resolution

#### Task 2.4: Implement Style Resolver
**Priority:** P0 (Critical)  
**Estimated Time:** 4 hours

**Steps:**
1. Create packages/compiler/src/styles/resolver.ts
   ```typescript
   import { DEFAULT_STYLE_MAPPINGS, DEFAULT_COMPONENT_DEFINITIONS } from '@taildown/shared';
   import type { CompileOptions } from '@taildown/shared';

   export class StyleResolver {
     private styleMappings: Record<string, string>;
     private componentDefinitions: Record<string, any>;

     constructor(options: CompileOptions = {}) {
       this.styleMappings = {
         ...DEFAULT_STYLE_MAPPINGS,
         ...(options.styleMappings || {})
       };
       this.componentDefinitions = {
         ...DEFAULT_COMPONENT_DEFINITIONS,
         ...(options.components || {})
       };
     }

     /**
      * Resolve plain English classes to Tailwind classes
      */
     resolveClasses(classes: string[]): string[] {
       const resolved: string[] = [];

       for (const cls of classes) {
         // Check if it's a shorthand
         if (this.styleMappings[cls]) {
           // Split mapped value into multiple classes
           resolved.push(...this.styleMappings[cls].split(/\s+/));
         } else {
           // Keep as-is (might be a valid Tailwind class)
           resolved.push(cls);
         }
       }

       return resolved;
     }

     /**
      * Get default classes for a component
      */
     getComponentClasses(componentName: string, variant?: string): string[] {
       const definition = this.componentDefinitions[componentName];
       if (!definition) return [];

       const classes = [...definition.defaultClasses];

       if (variant && definition.variants[variant]) {
         classes.push(...definition.variants[variant]);
       }

       return classes;
     }

     /**
      * Merge component defaults with custom classes
      */
     mergeComponentClasses(componentName: string, customClasses: string[]): string[] {
       const defaultClasses = this.getComponentClasses(componentName);
       const resolvedCustom = this.resolveClasses(customClasses);

       // Simple merge - custom classes override defaults
       // In future, implement proper CSS specificity
       return [...defaultClasses, ...resolvedCustom];
     }
   }
   ```

2. Create packages/compiler/src/styles/resolver.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { StyleResolver } from './resolver';

   describe('StyleResolver', () => {
     it('should resolve shorthand classes', () => {
       const resolver = new StyleResolver();
       const classes = resolver.resolveClasses(['primary', 'large', 'bold']);
       
       expect(classes).toContain('text-4xl');
       expect(classes).toContain('font-bold');
     });

     it('should keep unknown classes as-is', () => {
       const resolver = new StyleResolver();
       const classes = resolver.resolveClasses(['custom-class']);
       
       expect(classes).toContain('custom-class');
     });

     it('should get component default classes', () => {
       const resolver = new StyleResolver();
       const classes = resolver.getComponentClasses('card');
       
       expect(classes).toContain('rounded-lg');
       expect(classes).toContain('shadow-md');
     });

     it('should merge component and custom classes', () => {
       const resolver = new StyleResolver();
       const classes = resolver.mergeComponentClasses('card', ['shadow-xl']);
       
       expect(classes.length).toBeGreaterThan(0);
       expect(classes).toContain('shadow-xl');
     });

     it('should support custom style mappings', () => {
       const resolver = new StyleResolver({
         styleMappings: {
           'custom': 'text-custom bg-custom'
         }
       });
       const classes = resolver.resolveClasses(['custom']);
       
       expect(classes).toContain('text-custom');
       expect(classes).toContain('bg-custom');
     });
   });
   ```

**Validation:**
- [ ] Style resolution works
- [ ] Shorthands expand correctly
- [ ] Component defaults apply
- [ ] Tests pass

---

## Week 3: HTML Generation & Rendering

### Day 11-12: HTML Generator

#### Task 3.1: Implement HTML Renderer
**Priority:** P0 (Critical)  
**Estimated Time:** 5 hours

**Steps:**
1. Create packages/compiler/src/renderer/html.ts
   ```typescript
   import { unified } from 'unified';
   import remarkRehype from 'remark-rehype';
   import rehypeStringify from 'rehype-stringify';
   import { Root } from 'mdast';
   import { StyleResolver } from '../styles/resolver';
   import type { CompileOptions } from '@taildown/shared';

   export class HtmlRenderer {
     private styleResolver: StyleResolver;

     constructor(options: CompileOptions = {}) {
       this.styleResolver = new StyleResolver(options);
     }

     /**
      * Convert AST to HTML string
      */
     async render(ast: Root): Promise<string> {
       const processor = unified()
         .use(remarkRehype, { allowDangerousHtml: false })
         .use(rehypeStringify);

       const file = await processor.stringify(processor.runSync(ast));
       return String(file);
     }
   }
   ```

2. Create packages/compiler/src/renderer/html.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { parse } from '../parser';
   import { HtmlRenderer } from './html';

   describe('HTML Renderer', () => {
     it('should render basic markdown to HTML', async () => {
       const source = '# Hello World';
       const ast = await parse(source);
       const renderer = new HtmlRenderer();
       const html = await renderer.render(ast);
       
       expect(html).toContain('<h1');
       expect(html).toContain('Hello World');
     });

     it('should render paragraphs', async () => {
       const source = 'This is a paragraph.';
       const ast = await parse(source);
       const renderer = new HtmlRenderer();
       const html = await renderer.render(ast);
       
       expect(html).toContain('<p>');
       expect(html).toContain('This is a paragraph');
     });

     it('should render lists', async () => {
       const source = '- Item 1\n- Item 2';
       const ast = await parse(source);
       const renderer = new HtmlRenderer();
       const html = await renderer.render(ast);
       
       expect(html).toContain('<ul>');
       expect(html).toContain('<li>');
     });

     it('should render code blocks', async () => {
       const source = '```javascript\nconsole.log("hi");\n```';
       const ast = await parse(source);
       const renderer = new HtmlRenderer();
       const html = await renderer.render(ast);
       
       expect(html).toContain('<code>');
     });
   });
   ```

**Validation:**
- [ ] Basic HTML rendering works
- [ ] Semantic HTML5 tags used
- [ ] Tests pass

---

#### Task 3.2: CSS Generator
**Priority:** P0 (Critical)  
**Estimated Time:** 4 hours

**Steps:**
1. Create packages/compiler/src/renderer/css.ts
   ```typescript
   import { visit } from 'unist-util-visit';
   import { Root } from 'mdast';

   export class CssGenerator {
     private collectedClasses: Set<string> = new Set();

     /**
      * Collect all classes used in the document
      */
     collectClasses(ast: Root): void {
       visit(ast, (node: any) => {
         if (node.data?.hProperties?.className) {
           const classes = Array.isArray(node.data.hProperties.className)
             ? node.data.hProperties.className
             : [node.data.hProperties.className];
           
           classes.forEach(cls => this.collectedClasses.add(cls));
         }
       });
     }

     /**
      * Generate CSS for collected classes
      * For Phase 1, we'll generate basic CSS
      * In future phases, integrate with Tailwind
      */
     generateCss(): string {
       const classes = Array.from(this.collectedClasses);
       
       // Basic CSS generation (placeholder)
       // In Phase 2, this will use Tailwind CSS or generate proper styles
       const css = `
/* Taildown Generated Styles */

/* Base styles */
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  line-height: 1.6;
  color: #333;
  margin: 0;
  padding: 0;
}

/* Component styles */
.taildown-component {
  display: block;
}

.component-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1rem;
}

.component-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.component-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Utility classes */
.text-center { text-align: center; }
.font-bold { font-weight: 700; }
.text-4xl { font-size: 2.25rem; }
.text-2xl { font-size: 1.5rem; }
.text-xl { font-size: 1.25rem; }
.rounded-lg { border-radius: 0.5rem; }
.shadow-md { box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
.shadow-xl { box-shadow: 0 20px 25px rgba(0,0,0,0.15); }
.p-6 { padding: 1.5rem; }
.my-4 { margin-top: 1rem; margin-bottom: 1rem; }
.mx-auto { margin-left: auto; margin-right: auto; }

/* Used classes: ${classes.join(', ')} */
`.trim();

       return css;
     }

     /**
      * Reset collected classes
      */
     reset(): void {
       this.collectedClasses.clear();
     }
   }
   ```

2. Create packages/compiler/src/renderer/css.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { parse } from '../parser';
   import { CssGenerator } from './css';

   describe('CSS Generator', () => {
     it('should collect classes from AST', async () => {
       const source = '# Hello {.text-blue-600}';
       const ast = await parse(source);
       const generator = new CssGenerator();
       generator.collectClasses(ast);
       
       const css = generator.generateCss();
       expect(css).toBeDefined();
       expect(css.length).toBeGreaterThan(0);
     });

     it('should generate base styles', () => {
       const generator = new CssGenerator();
       const css = generator.generateCss();
       
       expect(css).toContain('body {');
       expect(css).toContain('font-family');
     });

     it('should generate component styles', () => {
       const generator = new CssGenerator();
       const css = generator.generateCss();
       
       expect(css).toContain('.component-card');
       expect(css).toContain('.component-grid');
     });
   });
   ```

**Validation:**
- [ ] CSS generation works
- [ ] Base styles included
- [ ] Component styles included
- [ ] Tests pass

---

### Day 13-14: Compiler Integration

#### Task 3.3: Main Compiler API
**Priority:** P0 (Critical)  
**Estimated Time:** 4 hours

**Steps:**
1. Create packages/compiler/src/index.ts
   ```typescript
   import { parse } from './parser';
   import { HtmlRenderer } from './renderer/html';
   import { CssGenerator } from './renderer/css';
   import type { CompileOptions, CompileResult } from '@taildown/shared';

   /**
    * Compile Taildown source to HTML and CSS
    */
   export async function compile(
     source: string,
     options: CompileOptions = {}
   ): Promise<CompileResult> {
     const startTime = Date.now();

     try {
       // Parse source to AST
       const ast = await parse(source, {
         filename: options.filename
       });

       // Generate CSS
       const cssGenerator = new CssGenerator();
       cssGenerator.collectClasses(ast);
       const css = cssGenerator.generateCss();

       // Render HTML
       const htmlRenderer = new HtmlRenderer(options);
       const html = await htmlRenderer.render(ast);

       // Calculate metadata
       const compileTime = Date.now() - startTime;
       const nodeCount = countNodes(ast);

       return {
         html,
         css,
         metadata: {
           compileTime,
           nodeCount,
           warnings: []
         }
       };
     } catch (error) {
       throw new Error(`Compilation failed: ${error.message}`);
     }
   }

   /**
    * Count nodes in AST (for metadata)
    */
   function countNodes(node: any): number {
     let count = 1;
     if (node.children) {
       for (const child of node.children) {
         count += countNodes(child);
       }
     }
     return count;
   }

   // Re-export types
   export type { CompileOptions, CompileResult } from '@taildown/shared';
   ```

2. Create packages/compiler/src/index.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { compile } from './index';

   describe('Compiler', () => {
     it('should compile basic markdown', async () => {
       const source = '# Hello World\n\nThis is a test.';
       const result = await compile(source);
       
       expect(result.html).toBeDefined();
       expect(result.css).toBeDefined();
       expect(result.html).toContain('Hello World');
     });

     it('should include metadata', async () => {
       const source = '# Test';
       const result = await compile(source);
       
       expect(result.metadata).toBeDefined();
       expect(result.metadata.compileTime).toBeGreaterThan(0);
       expect(result.metadata.nodeCount).toBeGreaterThan(0);
     });

     it('should compile in under 100ms for simple docs', async () => {
       const source = '# Test\n\nSimple document.';
       const result = await compile(source);
       
       expect(result.metadata.compileTime).toBeLessThan(100);
     });

     it('should compile with attributes', async () => {
       const source = '# Hello {.text-blue-600}';
       const result = await compile(source);
       
       expect(result.html).toContain('text-blue-600');
     });

     it('should compile with components', async () => {
       const source = ':::card\nContent\n:::';
       const result = await compile(source);
       
       expect(result.html).toContain('component-card');
       expect(result.css).toContain('.component-card');
     });
   });
   ```

3. Run all compiler tests
   ```bash
   cd packages/compiler
   pnpm test
   ```

**Validation:**
- [ ] Compilation works end-to-end
- [ ] HTML and CSS generated
- [ ] Metadata included
- [ ] Performance meets target (<100ms)
- [ ] All tests pass

---

#### Task 3.4: Build Compiler Package
**Priority:** P0 (Critical)  
**Estimated Time:** 1 hour

**Steps:**
1. Build the compiler
   ```bash
   cd packages/compiler
   pnpm build
   ```

2. Verify exports
   ```bash
   node -e "import('@taildown/compiler').then(m => console.log(m))"
   ```

**Validation:**
- [ ] Build succeeds
- [ ] Exports are accessible
- [ ] Type definitions generated

---

## Week 4: CLI Tool & Examples

### Day 15-16: CLI Implementation

#### Task 4.1: Create CLI Tool
**Priority:** P0 (Critical)  
**Estimated Time:** 4 hours

**Steps:**
1. Create packages/cli/src/index.ts
   ```typescript
   #!/usr/bin/env node

   import { Command } from 'commander';
   import { readFile, writeFile } from 'fs/promises';
   import { resolve } from 'path';
   import chalk from 'chalk';
   import ora from 'ora';
   import { compile } from '@taildown/compiler';

   const program = new Command();

   program
     .name('taildown')
     .description('Taildown compiler - Markdown with Tailwind styling')
     .version('0.1.0');

   program
     .command('compile')
     .description('Compile a Taildown file to HTML')
     .argument('<input>', 'Input .tdown or .md file')
     .option('-o, --output <file>', 'Output HTML file')
     .option('--css <file>', 'Output CSS file')
     .option('--inline', 'Inline CSS in HTML')
     .option('--minify', 'Minify output')
     .action(async (input, options) => {
       const spinner = ora('Compiling...').start();

       try {
         // Read input file
         const inputPath = resolve(input);
         const source = await readFile(inputPath, 'utf-8');

         // Compile
         const result = await compile(source, {
           inlineStyles: options.inline,
           minify: options.minify
         });

         // Determine output paths
         const outputPath = options.output || input.replace(/\.(tdown|md)$/, '.html');
         const cssPath = options.css || input.replace(/\.(tdown|md)$/, '.css');

         // Write HTML
         let htmlContent = result.html;
         if (options.inline) {
           htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Taildown Output</title>
  <style>${result.css}</style>
</head>
<body>
${result.html}
</body>
</html>`;
         } else {
           htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Taildown Output</title>
  <link rel="stylesheet" href="${cssPath}">
</head>
<body>
${result.html}
</body>
</html>`;
         }

         await writeFile(outputPath, htmlContent, 'utf-8');

         // Write CSS if not inline
         if (!options.inline) {
           await writeFile(cssPath, result.css, 'utf-8');
         }

         spinner.succeed(chalk.green('Compilation successful!'));
         console.log(chalk.blue(`  HTML: ${outputPath}`));
         if (!options.inline) {
           console.log(chalk.blue(`  CSS:  ${cssPath}`));
         }
         console.log(chalk.gray(`  Time: ${result.metadata.compileTime}ms`));
         console.log(chalk.gray(`  Nodes: ${result.metadata.nodeCount}`));

       } catch (error) {
         spinner.fail(chalk.red('Compilation failed'));
         console.error(chalk.red(error.message));
         process.exit(1);
       }
     });

   program
     .command('watch')
     .description('Watch a file and recompile on changes')
     .argument('<input>', 'Input file to watch')
     .option('-o, --output <file>', 'Output HTML file')
     .action(async (input, options) => {
       console.log(chalk.yellow('Watch mode - coming in future release'));
       console.log(chalk.gray('For now, use: nodemon --exec "taildown compile" ' + input));
     });

   program.parse();
   ```

2. Add shebang and make executable
   ```bash
   chmod +x packages/cli/src/index.ts
   ```

3. Update packages/cli/tsup.config.ts (create if doesn't exist)
   ```typescript
   import { defineConfig } from 'tsup';

   export default defineConfig({
     entry: ['src/index.ts'],
     format: ['esm'],
     dts: true,
     clean: true,
     banner: {
       js: '#!/usr/bin/env node'
     }
   });
   ```

4. Build CLI
   ```bash
   cd packages/cli
   pnpm build
   ```

5. Test CLI locally
   ```bash
   node dist/index.js --help
   ```

**Validation:**
- [ ] CLI builds successfully
- [ ] Help text displays
- [ ] Commands are recognized

---

### Day 17-18: Example Documents

#### Task 4.2: Create Example Documents
**Priority:** P1 (High)  
**Estimated Time:** 5 hours

**Steps:**
1. Create examples/01-basic.tdown
   ```taildown
   # Hello Taildown {.text-4xl .font-bold .text-center}

   This is a basic example of Taildown syntax. It's just like Markdown, but with styling superpowers.

   ## Features {.text-2xl .font-semibold}

   - **Easy to write**: Just Markdown with classes
   - **Beautiful output**: Styled with Tailwind CSS
   - **Fast compilation**: Sub-100ms for most documents

   ## Try it yourself

   Compile this file with:

   ```bash
   taildown compile 01-basic.tdown
   ```
   ```

2. Create examples/02-components.tdown
   ```taildown
   # Component Examples {.text-4xl .bold .center}

   This example demonstrates Taildown component blocks.

   :::card
   ## Card Component

   This is a card with default styling. It has rounded corners, shadow, and padding automatically applied.
   :::

   :::grid
   :::card
   ### Card 1
   First card in a grid
   :::

   :::card
   ### Card 2
   Second card in a grid
   :::

   :::card
   ### Card 3
   Third card in a grid
   :::
   :::
   ```

3. Create examples/03-styled.tdown
   ```taildown
   # Styled Document {.text-5xl .bold .center}

   ## Plain English Styling {.text-3xl .center}

   This heading uses plain English style classes that get converted to Tailwind classes.

   [Click Me](#){.button .primary} [Learn More](#){.button .secondary}

   :::card {.elevated .rounded}
   ### Elevated Card

   This card has custom styling applied through attributes.
   :::
   ```

4. Create examples/04-landing-page.tdown
   ```taildown
   # Welcome to Taildown {.text-6xl .bold .center}

   ## The markup language for beautiful web design {.text-2xl .center}

   :::container
   :::grid
   :::card
   ### 🚀 Fast
   Compile documents in milliseconds
   :::

   :::card
   ### 🎨 Beautiful
   Production-ready styles out of the box
   :::

   :::card
   ### 📝 Simple
   Just Markdown with styling classes
   :::
   :::
   :::

   ## Get Started

   1. Install Taildown
   2. Write your first document
   3. Compile to HTML
   4. Deploy anywhere

   [Get Started](#){.button .primary .large}
   ```

5. Create examples/05-documentation.tdown
   ```taildown
   # API Documentation {.text-4xl .bold}

   ## Installation

   ```bash
   npm install @taildown/compiler
   ```

   ## Basic Usage

   ```typescript
   import { compile } from '@taildown/compiler';

   const result = await compile(source);
   console.log(result.html);
   ```

   ## API Reference

   ### `compile(source, options)`

   Compiles Taildown source to HTML and CSS.

   **Parameters:**
   - `source` (string): The Taildown source code
   - `options` (CompileOptions): Optional compilation options

   **Returns:** Promise<CompileResult>

   :::card
   **Example:**

   ```typescript
   const result = await compile('# Hello', {
     inlineStyles: true,
     minify: false
   });
   ```
   :::
   ```

6. Create examples/06-blog-post.tdown
   ```taildown
   # Introducing Taildown {.text-5xl .bold}

   **Published:** October 4, 2025  
   **Author:** The Taildown Team

   ---

   Today we're excited to introduce **Taildown**, a new markup language that combines the simplicity of Markdown with the power of Tailwind CSS.

   ## Why Taildown?

   Writing content for the web shouldn't require complex tooling or deep CSS knowledge. Taildown makes it easy to create beautiful, responsive layouts using plain English.

   :::card {.elevated}
   ### Key Benefits

   - **Familiar Syntax**: If you know Markdown, you already know most of Taildown
   - **No Build Step**: Simple CLI compilation
   - **Static Output**: Pure HTML and CSS, no JavaScript required
   :::

   ## Example

   Here's a simple Taildown document:

   ```taildown
   # My Page {.bold .center}

   :::card
   Content goes here
   :::
   ```

   This compiles to semantic HTML with beautiful styling applied.

   ## Get Involved

   Taildown is open source and we welcome contributions!

   [View on GitHub](#){.button .primary} [Read Docs](#){.button .secondary}
   ```

7. Create examples/07-grid-layout.tdown
   ```taildown
   # Grid Layouts {.text-4xl .bold .center}

   Taildown makes it easy to create responsive grid layouts.

   ## Two Column Grid

   :::grid
   :::card
   ### Left Column
   This is the left side of a two-column layout.
   :::

   :::card
   ### Right Column
   This is the right side of a two-column layout.
   :::
   :::

   ## Three Column Grid

   :::grid
   :::card
   **Feature 1**
   Description here
   :::

   :::card
   **Feature 2**
   Description here
   :::

   :::card
   **Feature 3**
   Description here
   :::
   :::

   ## Mixed Content

   :::grid
   :::card
   ![Placeholder](https://via.placeholder.com/150)
   ### Image Card
   Cards can contain any content
   :::

   :::card
   ### List Card
   - Item 1
   - Item 2
   - Item 3
   :::

   :::card
   ### Text Card
   Just plain text content in a card.
   :::
   :::
   ```

8. Create examples/08-typography.tdown
   ```taildown
   # Typography Examples {.text-5xl .bold}

   ## Heading Styles

   # Heading 1 {.text-6xl}
   ## Heading 2 {.text-5xl}
   ### Heading 3 {.text-4xl}
   #### Heading 4 {.text-3xl}
   ##### Heading 5 {.text-2xl}
   ###### Heading 6 {.text-xl}

   ## Text Styles

   This is **bold text** and this is *italic text*.

   This is a paragraph with `inline code`.

   > This is a blockquote. Use it for important callouts or quotes.

   ## Code Examples

   ```javascript
   // JavaScript code block
   function hello() {
     console.log('Hello Taildown!');
   }
   ```

   ```python
   # Python code block
   def greet(name):
       print(f"Hello {name}!")
   ```

   ## Lists

   **Unordered List:**
   - First item
   - Second item
     - Nested item
     - Another nested item
   - Third item

   **Ordered List:**
   1. First step
   2. Second step
   3. Third step

   ## Links

   [External Link](https://example.com)

   [Styled Link](#){.text-blue-600 .font-bold}
   ```

9. Create examples/09-containers.tdown
   ```taildown
   # Container Examples

   :::container
   ## Contained Content

   This content is inside a container component, which provides:
   - Maximum width constraint
   - Automatic centering
   - Responsive padding

   Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

   :::card
   ### Nested Card

   Cards can be nested inside containers for proper layout structure.
   :::
   :::

   ---

   :::section
   ## Section Component

   Sections provide vertical spacing and can have background colors.

   :::container
   This is a container inside a section - a common pattern for full-width colored sections with constrained content.
   :::
   :::
   ```

10. Create examples/10-complete-page.tdown
    ```taildown
    # My Portfolio {.text-6xl .bold .center}

    ## Full Stack Developer {.text-2xl .center}

    ---

    :::container
    ## About Me

    Hi! I'm a developer passionate about building beautiful web experiences. I specialize in TypeScript, React, and modern web technologies.

    :::grid
    :::card
    ### 💻 Skills
    - TypeScript/JavaScript
    - React & Next.js
    - Node.js
    - Tailwind CSS
    :::

    :::card
    ### 🎓 Experience
    - 5+ years development
    - Open source contributor
    - Technical writer
    :::

    :::card
    ### 🌟 Interests
    - Web performance
    - Developer tools
    - UI/UX design
    :::
    :::

    ## Featured Projects

    :::card {.elevated}
    ### Taildown
    A markup language for beautiful web design
    
    [View Project](#){.button .primary}
    :::

    :::card {.elevated}
    ### Project Two
    Another amazing project
    
    [View Project](#){.button .primary}
    :::

    ## Get in Touch

    Want to work together? Reach out!

    [Email Me](#){.button .primary} [LinkedIn](#){.button .secondary} [GitHub](#){.button .secondary}
    :::

    ---

    **© 2025 My Portfolio. Built with Taildown.**
    ```

11. Create examples/README.md
    ```markdown
    # Taildown Examples

    This directory contains example Taildown documents demonstrating various features.

    ## Examples

    1. **01-basic.tdown** - Basic Markdown with inline styles
    2. **02-components.tdown** - Component blocks (cards, grids)
    3. **03-styled.tdown** - Plain English styling
    4. **04-landing-page.tdown** - Simple landing page
    5. **05-documentation.tdown** - API documentation
    6. **06-blog-post.tdown** - Blog post layout
    7. **07-grid-layout.tdown** - Grid layouts
    8. **08-typography.tdown** - Typography examples
    9. **09-containers.tdown** - Container components
    10. **10-complete-page.tdown** - Complete portfolio page

    ## Compiling Examples

    To compile any example:

    ```bash
    taildown compile examples/01-basic.tdown
    ```

    To compile with inline CSS:

    ```bash
    taildown compile examples/01-basic.tdown --inline
    ```

    ## Viewing Output

    After compilation, open the generated HTML file in your browser to see the result.
    ```

**Validation:**
- [ ] 10 example files created
- [ ] Examples demonstrate all features
- [ ] README explains examples

---

### Day 19: Documentation

#### Task 4.3: Create Documentation
**Priority:** P1 (High)  
**Estimated Time:** 4 hours

**Steps:**
1. Update root README.md
   ```markdown
   # Taildown

   **A markup language for beautiful web design**

   Taildown extends Markdown with Tailwind CSS-inspired styling, making it easy to create beautiful, responsive layouts using plain English commands.

   ## Features

   - 📝 **Markdown Compatible**: Standard Markdown works without modification
   - 🎨 **Tailwind-Inspired**: Use Tailwind CSS classes or plain English shorthands
   - 🧩 **Component System**: Pre-built components (cards, grids, containers)
   - ⚡ **Fast Compilation**: Sub-100ms compile times
   - 🎯 **Static Output**: Pure HTML/CSS, no JavaScript runtime
   - 🔧 **Zero Config**: Beautiful defaults out of the box

   ## Quick Start

   ### Installation

   ```bash
   npm install -g @taildown/cli
   ```

   ### Create Your First Document

   Create a file called `hello.tdown`:

   ```taildown
   # Hello Taildown {.text-4xl .bold .center}

   :::card
   ## Welcome!
   This is your first Taildown document.
   :::
   ```

   ### Compile

   ```bash
   taildown compile hello.tdown
   ```

   Open `hello.html` in your browser to see the result!

   ## Syntax Overview

   ### Inline Styles

   ```taildown
   # Heading {.text-blue-600 .text-4xl .font-bold}

   Paragraph with styles {.text-gray-700 .leading-relaxed}
   ```

   ### Component Blocks

   ```taildown
   :::card
   Card content here
   :::

   :::grid
   :::card
   Column 1
   :::
   :::card
   Column 2
   :::
   :::
   ```

   ### Plain English Styles

   ```taildown
   # Heading {primary large bold center}

   :::card {elevated rounded padded}
   Content here
   :::
   ```

   ## Documentation

   - [Syntax Guide](docs/syntax.md)
   - [Component Reference](docs/components.md)
   - [CLI Usage](docs/cli.md)
   - [API Reference](docs/api.md)

   ## Examples

   Check out the [examples](examples/) directory for complete examples including:
   - Landing pages
   - Documentation sites
   - Blog posts
   - Portfolio pages

   ## Development

   This is a monorepo managed with pnpm workspaces.

   ```bash
   # Install dependencies
   pnpm install

   # Build all packages
   pnpm build

   # Run tests
   pnpm test

   # Type check
   pnpm typecheck
   ```

   ### Packages

   - **@taildown/compiler** - Core compilation engine
   - **@taildown/cli** - Command-line interface
   - **@taildown/shared** - Shared types and utilities

   ## Roadmap

   - ✅ Phase 1: Foundation (Current)
     - Basic parser
     - HTML/CSS generation
     - CLI tool
   - ⬜ Phase 2: Component System
     - Full component library
     - Icon integration
     - Configuration system
   - ⬜ Phase 3: Editor
     - VS Code extension
     - Live preview
     - Autocomplete
   - ⬜ Phase 4: Enhancement
     - Performance optimization
     - Plugin system
     - Standalone editor

   ## Contributing

   Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details.

   ## License

   MIT © 2025 Taildown Team

   ## Support

   - [GitHub Issues](https://github.com/taildown/taildown/issues)
   - [Discord Community](#) (Coming soon)
   - [Documentation Site](#) (Coming soon)
   ```

2. Create docs/syntax.md (basic version)
   ```markdown
   # Taildown Syntax Guide

   Taildown extends Markdown with styling and component syntax.

   ## Inline Styles

   Add styles to any element using curly braces:

   ```taildown
   # Heading {.class-name .another-class}
   ```

   ## Component Blocks

   Create component blocks using triple colons:

   ```taildown
   :::component-name
   Content here
   :::
   ```

   ## Supported Components

   - `card` - Card container with padding and shadow
   - `grid` - Responsive grid layout
   - `container` - Max-width container with auto-centering

   ## More Documentation Coming Soon

   Phase 1 focuses on core functionality. Full documentation will be added in Phase 2.
   ```

3. Create CONTRIBUTING.md (basic version)
   ```markdown
   # Contributing to Taildown

   Thank you for your interest in contributing!

   ## Development Setup

   1. Clone the repository
   2. Install dependencies: `pnpm install`
   3. Build packages: `pnpm build`
   4. Run tests: `pnpm test`

   ## Pull Request Process

   1. Fork the repository
   2. Create a feature branch
   3. Make your changes
   4. Add tests
   5. Ensure all tests pass
   6. Submit a pull request

   ## Code Style

   - TypeScript with strict mode
   - Prettier for formatting
   - ESLint for linting

   ## Questions?

   Open an issue or start a discussion!
   ```

**Validation:**
- [ ] README is comprehensive
- [ ] Basic documentation created
- [ ] Contributing guide added

---

### Day 20: Testing & Polish

#### Task 4.4: Integration Tests
**Priority:** P0 (Critical)  
**Estimated Time:** 4 hours

**Steps:**
1. Create packages/compiler/src/integration.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { readFile } from 'fs/promises';
   import { compile } from './index';
   import { resolve } from 'path';

   describe('Integration Tests', () => {
     it('should compile complete example document', async () => {
       // This test will fail until examples are in place
       // Just verify the compilation process works end-to-end
       const source = `
# Test Document {.text-4xl .bold}

## Introduction

This is a test document with multiple features.

:::card
### Card Component
This is inside a card.
:::

:::grid
:::card
Grid Item 1
:::
:::card
Grid Item 2
:::
:::

## Conclusion

Testing complete!
       `.trim();

       const result = await compile(source);

       expect(result.html).toContain('Test Document');
       expect(result.html).toContain('card');
       expect(result.css).toContain('.component-card');
       expect(result.metadata.compileTime).toBeLessThan(100);
     });

     it('should handle empty document', async () => {
       const result = await compile('');
       expect(result.html).toBeDefined();
       expect(result.css).toBeDefined();
     });

     it('should handle document with only markdown', async () => {
       const source = '# Hello\n\nJust plain markdown.';
       const result = await compile(source);
       
       expect(result.html).toContain('Hello');
       expect(result.html).toContain('plain markdown');
     });

     it('should handle complex nesting', async () => {
       const source = `
:::container
# Title

:::grid
:::card
## Card 1
Content
:::

:::card
## Card 2
More content
:::
:::
:::
       `.trim();

       const result = await compile(source);
       expect(result.html).toContain('component-container');
       expect(result.html).toContain('component-grid');
       expect(result.html).toContain('component-card');
     });
   });
   ```

2. Run all tests across all packages
   ```bash
   pnpm test
   ```

**Validation:**
- [ ] Integration tests pass
- [ ] All packages tested
- [ ] Coverage >80%

---

#### Task 4.5: Performance Testing
**Priority:** P1 (High)  
**Estimated Time:** 2 hours

**Steps:**
1. Create packages/compiler/src/performance.test.ts
   ```typescript
   import { describe, it, expect } from 'vitest';
   import { compile } from './index';

   describe('Performance Tests', () => {
     it('should compile simple document in <100ms', async () => {
       const source = '# Hello\n\nThis is a simple document.';
       const start = Date.now();
       await compile(source);
       const duration = Date.now() - start;
       
       expect(duration).toBeLessThan(100);
     });

     it('should compile medium document in <100ms', async () => {
       // Generate a document with ~50 elements
       const sections = Array.from({ length: 10 }, (_, i) => `
## Section ${i + 1}

This is paragraph ${i + 1} with some content.

- List item 1
- List item 2
- List item 3
       `).join('\n');

       const start = Date.now();
       await compile(sections);
       const duration = Date.now() - start;
       
       expect(duration).toBeLessThan(100);
     });

     it('should handle large document efficiently', async () => {
       // Generate a large document
       const sections = Array.from({ length: 100 }, (_, i) => `
## Section ${i + 1}
Content for section ${i + 1}.
       `).join('\n');

       const start = Date.now();
       const result = await compile(sections);
       const duration = Date.now() - start;
       
       // Large documents might take longer, but should still be reasonable
       expect(duration).toBeLessThan(500);
       expect(result.metadata.compileTime).toBeLessThan(500);
     });
   });
   ```

2. Run performance tests
   ```bash
   cd packages/compiler
   pnpm test performance.test.ts
   ```

**Validation:**
- [ ] Performance targets met
- [ ] No memory leaks
- [ ] Compile times logged

---

#### Task 4.6: Final Polish
**Priority:** P2 (Medium)  
**Estimated Time:** 3 hours

**Steps:**
1. Run full test suite
   ```bash
   pnpm test
   ```

2. Generate coverage report
   ```bash
   pnpm test -- --coverage
   ```

3. Build all packages
   ```bash
   pnpm build
   ```

4. Test CLI with all examples
   ```bash
   for file in examples/*.tdown; do
     ./packages/cli/dist/index.js compile "$file" --inline
   done
   ```

5. Review and fix any TypeScript errors
   ```bash
   pnpm typecheck
   ```

6. Format all code
   ```bash
   pnpm format
   ```

7. Run linter
   ```bash
   pnpm lint
   ```

**Validation:**
- [ ] All tests pass
- [ ] Coverage >80%
- [ ] All examples compile
- [ ] No TypeScript errors
- [ ] Code formatted
- [ ] Linter passes

---

## Phase 1 Completion Checklist

### Core Deliverables
- [ ] ✅ Basic parser implemented
- [ ] ✅ Inline style attributes working
- [ ] ✅ Component blocks working
- [ ] ✅ HTML generation working
- [ ] ✅ CSS generation working
- [ ] ✅ CLI tool functional
- [ ] ✅ 10 example documents created

### Technical Requirements
- [ ] ✅ TypeScript setup complete
- [ ] ✅ Monorepo structure working
- [ ] ✅ All packages build successfully
- [ ] ✅ Test suite with >80% coverage
- [ ] ✅ CI/CD pipeline functional

### Success Criteria
- [ ] ✅ Standard Markdown parses correctly
- [ ] ✅ Inline style attributes work
- [ ] ✅ Component blocks render
- [ ] ✅ Semantic HTML5 generated
- [ ] ✅ Sample documents compile in <100ms
- [ ] ✅ All tests passing

### Documentation
- [ ] ✅ README.md complete
- [ ] ✅ Basic syntax guide
- [ ] ✅ Examples documented
- [ ] ✅ Contributing guide
- [ ] ✅ Code comments added

---

## Next Steps (Phase 2 Preview)

After Phase 1 completion, Phase 2 will focus on:

1. **Full Component Library**
   - 15+ pre-built components
   - Variant system
   - Component documentation

2. **Icon System**
   - Lucide icon integration
   - Icon search/browser
   - SVG optimization

3. **Style System Enhancement**
   - Better Tailwind integration
   - Style conflict resolution
   - Responsive utilities

4. **Configuration System**
   - taildown.config.js support
   - Custom themes
   - Component customization

5. **Documentation Site**
   - Interactive examples
   - Live playground
   - API reference

---

## Troubleshooting

### Common Issues

**Issue:** `pnpm install` fails
- **Solution:** Ensure Node.js 18+ is installed
- **Solution:** Clear pnpm cache: `pnpm store prune`

**Issue:** Tests failing
- **Solution:** Rebuild packages: `pnpm build`
- **Solution:** Clear dist folders and rebuild

**Issue:** CLI not found
- **Solution:** Link CLI locally: `cd packages/cli && pnpm link --global`

**Issue:** TypeScript errors
- **Solution:** Run `pnpm typecheck` to see all errors
- **Solution:** Ensure all dependencies are installed

---

## Time Tracking

| Week | Days | Focus Area | Hours |
|------|------|------------|-------|
| 1 | 1-2 | Project setup | 16 |
| 1 | 3 | CI/CD | 8 |
| 1 | 4-5 | Core types | 16 |
| 2 | 6-7 | Parser foundation | 24 |
| 2 | 8-9 | Components | 16 |
| 2 | 10 | Style resolver | 16 |
| 3 | 11-12 | HTML renderer | 20 |
| 3 | 13-14 | Compiler integration | 16 |
| 4 | 15-16 | CLI tool | 16 |
| 4 | 17-18 | Examples | 20 |
| 4 | 19 | Documentation | 16 |
| 4 | 20 | Testing & polish | 16 |
| **Total** | **20 days** | | **~200 hours** |

---

## Success Metrics

At the end of Phase 1, we should have:

- ✅ Working compiler that processes Taildown → HTML/CSS
- ✅ CLI tool that can compile files
- ✅ 10 example documents demonstrating features
- ✅ Test coverage >80%
- ✅ Compile times <100ms for typical documents
- ✅ Documentation explaining basic usage
- ✅ CI/CD pipeline running tests
- ✅ All packages publishing correctly

---

**End of Phase 1 Implementation Plan**
