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
          if (codeText === null) {
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
              const previousFocus = document.activeElement;
              try {
                textArea.focus();
                textArea.select();
                if (!document.execCommand('copy')) throw new Error('Copy was not accepted');
              } finally {
                textArea.remove();
                if (previousFocus && previousFocus.isConnected) previousFocus.focus();
              }
            }
            
            // Show success feedback
            showCopySuccess(this);
            
          } catch (err) {
            console.warn('[Taildown] Failed to copy code:', err);
            showCopyResult(this, false);
          }
        });
      });
    }
    
    function showCopySuccess(button) {
      showCopyResult(button, true);
    }

    function showCopyResult(button, success) {
      // Get elements
      const copyIcon = button.querySelector('.copy-icon');
      const checkIcon = button.querySelector('.check-icon');
      const copyText = button.querySelector('.copy-text');
      const copiedText = button.querySelector('.copied-text');
      
      // Add success class
      clearTimeout(button.copyFeedbackTimer);
      button.classList.toggle('copied', success);
      button.setAttribute('aria-label', success ? 'Code copied to clipboard' : 'Copy failed. Try again');
      
      // Switch icons and text
      if (copyIcon) copyIcon.style.display = 'none';
      if (checkIcon) checkIcon.style.display = success ? 'block' : 'none';
      if (copyText) copyText.style.display = 'none';
      if (copiedText) {
        copiedText.textContent = success ? 'Copied!' : 'Copy failed';
        copiedText.style.display = 'block';
      }
      
      // Reset after 2 seconds
      button.copyFeedbackTimer = setTimeout(() => {
        button.classList.remove('copied');
        button.setAttribute('aria-label', 'Copy code to clipboard');
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
