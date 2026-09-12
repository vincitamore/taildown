import {expect, it} from 'vitest';
import {InlineCodeIndex} from '../inline-code-index';
import {inlineCodeRanges} from '../../authoring-context';
import {readFileSync, readdirSync} from 'node:fs';
import {join} from 'node:path';

it.each([
  'Paragraph `literal\ncode` here.',
  '> Quoted ``a ` b`` and `c`\n\n- Listed `d`',
  '```js\n`not inline`\n```\n\nYes `inline`.',
  '    `indented block`\n\nEscaped \\`tick and `span`',
])('keeps incremental delimiter and block edits aligned with compiler Markdown: %s', source => {
  const index = new InlineCodeIndex();
  expect(index.update(source)).toEqual(inlineCodeRanges(source));
  for (const prefix of ['```\n', '', '> ', '\n\n`', '']) {
    const next = prefix + source;
    expect(index.update(next,[{fromA:0,toA:0,fromB:0,toB:prefix.length}])).toEqual(inlineCodeRanges(next));
    expect(index.update(source,[{fromA:0,toA:prefix.length,fromB:0,toB:0}])).toEqual(inlineCodeRanges(source));
  }
});

it('matches compiler code-span ranges throughout the syntax fixtures and documentation', () => {
  const files:string[]=[];
  const walk=(dir:string)=>{for(const entry of readdirSync(dir,{withFileTypes:true})){const file=join(dir,entry.name);if(entry.isDirectory())walk(file);else if(file.endsWith('.td'))files.push(file);}};
  walk('syntax-tests/fixtures');
  for(const name of readdirSync('docs-site')) if(name.endsWith('.td')) files.push(join('docs-site',name));
  for(const file of files) {
    const source=readFileSync(file,'utf8');
    expect(new InlineCodeIndex().update(source),file).toEqual(inlineCodeRanges(source));
  }
});
