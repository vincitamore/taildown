import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {parseWithWarnings} from '../index';
import {compile} from '../../index';

it.each(['', ' ', '  ', '\t'])('parses component attributes with separator %j', async separator => {
  const {ast, warnings} = await parseWithWarnings(`:::card${separator}{id="example"}\nBody\n:::`);
  expect(ast.children[0]).toMatchObject({type: 'containerDirective', name: 'card', attributes: {id: 'example'}});
  expect(warnings).toEqual([]);
});

it('accepts an empty component attribute block', async () => {
  const {ast, warnings} = await parseWithWarnings(':::card{}\nBody\n:::');
  expect(ast.children[0]).toMatchObject({type: 'containerDirective', name: 'card'});
  expect(warnings).toEqual([]);
});

it.each([false, true])('renders documented compact ID references (minify=%s)', async minify => {
  const {html} = await compile('[Open](#){button modal="#help"}\n\n[Info](#){tooltip="#tip"}\n\n:::modal{id="help"}\n# Help\nDialog body\n:::\n\n:::tooltip{id="tip"}\nTooltip body\n:::', {minify, autoFix: false});
  const doc = new JSDOM(html).window.document;
  const modal = doc.getElementById(doc.querySelector('[data-modal-trigger]')!.getAttribute('data-modal-trigger')!)!;
  expect(modal.getAttribute('role')).toBe('dialog');
  expect(modal.textContent).toContain('Dialog body');
  const tooltip = doc.getElementById(doc.querySelector('[data-tooltip-trigger]')!.getAttribute('aria-describedby')!)!;
  expect(tooltip.textContent).toContain('Tooltip body');
  expect(doc.body.textContent).not.toContain(':::modal');
});
