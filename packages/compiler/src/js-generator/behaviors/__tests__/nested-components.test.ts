import { afterEach, expect, it, vi } from 'vitest';
import { JSDOM } from 'jsdom';
import { compile } from '../../../index';
import { tabsBehavior } from '../tabs';
import { accordionBehavior } from '../accordion';
import { carouselBehavior } from '../carousel';

const windows: JSDOM[] = [];
afterEach(() => windows.splice(0).forEach(dom => dom.window.close()));
async function setup(source: string, code: string) {
  const result = await compile(source, {inlineStyles: true});
  const dom = new JSDOM(result.html, {runScripts: 'outside-only', url: 'https://example.test'});
  windows.push(dom);
  dom.window.eval('function getComponents(name) {return document.querySelectorAll(`[data-component="${name}"]`)}; function toggleClass(el, name, enabled) {el.classList.toggle(name, enabled)};' + code);
  return dom.window;
}

it('outer tabs preserve nested tab panel state across switching', async () => {
  const window = await setup(':::tabs\n## Outer one\n:::tabs\n### Inner one\nAlpha\n### Inner two\nBeta\n:::\n## Outer two\nGamma\n:::', tabsBehavior.code);
  const doc = window.document;
  const controls = [...doc.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const click = (text: string) => controls.find(button => button.textContent === text)!.click();
  click('Inner two');
  click('Outer two');
  click('Outer one');
  const selected = controls.find(button => button.textContent === 'Inner two')!;
  expect(selected.getAttribute('aria-selected')).toBe('true');
  expect(doc.getElementById(selected.getAttribute('aria-controls')!)?.hidden).toBe(false);
  expect([...doc.querySelectorAll('[data-component="tabs"]')]).toHaveLength(2);
});

it('reveals keyboard-selected tabs without animated scrolling or moving unrelated tabs', async () => {
  const window = await setup(':::card\n:::tabs\n## First\nAlpha\n## Last\nBeta\n:::\n:::', tabsBehavior.code);
  const buttons = [...window.document.querySelectorAll<HTMLButtonElement>('[role="tab"]')];
  const scroll = vi.fn();
  buttons[1]!.scrollIntoView = scroll;
  buttons[0]!.focus();
  buttons[0]!.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'End', bubbles: true, cancelable: true}));
  expect(window.document.activeElement).toBe(buttons[1]);
  expect(buttons[1]!.getAttribute('aria-selected')).toBe('true');
  expect(scroll).toHaveBeenCalledWith({block: 'nearest', inline: 'nearest', behavior: 'instant'});
  buttons[1]!.dispatchEvent(new window.KeyboardEvent('keydown', {key: 'a', bubbles: true}));
  expect(scroll).toHaveBeenCalledTimes(1);
});

it('nested accordion triggers toggle once without changing their parent', async () => {
  const window = await setup(':::accordion\n\n**Outer**\n\n:::accordion\n\n**Inner**\n\nContent\n\n:::\n\n:::', accordionBehavior.code);
  const triggers = [...window.document.querySelectorAll<HTMLButtonElement>('[data-accordion-trigger]')];
  expect(triggers).toHaveLength(2);
  triggers[1]!.click();
  expect(triggers[1]!.getAttribute('aria-expanded')).toBe('false');
  expect(triggers[0]!.getAttribute('aria-expanded')).toBe('true');
});

it('nested carousel navigation leaves outer slides alone and respects text fields', async () => {
  const window = await setup(':::carousel\nOuter one\n:::carousel\nInner one\n\n---\n\nInner two\n:::\n\n---\n\nOuter two\n:::', carouselBehavior.code);
  const doc = window.document;
  const carousels = [...doc.querySelectorAll<HTMLElement>('[data-component="carousel"]')];
  expect(carousels).toHaveLength(2);
  const outer = carousels[0]!;
  const inner = carousels[1]!;
  inner.querySelector<HTMLButtonElement>('[data-carousel-next]')!.click();
  expect(inner.querySelectorAll<HTMLElement>('[data-carousel-slide]')[1]!.hidden).toBe(false);
  expect(outer.querySelector<HTMLElement>('[data-carousel-slide]')!.hidden).toBe(false);
  const input = doc.createElement('input');
  inner.append(input);
  const key = new window.KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true, cancelable: true});
  input.dispatchEvent(key);
  expect(key.defaultPrevented).toBe(false);
  expect(inner.querySelectorAll<HTMLElement>('[data-carousel-slide]')[1]!.hidden).toBe(false);
});

it.each(['', 'plaintext-only'])('leaves editable %j arrow keys to the editor', async attribute => {
  const window = await setup(':::carousel\nOne\n\n---\n\nTwo\n:::', carouselBehavior.code);
  const carousel = window.document.querySelector('[data-component="carousel"]')!;
  const editor = window.document.createElement('div');
  editor.setAttribute('contenteditable', attribute);
  carousel.append(editor);
  const key = new window.KeyboardEvent('keydown', {key:'ArrowRight',bubbles:true,cancelable:true});
  editor.dispatchEvent(key);
  expect(key.defaultPrevented).toBe(false);
  expect(carousel.querySelector<HTMLElement>('[data-carousel-slide]')!.hidden).toBe(false);
});

it('does not start a carousel drag from a child slider', async () => {
  const window = await setup(':::carousel\nOne\n\n---\n\nTwo\n:::', carouselBehavior.code);
  const carousel = window.document.querySelector('[data-component="carousel"]')!;
  const slider = window.document.createElement('div');
  slider.setAttribute('role', 'slider');
  carousel.append(slider);
  for (const [type, screenX] of [['mousedown',150],['mousemove',50],['mouseup',50]] as const) {
    slider.dispatchEvent(new window.MouseEvent(type,{screenX,bubbles:true,cancelable:true}));
  }
  expect(carousel.querySelector<HTMLElement>('[data-carousel-slide]')!.hidden).toBe(false);
});
