/**
 * Lucide SVG data for the complete installed icon library.
 * Documents emit only the SVGs they use; the offline compiler carries the
 * registry so authoring is not limited to icons used by our own examples.
 */
import { icons } from 'lucide';

export const DEFAULT_ICON_CONFIG = {
  size: 24,
  strokeWidth: 2,
  fill: 'none',
  stroke: 'currentColor',
};

export type LucideIconElement = [string, Record<string, any>];

const normalizeName = (name: string) => name.toLowerCase().replace(/-/g, '');
const iconRegistry = new Map<string, LucideIconElement[]>(
  Object.entries(icons).map(([name, data]) => [normalizeName(name), data as LucideIconElement[]]),
);
// Preserve Taildown's original singular alias.
iconRegistry.set('wave', icons.Waves as LucideIconElement[]);

export function getLucideIconElements(iconName: string): LucideIconElement[] | null {
  return iconRegistry.get(normalizeName(iconName)) ?? null;
}

export function hasLucideIcon(iconName: string): boolean {
  return iconRegistry.has(normalizeName(iconName));
}

export function getAllLucideIconNames(): string[] {
  return [...new Set([...Object.keys(icons).map(name => name
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([a-zA-Z])([0-9])/g, '$1-$2')
    .replace(/([0-9])x-([0-9])/g, '$1x$2')
    .toLowerCase()
    .replace(/(arrow-(?:down|up))-([01az])([01az])$/, '$1-$2-$3')), 'wave'])].sort();
}
