import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it('provides playback controls for self-hosted video by default', async () => {
  const result = await compile(':::video\n![Demo](https://example.com/demo.mp4)\n:::');
  const document = new JSDOM(result.html).window.document;
  const video = document.querySelector('video');
  expect(video?.getAttribute('src')).toBe('https://example.com/demo.mp4');
  expect(video?.hasAttribute('controls')).toBe(true);
});

it.each([
  ['https://youtu.be/dQw4w9WgXcQ', 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', 'YouTube video player'],
  ['https://vimeo.com/123456789', 'https://player.vimeo.com/video/123456789', 'Vimeo video player'],
])('preserves accessible provider embeds for %s', async (url, embed, title) => {
  const result = await compile(`:::video\n${url}\n:::`, {minify: true});
  const document = new JSDOM(result.html).window.document;
  const iframe = document.querySelector('iframe');
  expect(iframe?.getAttribute('src')).toBe(embed);
  expect(iframe?.getAttribute('title')).toBe(title);
  expect(iframe?.getAttribute('loading')).toBe('lazy');
  expect(iframe?.parentElement?.classList.contains('aspect-16-9')).toBe(true);
});

it('keeps an unsupported video link readable', async () => {
  const result = await compile(':::video\n[Watch demo](https://example.com/watch)\n:::');
  const document = new JSDOM(result.html).window.document;
  expect(document.querySelector('iframe, video')).toBeNull();
  expect(document.querySelector('a')?.textContent).toBe('Watch demo');
});
