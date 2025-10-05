/**
 * Rehype plugin to register Taildown language with Prism
 * Must run before rehype-prism-plus
 */

import Prism from 'prismjs';
import { taildownLanguage } from './taildown-language';

// Register Taildown language globally with Prism when this module loads
// This ensures it's available before rehype-prism-plus processes code blocks
if (Prism && Prism.languages && !Prism.languages.taildown) {
  Prism.languages.taildown = taildownLanguage;
  Prism.languages.td = taildownLanguage; // Alias
}

/**
 * Rehype plugin stub - registration happens at module load time
 * This plugin is just here to maintain the unified pipeline structure
 */
export function rehypeRegisterTaildown() {
  // Return a no-op plugin function since registration already happened at module load
  return function() {
    // No-op: registration already completed
  };
}

