/**
 * Table Parser Enhancement
 * Adds attribute parsing for GFM tables
 * 
 * Detects attribute blocks after tables and applies them to the table element.
 * Supports all table variants: sortable, zebra, bordered, glass, sticky-header, compact, hoverable
 * 
 * Example:
 * | Name | Age |
 * |------|-----|
 * | Alice | 25 |
 * | Bob | 30 |
 * {sortable zebra glass}
 * 
 * The attribute block {sortable zebra glass} is detected and applied to the table.
 */

import type { Root, Table, Paragraph } from 'mdast';
import { visit, SKIP } from 'unist-util-visit';
import { registry } from '../components/component-registry';

/**
 * Parse table attributes from following paragraph
 * Looks for attribute blocks immediately after tables
 * 
 * This is a remark plugin
 */
export function parseTableAttributes() {
  return (tree: Root): void => {
    parseTableAttributesImpl(tree);
  };
}

/**
 * Implementation of table attribute parsing
 */
function parseTableAttributesImpl(tree: Root): void {
  const tables: Array<{ node: Table; index: number; parent: any }> = [];
  
  // First pass: collect all tables
  visit(tree, 'table', (node, index, parent) => {
    if (parent && typeof index === 'number') {
      tables.push({ node, index, parent });
    }
  });
  
  // Second pass: check for attribute paragraphs after tables OR attribute rows within tables
  for (const { node: table, index: tableIndex, parent } of tables) {
    // Strategy 1: Check if last row of table contains only an attribute block
    // This handles cases where GFM parses the attribute line as a table row
    const tbody = table.children.find((child: any) => child.type === 'tableRow' || 
                                                       (child.type === 'element' && child.tagName === 'tbody'));
    
    if (table.children && table.children.length > 0) {
      const lastRow: any = table.children[table.children.length - 1];
      
      // Check if this is a table row with a single cell containing an attribute block
      if (lastRow.type === 'tableRow' && lastRow.children && lastRow.children.length > 0) {
        const firstCell = lastRow.children[0];
        
        if (firstCell.children && firstCell.children.length === 1) {
          const cellContent = firstCell.children[0];
          
          if (cellContent.type === 'text' && typeof cellContent.value === 'string') {
            const text = cellContent.value.trim();
            const attributeMatch = text.match(/^\{([^}]+)\}$/);
            
            if (attributeMatch) {
              const attributeString = attributeMatch[1];
              
              // Split attributes into array
              const attributes = attributeString.split(/\s+/).filter(Boolean);
              
              // Get table component from registry
              const tableComponent = registry.get('table');
              
              if (!tableComponent) {
                // If table component not registered yet, skip
                continue;
              }
              
              // Parse variants, sizes, and collect classes
              const classes: string[] = ['table-enhanced'];
              const variants: string[] = [];
              let size: string | undefined;
              
              for (const attr of attributes) {
                // Check if it's a variant
                if (tableComponent.variants[attr]) {
                  variants.push(attr);
                  classes.push(...tableComponent.variants[attr]);
                }
                // Check if it's a size
                else if (tableComponent.sizes[attr]) {
                  size = attr;
                  classes.push(...tableComponent.sizes[attr]);
                }
                // Otherwise it's a generic class
                else {
                  classes.push(attr);
                }
              }
              
              // Initialize table data
              if (!table.data) {
                table.data = {};
              }
              
              if (!table.data.hProperties) {
                table.data.hProperties = {};
              }
              
              // Store parsed attributes
              table.data.hProperties.className = [
                ...(table.data.hProperties.className || []),
                ...classes,
              ];
              
              // Store variants for component system
              if (!table.data.taildown) {
                table.data.taildown = {};
              }
              
              table.data.taildown.variants = variants;
              
              // Add data-component attribute for enhanced tables
              table.data.hProperties.dataComponent = 'table';
              
              // Add data-sortable for sortable variant
              if (variants.includes('sortable')) {
                table.data.hProperties.dataSortable = 'true';
              }
              
              // Remove the attribute row from the table
              table.children.splice(table.children.length - 1, 1);
              
              continue;
            }
          }
        }
      }
    }
    
    // Strategy 2: Check for attribute paragraph after table
    const nextIndex = tableIndex + 1;
    
    if (nextIndex < parent.children.length) {
      const nextNode = parent.children[nextIndex];
      
      if (nextNode.type === 'paragraph' && nextNode.children.length === 1) {
        const child = nextNode.children[0];
        
        // Check if it's a text node with attribute syntax
        if (child.type === 'text' && typeof child.value === 'string') {
          const text = child.value.trim();
          
          // Match attribute block pattern: {attr1 attr2 attr3}
          const attributeMatch = text.match(/^\{([^}]+)\}$/);
          
          if (attributeMatch) {
            const attributeString = attributeMatch[1];
            
            // Split attributes into array
            const attributes = attributeString.split(/\s+/).filter(Boolean);
            
            // Get table component from registry
            const tableComponent = registry.get('table');
            
            if (!tableComponent) {
              // If table component not registered yet, skip
              continue;
            }
            
            // Parse variants, sizes, and collect classes
            const classes: string[] = ['table-enhanced'];
            const variants: string[] = [];
            let size: string | undefined;
            
            for (const attr of attributes) {
              // Check if it's a variant
              if (tableComponent.variants[attr]) {
                variants.push(attr);
                classes.push(...tableComponent.variants[attr]);
              }
              // Check if it's a size
              else if (tableComponent.sizes[attr]) {
                size = attr;
                classes.push(...tableComponent.sizes[attr]);
              }
              // Otherwise it's a generic class
              else {
                classes.push(attr);
              }
            }
            
            // Initialize table data
            if (!table.data) {
              table.data = {};
            }
            
            if (!table.data.hProperties) {
              table.data.hProperties = {};
            }
            
            // Store parsed attributes
            table.data.hProperties.className = [
              ...(table.data.hProperties.className || []),
              ...classes,
            ];
            
            // Store variants for component system
            if (!table.data.taildown) {
              table.data.taildown = {};
            }
            
            table.data.taildown.variants = variants;
            
            // Add data-component attribute for enhanced tables
            table.data.hProperties.dataComponent = 'table';
            
            // Add data-sortable for sortable variant
            if (variants.includes('sortable')) {
              table.data.hProperties.dataSortable = 'true';
            }
            
            // Remove the attribute paragraph from the tree
            parent.children.splice(nextIndex, 1);
          }
        }
      }
    }
  }
}

/**
 * Apply table variants to existing table nodes in HAST
 * This is called during HAST generation
 */
export function applyTableVariants(table: any): void {
  if (!table || table.tagName !== 'table') {
    return;
  }
  
  const properties = table.properties || {};
  const classes = properties.className || [];
  
  // Check for sortable tables
  if (properties.dataSortable === 'true' || classes.includes('table-sortable')) {
    // Mark header cells as sortable
    if (table.children) {
      for (const child of table.children) {
        if (child.tagName === 'thead' && child.children) {
          for (const row of child.children) {
            if (row.tagName === 'tr' && row.children) {
              for (const cell of row.children) {
                if (cell.tagName === 'th') {
                  // Add sortable data attribute and classes
                  cell.properties = cell.properties || {};
                  cell.properties.dataSortable = 'true';
                  cell.properties.className = [
                    ...(cell.properties.className || []),
                    'sortable-header',
                  ];
                  
                  // Add sort icon placeholder
                  cell.children = [
                    ...(cell.children || []),
                    {
                      type: 'element',
                      tagName: 'span',
                      properties: {
                        className: ['sort-icon'],
                        ariaHidden: 'true',
                      },
                      children: [],
                    },
                  ];
                }
              }
            }
          }
        }
      }
    }
  }
  
  // Apply responsive wrapper for mobile
  const needsResponsiveWrapper = 
    classes.includes('table-enhanced') ||
    classes.includes('table-sortable') ||
    classes.includes('table-glass');
  
  if (needsResponsiveWrapper && properties.dataComponent !== 'wrapped') {
    // Mark that this needs wrapping (done in HTML renderer)
    properties.dataEnhanced = 'true';
  }
}

/**
 * Rehype plugin to enhance tables in the HAST tree
 * Applies interactive features and responsive wrappers
 */
export function rehypeEnhanceTables() {
  return (tree: any) => {
    visit(tree, 'element', (node, index, parent) => {
      if (node.tagName === 'table') {
        applyTableVariants(node);
        
        // If this is an enhanced table, ensure proper wrapper
        if (node.properties?.dataEnhanced === 'true' && parent && typeof index === 'number') {
          // Check if already wrapped
          const isAlreadyWrapped = 
            parent.tagName === 'div' &&
            parent.properties?.className?.includes('table-wrapper');
          
          if (!isAlreadyWrapped) {
            // Create enhanced table wrapper
            const wrapper = {
              type: 'element',
              tagName: 'div',
              properties: {
                className: ['table-wrapper', 'enhanced-table-wrapper'],
                dataComponent: 'table-wrapper',
              },
              children: [node],
            };
            
            // Replace table with wrapper
            parent.children[index] = wrapper;
          }
        }
      }
    });
  };
}

