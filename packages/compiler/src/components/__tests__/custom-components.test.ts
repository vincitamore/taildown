import {expect, it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile, parseWithWarnings} from '../../index';
import {getAuthoringReference} from '../../authoring-reference';

it('renders custom semantic containers, nested content, and generated utility CSS', async () => {
  const result = await compile(':::editorial{p-2 brand}\n## A considered heading\n\n:::card\nNested content\n:::\n:::', {
    inlineStyles: true,
    components: {editorial: {name:'editorial', htmlElement:'article', defaultClasses:['p-8', 'rounded-lg']}},
    styleMappings: {brand:'text-primary-600'},
  });
  const dom = new JSDOM(result.html);
  try {
    const article = dom.window.document.querySelector('article.component-editorial')!;
    expect(article).not.toBeNull();
    expect(article.getAttribute('data-component')).toBe('editorial');
    expect(article.querySelector('h2')?.textContent).toBe('A considered heading');
    expect(article.querySelector('.component-card')?.textContent).toBe('Nested content');
    expect(article.classList.contains('p-8')).toBe(false);
    expect(article.classList.contains('p-2')).toBe(true);
    expect(dom.window.getComputedStyle(article).padding).toBe('0.5rem');
    expect(result.metadata.warnings).toEqual([]);
  } finally {dom.window.close();}
});

it('supports custom presentation in inline attributes without changing the Markdown element', async () => {
  const result = await compile('# Title {editorial small}', {
    components: {editorial: {name:'editorial', htmlElement:'article', defaultClasses:['font-bold','text-4xl']}},
  });
  const dom = new JSDOM(result.html);
  try {
    const heading = dom.window.document.querySelector('h1')!;
    expect(heading.classList.contains('font-bold')).toBe(true);
    expect(heading.classList.contains('text-sm')).toBe(true);
    expect(heading.classList.contains('text-4xl')).toBe(false);
    expect(heading.classList.contains('editorial')).toBe(false);
  } finally {dom.window.close();}
});

it('keeps conflicting definitions isolated between concurrent compiles and subsequent parses', async () => {
  const source = ':::editorial\nOwn content\n:::';
  const definitions = ['article','aside'] as const;
  const results = await Promise.all(definitions.map(htmlElement => compile(source, {
    components: {editorial: {name:'editorial',htmlElement,defaultClasses:[htmlElement === 'article' ? 'p-4' : 'p-8']}},
  })));
  results.forEach((result, i) => {
    expect(result.html).toContain(`<${definitions[i]} class="taildown-component component-editorial`);
    expect(result.metadata.warnings).toEqual([]);
  });
  expect((await parseWithWarnings(source)).warnings.some(w => w.message === 'Unknown component: editorial')).toBe(true);
});

it('rejects ambiguous component definitions instead of silently altering built-in behavior', async () => {
  await expect(compile('', {components:{card:{name:'card',defaultClasses:[]}}})).rejects.toThrow('conflicts with a registered component');
  await expect(compile('', {components:{editorial:{name:'other',defaultClasses:[]}}})).rejects.toThrow('key and name must match');
  await expect(compile('', {components:{editorial:{name:'editorial',htmlElement:'article onclick=x',defaultClasses:[]}}})).rejects.toThrow('Invalid HTML element');
});

it('snapshots caller definitions and vocabulary before asynchronous initialization', async () => {
  const definition = {name:'editorial',htmlElement:'article',defaultClasses:['p-4']};
  const styleMappings = {brand:'text-sm'};
  const pending = compile(':::editorial{brand}\nOriginal\n:::', {components:{editorial:definition},styleMappings});
  definition.htmlElement = 'aside';
  definition.defaultClasses[0] = 'p-8';
  styleMappings.brand = 'text-4xl';
  const dom = new JSDOM((await pending).html);
  try {
    const article = dom.window.document.querySelector('article')!;
    expect(article).not.toBeNull();
    expect(article.classList.contains('p-4')).toBe(true);
    expect(article.classList.contains('text-sm')).toBe(true);
  } finally {dom.window.close();}
});

it('surfaces the same custom vocabulary and insertable examples to authoring clients', async () => {
  const options = {components:{editorial:{name:'editorial',htmlElement:'article',defaultClasses:['p-4']}},styleMappings:{brand:'text-sm'}};
  const reference = await getAuthoringReference(options);
  const example = reference.components.find(component => component.name === 'editorial')?.example;
  expect(example).toBeTruthy();
  expect(reference.styles).toContain('brand');
  expect((await compile(example!,options)).metadata.warnings).toEqual([]);
  expect((await getAuthoringReference()).components.some(component => component.name === 'editorial')).toBe(false);
});
