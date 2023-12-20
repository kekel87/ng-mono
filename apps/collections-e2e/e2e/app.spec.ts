import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

let page: Page;

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage();
});

test.afterAll(async () => {
  await page.close();
});

test.describe('Before authentication', () => {
  test.beforeEach(async () => {
    await page.goto('/');
  });

  test.describe('Before authentication', () => {
    test('should display welcome message', async () => {
      await expect(page.locator('col-header h1')).toContainText('Collections');
    });

    // test('User should be able to authenticate himself', async () => {
    //   await page.locator('[name="email"]').fill('mr.test@gmail.com');
    //   await page.locator('[name="password"]').fill('azerty123456');
    //   await page.locator('.dev-auth button').click();

    //   await expect(page.locator('col-login col-loader')).toBeHidden();
    //   await expect(page.locator('col-dashboard')).toBeVisible();
    // });
  });

  // test.describe('Once authenticated', () => {
  //   test.beforeEach(async () => {
  //     await expect(page.locator('col-login col-loader')).toBeHidden();
  //   });

  //   test.describe('Once authenticated', () => {
  //     test('User should see loader in games card', async () => {
  //       await expect(page.locator('mat-card:nth-of-type(1) col-loader')).toBeVisible();
  //     });

  //     test('User should see how many games he has', async () => {
  //       await expect(page.locator('mat-card:nth-of-type(1) mat-card-subtitle')).toContainText('170');
  //     });
  //   });
  // });
});
