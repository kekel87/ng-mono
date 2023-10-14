import { defineConfig } from '@playwright/test';

import { playwrightAngularPreset } from '../../playwright.angular.preset';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(playwrightAngularPreset('collections', 'http://localhost:4200'));
