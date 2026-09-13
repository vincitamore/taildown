import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {tableBehavior} from '../table';

it('sorts each row group without moving nested table rows or changing their sort state', () => {
  const dom = new JSDOM('<table data-sortable="true"><thead><tr><th data-sortable="true">Value</th></tr></thead><tbody id="one"><tr><td>2</td><td><table data-sortable="true"><thead><tr><th data-sortable="true">Inner</th></tr></thead><tbody><tr><td>9</td></tr><tr><td>8</td></tr></tbody></table></td></tr><tr><td>1</td><td></td></tr></tbody><tbody id="two"><tr><td>4</td></tr><tr><td>3</td></tr></tbody></table>', {runScripts:'outside-only'});
  try {
    dom.window.eval(tableBehavior.code);
    const outer = dom.window.document.querySelector('table')!;
    const inner = outer.querySelector<HTMLTableElement>('td table')!;
    outer.querySelector<HTMLElement>('th')!.click();
    expect([...outer.tBodies[0]!.rows].map(row => row.cells[0]!.textContent)).toEqual(['1','2']);
    expect([...outer.tBodies[1]!.rows].map(row => row.cells[0]!.textContent)).toEqual(['3','4']);
    expect([...inner.tBodies[0]!.rows].map(row => row.cells[0]!.textContent)).toEqual(['9','8']);
    expect(inner.querySelector('th')!.getAttribute('aria-sort')).toBe('none');
  } finally {dom.window.close();}
});

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
