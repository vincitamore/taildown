import type { Completion } from '../packages/compiler/src/editor-bundle';

/** SVG elements supplied by the compiler worker; no icon library is bundled here. */
type IconElement = readonly [string, Readonly<Record<string, unknown>>];
type IconData = Readonly<Record<string, readonly IconElement[] | null>>;

export function createIconRenderer(iconData: IconData, document: Document) {
  const iconNames = Object.keys(iconData);
  const iconElements = new Map(
    Object.entries(iconData).map(([name, elements]) => [name.replace(/-/g, ''), elements])
  );

  // Share the compiler's SVG data between authoring previews and toolbar icons.
  function lucideIcon(iconName: string): string {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    const attributes = {
      width: '16',
      height: '16',
      viewBox: '0 0 24 24',
      fill: 'none',
      stroke: 'currentColor',
      'stroke-width': '2',
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'aria-hidden': 'true',
    };
    for (const [name, value] of Object.entries(attributes)) svg.setAttribute(name, value);
    for (const [tag, properties] of iconElements.get(iconName.toLowerCase().replace(/-/g, '')) ||
      []) {
      const child = document.createElementNS('http://www.w3.org/2000/svg', tag);
      for (const [name, value] of Object.entries(properties))
        child.setAttribute(name, String(value));
      svg.appendChild(child);
    }
    return svg.outerHTML;
  }

  function renderIconCompletion(completion: Completion): HTMLSpanElement | null {
    if (completion.info !== 'icon') return null;
    const preview = document.createElement('span');
    preview.className = 'autocomplete-icon';
    preview.innerHTML = lucideIcon(completion.label);
    return preview;
  }

  return { iconNames, lucideIcon, renderIconCompletion };
}
