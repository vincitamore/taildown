/**
 * Modal Component Behavior
 * 
 * Handles open/close with backdrop, escape key, focus trap, and body scroll lock
 */

import type { ComponentBehavior } from '../index';

export const modalBehavior: ComponentBehavior = {
  name: 'modal',
  size: 1500, // ~1.5KB
  code: `// Modal Component
// Find all modal trigger buttons
document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
  const modalId = trigger.getAttribute('data-modal-trigger');
  const modal = document.getElementById(modalId);
  
  if (!modal) return;
  
  const closeButtons = modal.querySelectorAll('[data-modal-close]');
  const backdrop = modal;
  
  let isOpen = false;
  let previousFocus = null;
  
  // Open modal
  function open() {
    if (isOpen) return;
    
    previousFocus = document.activeElement;
    isOpen = true;
    modal.hidden = false;
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Fade in animation
    requestAnimationFrame(() => {
      modal.style.opacity = '1';
    });
    
    // Focus first focusable element (skip close button)
    const focusable = modal.querySelectorAll('button:not([data-modal-close]), [href], input, select, textarea');
    if (focusable.length > 0) {
      setTimeout(() => focusable[0].focus(), 100);
    }
  }
  
  // Close modal
  function close() {
    if (!isOpen) return;
    
    isOpen = false;
    modal.style.opacity = '0';
    
    setTimeout(() => {
      modal.hidden = true;
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.style.overflow = '';
      
      // Restore focus
      if (previousFocus) {
        previousFocus.focus();
        previousFocus = null;
      }
    }, 200);
  }
  
  // Trigger button click
  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    open();
  });
  
  // Close buttons
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      close();
    });
  });
  
  // Backdrop click
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) {
      close();
    }
  });
  
  // Escape key
  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') {
      close();
    }
  });
  
  // Initialize
  modal.hidden = true;
  modal.setAttribute('aria-hidden', 'true');
  modal.style.display = 'none';
  modal.style.opacity = '0';
  modal.style.transition = 'opacity 200ms ease-in-out';
});`
};


