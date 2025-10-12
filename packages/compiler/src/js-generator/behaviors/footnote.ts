import type { ComponentBehavior } from '../index';

/**
 * Footnote hover preview behavior
 * Shows a preview tooltip when hovering over footnote references
 */
export const footnoteBehavior: ComponentBehavior = {
  name: 'footnote',
  size: 800, // Estimated size in bytes (~0.8KB)
  code: `// Footnote hover preview
const footnoteRefs = document.querySelectorAll('a[data-footnote-ref]');
const previewDelay = 300; // milliseconds before showing preview
let previewTimer = null;
let activePreview = null;

footnoteRefs.forEach(ref => {
  ref.addEventListener('mouseenter', (e) => {
    clearTimeout(previewTimer);
    
    previewTimer = setTimeout(() => {
      // Get footnote ID from href (GFM format: #user-content-fn-X)
      const href = ref.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      
      const footnoteId = href.slice(1); // Remove #
      const footnoteElement = document.getElementById(footnoteId);
      if (!footnoteElement) return;
      
      // Create preview tooltip
      const preview = document.createElement('div');
      preview.className = 'footnote-preview';
      
      // Clone footnote content (exclude backlink)
      const content = footnoteElement.cloneNode(true);
      const backlink = content.querySelector('.footnote-backlink');
      if (backlink) {
        backlink.remove();
      }
      preview.innerHTML = content.innerHTML;
      
      // Position preview near reference (using tooltip positioning logic)
      document.body.appendChild(preview);
      preview.style.position = 'fixed';
      
      const refRect = ref.getBoundingClientRect();
      const previewRect = preview.getBoundingClientRect();
      const gap = 8;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Try to position above the reference first
      let top = refRect.top - previewRect.height - gap;
      let left = refRect.left + (refRect.width / 2) - (previewRect.width / 2);
      
      // If preview would go above viewport, position below instead
      if (top < gap) {
        top = refRect.bottom + gap;
      }
      
      // Keep preview on screen horizontally
      if (left < gap) {
        left = gap;
      }
      if (left + previewRect.width > viewportWidth - gap) {
        left = viewportWidth - previewRect.width - gap;
      }
      
      preview.style.left = left + 'px';
      preview.style.top = top + 'px';
      
      // Show preview with animation
      requestAnimationFrame(() => {
        preview.classList.add('visible');
      });
      
      activePreview = preview;
    }, previewDelay);
  });
  
  ref.addEventListener('mouseleave', () => {
    clearTimeout(previewTimer);
    
    if (activePreview) {
      activePreview.classList.remove('visible');
      setTimeout(() => {
        if (activePreview && activePreview.parentNode) {
          activePreview.parentNode.removeChild(activePreview);
        }
        activePreview = null;
      }, 200); // Match CSS transition duration
    }
  });
  
  // Close preview on scroll
  window.addEventListener('scroll', () => {
    clearTimeout(previewTimer);
    if (activePreview) {
      activePreview.classList.remove('visible');
      setTimeout(() => {
        if (activePreview && activePreview.parentNode) {
          activePreview.parentNode.removeChild(activePreview);
        }
        activePreview = null;
      }, 200);
    }
  }, { passive: true });
});

// Smooth scroll to footnotes and back
document.querySelectorAll('a[href^="#fn"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Add focus for accessibility
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
});`
};

