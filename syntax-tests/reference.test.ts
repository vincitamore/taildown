import {describe, expect, it} from 'vitest';
import {readdirSync, readFileSync, existsSync} from 'node:fs';
import {join, extname, basename} from 'node:path';
import {parse} from '../packages/compiler/src/parser';
import {compile} from '../packages/compiler/src';
import {JSDOM} from 'jsdom';

// Positions vary with checkout line endings. Empty directive attributes are
// incidental; nonempty attributes, properties and content are the contract.
function normalizeAST(value: any): any {
  if (typeof value === 'string') return value.replace(/\r\n/g, '\n');
  if (Array.isArray(value)) return value.map(normalizeAST);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(Object.entries(value)
    .filter(([key, child]) => !(key === 'position' && typeof value.type === 'string') && !(key === 'attributes' && child && typeof child === 'object' && Object.keys(child).length === 0))
    .map(([key, child]) => [key, normalizeAST(child)]));
}

const root = join(__dirname, 'fixtures');
const fixtures = readdirSync(root, {withFileTypes: true})
  .filter(entry => entry.isDirectory()).sort((a,b) => a.name.localeCompare(b.name))
  .flatMap(category => readdirSync(join(root, category.name)).sort()
    .filter(name => ['.td', '.tdown', '.taildown'].includes(extname(name)))
    .map(name => ({name: `${category.name}/${name}`, path: join(root, category.name, name), base: join(root, category.name, basename(name, extname(name)))})));

// HTML-only fixtures have explicit semantic/rendered assertions in this suite.
const renderedFixtures = new Map<string, (source: string) => Promise<void>>([
  ['10-content-components/07-table-enhanced.td', async source => {
    const {html} = await compile(source, {autoFix: false});
    const doc = new JSDOM(html).window.document;
    const tables = [...doc.querySelectorAll('table')];
    expect(tables).toHaveLength(5);
    expect(tables.map(table => table.querySelectorAll('tbody tr').length)).toEqual([2, 3, 2, 2, 2]);
    expect(tables[0]!.classList.contains('table-sortable')).toBe(false);
    expect(tables[1]!.classList.contains('table-sortable')).toBe(true);
    expect(tables[2]!.classList.contains('table-zebra')).toBe(true);
    expect(tables[3]!.classList.contains('table-glass')).toBe(true);
    for (const cls of ['table-sortable', 'table-zebra', 'table-hoverable', 'table-glass']) {
      expect(tables[4]!.classList.contains(cls), cls).toBe(true);
    }
    expect([...tables[1]!.querySelectorAll('tbody tr')].map(row => row.lastElementChild?.textContent)).toEqual(['$85,000', '$75,000', '$120,000']);
    expect(doc.body.textContent).not.toContain('{sortable');
    expect(doc.body.textContent).not.toContain('{zebra}');
  }],
]);

describe('Syntax fixture conformance', () => {
  it('discovers fixtures and requires an executable expectation for every input', () => {
    expect(fixtures.length).toBeGreaterThan(0);
    for (const fixture of fixtures) {
      expect(existsSync(fixture.base + '.ast.json') || renderedFixtures.has(fixture.name), fixture.name).toBe(true);
    }
    for (const name of renderedFixtures.keys()) expect(fixtures.some(fixture => fixture.name === name), name).toBe(true);
  });
  for (const [name, verify] of renderedFixtures) {
    it(name + ' (rendered contract)', async () => {
      await verify(readFileSync(join(root, name), 'utf8'));
    });
  }
  for (const fixture of fixtures.filter(fixture => existsSync(fixture.base + '.ast.json'))) {
    it(fixture.name, async () => {
      const expected = JSON.parse(readFileSync(fixture.base + '.ast.json', 'utf8'));
      const actual = await parse(readFileSync(fixture.path, 'utf8'));
      expect(normalizeAST(actual)).toEqual(normalizeAST(expected));
    });
  }
  it('compares semantic attributes while ignoring empty attributes and source positions', () => {
    expect(normalizeAST({type: 'containerDirective', attributes: {}, position: {start: 1}})).toEqual({type: 'containerDirective'});
    expect(normalizeAST({attributes: {id: 'help', columns: '3'}})).not.toEqual(normalizeAST({attributes: {id: 'other', columns: '2'}}));
    expect(normalizeAST({attributes: {position: 'top'}})).toEqual({attributes: {position: 'top'}});
    expect(normalizeAST({children: [{value: 'a\r\nb'}]})).toEqual({children: [{value: 'a\nb'}]});
  });
});
