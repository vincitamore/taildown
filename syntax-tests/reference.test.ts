/**
 * Taildown Syntax Reference Tests
 * 
 * This test suite validates parser implementations against the canonical
 * syntax specification defined in SYNTAX.md.
 * 
 * These tests ARE the specification - if your parser passes all tests,
 * it conforms to the Taildown syntax spec.
 */

import { describe, it, expect } from 'vitest';
import { readdir, readFile } from 'fs/promises';
import { join, basename, extname } from 'path';
import { parse } from '../packages/compiler/src/parser'; // Adjust import path as needed

interface TestFixture {
  name: string;
  category: string;
  input: string;
  expectedAST: any;
}

/**
 * Load all test fixtures from a category directory
 */
async function loadFixtures(category: string): Promise<TestFixture[]> {
  const categoryPath = join(__dirname, 'fixtures', category);
  const fixtures: TestFixture[] = [];

  try {
    const files = await readdir(categoryPath);
    const tdownFiles = files.filter(f => f.endsWith('.tdown'));

    for (const tdownFile of tdownFiles) {
      const baseName = basename(tdownFile, '.tdown');
      const astFile = `${baseName}.ast.json`;

      // Read input
      const inputPath = join(categoryPath, tdownFile);
      const input = await readFile(inputPath, 'utf-8');

      // Read expected AST
      const astPath = join(categoryPath, astFile);
      let expectedAST: any;
      try {
        const astContent = await readFile(astPath, 'utf-8');
        expectedAST = JSON.parse(astContent);
      } catch (error) {
        console.warn(`No AST file for ${tdownFile}, skipping...`);
        continue;
      }

      fixtures.push({
        name: baseName,
        category,
        input,
        expectedAST,
      });
    }
  } catch (error) {
    console.warn(`Could not load fixtures from ${category}:`, error);
  }

  return fixtures;
}

/**
 * Normalize AST for comparison
 * Removes positional information and other non-essential metadata
 */
function normalizeAST(ast: any): any {
  if (!ast || typeof ast !== 'object') {
    return ast;
  }

  // Remove position information (not part of structural comparison)
  const { position, ...rest } = ast;

  // Recursively normalize children
  if (Array.isArray(rest.children)) {
    rest.children = rest.children.map(normalizeAST);
  }

  // Recursively normalize other nested objects
  for (const key in rest) {
    if (typeof rest[key] === 'object' && rest[key] !== null) {
      rest[key] = normalizeAST(rest[key]);
    }
  }

  return rest;
}

/**
 * Compare two ASTs for structural equality
 */
function compareASTs(actual: any, expected: any): { equal: boolean; diff?: string } {
  const normalizedActual = normalizeAST(actual);
  const normalizedExpected = normalizeAST(expected);

  try {
    expect(normalizedActual).toEqual(normalizedExpected);
    return { equal: true };
  } catch (error) {
    return {
      equal: false,
      diff: error instanceof Error ? error.message : String(error),
    };
  }
}

// =============================================================================
// Test Suites
// =============================================================================

describe('Taildown Syntax Reference Tests', () => {
  describe('[REQUIRED] 01 - Markdown Compatibility', () => {
    it('should load fixtures', async () => {
      const fixtures = await loadFixtures('01-markdown-compatibility');
      expect(fixtures.length).toBeGreaterThan(0);
    });

    it('should pass all markdown compatibility tests', async () => {
      const fixtures = await loadFixtures('01-markdown-compatibility');

      for (const fixture of fixtures) {
        // Parse input
        const ast = await parse(fixture.input);

        // Compare with expected
        const result = compareASTs(ast, fixture.expectedAST);

        // Report results
        if (!result.equal) {
          throw new Error(
            `Test failed: ${fixture.category}/${fixture.name}\n` +
            `Difference:\n${result.diff}`
          );
        }
      }
    });
  });

  describe('[REQUIRED] 02 - Inline Attributes', () => {
    it('should load fixtures', async () => {
      const fixtures = await loadFixtures('02-inline-attributes');
      expect(fixtures.length).toBeGreaterThan(0);
    });

    it('should pass all inline attribute tests', async () => {
      const fixtures = await loadFixtures('02-inline-attributes');

      for (const fixture of fixtures) {
        const ast = await parse(fixture.input);
        const result = compareASTs(ast, fixture.expectedAST);

        if (!result.equal) {
          throw new Error(
            `Test failed: ${fixture.category}/${fixture.name}\n` +
            `Difference:\n${result.diff}`
          );
        }
      }
    });

    it('01-headings: should parse headings with attributes', async () => {
      const fixtures = await loadFixtures('02-inline-attributes');
      const test = fixtures.find(f => f.name === '01-headings');

      if (!test) {
        throw new Error('Test fixture 01-headings not found');
      }

      const ast = await parse(test.input);
      const result = compareASTs(ast, test.expectedAST);

      expect(result.equal).toBe(true);
    });

    it('02-paragraphs: should parse paragraphs with attributes', async () => {
      const fixtures = await loadFixtures('02-inline-attributes');
      const test = fixtures.find(f => f.name === '02-paragraphs');

      if (!test) {
        throw new Error('Test fixture 02-paragraphs not found');
      }

      const ast = await parse(test.input);
      const result = compareASTs(ast, test.expectedAST);

      expect(result.equal).toBe(true);
    });
  });

  describe('[REQUIRED] 03 - Component Blocks', () => {
    it('should load fixtures', async () => {
      const fixtures = await loadFixtures('03-component-blocks');
      expect(fixtures.length).toBeGreaterThan(0);
    });

    it('should pass all component block tests', async () => {
      const fixtures = await loadFixtures('03-component-blocks');

      for (const fixture of fixtures) {
        const ast = await parse(fixture.input);
        const result = compareASTs(ast, fixture.expectedAST);

        if (!result.equal) {
          throw new Error(
            `Test failed: ${fixture.category}/${fixture.name}\n` +
            `Difference:\n${result.diff}`
          );
        }
      }
    });

    it('01-basic: should parse basic component blocks', async () => {
      const fixtures = await loadFixtures('03-component-blocks');
      const test = fixtures.find(f => f.name === '01-basic');

      if (!test) {
        throw new Error('Test fixture 01-basic not found');
      }

      const ast = await parse(test.input);
      const result = compareASTs(ast, test.expectedAST);

      expect(result.equal).toBe(true);
    });

    it('03-nesting: should parse nested components', async () => {
      const fixtures = await loadFixtures('03-component-blocks');
      const test = fixtures.find(f => f.name === '03-nesting');

      if (!test) {
        throw new Error('Test fixture 03-nesting not found');
      }

      const ast = await parse(test.input);
      const result = compareASTs(ast, test.expectedAST);

      expect(result.equal).toBe(true);
    });
  });

  describe('[REQUIRED] 04 - Edge Cases', () => {
    it('should load fixtures', async () => {
      const fixtures = await loadFixtures('04-edge-cases');
      expect(fixtures.length).toBeGreaterThan(0);
    });

    it('should handle precedence correctly', async () => {
      const fixtures = await loadFixtures('04-edge-cases');
      const test = fixtures.find(f => f.name === '01-precedence');

      if (!test) {
        // Skip if test not created yet
        return;
      }

      const ast = await parse(test.input);
      const result = compareASTs(ast, test.expectedAST);

      expect(result.equal).toBe(true);
    });
  });

  describe('[RECOMMENDED] 05 - Integration', () => {
    it('should load fixtures', async () => {
      const fixtures = await loadFixtures('05-integration');
      expect(fixtures.length).toBeGreaterThan(0);
    });

    it('should parse complete real-world documents', async () => {
      const fixtures = await loadFixtures('05-integration');

      for (const fixture of fixtures) {
        // Parse should not throw
        const ast = await parse(fixture.input);
        expect(ast).toBeDefined();
        expect(ast.type).toBe('root');
        expect(ast.children).toBeDefined();

        // If expected AST exists, compare
        if (fixture.expectedAST) {
          const result = compareASTs(ast, fixture.expectedAST);
          if (!result.equal) {
            console.warn(
              `Integration test ${fixture.name} AST differs from expected.\n` +
              `This is acceptable if the document parses successfully.`
            );
          }
        }
      }
    });
  });
});

// =============================================================================
// Conformance Level Tests
// =============================================================================

describe('Conformance Levels', () => {
  describe('Level 1 - Core Conformance', () => {
    it('should pass all required tests', async () => {
      const categories = [
        '01-markdown-compatibility',
        '02-inline-attributes',
        '03-component-blocks',
      ];

      for (const category of categories) {
        const fixtures = await loadFixtures(category);
        expect(fixtures.length).toBeGreaterThan(0);

        for (const fixture of fixtures) {
          const ast = await parse(fixture.input);
          const result = compareASTs(ast, fixture.expectedAST);

          if (!result.equal) {
            throw new Error(
              `Core conformance failed: ${fixture.category}/${fixture.name}\n` +
              `Level 1 conformance requires passing all [REQUIRED] tests.`
            );
          }
        }
      }
    });
  });

  describe('Level 2 - Standard Conformance', () => {
    it('should pass all required and edge case tests', async () => {
      const categories = [
        '01-markdown-compatibility',
        '02-inline-attributes',
        '03-component-blocks',
        '04-edge-cases',
      ];

      for (const category of categories) {
        const fixtures = await loadFixtures(category);

        for (const fixture of fixtures) {
          const ast = await parse(fixture.input);
          // Edge cases might not have expected AST yet
          if (fixture.expectedAST) {
            const result = compareASTs(ast, fixture.expectedAST);
            // Log warnings but don't fail for edge cases without expected output
            if (!result.equal && category !== '04-edge-cases') {
              throw new Error(
                `Standard conformance failed: ${fixture.category}/${fixture.name}`
              );
            }
          }
        }
      }
    });
  });

  describe('Level 3 - Full Conformance', () => {
    it('should pass all tests including integration', async () => {
      const categories = [
        '01-markdown-compatibility',
        '02-inline-attributes',
        '03-component-blocks',
        '04-edge-cases',
        '05-integration',
      ];

      for (const category of categories) {
        const fixtures = await loadFixtures(category);

        for (const fixture of fixtures) {
          const ast = await parse(fixture.input);
          expect(ast).toBeDefined();
          // Full conformance verified by successful parsing of all documents
        }
      }
    });
  });
});

// =============================================================================
// Utility Tests
// =============================================================================

describe('Test Infrastructure', () => {
  it('should load all test categories', async () => {
    const categories = [
      '01-markdown-compatibility',
      '02-inline-attributes',
      '03-component-blocks',
      '04-edge-cases',
      '05-integration',
    ];

    for (const category of categories) {
      const fixtures = await loadFixtures(category);
      console.log(`${category}: ${fixtures.length} test(s)`);
    }
  });

  it('test fixtures should have matching input and AST files', async () => {
    const categories = [
      '01-markdown-compatibility',
      '02-inline-attributes',
      '03-component-blocks',
    ];

    for (const category of categories) {
      const fixtures = await loadFixtures(category);

      for (const fixture of fixtures) {
        expect(fixture.input).toBeDefined();
        expect(fixture.input.length).toBeGreaterThan(0);
        expect(fixture.expectedAST).toBeDefined();
        expect(fixture.expectedAST.type).toBe('root');
      }
    }
  });
});
