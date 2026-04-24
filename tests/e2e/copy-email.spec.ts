/**
 * copy-email.spec.ts — clicking the copy-email button places the email
 * on the clipboard and surfaces the toast.
 */
import { test, expect } from '@playwright/test';

test.describe('Copy email', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Clipboard permission grants are Chromium-specific in Playwright',
  );

  test('clicking the About copy-email button copies the address', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    const btn = page.locator('.copy-email[data-copy-email="cyrilletabepro@gmail.com"]').first();
    await expect(btn).toBeVisible();
    await btn.click();

    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toBe('cyrilletabepro@gmail.com');

    await expect(page.locator('.cmdk-toast')).toHaveText(/Copied|Copié/);
  });
});
