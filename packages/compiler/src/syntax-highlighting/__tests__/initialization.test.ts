import {beforeEach, expect, it, vi} from 'vitest';

const create = vi.hoisted(() => vi.fn());
vi.mock('shiki', () => ({createHighlighter: create}));
beforeEach(() => {vi.resetModules(); create.mockReset();});

it('shares one in-flight highlighter across concurrent code blocks and later compilations', async () => {
  let ready!: (value: unknown) => void;
  create.mockImplementation(() => new Promise(resolve => {ready = resolve;}));
  const {getHighlighter, highlightWithShiki} = await import('../shiki-highlighter');
  const pending = Array.from({length: 12}, (_, i) => highlightWithShiki(String(i), 'js'));
  expect(create).toHaveBeenCalledTimes(1);
  const instance = {getLoadedLanguages: () => ['javascript'], codeToHtml: (code: string) => `<code>${code}</code>`};
  ready(instance);
  expect(await Promise.all(pending)).toEqual(Array.from({length: 12}, (_, i) => `<code>${i}</code>`));
  expect(await getHighlighter()).toBe(instance);
  expect(create).toHaveBeenCalledTimes(1);
});

it('allows a later compilation to retry a failed initialization', async () => {
  create.mockRejectedValueOnce(new Error('startup failed')).mockResolvedValueOnce({});
  const {getHighlighter} = await import('../shiki-highlighter');
  await expect(getHighlighter()).rejects.toThrow('startup failed');
  await expect(getHighlighter()).resolves.toEqual({});
  expect(create).toHaveBeenCalledTimes(2);
});
