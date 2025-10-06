/**
 * Icon Parser Unit Tests
 * Tests icon syntax parsing and attribute resolution
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import { parseIcons } from '../icon-parser';
import type { Root } from 'mdast';
import { DEFAULT_CONFIG } from '../../config/default-config';

// Helper to parse markdown with icon syntax
async function parseWithIcons(markdown: string) {
  const processor = unified()
    .use(remarkParse)
    .use(parseIcons, {
      resolverContext: {
        config: DEFAULT_CONFIG,
        darkMode: false,
      },
    });

  const tree = processor.parse(markdown);
  const result = await processor.run(tree);
  return result;
}

describe('Icon Parser', () => {
  describe('Basic Icon Syntax', () => {
    it('should parse basic icon without attributes', async () => {
      const result = await parseWithIcons(':icon[home]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      expect(iconNodes[0].name).toBe('home');
    });

    it('should parse multiple icons in same text', async () => {
      const result = await parseWithIcons(':icon[home] and :icon[search]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(2);
      expect(iconNodes[0].name).toBe('home');
      expect(iconNodes[1].name).toBe('search');
    });

    it('should parse icons with hyphens in name', async () => {
      const result = await parseWithIcons(':icon[arrow-right]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      expect(iconNodes[0].name).toBe('arrow-right');
    });

    it('should parse icons with numbers in name', async () => {
      const result = await parseWithIcons(':icon[star1]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      expect(iconNodes[0].name).toBe('star1');
    });
  });

  describe('Icon Attributes', () => {
    it('should parse icon with single class', async () => {
      const result = await parseWithIcons(':icon[home]{large}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      expect(iconNodes[0].data.hProperties.className).toContain('text-lg');
    });

    it('should parse icon with multiple classes', async () => {
      const result = await parseWithIcons(':icon[home]{large bold}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      const classes = iconNodes[0].data.hProperties.className;
      expect(classes).toContain('text-lg');
      expect(classes).toContain('font-bold');
    });

    it('should parse icon with direct CSS classes (dot syntax)', async () => {
      const result = await parseWithIcons(':icon[home]{.w-8 .h-8}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      const classes = iconNodes[0].data.hProperties.className;
      expect(classes).toContain('w-8');
      expect(classes).toContain('h-8');
    });

    it('should parse icon with semantic colors', async () => {
      const result = await parseWithIcons(':icon[heart]{primary}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      const classes = iconNodes[0].data.hProperties.className;
      expect(classes.some((c: string) => c.includes('primary'))).toBe(true);
    });

    it('should parse icon with mixed shorthand and CSS classes', async () => {
      const result = await parseWithIcons(':icon[search]{large .text-blue-500}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      const classes = iconNodes[0].data.hProperties.className;
      expect(classes).toContain('text-lg');
      expect(classes).toContain('text-blue-500');
    });
  });

  describe('Common Icons', () => {
    const commonIcons = [
      'home',
      'search',
      'user',
      'settings',
      'menu',
      'close',
      'check',
      'x',
      'arrow-left',
      'arrow-right',
      'arrow-up',
      'arrow-down',
      'heart',
      'star',
      'bell',
      'trash',
      'edit',
      'download',
      'upload',
      'calendar',
    ];

    commonIcons.forEach(iconName => {
      it(`should parse ${iconName} icon`, async () => {
        const result = await parseWithIcons(`:icon[${iconName}]`);
        const iconNodes = findIconNodes(result);
        
        expect(iconNodes.length).toBe(1);
        expect(iconNodes[0].name).toBe(iconName);
      });
    });

    it('should parse all common icons together', async () => {
      const markdown = commonIcons.map(name => `:icon[${name}]`).join(' ');
      const result = await parseWithIcons(markdown);
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(commonIcons.length);
    });
  });

  describe('Icon in Context', () => {
    it('should parse icon in paragraph', async () => {
      const result = await parseWithIcons('Welcome :icon[home] to our site');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      expect(iconNodes[0].name).toBe('home');
    });

    it('should parse icon in heading', async () => {
      const result = await parseWithIcons('# Welcome :icon[star]{large} User');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      expect(iconNodes[0].name).toBe('star');
    });

    it('should parse icons in lists', async () => {
      const markdown = `
- :icon[check] Feature 1
- :icon[check] Feature 2
- :icon[check] Feature 3
      `.trim();
      
      const result = await parseWithIcons(markdown);
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(3);
      expect(iconNodes.every(n => n.name === 'check')).toBe(true);
    });

    it('should preserve text around icons', async () => {
      const result = await parseWithIcons('Before :icon[home] after');
      // Check that text nodes are preserved
      const tree = result as Root;
      const paragraph = tree.children[0];
      
      if (paragraph.type === 'paragraph') {
        expect(paragraph.children.length).toBeGreaterThan(1);
      }
    });
  });

  describe('Icon Data Attributes', () => {
    it('should add icon class to all icons', async () => {
      const result = await parseWithIcons(':icon[home]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hProperties.className).toContain('icon');
    });

    it('should add icon-specific class', async () => {
      const result = await parseWithIcons(':icon[search]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hProperties.className).toContain('icon-search');
    });

    it('should add data-icon attribute', async () => {
      const result = await parseWithIcons(':icon[heart]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hProperties['data-icon']).toBe('heart');
    });

    it('should set hName to svg', async () => {
      const result = await parseWithIcons(':icon[home]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hName).toBe('svg');
    });
  });

  describe('Size Mappings', () => {
    it('should resolve xs size', async () => {
      const result = await parseWithIcons(':icon[home]{xs}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hProperties.className).toContain('text-xs');
    });

    it('should resolve small size', async () => {
      const result = await parseWithIcons(':icon[home]{small}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hProperties.className).toContain('text-sm');
    });

    it('should resolve large size', async () => {
      const result = await parseWithIcons(':icon[home]{large}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hProperties.className).toContain('text-lg');
    });

    it('should resolve huge size', async () => {
      const result = await parseWithIcons(':icon[home]{huge}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes[0].data.hProperties.className).toContain('text-4xl');
    });
  });

  describe('Edge Cases', () => {
    it('should ignore incomplete icon syntax', async () => {
      const result = await parseWithIcons(':icon[');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(0);
    });

    it('should handle empty icon name', async () => {
      const result = await parseWithIcons(':icon[]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(0);
    });

    it('should handle empty attributes', async () => {
      const result = await parseWithIcons(':icon[home]{}');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      // Should have default classes but no additional attributes
      expect(iconNodes[0].data.hProperties.className).toContain('icon');
    });

    it('should handle whitespace in attributes', async () => {
      const result = await parseWithIcons(':icon[home]{  large   bold  }');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
      const classes = iconNodes[0].data.hProperties.className;
      expect(classes).toContain('text-lg');
      expect(classes).toContain('font-bold');
    });

    it('should not parse invalid icon names with special chars', async () => {
      const result = await parseWithIcons(':icon[home@test]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(0);
    });

    it('should handle multiple icons on same line', async () => {
      const result = await parseWithIcons(':icon[home]:icon[search]:icon[user]');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(3);
    });
  });

  describe('Integration with Markdown', () => {
    it('should work with bold text', async () => {
      const result = await parseWithIcons('**Bold** :icon[star] text');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
    });

    it('should work with italic text', async () => {
      const result = await parseWithIcons('*Italic* :icon[heart] text');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
    });

    it('should work with links', async () => {
      const result = await parseWithIcons('[Click here :icon[arrow-right]](https://example.com)');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
    });

    it('should work with code', async () => {
      const result = await parseWithIcons('Code `inline` and :icon[code] icon');
      const iconNodes = findIconNodes(result);
      
      expect(iconNodes.length).toBe(1);
    });
  });
});

// Helper function to find all icon nodes in the tree
function findIconNodes(tree: Root): any[] {
  const iconNodes: any[] = [];
  
  function visit(node: any) {
    if (node.type === 'icon') {
      iconNodes.push(node);
    }
    if (node.children) {
      node.children.forEach(visit);
    }
  }
  
  visit(tree);
  return iconNodes;
}
