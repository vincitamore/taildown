import { describe, expect, it } from 'vitest';
import { getDefaultConfig } from '../default-config';
import { extractDifferences } from '../theme-merger';

describe('theme differences', () => {
  it('returns only changed top-level configuration sections without mutating either input', () => {
    const original = getDefaultConfig();
    const changed = getDefaultConfig();
    changed.theme.colors.primary.DEFAULT = '#123456';
    expect(extractDifferences(original, changed)).toEqual({ theme: changed.theme });
    expect(original.theme.colors.primary.DEFAULT).not.toBe('#123456');
    expect(extractDifferences(original, getDefaultConfig())).toEqual({});
  });
});
