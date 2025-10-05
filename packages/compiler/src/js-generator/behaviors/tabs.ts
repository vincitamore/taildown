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
console.log('[Taildown Tabs] Found', tabElements.length, 'tabs components');
tabElements.forEach(tabs => {
  console.log('[Taildown Tabs] Initializing tabs component', tabs);
  const tabList = tabs.querySelector('[role="tablist"]');
  console.log('[Taildown Tabs] Tab list:', tabList);
  if (!tabList) {
    console.warn('[Taildown Tabs] No tablist found, skipping');
    return;
  }
  
  const tabButtons = Array.from(tabList.querySelectorAll('[role="tab"]'));
  console.log('[Taildown Tabs] Found', tabButtons.length, 'tab buttons');
  const tabPanels = Array.from(tabs.querySelectorAll('[role="tabpanel"]'));
  console.log('[Taildown Tabs] Found', tabPanels.length, 'tab panels');
  
  // Set initial active tab
  let activeIndex = tabButtons.findIndex(btn => btn.getAttribute('aria-selected') === 'true');
  console.log('[Taildown Tabs] Initial active index:', activeIndex);
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
      const isActive = i === index;
      panel.hidden = !isActive;
      toggleClass(panel, 'active', isActive);
    });
    
    activeIndex = index;
  }
  
  // Click handlers
  console.log('[Taildown Tabs] Attaching click handlers to', tabButtons.length, 'buttons');
  tabButtons.forEach((btn, index) => {
    console.log('[Taildown Tabs] Attaching handler to button', index);
    btn.addEventListener('click', () => {
      console.log('[Taildown Tabs] Tab clicked:', index);
      switchTab(index);
    });
  });
  console.log('[Taildown Tabs] Click handlers attached');
  
  // Keyboard navigation
  tabList.addEventListener('keydown', (e) => {
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


