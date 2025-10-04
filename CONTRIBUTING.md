# Contributing to Taildown

Thank you for your interest in contributing to Taildown! This document provides guidelines and information for contributors.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Contributing Syntax Changes](#contributing-syntax-changes)
5. [Contributing Code](#contributing-code)
6. [Contributing Documentation](#contributing-documentation)
7. [Contributing Tests](#contributing-tests)
8. [Pull Request Process](#pull-request-process)
9. [Code Style](#code-style)
10. [Community](#community)

---

## Code of Conduct

Taildown is committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, constructive, and professional in all interactions.

---

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **pnpm** package manager
- **Git** for version control

### Development Setup

1. **Fork the repository** on GitHub

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/taildown.git
   cd taildown
   ```

3. **Install dependencies**
   ```bash
   pnpm install
   ```

4. **Build packages**
   ```bash
   pnpm build
   ```

5. **Run tests**
   ```bash
   pnpm test
   ```

6. **Verify everything works**
   ```bash
   pnpm typecheck
   ```

---

## Development Workflow

### Branch Strategy

- **`main`** - Stable release branch
- **`develop`** - Integration branch for next release
- **`feature/*`** - Feature branches
- **`fix/*`** - Bug fix branches
- **`docs/*`** - Documentation branches

### Creating a Feature Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### Making Changes

```bash
# Make your changes
git add .
git commit -m "feat: add amazing feature"
git push origin feature/your-feature-name
```

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `refactor`: Code refactoring
- `perf`: Performance improvement
- `chore`: Maintenance tasks

**Examples:**
```
feat(parser): add support for image attributes
fix(compiler): handle empty component blocks
docs(syntax): clarify attribute positioning rules
test(syntax): add edge case tests for nested components
```

---

## Contributing Syntax Changes

**⚠️ Important**: Syntax changes follow a special process defined in [`SYNTAX-CHANGES.md`](SYNTAX-CHANGES.md).

### Quick Summary

1. **Open an RFC Issue** using the syntax RFC template
2. **Discuss with community** for 1-4 weeks depending on change type
3. **Update SYNTAX.md** first (specification-driven development)
4. **Create test fixtures** in `syntax-tests/fixtures/`
5. **Implement in parser** to match specification
6. **Update documentation** to reflect changes
7. **Submit PR** using syntax change template

### When to Propose a Syntax Change

- **Clarification**: Syntax spec is ambiguous or confusing
- **Addition**: New feature that doesn't break existing documents
- **Breaking Change**: Only if absolutely necessary and well-justified
- **Deprecation**: Phasing out problematic syntax

### Read First

Before proposing syntax changes, please read:
- [`SYNTAX.md`](SYNTAX.md) - Current syntax specification
- [`SYNTAX-CHANGES.md`](SYNTAX-CHANGES.md) - Change management process
- Existing [syntax RFCs](https://github.com/taildown/taildown/labels/syntax)

---

## Contributing Code

### Areas for Contribution

- **Parser**: Implement syntax features, improve performance
- **Renderer**: HTML/CSS generation, optimization
- **Components**: New component types, component system improvements
- **CLI**: New commands, better UX, error messages
- **Testing**: More test coverage, edge cases, integration tests
- **Performance**: Optimization, benchmarking, profiling

### Code Standards

- **TypeScript** with strict mode enabled
- **Prettier** for code formatting (run `pnpm format`)
- **ESLint** for code quality (run `pnpm lint`)
- **Vitest** for testing (run `pnpm test`)
- **Minimum 80%** test coverage for new code

### Testing Requirements

All code contributions must include tests:

```typescript
// Example test structure
describe('Feature Name', () => {
  it('should handle basic case', () => {
    // Test implementation
  });

  it('should handle edge case', () => {
    // Test implementation
  });

  it('should throw error on invalid input', () => {
    // Test implementation
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test -- --watch

# Run tests with coverage
pnpm test -- --coverage

# Run specific test file
pnpm test path/to/test.ts

# Run syntax conformance tests
pnpm test syntax-tests/reference.test.ts
```

---

## Contributing Documentation

### Documentation Types

- **README.md** - User-facing overview and quick start
- **SYNTAX.md** - Canonical syntax specification
- **tech-spec.md** - Technical architecture
- **phase-1-implementation-plan.md** - Implementation guide
- **API documentation** - Coming in Phase 2

### Documentation Standards

- **Clear and concise** language
- **Concrete examples** for all concepts
- **Code samples** that are tested and working
- **Cross-references** between related sections
- **Up-to-date** with current implementation

### Updating Documentation

When code changes affect documentation:

1. Update relevant `.md` files
2. Update code examples if needed
3. Verify all links work
4. Check for consistency across docs
5. Update version history in SYNTAX.md if syntax affected

---

## Contributing Tests

### Test Categories

1. **Unit Tests** - Test individual functions/modules
2. **Integration Tests** - Test component interactions
3. **Syntax Tests** - Canonical syntax conformance tests
4. **Performance Tests** - Benchmarks and performance validation
5. **End-to-End Tests** - Full compilation pipeline

### Adding Syntax Tests

Syntax tests in `syntax-tests/fixtures/` are the executable specification:

```bash
# Create new test directory
mkdir -p syntax-tests/fixtures/02-inline-attributes

# Create input file
cat > syntax-tests/fixtures/02-inline-attributes/04-new-feature.td << 'EOF'
# Test heading {.class}
EOF

# Note: Taildown files use .td (primary), but .tdown and .taildown are also supported

# Create expected AST
cat > syntax-tests/fixtures/02-inline-attributes/04-new-feature.ast.json << 'EOF'
{
  "type": "root",
  "children": [...]
}
EOF
```

Tests must:
- Cover all examples from SYNTAX.md
- Include edge cases
- Have clear, descriptive names
- Match the expected AST format exactly

---

## Pull Request Process

### Before Submitting

- [ ] All tests pass (`pnpm test`)
- [ ] Code is formatted (`pnpm format`)
- [ ] No linting errors (`pnpm lint`)
- [ ] Type checking passes (`pnpm typecheck`)
- [ ] Documentation is updated
- [ ] Commit messages follow convention
- [ ] Branch is up to date with `develop`

### Submitting

1. **Push your branch** to your fork
2. **Open a Pull Request** against `develop` branch
3. **Fill out PR template** completely
4. **Link related issues** (e.g., "Closes #123")
5. **Wait for review** from maintainers

### PR Review Process

- Maintainers will review within 1 week
- Feedback will be provided constructively
- Address feedback and update PR
- Once approved, maintainer will merge

### Approval Requirements

- **Minor changes** (docs, tests): 1 approval
- **Code changes**: 2 approvals
- **Syntax changes**: 2-3 approvals (see SYNTAX-CHANGES.md)
- **All CI checks** must pass

---

## Code Style

### TypeScript

```typescript
// Use explicit types
function compile(source: string, options: CompileOptions): CompileResult {
  // ...
}

// Prefer interfaces over types
interface ComponentDefinition {
  name: string;
  defaultClasses: string[];
}

// Use meaningful variable names
const parsedAST = await parse(source);
const renderedHTML = await render(parsedAST);

// Add JSDoc for public APIs
/**
 * Compile Taildown source to HTML and CSS
 * @param source - Taildown source code
 * @param options - Compilation options
 * @returns Compiled HTML and CSS
 */
export async function compile(source: string, options?: CompileOptions): Promise<CompileResult> {
  // ...
}
```

### File Organization

```
package/
├── src/
│   ├── index.ts           # Public API exports
│   ├── parser/            # Parser implementation
│   │   ├── index.ts       # Parser entry point
│   │   ├── attributes.ts  # Attribute parsing
│   │   └── components.ts  # Component parsing
│   ├── renderer/          # Renderer implementation
│   └── types.ts           # Type definitions
└── package.json
```

### Naming Conventions

- **Files**: `kebab-case.ts`
- **Classes**: `PascalCase`
- **Functions**: `camelCase`
- **Constants**: `UPPER_SNAKE_CASE`
- **Interfaces**: `PascalCase`
- **Types**: `PascalCase`

---

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and general discussion
- **Discord** - Real-time chat (coming soon)
- **Twitter/X** - Announcements (coming soon)

### Getting Help

- Check existing [issues](https://github.com/taildown/taildown/issues)
- Search [discussions](https://github.com/taildown/taildown/discussions)
- Read the documentation
- Ask in Discord (coming soon)

### Reporting Bugs

Use the bug report template and include:
- Taildown version
- Node.js version
- Operating system
- Minimal reproduction example
- Expected vs actual behavior
- Error messages or screenshots

### Requesting Features

Use the feature request template and include:
- Use case and motivation
- Proposed solution
- Alternatives considered
- Willingness to contribute

---

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Acknowledged in documentation (for major contributions)

---

## Questions?

If you have any questions about contributing, please:
- Open a [Discussion](https://github.com/taildown/taildown/discussions)
- Join our Discord (coming soon)
- Email the maintainers (coming soon)

---

**Thank you for contributing to Taildown!** 🎉

Every contribution, no matter how small, helps make Taildown better for everyone.
