/**
 * Tooltip Component Behavior
 * 
 * Handles show/hide on hover/focus with intelligent positioning
 */

import type { ComponentBehavior } from '../index';

export const tooltipBehavior: ComponentBehavior = {
  name: 'tooltip',
  size: 800, // ~0.8KB
  code: `// Tooltip Component
getComponents('tooltip').forEach(wrapper => {
  const trigger = wrapper.querySelector('[data-tooltip-trigger]');
  const tooltip = wrapper.querySelector('[data-tooltip-content]');
  
  if (!trigger || !tooltip) return;
  
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
    
    const tooltipId = 'tooltip-' + Math.random().toString(36).substr(2, 9);
    tooltip.id = tooltipId;
    trigger.setAttribute('aria-describedby', tooltipId);
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
      
      trigger.removeAttribute('aria-describedby');
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
});`
};


