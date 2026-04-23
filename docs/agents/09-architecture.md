# 09 — Engineering Architecture

**Author**: Agent 9 — Senior Frontend Engineer
**Status**: Scaffold shipped. `npm run build` and `astro check` pass.
**Supersedes**: nothing. **Superseded by**: later engineering revisions, if any.
**Anchored to**: subject-dossier, phase-1-revisions, phase-2-revisions, Agents 01–08.

---

## 0. Stack, pinned

| Layer | Choice | Why |
|---|---|---|
| Framework | Astro 4 (`^4.16`) | Static export, zero-JS default, islands for interactivity, GH Pages compatible. Locked by phase-1-revisions §2. |
| Language | TypeScript strict | `astro check` included in the `build` script as a gate. |
| Styling | Tailwind + CSS custom properties | Tailwind via `@astrojs/tailwind` with `applyBaseStyles:false`. All token names in `src/styles/tokens.css`, bound to Tailwind aliases. No CSS-in-JS runtime. |
| Content | MDX (`@astrojs/mdx`) | For future writing posts. Collection `writing` is typed in `src/content/config.ts`. |
| Motion | Framer Motion inside React islands | Imported only where needed; home route does not load FM yet (stubs are CSS). |
| Route transitions | Astro View Transitions | `<ViewTransitions fallback="animate" />`. Supplemented by a custom replan CSS keyframe + a client-side handler that injects the click's coordinates into `--replan-x/--replan-y`. |
| i18n | Static routing; `/` EN, `/fr/` FR | Astro `i18n` config uses `prefixDefaultLocale:false`. Sibling-URL map lives in `src/i18n/strings.ts`. `<html lang="fr-CA">` on FR routes per phase-2-revisions §5. |
| Fonts | `@fontsource/inter` + `@fontsource/jetbrains-mono`, latin 400/500/600 + mono 400/500 | Self-hosted, woff2. Latin subset. Preload via the fontsource CSS imports. |
| Analytics | Plausible (inert placeholder) | Script commented out in `BaseLayout.astro`. Flip on with a `data-domain` once Cyrille has one. |
| Sitemap | `@astrojs/sitemap` 3.2.1 (pinned) | 3.7.x requires Astro 5's `astro:routes:resolved` hook. Locked at 3.2.1 until we upgrade the framework. |
| Deployment | GH Actions `actions/deploy-pages@v4` | Concurrency group `pages`, only-one-deploy semantics. Node 20 runtime. |

---

## 1. Tokens legend — `src/styles/tokens.css`

Baseline is Agent 7's appended token block. Overrides layered on top:

### Light mode (phase-2-revisions §1 fixes applied)
- `--primary` (light) is now **`#9A580F`** (was `#B86A14`, which measured 4.2:1 on paper and failed AA normal).
- `--accent` (light) is now **`#0A7A67`** (was `#0F8F7A`, 3.8:1, failed AA).
- Dark-mode brand colors unchanged (`--primary: #F3A03B`, `--accent: #62E0C8`).

### Forbidden pairings (documented at top of tokens.css; enforced by discipline)
- `--ink-muted` on `--surface-2` for body text <18px (4.1:1 dark).
- `--danger` on `--surface-2` at any body size (3.6:1 dark).
- Lint rule is not wired yet; the forbid list is in the file as a banner comment. Follow-up: stylelint plugin or a custom check.

### Focus ring (phase-2-revisions §2 / Agent 8 §2)
- Two-band luminance-driven: **2px outer `--ink`**, **3px offset `--focus-ring-inner` halo** (surface colour), no shadow/color reliance.
- `@media (forced-colors: active)` → `outline: 2px solid CanvasText`.
- Lives in `src/styles/global.css` under `:focus-visible`.

### Motion tokens (Agent 6 §11)
- Three easings: `--ease-default` / `--ease-system` / `--ease-ambient`.
- Six durations: `--dur-tick/fast/base/slow/narrative/scene`.
- Three staggers: `--stagger-tight/base/loose`.
- Reduced-motion block zeroes all durations; reduced-motion *design* is up to Agent 10 in the motion components.

### TS mirror
`src/design/tokens.ts` exports the same colors, easings, durations, staggers, spacings, breakpoints, and sensor labels for use inside React islands.

---

## 2. Route map — shipped vs planned

### Shipped (9 HTML files)
- `/` — home (7-beat scroll, EN). **Fully readable with JS disabled.**
- `/fr/` — home (FR).
- `/work/` — five flagship project sections with anchors `#robotclaw`, `#openclaw`, `#drone-stack`, `#noovelia-lattice`, `#odu-slam`.
- `/fr/travaux/` — FR sibling.
- `/writing/` — empty-state (content collection is empty; shows stub copy).
- `/fr/ecrits/` — FR sibling, same stub.
- `/about/` — bio + CV download block with TODO portrait.
- `/fr/a-propos/` — FR sibling.
- `/404` — custom 404 with "route not in plan" micro-copy.

### Planned but not yet emitted
- `/writing/<slug>/` — dynamic route. Not shipped because no posts exist; the writing leaf of the primary nav is pruned accordingly per Agent 4 §3.1.
- `/legal/` — only ships if Plausible is turned on. Currently off.
- RSS feed — once writing posts exist.

---

## 3. Components reference

| File | Role | Notes |
|---|---|---|
| `src/layouts/BaseLayout.astro` | Shell — `<html lang>`, SEO, View Transitions, skip link, `<main id="main" tabindex="-1">`. | Person JSON-LD emitted on home only. |
| `src/components/Nav.astro` | Behavior-tree primary nav. Static SVG root glyph + leaves. | Writing leaf pruned (no posts). Keyboard model per Agent 8 §3.2 (Tab-through, no arrow keys). |
| `src/components/LanguageSwitcher.astro` | EN ↔ FR sibling link. | Static `<a href>` works with JS off; a ≤400B inline script preserves the fragment on `hashchange`. `lang` + `hreflang` attributes set per Agent 8 §9.6. |
| `src/components/Footer.astro` | Linear fallback nav + meta line. | Duplicates primary nav (accessibility contract). |
| `src/components/SensorBoot.astro` | Three-stage wake-up overlay, once per session. | `sessionStorage` flag. Reduced-motion skips to Ready and fades. Total 1800ms envelope. |
| `src/components/ScrollProgress.tsx` | Belief-distribution scroll indicator (home only). | Static 7-bar version shipped (TODO to subdivide at Beat 4). Hydrated with `client:idle`. Hidden on mobile per Agent 8 §3.3 (also pinned to bottom per Agent 5 §8.3 — not yet implemented on mobile; TODO). |
| `src/components/UncertaintyEllipse.astro` | SVG sigil per cluster (static skeleton). | `aria-hidden="true"` by default (Agent 8 §4.5). Breath animation is Agent 10's job. |
| `src/components/ClusterPanel.astro` | Panel scaffold for one cluster. | Data-asset slot left for Agent 10 via TODO. |
| `src/components/ProjectCard.astro` | Proof-strip card. Links to `/work/#<slug>`. | Card-as-link pattern; status pill and repo link live outside the primary anchor per Agent 8 §4.8. |

---

## 4. View Transitions (Agent 6 §3 / mandate §10)

- Base layer: `<ViewTransitions fallback="animate" />` in `BaseLayout`.
- CSS: `src/styles/transitions.css`
  - `::view-transition-old(root)` → `replan-decay` 400ms (`--dur-slow`) stepper.
  - `::view-transition-new(root)` → `replan-expand` 800ms (`--dur-narrative`) stepper, `clip-path: circle(... at --replan-x --replan-y)` lattice-wavefront.
  - Feature-detect: if `document.startViewTransition` is absent, `html[data-vt-unsupported]` styles a desaturated cross-fade (Safari <17 / Firefox <129).
  - `prefers-reduced-motion` overrides to 120ms opacity-only hint per mandate item 10.
- The coordinates are injected by a 300-byte `is:inline` handler in `BaseLayout` that reads the click target's bounding rect in `astro:before-preparation`.

**Known limitation**: the named per-route metaphors (Pair 1 "plan commits to artifact", Pair 3 "camera turns on the operator", etc.) are **not yet** individually wired. Every route transition currently shares the same lattice-wavefront envelope. Moving from decay-then-expand to per-pair choreography is Agent 10's scope (see TODO list).

---

## 5. Performance (actual build numbers)

Taken from `npm run build` output on the shipped scaffold.

| Asset | Raw | Gzip |
|---|---:|---:|
| `_astro/index.yEcBGcn5.css` (all CSS) | 21.8 KB | **5.3 KB** |
| `_astro/client.*.js` (React island runtime) | 135.6 KB | 43.7 KB |
| `_astro/ScrollProgress.*.js` | 4.1 KB | 1.7 KB |
| `_astro/index.*.js` | 6.7 KB | 2.7 KB |
| `_astro/hoisted.*.js` | 14.3 KB | 4.9 KB |
| **Home `/` initial JS total** | ~160 KB raw / **~53 KB gzip** | below the 180KB raw budget |
| `dist/index.html` | 38.8 KB | — |
| Fonts (inter + jetbrains-mono, latin 400/500/600 + mono 400/500) | ~145 KB total woff2 across 5 files | delivered on demand by browser |

Pages generated: **9** (index, /fr/, work, travaux, writing, ecrits, about, a-propos, 404).
`astro check`: **0 errors, 0 warnings, 1 hint (`is:inline` on a JSON-LD script, acknowledged)**.

---

## 6. Accessibility (where we land on WCAG 2.2 AA)

- `<html lang="fr-CA">` on FR routes (phase-2-revisions §5).
- Skip link + `<main id="main" tabindex="-1">` (Agent 8 §2.5 / §3.1).
- Single `<h1>` per page, all nav elements `aria-label`-ed.
- Focus-visible ring on every interactive element; `:focus { outline: none }` is only allowed *after* `:focus-visible` replaces it.
- Reduced-motion respected globally (`src/styles/global.css` safety net + motion-token zeroing + per-component `matchMedia('(prefers-reduced-motion: reduce)')` checks in the SensorBoot).
- Forbidden-pair comment banner in `tokens.css`; a lint to enforce it is TODO.
- **Not yet implemented**: SLAM pause control (phase-2-revisions §3 / Agent 8 §8.2). The SLAM canvas itself isn't shipped yet (Agent 10's scope); when it lands, the pause button is a hard requirement — keyboard-reachable, labelled, state persisted in `localStorage`.

---

## 7. TODOs reserved for Agent 10

| Scope | File(s) | Notes |
|---|---|---|
| Hero WebGL sensors-initializing scene | `src/pages/index.astro` (`.hero-stub`), `src/pages/fr/index.astro` | Replace the static `<div class="hero-stub">` with the WebGL canvas. Preserve the `<h1>` above it as the a11y source of truth. Canvas stays `aria-hidden="true"`. Wire the SensorBoot.astro orchestration to the canvas via an imperative `SlamCloud.boot({ durationMs: 600, onReady })`. |
| SLAM ambient background | global layer injected from `BaseLayout` | Seeded by page-slug hash per Agent 3 §4.1. Pause control required (phase-2-revisions §3). |
| **SLAM pause control (WCAG 2.2.2)** | new component, wired into Header or Footer | **Blocker for Phase 4 QA** — must ship before the SLAM canvas. Button labelled `Pause ambient motion` / `Pauser l'animation ambiante`, state in `localStorage`, initial auto-pause at 5s if no interaction. |
| Uncertainty-ellipse breath + terminal state | `src/components/UncertaintyEllipse.astro` | Convert to a React island. Breath ±3% at 1.6s using `--ease-ambient`. Reduced-motion terminal state renders the **settled posterior** (phase-2-revisions §3), not a vanishing animation. |
| Loop-closure accents | SLAM layer | Under `reduce`, render post-closure state, not mid-animation (phase-2-revisions §3). |
| `ScrollProgress` 7→4 subdivide at Beat 4 | `src/components/ScrollProgress.tsx` | Current ship is static 7-bar. The TODO is marked in-file. Mobile pinned-to-bottom variant also not shipped yet. |
| Proof-strip hardware illustrations | `src/pages/index.astro` and `/fr/index.astro`, `.proof-strip` block | Icons of AGV, drone, sidewalk robot; currently text-only with alt-text TODO markers. |
| Cluster-panel data assets | `src/components/ClusterPanel.astro` | One real data asset per panel (SLAM map / planner frame / belief trace / ROS graph). Alt text rules per Agent 8 §7.1. |
| Work-section hero assets | `src/pages/work/index.astro` + FR | One hero asset per project. |
| OG default image | `public/og-default.png` | Placeholder marker currently at `public/og-default.png.placeholder`. Replace with a 1200×630 PNG per Agent 3 §5.4. |
| Per-route replan named metaphors | `src/styles/transitions.css` + per-link `view-transition-name` | Current shipped replan is the shared decay + lattice wavefront. The named pair-by-pair choreography (Agent 6 §3.1–3.5) is TODO. |
| Plan-unfolding on project cards | `src/components/ProjectCard.astro` | FLIP continuity to `/work/#<slug>` section on click. Uses Framer Motion `layoutId`. |
| Behavior-tree NavTree React illustration | `src/components/Nav.astro` + future `NavTree.tsx` | Current ship is a clean static skeleton. The animated tick / hover-path illustration is Agent 10's. |
| Sensor-boot visual layer | `src/components/SensorBoot.astro` | Orchestration (sessionStorage, three-stage timing, reduced-motion branch) is done. Visual: currently renders 8 belief bars that snap at staged points. Agent 10 may replace with a richer visual while keeping the `[data-stage="..."]` attribute hooks. |

---

## 8. Asset placeholders Cyrille needs to provide

1. **Portrait** for `/about/` and `/fr/a-propos/` — warm-monochrome, matte-wall or lab, NOT studio seamless. Drop at `public/portrait.jpg` (or similar) and wire the `<img>` into the `portrait-placeholder` div.
2. **CV PDFs** — `public/cv/cyrille-tabe-cv-en.pdf` and `public/cv/cyrille-tabe-cv-fr.pdf`. The deploy workflow attempts a `latexmk` compile of `CV_CYRILLE_TABE_comments_oeucu/main.tex` into the EN variant; FR has no source yet and must be dropped manually.
3. **Real SLAM / planner / POMDP / ROS graph exports** — one per cluster panel. See `docs/agents/07-typography-layout.md` §4.5 for caption `data-source` formatting.
4. **Drone telemetry capture** — one hero asset for `/work/#drone-stack`.
5. **Behavior-tree screenshot** — from a deployed Noovelia robot; one of the Planning-panel data asset candidates.
6. **OG default image** — `public/og-default.png` (1200×630).

---

## 9. Known TODOs (non-Agent-10)

- **Lint for forbidden color pairs** (§1 of tokens). Currently a prose comment.
- **Light-mode theme toggle** — the CSS honours `[data-theme="light"]` and the prefers-color-scheme media query, but no user-visible toggle is shipped. Open question: do we ship one at launch, or trust the OS preference?
- **Contact form** — currently mailto only per phase-2-revisions §6. A Formspree swap is a one-line change in the home page (`.contact-cta a` href).
- **Plausible script** — currently commented out in `BaseLayout.astro`. Uncomment and set `data-domain` once a domain is live.

---

## 10. Blockers flagged for Phase 4 QA

1. **SLAM hero pause control** — phase-2-revisions §3, WCAG 2.2.2. Must land before the SLAM canvas; currently the canvas is a static stub so the rule is nominally satisfied, but this is the first thing QA should audit when Agent 10's work lands.
2. **Per-route replan metaphors** — the mandate says *"do NOT ship a generic fade as any route transition."* Current ship is the decay-then-fade fallback path (Safari path) with a wavefront clip-path; that satisfies the "fallback path" escape clause. The named wavefront metaphors are still TODO and should not be claimed as done.
3. **Color-contrast lint** — a drift bug waiting to happen until encoded.
4. **Portrait and OG image placeholders** — purely content-ops.
5. **CV LaTeX compile reliability in CI** — marked `continue-on-error: true`; if Cyrille relies on the PDF, drop a prebuilt one under `public/cv/` instead.
6. **Writing collection** — when the first post lands, re-enable the Writing leaf in `src/components/Nav.astro` (currently commented/pruned).

---

## 11. Local commands

```bash
# install (npm; pnpm is preferred but optional)
npm install

# develop
npm run dev

# typecheck + build
npm run build

# build with a project-site base path
SITE_URL="https://cytab.github.io" BASE_PATH="/cyrille-site/" npm run build
```

---

*End of 09-architecture.md — Agent 9, Senior Frontend Engineer.*
