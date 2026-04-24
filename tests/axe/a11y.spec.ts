/**
 * a11y.spec.ts — cross-route axe-core sweep. 0 WCAG 2.2 AA violations
 * tolerated. Exceptions are enumerated in tests/axe/baseline.json.
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

    const results = await new AxeBuilder({ page }).withTags(TAGS).analyze();

    // axe-core reports aria-hidden-focus as "incomplete" when it can't
    // determine focus-visible state; Lighthouse promotes those to
    // violations. Match that stricter posture here.
    const promotedFromIncomplete = results.incomplete.filter((v) =>
      v.tags.some((t) => TAGS.includes(t)) && v.nodes.some((n) => n.all.length > 0 || n.any.length > 0),
    );
    const combined = [...results.violations, ...promotedFromIncomplete];
    const unaccepted = combined.filter((v) => !isAccepted(route.path, v.id));

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
