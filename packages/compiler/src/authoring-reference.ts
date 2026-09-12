import {registry, registryInitialized} from './components/component-registry';
import {getAllShorthands} from './resolver/shorthand-mappings';
import {ICON_SIZES} from './icons/icon-parser';
import {KEYBOARD_PLATFORMS} from './parser/kbd-parser';
import type {CompileOptions} from '@taildown/shared';
import {prepareCustomComponents} from './components/custom-components';

// Small offline examples shared by authoring clients. Keep these ordinary
// Taildown source so they exercise the same public syntax as authored pages.
const COMPONENT_EXAMPLES: Record<string, string> = {
  card: ':::card\n## A clear starting point\n\nReplace this text with your own idea.\n:::',
  alert: ':::alert{info}\n**Good to know**\n\nAdd a useful notice for your reader.\n:::',
  callout: ':::callout\n**A closer look**\n\nUse this space for an insight or supporting detail.\n:::',
  tabs: ':::tabs\n## Overview\n\nStart with the main idea.\n\n## Details\n\nAdd the supporting information here.\n:::',
  accordion: ':::accordion\n**How does it work?**\n\nWrite a helpful answer here.\n\n**What comes next?**\n\nDescribe the next step.\n:::',
  details: ':::details\n**Read the details**\n\nKeep optional information here so the main document stays focused.\n:::',
  stats: ':::stats{3}\n### 24 {stat}\nProjects\n\n### 8 {stat}\nContributors\n\n### 3 {stat}\nMilestones\n:::',
  steps: ':::steps{numbered connected}\n### Explore {step completed}\nUnderstand the problem.\n\n### Create {step current}\nMake the first version.\n\n### Refine {step}\nTest it and improve the details.\n:::',
  definitions: ':::definitions\n**Primitive** {term}\n: A small building block that can be combined with others.\n\n**Composition** {term}\n: An arrangement of building blocks that serves a purpose.\n:::',
};

/** Authoring suggestions reflect the same initialized definitions as compilation. */
export async function getAuthoringReference(options: Pick<CompileOptions, 'components' | 'styleMappings'> = {}) {
  const definitions = Object.fromEntries(Object.entries(options.components ?? {}).map(([name, definition]) =>
    [name, {...definition, defaultClasses: [...definition.defaultClasses]}]));
  const customStyles = Object.keys(options.styleMappings ?? {});
  await registryInitialized;
  const customComponents = prepareCustomComponents(definitions);
  return {
    components: [...registry.getAll(), ...customComponents.values()].map(component => ({
      name: component.name,
      description: component.description ?? '',
      example: COMPONENT_EXAMPLES[component.name] ?? (customComponents.has(component.name) ? `:::${component.name}\nYour content here.\n:::` : undefined),
      attributes: [...new Set([...Object.keys(component.variants), ...Object.keys(component.sizes)])].sort(),
    })).sort((a, b) => a.name.localeCompare(b.name)),
    styles: [...new Set([...getAllShorthands(), ...customStyles])].sort(),
    iconSizes: Object.keys(ICON_SIZES),
    keyboardPlatforms: Object.keys(KEYBOARD_PLATFORMS),
  };
}
