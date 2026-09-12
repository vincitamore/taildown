import type {ComponentDefinition as PublicDefinition} from '@taildown/shared';
import {COMPONENT_NAME_REGEX} from '@taildown/shared';
import {registry, type ComponentDefinition} from './component-registry';

/** Copy caller-owned definitions; compilation never mutates the shared registry. */
export function prepareCustomComponents(definitions?: Record<string, PublicDefinition>): Map<string, ComponentDefinition> {
  const components = new Map<string, ComponentDefinition>();
  for (const [name, definition] of Object.entries(definitions ?? {})) {
    if (!COMPONENT_NAME_REGEX.test(name) || definition.name !== name) {
      throw new Error(`Custom component key and name must match a valid component name: ${name}`);
    }
    if (registry.has(name)) {
      throw new Error(`Custom component "${name}" conflicts with a registered component. Choose a distinct name.`);
    }
    if (definition.htmlElement && !/^[a-z][a-z0-9-]*$/.test(definition.htmlElement)) {
      throw new Error(`Invalid HTML element for custom component "${name}": ${definition.htmlElement}`);
    }
    components.set(name, {
      name, htmlElement: definition.htmlElement ?? 'div',
      defaultClasses: [...definition.defaultClasses], variants: {}, sizes: {}, hasChildren: true,
    });
  }
  return components;
}
