/**
 * reveal-up.spec.ts — scroll into a reveal-up section; opacity stays
 * at 1 (we animate transform only, not opacity).
 */
import { test, expect } from '@playwright/test';

test.describe('Scroll reveal', () => {
  test('reveal-up sections are visible and opacity is 1 after scroll', async ({ page }) => {
    await page.goto('/about/');
    await page.waitForLoadState('networkidle');

    const sections = page.locator('.reveal-up').first();
    await sections.scrollIntoViewIfNeeded();

    const op = await sections.evaluate((el) => parseFloat(getComputedStyle(el).opacity));
    expect(op).toBeGreaterThan(0.9);
  });
});
