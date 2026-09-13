import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {tooltipBehavior} from '../tooltip';

it('hands shared tooltip visibility and positioning to the latest trigger', async () => {
  const dom = new JSDOM('<button aria-describedby="shared" data-tooltip-trigger>First</button><button aria-describedby="shared" data-tooltip-trigger>Second</button><div id="shared" role="tooltip">Shared description</div>', {runScripts:'outside-only'});
  try {
    const [first, second] = dom.window.document.querySelectorAll('button');
    first!.getBoundingClientRect = () => ({left:100, top:100, bottom:120, width:20} as DOMRect);
    second!.getBoundingClientRect = () => ({left:400, top:100, bottom:120, width:20} as DOMRect);
    dom.window.eval(tooltipBehavior.code);
    const tip = dom.window.document.querySelector<HTMLElement>('[role="tooltip"]')!;
    const mouse = (node:Element, name:string) => node.dispatchEvent(new dom.window.MouseEvent(name));
    mouse(first!, 'mouseenter'); mouse(first!, 'mouseleave'); mouse(second!, 'mouseenter');
    await new Promise(resolve => setTimeout(resolve, 180));
    expect(tip.hidden).toBe(false);
    expect(tip.style.left).toBe('410px');
    mouse(second!, 'mouseleave'); mouse(first!, 'mouseenter');
    dom.window.dispatchEvent(new dom.window.Event('resize'));
    await new Promise(resolve => setTimeout(resolve, 180));
    expect(tip.hidden).toBe(false);
    expect(tip.style.left).toBe('110px');
  } finally {dom.window.close();}
});

it('preserves real link activation and only cancels placeholder help links', () => {
  const dom = new JSDOM('<a href="/guide" data-tooltip-trigger>Guide</a><div role="tooltip">Guide description</div><a href="#" data-tooltip-trigger>Help</a><div role="tooltip">Help description</div>', {runScripts:'outside-only'});
  try {
    dom.window.eval(tooltipBehavior.code);
    const [link, help] = dom.window.document.querySelectorAll('a');
    // Observe before stopping native navigation in this isolated DOM test.
    for (const ctrlKey of [false, true]) {
      link!.dispatchEvent(new dom.window.MouseEvent('mouseenter'));
      let prevented = true;
      link!.addEventListener('click', event => { prevented = event.defaultPrevented; event.preventDefault(); }, {once:true});
      link!.dispatchEvent(new dom.window.MouseEvent('click', {cancelable:true, ctrlKey}));
      expect(prevented).toBe(false);
      expect(dom.window.document.querySelector<HTMLElement>('[role="tooltip"]')!.hidden).toBe(true);
    }
    const event = new dom.window.MouseEvent('click', {cancelable:true});
    help!.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  } finally {dom.window.close();}
});

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
