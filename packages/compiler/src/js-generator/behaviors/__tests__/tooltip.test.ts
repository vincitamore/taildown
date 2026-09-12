import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {tooltipBehavior} from '../tooltip';

it('links descriptions, preserves hover reentry, and lets Escape override hover', async () => {
  const dom = new JSDOM('<button data-tooltip-trigger>Info</button><div role="tooltip">Description</div>', {runScripts:'outside-only', pretendToBeVisual:true});
  try {
    const {window} = dom;
    window.eval(tooltipBehavior.code);
    const trigger = window.document.querySelector('button')!;
    const tooltip = window.document.querySelector<HTMLElement>('[role="tooltip"]')!;
    expect(trigger.getAttribute('aria-describedby')).toBe(tooltip.id);
    const mouse = (name:string) => trigger.dispatchEvent(new window.MouseEvent(name));
    mouse('mouseenter'); mouse('mouseleave'); mouse('mouseenter');
    await new Promise(resolve => setTimeout(resolve, 180));
    expect(tooltip.hidden).toBe(false);
    tooltip.dispatchEvent(new window.MouseEvent('mouseenter'));
    window.document.dispatchEvent(new window.KeyboardEvent('keydown', {key:'Escape'}));
    expect(tooltip.hidden).toBe(true);
    mouse('mouseleave'); mouse('mouseenter');
    await new Promise(resolve => setTimeout(resolve, 220));
    expect(tooltip.hidden).toBe(false);
  } finally {dom.window.close();}
});

it('keeps a focused trigger described when the pointer leaves', async () => {
  const dom = new JSDOM('<button data-tooltip-trigger>Info</button><div role="tooltip">Description</div>', {runScripts:'outside-only', pretendToBeVisual:true});
  try {
    dom.window.eval(tooltipBehavior.code);
    const trigger = dom.window.document.querySelector('button')!;
    const tooltip = dom.window.document.querySelector<HTMLElement>('[role="tooltip"]')!;
    trigger.focus();
    trigger.dispatchEvent(new dom.window.MouseEvent('mouseenter'));
    trigger.dispatchEvent(new dom.window.MouseEvent('mouseleave'));
    await new Promise(resolve => setTimeout(resolve, 180));
    expect(tooltip.hidden).toBe(false);
  } finally {dom.window.close();}
});
