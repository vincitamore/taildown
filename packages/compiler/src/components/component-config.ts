import type {ComponentsConfig, ComponentConfig} from '@taildown/shared';
import {registry, type ComponentDefinition} from './component-registry';

/** Validate and snapshot before any asynchronous registry initialization. */
export function snapshotComponentConfig(input: ComponentsConfig = {}): ComponentsConfig {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Component configuration must be an object');
  const output: ComponentsConfig = {};
  const classes = (value: unknown, path: string): string[] => {
    if (!Array.isArray(value) || value.some(item => typeof item !== 'string')) {
      throw new Error(`${path} must be an array of CSS class strings`);
    }
    return [...value];
  };
  for (const [name, config] of Object.entries(input)) {
    if (config === undefined) continue;
    if (!config || typeof config !== 'object' || Array.isArray(config)) throw new Error(`Invalid component configuration: ${name}`);
    const copy: ComponentConfig = {};
    for (const key of ['defaultVariant', 'defaultSize'] as const) {
      if (config[key] !== undefined) {
        if (typeof config[key] !== 'string') throw new Error(`${name}.${key} must be a string`);
        copy[key] = config[key];
      }
    }
    if (config.defaultClasses !== undefined) copy.defaultClasses = classes(config.defaultClasses, `${name}.defaultClasses`);
    for (const key of ['variants', 'sizes'] as const) {
      const collection = config[key];
      if (collection === undefined) continue;
      if (!collection || typeof collection !== 'object' || Array.isArray(collection)) throw new Error(`${name}.${key} must be an object`);
      copy[key] = Object.fromEntries(Object.entries(collection).map(([label, value]) => {
        if (!value || typeof value !== 'object') throw new Error(`Invalid ${name}.${key}.${label}`);
        return [label, {classes: classes(value.classes, `${name}.${key}.${label}.classes`), description: value.description}];
      }));
    }
    output[name] = copy;
  }
  return output;
}

/** Overlay presets locally, preserving component structure and runtime identity. */
export function configureComponents(custom: Map<string, ComponentDefinition>, config: ComponentsConfig): Map<string, ComponentDefinition> {
  const result = new Map(custom);
  for (const [name, preset] of Object.entries(config)) {
    if (!preset) continue;
    const base = custom.get(name) ?? registry.get(name);
    if (!base) throw new Error(`Cannot configure unknown component: ${name}`);
    const component = {
      ...base,
      defaultClasses: [...base.defaultClasses, ...(preset.defaultClasses ?? [])],
      variants: {...base.variants, ...Object.fromEntries(Object.entries(preset.variants ?? {}).map(([key, value]) => [key, [...value.classes]]))},
      sizes: {...base.sizes, ...Object.fromEntries(Object.entries(preset.sizes ?? {}).map(([key, value]) => [key, [...value.classes]]))},
      defaultVariant: preset.defaultVariant ?? base.defaultVariant,
      defaultSize: preset.defaultSize ?? base.defaultSize,
    };
    if (component.defaultVariant && !Object.hasOwn(component.variants, component.defaultVariant)) throw new Error(`Unknown default variant "${component.defaultVariant}" for ${name}`);
    if (component.defaultSize && !Object.hasOwn(component.sizes, component.defaultSize)) throw new Error(`Unknown default size "${component.defaultSize}" for ${name}`);
    result.set(name, component);
  }
  return result;
}
