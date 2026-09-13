import {expect,it} from 'vitest';
import {JSDOM} from 'jsdom';
import {compile} from '../index';
it.each([
 ['**Purpose** {term}\n: A *clear* goal.\n\n**Evidence** {term}\n: [Read more](https://example.com)', ['Purpose','Evidence']],
 ['**Name:** Fieldnotes\n**Stage:** Draft', ['Name','Stage']],
])('renders documented definition pairs semantically: %s',async(source,terms)=>{
 const result=await compile(':::definitions\n'+source+'\n:::',{inlineStyles:true});
 const dom=new JSDOM(result.html);
 try {const dl=dom.window.document.querySelector('dl')!;expect([...dl.querySelectorAll('dt')].map(n=>n.textContent)).toEqual(terms);expect(dl.querySelectorAll('dd')).toHaveLength(2);expect(dl.textContent).not.toContain('{term}');expect(result.metadata.warnings).toEqual([]);if(source.includes('https:')) {expect(dl.querySelector('dd em')?.textContent).toBe('clear');expect(dl.querySelector('dd a')?.getAttribute('href')).toBe('https://example.com');}}finally{dom.window.close();}
});
