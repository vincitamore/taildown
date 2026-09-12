import {expect,it} from 'vitest';import {compile} from '../../index';
it('emits the rectangle skeleton height in an otherwise empty document',async()=>{const result=await compile(':::skeleton {rectangle aria-hidden="true"}\n:::');expect(result.css).toContain('.h-32 { height: 8rem; }');expect(result.html).toContain('aria-hidden="true"');});
