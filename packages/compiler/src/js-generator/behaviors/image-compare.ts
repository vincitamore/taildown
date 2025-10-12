/**
 * Image Comparison Slider Behavior (~2KB)
 * 
 * Provides interactive draggable slider for before/after image comparison.
 * Supports:
 * - Mouse drag
 * - Touch drag (mobile)
 * - Keyboard navigation (arrow keys)
 * - ARIA attributes for accessibility
 * 
 * Usage: Automatically applied to :::compare-images components
 */

import type { ComponentBehavior } from '../index';

export const imageCompareBehavior: ComponentBehavior = {
  name: 'compare-images',
  size: 2000, // ~2KB
  code: `// Image Comparison Slider Component
const imageCompareElements = getComponents('compare-images');
console.log('[Taildown ImageCompare] Found', imageCompareElements.length, 'image comparison components');

imageCompareElements.forEach(container => {
  console.log('[Taildown ImageCompare] Initializing image comparison', container);
  const slider = container.querySelector('[data-compare-slider]');
  const afterImage = container.querySelector('[data-compare-after]');
  const orientation = container.getAttribute('data-orientation') || 'horizontal';
  const isVertical = orientation === 'vertical';
  
  if (!slider || !afterImage) {
    console.warn('[Taildown ImageCompare] Missing slider or after image, skipping');
    return;
  }
  
  let isDragging = false;
  let position = 50; // Start at 50%
  
  // Update slider position and clip
  function updatePosition(newPosition) {
    position = Math.max(0, Math.min(100, newPosition));
    
    if (isVertical) {
      slider.style.top = position + '%';
      afterImage.style.clipPath = \`inset(\${position}% 0 0 0)\`;
    } else {
      slider.style.left = position + '%';
      afterImage.style.clipPath = \`inset(0 0 0 \${position}%)\`;
    }
    
    // Update ARIA value
    slider.setAttribute('aria-valuenow', Math.round(position));
  }
  
  // Calculate position from event
  function getPositionFromEvent(e) {
    const rect = container.getBoundingClientRect();
    let clientPos, rectDimension;
    
    // Handle touch events
    if (e.touches && e.touches[0]) {
      clientPos = isVertical ? e.touches[0].clientY : e.touches[0].clientX;
    } else {
      clientPos = isVertical ? e.clientY : e.clientX;
    }
    
    if (isVertical) {
      rectDimension = rect.height;
      return ((clientPos - rect.top) / rectDimension) * 100;
    } else {
      rectDimension = rect.width;
      return ((clientPos - rect.left) / rectDimension) * 100;
    }
  }
  
  // Mouse events
  slider.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    console.log('[Taildown ImageCompare] Drag started');
    document.body.style.cursor = isVertical ? 'ns-resize' : 'ew-resize';
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const newPosition = getPositionFromEvent(e);
    updatePosition(newPosition);
  });
  
  document.addEventListener('mouseup', () => {
    if (isDragging) {
      isDragging = false;
      console.log('[Taildown ImageCompare] Drag ended');
      document.body.style.cursor = '';
    }
  });
  
  // Touch events
  slider.addEventListener('touchstart', (e) => {
    isDragging = true;
    console.log('[Taildown ImageCompare] Touch started');
  });
  
  document.addEventListener('touchmove', (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const newPosition = getPositionFromEvent(e);
    updatePosition(newPosition);
  }, { passive: false });
  
  document.addEventListener('touchend', () => {
    if (isDragging) {
      isDragging = false;
      console.log('[Taildown ImageCompare] Touch ended');
    }
  });
  
  // Click/tap on container to move slider
  container.addEventListener('click', (e) => {
    if (e.target === slider || slider.contains(e.target)) {
      return; // Don't move when clicking slider itself
    }
    const newPosition = getPositionFromEvent(e);
    updatePosition(newPosition);
    console.log('[Taildown ImageCompare] Jumped to position:', newPosition);
  });
  
  // Keyboard navigation
  slider.addEventListener('keydown', (e) => {
    let delta = 0;
    
    if (isVertical) {
      if (e.key === 'ArrowUp') {
        delta = -5;
        e.preventDefault();
      } else if (e.key === 'ArrowDown') {
        delta = 5;
        e.preventDefault();
      }
    } else {
      if (e.key === 'ArrowLeft') {
        delta = -5;
        e.preventDefault();
      } else if (e.key === 'ArrowRight') {
        delta = 5;
        e.preventDefault();
      }
    }
    
    if (delta !== 0) {
      updatePosition(position + delta);
      console.log('[Taildown ImageCompare] Keyboard moved to:', position);
    }
    
    // Home/End keys for extremes
    if (e.key === 'Home') {
      updatePosition(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      updatePosition(100);
      e.preventDefault();
    }
  });
  
  // Initialize at 50%
  updatePosition(50);
  console.log('[Taildown ImageCompare] Initialization complete');
});`
};

