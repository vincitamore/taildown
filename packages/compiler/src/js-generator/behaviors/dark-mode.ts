/**
 * Dark Mode Toggle Behavior
 * Provides theme switching with localStorage persistence
 */

import type { ComponentBehavior } from '../index';

export const darkModeBehavior: ComponentBehavior = {
  name: 'dark-mode',
  size: 1200, // ~1.2KB
  code: `
// Dark Mode Toggle
const STORAGE_KEY = 'taildown-dark-mode';
const DARK_CLASS = 'dark';

// Get initial theme from localStorage or system preference
function getInitialTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return stored === 'dark';
  }
  
  // Check system preference
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return true;
  }
  
  return false;
}

// Apply theme
function applyTheme(isDark) {
  if (isDark) {
    document.documentElement.classList.add(DARK_CLASS);
  } else {
    document.documentElement.classList.remove(DARK_CLASS);
  }
}

// Toggle theme
function toggleTheme() {
  const isDark = document.documentElement.classList.contains(DARK_CLASS);
  const newTheme = !isDark;
  
  applyTheme(newTheme);
  localStorage.setItem(STORAGE_KEY, newTheme ? 'dark' : 'light');
}

// Apply initial theme immediately (prevent flash)
applyTheme(getInitialTheme());

// Initialize toggle button
const toggleButton = document.querySelector('.dark-mode-toggle');
if (toggleButton) {
  toggleButton.addEventListener('click', toggleTheme);
}

// Listen for system preference changes
if (window.matchMedia) {
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    // Only auto-switch if user hasn't set a preference
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches);
    }
  });
}

console.log('[Taildown] Dark mode initialized');
  `.trim(),
};
