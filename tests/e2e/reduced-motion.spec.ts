/**
 * reduced-motion.spec.ts — assert that with prefers-reduced-motion
 * emulated, the home hero canvas reports `data-paused="true"` and
 * no CSS animations are running on key motif/glyph selectors.
 *
 * Note: the global.css reduced-motion guard forces animations to a
 * near-zero duration, so computed animationPlayState may still
 * report "running" (Chromium will continue running a 0.01ms loop).
 * We therefore assert on `animation-duration ≈ 0s` instead of
 * `play-state`, which is the actual observable user-facing truth.
 */
import { test, expect } from '@playwright/test';
import { ALL_ROUTES } from '../fixtures/routes';

test.describe('Reduced-motion posture', () => {
  test.use({ colorScheme: 'dark' });

  test('home hero canvas reports data-paused="true" under reduce', async ({ page, context }) => {
    await context.addInitScript(() => {
      // Cannot actually call emulateMedia from init; handled below via .emulateMedia
    });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    // Wait for island hydration to attach the canvas or fall back to SVG.
    const canvas = page.locator('.robotarm__canvas canvas');
    // When reduced-motion triggered, the component still creates the canvas
    // but renders a single frozen frame.
    await canvas.first().waitFor({ state: 'attached', timeout: 10_000 });
    await expect(canvas.first()).toHaveAttribute('data-paused', 'true');
  });

  for (const route of ALL_ROUTES) {
    test(`no long-duration CSS animations are running on ${route.name} under reduce`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      const longAnims = await page.evaluate(() => {
        const offenders: string[] = [];
        document.querySelectorAll('.motif *, .glyph *, .about-sig, .about-sig__shoulder, .about-sig__led').forEach((el) => {
          const cs = getComputedStyle(el);
          const name = cs.animationName;
          const dur = cs.animationDuration;
          // Global safety net forces duration to 0.01ms — that's fine.
          // Fail only on sustained animations (>50ms duration).
          const ms = dur.endsWith('ms') ? parseFloat(dur) : parseFloat(dur) * 1000;
          if (name && name !== 'none' && ms > 50) {
            offenders.push(`${el.tagName.toLowerCase()}: ${name} (${dur})`);
          }
        });
        return offenders;
      });
      expect(longAnims, `Long-duration animations under reduce: ${JSON.stringify(longAnims)}`).toEqual([]);
    });
  }
});
