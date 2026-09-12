import { expect, it } from 'vitest';
import { parseWithWarnings } from '../index';

it.each(['[Read](#)', '# Heading', 'Paragraph'])(
  'diagnoses unsupported attributes on %s without leaking values into classes or IDs',
  async (element) => {
    const { ast, warnings } = await parseWithWarnings(
      `${element}{aria-label="Read #secret now" tabindex="1" .font-bold}`
    );
    expect(warnings.map((warning) => warning.message)).toEqual([
      expect.stringContaining('Unsupported inline attribute "aria-label"'),
      expect.stringContaining('Unsupported inline attribute "tabindex"'),
    ]);
    const first = ast.children[0];
    const node = element.startsWith('[') && first?.type === 'paragraph' ? first.children[0] : first;
    expect(node?.data?.hProperties?.className).toEqual(['font-bold']);
    expect(node?.data?.hProperties?.id).toBeUndefined();
  }
);

it('matches whole attribute names and preserves apostrophes in quoted tooltip values', async () => {
  const { ast, warnings } = await parseWithWarnings(
    `[Read](#){notmodal="Wrong" tooltip="It's useful" #read}`
  );
  const first = ast.children[0];
  if (first?.type !== 'paragraph') throw new Error('Expected a paragraph');
  const properties = first.children[0]?.data?.hProperties;
  expect(properties?.['data-modal-attach']).toBeUndefined();
  expect(properties?.['data-tooltip-attach']).toBe("It's useful");
  expect(properties?.id).toBe('read');
  expect(warnings).toHaveLength(1);
});
