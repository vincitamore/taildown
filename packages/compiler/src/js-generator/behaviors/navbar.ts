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
  // Respect authored current-state semantics. Otherwise identify document links
  // across static .html paths and hosts that serve equivalent clean URLs.
  const pagePath = pathname => pathname.replace(/\\/index(?:\\.html)?$/, '/').replace(/\\.html$/, '').replace(/\\/$/, '') || '/';
  for (const navbar of navbars) {
    if (navbar.querySelector('[aria-current]')) continue;
    for (const link of navbar.querySelectorAll('a[href]:not(.navbar-brand)')) {
      try {
        const target = new URL(link.getAttribute('href'), document.baseURI);
        if (!target.hash && target.origin === location.origin &&
            target.search === location.search && pagePath(target.pathname) === pagePath(location.pathname)) {
          link.setAttribute('aria-current', 'page');
        }
      } catch { /* An invalid authored URL must not stop navigation behavior. */ }
    }
  }
  // Enhance existing content in place; without JavaScript every link stays visible.
  navbars.forEach((navbar, index) => {
    if (navbar.querySelectorAll('a[href]').length < 2 || !window.matchMedia) return;
    const children = [...navbar.children];
    let brand = children.find(child => child.matches('h1,h2,h3,.navbar-brand') || child.querySelector('.navbar-brand'));
    if (brand && brand.querySelectorAll('a').length > 1) {
      brand = brand.querySelector('.navbar-brand');
      if (brand) navbar.prepend(brand);
    }
    const links = document.createElement('div');
    links.className = 'navbar-links';
    let id = 'taildown-navbar-links-' + index;
    while (document.getElementById(id)) id += '-menu';
    links.id = id;
    [...navbar.childNodes].filter(child => child !== brand).forEach(child => links.append(child));
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'navbar-menu-toggle';
    toggle.textContent = 'Menu';
    toggle.setAttribute('aria-controls', id);
    navbar.append(toggle, links);
    navbar.classList.add('navbar-enhanced');
    const mobile = window.matchMedia('(max-width: 768px)');
    function close() {
      navbar.classList.remove('navbar-menu-open');
      toggle.setAttribute('aria-expanded', 'false');
      links.inert = mobile.matches;
      measureNavigation();
    }
    toggle.addEventListener('click', () => {
      const open = !navbar.classList.contains('navbar-menu-open');
      navbar.classList.toggle('navbar-menu-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      links.inert = mobile.matches && !open;
      measureNavigation();
    });
    links.addEventListener('click', event => {if (event.target.closest('a[href]')) close();});
    navbar.addEventListener('keydown', event => {
      if (event.key === 'Escape' && navbar.classList.contains('navbar-menu-open')) {close(); toggle.focus();}
    });
    document.addEventListener('pointerdown', event => {if (!navbar.contains(event.target)) close();});
    mobile.addEventListener('change', close);
    close();
  });
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

