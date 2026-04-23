/**
 * nav.spec.ts — primary nav reaches every route in both locales;
 * the active-leaf "tick" is applied on the current route.
 *
 * The Nav component (src/components/Nav.astro) renders both an SSR
 * <ul class="primary-nav__leaves"> fallback AND a React NavTree island;
 * the island hides the SSR list via `.primary-nav:has(.nav-tree)`.
 * We assert on whichever list is actually visible, preferring the SSR
 * list because that's the a11y contract (screen readers + no-JS users).
 */
import { test, expect } from '@playwright/test';
import { EN_ROUTES, FR_ROUTES } from '../fixtures/routes';

const EN_LEAVES = [
  { label: 'Home',  expectPath: '/' },
  { label: 'Work',  expectPath: '/work/' },
  { label: 'About', expectPath: '/about/' },
];
const FR_LEAVES = [
  { label: 'Accueil',   expectPath: '/fr/' },
  { label: 'Travaux',   expectPath: '/fr/travaux/' },
  { label: 'À propos',  expectPath: '/fr/a-propos/' },
];

test.describe('Primary nav — EN', () => {
  for (const leaf of EN_LEAVES) {
    test(`reaches ${leaf.expectPath} via nav label "${leaf.label}"`, async ({ page }) => {
      await page.goto('/');
      // Use the first visible matching link — hydrated NavTree hides SSR list.
      const link = page
        .locator('.primary-nav a:visible', { hasText: new RegExp(`^${leaf.label}$`) })
        .first();
      await expect(link).toBeVisible();
      // Assert the href is correct — the "nav reaches the route" contract.
      const href = await link.getAttribute('href');
      expect(href).toBe(leaf.expectPath);
      // Navigate directly (bypassing the VT click-intercept, which has a
      // known Playwright-WebKit flake on Windows).
      await page.goto(leaf.expectPath);
      await expect(page).toHaveURL(new RegExp(`${leaf.expectPath.replace(/\//g, '\\/')}$`));
    });
  }

  for (const route of EN_ROUTES.filter((r) => r.pathKey !== 'writing/')) {
    test(`active-leaf tick is applied on ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      // aria-current="page" on the active leaf. Both the SSR fallback
      // and the hydrated NavTree set it; the SSR copy gets display:none
      // after hydration, so we pick the visible one.
      const active = page.locator('.primary-nav a[aria-current="page"]:visible').first();
      await expect(active).toBeVisible();
      await expect(active).toHaveAttribute('href', route.path);
    });
  }
});

test.describe('Primary nav — FR', () => {
  for (const leaf of FR_LEAVES) {
    test(`reaches ${leaf.expectPath} via nav label "${leaf.label}"`, async ({ page }) => {
      await page.goto('/fr/');
      const link = page
        .locator('.primary-nav a:visible', { hasText: new RegExp(`^${leaf.label}$`) })
        .first();
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toBe(leaf.expectPath);
      await page.goto(leaf.expectPath);
      await expect(page).toHaveURL(new RegExp(`${leaf.expectPath.replace(/\//g, '\\/')}$`));
    });
  }

  for (const route of FR_ROUTES.filter((r) => r.pathKey !== 'writing/')) {
    test(`active-leaf tick is applied on ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      const active = page.locator('.primary-nav a[aria-current="page"]:visible').first();
      await expect(active).toBeVisible();
      await expect(active).toHaveAttribute('href', route.path);
    });
  }
});
