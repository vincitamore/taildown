import {Decoration, EditorView, ViewPlugin, type DecorationSet, type ViewUpdate} from '@codemirror/view';
import {inlineCodeRanges} from '../authoring-context';

const literal = Decoration.mark({class: 'cm-taildown-inline-code'});

function decorations(view: EditorView): DecorationSet {
  return Decoration.set(inlineCodeRanges(view.state.doc.toString()).map(({from, to}) => literal.range(from, to)));
}

/** Markdown owns code-span boundaries; the streaming tokenizer owns other syntax. */
export const inlineCodeHighlighting = [
  ViewPlugin.fromClass(class {
    decorations: DecorationSet;
    constructor(view: EditorView) { this.decorations = decorations(view); }
    update(update: ViewUpdate) {
      if (update.docChanged) this.decorations = decorations(update.view);
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
