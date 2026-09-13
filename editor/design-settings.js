const allowed = new Set(['theme', 'styleMappings', 'components', 'componentConfig']);
export const typographyChoices = [
  {name: 'Modern', font: 'system-ui, -apple-system, "Segoe UI", sans-serif'},
  {name: 'Editorial', font: 'Georgia, "Times New Roman", serif'},
  {name: 'Technical', font: 'ui-monospace, Consolas, "Courier New", monospace'},
];

export function prepareTypography(text, name) {
  const choice = typographyChoices.find(choice => choice.name === name);
  if (!choice) throw new Error('Unknown typography choice.');
  const options = parseDesignSettings(text);
  options.theme = {...options.theme, fonts: {...options.theme?.fonts, sans: choice.font}};
  return JSON.stringify(options, null, 2);
}
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
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
      if (!object(value.theme[key])) throw new Error(`theme.${key} must be an object.`);
    }
    for (const [name, font] of Object.entries(value.theme.fonts || {})) {
      if (typeof font !== 'string' || !font.trim()) throw new Error(`Font "${name}" must be a non-empty font stack string.`);
    }
    for (const [name, color] of Object.entries(value.theme.colors || {})) {
      if (typeof color === 'string' && color.trim()) continue;
      if (!object(color) || !Object.keys(color).length) throw new Error(`Color "${name}" must be a color string or a non-empty shade object.`);
      for (const [shade, entry] of Object.entries(color)) {
        if (!/^(DEFAULT|50|[1-9]00|950)$/.test(shade)) throw new Error(`Unsupported shade "${name}.${shade}".`);
        if (typeof entry !== 'string' || !entry.trim()) throw new Error(`Color "${name}.${shade}" must be a non-empty color string.`);
      }
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
