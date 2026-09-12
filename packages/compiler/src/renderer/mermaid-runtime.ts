import { loadMermaidSource } from './mermaid-source';

/** The same controller runs in previews and saved documents. */
export const MERMAID_CONTROLLER = String.raw`
(() => {
  const api = window.mermaid.default || window.mermaid;
  let revision = 0;
  let running = false;
  let sequence = 0;
  let dark = document.documentElement.classList.contains('dark');
  const diagrams = [];
  async function render() {
    revision++;
    if (running) return;
    running = true;
    try {
      let completed;
      do {
        completed = revision;
        api.initialize({startOnLoad: false, securityLevel: 'strict', theme: dark ? 'dark' : 'default'});
        for (const diagram of diagrams) {
          const id = 'taildown-mermaid-' + (++sequence);
          try {
            const result = await api.render(id, diagram.source);
            if (completed !== revision) break;
            diagram.output.innerHTML = result.svg;
            if (result.bindFunctions) result.bindFunctions(diagram.output);
            diagram.code.hidden = true;
            diagram.status.hidden = true;
          } catch (error) {
            document.getElementById('d' + id)?.remove();
            diagram.output.replaceChildren();
            diagram.code.hidden = false;
            diagram.status.hidden = false;
            diagram.status.textContent = 'Diagram could not be rendered. Check the Mermaid syntax below.';
          }
        }
      } while (completed !== revision);
    } finally { running = false; }
  }
  function start() {
    dark = document.documentElement.classList.contains('dark');
    for (const code of document.querySelectorAll('code.language-mermaid')) {
      const pre = code.closest('pre');
      if (!pre) continue;
      const container = document.createElement('div');
      container.className = 'mermaid-container';
      const output = document.createElement('div');
      const status = document.createElement('p');
      status.setAttribute('role', 'status');
      status.hidden = true;
      pre.replaceWith(container);
      container.append(output, status, pre);
      diagrams.push({source: code.textContent, code: pre, output, status});
    }
    render();
    new MutationObserver(() => {
      const next = document.documentElement.classList.contains('dark');
      if (next !== dark) { dark = next; render(); }
    }).observe(document.documentElement, {attributes: true, attributeFilter: ['class']});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, {once: true});
  else start();
})();`;

export async function generateMermaidScript(): Promise<string> {
  const source = await loadMermaidSource();
  // Script contents are raw HTML; protect literal closing tags in library strings.
  return '<script>' + source.replace(/<\/script/gi, '<\\/script') + '\n</script><script>' + MERMAID_CONTROLLER + '</script>';
}
