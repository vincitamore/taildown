import type { CompilationWarning } from '@taildown/shared';

/** Separate attachment values and IDs from styling tokens for inline elements. */
export function parseAttributeValues(
  attributeBlock: string,
  warnings: CompilationWarning[] = [],
  position?: { line: number; column: number }
) {
  // Extract key-value attributes (modal="..." tooltip="...") and ID (#anchor-id)
  const kvAttrs: { id?: string; modal?: string; tooltip?: string } = {};
  let cleanedBlock = attributeBlock.replace(
    /(^|\s)([\w-]+)=(?:"([^"]*)"|'([^']*)'|([^\s]+))/g,
    (
      _match,
      space: string,
      name: string,
      doubleQuoted: string | undefined,
      singleQuoted: string | undefined,
      bare: string | undefined
    ) => {
      const value = doubleQuoted ?? singleQuoted ?? bare ?? '';
      if (name === 'modal' || name === 'tooltip') {
        if (value) kvAttrs[name] = value;
        else
          warnings.push({
            type: 'validation',
            message: `Inline attribute "${name}" requires a non-empty value.`,
            ...position,
          });
      } else {
        warnings.push({
          type: 'validation',
          message: `Unsupported inline attribute "${name}". Inline key-value attributes support modal and tooltip; use #name for an ID and plain-English styles or CSS classes for styling.`,
          ...position,
        });
      }
      return space;
    }
  );

  // Match #anchor-id (ID syntax) - AFTER removing quoted values
  // This prevents #id inside tooltip="#id" from being extracted as anchor
  // ID must start with letter or underscore, can contain letters, numbers, hyphens, underscores
  const idMatch = cleanedBlock.match(/#([a-zA-Z_][\w-]*)/);
  if (idMatch) {
    kvAttrs.id = idMatch[1];
    cleanedBlock = cleanedBlock.replace(idMatch[0], '').trim();
  }

  return { cleanedBlock, ...kvAttrs };
}
