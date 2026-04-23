# cyrille-tabe-site

Personal website for Cyrille Tabe. Astro + TypeScript strict, deployed to
GitHub Pages as a fully static export. A manifesto rendered in pixels — not
a résumé.

## Stack

- **Astro 4** — zero-JS default, React islands where interactive.
- **TypeScript strict** — `astro check` gate on every build.
- **Tailwind CSS** via `@astrojs/tailwind` (tokens driven by CSS custom
  properties in `src/styles/tokens.css`).
- **MDX** for long-form writing (`@astrojs/mdx`).
- **Astro View Transitions** for route-level "replans" (Safari <17 /
  Firefox <129 get a desaturated cross-fade fallback).
- **Framer Motion** — available inside React islands for FLIP/layout
  continuity and component-level motion. No CSS-in-JS runtime.
- **Self-hosted fonts** via `@fontsource/inter` and
  `@fontsource/jetbrains-mono` (Latin by default).

## Why each dependency is in `package.json`

- `astro`, `@astrojs/check` — framework, TypeScript gate.
- `@astrojs/mdx` — writing/posts pipeline.
- `@astrojs/react`, `react`, `react-dom` — interactive islands (scroll
  progress, future nav tree, motion components).
- `@astrojs/tailwind`, `tailwindcss` — utility layer on top of tokens.
- `@astrojs/sitemap`, `@astrojs/rss` — static sitemap and future RSS.
- `@fontsource/inter`, `@fontsource/jetbrains-mono` — self-hosted fonts.
- `framer-motion` — motion islands (Agent 6 spec §11).

## Install & develop

```bash
# Node 20 recommended (see .nvmrc).
npm install
npm run dev
```

We prefer **pnpm** but the project also works with `npm` (as documented).
If you have pnpm:

```bash
pnpm install
pnpm dev
```

## Build

```bash
npm run build   # runs astro check, then astro build → dist/
npm run preview
```

The `build` step includes `astro check` as a TypeScript gate.

## Environment variables

Set at build time (useful when the final domain/base path is not yet
decided):

| Var         | Default                    | Purpose                                   |
|-------------|----------------------------|-------------------------------------------|
| `SITE_URL`  | `https://cyrilletabe.com`  | Absolute base for canonical / OG / sitemap |
| `BASE_PATH` | `/`                        | Project-site path (e.g. `/repo-name/`)    |

For a GitHub project site (e.g. `cytab.github.io/cyrille-site/`):

```bash
SITE_URL="https://cytab.github.io" BASE_PATH="/cyrille-site/" npm run build
```

## Deployment

Push to `main` → `.github/workflows/deploy.yml` → `actions/deploy-pages@v4`.
Concurrency group `pages` ensures only one deploy runs at a time.

### Custom domain

Drop the hostname in `public/CNAME` (one line, no protocol), and set
`SITE_URL` as a GitHub repo variable. The workflow forwards it.

### CV

Current state: `/about/` and `/fr/a-propos/` ship a **"CV — by email"**
mailto card (`mailto:cyrilletabe@gmail.com?subject=CV%20request`) instead
of a direct PDF download. This matches the site's mailto-only contact
posture and avoids a dead 404 while no PDF is committed.

To switch to direct download: compile or drop PDFs into
`public/cv/cyrille-tabe-cv-{en,fr}.pdf`, then update the About pages to
swap the mailto anchor for a `<a href="/cv/...">Download</a>` and update
`tests/e2e/cv-download.spec.ts` to assert the PDF path + 200.

## Content

- Home `/` and `/fr/` — verbatim copy in `src/content/copy.ts` (EN + FR).
- Work `/work/` and `/fr/travaux/` — five flagship projects with 150–250-word
  expanded bodies. Anchors stable in EN (`#robotclaw`, `#openclaw`,
  `#drone-stack`, `#noovelia-lattice`, `#odu-slam`), reused by FR.
- About `/about/` and `/fr/a-propos/` — bio + CV-by-email card (portrait optional).
- `/404` — "route not in plan" micro-copy.

### Writing (currently not shipped)

The writing routes (`/writing/`, `/fr/ecrits/`) were removed in the Phase 4
bugfix — we don't ship empty indexes. The content collection config, the
route-replan CSS metaphor (*notebook-opens*), and the i18n empty-state
strings are all preserved. To re-enable the route: drop a first
`.mdx` file into `src/content/writing/`, add `src/pages/writing/index.astro`
and `src/pages/fr/ecrits/index.astro` back, and add the nav leaf in
`src/components/Nav.astro`.

## JS-off baseline

The **home page** (`/` and `/fr/`) is fully readable with JavaScript
disabled. The `ScrollProgress` component and the `SensorBoot` overlay
both require JS — both gracefully degrade (their content/purpose is
represented in the static DOM: the home page still has all seven beats
labelled with section markers and headings).

## Testing

```bash
npm run build        # must pass before PR
npx astro check      # 0 errors / 0 warnings / 0 hints
npm run test:e2e     # Playwright e2e (Chromium/Firefox/WebKit × desktop/mobile)
npm run test:axe     # axe-core WCAG 2.2 AA on every route
npm run test:lighthouse  # Lighthouse CI, contract in .lighthouserc.json
```

**Current green on this commit** (chromium-desktop sanity run):
- 55/55 e2e + axe
- 289/289 (23 skipped) across the full matrix
- Lighthouse: perf ≥ 95 / a11y = 100 / best-practices ≥ 95 / seo = 100 on
  `/`, `/work/`, `/about/`, `/fr/`, `/fr/a-propos/`

## Known TODOs

Non-blocking items (live in `docs/qa/bugfix-report.md` and
`docs/agents/09-architecture.md`):

- Portrait photo — optional, `/about/` works without one.
- CV PDFs — dropped into `public/cv/` when ready; see CV section above.
- Real Pixel 6a benchmark — emulated 45–55 fps during boot, 60 fps idle.
- `og-default.png` uses system fonts in SVG→PNG render; swap to satori if
  pixel-perfect OG is required.
- WebKit dynamic-import module error on ambient SLAM layer (graceful
  fallback in place — needs real-device confirmation).

## Docs (provenance)

- `docs/subject-dossier.md` — the source of truth about Cyrille.
- `docs/phase-{1,2,3}-revisions.md` — overrides on top of the agent briefs.
- `docs/agents/01..10-*.md` — agent deliverables per phase.
- `docs/qa/11..14-*.md` + `bugfix-report.md` — QA findings and sweep.

## License

Private. Ask before reuse.
