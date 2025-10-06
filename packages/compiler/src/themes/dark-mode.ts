/**
 * Dark Mode System for Taildown
 * Provides automatic dark mode support with smooth transitions
 * 
 * Features:
 * - Automatic toggle button injection
 * - LocalStorage persistence
 * - System preference detection
 * - Smooth color transitions
 * - Zero-config by default
 * 
 * See todo.txt lines 33-39 for dark mode requirements
 */

import type { TaildownConfig } from '../config/config-schema';
import { generateColorPaletteCSS } from './color-palette';

/**
 * Dark mode toggle options
 */
export interface DarkModeOptions {
  /** Enable dark mode system */
  enabled: boolean;
  
  /** Toggle method: 'class' or 'media' */
  toggle: 'class' | 'media';
  
  /** Transition speed in milliseconds */
  transitionSpeed: number;
  
  /** Auto-inject toggle button */
  injectToggle: boolean;
  
  /** Toggle button position */
  togglePosition: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

/**
 * Get dark mode options from config
 */
export function getDarkModeOptions(config: TaildownConfig): DarkModeOptions {
  const darkMode = config.theme?.darkMode;
  
  return {
    enabled: darkMode?.enabled ?? true,
    toggle: darkMode?.toggle ?? 'class',
    transitionSpeed: darkMode?.transitionSpeed ?? 300,
    injectToggle: true, // Auto-inject by default
    togglePosition: 'bottom-right', // Sensible default
  };
}

/**
 * Generate dark mode CSS
 * Includes color variables and dark mode classes
 */
export function generateDarkModeCSS(config: TaildownConfig): string {
  const options = getDarkModeOptions(config);
  
  if (!options.enabled) {
    return '';
  }
  
  const colorPalette = generateColorPaletteCSS(config);
  const transitionCSS = generateTransitionCSS(options.transitionSpeed);
  const toggleButtonCSS = generateToggleButtonCSS(options.togglePosition);
  
  return `
${colorPalette}

${transitionCSS}

${toggleButtonCSS}
`.trim();
}

/**
 * Generate CSS for smooth color transitions
 */
function generateTransitionCSS(speed: number): string {
  return `
/* Dark Mode Transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: ${speed}ms;
}

/* Disable transitions on page load to prevent flash */
.no-transitions * {
  transition: none !important;
}
`.trim();
}

/**
 * Generate CSS for dark mode toggle button
 */
function generateToggleButtonCSS(position: DarkModeOptions['togglePosition']): string {
  const positions = {
    'top-right': 'top: 1rem; right: 1rem;',
    'top-left': 'top: 1rem; left: 1rem;',
    'bottom-right': 'bottom: 1rem; right: 1rem;',
    'bottom-left': 'bottom: 1rem; left: 1rem;',
  };
  
  return `
/* Dark Mode Toggle Button */
.dark-mode-toggle {
  position: fixed;
  ${positions[position]}
  z-index: 9999;
  width: 3rem;
  height: 3rem;
  border-radius: 9999px;
  background: var(--background);
  border: 1px solid var(--border);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.dark-mode-toggle:active {
  transform: translateY(0);
}

.dark-mode-toggle svg {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--foreground);
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.dark-mode-toggle:hover svg {
  transform: rotate(15deg);
}

/* Hide sun icon in light mode, moon icon in dark mode */
.dark-mode-toggle .sun-icon {
  display: none;
}

.dark .dark-mode-toggle .sun-icon {
  display: block;
}

.dark-mode-toggle .moon-icon {
  display: block;
}

.dark .dark-mode-toggle .moon-icon {
  display: none;
}
`.trim();
}

/**
 * Generate JavaScript for dark mode toggle
 * This script handles:
 * - System preference detection
 * - LocalStorage persistence
 * - Toggle button functionality
 * - Smooth transitions
 */
export function generateDarkModeScript(options: DarkModeOptions): string {
  if (!options.enabled) {
    return '';
  }
  
  return `
// Dark Mode Toggle Script
(function() {
  'use strict';
  
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
  
  // Apply theme immediately (before page renders)
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
  
  // Apply initial theme (synchronously to prevent flash)
  const initialTheme = getInitialTheme();
  applyTheme(initialTheme);
  
  // Initialize after DOM loads
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  function init() {
    // Create toggle button if it doesn't exist
    let toggleButton = document.querySelector('.dark-mode-toggle');
    
    if (!toggleButton) {
      toggleButton = createToggleButton();
      document.body.appendChild(toggleButton);
    }
    
    // Add click handler
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
  }
  
  // Create toggle button element
  function createToggleButton() {
    const button = document.createElement('button');
    button.className = 'dark-mode-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.innerHTML = \`
      <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
      <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    \`;
    
    return button;
  }
})();
`.trim();
}

/**
 * Check if dark mode is enabled in config
 */
export function isDarkModeEnabled(config: TaildownConfig): boolean {
  return getDarkModeOptions(config).enabled;
}

/**
 * Get dark mode classes for a component
 * Adds dark: variants for all color-related classes
 */
export function getDarkModeClasses(lightClasses: string[]): string[] {
  const darkClasses: string[] = [];
  
  for (const cls of lightClasses) {
    // Add light mode class
    darkClasses.push(cls);
    
    // Add dark mode variant for color classes
    if (cls.startsWith('bg-') || cls.startsWith('text-') || cls.startsWith('border-')) {
      const darkVariant = getDarkVariant(cls);
      if (darkVariant) {
        darkClasses.push(darkVariant);
      }
    }
  }
  
  return darkClasses;
}

/**
 * Get dark mode variant for a class
 */
function getDarkVariant(cls: string): string | null {
  // Map light mode classes to dark mode equivalents
  const darkMappings: Record<string, string> = {
    'bg-white': 'dark:bg-gray-900',
    'bg-gray-50': 'dark:bg-gray-900',
    'bg-gray-100': 'dark:bg-gray-800',
    'bg-gray-200': 'dark:bg-gray-700',
    'text-gray-900': 'dark:text-gray-50',
    'text-gray-800': 'dark:text-gray-100',
    'text-gray-700': 'dark:text-gray-200',
    'text-gray-600': 'dark:text-gray-400',
    'border-gray-200': 'dark:border-gray-700',
    'border-gray-300': 'dark:border-gray-600',
  };
  
  return darkMappings[cls] || null;
}
