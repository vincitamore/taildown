import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../../index';
import {carouselBehavior} from '../carousel';

it('distinguishes horizontal swipes from scrolling, cancellation and multiple touches', async () => {
  const result = await compile(':::carousel\nFirst\n\n---\n\nSecond\n:::');
  const dom = new JSDOM(result.html, {runScripts:'outside-only'});
  try {
    dom.window.eval('function getComponents(name){return document.querySelectorAll("[data-component="+name+"]")} function toggleClass(el,name,on){el.classList.toggle(name,on)}\n'+carouselBehavior.code);
    const carousel = dom.window.document.querySelector<HTMLElement>('[data-component="carousel"]')!;
    const point = (x:number,y:number,id=1) => ({clientX:x,clientY:y,identifier:id});
    const send = (type:string, touches:ReturnType<typeof point>[], changedTouches=touches) => {
      carousel.dispatchEvent(Object.assign(new dom.window.Event(type,{bubbles:true}),{touches,changedTouches}));
    };
    const current = () => carousel.querySelector('[data-carousel-slide]:not([hidden])')!.textContent!.trim();
    send('touchstart',[point(200,100)]);
    send('touchend',[],[point(100,400)]);
    expect(current()).toBe('First');
    send('touchstart',[point(200,100)]);
    send('touchcancel',[]);
    send('touchend',[],[point(100,100)]);
    expect(current()).toBe('First');
    send('touchstart',[point(200,100)]);
    send('touchstart',[point(200,100),point(250,100,2)]);
    send('touchend',[],[point(100,100)]);
    expect(current()).toBe('First');
    send('touchstart',[point(200,100)]);
    send('touchend',[],[point(100,110)]);
    expect(current()).toBe('Second');
    carousel.dispatchEvent(new dom.window.MouseEvent('mousedown',{button:0,screenX:200,bubbles:true}));
    carousel.dispatchEvent(new dom.window.MouseEvent('mousemove',{screenX:100,bubbles:true}));
    dom.window.dispatchEvent(new dom.window.Event('blur'));
    carousel.dispatchEvent(new dom.window.MouseEvent('mouseup',{screenX:100,bubbles:true}));
    expect(current()).toBe('Second');
    expect(carousel.style.cursor).toBe('grab');
  } finally {dom.window.close();}
});
