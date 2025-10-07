/**
 * Navbar Scroll Behavior
 * 
 * Adds scroll effect to navbar:
 * - Increases opacity and blur when scrolled
 * - Smooth transition
 * - Adds 'scrolled' class after scrolling past threshold
 */

import { ComponentBehavior } from '../index';

export const navbarBehavior: ComponentBehavior = {
  name: 'navbar',
  size: 500, // ~500 bytes
  code: `
// Navbar scroll effect
const navbar = document.querySelector('.navbar');
console.log('[Taildown] Navbar element found:', navbar);

if (navbar) {
  let ticking = false;
  const scrollThreshold = 50; // pixels
  
  function updateNavbar() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    console.log('[Taildown] Navbar scroll position:', scrollY);
    
    if (scrollY > scrollThreshold) {
      if (!navbar.classList.contains('scrolled')) {
        navbar.classList.add('scrolled');
        console.log('[Taildown] Navbar: scrolled state activated at', scrollY);
      }
    } else {
      if (navbar.classList.contains('scrolled')) {
        navbar.classList.remove('scrolled');
        console.log('[Taildown] Navbar: scrolled state deactivated at', scrollY);
      }
    }
    
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  console.log('[Taildown] Navbar scroll listener attached');
  
  // Check initial state
  updateNavbar();
} else {
  console.error('[Taildown] Navbar element not found! Looking for .navbar');
}
`.trim()
};

