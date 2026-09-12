/** Load the build's text payload, retaining only successful responses. */
export function createRuntimeLoader(url: URL, expectedLength: number, fetchSource: typeof fetch = fetch) {
  let pending: Promise<string> | undefined;
  return function loadSource(): Promise<string> {
    return pending ??= fetchSource(url).then(async response => {
      if (!response.ok || /text\/html/i.test(response.headers.get('content-type') || '')) {
        throw new Error('Diagram runtime could not load. Check your connection and try again.');
      }
      const source = await response.text();
      if (source.length !== expectedLength) {
        throw new Error('Diagram runtime download was incomplete or unexpected. Try again.');
      }
      return source;
    }).catch(error => { pending = undefined; throw error; });
  };
}
