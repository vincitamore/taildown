/**
 * Tooltip Component Behavior
 * 
 * Handles show/hide on hover/focus with intelligent positioning
 */

import type { ComponentBehavior } from '../index';

export const tooltipBehavior: ComponentBehavior = {
  name: 'tooltip',
  size: 850, // ~0.85KB
  code: `// Tooltip Component
// Handle both standalone :::tooltip and attachable inline tooltips
// For attachable: trigger has data-tooltip-trigger, tooltip is next sibling with role="tooltip"
// For standalone: wrapper has data-component="tooltip", contains trigger and content
document.querySelectorAll('[data-tooltip-trigger]').forEach(trigger => {
  // Find tooltip: either by aria-describedby or as next sibling
  const tooltipId = trigger.getAttribute('aria-describedby');
  let tooltip = tooltipId ? document.getElementById(tooltipId) : null;
  
  // If no tooltip found via aria-describedby, try next sibling
  if (!tooltip) {
    const next = trigger.nextElementSibling;
    if (next && next.getAttribute('role') === 'tooltip') {
      tooltip = next;
    }
  }
  
  if (!tooltip) return;
  
  let isVisible = false;
  let hideTimeout = null;
  
  // Show tooltip
  function show() {
    if (isVisible) return;
    
    clearTimeout(hideTimeout);
    isVisible = true;
    tooltip.hidden = false;
    tooltip.style.display = 'block';
    
    // Fade in
    requestAnimationFrame(() => {
      tooltip.style.opacity = '1';
    });
  }
  
  // Hide tooltip
  function hide() {
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
      isVisible = false;
      tooltip.style.opacity = '0';
      
      setTimeout(() => {
        tooltip.hidden = true;
        tooltip.style.display = 'none';
      }, 200);
    }, 100);
  }
  
  // Mouse events
  trigger.addEventListener('mouseenter', show);
  trigger.addEventListener('mouseleave', hide);
  
  // Focus events
  trigger.addEventListener('focus', show);
  trigger.addEventListener('blur', hide);
  
  // Touch support for mobile
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if (isVisible) {
      hide();
    } else {
      show();
    }
  });
  
  // Initialize as hidden
  tooltip.hidden = true;
  tooltip.style.display = 'none';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 200ms ease-in-out';
});`
};


