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
  size: 1800,
  code: `
// Navbar scroll effect
const navbars = [...document.querySelectorAll('.navbar')];

if (navbars.length) {
  let ticking = false;
  const scrollThreshold = 50; // pixels

  function measureNavigation() {
    let fixedOffset = 0;
    let anchorOffset = 0;
    for (const navbar of navbars) {
      if (!navbar.isConnected || !navbar.getClientRects().length) continue;
      const style = getComputedStyle(navbar);
      const rect = navbar.getBoundingClientRect();
      if (style.position === 'fixed') {
        fixedOffset = Math.max(fixedOffset, rect.bottom);
        anchorOffset = Math.max(anchorOffset, rect.bottom);
      } else if (style.position === 'sticky') {
        anchorOffset = Math.max(anchorOffset, rect.height + (parseFloat(style.top) || 0));
      }
    }
    document.documentElement.style.setProperty('--navbar-offset', fixedOffset + 'px');
    document.documentElement.style.setProperty('--navbar-anchor-offset', anchorOffset + 'px');
  }

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(measureNavigation);
    navbars.forEach(navbar => observer.observe(navbar));
  }
  window.addEventListener('resize', measureNavigation, { passive: true });
  measureNavigation();

  function updateNavbar() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    navbars.forEach(navbar => navbar.classList.toggle('scrolled', scrollY > scrollThreshold));

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

