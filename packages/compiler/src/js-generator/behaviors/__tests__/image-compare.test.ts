import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {imageCompareBehavior} from '../image-compare';

it('restores focus/cursor and stops interrupted drags without accepting invalid geometry', () => {
  const dom = new JSDOM('<div data-component="compare-images"><button data-compare-slider></button><div data-compare-after></div></div>', {runScripts:'outside-only'});
  try {
    dom.window.eval('function getComponents(){return document.querySelectorAll("[data-component]")}\n' + imageCompareBehavior.code);
    const container = dom.window.document.querySelector('div')!;
    const slider = dom.window.document.querySelector('button')!;
    const mouse = (target:EventTarget, name:string, clientX=100) => target.dispatchEvent(new dom.window.MouseEvent(name,{clientX,button:0,cancelable:true}));
    // Zero-width hidden containers must never write NaN/Infinity into ARIA or CSS.
    mouse(container,'click');
    expect(slider.getAttribute('aria-valuenow')).toBe('50');
    container.getBoundingClientRect = () => ({left:0,top:0,width:200,height:100} as DOMRect);
    dom.window.document.body.style.cursor = 'crosshair';
    mouse(slider,'mousedown');
    expect(dom.window.document.activeElement).toBe(slider);
    mouse(dom.window.document,'mousemove',150);
    expect(slider.getAttribute('aria-valuenow')).toBe('75');
    dom.window.dispatchEvent(new dom.window.Event('blur'));
    expect(dom.window.document.body.style.cursor).toBe('crosshair');
    mouse(dom.window.document,'mousemove',20);
    expect(slider.getAttribute('aria-valuenow')).toBe('75');
    slider.dispatchEvent(new dom.window.Event('touchstart'));
    dom.window.document.dispatchEvent(new dom.window.Event('touchcancel'));
    mouse(dom.window.document,'mousemove',20);
    expect(slider.getAttribute('aria-valuenow')).toBe('75');
  } finally {dom.window.close();}
});
