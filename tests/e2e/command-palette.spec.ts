/**
 * command-palette.spec.ts — ⌘K / Ctrl+K opens a dialog, type filters,
 * Enter navigates. Runs on Chromium desktop.
 */
import { test, expect } from '@playwright/test';

test.describe('Command palette (⌘K)', () => {
  test.skip(
    ({ browserName }) => browserName !== 'chromium',
    'Command palette is tested on Chromium only (dialog semantics + shortcuts)',
  );

  test('Ctrl+K opens palette, "about" filters, Enter navigates to /about/', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Open via keyboard shortcut
    await page.keyboard.press('Control+k');

    const dialog = page.locator('dialog[data-cmdk]');
    await expect(dialog).toBeVisible();

    // Filter: type "about"
    const input = dialog.locator('input.cmdk__input');
    await expect(input).toBeFocused();
    await input.fill('about');

    // Activate the first visible item
    await page.keyboard.press('Enter');

    // URL changes to /about/
    await expect(page).toHaveURL(/\/about\/?$/);
  });

  test('Escape closes the palette', async ({ page }) => {
    await page.goto('/work/');
    await page.waitForLoadState('networkidle');

    await page.keyboard.press('Control+k');
    const dialog = page.locator('dialog[data-cmdk]');
    await expect(dialog).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
  });
});
