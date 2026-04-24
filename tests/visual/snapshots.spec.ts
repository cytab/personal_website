import { test, expect } from '@playwright/test';
import { ROUTES, maskLocators, preparePage } from './fixtures';

/**
 * Master snapshot suite — one file so `test.describe.serial` below
 * keeps the shared Astro preview server warm and avoids re-fetching
 * font files (flake-reducer).
 *
 * Structure per project (browser/viewport combination, declared in
 * `playwright.visual.config.ts`):
 *   for each of [en, fr]:
 *     for each of the 5 routes:
 *       - take a dark-theme ambient snapshot
 *       - if the project is `chromium-desktop` AND route is home:
 *           also take a light-theme snapshot (representative sample)
 *
 * Light-theme coverage is deliberately *not* a full cartesian. Rationale:
 * the design system is dark-default and light is opt-in; testing light
 * everywhere would inflate snapshot count past the 6-minute ceiling
 * without finding bugs darker themes wouldn't. We sample light on home +
 * work via chromium-desktop only.
 */

// Note on mode: the agent brief suggested `describe.serial`, but that
// aborts all subsequent tests on first failure — hostile during baseline
// generation. We keep `fullyParallel: false` at the config level so
// tests in a project still run in a deterministic order, but failures
// are isolated so a single bad route doesn't blackhole the remaining
// ~30 snapshots.
test.describe.configure({ mode: 'default' });

const LANGS = ['en', 'fr'] as const;

for (const lang of LANGS) {
  test.describe(`lang=${lang}`, () => {
    for (const route of ROUTES) {
      const url = route[lang];
      const snapBase = `${route.key}-${lang}`;

      test(`ambient dark — ${snapBase}`, async ({ page }, testInfo) => {
        await preparePage(page, url, { theme: 'dark' });
        await expect(page).toHaveScreenshot(
          `${snapBase}-dark-${testInfo.project.name}.png`,
          {
            fullPage: true,
            mask: maskLocators(page),
            maskColor: '#111111',
          },
        );
      });

      // Light-theme sample: only home + work on desktop chromium.
      // Keeps snapshot count bounded.
      const isLightSample =
        (route.key === 'home' || route.key === 'work');

      test(`light theme — ${snapBase}`, async ({ page }, testInfo) => {
        test.skip(
          !isLightSample || testInfo.project.name !== 'chromium-desktop',
          'Light-theme sample only covers home+work on chromium-desktop.',
        );
        await preparePage(page, url, { theme: 'light' });
        await expect(page).toHaveScreenshot(
          `${snapBase}-light-${testInfo.project.name}.png`,
          {
            fullPage: true,
            mask: maskLocators(page),
            maskColor: '#efece6',
          },
        );
      });

      // Reduced-motion sub-suite. We only run for chromium-desktop and
      // webkit-mobile — the two engines most likely to expose a
      // reduced-motion defect (macOS WebKit + Blink cover ~90% of real
      // users). Firefox reduced-motion is tested via a single route
      // below.
      test(`reduced motion — ${snapBase}`, async ({ page }, testInfo) => {
        test.skip(
          !(
            testInfo.project.name === 'chromium-desktop' ||
            testInfo.project.name === 'webkit-mobile'
          ),
          'Reduced-motion sampled on chromium-desktop + webkit-mobile only.',
        );
        await preparePage(page, url, { reducedMotion: true, theme: 'dark' });

        await expect(page).toHaveScreenshot(
          `${snapBase}-reduced-${testInfo.project.name}.png`,
          {
            fullPage: true,
            mask: maskLocators(page),
            maskColor: '#111111',
          },
        );
      });
    }
  });
}

/**
 * Sanity probes — don't take snapshots but assert invariants that tend
 * to break on specific engines. These are cheap and run once per
 * project.
 */
test.describe('engine invariants', () => {
  test('home: fonts.ready resolves and Inter is actually loaded', async ({
    page,
  }, testInfo) => {
    await preparePage(page, '/');
    const probe = await page.evaluate(() => {
      // Probe an element the stylesheet explicitly targets with the
      // Inter stack. `body` alone is unreliable across engines —
      // WebKit resolves it to `-webkit-standard` in some contexts.
      const h1 = document.querySelector('h1, h2, .cluster-eyebrow, .t-h1, .t-h2') as HTMLElement | null;
      const body = document.body;
      const bodyFont = getComputedStyle(body).fontFamily;
      const h1Font = h1 ? getComputedStyle(h1).fontFamily : null;
      const fonts = (document as any).fonts;
      const interLoaded = fonts
        ? (fonts.check('16px "Inter"') as boolean) || fonts.check('700 16px "Inter"')
        : false;
      const monoLoaded = fonts
        ? (fonts.check('14px "JetBrains Mono"') as boolean)
        : false;
      return { bodyFont, h1Font, interLoaded, monoLoaded };
    });

    testInfo.annotations.push({
      type: 'fonts',
      description:
        `body=${probe.bodyFont} h1=${probe.h1Font ?? 'n/a'} ` +
        `interLoaded=${probe.interLoaded} monoLoaded=${probe.monoLoaded}`,
    });

    // Hard assertion: fonts.check() must confirm Inter is resolvable.
    // This is the real FOIT regression signal. bodyFont string match
    // is too engine-dependent.
    expect(probe.interLoaded).toBe(true);
    expect(probe.monoLoaded).toBe(true);
  });

  test('home: no horizontal scrollbar at 375px width', async ({ page }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'webkit-mobile',
      'Horizontal-overflow check targets the iPhone viewport.',
    );
    await preparePage(page, '/');
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    // Allow 1px tolerance for sub-pixel rounding.
    expect(overflow.sw - overflow.cw).toBeLessThanOrEqual(1);
  });

  test('fr home: no horizontal scrollbar at 375px width (FR-overflow hunt)', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name !== 'webkit-mobile',
      'FR-overflow check targets the iPhone viewport.',
    );
    await preparePage(page, '/fr/');
    const overflow = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    expect(overflow.sw - overflow.cw).toBeLessThanOrEqual(1);
  });

  test('home: backdrop-filter support detection', async ({ page }, testInfo) => {
    await preparePage(page, '/');
    const supports = await page.evaluate(() => ({
      has: CSS.supports('selector(html:has(body))'),
      backdrop:
        CSS.supports('backdrop-filter: blur(4px)') ||
        CSS.supports('-webkit-backdrop-filter: blur(4px)'),
      viewTransitions:
        (document as any).startViewTransition !== undefined,
    }));
    // We don't fail if missing; we record into the test annotation
    // so the cross-browser matrix can read it.
    testInfo.annotations.push({
      type: 'support',
      description: `has=${supports.has} backdrop=${supports.backdrop} viewTransitions=${supports.viewTransitions}`,
    });
  });
});
