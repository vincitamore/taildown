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
  size: 400, // ~400 bytes
  code: `
// Navbar scroll effect
const navbar = document.querySelector('.navbar');
if (navbar) {
  let ticking = false;
  let lastScrollY = 0;
  const scrollThreshold = 50; // pixels
  
  function updateNavbar() {
    const scrollY = window.scrollY;
    
    if (scrollY > scrollThreshold && !navbar.classList.contains('scrolled')) {
      navbar.classList.add('scrolled');
      console.log('[Taildown] Navbar: scrolled state activated');
    } else if (scrollY <= scrollThreshold && navbar.classList.contains('scrolled')) {
      navbar.classList.remove('scrolled');
      console.log('[Taildown] Navbar: scrolled state deactivated');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }
  
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }
  
  window.addEventListener('scroll', onScroll, { passive: true });
  console.log('[Taildown] Navbar scroll effect initialized');
  
  // Check initial state
  updateNavbar();
}
`.trim()
};

