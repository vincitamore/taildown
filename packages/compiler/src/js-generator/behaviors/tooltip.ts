/**
 * Tooltip Component Behavior
 * 
 * Handles show/hide on hover/focus with intelligent positioning
 */

import type { ComponentBehavior } from '../index';

export const tooltipBehavior: ComponentBehavior = {
  name: 'tooltip',
  size: 1650, // ~1.65KB (increased due to positioning logic)
  code: `// Tooltip Component with intelligent positioning and hover persistence
document.querySelectorAll('[data-tooltip-trigger]').forEach(trigger => {
  const tooltipId = trigger.getAttribute('aria-describedby');
  let tooltip = tooltipId ? document.getElementById(tooltipId) : null;
  
  if (!tooltip) {
    const next = trigger.nextElementSibling;
    if (next && next.getAttribute('role') === 'tooltip') {
      tooltip = next;
    }
  }
  
  if (!tooltip) return;
  
  let isVisible = false;
  let hideTimeout = null;
  let isHoveringTooltip = false;
  
  // Position tooltip near trigger with viewport edge detection
  function positionTooltip() {
    const triggerRect = trigger.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const gap = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let top = triggerRect.top - tooltipRect.height - gap;
    let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);
    
    // Check if tooltip would go above viewport
    if (top < gap) {
      top = triggerRect.bottom + gap;
      tooltip.setAttribute('data-tooltip-position', 'bottom');
    } else {
      tooltip.setAttribute('data-tooltip-position', 'top');
    }
    
    // Check if tooltip would go off left edge
    if (left < gap) {
      left = gap;
    }
    
    // Check if tooltip would go off right edge
    if (left + tooltipRect.width > viewportWidth - gap) {
      left = viewportWidth - tooltipRect.width - gap;
    }
    
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }
  
  // Show tooltip
  function show() {
    if (isVisible) return;
    
    clearTimeout(hideTimeout);
    isVisible = true;
    tooltip.hidden = false;
    tooltip.style.display = 'block';
    tooltip.style.opacity = '0';
    
    // Position first, then fade in
    requestAnimationFrame(() => {
      positionTooltip();
      requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
      });
    });
  }
  
  // Hide tooltip with delay
  function hide(immediate = false) {
    clearTimeout(hideTimeout);
    const delay = immediate ? 0 : 150;
    
    hideTimeout = setTimeout(() => {
      if (isHoveringTooltip) return;
      
      isVisible = false;
      tooltip.style.opacity = '0';
      
      setTimeout(() => {
        tooltip.hidden = true;
        tooltip.style.display = 'none';
      }, 200);
    }, delay);
  }
  
  // Trigger mouse events
  trigger.addEventListener('mouseenter', show);
  trigger.addEventListener('mouseleave', () => hide(false));
  
  // Tooltip hover persistence
  tooltip.addEventListener('mouseenter', () => {
    isHoveringTooltip = true;
    clearTimeout(hideTimeout);
  });
  
  tooltip.addEventListener('mouseleave', () => {
    isHoveringTooltip = false;
    hide(false);
  });
  
  // Focus events
  trigger.addEventListener('focus', show);
  trigger.addEventListener('blur', () => hide(false));
  
  // Mobile: click to toggle
  trigger.addEventListener('click', (e) => {
    if ('ontouchstart' in window) {
      e.preventDefault();
      if (isVisible) {
        hide(true);
      } else {
        show();
      }
    }
  });
  
  // Re-position on scroll/resize
  window.addEventListener('scroll', () => {
    if (isVisible) positionTooltip();
  });
  
  window.addEventListener('resize', () => {
    if (isVisible) positionTooltip();
  });
  
  // Initialize
  tooltip.hidden = true;
  tooltip.style.display = 'none';
  tooltip.style.opacity = '0';
  tooltip.style.transition = 'opacity 200ms ease-in-out';
  tooltip.style.pointerEvents = 'auto';
});`
};


