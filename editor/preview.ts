import type {
  CompileOptions,
  CompileResult,
  EditorView,
} from '../packages/compiler/src/editor-bundle';
export interface PreviewResult {
  html: string;
  metadata: Pick<CompileResult['metadata'], 'warnings'>;
}
interface Dependencies {
  compile(source: string, options: CompileOptions): Promise<PreviewResult>;
  getDesignOptions(): CompileOptions;
  getEditor(): Pick<EditorView, 'state' | 'dispatch' | 'focus'>;
  getFilename(): string;
  draftStore: { save(content: string, filename: string): unknown };
  previewFrame: HTMLIFrameElement;
  statusBar: HTMLElement;
  diagnostics: HTMLDetailsElement;
  document: Document;
}
function requiredElement<T extends Element>(element: T | null): T {
  if (!element) throw new Error('Preview diagnostics require a summary and list');
  return element;
}
export function createPreviewController({
  compile,
  getDesignOptions,
  getEditor,
  getFilename,
  draftStore,
  previewFrame,
  statusBar,
  diagnostics,
  document,
}: Dependencies) {
  const summary = requiredElement(diagnostics.querySelector('summary'));
  const list = requiredElement(diagnostics.querySelector('ul'));
  let updateTimeout: ReturnType<typeof setTimeout> | null = null;
  let previewRevision = 0;
  // Schedule preview updates and autosave after typing pauses.
  function scheduleUpdate() {
    previewRevision++; // Invalidate pending results before the debounce expires.
    diagnostics.hidden = true;
    if (updateTimeout !== null) clearTimeout(updateTimeout);
    updateTimeout = setTimeout(() => {
      const content = getEditor().state.doc.toString();
      void updatePreview(content);
      draftStore.save(content, getFilename());
    }, 1000);
  }
  async function updatePreview(source: string) {
    const revision = ++previewRevision;
    try {
      const startTime = performance.now();

      // Save scroll position before updating
      let savedScrollTop = 0;
      let savedScrollLeft = 0;
      try {
        const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow?.document;
        if (previewDoc && previewDoc.documentElement) {
          savedScrollTop = previewDoc.documentElement.scrollTop || previewDoc.body.scrollTop || 0;
          savedScrollLeft =
            previewDoc.documentElement.scrollLeft || previewDoc.body.scrollLeft || 0;
        }
      } catch {
        // Ignore if iframe not accessible yet
      }

      const result = await compile(source, {
        ...getDesignOptions(),
        inlineStyles: true,
        inlineScripts: true,
        darkMode: true,
      });
      if (revision !== previewRevision) return;
      const compileTime = performance.now() - startTime;

      // Function to restore scroll position
      const restoreScroll = () => {
        if (revision !== previewRevision) return;
        try {
          const previewDoc = previewFrame.contentDocument || previewFrame.contentWindow?.document;
          if (previewDoc && previewDoc.documentElement) {
            previewDoc.documentElement.scrollTop = savedScrollTop;
            previewDoc.body.scrollTop = savedScrollTop;
            previewDoc.documentElement.scrollLeft = savedScrollLeft;
            previewDoc.body.scrollLeft = savedScrollLeft;
          }
        } catch {
          // Ignore if iframe not accessible
        }
      };

      previewFrame.srcdoc = result.html;
      statusBar.textContent = `✓ Compiled in ${compileTime.toFixed(0)}ms`;
      const warnings = result.metadata.warnings;

      diagnostics.hidden = warnings.length === 0;
      summary.textContent = `${warnings.length} compilation notice${warnings.length === 1 ? '' : 's'}`;
      list.replaceChildren(
        ...warnings.map((warning) => {
          const item = document.createElement('li');
          const warningLine = warning.line;
          if (typeof warningLine === 'number' && Number.isInteger(warningLine) && warningLine > 0) {
            const location = document.createElement('button');
            location.type = 'button';
            location.textContent = `Line ${warning.line}${warning.column ? `, column ${warning.column}` : ''}`;
            location.style.cssText =
              'font:inherit;color:inherit;background:none;border:0;padding:0;text-decoration:underline;cursor:pointer;';
            location.addEventListener('click', () => {
              const line = getEditor().state.doc.line(
                Math.min(warningLine, getEditor().state.doc.lines)
              );
              const anchor =
                line.from + Math.max(0, Math.min((warning.column || 1) - 1, line.length));
              getEditor().dispatch({ selection: { anchor }, scrollIntoView: true });
              getEditor().focus();
            });
            item.append(location, document.createTextNode(`: ${warning.message}`));
          } else {
            item.textContent = warning.message;
          }
          return item;
        })
      );
      statusBar.className = 'success';

      previewFrame.addEventListener('load', restoreScroll, { once: true });
    } catch (error) {
      if (revision !== previewRevision) return;
      diagnostics.hidden = true;
      statusBar.textContent = `✗ Error: ${error instanceof Error ? error.message : String(error)}`;
      statusBar.className = 'error';
      console.error('Compilation error:', error);
    }
  }

  return { updatePreview, scheduleUpdate };
}
