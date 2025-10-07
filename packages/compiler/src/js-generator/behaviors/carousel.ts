/**
 * Carousel Component Behavior
 * 
 * Handles slide navigation with keyboard, touch, and auto-play support
 */

import type { ComponentBehavior } from '../index';

export const carouselBehavior: ComponentBehavior = {
  name: 'carousel',
  size: 1800, // ~1.8KB
  code: `// Carousel Component
getComponents('carousel').forEach(carousel => {
  const track = carousel.querySelector('[data-carousel-track]');
  const slides = Array.from(carousel.querySelectorAll('[data-carousel-slide]'));
  const prevBtn = carousel.querySelector('[data-carousel-prev]');
  const nextBtn = carousel.querySelector('[data-carousel-next]');
  const indicators = Array.from(carousel.querySelectorAll('[data-carousel-indicator]'));
  
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
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  carousel.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
  }, { passive: true });
  
  // Auto-play
  if (autoPlay) {
    autoPlayInterval = setInterval(next, interval);
    
    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(next, interval);
    });
  }
  
  // Initialize
  goToSlide(0);
});`
};


