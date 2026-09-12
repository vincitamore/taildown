const allowed = new Set(['theme', 'styleMappings', 'components', 'componentConfig']);
export function parseDesignSettings(text) {
  const value = JSON.parse(text);
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('Settings must be a JSON object.');
  for (const [key, entry] of Object.entries(value)) {
    if (!allowed.has(key)) throw new Error(`Unsupported setting: ${key}.`);
    if (!entry || typeof entry !== 'object' || Array.isArray(entry)) throw new Error(`${key} must be an object.`);
  }
  if (value.theme) {
    for (const key of Object.keys(value.theme)) {
      if (!['colors', 'fonts'].includes(key)) throw new Error(`Unsupported theme setting: ${key}.`);
    }
  }
  if (value.styleMappings) {
    for (const entry of Object.values(value.styleMappings)) {
      if (typeof entry !== 'string') throw new Error('Style aliases must contain CSS class strings.');
    }
  }
  return value;
}

/** Validate before replacing the session's working configuration. */
export function createDesignSettings(compile, storage = () => window.localStorage) {
  let options = {};
  return {
    get options() { return structuredClone(options); },
    async apply(text, source) {
      const next = parseDesignSettings(text);
      await compile(source, next);
      options = next;
      try { storage().setItem('taildown-editor-design', JSON.stringify(next)); return true; }
      catch { return false; }
    },
    async restore() {
      const text = storage().getItem('taildown-editor-design');
      if (text === null) return;
      const next = parseDesignSettings(text);
      await compile('', next);
      options = next;
    },
  };
}
