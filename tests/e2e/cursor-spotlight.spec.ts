/**
 * cursor-spotlight.spec.ts — moving the cursor on / updates the
 * --cursor-x CSS custom property.
 */
import { test, expect } from '@playwright/test';

test.describe('Cursor spotlight', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Cursor spotlight requires a coarse-pointer-off environment',
  );

  test('home renders the spotlight element and reacts to mousemove', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const spotlight = page.locator('.cursor-spotlight');
    await expect(spotlight).toHaveCount(1);

    await page.mouse.move(120, 240);
    await page.mouse.move(400, 300);

    // Web-first assertion: poll until the CSS var is non-empty/non-zero
    await expect.poll(
      () => spotlight.evaluate((el) => getComputedStyle(el).getPropertyValue('--cursor-x').trim()),
      { timeout: 2000 },
    ).toMatch(/^\d+(\.\d+)?px$/);

    const x = await spotlight.evaluate((el) => getComputedStyle(el).getPropertyValue('--cursor-x').trim());
    expect(parseInt(x, 10)).toBeGreaterThan(0);
  });

  test('/work/ does NOT render the spotlight', async ({ page }) => {
    await page.goto('/work/');
    await expect(page.locator('.cursor-spotlight')).toHaveCount(0);
  });
});
