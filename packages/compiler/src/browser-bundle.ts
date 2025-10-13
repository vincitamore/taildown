/**
 * Browser Bundle Entry Point for Taildown Compiler
 * 
 * This file exports only browser-compatible functions for use in web applications.
 * It includes CodeMirror 6 editor and all necessary dependencies bundled together.
 */

// Re-export main compile function
export { compile } from './index';

// Re-export syntax highlighting for CodeMirror 6
export {
  taildownLanguage,
  taildown,
} from './syntax-highlighting';

// Convert highlight style arrays to proper CodeMirror extensions
import {
  taildownHighlightStyle as taildownHighlightStyleRaw,
  taildownDarkHighlightStyle as taildownDarkHighlightStyleRaw,
} from './syntax-highlighting';
import { syntaxHighlighting, HighlightStyle } from '@codemirror/language';

// Export properly formatted highlight styles as CodeMirror extensions
export const taildownHighlightStyle = syntaxHighlighting(HighlightStyle.define(taildownHighlightStyleRaw));
export const taildownDarkHighlightStyle = syntaxHighlighting(HighlightStyle.define(taildownDarkHighlightStyleRaw));

// Re-export CodeMirror 6 core modules
export { EditorView, keymap, lineNumbers, highlightActiveLineGutter } from '@codemirror/view';
export { EditorState, Compartment, Prec } from '@codemirror/state';
export { 
  defaultKeymap, 
  history, 
  historyKeymap,
  indentWithTab 
} from '@codemirror/commands';
export { searchKeymap, highlightSelectionMatches } from '@codemirror/search';
export { autocompletion, completionKeymap, startCompletion, acceptCompletion, closeCompletion, moveCompletionSelection, closeBrackets, closeBracketsKeymap } from '@codemirror/autocomplete';
export { indentOnInput, bracketMatching, foldGutter, foldKeymap } from '@codemirror/language';
export { lintKeymap } from '@codemirror/lint';

// Re-export highlight tags for custom styling if needed
import { tags } from '@lezer/highlight';
export { tags };

// Re-export types that might be useful in browser context
export type {
  CompileOptions,
  CompileResult,
  CompileMetadata,
  CompilationWarning,
} from '@taildown/shared';
