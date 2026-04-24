/**
 * cv-download.spec.ts — the CV access point on /about/ and /fr/a-propos/.
 *
 * After the CV-focused restructure, the About page ships BOTH a direct
 * PDF download link and a mailto fallback. The PDF itself is compiled on
 * CI (see `.github/workflows/deploy.yml`, `continue-on-error` step), so
 * the link may 404 in a fresh local build before deploy — that is
 * acceptable per the brief. We assert the link is well-formed but do NOT
 * fetch the PDF.
 */
import { test, expect } from '@playwright/test';

const MAILTO_RE = /^mailto:cyrilletabepro@gmail\.com/i;
const PDF_HREF = '/cv/cyrille-tabe-cv-en.pdf';

test.describe('CV access', () => {
  for (const { lang, url } of [
    { lang: 'en', url: '/about/' },
    { lang: 'fr', url: '/fr/a-propos/' },
  ]) {
    test(`${lang.toUpperCase()} About page exposes a download anchor on ${url}`, async ({ page }) => {
      await page.goto(url);

      // Direct PDF download anchor — must be present with `download`
      // attribute and point at /cv/cyrille-tabe-cv-en.pdf.
      const downloadLink = page.locator(`a[href="${PDF_HREF}"][download]`);
      await expect(downloadLink.first()).toBeVisible();
      await expect(downloadLink.first()).toHaveText(/download|télécharger/i);

      // Mailto fallback — also present, subject line wired.
      const cvMailto = page.locator(`a[href^="mailto:cyrilletabepro@gmail.com"]`);
      await expect(cvMailto.first()).toBeVisible();
      const mailtoHref = await cvMailto.first().getAttribute('href');
      expect(mailtoHref).toMatch(MAILTO_RE);
    });
  }

  test('FR About page annotates the PDF as the English version', async ({ page }) => {
    await page.goto('/fr/a-propos/');
    // The brief asks for a small "(version anglaise)" note near the
    // download button on the FR page.
    await expect(page.getByText(/version\s*anglaise/i).first()).toBeVisible();
  });

  // The PDF may or may not 200 depending on whether CI ran latexmk.
  // We probe it and annotate, but never fail on a 404 — locally the
  // file is a placeholder (.gitkeep only).
  test('PDF link status is observed (soft probe)', async ({ request }, testInfo) => {
    const res = await request.get(PDF_HREF, { failOnStatusCode: false });
    testInfo.annotations.push({
      type: 'cv-pdf-status',
      description: `${PDF_HREF} → ${res.status()}`,
    });
  });
});
