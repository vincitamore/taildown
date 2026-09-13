import { expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { generateDarkModeScript, getDarkModeOptions } from '../dark-mode';
import { getDefaultConfig } from '../../config/default-config';
import { compile } from '../../index';

it('compiled portable HTML creates a working toggle when storage is blocked', async () => {
  const result = await compile('# Portable page', { inlineStyles: true, inlineScripts: true });
  const dom = new JSDOM(result.html, {
    runScripts: 'dangerously',
    beforeParse(window) {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new window.DOMException('Unavailable', 'SecurityError');
        },
      });
    },
  });
  try {
    await new Promise<void>((resolve) =>
      dom.window.document.addEventListener('DOMContentLoaded', () => resolve(), { once: true })
    );
    const toggle = dom.window.document.querySelector<HTMLButtonElement>('.dark-mode-toggle')!;
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    toggle.click();
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    expect(dom.window.document.documentElement.classList.contains('dark')).toBe(true);
  } finally {
    dom.window.close();
  }
});

it('works without storage and retains the user choice across system changes', async () => {
  const dom = new JSDOM('<body></body>', { runScripts: 'outside-only' });
  try {
    const { window } = dom;
    await new Promise<void>((resolve) =>
      window.document.addEventListener('DOMContentLoaded', () => resolve(), { once: true })
    );
    let systemChange = (_event: { matches: boolean }) => {};
    Object.defineProperty(window, 'localStorage', {
      get() {
        throw new window.DOMException('Unavailable', 'SecurityError');
      },
    });
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({
        matches: true,
        addEventListener(_type: string, listener: typeof systemChange) {
          systemChange = listener;
        },
      }),
    });
    expect(() =>
      window.eval(generateDarkModeScript(getDarkModeOptions(getDefaultConfig())))
    ).not.toThrow();
    const toggle = window.document.querySelector<HTMLButtonElement>('.dark-mode-toggle')!;
    expect(toggle).not.toBeNull();
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    toggle.click();
    expect(window.document.documentElement.classList.contains('dark')).toBe(false);
    expect(toggle.getAttribute('aria-pressed')).toBe('false');
    systemChange({ matches: true });
    expect(window.document.documentElement.classList.contains('dark')).toBe(false);
  } finally {
    dom.window.close();
  }
});

it('ignores invalid stored preferences and follows the system until explicitly toggled', async () => {
  const dom = new JSDOM('<body></body>', {
    url: 'https://example.test',
    runScripts: 'outside-only',
  });
  try {
    const { window } = dom;
    await new Promise<void>((resolve) =>
      window.document.addEventListener('DOMContentLoaded', () => resolve(), { once: true })
    );
    window.localStorage.setItem('taildown-dark-mode', 'invalid');
    let systemChange = (_event: { matches: boolean }) => {};
    Object.defineProperty(window, 'matchMedia', {
      value: () => ({
        matches: false,
        addEventListener(_type: string, listener: typeof systemChange) {
          systemChange = listener;
        },
      }),
    });
    window.eval(generateDarkModeScript(getDarkModeOptions(getDefaultConfig())));
    systemChange({ matches: true });
    const toggle = window.document.querySelector<HTMLButtonElement>('.dark-mode-toggle')!;
    expect(toggle.getAttribute('aria-pressed')).toBe('true');
    toggle.click();
    expect(window.localStorage.getItem('taildown-dark-mode')).toBe('light');
  } finally {
    dom.window.close();
  }
});
