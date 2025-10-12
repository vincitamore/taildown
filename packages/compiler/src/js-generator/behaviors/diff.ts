import type { ComponentBehavior } from '../index';

/**
 * Code Diff Behavior
 * Synchronized scrolling for side-by-side diff view
 */
export const diffBehavior: ComponentBehavior = {
  name: 'diff',
  size: 800, // Estimated size in bytes
  code: `// Code Diff Component - Synchronized Scrolling
const diffComponents = getComponents('diff');

diffComponents.forEach(diffContainer => {
  const isSideBySide = diffContainer.classList.contains('diff-side-by-side');
  
  if (isSideBySide) {
    const panes = diffContainer.querySelectorAll('.diff-pane');
    
    if (panes.length === 2) {
      const beforePane = panes[0];
      const afterPane = panes[1];
      
      let isScrolling = false;
      
      // Synchronized scrolling for side-by-side view
      beforePane.addEventListener('scroll', () => {
        if (!isScrolling) {
          isScrolling = true;
          afterPane.scrollTop = beforePane.scrollTop;
          afterPane.scrollLeft = beforePane.scrollLeft;
          
          requestAnimationFrame(() => {
            isScrolling = false;
          });
        }
      }, { passive: true });
      
      afterPane.addEventListener('scroll', () => {
        if (!isScrolling) {
          isScrolling = true;
          beforePane.scrollTop = afterPane.scrollTop;
          beforePane.scrollLeft = afterPane.scrollLeft;
          
          requestAnimationFrame(() => {
            isScrolling = false;
          });
        }
      }, { passive: true });
    }
  }
});`,
};

