/**
 * 404.spec.ts — visiting a bogus route yields the on-brand 404 page.
 *
 * Astro's `preview` server serves `dist/404.html` for unknown paths on
 * a static build. We assert the on-brand marker `§ 404 / ROUTE NOT IN PLAN`
 * is present and the "back home" link works.
 */
import { test, expect } from '@playwright/test';

test('bogus route serves on-brand 404 (EN)', async ({ page }) => {
  const response = await page.goto('/this-route-absolutely-does-not-exist/');
  // Astro preview returns a 404 status along with the body.
  expect(response?.status()).toBe(404);
  await expect(page.locator('h1')).toBeVisible();
  await expect(page.locator('text=§ 404 / ROUTE NOT IN PLAN')).toBeVisible();
  // "Back to start" link exists and points home.
  const backHome = page.locator('a[href="/"]').last();
  await expect(backHome).toBeVisible();
});

test('404 page has navigation chrome (primary nav + footer)', async ({ page }) => {
  await page.goto('/definitely-missing-page/');
  await expect(page.locator('.primary-nav')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
