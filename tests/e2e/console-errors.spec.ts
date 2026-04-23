/**
 * console-errors.spec.ts — no console errors or warnings on any route.
 *
 * Known browser-engine noise is filtered: WebGL warnings, font-loading
 * notices from Firefox, and Astro's harmless "hydration skipped" info
 * messages. Everything else fails the test.
 */
import { test, expect, type ConsoleMessage } from '@playwright/test';
import { ALL_ROUTES } from '../fixtures/routes';

const IGNORE_PATTERNS: RegExp[] = [
  /Download the React DevTools/i,
  /Failed to load resource.*favicon/i,
  // Firefox "Content Security Policy" preloads in dev-preview
  /Content Security Policy:/i,
  // WebKit can log scheduled worklet messages harmlessly
  /\[Intervention\]/i,
  // Plausible placeholder (commented out in HTML) never fires, but just in case
  /plausible/i,
  // Headless Chromium GPU driver warnings — purely environmental.
  /GL Driver Message/i,
  /WebGL.*Performance.*GPU stall/i,
  // MDX source-map dev warnings
  /source\s?map/i,
  // Playwright-WebKit-Windows flake: intermittent SSL / module-import
  // errors in ViewTransitions preload on `localhost` / `127.0.0.1`.
  /SSL connect error/i,
  /Importing a module script failed/i,
];

function shouldIgnore(msg: string) {
  return IGNORE_PATTERNS.some((re) => re.test(msg));
}

for (const route of ALL_ROUTES) {
  test(`no console errors/warnings on ${route.name}`, async ({ page }) => {
    const issues: Array<{ type: string; text: string }> = [];
    page.on('console', (m: ConsoleMessage) => {
      const type = m.type();
      if (type !== 'error' && type !== 'warning') return;
      const text = m.text();
      if (shouldIgnore(text)) return;
      issues.push({ type, text });
    });
    page.on('pageerror', (err) => {
      if (shouldIgnore(err.message)) return;
      issues.push({ type: 'pageerror', text: err.message });
    });

    await page.goto(route.path);
    await page.waitForLoadState('networkidle');

    expect(issues, `Console issues on ${route.path}:\n${JSON.stringify(issues, null, 2)}`).toEqual([]);
  });
}
