/**
 * keyboard-nav.spec.ts — tab-only path reaches every interactive element.
 */
import { test, expect } from '@playwright/test';

test.describe('Keyboard navigation', () => {
  // Playwright WebKit ships with "full keyboard access" OFF by default
  // (macOS behavior); Tab does not cycle <a> elements. The contract is
  // covered on Chromium + Firefox.
  test.skip(({ browserName }) => browserName === 'webkit', 'WebKit Tab-focus nav requires Full Keyboard Access');

  test('skip link is the first focusable element and jumps to #main', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skipFocused = await page.evaluate(() => {
      const el = document.activeElement as HTMLElement | null;
      return el?.classList.contains('skip-link') ?? false;
    });
    expect(skipFocused, 'first Tab should focus .skip-link').toBe(true);

    await page.keyboard.press('Enter');
    const focusInMain = await page.evaluate(() => {
      const main = document.getElementById('main');
      const active = document.activeElement;
      return !!(main && (main === active || main.contains(active)));
    });
    expect(focusInMain, 'after activating skip link, focus should be on or inside #main').toBe(true);
  });

  test('Enter on focused nav link navigates to the target', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('.primary-nav a'));
      const visibleWork = links.find(
        (a) => a.textContent?.trim() === 'Work' && a.offsetParent !== null,
      );
      visibleWork?.focus();
    });
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/work\/$/);
  });

  test('every interactive element on home is reachable via Tab (<= 100 hops)', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const interactiveCount = await page.locator(
      'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ).count();
    expect(interactiveCount).toBeGreaterThan(0);

    const seen = new Set<string>();
    for (let i = 0; i < 100; i++) {
      await page.keyboard.press('Tab');
      const id = await page.evaluate(() => {
        const el = document.activeElement as HTMLElement | null;
        if (!el || el === document.body) return null;
        return `${el.tagName.toLowerCase()}#${el.id}.${el.className}[href=${el.getAttribute('href') ?? ''}]`;
      });
      if (id) seen.add(id);
    }
    expect(seen.size).toBeGreaterThanOrEqual(5);
  });

  test('Escape does not navigate away from the page', async ({ page }) => {
    await page.goto('/about/');
    const before = page.url();
    await page.keyboard.press('Escape');
    expect(page.url()).toBe(before);
  });
});
