import { type Page } from '@playwright/test';

/**
 * Shared prep used before every screenshot. The site ships zero JS, so
 * all we need to do is:
 *  1. Strip the production CSP's `upgrade-insecure-requests` directive
 *     (would otherwise upgrade preview-server http:// requests to https://
 *     and break every subresource).
 *  2. Navigate and wait for `fonts.ready` — custom font load is the single
 *     biggest source of false-positive diffs.
 */
export async function preparePage(
  page: Page,
  url: string,
  opts: { reducedMotion?: boolean; theme?: 'dark' | 'light' } = {},
) {
  // ---- CSP bypass ----
  await page.route('**/*', async (route) => {
    const req = route.request();
    if (req.resourceType() === 'document' && req.method() === 'GET') {
      const response = await route.fetch();
      let body = await response.text();
      body = body.replace(/upgrade-insecure-requests;?/g, '');
      await route.fulfill({ response, body });
      return;
    }
    await route.continue();
  });

  if (opts.reducedMotion) {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  }

  await page.goto(url, { waitUntil: 'domcontentloaded' });

  if (opts.theme === 'light') {
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-theme', 'light');
    });
  }

  await page.evaluate(async () => {
    if ((document as any).fonts && (document as any).fonts.ready) {
      await (document as any).fonts.ready;
    }
  });

  await page.waitForLoadState('networkidle').catch(() => undefined);
}

export function maskLocators(_page: Page) {
  // Nothing non-deterministic left on the page after the simplification
  // pass; returning an empty list keeps the toHaveScreenshot call shape.
  return [] as ReturnType<Page['locator']>[];
}

export const ROUTES: Array<{ key: string; en: string; fr: string }> = [
  { key: 'home',     en: '/',           fr: '/fr/' },
  { key: 'work',     en: '/work/',      fr: '/fr/travaux/' },
  { key: 'research', en: '/research/',  fr: '/fr/recherche/' },
  { key: 'about',    en: '/about/',     fr: '/fr/a-propos/' },
  // Astro static build emits `404.html`; trailing slash would 404 on
  // the preview server.
  { key: '404',      en: '/404.html',   fr: '/404.html' },
];
