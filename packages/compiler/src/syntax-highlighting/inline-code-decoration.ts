import {Decoration, EditorView, ViewPlugin, type DecorationSet, type ViewUpdate} from '@codemirror/view';
import {InlineCodeIndex} from './inline-code-index';
import type {ChangedRange} from '@lezer/common';

const literal = Decoration.mark({class: 'cm-taildown-inline-code'});

function decorations(view: EditorView, index: InlineCodeIndex, changes?: ChangedRange[]): DecorationSet {
  return Decoration.set(index.update(view.state.doc.toString(), changes).map(({from, to}) => literal.range(from, to)));
}

/** Incremental Markdown owns code-span boundaries; the streaming tokenizer owns other syntax. */
export const inlineCodeHighlighting = [
  ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    index = new InlineCodeIndex();
    constructor(view: EditorView) { this.decorations = decorations(view, this.index); }
    update(update: ViewUpdate) {
      if (update.docChanged) {
        const changes: ChangedRange[] = [];
        update.changes.iterChanges((fromA, toA, fromB, toB) => changes.push({fromA, toA, fromB, toB}));
        this.decorations = decorations(update.view, this.index, changes);
      }
    }
  }, {decorations: value => value.decorations}),
  EditorView.baseTheme({
    '.cm-taildown-inline-code, .cm-taildown-inline-code span': {
      color: 'var(--taildown-code-foreground, #374151) !important',
      backgroundColor: 'var(--taildown-code-background, #f3f4f6) !important',
      fontWeight: 'normal !important', fontStyle: 'normal !important', textDecoration: 'none !important',
    },
    '&dark': {'--taildown-code-foreground': '#e5e7eb', '--taildown-code-background': '#374151'},
  }),
];
