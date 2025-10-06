/**
 * Scroll-Triggered Animations Behavior
 * 
 * Zero-config scroll animations using Intersection Observer API
 * 
 * Philosophy:
 * - Automatically detects elements with animation classes
 * - Triggers animations when elements scroll into view
 * - Respects prefers-reduced-motion
 * - Professional, subtle, and performant
 * 
 * Supported animation classes:
 * - animate-fade-in
 * - animate-slide-up
 * - animate-slide-down
 * - animate-slide-left
 * - animate-slide-right
 * - animate-scale-in
 * - animate-zoom-in
 */

import type { ComponentBehavior } from '../index';

export const scrollAnimationsBehavior: ComponentBehavior = {
  name: 'scroll-animations',
  size: 1200, // ~1.2KB
  code: `// Scroll-Triggered Animations
// Zero-config: Automatically animates elements when they scroll into view

// Check if user prefers reduced motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Animation class selectors
const animationClasses = [
  '.animate-fade-in',
  '.animate-slide-up',
  '.animate-slide-down',
  '.animate-slide-left',
  '.animate-slide-right',
  '.animate-scale-in',
  '.animate-zoom-in'
];

// Find all elements with animation classes
const animatedElements = document.querySelectorAll(animationClasses.join(', '));

if (animatedElements.length > 0 && !prefersReducedMotion) {
  console.log(\`[Taildown] Found \${animatedElements.length} animated elements\`);

  // Add initial class to prevent animation on page load
  animatedElements.forEach(el => {
    el.classList.add('animation-paused');
  });

  // Create Intersection Observer
  const observerOptions = {
    root: null, // viewport
    rootMargin: '0px 0px -10% 0px', // Trigger slightly before entering viewport
    threshold: 0.15 // Trigger when 15% visible
  };

  const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        // Element is in view - trigger animation
        const element = entry.target;
        
        // Add a small stagger delay for multiple elements
        const delay = index * 75; // 75ms between elements
        
        setTimeout(() => {
          element.classList.remove('animation-paused');
          element.classList.add('animation-playing');
        }, delay);
        
        // Stop observing this element (animate only once)
        animationObserver.unobserve(element);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  animatedElements.forEach(el => {
    animationObserver.observe(el);
  });
  
  console.log('[Taildown] Scroll animations initialized');
} else if (prefersReducedMotion) {
  console.log('[Taildown] Reduced motion preferred - animations disabled');
  // Remove animation classes if reduced motion preferred
  animatedElements.forEach(el => {
    animationClasses.forEach(className => {
      el.classList.remove(className.slice(1)); // Remove leading dot
    });
  });
}`
};

