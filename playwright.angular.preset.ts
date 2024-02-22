import { workspaceRoot } from '@nx/devkit';
import { nxE2EPreset } from '@nx/playwright/preset';
import { PlaywrightTestConfig, devices } from '@playwright/test';

export function playwrightAngularPreset(project: string, url: string): PlaywrightTestConfig {
  return {
    ...nxE2EPreset(__filename, { testDir: './src' }),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  projects: [{ name: 'chromium', use: devices['Desktop Chrome'] }],
  workers: process.env.CI ? 2 : undefined,
  use: {
    baseURL: process.env['BASE_URL'] || url,
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },
  /* Run your local dev server before starting the tests */
  webServer: {
    command: `npx nx serve ${project}`,
    url,
    reuseExistingServer: !process.env.CI,
    cwd: workspaceRoot,
  },
  }
}
