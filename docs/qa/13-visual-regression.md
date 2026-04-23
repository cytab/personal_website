# 13 — Visual Regression & Cross-Browser QA

**Author**: Agent 13 — Senior Frontend QA
**Status**: Draft v1. Bugs filed below are unverified in source — Agent 13
**does not** modify `src/` per mandate; fixes proposed for owning agents
(9/3/7/8/10) to execute.
**Scope**: Pixel snapshot baselines across 5 browser/viewport projects,
dark/light theme sampling, reduced-motion sampling, FR long-text overflow
hunts, CSS feature-support matrix, and a set of engine-specific probes
called out in the agent brief.

---

## 0. How to run

```bash
# One-time: install browser binaries. Done in this session.
npx playwright install chromium firefox webkit

# Run the full visual suite (needs an independent port — 4322 —
# so it can run in parallel with Agent 12's e2e suite on 4321):
npx playwright test --config=tests/visual/playwright.visual.config.ts

# Update baselines after an intentional visual change:
npx playwright test --config=tests/visual/playwright.visual.config.ts --update-snapshots

# View the last run's HTML report:
npx playwright show-report tests/visual/report
```

**Config location**: `tests/visual/playwright.visual.config.ts`
(standalone — not a re-export of Agent 12's root config, because their
`playwright.config.ts` uses `testMatch` for `e2e` + `axe` only and
ignores `tests/visual/**`, so the two suites coexist without coupling).

**Port isolation**: Agent 12 owns `4321`; this suite uses `4322`. Both
configs run their own `astro preview` on their port.

---

## 1. Cross-browser matrix

Five projects tested. Each row below is a Playwright "project" in the
visual config; `devices.*` presets are the source. WebKit substitutes
for real Safari (engine-identical, UA-agnostic).

| Project | Engine | Viewport | Proxies for real browser |
|---|---|---|---|
| `chromium-desktop` | Blink (Chrome 141 as of install) | 1440×900 | Chrome, Edge, Samsung Internet (all Chromium) |
| `firefox-desktop`  | Gecko (Firefox 148) | 1440×900 | Firefox, Tor Browser |
| `webkit-desktop`   | WebKit (26.4) | 1440×900 | Safari desktop macOS 14+ |
| `chromium-tablet`  | Blink | 768×1024  | Chrome on iPad-class tablets, Android tablets |
| `webkit-mobile`    | WebKit | 375×812   | Safari iOS 17 on iPhone 13/14/15/SE-3 |

**Not directly tested** (engine parity inferred):
- Samsung Internet → Chromium parity.
- Edge → Chromium parity.
- iPhone-SE-small (320px) → we tested 375px, a *larger* viewport; the
  FR-overflow bug below at 375px will be **worse** at 320px. Flagged
  for a follow-up sweep at 320px if the shipping audience includes
  SE-1/SE-2 (physical 320pt logical width).

---

## 2. Snapshot coverage

Total baseline screenshots: **74 PNGs** stored under
`tests/visual/__snapshots__/snapshots.spec.ts-snapshots/`.

| Category | Count | Breakdown |
|---|---:|---|
| Ambient dark | 50 | 5 routes × 2 langs × 5 projects |
| Reduced-motion | 20 | 5 routes × 2 langs × 2 projects (chromium-desktop + webkit-mobile sample) |
| Light theme sample | 4 | home + work × 2 langs × chromium-desktop only |

**Intentional cartesian pruning.**
The brief suggests ≈216 snapshots for full coverage. I cut to 74 by
sampling light theme and reduced-motion on representative projects
rather than on the full grid. The cuts are defensible:

- **Light theme is dark-default opt-in.** Dark is what ships; most
  visitors never toggle. Full light-theme coverage across 5 projects
  would add 46 screenshots while only reproducing a per-token color
  swap that has no engine-specific risk.
- **Reduced-motion risk concentrates in Safari + Chromium.** Firefox
  honors `prefers-reduced-motion` via the same CSS pipeline; engine-
  specific motion bugs manifest in WebKit (scroll-linked) or Blink
  (view-transitions). Sampling both is sufficient.

Runtime: **~2.6 minutes** on cold start; comfortably under the 6-minute
budget.

### Snapshot masking

Two regions are masked per `page.locator(...).mask()` because their
pixel content is non-deterministic:

1. `.hero-scene` + `.hero-scene-wrap` — the R3F WebGL canvas. Particle
   positions are seeded but the floating-point rasterizer drifts by a
   few ULPs per platform; diffs would be noise.
2. `.bg-slam` — the ambient background SLAM layer (a second instance of
   the hero scene at very low opacity).
3. `#sensor-boot` — belt-and-braces for the boot overlay. Should be
   pre-removed by the fixture (see §3.1), but masked in case of race.

The agent brief references a `[data-slam-scene]` selector. No such
attribute exists in source (`src/components/BackgroundSlamLayer.astro`
uses `.bg-slam` class). Selector list updated; behavior identical.

---

## 3. Test architecture highlights

### 3.1 Sensor-boot short-circuit

`SensorBoot.astro` runs a 1.8-second three-stage wake-up once per
session. Running it before every snapshot would add ~3 minutes of
non-diffable pixel drift. Fixture pre-seeds
`sessionStorage['ct-sensor-boot-v1'] = '1'` via `addInitScript` so the
overlay removes itself before first paint. Reduced-motion tests accept
the static terminal pose as the screenshot.

### 3.2 CSP `upgrade-insecure-requests` workaround

**Major test-harness finding** (NOT a production bug). `BaseLayout.astro`
ships a CSP meta tag containing `upgrade-insecure-requests`. In real
production over HTTPS this is correct and benign; under
`http://127.0.0.1:4322` Playwright preview, WebKit silently rewrites
every subresource URL to `https://127.0.0.1:4322` which then fails to
connect. Before the workaround was in place, **all WebKit snapshots
rendered as unstyled HTML** (Times New Roman, default blue links, no
dark theme) — zero CSS rules loaded.

The fixture now intercepts the document response and strips that single
directive before delivery to the browser. This affects the test harness
only; the built HTML is unchanged. Without this workaround the WebKit +
Firefox baselines would be useless.

No action needed from other agents — but if the preview environment
ever changes to HTTPS (mkcert certs, self-signed), the workaround can
be removed.

### 3.3 Font-load assertion strategy

Bodyfont detection via `getComputedStyle(body).fontFamily` is
unreliable: WebKit reports `-webkit-standard` for both `body` and `h1`
regardless of which stylesheet rule wins. We assert against
`document.fonts.check('16px "Inter"')` instead, which returns a reliable
boolean across all three engines and is the one that actually signals
a FOIT/FOUT regression.

`document.fonts.ready` resolves successfully in all 5 projects. Inter
400/500/600 + JetBrains Mono 400/500 all load before first paint.
**No FOIT observed** on WebKit mobile.

### 3.4 Engine-invariant probes

Four non-snapshot assertions run per project (in `snapshots.spec.ts`
under `describe('engine invariants')`):

- `fonts.ready` resolves and Inter is checkable (see §3.3).
- No horizontal overflow on `/` at 375px (EN — passes everywhere).
- No horizontal overflow on `/fr/` at 375px (FR — **fails**, see bug §4.1).
- `CSS.supports` probe across `:has()`, `backdrop-filter`,
  `perspective`, container queries, view transitions, scroll-timeline,
  `clip-path`, `color-mix`.

---

## 4. Prioritized bug list

### P0-1 — FR navigation overflows at 375px viewport [PRIMARY FR BUG]

- **Severity**: P0 (visible horizontal scroll on every FR route on mobile).
- **Browser + viewport**: Safari iOS 17 emulated, 375×812. Also
  reproduces on 768-tablet if the nav row is ever forced to share a row
  with a wider logo.
- **Route**: `/fr/`, `/fr/travaux/`, `/fr/a-propos/` (all FR pages).
- **Repro**:
  1. Load any FR route at 375px width.
  2. Observe document `scrollWidth = 398`, `clientWidth = 375` →
     **23px horizontal overshoot**.
  3. Scroll right; the right edge of the page drifts 23px past the
     viewport.
- **Offender**: `.nav-tree__leaves` `<ul>` inside `NavTree.tsx` (line
  132, 158). `display: flex; gap: var(--space-4);` with no wrap and no
  `min-width: 0`. FR leaf labels "Accueil / Travaux / À propos" are
  longer than their EN counterparts and push the flex row past 375px
  when combined with the root SVG glyph + `--space-4` gap.
- **Screenshot**: `__snapshots__/snapshots.spec.ts-snapshots/home-fr-dark-webkit-mobile-webkit-mobile-win32.png`
  (the cut-off "À propos" on the top right is visible).
- **Proposed fix** (for Agent 9 or Agent 3 — typography owner is Agent
  7 but this is a layout escape):
  1. Add `flex-wrap: wrap;` + `row-gap: var(--space-2);` to
     `.nav-tree__leaves` OR
  2. Switch to a grid with `auto-fit` minimum 72px column, OR
  3. Under 400px, collapse the nav to a single "menu" leaf that expands
     into a popover (mobile nav pattern). The BT-nav glyph is the
     expand handle.
  4. Minimum viable fix: add
     `@media (max-width: 400px) { .primary-nav { flex-wrap: wrap; } .nav-tree__leaves { gap: var(--space-3); font-size: 11px; } }`.

### P0-2 — Light-mode tokens not audited at snapshot scale

- **Severity**: P1 (not a bug yet — a coverage gap).
- **Browser**: all.
- **Finding**: The visual suite samples light theme only on chromium-
  desktop EN+FR home+work (4 snapshots). If Agent 8's light-mode AA
  contrast corrections (`--primary: #9A580F`, `--accent: #0A7A67`) are
  ever regressed on `/about/`, `/writing/`, or 404, this suite will
  miss it.
- **Proposed fix** (Agent 13 for next iteration): add a 2×2 expansion
  to cover light theme on `/about/` and `/404` at mobile as well. Costs
  ~4 more snapshots, ~20s runtime. Deferred until the light theme ships
  as an end-user toggle rather than a stylesheet opt-in.

### P1-1 — Firefox lacks `animation-timeline: scroll()` support

- **Severity**: P2 (graceful fallback already in place per Agent 6
  §10.2 — the scroll-driven animations fall back to in-view triggers
  under `@supports not`).
- **Browser**: Firefox 148 (and below — Gecko hasn't shipped
  scroll-timeline; tracking bug 1676881 still open).
- **CSS.supports result**: Firefox returns `scrollTimeline: false`.
  All other engines return `true`.
- **Verification**: no visual regression observed in the Firefox
  snapshots — so the fallback path is doing its job.
- **Proposed fix**: none required. Flag for Agent 6's motion-spec
  review so the fallback gets a sanity pass if scroll-driven
  animations expand beyond the current set.

### P1-2 — Scroll-linked content advance has a spurious module-import error on WebKit (unverified)

- **Severity**: P2 (the error is caught and the page continues to
  function; the static hero-scene fallback kicks in via `<noscript>`-
  style degradation).
- **Browser**: WebKit desktop + WebKit mobile.
- **Route**: `/`.
- **Repro**:
  1. Open home.
  2. Listen for `pageerror` events while scrolling 800px.
  3. See `TypeError: Importing a module script failed.` fire once —
     origin is the dynamic import of the R3F chunk
     (`HeroScene/index.tsx` dynamic island hydration).
- **Hypothesis**: R3F/three.js chunk bundling is producing a module
  graph WebKit's strict ES module loader rejects. Likely a
  `framer-motion` + `three` interop quirk or a missing `type="module"`
  on a dependent script. Could also be an artifact of the CSP bypass
  workaround (§3.2) — needs re-test with a real HTTPS preview before
  declaring a production bug.
- **Proposed fix** (Agent 9 to investigate): reproduce outside
  Playwright (real Safari Tech Preview); if confirmed, ensure the
  lazy-loaded chunk has `type="module"` and that
  `vite.build.chunkSizeWarningLimit` isn't emitting a non-module shard.
  Otherwise downgrade to P3 informational.

### P2-1 — WebKit computed-style reports `-webkit-standard` for body/h1 fontFamily

- **Severity**: P3 (cosmetic, dev-tooling).
- **Browser**: WebKit desktop + mobile.
- **Finding**: `getComputedStyle(body).fontFamily` returns
  `-webkit-standard` rather than the resolved font stack. `document.fonts.check('16px "Inter"')` still returns `true`, so the
  font **is** loaded; this is a WebKit-only quirk in how computed style
  is reported for a body without a locally-declared font-family on the
  `<html>` element.
- **Impact**: none on users. May confuse QA tools (axe, testing
  libraries) that grep computed styles.
- **Proposed fix**: none needed unless the QA ecosystem complains. If
  it does, copy `font-family: var(--font-body)` up to `html` so WebKit
  reports the declared stack consistently.

### P2-2 — Reduced-motion snapshots correctly omit SLAM background

- **Severity**: info-only (this is *correct* behavior per Agent 6 §3
  — reduced-motion removes the ambient layer).
- **Finding**: Under `prefers-reduced-motion: reduce`, `.bg-slam` gets
  `display: none` (per `BackgroundSlamLayer.astro:49-51`). The hero
  scene itself remains visible as a static fallback frame. Our
  reduced-motion snapshots capture this correctly.
- **Verification**: all 20 reduced-motion snapshots render; no
  ellipses animate; hero static frame present.

### P3-1 — `backdrop-filter` is declared unused in source

- **Severity**: info.
- **Finding**: grep across `src/` for `backdrop-filter` returns **zero
  matches**. The brief called this out as a Firefox risk; it is a
  no-op because the site doesn't use it. Safe.
- **Note**: `CSS.supports('-webkit-backdrop-filter: blur(4px)')`
  correctly returns `true` on WebKit and `false` elsewhere — this is
  expected and not a bug.

### P3-2 — No emoji in rendered copy

- **Severity**: info — dossier rule observed.
- **Finding**: The brief asked us to verify "no stray emoji in copy."
  A regex of the Emoji Presentation block over `document.body.innerText`
  returns zero matches on all 6 tested URLs (EN+FR). Dossier rule is
  honored end-to-end.

### P3-3 — View Transitions support universal

- **Severity**: info.
- **Finding**: All 5 engines tested support `document.startViewTransition`.
  Agent 6's five-named-replan choreographies can run on all targets.
  The Agent 6 spec mentions Firefox <129 fallback; we are at Firefox
  148 in the test matrix, so the fallback path is not exercised by
  this suite. Flagged for an explicit Firefox-ESR smoke on release.

### P3-4 — `rotateY` locale replan computes cleanly

- **Severity**: info.
- **Finding**: The TF-frame-broadcast transform
  (`transform: perspective(1200px) rotateY(-90deg)` in
  `transitions.css:154-159`) resolves to a sane computed style on
  WebKit. The locale-toggle navigation completes without console error.
  (The `waitForURL` + WebKit "SSL connect error" is a Playwright quirk,
  not a site bug — fixture navigates via `href` lookup instead.)

---

## 5. Per-route findings table

| Route | Chromium-desktop | Firefox-desktop | WebKit-desktop | Chromium-tablet | WebKit-mobile |
|---|---|---|---|---|---|
| `/`              | OK | OK | OK | OK | OK |
| `/work/`         | OK | OK | OK | OK | OK |
| `/about/`        | OK | OK | OK | OK | OK |
| `/writing/`      | OK | OK | OK | OK | OK |
| `/404.html`      | OK | OK | OK | OK | OK |
| `/fr/`           | OK | OK | OK | OK | **P0 overflow** |
| `/fr/travaux/`   | OK | OK | OK | OK | **P0 overflow** |
| `/fr/a-propos/`  | OK | OK | OK | OK | **P0 overflow** |
| `/fr/ecrits/`    | OK | OK | OK | OK | **P0 overflow** (same root cause, not separately probed) |

"OK" = baseline snapshot captured and stable on re-run (zero pixel diff
on second pass); engine-invariant probes pass.

---

## 6. Files

Owned by Agent 13:

- `tests/visual/playwright.visual.config.ts` — standalone Playwright
  config, port 4322, 5 projects.
- `tests/visual/fixtures.ts` — shared `preparePage` helper, masking
  selectors, route list, CSP bypass.
- `tests/visual/snapshots.spec.ts` — ambient-dark + light-sample +
  reduced-motion snapshot suite, plus four engine-invariant probes.
- `tests/visual/focus-hunts.spec.ts` — FR-overflow hunt, CSS support
  matrix probe, rotateY handoff navigation test, scroll-linked error
  capture, emoji audit, font CLS measurement.
- `tests/visual/__snapshots__/snapshots.spec.ts-snapshots/*.png` —
  74 baseline PNGs.
- `docs/qa/13-visual-regression.md` — this document.

Read-only reuse from Agent 12:

- `playwright.config.ts` (root) — consulted for shape; our project
  names match theirs where they overlap so the two suites can share a
  mental model.

---

## 7. Open questions / ship blockers

**Ship blocker**: §4 P0-1 (FR nav overflow on iPhone). Any French-
speaking visitor on iPhone at 375pt will see a broken scroll on
every route. Must be fixed before FR launch.

**Not blockers**:
- §4 P1-2 (WebKit module import error) — degrades gracefully, needs
  out-of-harness confirmation before upgrading severity.
- §4 P1-1 (Firefox scroll-timeline) — fallback already in place.
- §4 P2-1 (`-webkit-standard`) — cosmetic dev quirk.

**Deferred**:
- Full light-theme cartesian expansion (add 4 snapshots on mobile).
- iPhone-SE 320px sweep (will reveal additional overflow — the 375px
  FR nav bug guarantees 320px is worse).
- Firefox-ESR real-device smoke for the View Transitions fallback path.
