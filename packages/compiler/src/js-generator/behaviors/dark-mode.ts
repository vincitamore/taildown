/**
 * Dark Mode Toggle Behavior
 * Provides theme switching with localStorage persistence
 */

import type { ComponentBehavior } from '../index';

export const darkModeBehavior: ComponentBehavior = {
  name: 'dark-mode',
  size: 1800, // ~1.8KB
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

// Create toggle button
function createToggleButton() {
  const button = document.createElement('button');
  button.className = 'dark-mode-toggle';
  button.setAttribute('aria-label', 'Toggle dark mode');
  button.innerHTML = \`
    <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/>
      <line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/>
      <line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
    <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
    </svg>
  \`;
  return button;
}

// Apply initial theme immediately (prevent flash)
applyTheme(getInitialTheme());

// Create toggle button when DOM is ready
function initToggleButton() {
  const toggleButton = createToggleButton();
  document.body.appendChild(toggleButton);
  toggleButton.addEventListener('click', toggleTheme);
  
  // Listen for system preference changes
  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only auto-switch if user hasn't set a preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches);
      }
    });
  }
  
  console.log('[Taildown] Dark mode toggle button initialized');
}

// Wait for body to exist before creating button
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initToggleButton);
} else {
  initToggleButton();
}

console.log('[Taildown] Dark mode theme applied');
  `.trim(),
};
