import {expect,it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';
import {generateColorPaletteCSS,getLightModeColors,getDarkModeColors} from '../../themes/color-palette';
import {getDefaultConfig} from '../../config/default-config';

const luminance = (hex:string) => {
  const rgb = hex.replace('#','').match(/../g)!.map(part=>parseInt(part,16)/255).map(value=>value<=0.04045 ? value/12.92 : ((value+0.055)/1.055)**2.4);
  return rgb[0]!*0.2126+rgb[1]!*0.7152+rgb[2]!*0.0722;
};
const contrast = (a:string,b:string) => (Math.max(luminance(a),luminance(b))+0.05)/(Math.min(luminance(a),luminance(b))+0.05);

it('uses semantic text tokens across headings, prose, icons and components while keeping numbered overrides literal', async () => {
  const result = await compile('# Heading {primary}\n\nProse {secondary}\n\n:icon[star]{accent}\n\n:::card{primary}\nCard\n:::\n\nFixed {text-primary-600}\n\nOverride {primary text-white}', {inlineStyles:true});
  const dom = new JSDOM(result.html);
  try {
    const document = dom.window.document;
    expect(document.querySelector('h1')?.classList.contains('text-primary')).toBe(true);
    expect(document.querySelector('p.text-secondary')?.textContent).toBe('Prose');
    expect(document.querySelector('svg.text-accent')).not.toBeNull();
    expect(document.querySelector('.component-card.text-primary')).not.toBeNull();
    expect(document.querySelector('p.text-primary-600')?.textContent).toBe('Fixed');
    expect(document.querySelector('p.text-white')?.classList.contains('text-primary')).toBe(false);
    expect(result.css).toContain('.hover\\:text-primary-hover:hover { color: var(--primary-text-hover); }');
    expect(result.metadata.warnings).toEqual([]);
  } finally {dom.window.close();}
});

it('provides readable normal and hover semantic text on both default document surfaces', () => {
  const config = getDefaultConfig();
  const css = generateColorPaletteCSS(config);
  for(const name of ['primary','secondary','accent']) {
    for(const suffix of ['text','text-hover']) {
      const shades = [...css.matchAll(new RegExp(`--${name}-${suffix}:\\s*([^;]+);`,'g'))].map(match=>match[1]!);
      expect(shades).toHaveLength(2);
      [getLightModeColors(config),getDarkModeColors(config)].forEach((theme,index)=>{
        expect(contrast(shades[index]!,theme.background),`${name}/${suffix} background ${index}`).toBeGreaterThanOrEqual(4.5);
        expect(contrast(shades[index]!,theme.card),`${name}/${suffix} card ${index}`).toBeGreaterThanOrEqual(4.5);
      });
    }
  }
});

it('gives inline code a readable foreground/background pair in both themes', () => {
  const css = generateColorPaletteCSS(getDefaultConfig());
  const values = (name:string) => [...css.matchAll(new RegExp(`--inline-code-${name}:\\s*([^;]+);`,'g'))].map(match=>match[1]!);
  const text = values('text');
  const backgrounds = values('background');
  expect(text).toHaveLength(2);
  expect(backgrounds).toHaveLength(2);
  text.forEach((color,index)=>expect(contrast(color,backgrounds[index]!)).toBeGreaterThanOrEqual(4.5));
});

it('keeps muted text readable on both page and card surfaces', async () => {
  const config = getDefaultConfig();
  for(const theme of [getLightModeColors(config),getDarkModeColors(config)]) {
    expect(contrast(theme.mutedForeground,theme.background)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.mutedForeground,theme.card)).toBeGreaterThanOrEqual(4.5);
  }
  const result = await compile('Plain {muted}\n\nLarge {large-muted}\n\nSmall {small-muted}\n\nBold {bold-muted}\n\nItalic {italic-muted}\n\nFixed {text-gray-500}', {inlineStyles:true});
  const dom = new JSDOM(result.html);
  try {
    expect([...dom.window.document.querySelectorAll('p.text-muted-foreground')].map(n=>n.textContent)).toEqual(['Plain','Large','Small','Bold','Italic']);
    expect(dom.window.document.querySelector('p.text-gray-500')?.textContent).toBe('Fixed');
    expect(result.metadata.warnings).toEqual([]);
  } finally {dom.window.close();}
});
