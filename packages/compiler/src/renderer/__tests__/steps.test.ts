import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../../index';

it('preserves introductory content and authored anchors in steps', async () => {
  const result = await compile(':::steps {id="install"}\nRead this before starting.\n\n### Download {step completed #download}\nGet the archive.\n\n### Configure {step current}\nChoose settings.\n:::');
  const document = new JSDOM(result.html).window.document;
  expect(document.body.textContent).toContain('Read this before starting.');
  expect(document.querySelector('#install')).not.toBeNull();
  expect(document.querySelector('#download')?.textContent).toBe('Download');
  expect([...document.querySelectorAll('.step-item')].map(node=>node.getAttribute('data-step-number'))).toEqual(['1','2']);
});

it('preserves steps content when no marked headings are present', async () => {
  const result = await compile(':::steps\nA process explanation without numbered milestones.\n:::');
  expect(new JSDOM(result.html).window.document.body.textContent).toContain('A process explanation without numbered milestones.');
});
