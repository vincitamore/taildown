/**
 * Shiki-based syntax highlighting for multi-language support
 * 
 * Uses VS Code's TextMate grammars for high-quality, compile-time syntax highlighting.
 * This approach:
 * - Generates highlighted HTML at compile time (zero runtime JS)
 * - Uses the same grammars as VS Code (perfect for extension alignment)
 * - Supports 180+ languages out of the box
 * - Produces semantic HTML with token-level spans
 * 
 * NOTE: This is ONLY used for server-side/CLI compilation, NOT in the browser bundle.
 * The browser bundle externalizes Shiki and uses CodeMirror for live syntax highlighting.
 */

import { createHighlighter, type Highlighter, type BundledLanguage, type BundledTheme } from 'shiki';

/**
 * Singleton highlighter instance
 * Initialized lazily on first use and reused across all highlighting operations
 */
let highlighterInstance: Highlighter | null = null;

/**
 * Languages to preload for optimal performance
 * Add more as needed based on common usage patterns
 */
const PRELOADED_LANGUAGES: BundledLanguage[] = [
  'javascript',
  'typescript',
  'jsx',
  'tsx',
  'python',
  'css',
  'html',
  'json',
  'markdown',
  'yaml',
  'bash',
  'shell',
  'sql',
  'rust',
  'go',
  'java',
  'c',
  'cpp',
];

/**
 * Themes to load (light and dark for Taildown's theme system)
 */
const THEMES: BundledTheme[] = ['dark-plus', 'light-plus'];

/**
 * Initialize the Shiki highlighter with common languages and themes
 * This is called automatically on first highlight request
 */
async function initializeHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) {
    return highlighterInstance;
  }

  highlighterInstance = await createHighlighter({
    themes: THEMES,
    langs: PRELOADED_LANGUAGES,
  });

  return highlighterInstance;
}

/**
 * Language alias mapping to handle common variations
 * Maps user-provided language strings to Shiki's canonical names
 */
const LANGUAGE_ALIASES: Record<string, BundledLanguage> = {
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'yml': 'yaml',
  'sh': 'bash',
  'md': 'markdown',
  'json5': 'json',
  'jsonc': 'json',
};

/**
 * Normalize a language string to Shiki's canonical form
 */
function normalizeLanguage(lang: string): BundledLanguage | null {
  const normalized = lang.toLowerCase().trim();
  
  // Check if it's an alias first
  if (normalized in LANGUAGE_ALIASES) {
    return LANGUAGE_ALIASES[normalized];
  }
  
  // Return as-is if it looks like a valid language
  return normalized as BundledLanguage;
}

/**
 * Highlight code using Shiki
 * 
 * @param code - The source code to highlight
 * @param language - The language identifier (e.g., 'javascript', 'python')
 * @param theme - Theme to use ('dark-plus' or 'light-plus', defaults to 'dark-plus')
 * @returns Highlighted HTML string with inline styles, or null if language not supported
 */
export async function highlightWithShiki(
  code: string,
  language: string,
  theme: BundledTheme = 'dark-plus'
): Promise<string | null> {
  try {
    const highlighter = await initializeHighlighter();
    const normalizedLang = normalizeLanguage(language);
    
    if (!normalizedLang) {
      return null;
    }

    // Check if language is loaded, if not, try to load it dynamically
    const loadedLanguages = highlighter.getLoadedLanguages();
    if (!loadedLanguages.includes(normalizedLang)) {
      try {
        await highlighter.loadLanguage(normalizedLang);
      } catch (error) {
        // Language not supported by Shiki
        console.warn(`[Shiki] Language "${language}" (normalized: "${normalizedLang}") not supported`);
        return null;
      }
    }

    // Generate highlighted HTML
    const html = highlighter.codeToHtml(code, {
      lang: normalizedLang,
      theme: theme,
    });

    return html;
  } catch (error) {
    console.error('[Shiki] Highlighting failed:', error);
    return null;
  }
}

/**
 * Check if a language is supported by Shiki
 * Useful for fallback logic in the rehype plugin
 */
export function isLanguageSupported(language: string): boolean {
  const normalized = normalizeLanguage(language);
  if (!normalized) return false;
  
  // Common languages are always supported
  if (PRELOADED_LANGUAGES.includes(normalized)) {
    return true;
  }
  
  // For other languages, we'll try to load them dynamically
  // Return true optimistically - actual support will be checked during highlighting
  return true;
}

/**
 * Get the singleton highlighter instance
 * Useful for advanced usage or testing
 */
export async function getHighlighter(): Promise<Highlighter> {
  return await initializeHighlighter();
}

/**
 * Extract CSS classes from Shiki's HTML output
 * Shiki uses inline styles, but we may want to extract token classes for custom theming
 * 
 * @param html - Shiki's HTML output
 * @returns Array of unique CSS classes used
 */
export function extractTokenClasses(html: string): string[] {
  const classRegex = /class="([^"]+)"/g;
  const classes = new Set<string>();
  
  let match;
  while ((match = classRegex.exec(html)) !== null) {
    const classList = match[1].split(' ');
    classList.forEach(cls => classes.add(cls));
  }
  
  return Array.from(classes);
}
