import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {tableBehavior} from '../table';

it.each([
  [['2026-12-01', '2026-01-01', '2025-10-01'], ['2025-10-01', '2026-01-01', '2026-12-01']],
  [['Zebra 1', 'Apple 20', 'Bear 3'], ['Apple 20', 'Bear 3', 'Zebra 1']],
  [['$1,200.50', '$20.00', '$3.50'], ['$3.50', '$20.00', '$1,200.50']],
  [['Zebra 1', '2026-01-01', '20', 'Apple 3'], ['20', '2026-01-01', 'Apple 3', 'Zebra 1']],
])('sorts typed values without stripping meaning from text: %s', (values, expected) => {
  const dom = new JSDOM('<table data-sortable="true"><thead><tr><th>Row</th><th data-sortable="true">Value</th></tr></thead><tbody>' + values.map((value,index) => `<tr><th>${index}</th><td>${value}</td></tr>`).join('') + '</tbody></table>', {runScripts:'outside-only'});
  try {
    dom.window.eval(tableBehavior.code);
    const header = dom.window.document.querySelector<HTMLElement>('th[data-sortable]')!;
    expect(header.hasAttribute('role')).toBe(false);
    header.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key:'Enter', cancelable:true}));
    const order = () => [...dom.window.document.querySelectorAll('tbody td')].map(cell => cell.textContent);
    expect(order()).toEqual(expected);
    expect(header.getAttribute('aria-sort')).toBe('ascending');
    header.dispatchEvent(new dom.window.KeyboardEvent('keydown', {key:' ', cancelable:true}));
    expect(order()).toEqual([...expected].reverse());
    expect(header.getAttribute('aria-sort')).toBe('descending');
  } finally {dom.window.close();}
});
