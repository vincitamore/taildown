import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { compile } from '../../index';

it.each([false, true])('renders the documented bold-heading accordion syntax (minify=%s)', async minify => {
  const source = ':::accordion\n**First Section**\nFirst body\n\n**Second Section**\nSecond body\n\n**Third Section**\nThird body\n:::';
  const {html} = await compile(source, {minify});
  const doc = new JSDOM(html).window.document;
  const triggers = [...doc.querySelectorAll('[data-accordion-trigger]')];
  expect(triggers.map(trigger => trigger.textContent)).toEqual(['First Section','Second Section','Third Section']);
  expect([...doc.querySelectorAll('[data-accordion-content]')].map(panel => panel.textContent)).toEqual(['First body','Second body','Third body']);
  for (const trigger of triggers) {
    const panel = doc.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel?.getAttribute('aria-labelledby')).toBe(trigger.id);
    expect(trigger.querySelector('p, h1, h2, h3, h4, h5, h6')).toBeNull();
  }
});

it('keeps legacy horizontal-rule sections and inline label formatting', async () => {
  const {html} = await compile(':::accordion\nFirst *label*\n\nFirst body\n\n---\n\nSecond label\n\nSecond body\n:::');
  const doc = new JSDOM(html).window.document;
  expect([...doc.querySelectorAll('[data-accordion-trigger]')].map(node => node.textContent)).toEqual(['First label','Second label']);
  expect(doc.querySelector('[data-accordion-trigger] em')?.textContent).toBe('label');
});

it('keeps compact nested bodies out of trigger labels', async () => {
  const {html} = await compile(':::accordion\n**Outer**\n:::accordion\n**Inner**\nContent\n:::\n:::');
  const doc = new JSDOM(html).window.document;
  expect([...doc.querySelectorAll('[data-accordion-trigger]')].map(node => node.textContent)).toEqual(['Outer','Inner']);
  expect(doc.querySelectorAll('[data-accordion-content]')[1]?.textContent).toBe('Content');
});

it('lets explicit separators preserve bold body paragraphs and complete labels', async () => {
  const {html} = await compile(':::accordion\n**First** *label*\n\n**Important:** body note\n\n---\n\nSecond label\n\nSecond body\n:::');
  const doc = new JSDOM(html).window.document;
  expect([...doc.querySelectorAll('[data-accordion-trigger]')].map(node => node.textContent)).toEqual(['First label', 'Second label']);
  expect(doc.querySelector('[data-accordion-content]')?.textContent).toBe('Important: body note');
  expect(doc.querySelector('[data-accordion-trigger] em')?.textContent).toBe('label');
});

it('keeps link labels readable without nesting interactive content inside buttons', async () => {
  const {html} = await compile(':::accordion\n**[First](https://example.com) ![badge](badge.png)**\nBody\n:::');
  const trigger = new JSDOM(html).window.document.querySelector('[data-accordion-trigger]')!;
  expect(trigger.textContent).toBe('First badge');
  expect(trigger.querySelector('a, button, input, select, textarea, [tabindex], p')).toBeNull();
});
