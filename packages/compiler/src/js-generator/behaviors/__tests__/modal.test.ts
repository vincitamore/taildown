import { afterEach, describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { modalBehavior } from '../modal';

const windows: JSDOM[] = [];
afterEach(() => { for (const dom of windows.splice(0)) dom.window.close(); });

function setup(content = '', closeButton = true) {
  const dom = new JSDOM(`<body style="overflow: auto"><main><button data-modal-trigger="dialog">Open</button><button data-modal-trigger="dialog">Also open</button></main><div id="dialog" role="dialog" hidden>${closeButton ? '<button data-modal-close>Close</button>' : ''}${content}</div><aside inert>Already inert</aside></body>`, { runScripts: 'outside-only', pretendToBeVisual: true });
  windows.push(dom);
  const { window } = dom;
  // jsdom has no layout engine or native inert property. Model their platform
  // contracts here; actual geometry and keyboard behavior are checked in-browser.
  Object.defineProperty(window.HTMLElement.prototype, 'inert', {
    get() { return this.hasAttribute('inert'); },
    set(value: boolean) { this.toggleAttribute('inert', value); },
    configurable: true,
  });
  window.HTMLElement.prototype.getClientRects = function () {
    return (this.closest('[hidden]') ? [] : [{}]) as unknown as DOMRectList;
  };
  window.eval(modalBehavior.code);
  const document = window.document;
  const dialog = document.getElementById('dialog')!;
  const triggers = [...document.querySelectorAll<HTMLButtonElement>('[data-modal-trigger]')];
  const open = (index = 0) => { triggers[index]!.focus(); triggers[index]!.click(); };
  const key = (key: string, shiftKey = false) => {
    const event = new window.KeyboardEvent('keydown', { key, shiftKey, bubbles: true, cancelable: true });
    document.activeElement!.dispatchEvent(event);
    return event.defaultPrevented;
  };
  return { window, document, dialog, triggers, open, key };
}

describe('modal lifecycle', () => {
  it('wraps at the selected radio and updates when the selection changes', () => {
    const {document, open, key} = setup('<input id="a" type="radio" name="choice" checked><input id="b" type="radio" name="choice">');
    open();
    const a = document.getElementById('a') as HTMLInputElement;
    const b = document.getElementById('b') as HTMLInputElement;
    a.focus();
    expect(key('Tab')).toBe(true);
    expect(document.activeElement?.textContent).toBe('Close');
    key('Tab', true);
    expect(document.activeElement).toBe(a);
    b.checked = true;
    b.focus();
    expect(key('Tab')).toBe(true);
    key('Tab', true);
    expect(document.activeElement).toBe(b);
  });

  it('keeps radio groups with the same name in different forms independent', () => {
    const {document, open, key} = setup('<form><input id="a" type="radio" name="choice" checked></form><form><input id="b" type="radio" name="choice" checked></form>');
    open();
    document.getElementById('a')!.focus();
    expect(key('Tab')).toBe(false);
    document.getElementById('b')!.focus();
    expect(key('Tab')).toBe(true);
    expect(document.activeElement?.textContent).toBe('Close');
  });

  it('handles unselected group entry and reversing direction without moving within the group', () => {
    const {document, open, key} = setup('<input id="a" type="radio" name="choice"><input id="b" type="radio" name="choice">');
    open();
    key('Tab', true);
    expect(document.activeElement?.id).toBe('b');
    expect(key('Tab')).toBe(true);
    expect(document.activeElement?.textContent).toBe('Close');
    document.getElementById('a')!.focus();
    expect(key('Tab', true)).toBe(false);
    expect(document.activeElement?.id).toBe('a'); // Native Tab performs the move.
  });

  it('uses positive tab order and ignores CSS-hidden controls', () => {
    const {document, open, key} = setup('<button tabindex="2">Second</button><button tabindex="1" style="visibility:hidden">Invisible</button><button tabindex="1">First</button>');
    open();
    expect(document.activeElement?.textContent).toBe('First');
    key('Tab', true);
    expect(document.activeElement?.textContent).toBe('Close');
    key('Tab');
    expect(document.activeElement?.textContent).toBe('First');
  });

  it.each(['removed','disabled'])('restores document focus when its opener is %s', state => {
    const {document, triggers, open, key} = setup();
    open();
    if (state === 'removed') triggers[0]!.remove();
    else triggers[0]!.disabled = true;
    key('Escape');
    expect(document.activeElement).toBe(document.body);
    expect(document.body.hasAttribute('tabindex')).toBe(false);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('focuses a text-only dialog, wraps Tab, restores focus and existing scroll state', () => {
    const { document, dialog, triggers, open, key } = setup('<h2>Information</h2><p>Read this.</p>');
    open();
    expect(document.activeElement).toBe(dialog.querySelector('[data-modal-close]'));
    expect(key('Tab')).toBe(true);
    expect(key('Tab', true)).toBe(true);
    expect(dialog.contains(document.activeElement)).toBe(true);
    expect(document.querySelector('main')!.inert).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');
    key('Escape');
    expect(dialog.hidden).toBe(true);
    expect(document.activeElement).toBe(triggers[0]);
    expect(document.querySelector('main')!.inert).toBe(false);
    expect(document.querySelector('aside')!.inert).toBe(true);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('wraps between the first and last eligible controls', () => {
    const { document, dialog, open, key } = setup('<button disabled>Disabled</button><div hidden><a href="#hidden">Hidden</a></div><a href="#first">First</a><a href="#last">Last</a>');
    open();
    key('Tab', true);
    expect(document.activeElement?.textContent).toBe('Last');
    key('Tab');
    expect(document.activeElement).toBe(dialog.querySelector('[data-modal-close]'));
  });

  it('focuses the dialog itself when it contains no controls', () => {
    const { document, dialog, open, key } = setup('<p>Only text.</p>', false);
    open();
    expect(document.activeElement).toBe(dialog);
    expect(key('Tab')).toBe(true);
    expect(document.activeElement).toBe(dialog);
  });

  it('shares state across triggers and survives immediate close/reopen', async () => {
    const { window, document, dialog, triggers, open, key } = setup();
    open(0);
    key('Escape');
    open(1);
    await new Promise(resolve => window.setTimeout(resolve, 250));
    expect(dialog.hidden).toBe(false);
    expect(document.body.style.overflow).toBe('hidden');
    key('Escape');
    expect(document.activeElement).toBe(triggers[1]);
    expect(document.body.style.overflow).toBe('auto');
  });

  it('closes only the inner dialog when its close-button event bubbles', () => {
    const { document, dialog, open } = setup('<button data-modal-trigger="inner">Open inner</button><div id="inner" role="dialog" hidden><button data-modal-close>Close inner</button></div>');
    open();
    const innerTrigger = dialog.querySelector<HTMLButtonElement>('[data-modal-trigger]')!;
    innerTrigger.focus();
    innerTrigger.click();
    const inner = document.getElementById('inner')!;
    expect(inner.hidden).toBe(false);
    inner.querySelector<HTMLButtonElement>('[data-modal-close]')!.click();
    expect(inner.hidden).toBe(true);
    expect(dialog.hidden).toBe(false);
    expect(document.activeElement).toBe(innerTrigger);
    expect(document.body.style.overflow).toBe('hidden');
  });
});
