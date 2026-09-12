import { StreamLanguage, LanguageSupport } from '@codemirror/language';
import type {StreamParser} from '@codemirror/language';
import {inlineCodeHighlighting} from './inline-code-decoration';

interface TaildownStreamState {
  codeBlockFence: string;
  codeQuoteDepth: number;
  inAttributes: boolean;
  attributeValue: boolean;
  inlineDirective: string;
  heading: boolean;
  contentStart: number;
  comment: boolean;
}

// Consume complete attribute words before classifying them, so a shorter keyword
// cannot split a compound such as padded-lg or bold-primary.
const attributeGroups: ReadonlyArray<readonly [string, ReadonlySet<string>]> = [
  ['className', new Set('primary secondary accent success warning error info muted ghost link destructive'.split(' '))],
  ['number', new Set('xs tiny small sm md base large lg xl 2xl 3xl huge massive'.split(' '))],
  ['keyword.function', new Set('fade-in slide-up slide-down slide-left slide-right zoom-in scale-in hover-lift hover-glow hover-scale hover-grow fast smooth slow auto-play'.split(' '))],
  ['typeName', new Set('bold italic thin light medium semibold extra-bold black uppercase lowercase capitalize underline strike huge-bold large-bold xl-bold massive-bold bold-primary large-muted small-light xl-muted huge-muted tight-lines normal-lines relaxed-lines loose-lines'.split(' '))],
  ['propertyName', new Set('center left right justify flex grid inline block padded padded-sm padded-lg padded-xl gap gap-sm gap-lg gap-xl center-x center-y center-both flex-center grid-2 grid-3 grid-4'.split(' '))],
  ['attributeName', new Set('rounded rounded-sm rounded-lg rounded-xl rounded-full shadow shadow-sm shadow-lg shadow-xl elevated floating glass subtle-glass light-glass heavy-glass outlined bordered'.split(' '))],
  ['keyword', new Set('button badge alert modal tooltip details callout columns definitions stats divider steps video interactive table compare-images diff footnotes mermaid timeline task tasks task-list sortable zebra sticky-header compact side-by-side unified vertical horizontal centered milestone in-progress blocked high low'.split(' '))],
];

// Match Markdown's Unicode-aware delimiter flanking. Symbols count as
// punctuation here, as in the compiler's micromark character classifier.
function underscoreDelimiter(source: string, start: number, end: number) {
  const before = source.slice(Math.max(0, start - 2), start).match(/.$/u)?.[0] ?? '';
  const after = source.slice(end, end + 2).match(/^./u)?.[0] ?? '';
  const beforeSpace = !before || /\s/u.test(before);
  const afterSpace = !after || /\s/u.test(after);
  const beforePunctuation = /[\p{P}\p{S}]/u.test(before);
  const afterPunctuation = /[\p{P}\p{S}]/u.test(after);
  const left = !afterSpace && (!afterPunctuation || beforeSpace || beforePunctuation);
  const right = !beforeSpace && (!beforePunctuation || afterSpace || afterPunctuation);
  return {open: left && (!right || beforePunctuation), close: right && (!left || afterPunctuation)};
}

const taildownParser: StreamParser<TaildownStreamState> = {
  name: 'taildown',
  startState: () => ({codeBlockFence: '', codeQuoteDepth: 0, inAttributes: false, attributeValue: false, inlineDirective: '', heading: false, contentStart: 0, comment: false}),
  token(stream, state) {
    if (stream.sol()) {
      state.inAttributes = false;
      state.attributeValue = false;
      state.inlineDirective = '';
      state.heading = false;
      // Markdown containers allow Taildown components after indentation, quote,
      // and list prefixes. Keep the prefix itself as Markdown punctuation.
      const prefix = stream.string.match(/^ {0,3}(?:>\s*)*(?:(?:[-+*]|\d+[.)])\s+)?/);
      state.contentStart = prefix?.[0].length ?? 0;
    }
    if (state.codeBlockFence) {
      const quotes = '(?:>[\\t ]*)'.repeat(state.codeQuoteDepth);
      const closing = new RegExp(`^ {0,3}${quotes}${state.codeBlockFence[0]}{${state.codeBlockFence.length},}[\\t ]*$`);
      if (stream.sol() && closing.test(stream.string)) {
        stream.skipToEnd();
        state.codeBlockFence = '';
        return 'processingInstruction';
      }
      stream.skipToEnd();
      return 'monospace';
    }
    if (state.comment) {
      const end = stream.string.indexOf('-->', stream.pos);
      if (end < 0) stream.skipToEnd();
      else {stream.pos = end + 3; state.comment = false;}
      return 'comment';
    }
    if (stream.match(/^<!--[\s\S]*?-->/)) return 'comment';
    if (stream.pos === state.contentStart && stream.match('<!--')) {state.comment = true; stream.skipToEnd(); return 'comment';}
    if (stream.match(/^\\[!"#$%&'()*+,\-./:;<=>?@[\]\\^_`{|}~]/)) {
      state.inlineDirective = '';
      return 'escape';
    }
    if (stream.pos < state.contentStart) {
      const prefix = stream.string.slice(stream.pos, state.contentStart);
      stream.pos = state.contentStart;
      return prefix.includes('>') ? 'quote' : /[-+*\d]/.test(prefix) ? 'list' : null;
    }
    if (stream.pos === state.contentStart) {
      const opening = stream.match(/^(`{3,}|~{3,})(.*)$/, false);
      if (opening && typeof opening !== 'boolean' && opening[1] && !(opening[1][0] === '`' && opening[2]?.includes('`'))) {
        state.codeBlockFence = opening[1];
        state.codeQuoteDepth = (stream.string.slice(0, state.contentStart).match(/>/g) ?? []).length;
        stream.skipToEnd();
        return /^(mermaid|before|after)(?:\s|$)/.test(opening[2]?.trim() ?? '') ? 'keyword.special' : 'processingInstruction';
      }
      if (stream.match(/^:::[a-z][a-z0-9-]*(?=[\s{]|$)/)) return 'tagName';
      if (stream.match(/^:::[\t ]*$/)) return 'punctuation';
      if (stream.match(/^#{1,6}(?:\s+|$)/)) {state.heading = true; return 'heading';}
      if (stream.match(/^(?:-{3,}|\*{3,}|_{3,})\s*$/)) return 'contentSeparator';
      if (stream.match(/^\[\^[^\]\s]+\]:/)) return 'link';
      if (stream.match(/^\[[x ~-]\](?=\s|$)/i) && /(?:[-+*]|\d+[.)])\s+$/.test(stream.string.slice(0, state.contentStart))) return 'bool';
    }
    // Inline code shields Taildown syntax, including matching multi-backtick runs.
    const inlineFence = stream.match(/^`+/, false);
    if (inlineFence && typeof inlineFence !== 'boolean') {
      const length = inlineFence[0].length;
      for (const closing of stream.string.slice(stream.pos + length).matchAll(/`+/g)) {
        if (closing[0].length === length) {stream.pos += length + closing.index + length; return 'monospace';}
      }
      stream.pos += length;
      return null;
    }
    if (state.inAttributes) {
      if (stream.match('}')) {state.inAttributes = false; state.attributeValue = false; return 'brace';}
      if (stream.match(/^\s+/)) return null;
      if (stream.match(/^[a-zA-Z][\w-]*(?=\s*=)/)) return 'attributeName';
      if (stream.match('=')) {state.attributeValue = true; return 'operator';}
      if (stream.match(/^(?:"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/)) {state.attributeValue = false; return 'string';}
      if (stream.match(/^\.[\w-]+/)) return 'className';
      const word = stream.match(/^[^\s{}="']+/);
      if (word && typeof word !== 'boolean') {
        const text = word[0];
        const value = state.attributeValue;
        state.attributeValue = false;
        if (/^\d+(?:\.\d+)?(?:px|rem|em|%|ms|s)?$/.test(text)) return 'number';
        if (/^#[\da-fA-F]{3,8}$/.test(text)) return 'color';
        if (value) return 'string';
        return attributeGroups.find(([, words]) => words.has(text))?.[0] ?? 'meta';
      }
      stream.next();
      return 'meta';
    }
    if (state.inlineDirective) {
      const directive = state.inlineDirective;
      state.inlineDirective = '';
      if (stream.match(/^\[[^\]\n]+\]/)) return directive === 'icon' ? 'name.function' : 'string';
    }
    const directive = stream.match(/^:(icon|badge|kbd)(?=\[[^\]\n]+\])/);
    if (directive && typeof directive !== 'boolean') {state.inlineDirective = directive[1] ?? ''; return 'keyword';}
    // Attribute state is confined to one line, including while a user is typing
    // an unfinished block. Escaped openers have already been consumed above.
    if (stream.match('{')) {state.inAttributes = true; return 'brace';}
    if (stream.match(/^\[\^[^\]\s]+\]/)) return 'link';
    if (stream.match(/^!?\[(?:\\.|[^\]\\])+\]\((?:\\.|[^)\\]|\([^)]*\))*\)/)) return 'link';
    if (stream.match(/^!?\[(?:\\.|[^\]\\])+\]\[[^\]]*\]/)) return 'link';
    if (stream.peek() === '_') {
      const candidate = stream.match(/^(__?)([^_]+)\1/, false);
      if (candidate && typeof candidate !== 'boolean' && candidate[1]) {
        const length = candidate[1].length;
        const end = stream.pos + candidate[0].length;
        if (underscoreDelimiter(stream.string, stream.pos, stream.pos + length).open &&
            underscoreDelimiter(stream.string, end - length, end).close) {
          stream.pos = end;
          return length === 2 ? 'strong' : 'emphasis';
        }
      }
      // Keep an invalid run intact; its second underscore is not a new opener.
      stream.match(/^_+/);
      return state.heading ? 'heading' : null;
    }
    if (stream.match(/^\*\*[^*]+\*\*/)) return 'strong';
    if (stream.match(/^\*[^*]+\*/)) return 'emphasis';
    if (stream.match(/^~~[^~]+~~/)) return 'strikethrough';
    if (stream.match(/^\$\$[^$]+\$\$|^\$[^$\n]+\$/)) return 'monospace.special';
    if (stream.match(/^==[^=]+==(?:\{[^}]+\})?/)) return 'inserted';
    if (stream.match('|')) return 'punctuation';
    stream.next();
    return state.heading ? 'heading' : null;
  },
  languageData: {
    name: 'taildown', extensions: ['.td', '.tdown', '.taildown'],
    commentTokens: {block: {open: '<!--', close: '-->'}},
    indentOnInput: /^\s*:::$/,
    closeBrackets: {brackets: ['(', '[', '{', '"', "'"]},
    wordChars: 'a-zA-Z0-9_-',
  },
};

export const taildownLanguage = StreamLanguage.define(taildownParser);
export function taildown(): LanguageSupport {
  return new LanguageSupport(taildownLanguage, [inlineCodeHighlighting]);
}

export { taildownHighlightStyle, taildownDarkHighlightStyle } from './taildown-highlight-style';
