import {registry, registryInitialized} from './components/component-registry';
import {getAllShorthands} from './resolver/shorthand-mappings';
import {snapshotStyleMappings} from './resolver/style-resolver';
import {ICON_SIZES} from './icons/icon-parser';
import {KEYBOARD_PLATFORMS} from './parser/kbd-parser';
import type {CompileOptions} from '@taildown/shared';
import {prepareCustomComponents, snapshotCustomComponents} from './components/custom-components';
import {snapshotComponentConfig, configureComponents} from './components/component-config';

// Small offline examples shared by authoring clients. Keep these ordinary
// Taildown source so they exercise the same public syntax as authored pages.
const COMPONENT_EXAMPLES: Record<string, string> = {
  progress: ':::progress {value="35" max="100"}\nPreparing the report — 35% complete\n:::',
  avatar: ':::avatar\nAM\n:::',
  skeleton: ':::skeleton {rectangle aria-hidden="true"}\n:::',
  footnotes: 'A supporting observation belongs in a note.[^note]\n\n[^note]: Add the useful detail or source here.',
  breadcrumb: ':::breadcrumb {aria-label="Breadcrumb"}\n[Overview](#overview) / Details\n:::\n\n## Overview {#overview}\n\nIntroduce your document here.',
  pagination: ':::pagination {aria-label="Sections"}\n[First section](#first-section) [Second section](#second-section)\n:::\n\n## First section {#first-section}\n\nStart here.\n\n## Second section {#second-section}\n\nContinue here.',
  sidebar: ':::sidebar {sm}\n### On this page\n\n- [Overview](#overview)\n- [Details](#details)\n:::\n\n## Overview {#overview}\n\nIntroduce the main idea.\n\n## Details {#details}\n\nAdd supporting information.',
  carousel: ':::carousel\n## The idea\n\nIntroduce the main idea for your reader.\n\n---\n\n## A closer look\n\nShow a supporting detail or a different perspective.\n\n---\n\n## The next step\n\nLeave your reader with a useful action.\n:::',
  timeline: ':::timeline\n## Discovery {completed}\n\nGather the ideas and understand the problem.\n\n## In progress {current}\n\nBuild the first version and learn from feedback.\n\n## Next milestone\n\nRefine the details and share the result.\n:::',
  navbar: ':::navbar\n[Your project](#overview){.navbar-brand}\n\n[Overview](#overview) [More details](#details)\n:::\n\n## Overview {#overview}\n\nIntroduce your project here.\n\n## Details {#details}\n\nAdd the supporting information here.',
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
export async function getAuthoringReference(options: Pick<CompileOptions, 'components' | 'componentConfig' | 'styleMappings'> = {}) {
  const componentConfig = snapshotComponentConfig(options.componentConfig);
  const definitions = snapshotCustomComponents(options.components);
  const customStyles = Object.keys(snapshotStyleMappings(options.styleMappings) ?? {});
  await registryInitialized;
  const customComponents = prepareCustomComponents(definitions);
  const configured = configureComponents(customComponents, componentConfig);
  const components = new Map(registry.getAll().map(component => [component.name, component]));
  for (const [name, component] of configured) components.set(name, component);
  return {
    components: [...components.values()].map(component => ({
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
