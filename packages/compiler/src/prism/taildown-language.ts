/**
 * Prism.js Taildown Language Definition
 * For syntax highlighting Taildown code blocks
 * 
 * Pattern Order: Most specific patterns first, then fallbacks
 */

/**
 * Taildown language definition for Prism.js
 * Highlights component blocks, icons, inline attributes, and plain English shorthands
 */
export const taildownLanguage = {
  // Component fence markers (must be first to be recognized)
  'fence': {
    pattern: /^:::$/m,
    alias: 'punctuation',
  },
  
  // Component opening line: :::card {variant size}
  'component-open': {
    pattern: /^:::([a-z][a-z0-9-]*)(?:\s+(\{[^}]*\}))?/m,
    inside: {
      'fence': {
        pattern: /^:::/,
        alias: 'punctuation',
      },
      'component-name': {
        pattern: /[a-z][a-z0-9-]+/,
        alias: 'tag',
      },
      'attributes': {
        pattern: /\{[^}]*\}/,
        inside: {
          'punctuation': /[{}]/,
          'variant': {
            pattern: /\b(?:primary|secondary|accent|success|warning|error|info|elevated|floating|outlined|flat|bordered|interactive|glass|subtle-glass|light-glass|heavy-glass|ghost|link|destructive)\b/,
            alias: 'keyword',
          },
          'size': {
            pattern: /\b(?:xs|tiny|small|sm|md|large|lg|xl|2xl|3xl|huge|massive)\b/,
            alias: 'constant',
          },
          'animation': {
            pattern: /\b(?:fade-in|slide-up|slide-down|slide-left|slide-right|zoom-in|scale-in|hover-lift|hover-glow|hover-scale)\b/,
            alias: 'function',
          },
          'typography': {
            pattern: /\b(?:bold|italic|thin|light|medium|semibold|extra-bold|black|uppercase|lowercase|capitalize|underline|strike|huge-bold|large-bold|bold-primary|large-muted|small-light|xl-bold)\b/,
            alias: 'property',
          },
          'layout': {
            pattern: /\b(?:center|left|right|justify|flex|grid|inline|block|padded|padded-sm|padded-lg|padded-xl|gap|gap-sm|gap-lg|gap-xl)\b/,
            alias: 'variable',
          },
          'decoration': {
            pattern: /\b(?:rounded|rounded-sm|rounded-lg|rounded-full|shadow|shadow-sm|shadow-lg|shadow-xl)\b/,
            alias: 'attr-name',
          },
          'spacing': {
            pattern: /\b(?:tight-lines|normal-lines|relaxed-lines|loose-lines)\b/,
            alias: 'attr-value',
          },
        },
      },
    },
  },
  
  // Icon syntax: :icon[name]{classes}
  'icon': {
    pattern: /:icon\[[a-z][a-z0-9-]*\](?:\{[^}]*\})?/,
    inside: {
      'keyword': {
        pattern: /:icon/,
        alias: 'keyword',
      },
      'icon-name': {
        pattern: /\[([a-z][a-z0-9-]*)\]/,
        inside: {
          'punctuation': /[\[\]]/,
          'function': /[a-z][a-z0-9-]+/,
        },
      },
      'attributes': {
        pattern: /\{[^}]*\}/,
        inside: {
          'punctuation': /[{}]/,
          'size': {
            pattern: /\b(?:xs|tiny|sm|small|md|lg|large|xl|2xl|huge)\b/,
            alias: 'constant',
          },
          'color': {
            pattern: /\b(?:primary|secondary|success|warning|error|info|muted)\b/,
            alias: 'keyword',
          },
        },
      },
    },
  },
  
  // Button component on links: {button primary large}
  'button-component': {
    pattern: /\{button\s+[^}]+\}/,
    inside: {
      'punctuation': /[{}]/,
      'keyword': /button/,
      'variant': {
        pattern: /\b(?:primary|secondary|outline|ghost|link|destructive|success|warning)\b/,
        alias: 'keyword',
      },
      'size': {
        pattern: /\b(?:small|sm|large|lg|xl)\b/,
        alias: 'constant',
      },
    },
  },
  
  // Inline attributes: {large-bold primary}
  'inline-attributes': {
    pattern: /\{[^}]+\}/,
    inside: {
      'punctuation': /[{}]/,
      'keyword': {
        pattern: /\b(?:huge|large|xl|2xl|3xl|bold|italic|primary|secondary|success|warning|error|info|muted|center|left|right|rounded|shadow|elevated|floating|padded|gap|huge-bold|large-bold|large-muted|bold-primary|small-light|tight-lines|relaxed-lines|loose-lines)\b/,
      },
    },
  },
  
  // Markdown-style bold
  'bold': {
    pattern: /\*\*(?:(?!\*\*).)+\*\*/,
    inside: {
      'punctuation': /^\*\*|\*\*$/,
    },
  },
  
  // Markdown-style italic
  'italic': {
    pattern: /\*(?:(?!\*).)+\*/,
    inside: {
      'punctuation': /^\*|\*$/,
    },
  },
  
  // Markdown links: [text](url)
  'link': {
    pattern: /\[[^\]]+\]\([^)]+\)/,
    inside: {
      'link-text': {
        pattern: /\[[^\]]+\]/,
        inside: {
          'punctuation': /[\[\]]/,
        },
      },
      'url': {
        pattern: /\([^)]+\)/,
        inside: {
          'punctuation': /[()]/,
        },
      },
    },
  },
  
  // Markdown headings
  'heading': {
    pattern: /^#{1,6}\s.+/m,
    inside: {
      'punctuation': /^#{1,6}/,
    },
  },
  
  // Inline code
  'code': {
    pattern: /`[^`]+`/,
    inside: {
      'punctuation': /^`|`$/,
    },
  },
};

/**
 * Register Taildown language with Prism
 */
export function registerTaildownLanguage(Prism: any): void {
  if (!Prism || !Prism.languages) {
    return;
  }
  
  if (!Prism.languages.taildown) {
    Prism.languages.taildown = taildownLanguage;
    Prism.languages.td = taildownLanguage; // Alias
  }
}
