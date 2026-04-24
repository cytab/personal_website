/**
 * nav.spec.ts — primary nav reaches every route in both locales.
 * The active-nav link is marked with aria-current="page".
 */
import { test, expect } from '@playwright/test';
import { EN_ROUTES, FR_ROUTES } from '../fixtures/routes';

const EN_LEAVES = [
  { label: 'Work',     expectPath: '/work/' },
  { label: 'Research', expectPath: '/research/' },
  { label: 'About',    expectPath: '/about/' },
];
const FR_LEAVES = [
  { label: 'Travaux',   expectPath: '/fr/travaux/' },
  { label: 'Recherche', expectPath: '/fr/recherche/' },
  { label: 'À propos',  expectPath: '/fr/a-propos/' },
];

test.describe('Primary nav — EN', () => {
  for (const leaf of EN_LEAVES) {
    test(`reaches ${leaf.expectPath} via nav label "${leaf.label}"`, async ({ page }) => {
      await page.goto('/');
      const link = page
        .locator('.primary-nav a:visible', { hasText: new RegExp(`^\\s*${leaf.label}\\s*$`) })
        .first();
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toBe(leaf.expectPath);
      await page.goto(leaf.expectPath);
      await expect(page).toHaveURL(new RegExp(`${leaf.expectPath.replace(/\//g, '\\/')}$`));
    });
  }

  for (const route of EN_ROUTES.filter((r) => r.pathKey !== '')) {
    test(`active nav link is set on ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
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
        .locator('.primary-nav a:visible', { hasText: new RegExp(`^\\s*${leaf.label}\\s*$`) })
        .first();
      await expect(link).toBeVisible();
      const href = await link.getAttribute('href');
      expect(href).toBe(leaf.expectPath);
      await page.goto(leaf.expectPath);
      await expect(page).toHaveURL(new RegExp(`${leaf.expectPath.replace(/\//g, '\\/')}$`));
    });
  }

  for (const route of FR_ROUTES.filter((r) => r.pathKey !== '')) {
    test(`active nav link is set on ${route.path}`, async ({ page }) => {
      await page.goto(route.path);
      const active = page.locator('.primary-nav a[aria-current="page"]:visible').first();
      await expect(active).toBeVisible();
      await expect(active).toHaveAttribute('href', route.path);
    });
  }
});
