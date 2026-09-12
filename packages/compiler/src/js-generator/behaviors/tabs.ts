/**
 * Tabs Component Behavior
 * 
 * Handles tab switching with keyboard navigation and ARIA support
 */

import type { ComponentBehavior } from '../index';

export const tabsBehavior: ComponentBehavior = {
  name: 'tabs',
  size: 1200, // ~1.2KB
  code: `// Tabs Component
const tabElements = getComponents('tabs');
tabElements.forEach(tabs => {
  const owns = element => element.closest('[data-component="tabs"]') === tabs;
  const tabList = Array.from(tabs.querySelectorAll('[role="tablist"]')).find(owns);
  if (!tabList) {
    console.warn('[Taildown Tabs] No tablist found, skipping');
    return;
  }
  
  const tabButtons = Array.from(tabList.querySelectorAll('[role="tab"]')).filter(owns);
  const tabPanels = tabButtons.map(button => document.getElementById(button.getAttribute('aria-controls')));
  if (!tabButtons.length) return;
  
  // Set initial active tab
  let activeIndex = tabButtons.findIndex(btn => btn.getAttribute('aria-selected') === 'true');
  if (activeIndex === -1) activeIndex = 0;
  
  // Switch to tab
  function switchTab(index) {
    // Update buttons
    tabButtons.forEach((btn, i) => {
      const isActive = i === index;
      btn.setAttribute('aria-selected', isActive);
      btn.setAttribute('tabindex', isActive ? '0' : '-1');
      toggleClass(btn, 'active', isActive);
    });
    
    // Update panels
    tabPanels.forEach((panel, i) => {
      if (!panel || !owns(panel)) return;
      const isActive = i === index;
      panel.hidden = !isActive;
      toggleClass(panel, 'active', isActive);
    });
    
    activeIndex = index;
  }
  
  // Click handlers
  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      switchTab(index);
    });
  });
  
  // Keyboard navigation
  tabList.addEventListener('keydown', (e) => {
    if (!tabButtons.includes(e.target)) return;
    let newIndex = activeIndex;
    
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      newIndex = activeIndex > 0 ? activeIndex - 1 : tabButtons.length - 1;
      e.preventDefault();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      newIndex = activeIndex < tabButtons.length - 1 ? activeIndex + 1 : 0;
      e.preventDefault();
    } else if (e.key === 'Home') {
      newIndex = 0;
      e.preventDefault();
    } else if (e.key === 'End') {
      newIndex = tabButtons.length - 1;
      e.preventDefault();
    }
    
    if (newIndex !== activeIndex) {
      switchTab(newIndex);
      tabButtons[newIndex].focus();
    }
  });
  
  // Initialize
  switchTab(activeIndex);
});`
};
