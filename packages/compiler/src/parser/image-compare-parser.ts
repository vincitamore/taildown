/**
 * Image Comparison Parser
 * Extracts before/after image data from :::compare-images blocks
 * 
 * Parses content like:
 * ```
 * :::compare-images {horizontal labels}
 * before: /images/before.jpg
 * after: /images/after.jpg
 * alt: Comparison description
 * :::
 * ```
 * 
 * Supported formats:
 * 1. Key-value pairs (before: URL, after: URL)
 * 2. Two image URLs (first is before, second is after)
 * 3. Two markdown images (![](url1) and ![](url2))
 */

import type { Root } from 'mdast';
import { visit } from 'unist-util-visit';
import type { ContainerDirectiveNode } from './directive-types';

/**
 * Image comparison data extracted from content
 */
export interface ImageCompareData {
  before: string;
  after: string;
  alt?: string;
  beforeAlt?: string;
  afterAlt?: string;
}

/**
 * Parse image comparison components
 * Extracts before/after image URLs from directive content
 * 
 * This is a remark plugin
 */
export function parseImageCompare() {
  return (tree: Root): void => {
    visit(tree, 'containerDirective', (node: any) => {
      if (node.name !== 'compare-images') {
        return;
      }
      
      // Extract image data from content
      const imageData = extractImageData(node);
      
      if (!imageData.before || !imageData.after) {
        // Invalid: missing required images
        // Transform to error message paragraph
        node.type = 'paragraph';
        node.children = [{
          type: 'text',
          value: '[Error: Image comparison requires both "before" and "after" images]'
        }];
        return;
      }
      
      // Store extracted data in hProperties (not attributes, to avoid them becoming CSS classes)
      if (!node.data) {
        node.data = {};
      }
      if (!node.data.hProperties) {
        node.data.hProperties = {};
      }
      
      node.data.hProperties.before = imageData.before;
      node.data.hProperties.after = imageData.after;
      node.data.hProperties.alt = imageData.alt || 'Image comparison';
      node.data.hProperties.beforeAlt = imageData.beforeAlt || `Before: ${node.data.hProperties.alt}`;
      node.data.hProperties.afterAlt = imageData.afterAlt || `After: ${node.data.hProperties.alt}`;
      node.data.hProperties.dataComponent = 'compare-images';
      
      // Clear children since we've extracted the data
      node.children = [];
    });
  };
}

/**
 * Extract image data from node children
 * Supports multiple input formats
 */
function extractImageData(node: ContainerDirectiveNode): ImageCompareData {
  const data: ImageCompareData = {
    before: '',
    after: '',
  };
  
  if (!node.children || node.children.length === 0) {
    return data;
  }
  
  // Collect all text content
  const textContent: string[] = [];
  const images: Array<{ url: string; alt?: string }> = [];
  
  visit(node, (child: any) => {
    if (child.type === 'text') {
      textContent.push(child.value);
    } else if (child.type === 'image') {
      images.push({
        url: child.url,
        alt: child.alt,
      });
    }
  });
  
  // Strategy 1: Parse key-value pairs from text content
  const fullText = textContent.join('\n');
  const lines = fullText.split('\n').map(line => line.trim()).filter(Boolean);
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim().toLowerCase();
    const value = line.substring(colonIndex + 1).trim();
    
    if (key === 'before') {
      data.before = value;
    } else if (key === 'after') {
      data.after = value;
    } else if (key === 'alt') {
      data.alt = value;
    } else if (key === 'before-alt' || key === 'beforealt') {
      data.beforeAlt = value;
    } else if (key === 'after-alt' || key === 'afteralt') {
      data.afterAlt = value;
    }
  }
  
  // Strategy 2: Use markdown images if present
  if (images.length >= 2 && !data.before && !data.after) {
    data.before = images[0].url;
    data.after = images[1].url;
    data.beforeAlt = images[0].alt;
    data.afterAlt = images[1].alt;
  } else if (images.length === 2) {
    // If we have key-value pairs but also images, prefer images
    if (!data.before && images[0]) {
      data.before = images[0].url;
      data.beforeAlt = images[0].alt;
    }
    if (!data.after && images[1]) {
      data.after = images[1].url;
      data.afterAlt = images[1].alt;
    }
  }
  
  // Strategy 3: Extract URLs from text (fallback)
  if (!data.before || !data.after) {
    const urlPattern = /https?:\/\/[^\s]+|\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)/gi;
    const urls = fullText.match(urlPattern) || [];
    
    if (urls.length >= 2) {
      if (!data.before) data.before = urls[0];
      if (!data.after) data.after = urls[1];
    }
  }
  
  return data;
}

