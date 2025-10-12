/**
 * Keyboard Key Parser for Taildown
 * Parses :kbd[key] and :kbd[key+combo] syntax
 * 
 * Syntax:
 * :kbd[Enter] - Single key
 * :kbd[Ctrl+C] - Key combination
 * :kbd[Cmd+Shift+P]{mac} - Platform-specific (Mac symbols)
 * :kbd[Ctrl+Shift+P]{windows} - Platform-specific (Windows labels)
 * 
 * Platform symbols (Mac):
 * - Cmd → ⌘
 * - Opt/Alt → ⌥
 * - Ctrl → ⌃
 * - Shift → ⇧
 * - Enter/Return → ⏎
 * - Delete → ⌫
 * - Tab → ⇥
 */

import { visit } from 'unist-util-visit';
import type { Root, Text } from 'mdast';
import type { Plugin } from 'unified';

/**
 * Keyboard syntax regex
 * Matches :kbd[keys]{optional platform}
 * 
 * Examples:
 * - :kbd[Enter]
 * - :kbd[Ctrl+C]
 * - :kbd[Cmd+Shift+P]{mac}
 */
const KBD_REGEX = /:kbd\[([^\]]+)\](?:\{([^}]+)\})?/g;

/**
 * Platform-specific key mappings
 */
const MAC_SYMBOLS: Record<string, string> = {
  'cmd': '⌘',
  'command': '⌘',
  'opt': '⌥',
  'option': '⌥',
  'alt': '⌥',
  'ctrl': '⌃',
  'control': '⌃',
  'shift': '⇧',
  'enter': '⏎',
  'return': '⏎',
  'delete': '⌫',
  'backspace': '⌫',
  'tab': '⇥',
  'esc': '⎋',
  'escape': '⎋',
  'space': '␣',
  'up': '↑',
  'down': '↓',
  'left': '←',
  'right': '→',
};

const WINDOWS_LABELS: Record<string, string> = {
  'cmd': 'Win',
  'command': 'Win',
  'opt': 'Alt',
  'option': 'Alt',
};

/**
 * Normalize key name for display
 */
function normalizeKey(key: string, platform?: string): string {
  const lower = key.trim().toLowerCase();
  
  // Apply platform-specific transformations
  if (platform === 'mac') {
    return MAC_SYMBOLS[lower] || capitalizeKey(key);
  }
  
  if (platform === 'windows') {
    return WINDOWS_LABELS[lower] || capitalizeKey(key);
  }
  
  // Default: capitalize first letter
  return capitalizeKey(key);
}

/**
 * Capitalize first letter of key name
 */
function capitalizeKey(key: string): string {
  const trimmed = key.trim();
  if (!trimmed) return '';
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

/**
 * Parse platform hint from attributes
 */
function parsePlatform(attrs?: string): 'mac' | 'windows' | undefined {
  if (!attrs) return undefined;
  const lower = attrs.toLowerCase().trim();
  if (lower === 'mac' || lower === 'macos' || lower === 'apple') return 'mac';
  if (lower === 'windows' || lower === 'win') return 'windows';
  return undefined;
}

/**
 * unified plugin to parse :kbd[key] as <kbd> elements
 * 
 * Examples:
 * - :kbd[Enter] → <kbd>Enter</kbd>
 * - :kbd[Ctrl+C] → <kbd>Ctrl</kbd> + <kbd>C</kbd>
 * - :kbd[Cmd+Shift+P]{mac} → <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd>
 */
export const parseKeyboard: Plugin<[], Root> = () => {
  return (tree: Root) => {
    visit(tree, 'text', (node: Text, index, parent) => {
      if (!parent || typeof node.value !== 'string' || !node.value.includes(':kbd[')) return;

      const parts: any[] = [];
      let lastIndex = 0;
      const value = node.value;
      let match: RegExpExecArray | null;

      KBD_REGEX.lastIndex = 0;
      while ((match = KBD_REGEX.exec(value)) !== null) {
        const [full, keys, attrsRaw] = match;
        const start = match.index;
        const end = start + full.length;

        // Preceding text
        if (start > lastIndex) {
          parts.push({ type: 'text', value: value.slice(lastIndex, start) });
        }

        // Parse platform hint
        const platform = parsePlatform(attrsRaw);
        
        // Split key combination on + or - (common separators)
        const keyParts = keys.split(/\s*[+\-]\s*/);
        
        // Create kbd elements for each key
        const kbdNodes: any[] = [];
        
        for (let i = 0; i < keyParts.length; i++) {
          const key = keyParts[i];
          const normalizedKey = normalizeKey(key, platform);
          
          // Add the kbd element
          kbdNodes.push({
            type: 'kbd',
            data: {
              hName: 'kbd',
              hProperties: {
                className: ['kbd-key'],
                'data-platform': platform || 'default',
              },
            },
            children: [{ type: 'text', value: normalizedKey }],
          });
          
          // Add separator between keys (not after last key)
          if (i < keyParts.length - 1) {
            kbdNodes.push({
              type: 'text',
              value: ' ',
            });
          }
        }
        
        // Wrap in a kbd-group span if multiple keys
        if (kbdNodes.length > 1) {
          parts.push({
            type: 'kbdGroup',
            data: {
              hName: 'span',
              hProperties: {
                className: ['kbd-group'],
              },
            },
            children: kbdNodes,
          });
        } else {
          // Single key, add directly
          parts.push(...kbdNodes);
        }
        
        lastIndex = end;
      }

      // Trailing text
      if (lastIndex < value.length) {
        parts.push({ type: 'text', value: value.slice(lastIndex) });
      }

      if (parts.length > 0) {
        // Replace the single text node with multiple nodes
        parent.children.splice(index as number, 1, ...parts);
        return index! + parts.length;
      }
    });
  };
};

