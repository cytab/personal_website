/**
 * a11y.spec.ts — cross-route axe-core sweep. 0 WCAG 2.2 AA violations
 * tolerated. Exceptions are enumerated in tests/axe/baseline.json (empty
 * by default) and expected to have a remediation ticket.
 *
 * We run axe in its default "wcag2a + wcag2aa + wcag21a + wcag21aa +
 * wcag22aa" preset + "best-practice" kept OFF (opinionated and often
 * false-positive on our layout primitives).
 */
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { ALL_ROUTES } from '../fixtures/routes';
import baseline from './baseline.json' with { type: 'json' };

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

type AcceptedMap = Record<string, { routes?: string[]; reason?: string; ticket?: string }>;
const ACCEPTED: AcceptedMap = (baseline as { accepted?: AcceptedMap }).accepted || {};

function isAccepted(routePath: string, ruleId: string): boolean {
  const entry = ACCEPTED[ruleId];
  if (!entry) return false;
  if (!entry.routes || entry.routes.length === 0) return true;
  return entry.routes.includes(routePath);
}

for (const route of ALL_ROUTES) {
  test(`axe — ${route.name} (${route.path}) has no WCAG 2.2 AA violations`, async ({ page }, testInfo) => {
    await page.goto(route.path);
    await page.waitForLoadState('networkidle');
    // Wait for the NavTree island (client:idle) to hydrate so axe sees
    // the actual, final DOM — the island mounts `.nav-tree > ul` that
    // the raw SSR markup does not contain. Requestidle won't fire while
    // Playwright throttles, so we force a rAF + trigger idle callback.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          // Flush any scheduled requestIdleCallbacks.
          const rIC = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
          if (rIC) rIC(() => resolve());
          else requestAnimationFrame(() => resolve());
        }),
    );
    // Then wait until React island actually mounted the UL, or time out
    // — if it never mounts, axe sees the SSR DOM, which is also valid.
    await page.waitForSelector('.nav-tree ul.nav-tree__leaves', { state: 'attached', timeout: 3_000 }).catch(() => {});

    const results = await new AxeBuilder({ page })
      .withTags(TAGS)
      // Canvas-based hero is marked aria-hidden; skip the is-rule-check
      // against the decorative canvas.
      .exclude('.hero-scene canvas')
      .analyze();

    // axe-core reports aria-hidden-focus as "incomplete" when it can't
    // determine focus-visible state; Lighthouse promotes those to
    // violations. We match Lighthouse's stricter posture here — any
    // WCAG 2 A/AA rule marked incomplete is treated as a violation.
    const promotedFromIncomplete = results.incomplete.filter((v) =>
      v.tags.some((t) => TAGS.includes(t)) && v.nodes.some((n) => n.all.length > 0 || n.any.length > 0),
    );
    const combined = [...results.violations, ...promotedFromIncomplete];
    const unaccepted = combined.filter((v) => !isAccepted(route.path, v.id));

    // Attach the full results for post-mortem in CI.
    await testInfo.attach('axe-results.json', {
      body: JSON.stringify({ violations: results.violations, incomplete: results.incomplete }, null, 2),
      contentType: 'application/json',
    });

    expect(
      unaccepted,
      `Unaccepted axe violations on ${route.path}:\n` +
        unaccepted.map((v) => `  - ${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} node(s)`).join('\n'),
    ).toEqual([]);
  });
}
