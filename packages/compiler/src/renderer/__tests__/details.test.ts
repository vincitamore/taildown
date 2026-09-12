import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it.each([false, true])('renders the documented details title as a native summary (minify=%s)', async minify => {
  const result = await compile(':::details {bordered open}\n**Before you head out** and *take your time* {#guide-title primary}\n\nKeep the complete body.\n\n- Bring a notebook\n- Stay comfortable\n:::', {minify});
  const document = new JSDOM(result.html).window.document;
  const details = document.querySelector('details');
  const summary = details?.querySelector(':scope > summary');
  expect(details?.firstElementChild).toBe(summary);
  expect(summary?.textContent).toBe('Before you head out and take your time');
  expect(summary?.querySelector('strong')?.textContent).toBe('Before you head out');
  expect(summary?.querySelector('em')?.textContent).toBe('take your time');
  expect(summary?.id).toBe('guide-title');
  expect(summary?.classList.contains('text-primary')).toBe(true);
  expect(details?.open).toBe(true);
  expect(details?.querySelector(':scope > p')?.textContent).toBe('Keep the complete body.');
  expect(details?.querySelectorAll('li')).toHaveLength(2);
  expect(result.metadata.warnings).toEqual([]);
});
it('preserves a heading title and its attributes inside the summary', async () => {
  const result = await compile(':::details\n### A **useful** question {#question primary}\n\nThe full answer.\n:::');
  const details = new JSDOM(result.html).window.document.querySelector('details');
  const heading = details?.querySelector(':scope > summary > h3');
  expect(heading?.id).toBe('question');
  expect(heading?.classList.contains('text-primary')).toBe(true);
  expect(heading?.querySelector('strong')?.textContent).toBe('useful');
  expect(details?.open).toBe(false);
  expect(details?.querySelector(':scope > p')?.textContent).toBe('The full answer.');
});
it('retains all body nodes when the leading block cannot serve as a title', async () => {
  const result = await compile(':::details\n- Keep this item\n\nThe title\n\nThe answer\n:::');
  const details = new JSDOM(result.html).window.document.querySelector('details');
  expect(details?.firstElementChild?.tagName).toBe('SUMMARY');
  expect(details?.querySelector('summary')?.textContent).toBe('Details');
  expect(details?.querySelector('li')?.textContent).toBe('Keep this item');
  expect(Array.from(details?.querySelectorAll(':scope > p') ?? [], paragraph => paragraph.textContent)).toEqual(['The title', 'The answer']);
});
it.each(['', '- A list without a title', '#'])('provides an explicit default summary without losing body content: %s', async body => {
  const result = await compile(`:::details\n${body}\n:::`);
  const details = new JSDOM(result.html).window.document.querySelector('details');
  expect(details?.querySelector(':scope > summary')?.textContent).toBe('Details');
  if (body.startsWith('-')) expect(details?.querySelector('li')?.textContent).toBe('A list without a title');
  if (body === '#') expect(details?.querySelector(':scope > h1')).not.toBeNull();
});
it.each([false, true])('keeps nested details summaries and open state independent (minify=%s)', async minify => {
  const result = await compile(':::details\n**Outer question**\n\nOuter introduction.\n\n:::details {open}\n**Inner question**\n\nInner answer.\n:::\n\nOuter conclusion.\n:::', {minify});
  const document = new JSDOM(result.html).window.document;
  const outer = document.querySelector('details');
  const inner = outer?.querySelector('details');
  expect(outer?.querySelector(':scope > summary')?.textContent).toBe('Outer question');
  expect(inner?.querySelector(':scope > summary')?.textContent).toBe('Inner question');
  expect(outer?.open).toBe(false);
  expect(inner?.open).toBe(true);
  expect(outer?.textContent).toContain('Outer introduction.');
  expect(outer?.textContent).toContain('Outer conclusion.');
  expect(inner?.textContent).toContain('Inner answer.');
  expect(document.querySelectorAll('summary')).toHaveLength(2);
});
