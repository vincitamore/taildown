import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { compile } from '../../index';
import { tooltipBehavior } from '../../js-generator/behaviors/tooltip';

it.each([false, true])(
  'renders icon attachment values separately from styles (minify=%s)',
  async (minify) => {
    const result = await compile(
      ':icon[info]{#help large primary tooltip="Helpful context"}\n\n:icon[settings]{modal="#settings"}\n\n:::modal{id="settings"}\nSettings\n:::',
      { minify }
    );
    const doc = new JSDOM(result.html).window.document;
    const trigger = doc.querySelector('#help')!;
    expect(trigger.tagName.toLowerCase()).toBe('svg');
    expect(trigger.getAttribute('class')).toContain('w-8');
    expect(trigger.getAttribute('class')).not.toContain('tooltip=');
    expect(trigger.getAttribute('tabindex')).toBe('0');
    expect(trigger.getAttribute('role')).toBe('button');
    expect(trigger.getAttribute('aria-label')).toBe('info');
    expect(doc.getElementById(trigger.getAttribute('aria-describedby')!)?.textContent).toBe(
      'Helpful context'
    );
    expect(doc.querySelector('[data-modal-trigger="settings"]')?.tagName.toLowerCase()).toBe('svg');
    expect(result.metadata.warnings).toEqual([]);
  }
);

it('reports invalid icon attachment values at the icon source location', async () => {
  const result = await compile('Paragraph\n\n:icon[info]{tooltip="" unknown="value"}');
  expect(result.metadata.warnings.map((w) => [w.line, w.column])).toEqual([
    [3, 1],
    [3, 1],
  ]);
  expect(result.metadata.warnings[0]!.message).toContain('requires a non-empty value');
  expect(result.metadata.warnings[1]!.message).toContain('Unsupported inline attribute "unknown"');
});

it('supports Enter/Space on compiled prose and SVG tooltip controls while preserving native links', async () => {
  const result = await compile(
    'A term{tooltip="Meaning"}\n\n:icon[info]{tooltip="Context"}\n\n[Guide](#section){tooltip="Read"}'
  );
  const dom = new JSDOM(result.html, { runScripts: 'outside-only' });
  try {
    dom.window.eval(tooltipBehavior.code);
    const triggers = [...dom.window.document.querySelectorAll('[data-tooltip-trigger]')];
    expect(triggers).toHaveLength(3);
    for (const trigger of triggers.slice(0, 2)) {
      expect(trigger.getAttribute('tabindex')).toBe('0');
      const tip = dom.window.document.getElementById(trigger.getAttribute('aria-describedby')!)!;
      for (const [key, hidden] of [
        ['Enter', false],
        [' ', true],
      ] as const) {
        const event = new dom.window.KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        });
        trigger.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(tip.hidden).toBe(hidden);
      }
    }
    expect(triggers[2]!.getAttribute('role')).toBeNull();
    expect(triggers[2]!.getAttribute('tabindex')).toBeNull();
  } finally {
    dom.window.close();
  }
});

it('puts simultaneous tooltip and modal attachments on one control', async () => {
  const result = await compile(
    ':icon[info]{tooltip="Help" modal="#dialog"}\n\n:::modal{id="dialog"}\nHelp body\n:::'
  );
  const doc = new JSDOM(result.html).window.document;
  const trigger = doc.querySelector('[data-modal-trigger="dialog"]')!;
  expect(trigger.tagName.toLowerCase()).toBe('svg');
  expect(trigger.hasAttribute('data-tooltip-trigger')).toBe(true);
  expect(trigger.parentElement?.closest('[role="button"]')).toBeNull();
});
