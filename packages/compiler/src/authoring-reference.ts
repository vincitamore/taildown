import {registry, registryInitialized} from './components/component-registry';
import {getAllShorthands} from './resolver/shorthand-mappings';

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
  };
}
