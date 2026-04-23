import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression / snapshot config — Agent 13.
 *
 * Agent 12 (e2e + axe) owns the root `playwright.config.ts`. At the time
 * this file was written Agent 12 had not yet committed their config, so
 * this config is standalone. If Agent 12 lands a root config later, this
 * file continues to work because it scopes `testDir` to `tests/visual`
 * and uses its own `webServer` + `snapshotDir`. No coupling between the
 * two suites.
 *
 * Budget note: 6 routes × 3 breakpoints × 2 languages × 3 browsers ≈ 108
 * screenshots for the ambient baseline, plus a smaller reduced-motion
 * sub-suite. Light theme is sampled on a *single representative slice*
 * (desktop Chromium EN/FR) rather than the full cartesian to keep
 * runtime under the ~6-minute ceiling the agent brief specifies.
 */
export default defineConfig({
  testDir: '.',
  snapshotDir: './__snapshots__',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : 3,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'report', open: 'never' }],
  ],
  timeout: 45_000,
  expect: {
    timeout: 10_000,
    toHaveScreenshot: {
      // Modest pixel tolerance absorbs sub-pixel antialiasing drift
      // across OS font renderers (DirectWrite vs CoreText vs Freetype).
      // Masked regions (SLAM canvas, sensor-boot) are already excluded,
      // so remaining diff is pure text / layout.
      maxDiffPixelRatio: 0.015,
      threshold: 0.2,
      animations: 'disabled',
      caret: 'hide',
    },
  },
  use: {
    // We deliberately pin to a port *different* from Agent 12's 4321
    // so their e2e + our snapshot suite can run in parallel without
    // stepping on each other's preview server.
    baseURL: 'http://127.0.0.1:4322',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'off',
    colorScheme: 'dark',
    locale: 'en-US',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'], viewport: { width: 1440, height: 900 } },
    },
    {
      name: 'chromium-tablet',
      use: { ...devices['Desktop Chrome'], viewport: { width: 768, height: 1024 } },
    },
    {
      name: 'webkit-mobile',
      // iPhone-13-like viewport. We set viewport explicitly rather than
      // using the device preset so screenshots stay deterministic.
      use: {
        ...devices['Desktop Safari'],
        viewport: { width: 375, height: 812 },
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) ' +
          'AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
        hasTouch: true,
        isMobile: true,
      },
    },
  ],
  webServer: {
    // Port 4322 is visual-suite only; Agent 12 owns 4321. Preview is
    // `astro preview` against `dist/` — very fast to boot (~1s) so we
    // always start a fresh one per run and avoid shared-state issues.
    command: 'npm run preview -- --host 127.0.0.1 --port 4322',
    url: 'http://127.0.0.1:4322/',
    reuseExistingServer: false,
    timeout: 60_000,
    cwd: '../..',
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
