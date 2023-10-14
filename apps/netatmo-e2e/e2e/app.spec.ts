import { test, expect } from '@playwright/test';

test('should be redirect to netatmo auth page', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveURL(/https:\/\/auth.netatmo.com\//);
});
