# Polish-pass report — interactive layer

Shipped (vanilla JS / CSS only, no new dependencies, no React islands
beyond the existing RobotArm).

## Seven items

| # | Item                                  | Status   | Notes |
|---|---------------------------------------|----------|-------|
| 1 | Cursor spotlight (home + about)       | Shipped  | `@media (hover: none)` and `prefers-reduced-motion` gated; ~200 B script. |
| 2 | Command palette ⌘K / Ctrl+K           | Shipped  | Native `<dialog>`, lazy-built on first open, localized, ~3.1 KB gzip. |
| 3 | CV numeric counter animation          | Shipped  | IO-driven, 900 ms ease-out, NBSP-aware regex wraps `NN%`, `NN %`, `NN+`. |
| 4 | Copy-email-on-click (about + footer)  | Shipped  | Button + toast (amber, top-right, 1.6 s). ClipboardAPI with failure path. |
| 5 | Scroll-reveal sections                | Shipped  | Pure CSS via `animation-timeline: view()`. Opacity left at 1 (axe contrast safe); a subtle 12px lift on entry only. |
| 6 | Key-term hover tooltips (Research)    | Shipped  | HTML Popover API. First occurrence wrapped per cluster paragraph. FR definitions localized. |
| 7 | Work card subtle tilt on hover        | Shipped  | rAF-throttled inline script per page, max 4° rotateX/Y, disabled on reduced-motion + coarse pointers. |

**Dropped**: keyboard-focus-follow for the spotlight — the extra code
budget would have pushed the inline listener past its 300-byte cap
without measurable charm.

## Budgets

Inline scripts per rendered HTML (gzip):

| Route                     | Before  | After  |
|---------------------------|---------|--------|
| `/` (home)                | ~165 KB | ~170 KB (cmd+K + spotlight adds ~5 KB) |
| `/work/`                  | 0       | ~3.4 KB (cmd+K + tilt) |
| `/research/`              | 0       | ~3.1 KB (cmd+K only) |
| `/about/`                 | 0       | ~4.0 KB (cmd+K + counters + copy-email) |
| `/fr/` (home)             | ~165 KB | ~170 KB |
| `/fr/travaux/`            | 0       | ~3.5 KB |
| `/fr/recherche/`          | 0       | ~3.2 KB |
| `/fr/a-propos/`           | 0       | ~4.0 KB |

All non-home routes remain under the 5 KB/route budget. Home stays
under the 175 KB gzip ceiling (~170 KB with spotlight + palette on
top of the existing RobotArm island of 118.90 KB, client runtime
43.80 KB, entry 2.68 KB).

## Lighthouse (desktop preset, single-run smoke)

| URL                  | Perf | A11y | BP  | SEO |
|----------------------|------|------|-----|-----|
| `/`                  | 100  | 100  | 100 | 100 |
| `/work/`             | 100  | 100  | 100 | 100 |
| `/research/`         | 100  | 100  | 100 | 100 |
| `/about/`            | 100  | 100  | 100 | 100 |
| `/fr/`               | 100  | 100  | 100 | 100 |
| `/fr/recherche/`     | 100  | 100  | 100 | 100 |

All contract assertions (`.lighthouserc.json`) met without change.

## A11y verification

- 8/8 axe-core WCAG 2.2 AA sweeps green (EN + FR × 4 routes).
- Reveal-up does not dim opacity (translateY only) so text stays
  measurable by axe at any scroll position.
- Cursor spotlight uses `mix-blend-mode: screen` at low alpha and is
  behind all content (`z-index: 0`, `pointer-events: none`); it does
  not interfere with text contrast.
- Command palette uses native `<dialog>` → free focus trap and
  Esc-closes. Restored focus on close.
- Copy-email button has `aria-label`, visible focus ring, and
  keyboard Enter/Space behavior inherited from `<button>`.
- Key-term popovers use the HTML Popover API (`popover="auto"`,
  `popovertarget=...`). Keyboard Tab + Enter opens, Esc closes.
- Count-up animation is disabled under `prefers-reduced-motion`
  (visible text is always the final number; JS only interpolates
  from 0→N when motion is allowed).
- Card tilt is disabled under `prefers-reduced-motion` and
  `(hover: none)`.

## Tests

E2E + axe: **71 / 71 passing** on chromium-desktop. New specs:

- `tests/e2e/command-palette.spec.ts` — Ctrl+K opens, filter + Enter
  navigates, Esc closes.
- `tests/e2e/copy-email.spec.ts` — click → clipboard content matches,
  toast shown.
- `tests/e2e/cursor-spotlight.spec.ts` — on `/` `--cursor-x` updates
  after mousemove; not rendered on `/work/`.
- `tests/e2e/reveal-up.spec.ts` — in-viewport `.reveal-up` keeps
  opacity ≥ 0.9.

## Browser compatibility

- `animation-timeline: view()` — Chrome/Edge 115+, Firefox 126+
  (behind flag until 128), Safari 17.4+. Feature-detected via
  `@supports`. Non-supporting browsers fall back to static layout
  (no animation, no layout shift).
- HTML Popover API — Chrome 114+, Safari 17+, Firefox 125+.
  Non-supporting browsers show inline text with an unstyled
  `<button>`; the popover simply won't open — no errors.
- `<dialog>` — ubiquitous (Chrome 37+, Safari 15.4+, Firefox 98+).
- `mix-blend-mode` — ubiquitous.
- `navigator.clipboard.writeText` — ubiquitous over HTTPS; we
  surface a toast on failure.

## No regressions

- No CLS change on any route (inline scripts do not insert content;
  counter wrapping replaces innerHTML of bullets only after DOM is
  loaded and preserves exact text width at the final frame).
- No change to the RobotArm hero; hero-pause spec still green.
- FR parity preserved (all new UI strings localized in
  `src/i18n/strings.ts`; FR term-hint definitions localized in
  `src/pages/fr/recherche/index.astro`).
