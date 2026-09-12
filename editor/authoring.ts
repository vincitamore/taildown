import type {
  Completion,
  CompletionContext,
  CompletionResult,
} from '../packages/compiler/src/editor-bundle';
import type { EditorView } from '../packages/compiler/src/editor-bundle';
import type { getAuthoringReference } from '../packages/compiler/src/authoring-reference';

type AuthoringReference = Awaited<ReturnType<typeof getAuthoringReference>>;
interface RenderedCompletion extends Completion {
  render?: () => HTMLElement;
}
interface AuthoringOptions {
  reference(): AuthoringReference;
  iconNames(): readonly string[];
  isCodePosition(source: string, position: number): boolean;
  startCompletion(view: EditorView): boolean;
}

// Helper to render autocomplete items with icons
function renderAutocompleteItem(label: string, info: string, iconPreview: string | null = null) {
  return () => {
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'center';
    container.style.gap = '12px';
    container.style.width = '100%';

    // Icon preview (for icon autocomplete)
    if (iconPreview) {
      const iconDiv = document.createElement('div');
      iconDiv.className = 'autocomplete-icon';
      iconDiv.innerHTML = iconPreview;
      container.appendChild(iconDiv);
    }

    // Label
    const labelDiv = document.createElement('div');
    labelDiv.className = 'autocomplete-label';
    labelDiv.textContent = label;
    container.appendChild(labelDiv);

    // Info/type badge
    if (info) {
      const infoDiv = document.createElement('div');
      infoDiv.className = 'autocomplete-type';
      infoDiv.textContent = info;
      container.appendChild(infoDiv);
    }

    return container;
  };
}

export function createTaildownAutocomplete(options: AuthoringOptions) {
  // Smart autocomplete extension
  return function taildownAutocomplete(
    context: Pick<CompletionContext, 'state' | 'pos'>
  ): CompletionResult | null {
    const authoringReference = options.reference();
    const componentNames = authoringReference.components.map((component) => component.name);
    const styleAttributes = authoringReference.styles;
    const iconNames = options.iconNames();
    const line = context.state.doc.lineAt(context.pos);
    const textBefore = line.text.slice(0, context.pos - line.from);
    // Only inspect Markdown context when a Taildown completion trigger exists.
    if (
      !/[:{]/.test(textBefore) ||
      options.isCodePosition(context.state.doc.toString(), context.pos)
    )
      return null;

    // Colon trigger - suggest ::: or inline elements
    if (textBefore.endsWith(':') && !textBefore.endsWith('::')) {
      const colonSuggestions = [
        {
          label: ':::',
          insert: '::',
          info: 'component fence',
          retrigger: true,
        },
        {
          label: ':icon[]',
          insert: 'icon[]',
          info: 'inline icon',
          retrigger: true,
          cursorOffset: -1, // Place cursor between brackets
        },
        {
          label: ':badge[]',
          insert: 'badge[]',
          info: 'inline badge',
          cursorOffset: -1, // Place cursor between brackets
        },
        {
          label: ':kbd[]',
          insert: 'kbd[]',
          info: 'keyboard key',
          cursorOffset: -1, // Place cursor between brackets
        },
      ];

      return {
        from: context.pos,
        validFor: /^$/,
        options: colonSuggestions.map<RenderedCompletion>((item) => ({
          label: item.label,
          type: 'keyword',
          info: item.info,
          render: renderAutocompleteItem(item.label, item.info),
          apply: (view, _completion, from, to) => {
            const cursorPos = from + item.insert.length + (item.cursorOffset || 0);
            view.dispatch({
              changes: { from, to, insert: item.insert },
              selection: { anchor: cursorPos },
            });
            // Retrigger autocomplete after insertion
            if (item.retrigger) {
              setTimeout(() => {
                options.startCompletion(view);
              }, 10);
            }
          },
        })),
      };
    }

    // Component autocomplete - triggered after :::
    const componentMatch = textBefore.match(/:::([\w-]*)$/);
    if (componentMatch) {
      return {
        from: context.pos - (componentMatch[1] ?? '').length,
        validFor: /^[\w-]*$/, // Stay open while typing component names (letters, numbers, dashes)
        options: componentNames.map<RenderedCompletion>((name) => ({
          label: name,
          type: 'keyword',
          info: 'component',
          render: renderAutocompleteItem(name, 'component'),
          apply: (view, _completion, from, to) => {
            // Insert component name, newlines, and closing fence
            const fullInsert = `${name}\n\n:::`;
            const cursorPos = from + name.length + 1; // Position after component name and first newline

            view.dispatch({
              changes: { from, to, insert: fullInsert },
              selection: { anchor: cursorPos },
            });
          },
        })),
      };
    }

    // Attribute autocomplete - triggered after { or inside {}
    const braceMatch = textBefore.match(/\{([^}]*)$/);
    if (braceMatch) {
      const inline = textBefore.match(/:(icon|badge|kbd)\[[^\]]*\]\{[^}]*$/)?.[1];
      const content = braceMatch[1] ?? '';
      const typed = inline === 'kbd' ? content : (content.match(/[^\s]*$/)?.[0] ?? '');
      const component =
        inline === 'badge' ? 'badge' : textBefore.match(/:::([\w-]+)\s*\{[^}]*$/)?.[1];
      const variants =
        authoringReference.components.find((item) => item.name === component)?.attributes || [];
      const candidates =
        inline === 'kbd'
          ? authoringReference.keyboardPlatforms
          : [
              ...styleAttributes,
              ...variants,
              ...(inline === 'icon' ? authoringReference.iconSizes : []),
            ];
      const filtered = [...new Set(candidates)].filter((attr) =>
        attr.toLowerCase().includes(typed.toLowerCase())
      );

      return {
        from: context.pos - typed.length,
        validFor: /^[\w-]*$/, // Stay open while typing attributes
        options: filtered.map<RenderedCompletion>((attr) => ({
          label: attr,
          type: 'property',
          info: inline === 'kbd' ? 'platform' : inline ? `${inline}-style` : 'style',
          render: renderAutocompleteItem(attr, 'style'),
          apply: attr,
        })),
      };
    }

    // Icon autocomplete - triggered after :icon[
    const iconMatch = textBefore.match(/:icon\[([^\]]*)$/);
    if (iconMatch) {
      const typed = iconMatch[1] ?? '';
      const filtered = iconNames.filter((icon) => icon.toLowerCase().includes(typed.toLowerCase()));

      return {
        from: context.pos - typed.length,
        validFor: /^[\w-]*$/, // Stay open while typing icon names
        options: filtered.map((icon) => {
          return {
            label: icon,
            type: 'variable',
            info: 'icon',
            apply: icon,
          };
        }),
      };
    }

    return null;
  };
}
