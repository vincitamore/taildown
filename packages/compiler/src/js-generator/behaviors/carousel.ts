/**
 * Carousel Component Behavior
 * 
 * Handles slide navigation with keyboard, touch, and auto-play support
 */

import type { ComponentBehavior } from '../index';

export const carouselBehavior: ComponentBehavior = {
  name: 'carousel',
  size: 2400, // ~2.4KB (includes touch + desktop drag support)
  code: `// Carousel Component
getComponents('carousel').forEach(carousel => {
  const owns = element => element.closest('[data-component="carousel"]') === carousel;
  const owned = selector => Array.from(carousel.querySelectorAll(selector)).filter(owns);
  const track = owned('[data-carousel-track]')[0];
  const slides = owned('[data-carousel-slide]');
  const prevBtn = owned('[data-carousel-prev]')[0];
  const nextBtn = owned('[data-carousel-next]')[0];
  const indicators = owned('[data-carousel-indicator]');
  const editing = target => {
    const editable = target.closest('[contenteditable]');
    return target.isContentEditable || (editable && editable.getAttribute('contenteditable') !== 'false');
  };
  
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  let autoPlayInterval = null;
  const autoPlay = carousel.hasAttribute('data-autoplay');
  const interval = parseInt(carousel.getAttribute('data-interval')) || 5000;
  
  // Go to slide
  function goToSlide(index) {
    // Wrap around
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    
    currentIndex = index;
    
    // Update slides - hide all except current
    slides.forEach((slide, i) => {
      const isActive = i === index;
      toggleClass(slide, 'active', isActive);
      slide.hidden = !isActive;
      slide.setAttribute('aria-hidden', !isActive);
    });
    
    // Update indicators
    indicators.forEach((indicator, i) => {
      const isActive = i === index;
      toggleClass(indicator, 'active', isActive);
      indicator.setAttribute('aria-current', isActive ? 'true' : 'false');
    });
    
    // Update buttons (enable/disable based on position if not looping)
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }
  
  // Navigation
  function prev() {
    goToSlide(currentIndex - 1);
  }
  
  function next() {
    goToSlide(currentIndex + 1);
  }
  
  // Button handlers
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);
  
  // Indicator handlers
  indicators.forEach((indicator, index) => {
    indicator.addEventListener('click', () => goToSlide(index));
  });
  
  // Keyboard navigation
  carousel.addEventListener('keydown', (e) => {
    if (!owns(e.target) || e.defaultPrevented || editing(e.target) || e.target.closest('input, textarea, select, [role="slider"], [role="tablist"]')) return;
    if (e.key === 'ArrowLeft') {
      prev();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      next();
      e.preventDefault();
    }
  });
  
  // Touch swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  carousel.addEventListener('touchstart', (e) => {
    if (!owns(e.target) || editing(e.target) || e.target.closest('input, textarea, select, [role="slider"]')) return;
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    if (!owns(e.target) || editing(e.target) || e.target.closest('input, textarea, select, [role="slider"]')) return;
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }, { passive: true });
  
  // Desktop mouse drag support
  let mouseStartX = 0;
  let mouseEndX = 0;
  let isDragging = false;
  let hasMoved = false;
  
  carousel.addEventListener('mousedown', (e) => {
    if (!owns(e.target) || e.defaultPrevented || editing(e.target) || e.target.closest('button, a, input, textarea, select, [role="slider"]')) return;
    // Only respond to left mouse button
    if (e.button !== 0) return;
    isDragging = true;
    hasMoved = false;
    mouseStartX = e.screenX;
    carousel.style.cursor = 'grabbing';
    // Prevent text selection while dragging
    e.preventDefault();
  });
  
  carousel.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    hasMoved = true;
    mouseEndX = e.screenX;
  });
  
  carousel.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    carousel.style.cursor = 'grab';
    
    if (hasMoved) {
      mouseEndX = e.screenX;
      const diff = mouseStartX - mouseEndX;
      
      // Require at least 50px drag to trigger slide change
      if (Math.abs(diff) > 50) {
        if (diff > 0) next();
        else prev();
      }
    }
  });
  
  carousel.addEventListener('mouseleave', () => {
    if (isDragging) {
      isDragging = false;
      carousel.style.cursor = 'grab';
    }
  });
  
  // Set initial cursor style
  carousel.style.cursor = 'grab';
  
  // Auto-play
  if (autoPlay && slides.length > 1) {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let paused = motion.matches;
    let hovered = false;
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'carousel-play-toggle';
    carousel.appendChild(toggle);
    function syncPlayback() {
      clearInterval(autoPlayInterval);
      autoPlayInterval = null;
      toggle.textContent = paused ? 'Play' : 'Pause';
      toggle.setAttribute('aria-label', paused ? 'Start automatic slides' : 'Pause automatic slides');
      if (!paused && !hovered && !document.hidden) autoPlayInterval = setInterval(next, interval);
    }
    toggle.addEventListener('click', () => { paused = !paused; syncPlayback(); });
    carousel.addEventListener('mouseenter', () => { hovered = true; syncPlayback(); });
    carousel.addEventListener('mouseleave', () => { hovered = false; syncPlayback(); });
    carousel.addEventListener('focusin', event => {
      if (event.target !== toggle) { paused = true; syncPlayback(); }
    });
    document.addEventListener('visibilitychange', syncPlayback);
    motion.addEventListener('change', () => { if (motion.matches) paused = true; syncPlayback(); });
    syncPlayback();
  }
  
  // Initialize
  goToSlide(0);
});`
};


