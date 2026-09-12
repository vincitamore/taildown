import {registry, registryInitialized} from './components/component-registry';
import {getAllShorthands} from './resolver/shorthand-mappings';
import {ICON_SIZES} from './icons/icon-parser';
import {KEYBOARD_PLATFORMS} from './parser/kbd-parser';

/** Authoring suggestions reflect the same initialized definitions as compilation. */
export async function getAuthoringReference() {
  await registryInitialized;
  return {
    components: registry.getAll().map(component => ({
      name: component.name,
      description: component.description ?? '',
      attributes: [...new Set([...Object.keys(component.variants), ...Object.keys(component.sizes)])].sort(),
    })).sort((a, b) => a.name.localeCompare(b.name)),
    styles: getAllShorthands().sort(),
    iconSizes: Object.keys(ICON_SIZES),
    keyboardPlatforms: Object.keys(KEYBOARD_PLATFORMS),
  };
}
