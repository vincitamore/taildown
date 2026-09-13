import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it.each([false, true])('groups marked values with rich labels and preserves surrounding content (minify=%s)', async minify => {
  const result = await compile(':::stats {2 bordered}\nIntroductory context\n\n### 24 {stat}\n:icon[book-open]\nField **notes**\n\n**8** {stat primary}\n\n[Contributors](https://example.com)\n:::', {minify});
  const dom = new JSDOM(result.html);
  try {
    const stats = dom.window.document.querySelector('.stats-component')!;
    const items = [...stats.querySelectorAll(':scope > .stat-item')];
    expect(items).toHaveLength(2);
    expect(items.map(n => n.querySelector('.stat-value')?.textContent)).toEqual(['24', '8']);
    expect(items[0]!.querySelector('svg')).not.toBeNull();
    expect(items[0]!.querySelector('p strong')?.textContent).toBe('notes');
    expect(items[1]!.querySelector('a')?.getAttribute('href')).toBe('https://example.com');
    expect(items[1]!.querySelector('.stat-value')?.classList.contains('text-primary')).toBe(true);
    expect(stats.firstElementChild?.textContent).toBe('Introductory context');
    expect(stats.classList.contains('stats-bordered')).toBe(true);
    expect(result.metadata.warnings).toEqual([]);
  } finally {dom.window.close();}
});
