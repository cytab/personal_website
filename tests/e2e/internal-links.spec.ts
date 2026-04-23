/**
 * internal-links.spec.ts — crawl every internal href on every route,
 * assert they return 200 (or 404 only for known-missing pages like
 * the CV PDFs during placeholder mode).
 *
 * External links (http[s]://) are NOT fetched — out of scope and flaky.
 * Fragment-only links (#anchor) are resolved against the current path
 * and assumed to exist as anchors on the page (not fetched).
 */
import { test, expect } from '@playwright/test';
import { ALL_ROUTES } from '../fixtures/routes';

const PLACEHOLDER_OK = new Set<string>([
  '/cv/cyrille-tabe-cv-en.pdf',
  '/cv/cyrille-tabe-cv-fr.pdf',
]);

test.describe('Internal links return 200', () => {
  for (const route of ALL_ROUTES) {
    test(`all internal hrefs on ${route.name} respond`, async ({ page, request }) => {
      await page.goto(route.path);
      const hrefs = await page.$$eval('a[href]', (els) =>
        els.map((a) => (a as HTMLAnchorElement).getAttribute('href') || ''),
      );
      const internal = new Set(
        hrefs
          .filter((h) => h && !h.startsWith('#'))
          .filter((h) => !/^(https?:|mailto:|tel:|javascript:)/i.test(h))
          .map((h) => {
            // Resolve relative URLs against the current page.
            try {
              const u = new URL(h, page.url());
              return u.pathname + u.search;
            } catch {
              return h;
            }
          }),
      );

      const failures: string[] = [];
      for (const href of internal) {
        const res = await request.get(href, { failOnStatusCode: false });
        const status = res.status();
        if (status >= 400 && !PLACEHOLDER_OK.has(href)) {
          failures.push(`${href} → ${status}`);
        }
      }
      expect(failures, `Broken internal links on ${route.path}`).toEqual([]);
    });
  }
});
