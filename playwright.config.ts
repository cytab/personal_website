/**
 * Playwright configuration — Agent 12 (QA).
 *
 * Matrix: { Chromium, Firefox, WebKit } × { desktop-1440, mobile-iphone13 }.
 * BaseURL from env (E2E_BASE_URL), defaults to http://localhost:4321.
 * webServer runs `npm run preview` (Astro static preview). reuseExistingServer
 * locally so devs can iterate against a running preview.
 *
 * Deterministic posture:
 *   - no waitForTimeout anywhere (enforced by convention + ESLint on caller side)
 *   - web-first assertions only
 *   - single worker in CI to keep 3rd-party browser installs stable
 */
import { defineConfig, devices } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://127.0.0.1:4321';
const isCI = !!process.env.CI;

export default defineConfig({
  testDir: './tests',
  testMatch: ['**/e2e/**/*.spec.ts', '**/axe/**/*.spec.ts'],
  // Each test has its own isolated browser context; 20s hard limit per test.
  timeout: 20_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  // Too many workers overwhelm the single `astro preview` Node process
  // (static-file server on a Windows dev box); 4 is a stable ceiling.
  workers: isCI ? 2 : 4,
  reporter: isCI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Reduce test flake from font swap / CSS animation warmup.
    actionTimeout: 5_000,
    navigationTimeout: 15_000,
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4321',
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: !isCI,
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    // ---- Desktop ----
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
    // ---- Mobile (iPhone 13 emulation) ----
    {
      name: 'chromium-mobile',
      use: { ...devices['iPhone 13'] },
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 13'] },
    },
    // Firefox on mobile: no canonical device profile; emulate viewport only.
    {
      name: 'firefox-mobile',
      use: {
        ...devices['Desktop Firefox'],
        viewport: { width: 390, height: 844 },
        isMobile: false, // Firefox Playwright does not support isMobile
        hasTouch: false,
      },
    },
  ],
});
