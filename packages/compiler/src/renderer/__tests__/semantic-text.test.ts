import {expect,it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';
import {generateColorPaletteCSS,getLightModeColors,getDarkModeColors} from '../../themes/color-palette';
import {getDefaultConfig} from '../../config/default-config';
import {getAuthoringReference} from '../../authoring-reference';

it('keeps selected tab labels readable in plain and filled variants across themes', async () => {
  const config = getDefaultConfig();
  const result = await compile(':::tabs\n## First\nContent\n## Second\nMore\n:::');
  expect(result.css).toContain('.tab-button[aria-selected="true"] {\n  color: var(--primary-text);');
  expect(result.css).toContain('.tabs-pills .tab-button[aria-selected="true"] {\n  background: var(--primary);\n  color: var(--primary-foreground);');
  const palette = generateColorPaletteCSS(config);
  const textColors = [...palette.matchAll(/--primary-text:\s*([^;]+);/g)].map(match => match[1]!);
  [getLightModeColors(config), getDarkModeColors(config)].forEach((theme, index) => {
    expect(contrast(textColors[index]!, theme.card)).toBeGreaterThanOrEqual(4.5);
    expect(contrast(theme.primaryForeground, theme.primary)).toBeGreaterThanOrEqual(4.5);
  });
});

it('treats error and destructive as the same button variant in compilation and authoring references', async () => {
  const result = await compile('[Error](#){button error}\n\n[Destructive](#){button destructive}\n\n[Override](#){button error text-white}');
  const dom = new JSDOM(result.html);
  try {
    const links = [...dom.window.document.querySelectorAll('a')];
    expect(links[0]!.className).toBe(links[1]!.className);
    expect(links[0]!.classList.contains('bg-error')).toBe(true);
    expect(links[0]!.classList.contains('text-error-foreground')).toBe(true);
    expect(links[2]!.classList.contains('text-white')).toBe(true);
    expect(links[2]!.classList.contains('text-error-foreground')).toBe(false);
    const reference = await getAuthoringReference();
    expect(reference.components.find(component=>component.name==='button')?.attributes).toEqual(expect.arrayContaining(['error','destructive']));
    expect(result.metadata.warnings).toEqual([]);
  } finally {dom.window.close();}
});

const luminance = (hex:string) => {
  const rgb = hex.replace('#','').match(/../g)!.map(part=>parseInt(part,16)/255).map(value=>value<=0.04045 ? value/12.92 : ((value+0.055)/1.055)**2.4);
  return rgb[0]!*0.2126+rgb[1]!*0.7152+rgb[2]!*0.0722;
};
const contrast = (a:string,b:string) => (Math.max(luminance(a),luminance(b))+0.05)/(Math.min(luminance(a),luminance(b))+0.05);

it('keeps alert text readable against its translucent surface in either theme', async () => {
  const result = await compile(':::alert{warning}\nFirst paragraph.\n\nSecond paragraph.\n:::',{inlineStyles:true});
  const config = getDefaultConfig();
  const palette = generateColorPaletteCSS(config);
  for(const name of ['success','warning','error','info']) {
    const colors = [...palette.matchAll(new RegExp(`--${name}-text:\\s*([^;]+);`,'g'))].map(match=>match[1]!);
    const rules = [...result.css!.matchAll(new RegExp(`\\.alert-${name} \\{([^}]+)\\}`,'g'))].map(match=>match[1]!);
    expect(rules).toHaveLength(2);
    [getLightModeColors(config),getDarkModeColors(config)].forEach((theme,index)=>{
      expect(rules[index]).toContain(`color: var(--${name}-text)`);
      const rgba = rules[index]!.match(/background: rgba\(([^)]+)\)/)![1]!.split(',').map(Number);
      for(const base of [theme.background,theme.card]) {
        const channels = base.slice(1).match(/../g)!.map(part=>parseInt(part,16));
        const blended = '#'+channels.map((value,channel)=>Math.round(rgba[channel]!*rgba[3]!+value*(1-rgba[3]!)).toString(16).padStart(2,'0')).join('');
        expect(contrast(colors[index]!,blended),`${name} alert ${index} over ${base}`).toBeGreaterThanOrEqual(4.5);
      }
    });
  }
});

it('provides readable status text and status background pairs in both themes', async () => {
  const names = ['success','warning','error','info'] as const;
  const config = getDefaultConfig();
  const css = generateColorPaletteCSS(config);
  for (const name of names) {
    const shades = [...css.matchAll(new RegExp(`--${name}-text:\\s*([^;]+);`,'g'))].map(match=>match[1]!);
    expect(shades).toHaveLength(2);
    [getLightModeColors(config),getDarkModeColors(config)].forEach((theme,index)=>{
      expect(contrast(shades[index]!,theme.background), `${name} page ${index}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(shades[index]!,theme.card), `${name} card ${index}`).toBeGreaterThanOrEqual(4.5);
      expect(contrast(theme[name],theme[`${name}Foreground`]), `${name} pair ${index}`).toBeGreaterThanOrEqual(4.5);
    });
  }
  const result = await compile(names.map(name=>`Text ${name} {${name}}\n\n:icon[check]{${name}}\n\nPair ${name} {${name}-bg}\n\n[Action ${name}](#){button ${name === 'error' ? 'destructive' : name}}`).join('\n\n')+'\n\nLarge {large-warning}\n\nFixed {text-yellow-600}\n\nOverride {warning-bg text-white}', {inlineStyles:true});
  const dom = new JSDOM(result.html);
  try {
    const document = dom.window.document;
    for(const name of names) {
      expect(document.querySelector(`p.text-${name}`)?.textContent).toBe(`Text ${name}`);
      expect(document.querySelector(`svg.text-${name}`)).not.toBeNull();
      expect(document.querySelector(`p.bg-${name}.text-${name}-foreground`)?.textContent).toBe(`Pair ${name}`);
      expect(document.querySelector(`a.bg-${name}.text-${name}-foreground`)).not.toBeNull();
    }
    expect(document.querySelector('p.text-lg.text-warning')?.textContent).toBe('Large');
    expect(document.querySelector('p.text-yellow-600')?.textContent).toBe('Fixed');
    expect(document.querySelector('p.bg-warning.text-white')?.classList.contains('text-warning-foreground')).toBe(false);
    expect(result.metadata.warnings).toEqual([]);
  } finally {dom.window.close();}
});

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
