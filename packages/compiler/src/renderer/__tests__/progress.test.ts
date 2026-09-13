import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';
import {getAuthoringReference} from '../../authoring-reference';

it.each([false, true])('renders native progress and preserves rich visible labels (minify=%s)', async minify => {
  const result = await compile(':::progress {value="35.5" max="80" lg striped id="report"}\nPreparing **the report**\n:::', {minify});
  const doc = new JSDOM(result.html).window.document;
  const bar = doc.querySelector('progress')!;
  expect(bar.value).toBe(35.5);
  expect(bar.max).toBe(80);
  expect(bar.id).toBe('report');
  expect(bar.classList.contains('h-4')).toBe(true);
  expect(bar.classList.contains('progress-striped')).toBe(true);
  expect(bar.children).toHaveLength(0);
  expect(doc.getElementById(bar.getAttribute('aria-labelledby')!)?.querySelector('strong')?.textContent).toBe('the report');
  expect(result.metadata.warnings).toEqual([]);
});

it.each(['0', '0.5', '100'])('accepts value %s with the default maximum and visible size', async value => {
  const result = await compile(`:::progress {value="${value}" aria-label="Download"}\n:::`);
  const bar = new JSDOM(result.html).window.document.querySelector('progress')!;
  expect(bar.value).toBe(Number(value));
  expect(bar.getAttribute('max')).toBe('100');
  expect(bar.classList.contains('h-3')).toBe(true);
  expect(bar.getAttribute('aria-label')).toBe('Download');
  expect(result.metadata.warnings).toEqual([]);
});

it.each(['value="-1"', 'value="101"', 'value="Infinity"', 'value="NaN"', 'value=""', 'max="0"', 'max="-3"', 'max="Infinity"'])('warns at source and renders invalid %s indeterminate', async attributes => {
  const result = await compile(`Intro\n\n:::progress {${attributes}}\nDownload\n:::`);
  const bar = new JSDOM(result.html).window.document.querySelector('progress')!;
  expect(bar.hasAttribute('value')).toBe(false);
  expect(result.metadata.warnings.length).toBeGreaterThan(0);
  expect(result.metadata.warnings.every(w => w.line === 3 && w.column === 1)).toBe(true);
});

it('supports named indeterminate states and warns about conflicting or missing information', async () => {
  for (const attrs of ['aria-label="Download"', 'indeterminate aria-labelledby="label"']) {
    const result = await compile(`## Download {#label}\n\n:::progress {${attrs}}\n:::`);
    expect(new JSDOM(result.html).window.document.querySelector('progress')?.hasAttribute('value')).toBe(false);
    expect(result.metadata.warnings).toEqual([]);
  }
  const conflict = await compile(':::progress {indeterminate value="40"}\nDownload\n:::');
  expect(new JSDOM(conflict.html).window.document.querySelector('progress')?.hasAttribute('value')).toBe(false);
  expect(conflict.metadata.warnings[0]?.message).toContain('ignores');
  const unnamed = await compile(':::progress\n:::');
  expect(unnamed.metadata.warnings[0]?.message).toContain('label');
});

it('preserves configured defaults and shares a working authoring example', async () => {
  const options = {componentConfig: {progress: {defaultSize: 'large', defaultVariant: 'brand', sizes: {large: {classes: ['h-6']}}, variants: {brand: {classes: ['text-success']}}}}};
  const reference = await getAuthoringReference(options);
  const progress = reference.components.find(c => c.name === 'progress')!;
  expect(progress.example).toContain('value="35"');
  const result = await compile(progress.example!, options);
  const bar = new JSDOM(result.html).window.document.querySelector('progress')!;
  expect(bar.value).toBe(35);
  expect(bar.classList.contains('h-6')).toBe(true);
  expect(bar.classList.contains('text-success')).toBe(true);
  expect(result.metadata.warnings).toEqual([]);
});
it('honors indeterminate presets and associates labels when empty ARIA attributes are supplied', async () => {
  const result = await compile(':::progress {value="25" aria-label="   " aria-labelledby=" "}\nPreparing\n:::', {componentConfig: {progress: {defaultVariant: 'indeterminate'}}});
  const doc = new JSDOM(result.html).window.document;
  const bar = doc.querySelector('progress')!;
  expect(bar.hasAttribute('value')).toBe(false);
  expect(bar.hasAttribute('aria-label')).toBe(false);
  expect(doc.getElementById(bar.getAttribute('aria-labelledby')!)?.textContent).toBe('Preparing');
  expect(result.metadata.warnings[0]?.message).toContain('ignores');
});

it('warns when non-text body content does not name the progress', async () => {
  const result = await compile(':::progress\n---\n:::');
  expect(result.metadata.warnings[0]?.message).toContain('label');
});
