import {expect, it, vi} from 'vitest';
import {createRuntimeLoader} from '../hosted-runtime-loader';

it.each([
  new Response('<html>Sign in</html>', {headers:{'content-type':'text/html'}}),
  new Response('partial', {headers:{'content-type':'text/plain'}}),
  new Response('', {status:503}),
])('does not cache an unexpected response and permits retry', async response => {
  const source = '/* complete runtime */';
  const fetchSource = vi.fn().mockResolvedValueOnce(response).mockResolvedValueOnce(new Response(source));
  const load = createRuntimeLoader(new URL('https://example.test/runtime.txt'),source.length,fetchSource);
  await expect(load()).rejects.toThrow('Diagram runtime');
  expect(await load()).toBe(source);
  expect(await load()).toBe(source);
  expect(fetchSource).toHaveBeenCalledTimes(2);
});

it('shares an in-flight request across simultaneous compilations', async () => {
  let finish!: (response:Response) => void;
  const fetchSource = vi.fn(()=>new Promise<Response>(resolve=>{finish=resolve;}));
  const load = createRuntimeLoader(new URL('https://example.test/runtime.txt'),7,fetchSource);
  const first = load(), second = load();
  expect(first).toBe(second);
  finish(new Response('runtime'));
  expect(await first).toBe('runtime');
  expect(await second).toBe('runtime');
  expect(fetchSource).toHaveBeenCalledOnce();
});
