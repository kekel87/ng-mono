/* eslint-disable */
import { defineConfig } from '@playwright/test';

import { playwrightAngularPreset } from '../../playwright.angular.preset';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(playwrightAngularPreset('netatmo', 'http://localhost:4201'));
