import { extendTailwindMerge } from 'tailwind-merge';

const merge = extendTailwindMerge<'glass-intensity'>({
  extend: {
    classGroups: {
      'glass-intensity': ['glass-subtle', 'glass-light', 'glass-medium', 'glass-heavy', 'glass-dark'],
      animate: [{ animate: ['fade-in', 'slide-up', 'slide-down', 'slide-left', 'slide-right', 'scale-in', 'zoom-in', 'spin-slow', 'shimmer'] }],
      transition: ['transition-smooth', 'transition-fast'],
    },
  },
});

/** Resolve utility conflicts while keeping independent properties and variants. */
export function mergeClasses(classes: readonly string[]): string[] {
  // Custom component classes also deduplicate; unknown classes remain valid.
  return [...new Set(merge(classes.join(' ')).split(/\s+/).filter(Boolean))];
}
