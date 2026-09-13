import { initializeDivider } from '../divider';
import { JSDOM } from 'jsdom';
import { afterEach, expect, it } from 'vitest';

const windows: JSDOM[] = [];
afterEach(() => {
  for (const dom of windows.splice(0)) dom.window.close();
});
function rectangle(size: number): DOMRect {
  return {
    x: 0,
    y: 0,
    width: size,
    height: size,
    left: 0,
    top: 0,
    right: size,
    bottom: size,
    toJSON: () => ({}),
  };
}
function setup(width = 1000) {
  const dom = new JSDOM(
    '<body><div id="editor-container"><div id="editor-pane"></div><div id="divider" tabindex="0"></div><iframe></iframe></div></body>'
  );
  windows.push(dom);
  const { window } = dom;
  Object.defineProperty(window, 'innerWidth', { value: width, configurable: true });
  const document = window.document;
  const divider = document.getElementById('divider')!;
  const editorPane = document.getElementById('editor-pane')!;
  const previewFrame = document.querySelector('iframe')!;
  document.getElementById('editor-container')!.getBoundingClientRect = () => rectangle(1000);
  editorPane.getBoundingClientRect = () =>
    rectangle(parseFloat(editorPane.style.flexBasis || '50') * 10);
  const captured = new Set<number>();
  divider.setPointerCapture = (id) => {
    captured.add(id);
  };
  divider.hasPointerCapture = (id) => captured.has(id);
  divider.releasePointerCapture = (id) => {
    captured.delete(id);
  };
  initializeDivider({
    window,
    document,
    divider,
    editorPane,
    previewFrame,
    paneContainer: document.getElementById('editor-container')!,
  });
  const pointer = (type: string, x: number, y: number, id = 1) => {
    const event = new window.MouseEvent(type, {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
      button: 0,
    });
    Object.defineProperties(event, { pointerId: { value: id }, isPrimary: { value: true } });
    divider.dispatchEvent(event);
  };
  const key = (key: string, shiftKey = false) =>
    divider.dispatchEvent(
      new window.KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true })
    );
  return { window, document, divider, editorPane, previewFrame, pointer, key, captured };
}

it.each([1000, 390])('supports keyboard resizing on the active axis at width %s', (width) => {
  const { divider, editorPane, key } = setup(width);
  expect(divider.getAttribute('aria-orientation')).toBe(width > 768 ? 'vertical' : 'horizontal');
  key(width > 768 ? 'ArrowRight' : 'ArrowDown', true);
  expect(editorPane.style.flexBasis).toBe('60%');
  key('End');
  expect(divider.getAttribute('aria-valuenow')).toBe('85');
  key(width > 768 ? 'ArrowRight' : 'ArrowDown');
  expect(editorPane.style.flexBasis).toBe('85%');
  key('Home');
  expect(editorPane.style.flexBasis).toBe('15%');
});

it('clamps pointer overshoot, ignores other pointers, and restores state on cancellation', () => {
  const { document, divider, editorPane, previewFrame, pointer, captured } = setup();
  previewFrame.style.pointerEvents = 'auto';
  document.body.style.userSelect = 'text';
  document.body.style.cursor = 'crosshair';
  pointer('pointerdown', 500, 0);
  pointer('pointermove', 800, 0, 2);
  expect(editorPane.style.flexBasis).toBe('');
  pointer('pointermove', 1500, 0);
  expect(editorPane.style.flexBasis).toBe('85%');
  pointer('pointercancel', 1500, 0);
  expect(captured.size).toBe(0);
  expect(divider.classList.contains('dragging')).toBe(false);
  expect(previewFrame.style.pointerEvents).toBe('auto');
  expect(document.body.style.userSelect).toBe('text');
  expect(document.body.style.cursor).toBe('crosshair');
});

it('ends a drag when the viewport changes or the window loses focus', () => {
  const { window, divider, previewFrame, pointer, captured } = setup();
  pointer('pointerdown', 500, 0);
  Object.defineProperty(window, 'innerWidth', { value: 390, configurable: true });
  window.dispatchEvent(new window.Event('resize'));
  expect(captured.size).toBe(0);
  expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
  pointer('pointerdown', 0, 500);
  window.dispatchEvent(new window.Event('blur'));
  expect(previewFrame.style.pointerEvents).toBe('');
  expect(captured.size).toBe(0);
});
