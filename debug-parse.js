// Debug script to see what remark-parse gives us
const { unified } = require('unified');
const remarkParse = require('remark-parse');
const remarkGfm = require('remark-gfm');
const { readFileSync } = require('fs');

const content = readFileSync('test-attachable.td', 'utf-8');

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm);

const ast = processor.parse(content);

// Find the paragraph with "button with a tooltip"
function findNode(node, depth = 0) {
  const indent = '  '.repeat(depth);
  
  if (node.type === 'paragraph') {
    // Check if this paragraph contains our test text
    const hasButtonText = JSON.stringify(node).includes('button with a tooltip');
    const hasModalText = JSON.stringify(node).includes('link that opens a modal');
    
    if (hasButtonText || hasModalText) {
      console.log(`\n${indent}FOUND PARAGRAPH:`);
      console.log(`${indent}Children count: ${node.children?.length || 0}`);
      node.children?.forEach((child, i) => {
        console.log(`${indent}  [${i}] type: ${child.type}`);
        if (child.type === 'text') {
          console.log(`${indent}      value: "${child.value}"`);
        } else if (child.type === 'link') {
          console.log(`${indent}      url: ${child.url}`);
          console.log(`${indent}      children:`, child.children);
        }
      });
    }
  }
  
  if (node.children) {
    node.children.forEach(child => findNode(child, depth + 1));
  }
}

findNode(ast);

