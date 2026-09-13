import {expect, it} from 'vitest';
import {Linter} from '../Linter';
import type {LintRule} from '../types';
function rule(name: string, fix: NonNullable<LintRule['fix']>): LintRule {
  return {name,description:name,severity:'error',category:'syntax',fixable:true,check:()=>{},fix};
}
it('accepts an empty replacement and does not count a subsequent no-op', async()=>{
  const linter=new Linter();linter.registerRule(rule('clear',()=>({source:'',description:'Clear'})));
  expect(await linter.fix('Delete me')).toMatchObject({fixed:'',modified:true,fixCount:1,messages:[]});
  expect(await linter.fix('')).toMatchObject({fixed:'',modified:false,fixCount:0,messages:[]});
});
it('reports unchanged final text when successful rules cancel each other',async()=>{
  const linter=new Linter();linter.registerRules([rule('first',()=>({source:'Changed',description:'Change'})),rule('second',()=>({source:'Original',description:'Restore'}))]);
  expect(await linter.fix('Original')).toMatchObject({fixed:'Original',modified:false,fixCount:2});
});
it('reports unsupported AST-only fixes and preserves the following rule context',async()=>{
  const linter=new Linter();let followingText='';
  linter.registerRules([rule('ast-only',context=>{context.ast.children=[];return {ast:context.ast,description:'Change tree'};}),rule('observe',context=>{const child=context.ast.children[0];followingText=child?.type ?? '';return null;})]);
  const result=await linter.fix('# Original');
  expect(result).toMatchObject({fixed:'# Original',modified:false,fixCount:0});
  expect(result.messages[0]).toMatchObject({rule:'ast-only',severity:'error',fixable:false});
  expect(result.messages[0]?.message).toContain('AST-only');expect(followingText).toBe('heading');
});
it('returns failed-fix diagnostics while allowing later fixes',async()=>{
  const linter=new Linter();linter.registerRules([rule('broken',()=>{throw new Error('Cannot fix');}),rule('working',()=>({source:'Repaired',description:'Repair'}))]);
  const result=await linter.fix('Original');expect(result).toMatchObject({fixed:'Repaired',modified:true,fixCount:1});
  expect(result.messages[0]).toMatchObject({rule:'broken',severity:'error',fixable:false});
  expect(result.messages[0]?.message).toContain('Cannot fix');
});
