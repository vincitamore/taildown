// Test how toHast handles containerDirective nodes
const { toHast } = require('mdast-util-to-hast');

// Test 1: containerDirective with default toHast (no handlers)
const node1 = {
  type: 'containerDirective',
  name: 'tabs',
  children: [
    {
      type: 'paragraph',
      children: [{ type: 'text', value: 'Test content' }]
    }
  ],
  data: {
    hName: 'div',
    hProperties: {
      className: ['test-class', 'another-class'],
      'data-component': 'tabs'
    }
  }
};

console.log('=== Test 1: Default toHast (no handlers) ===');
const hast1 = toHast(node1);
console.log(JSON.stringify(hast1, null, 2));

// Test 2: containerDirective with custom handler
console.log('\n=== Test 2: Custom handler ===');

const customHandler = (h, node) => {
  console.log('Custom handler called with node:', node.name);
  console.log('Children:', node.children);
  
  // Create a custom structure
  return h(node, 'div', { class: 'custom-' + node.name }, [
    h(node, 'span', {}, [{ type: 'text', value: 'Custom: ' }]),
    // Process children through h
    ...node.children.map(child => h(node, child))
  ]);
};

const hast2 = toHast(node1, {
  handlers: {
    containerDirective: customHandler
  }
});
console.log(JSON.stringify(hast2, null, 2));

// Test 3: Check if data.hProperties are preserved
console.log('\n=== Test 3: Data preservation ===');
const node3 = {
  type: 'containerDirective',
  name: 'accordion',
  children: [
    { type: 'paragraph', children: [{ type: 'text', value: 'Item 1' }] }
  ],
  data: {
    hName: 'section',
    hProperties: {
      className: ['accordion-class'],
      'data-id': 'test-123'
    }
  }
};

const hast3 = toHast(node3);
console.log(JSON.stringify(hast3, null, 2));

