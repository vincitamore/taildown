/** Shared theme runtime for compiled documents. */
import type { ComponentBehavior } from '../index';
import {generateDarkModeScript, getDarkModeOptions} from '../../themes/dark-mode';
import {getDefaultConfig} from '../../config/default-config';

export const darkModeBehavior: ComponentBehavior = {
  name: 'dark-mode',
  size: 2000,
  code: generateDarkModeScript(getDarkModeOptions(getDefaultConfig())),
};
