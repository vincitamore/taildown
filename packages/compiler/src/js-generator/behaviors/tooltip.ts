/**
 * Tooltip Component Behavior
 * 
 * Handles show/hide on hover/focus with intelligent positioning
 */

import type { ComponentBehavior } from '../index';

export const tooltipBehavior: ComponentBehavior = {
  name: 'tooltip',
  size: 1800, // ~1.8KB (increased due to positioning logic and event handling)
  code: `// Tooltip Component with intelligent positioning and hover persistence
const tooltipOwners = new WeakMap();
document.querySelectorAll('[data-tooltip-trigger]').forEach((trigger, index) => {
  const tooltipId = trigger.getAttribute('aria-describedby');
  let tooltip = tooltipId ? document.getElementById(tooltipId) : null;
  
  if (!tooltip) {
    const next = trigger.nextElementSibling;
    if (next && next.getAttribute('role') === 'tooltip') {
      tooltip = next;
    }
  }
  
  if (!tooltip) return;
  if (!tooltip.id) {
    let id = 'taildown-tooltip-' + index;
    while (document.getElementById(id)) id += '-next';
    tooltip.id = id;
  }
  trigger.setAttribute('aria-describedby', tooltip.id);
  
  let isVisible = false;
  let hideTimeout = null;
  let isHoveringTooltip = false;
  let isHoveringTrigger = false;
  
  // Position tooltip near trigger with viewport edge detection
  function positionTooltip() {
    if (tooltipOwners.get(tooltip) !== trigger) return;
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
    
    top = Math.max(gap, Math.min(top, viewportHeight - tooltipRect.height - gap));
    left = Math.max(gap, left);
    tooltip.style.top = top + 'px';
    tooltip.style.left = left + 'px';
  }
  
  // Show tooltip
  function show() {
    clearTimeout(hideTimeout);
    if (isVisible && tooltipOwners.get(tooltip) === trigger) return;
    tooltipOwners.set(tooltip, trigger);
    isVisible = true;
    tooltip.hidden = false;
    tooltip.style.display = 'block';
    tooltip.style.opacity = '0';
    
    positionTooltip();
    tooltip.style.opacity = '1';
  }
  
  // Hide tooltip with delay
  function hide(immediate = false) {
    clearTimeout(hideTimeout);
    const close = () => {
      if (tooltipOwners.get(tooltip) !== trigger) { isVisible = false; return; }
      if (!immediate && (isHoveringTooltip || isHoveringTrigger || document.activeElement === trigger)) return;
      isVisible = false;
      tooltipOwners.delete(tooltip);
      tooltip.style.opacity = '0';
      tooltip.hidden = true;
      tooltip.style.display = 'none';
    };
    if (immediate) close();
    else hideTimeout = setTimeout(close, 150);
  }
  
  // Trigger mouse events
  trigger.addEventListener('mouseenter', () => { isHoveringTrigger = true; show(); });
  trigger.addEventListener('mouseleave', () => { isHoveringTrigger = false; hide(false); });
  
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
  trigger.addEventListener('focus', () => { if (trigger.matches(':focus-visible')) show(); });
  trigger.addEventListener('blur', () => hide(false));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isVisible) hide(true);
  });
  
  // Click to toggle (mobile and desktop)
  trigger.addEventListener('click', (e) => {
    // A tooltip enhances real links without taking ownership of navigation.
    const link = trigger.closest('a[href]');
    if (link && link.getAttribute('href') !== '#') {
      hide(true);
      return;
    }
    e.preventDefault(); // Placeholder help links must not jump to the page top.
    e.stopPropagation(); // Stop event bubbling
    if (isVisible && tooltipOwners.get(tooltip) === trigger) {
      hide(true);
    } else {
      show();
    }
  });
  
  // Re-position on scroll/resize
  document.addEventListener('scroll', () => {
    if (isVisible) positionTooltip();
  }, true);
  
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


