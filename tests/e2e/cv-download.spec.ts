/**
 * cv-download.spec.ts — the CV access point on /about/ and /fr/a-propos/.
 *
 * Until the compiled CV PDF is committed to public/cv/, the page ships a
 * mailto fallback ("CV — by email"). This test asserts the fallback is
 * present and wired. When a PDF is dropped into public/cv/, the page
 * should be updated and this test updated to assert the PDF path + 200
 * (see the Agent 4 §6.3 contract).
 */
import { test, expect } from '@playwright/test';

const MAILTO_RE = /^mailto:cyrilletabepro@gmail\.com/i;

test.describe('CV access', () => {
  for (const { lang, url } of [
    { lang: 'en', url: '/about/' },
    { lang: 'fr', url: '/fr/a-propos/' },
  ]) {
    test(`${lang.toUpperCase()} CV mailto fallback is wired on ${url}`, async ({ page }) => {
      await page.goto(url);
      const cvMailto = page.locator(`a[href^="mailto:cyrilletabepro@gmail.com"]`).filter({
        hasText: /CV/i,
      });
      await expect(cvMailto.first()).toBeVisible();
      const href = await cvMailto.first().getAttribute('href');
      expect(href).toMatch(MAILTO_RE);
      expect(href).toMatch(/subject=/i);
    });
  }
});
