import type { TagStyle } from '@codemirror/language';
import { tags as t } from '@lezer/highlight';

// A shared semantic palette for editing and compiled Taildown examples.
// Muted syntax remains readable; emphasis uses weight/style rather than another hue.
function highlightStyle(dark: boolean): TagStyle[] {
  const p = dark
    ? { ink: '#cdd6f4', muted: '#a0a6b8', teal: '#7dd3c7', blue: '#93b4fa', violet: '#c4b5fd', amber: '#f0c78a', rose: '#f2a7c4' }
    : { ink: '#334155', muted: '#64748b', teal: '#0f766e', blue: '#1d4ed8', violet: '#6d28d9', amber: '#92400e', rose: '#9d174d' };
  return [
    { tag: [t.punctuation, t.brace, t.squareBracket, t.operator, t.contentSeparator], color: p.muted },
    { tag: t.tagName, color: p.teal, fontWeight: '600' },
    { tag: [t.meta, t.keyword, t.attributeName, t.typeName, t.processingInstruction, t.bool], color: p.violet },
    { tag: [t.className, t.propertyName, t.function(t.name)], color: p.blue },
    { tag: [t.number, t.color, t.special(t.monospace)], color: p.amber },
    { tag: [t.function(t.keyword), t.special(t.keyword)], color: p.violet },
    { tag: t.string, color: p.teal },
    { tag: t.heading, color: p.ink, fontWeight: '700' },
    { tag: t.strong, fontWeight: '700' },
    { tag: t.emphasis, fontStyle: 'italic' },
    { tag: t.monospace, color: p.ink },
    { tag: t.link, color: p.blue, textDecoration: 'underline' },
    { tag: t.url, color: p.teal },
    { tag: t.list, color: p.muted, fontWeight: '600' },
    { tag: [t.quote, t.comment], color: p.muted, fontStyle: 'italic' },
    { tag: t.escape, color: p.muted },
    { tag: t.variableName, color: p.blue },
    { tag: t.inserted, color: p.rose },
    { tag: t.deleted, color: p.rose, textDecoration: 'line-through' },
    { tag: t.strikethrough, textDecoration: 'line-through' },
  ];
}

export const taildownHighlightStyle = highlightStyle(false);
export const taildownDarkHighlightStyle = highlightStyle(true);
