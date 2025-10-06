/**
 * Copy Code Behavior
 * 
 * Provides copy-to-clipboard functionality for code blocks.
 * Includes fallback for older browsers and visual feedback.
 */

import type { ComponentBehavior } from '../index';

export const copyCodeBehavior: ComponentBehavior = {
  name: 'copy-code',
  size: 1200, // ~1.2KB
  code: `
    // Copy Code Functionality
    function initCopyCode() {
      console.log('[Taildown] Initializing copy code buttons');
      
      const copyButtons = document.querySelectorAll('.code-copy-btn');
      console.log(\`[Taildown] Found \${copyButtons.length} copy buttons\`);
      
      copyButtons.forEach((button, index) => {
        button.addEventListener('click', async function() {
          const codeText = this.getAttribute('data-code-text');
          if (!codeText) {
            console.warn('[Taildown] No code text found for copy button');
            return;
          }
          
          console.log(\`[Taildown] Copying code block \${index + 1}\`);
          
          try {
            // Use modern clipboard API if available
            if (navigator.clipboard && window.isSecureContext) {
              await navigator.clipboard.writeText(codeText);
            } else {
              // Fallback for older browsers
              const textArea = document.createElement('textarea');
              textArea.value = codeText;
              textArea.style.position = 'fixed';
              textArea.style.left = '-999999px';
              textArea.style.top = '-999999px';
              document.body.appendChild(textArea);
              textArea.focus();
              textArea.select();
              document.execCommand('copy');
              textArea.remove();
            }
            
            // Show success feedback
            showCopySuccess(this);
            
          } catch (err) {
            console.warn('[Taildown] Failed to copy code:', err);
            // Still show feedback even if copy failed
            showCopySuccess(this);
          }
        });
      });
    }
    
    function showCopySuccess(button) {
      // Get elements
      const copyIcon = button.querySelector('.copy-icon');
      const checkIcon = button.querySelector('.check-icon');
      const copyText = button.querySelector('.copy-text');
      const copiedText = button.querySelector('.copied-text');
      
      // Add success class
      button.classList.add('copied');
      
      // Switch icons and text
      if (copyIcon) copyIcon.style.display = 'none';
      if (checkIcon) checkIcon.style.display = 'block';
      if (copyText) copyText.style.display = 'none';
      if (copiedText) copiedText.style.display = 'block';
      
      // Reset after 2 seconds
      setTimeout(() => {
        button.classList.remove('copied');
        if (copyIcon) copyIcon.style.display = 'block';
        if (checkIcon) checkIcon.style.display = 'none';
        if (copyText) copyText.style.display = 'block';
        if (copiedText) copiedText.style.display = 'none';
      }, 2000);
    }
    
    // Initialize copy code functionality
    initCopyCode();
  `.trim()
};