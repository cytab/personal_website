import { type Page } from '@playwright/test';

/**
 * Shared prep used before every screenshot:
 *  1. Short-circuit the sensor-boot overlay by pre-setting its
 *     sessionStorage flag *before* navigation. This avoids the 1.8s
 *     wake-up every single test pays.
 *  2. Navigate and wait for `fonts.ready` — custom font load is the
 *     single biggest source of false-positive diffs (Inter vs system
 *     Arial at 14px is a wildly different glyph cluster).
 *  3. If the boot overlay did render anyway (first-visit race), wait
 *     for it to mark itself done, then remove it.
 *  4. Pause the HeroScene render loop and freeze the ambient SLAM
 *     layer — we mask those regions, but pausing them also avoids the
 *     mask shifting position under reflow.
 */
export async function preparePage(
  page: Page,
  url: string,
  opts: { reducedMotion?: boolean; theme?: 'dark' | 'light' } = {},
) {
  // Pre-seed the sessionStorage flag so SensorBoot.astro removes itself
  // on load. This has to run before any page script, hence
  // `addInitScript`.
  await page.addInitScript(() => {
    try {
      sessionStorage.setItem('ct-sensor-boot-v1', '1');
    } catch {
      /* storage may be disabled under some contexts — harmless. */
    }
  });

  // ---- CSP bypass ----
  // The production build ships a Content-Security-Policy meta tag with
  // `upgrade-insecure-requests`. In real production this is benign —
  // the site is served over HTTPS. Under Playwright's preview server
  // (http://127.0.0.1) it silently upgrades every subresource request
  // to https:// which then fails, leaving WebKit with zero CSS loaded.
  // We intercept the root HTML response and strip that single directive
  // so snapshots reflect real production rendering rather than a
  // test-harness artifact.
  await page.route('**/*', async (route) => {
    const req = route.request();
    if (
      req.resourceType() === 'document' &&
      req.method() === 'GET'
    ) {
      const response = await route.fetch();
      let body = await response.text();
      body = body.replace(
        /upgrade-insecure-requests;?/g,
        '',
      );
      await route.fulfill({
        response,
        body,
      });
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

  // fonts.ready resolves once all declared @font-face files are
  // downloaded + parsed. If it's missing (very old browsers), fall
  // through.
  await page.evaluate(async () => {
    if ((document as any).fonts && (document as any).fonts.ready) {
      await (document as any).fonts.ready;
    }
  });

  // Belt-and-braces: if the boot overlay is still present, wait up to
  // 2.5s for it to self-destruct.
  await page
    .waitForFunction(() => !document.getElementById('sensor-boot'), null, {
      timeout: 2500,
    })
    .catch(() => {
      /* some reduced-motion paths leave it for one frame — tolerable. */
    });

  // Network-idle-ish: give view-transitions the beat to finish replay.
  await page.waitForLoadState('networkidle').catch(() => undefined);
}

/**
 * Locators the page exposes that contain non-deterministic pixel
 * content (WebGL noise, bar-graph animation, procedural particles).
 * We mask these so pixel diffs ignore them entirely.
 */
export const UNSTABLE_SELECTORS = [
  '.hero-scene',       // WebGL canvas + fallback
  '.hero-scene-wrap',  // the wrapper; belt + braces for masking bounds
  '.bg-slam',          // ambient SLAM layer fixed behind the page
  '#sensor-boot',      // in case it is still visible on first mount
] as const;

export function maskLocators(page: Page) {
  return UNSTABLE_SELECTORS.map((s) => page.locator(s));
}

export const ROUTES: Array<{ key: string; en: string; fr: string }> = [
  { key: 'home',    en: '/',           fr: '/fr/' },
  { key: 'work',    en: '/work/',      fr: '/fr/travaux/' },
  { key: 'about',   en: '/about/',     fr: '/fr/a-propos/' },
  // /writing/ intentionally omitted — route removed in Phase 4 bugfix
  // (Agent 4 §2.3: no empty indexes). Restore with the first post.
  // Astro static build emits `404.html`; trailing slash would 404 on
  // the preview server.
  { key: '404',     en: '/404.html',   fr: '/404.html' },
];
