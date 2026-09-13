/** Shared numeric contract for progress diagnostics and native rendering. */
export function progressValues(
  attributes: Record<string, string | null | undefined> = {},
  flags: readonly string[] = []
): {max: number; value?: number; warnings: string[]} {
  const warnings: string[] = [];
  const number = (raw: string | null | undefined): number =>
    raw != null && raw.trim() !== '' ? Number(raw) : NaN;
  const max = attributes.max === undefined ? 100 : number(attributes.max);
  const hasValue = Object.hasOwn(attributes, 'value');
  const value = number(attributes.value);
  const indeterminate = (flags.includes('indeterminate') || flags.includes('progress-indeterminate')) || Object.hasOwn(attributes, 'indeterminate');
  if (!Number.isFinite(max) || max <= 0) warnings.push('Progress max must be a finite number greater than zero; rendering indeterminate.');
  if (hasValue && (!Number.isFinite(value) || value < 0 || value > max)) {
    warnings.push('Progress value must be a finite number between zero and max; rendering indeterminate.');
  }
  if (indeterminate && hasValue) warnings.push('Progress indeterminate ignores the supplied value.');
  return {
    max: Number.isFinite(max) && max > 0 ? max : 100,
    value: hasValue && !indeterminate && warnings.length === 0 ? value : undefined,
    warnings,
  };
}
