/**
 * language-switcher.spec.ts — switching locale preserves the deep-link path
 * and the <html lang> flips to fr-CA / en accordingly.
 */
import { test, expect } from '@playwright/test';
import { SIBLING } from '../fixtures/routes';

const PAIRS: Array<{ from: string; to: string; lang: string }> = [
  { from: '/',                to: '/fr/',             lang: 'fr-CA' },
  { from: '/work/',           to: '/fr/travaux/',     lang: 'fr-CA' },
  { from: '/research/',       to: '/fr/recherche/',   lang: 'fr-CA' },
  { from: '/about/',          to: '/fr/a-propos/',    lang: 'fr-CA' },
  { from: '/fr/',             to: '/',                lang: 'en' },
  { from: '/fr/travaux/',     to: '/work/',           lang: 'en' },
  { from: '/fr/recherche/',   to: '/research/',       lang: 'en' },
  { from: '/fr/a-propos/',    to: '/about/',          lang: 'en' },
];

for (const { from, to, lang } of PAIRS) {
  test(`switcher on ${from} → ${to} (lang=${lang})`, async ({ page }) => {
    await page.goto(from);
    expect(SIBLING[from]).toBe(to);

    const switcher = page.locator('a.lang-switcher').first();
    await expect(switcher).toBeVisible();
    await expect(switcher).toHaveAttribute(
      'href',
      new RegExp(`(^|/)${to.slice(1).replace(/\//g, '\\/')}$`),
    );

    const href = await switcher.evaluate((a: HTMLAnchorElement) => new URL(a.href).pathname);
    expect(href).toBe(to);
    await page.goto(href);
    await expect(page).toHaveURL(new RegExp(`${to.replace(/\//g, '\\/')}$`));
    await expect(page.locator('html')).toHaveAttribute('lang', lang);
  });
}
