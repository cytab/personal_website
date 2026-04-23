/**
 * reduced-motion.spec.ts — with `prefers-reduced-motion: reduce` emulated,
 * assert that:
 *  - the hero canvas does not animate (Three.js island is paused /
 *    renders a single static frame)
 *  - no transform animations propagate through the page (CSS animations
 *    either have animation-duration collapsed to 0s or no iteration runs)
 *
 * Strategy:
 *  1. Navigate with the reduce-motion emulation applied.
 *  2. Assert the hero pause button is NOT rendered (per HeroScene:
 *     the pause control is suppressed when reduced-motion is set;
 *     see src/components/HeroScene/index.tsx line 449).
 *  3. Snapshot the canvas contents at t=0 and t=~350ms (via rAF tick,
 *     not a waitForTimeout) and assert pixel data is identical.
 */
import { test, expect } from '@playwright/test';
import { ALL_ROUTES } from '../fixtures/routes';

test.use({ colorScheme: 'dark' });

test.describe('Reduced motion', () => {
  test.beforeEach(async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
  });

  test('hero pause button is hidden on home (reduced-motion static twin)', async ({ page, browserName }) => {
    // WebKit in Playwright does not consistently propagate the reduced-motion
    // emulation into hydrated React islands; real Safari users are covered by
    // the media query. Skip on WebKit to avoid browser-engine flakiness.
    test.skip(browserName === 'webkit', 'Playwright WebKit + emulateMedia + hydrated React island flake');

    await page.goto('/');
    // If reduced-motion emulation is in effect, HeroScene returns early
    // without the <button class="hero-scene__pause">.
    const pauseBtn = page.locator('.hero-scene__pause');
    await expect(pauseBtn).toHaveCount(0);
  });

  test('hero canvas does not repaint between frames (static terminal state)', async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'canvas.toDataURL differs on WebKit GL context; covered by Chromium+Firefox');
    await page.goto('/');
    // Give View Transitions a chance to settle. waitForLoadState, not sleep.
    await page.waitForLoadState('networkidle');

    const firstFrame = await page.evaluate(() => {
      const c = document.querySelector('.hero-scene canvas') as HTMLCanvasElement | null;
      if (!c) return null;
      return c.toDataURL('image/png');
    });
    // If there's no WebGL canvas (fallback path), the static SVG is the
    // whole story — also acceptable; skip frame-equality check.
    test.skip(firstFrame === null, 'No WebGL canvas — SSR SVG fallback is the terminal state.');

    // Wait for two animation frames via rAF (deterministic, no sleep).
    await page.evaluate(
      () =>
        new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
        ),
    );
    const secondFrame = await page.evaluate(() => {
      const c = document.querySelector('.hero-scene canvas') as HTMLCanvasElement | null;
      return c ? c.toDataURL('image/png') : null;
    });
    expect(secondFrame).toBe(firstFrame);
  });

  for (const route of ALL_ROUTES) {
    test(`no running CSS animations on ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      // Query all elements and collect any non-"none" animationName.
      const running = await page.evaluate(() => {
        const names: string[] = [];
        document.querySelectorAll('*').forEach((el) => {
          const cs = getComputedStyle(el);
          const name = cs.animationName;
          const play = cs.animationPlayState;
          const dur = cs.animationDuration;
          if (name && name !== 'none' && play === 'running' && dur !== '0s' && dur !== '') {
            names.push(`${el.tagName.toLowerCase()}.${(el as HTMLElement).className || ''}: ${name} (${dur})`);
          }
        });
        return names;
      });
      expect(running, `Unexpectedly running CSS animations: ${JSON.stringify(running, null, 2)}`).toEqual([]);
    });
  }
});
