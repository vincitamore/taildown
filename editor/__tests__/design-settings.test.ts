import {expect, it} from 'vitest';
import {compile} from '../../packages/compiler/src/index';
import {createDesignSettings, parseDesignSettings, prepareTypography} from '../design-settings.js';

it('prepares typography without replacing custom colors, components or other font stacks', () => {
  const original = {theme:{colors:{primary:'#4338ca'},fonts:{mono:'Consolas'}},components:{panel:{name:'panel',htmlElement:'section'}}};
  const result = JSON.parse(prepareTypography(JSON.stringify(original),'Editorial'));
  expect(result.theme.fonts.sans).toContain('Georgia');
  expect(result.theme.fonts.mono).toBe('Consolas');
  expect(result.theme.colors).toEqual(original.theme.colors);
  expect(result.components).toEqual(original.components);
  expect(()=>prepareTypography('broken','Modern')).toThrow();
});

it('validates before applying and restores a portable configuration', async () => {
  const values = new Map<string,string>();
  const storage = () => ({getItem:(key:string)=>values.get(key) ?? null,setItem:(key:string,value:string)=>values.set(key,value)});
  const settings = createDesignSettings(compile,storage);
  await settings.apply('{"theme":{"colors":{"primary":"#4338ca"}},"styleMappings":{"brand":"text-primary"}}','Hello {brand}');
  const result = await compile('Hello {brand}',settings.options);
  expect(result.html).toContain('text-primary');
  expect(result.css).toContain('#4338ca');
  await expect(settings.apply('{"theme":{"colors":{"primary":"invalid-color"}}}','Hello')).rejects.toThrow();
  expect(settings.options.theme.colors.primary).toBe('#4338ca');
  const restored = createDesignSettings(compile,storage);
  await restored.restore();
  expect(restored.options).toEqual(settings.options);
  const copy = settings.options;
  copy.theme.colors.primary = '#000000';
  expect(settings.options.theme.colors.primary).toBe('#4338ca');
});

it('keeps applied settings usable when browser storage fails', async () => {
  const settings = createDesignSettings(compile,()=>{throw new Error('Denied');});
  expect(await settings.apply('{"styleMappings":{"brand":"font-bold"}}','Hello')).toBe(false);
  expect(settings.options.styleMappings.brand).toBe('font-bold');
});

it.each(['null','[]','{"inlineScripts":false}','{"theme":{"glass":{}}}','{"styleMappings":{"brand":[]}}',
  '{"theme":{"colors":[]}}', '{"theme":{"fonts":null}}', '{"theme":{"fonts":{"sans":42}}}',
  '{"theme":{"colors":{"primary":{}}}}', '{"theme":{"colors":{"primary":{"DEFAULT":false}}}}',
  '{"theme":{"colors":{"primary":{"bogus":"#123456"}}}}'
])('rejects unsupported settings: %s', text => {
  expect(()=>parseDesignSettings(text)).toThrow();
});
