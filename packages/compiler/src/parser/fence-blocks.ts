import type {Plugin} from 'unified';
import type {Root} from 'mdast';
import type {Extension, Tokenizer, State} from 'micromark-util-types';
import type {Extension as FromMarkdownExtension} from 'mdast-util-from-markdown';
import {parseComponentMarker} from './directive-scanner';
import {decodeString} from 'micromark-util-decode-string';

declare module 'micromark-util-types' {
  interface TokenTypeMap { taildownFence: 'taildownFence'; }
}

// Recognize fences before Markdown can absorb them into a lazy list/quote
// continuation. Markdown itself owns the container prefix and source positions.
const tokenize: Tokenizer = function (effects, ok, nok) {
  let value = '';
  const inside: State = code => {
    if (code === null || code === -3 || code === -4 || code === -5) {
      if (!parseComponentMarker(value)) return nok(code);
      effects.exit('taildownFence');
      return ok(code);
    }
    value += code === -2 || code === -1 ? ' ' : String.fromCharCode(code);
    effects.consume(code);
    return inside;
  };
  return code => {
    effects.enter('taildownFence');
    return inside(code);
  };
};

export const recognizeFenceBlocks: Plugin<[], Root> = function () {
  const data = this.data();
  const syntax: Extension = {flow: {58: {name: 'taildownFence', tokenize}}};
  const fromMarkdown: FromMarkdownExtension = {
    enter: {taildownFence(token) {
      this.enter({type: 'paragraph', children: []}, token);
      this.enter({type: 'text', value: decodeString(this.sliceSerialize(token))}, token);
    }},
    exit: {taildownFence(token) { this.exit(token); this.exit(token); }},
  };
  (data.micromarkExtensions ??= []).push(syntax);
  (data.fromMarkdownExtensions ??= []).push(fromMarkdown);
};
