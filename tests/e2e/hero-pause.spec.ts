/**
 * hero-pause.spec.ts — the home hero ships a canvas with a pause
 * control (WCAG 2.2.2). Chromium-desktop only: the canvas hydrates
 * via client:visible, and headless WebKit/Firefox can be flaky
 * with WebGL contexts in CI.
 */
import { test, expect } from '@playwright/test';

test.skip(
  ({ browserName }) => browserName !== 'chromium',
  'WebGL hydration scoped to chromium-desktop to keep headless stable',
);

test.describe('Home hero pause control', () => {
  test('canvas and pause button are present and focusable', async ({ page }) => {
    await page.goto('/');
    // SSR fallback SVG is immediate
    await expect(page.locator('.robotarm-island__svg').first()).toBeVisible();

    // Wait for hydration — canvas is created by the React island
    const canvas = page.locator('.robotarm__canvas canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 10_000 });

    const pause = page.locator('.robotarm__pause').first();
    await expect(pause).toBeVisible();
    // Default state: not paused
    await expect(pause).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas).toHaveAttribute('data-paused', 'false');

    // Click to pause
    await pause.click();
    await expect(pause).toHaveAttribute('aria-pressed', 'true');
    await expect(canvas).toHaveAttribute('data-paused', 'true');

    // Click to resume
    await pause.click();
    await expect(pause).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas).toHaveAttribute('data-paused', 'false');
  });

  test('canvas has role=img and an accessible name', async ({ page }) => {
    await page.goto('/');
    const canvas = page.locator('.robotarm__canvas canvas').first();
    await canvas.waitFor({ state: 'attached', timeout: 10_000 });
    await expect(canvas).toHaveAttribute('role', 'img');
    const aria = await canvas.getAttribute('aria-label');
    expect(aria).toBeTruthy();
    expect(aria?.length ?? 0).toBeGreaterThan(10);
  });
});
