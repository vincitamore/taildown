import {expect, it, vi} from 'vitest';
import {JSDOM} from 'jsdom';
import {copyCodeBehavior} from '../copy-code';

it.each([true, false])('reports clipboard success truthfully (accepted=%s)', async accepted => {
  const dom = new JSDOM('<button class="code-copy-btn" data-code-text="" aria-label="Copy code to clipboard"><span class="copy-text">Copy</span><span class="copied-text"></span></button>', {runScripts:'outside-only'});
  try {
    const writeText = accepted ? vi.fn().mockResolvedValue(undefined) : vi.fn().mockRejectedValue(new Error('Denied'));
    Object.defineProperty(dom.window, 'isSecureContext', {value:true});
    Object.defineProperty(dom.window.navigator, 'clipboard', {value:{writeText}});
    dom.window.eval(copyCodeBehavior.code);
    const button = dom.window.document.querySelector<HTMLButtonElement>('button')!;
    button.click();
    await vi.waitFor(() => expect(button.querySelector('.copied-text')?.textContent).toBe(accepted ? 'Copied!' : 'Copy failed'));
    expect(writeText).toHaveBeenCalledWith('');
    expect(button.classList.contains('copied')).toBe(accepted);
    expect(button.querySelector('.copied-text')?.textContent).toBe(accepted ? 'Copied!' : 'Copy failed');
  } finally {dom.window.close();}
});

it('cleans up failed fallback copying and restores keyboard focus', async () => {
  const dom = new JSDOM('<button class="code-copy-btn" data-code-text="code"><span class="copied-text"></span></button>', {runScripts:'outside-only'});
  try {
    Object.defineProperty(dom.window.document, 'execCommand', {value:vi.fn(() => false)});
    dom.window.eval(copyCodeBehavior.code);
    const button = dom.window.document.querySelector<HTMLButtonElement>('button')!;
    button.focus(); button.click();
    await Promise.resolve();
    expect(dom.window.document.querySelector('textarea')).toBeNull();
    expect(dom.window.document.activeElement).toBe(button);
    expect(button.classList.contains('copied')).toBe(false);
    expect(button.getAttribute('aria-label')).toContain('Copy failed');
  } finally {dom.window.close();}
});
