/**
 * reduced-motion.spec.ts — assert no hero canvas is shipped anywhere
 * and no CSS animations run on any route. The site is static and
 * deliberately motion-free after the Phase 5 simplification.
 */
import { test, expect } from '@playwright/test';
import { ALL_ROUTES } from '../fixtures/routes';

test.describe('No motion surfaces', () => {
  for (const route of ALL_ROUTES) {
    test(`no .hero-scene canvas present on ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      const heroCanvas = await page.locator('.hero-scene').count();
      expect(heroCanvas).toBe(0);
    });

    test(`no running CSS animations on ${route.name}`, async ({ page }) => {
      await page.goto(route.path);
      await page.waitForLoadState('domcontentloaded');
      const running = await page.evaluate(() => {
        const names: string[] = [];
        document.querySelectorAll('*').forEach((el) => {
          const cs = getComputedStyle(el);
          const name = cs.animationName;
          const play = cs.animationPlayState;
          const dur = cs.animationDuration;
          if (name && name !== 'none' && play === 'running' && dur !== '0s' && dur !== '') {
            names.push(
              `${el.tagName.toLowerCase()}.${(el as HTMLElement).className || ''}: ${name} (${dur})`,
            );
          }
        });
        return names;
      });
      expect(
        running,
        `Unexpectedly running CSS animations: ${JSON.stringify(running, null, 2)}`,
      ).toEqual([]);
    });
  }
});
