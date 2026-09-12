import {expect, it} from 'vitest';
import {taildownHighlightStyle, taildownDarkHighlightStyle} from '../taildown-highlight-style';

function luminance(hex: string): number {
  const channels = hex.slice(1).match(/../g)!.map(value => {
    const channel = parseInt(value, 16) / 255;
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return channels.reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index]!, 0);
}

it.each([
  ['light editor', taildownHighlightStyle, '#ffffff'],
  ['light active line', taildownHighlightStyle, '#f8fafc'],
  ['dark editor', taildownDarkHighlightStyle, '#1e1e2e'],
  ['exported code', taildownDarkHighlightStyle, '#0f172a'],
] as const)('keeps colored syntax readable on %s', (_, styles, background) => {
  for (const style of styles) {
    if (typeof style.color !== 'string') continue;
    const a = luminance(style.color);
    const b = luminance(background);
    const contrast = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    expect(contrast, style.color).toBeGreaterThanOrEqual(4.5);
  }
});
