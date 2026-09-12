const DRAFT_KEY = 'taildown-editor-draft';
const THEME_KEY = 'taildown-editor-theme';

/** Browser recovery is best-effort; file saving must not depend on it. */
export function createDraftStore(getStorage = () => window.localStorage, report = () => {}) {
  let theme = 'light';
  const valid = value => value && typeof value.content === 'string' && typeof value.filename === 'string' && value.filename.length > 0;
  const readDraft = () => {
    const storage = getStorage();
    const raw = storage.getItem(DRAFT_KEY);
    if (raw !== null) {
      const value = JSON.parse(raw);
      if (!valid(value)) throw new Error('Invalid draft');
      return {content: value.content, filename: value.filename};
    }
    // Read the previous two-key format; migrate only after a successful write.
    const content = storage.getItem('taildown-editor-content');
    return content === null ? null : {content, filename: storage.getItem('taildown-editor-filename') || 'untitled.td'};
  };
  return {
    load() {
      try {
        const draft = readDraft();
        report(true);
        return draft;
      } catch {
        report(false);
        return null;
      }
    },
    save(content, filename) {
      const draft = {content, filename};
      try {
        const storage = getStorage();
        // One atomic replacement prevents a new filename being paired with old content.
        storage.setItem(DRAFT_KEY, JSON.stringify(draft));
        report(true);
        try {
          storage.removeItem('taildown-editor-content');
          storage.removeItem('taildown-editor-filename');
        } catch { /* The new snapshot is already durable. */ }
        return true;
      } catch {
        report(false);
        return false;
      }
    },
    isSaved(content, filename) {
      try {
        // Another tab can replace the recovery copy after our last successful save.
        const draft = readDraft();
        return draft !== null && draft.content === content && draft.filename === filename;
      } catch { return false; }
    },
    readTheme() {
      try {
        const value = getStorage().getItem(THEME_KEY);
        if (value === 'light' || value === 'dark') theme = value;
      } catch { /* Retain the session preference. */ }
      return theme;
    },
    saveTheme(value) {
      theme = value === 'dark' ? 'dark' : 'light';
      try { getStorage().setItem(THEME_KEY, theme); } catch { /* Theme still works in memory. */ }
    },
  };
}
