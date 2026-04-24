# Simplification report — Phase 5

Date: 2026-04-23. Goal: "super slow, can't change tabs easily" → fast,
content-first. Reference aesthetic: leerob.io, brittanychiang.com,
antfu.me, overreacted.io.

## What was stripped

Components (entire folders / files deleted):
- `src/components/HeroScene/` — R3F/Three.js hero canvas + poisson sampler + shaders.
- `BackgroundSlamLayer.astro`, `NavTree.tsx`, `ScrollProgress.tsx`,
  `SensorBoot.astro`, `UncertaintyEllipse.tsx` + static twin,
  `ClusterPanel.astro`, `PerfDashboard.tsx`, `ProjectCard.astro`.
- `src/pages/_perf.astro`.
- `src/styles/transitions.css` (five named route-level "replan" metaphors).
- `scripts/generate-og.mjs` (OG PNG now shipped as a pre-committed SVG).
- `src/design/tokens.ts`, `src/content/config.ts`, `src/content/writing/`.
- `tests/e2e/hero-pause.spec.ts`.

Dependencies uninstalled:
- `three`, `@astrojs/react`, `react`, `react-dom`, `@types/react`,
  `@types/react-dom`, `framer-motion`, `sharp`.

Config cleanups:
- `astro.config.mjs` — removed `react()` and `ssr.noExternal: ['framer-motion']`.
- `BaseLayout.astro` — removed `<ViewTransitions />`, removed inline view-transition classifier JS, removed CSP exception for `'unsafe-inline'` scripts.
- `tsconfig.json` — removed React JSX settings.
- `package.json` — removed the prebuild `generate-og.mjs` hook.

## What was kept

- Copy (verbatim from Agent 2): hero, orientation, cluster paragraphs,
  project cards, project long-form bodies, about, closing.
- `tokens.css` palette + typography + focus ring.
- Dark-mode-first, `<html lang="fr-CA">` on FR pages.
- `LanguageSwitcher.astro` (simplified to a plain `<a>`, no JS).
- Self-hosted Inter + JetBrains Mono.
- CSP meta + hreflang + Person JSON-LD on home.

## What was rebuilt

- `Nav.astro` → minimal text header: name + 3 text links (Work · Research · About) + lang toggle.
- Home (`/`, `/fr/`) → hero + 81-word intro + 3 featured cards + one-line "more" link. One screen, light scroll.
- `/work/` + `/fr/travaux/` → prose-first list, stable anchors, per-project status + tech list. No hero images, no ellipse SVGs.
- `/research/` + `/fr/recherche/` → **new** route. Four cluster paragraphs + "what I'm pulling in" list.
- `/about/` + `/fr/a-propos/` → short bio + CV-by-email + contact line. No heavy visuals.

## Before / after

| Metric | Before (phase 4 bugfix) | After (phase 5) |
| --- | --- | --- |
| Initial JS on `/` (gzipped) | ~175 KB (React runtime + hero R3F chunk) | **0 B** |
| Bundled JS total (`dist/_astro/*.js`) | 10 files, 781 KB raw | 0 files |
| CSS (gzipped) | ~9 KB | ~4 KB |
| `dist/` total | 1.5 MB | 479 KB |
| Lighthouse perf (home) | ~95 | **100** |
| LCP (desktop, localhost) | ~1.2 s | **0.36 s** |
| Routes (per locale) | 3 | 4 (added Research) |

## Re-adding complexity, if desired

1. **React islands** — reinstall `@astrojs/react`, `react`, `react-dom`; add `react()` back to `astro.config.mjs`; use `client:idle` or `client:visible` on the island component. Ship one island at a time; never a second R3F scene simultaneously.
2. **Hero canvas** — the Agent-10 HeroScene lives in git history at the pre-phase-5 commit. Keep the SSR SVG fallback if reintroduced, and mind WCAG 2.2.2 (pause control for any loop >5 s).
3. **View Transitions** — restore `<ViewTransitions />` in `BaseLayout.astro` and `src/styles/transitions.css`. The five named route-level metaphors (map-handed-to-planner, agent-identifies-self, etc.) are documented in `docs/agents/06-motion.md`.
4. **Writing route** — restore `src/content/config.ts` + `src/content/writing/`, add `/writing/` and `/fr/ecrits/` pages, add slug to `siblingUrl`'s `slugMap`, add a nav leaf.

## Tests & assertions

- `npx astro check` → 0/0/0.
- `npx playwright test tests/e2e tests/axe --project=chromium-desktop` → **68/68 passing**.
- Per-URL Lighthouse on the six asserted routes: perf 100 / a11y 100 / best-practices 100 / seo 100.

`tests/visual/__snapshots__/` was deleted; the baseline will regenerate on the next `npx playwright test tests/visual`.
