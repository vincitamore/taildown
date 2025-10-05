/**
 * Accordion Component Behavior
 * 
 * Handles expand/collapse with smooth animations and ARIA support
 */

import type { ComponentBehavior } from '../index';

export const accordionBehavior: ComponentBehavior = {
  name: 'accordion',
  size: 1000, // ~1KB
  code: `// Accordion Component
getComponents('accordion').forEach(accordion => {
  const items = Array.from(accordion.querySelectorAll('[data-accordion-item]'));
  
  items.forEach((item, index) => {
    const trigger = item.querySelector('[data-accordion-trigger]');
    const content = item.querySelector('[data-accordion-content]');
    
    if (!trigger || !content) return;
    
    // Set initial state - first item open by default
    const isOpen = index === 0 || item.hasAttribute('data-open');
    content.hidden = !isOpen;
    trigger.setAttribute('aria-expanded', String(isOpen));
    toggleClass(item, 'open', isOpen);
    
    // Toggle function
    function toggle() {
      const willOpen = content.hidden;
      
      // Toggle current item
      content.hidden = !willOpen;
      trigger.setAttribute('aria-expanded', String(willOpen));
      toggleClass(item, 'open', willOpen);
    }
    
    // Click handler
    trigger.addEventListener('click', toggle);
    
    // Keyboard handler
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggle();
      }
    });
  });
});`
};


