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
  const scrollThreshold = 50; // pixels

  function updateNavbar() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollY > scrollThreshold) {
      if (!navbar.classList.contains('scrolled')) {
        navbar.classList.add('scrolled');
      }
    } else {
      if (navbar.classList.contains('scrolled')) {
        navbar.classList.remove('scrolled');
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

  // Check initial state
  updateNavbar();
}
`.trim()
};

