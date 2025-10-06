/**
 * Taildown Syntax Highlighting
 * 
 * CodeMirror6-based syntax highlighting for Taildown's complex nested structures.
 * Provides both editor support and HTML code block highlighting.
 */

export {
  taildownLanguage,
  taildown,
  taildownHighlightStyle,
  taildownDarkHighlightStyle,
} from './codemirror6-language';

export { rehypeCodeMirror6 } from './rehype-codemirror6';