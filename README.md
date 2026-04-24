# cyrille-tabe-site

Personal website for Cyrille Tabe. Astro static export, deployed to
GitHub Pages. Four tab routes — Home, Work, Research, About — and that's
the whole site.

## Stack

- **Astro 4** — zero JS on every page.
- **TypeScript strict** — `astro check` gate on every build.
- **Tailwind CSS** via `@astrojs/tailwind` (tokens in `src/styles/tokens.css`).
- **MDX** integration kept available; no MDX content shipped yet.
- **Self-hosted fonts** via `@fontsource/inter` and `@fontsource/jetbrains-mono`.

No React. No WebGL. No Framer Motion. No View Transitions. No client JS
on any route — every page is a plain MPA navigation.

## Install & develop

```bash
# Node 20+ recommended.
npm install
npm run dev
```

## Build

```bash
npm run build    # runs astro check, then astro build → dist/
npm run preview
```

## Environment variables

Set at build time:

| Var         | Default                    | Purpose                                   |
|-------------|----------------------------|-------------------------------------------|
| `SITE_URL`  | `https://cyrilletabe.com`  | Absolute base for canonical / OG / sitemap |
| `BASE_PATH` | `/`                        | Project-site path (e.g. `/repo-name/`)    |

For a GitHub project site (e.g. `cytab.github.io/personal_website/`):

```bash
SITE_URL="https://cytab.github.io" BASE_PATH="/personal_website/" npm run build
```

## Deployment

Push to `main` → `.github/workflows/deploy.yml` → `actions/deploy-pages@v4`.

## Routes

- `/` + `/fr/` — Home. Hero + one-paragraph orientation + three featured projects + links out.
- `/work/` + `/fr/travaux/` — five projects, prose-first, each with a status badge and tech list.
- `/research/` + `/fr/recherche/` — four clusters (one paragraph each) + "what I'm pulling in".
- `/about/` + `/fr/a-propos/` — short bio + CV-by-email card + contact line.
- `/404` — "route not in plan".

## CV

`/about/` and `/fr/a-propos/` ship a **"CV — by email"** mailto card
(`mailto:cyrilletabepro@gmail.com?subject=CV%20request`) instead of a direct
PDF download. To switch to direct download: drop PDFs into
`public/cv/cyrille-tabe-cv-{en,fr}.pdf`, update the About pages to swap
the mailto anchor for a `<a href="/cv/...">Download</a>`, and update
`tests/e2e/cv-download.spec.ts` to assert the PDF path + 200.

## OG image

`public/og-default.svg` (and a PNG sibling) are static files, committed
once. No runtime render step — keep the file, or replace it, nothing
else to do.

## Testing

```bash
npm run build          # must pass before PR
npx astro check        # 0 errors / 0 warnings / 0 hints
npm run test:e2e       # Playwright e2e (Chromium / Firefox / WebKit × desktop / mobile)
npm run test:axe       # axe-core WCAG 2.2 AA on every route
npm run test:lighthouse  # Lighthouse CI, contract in .lighthouserc.json
```

Current state on this commit (chromium-desktop):

- 68/68 e2e + axe passing.
- Lighthouse: **perf 100 / a11y 100 / best-practices 100 / seo 100** on
  every route.
- Zero JS on every page.

## Content

All copy lives in `src/content/copy.ts` (EN + FR). UI strings live in
`src/i18n/strings.ts`. Anchor slugs inside `/work/` are stable in EN and
reused in FR (`#robotclaw`, `#openclaw`, `#drone-stack`,
`#noovelia-lattice`, `#odu-slam`).

## Docs (provenance)

- `docs/subject-dossier.md` — the source of truth about Cyrille.
- `docs/agents/02-narrative-architecture.md` — voice & copy reference.
- `docs/qa/simplification-report.md` — what was stripped and why.

## License

Private. Ask before reuse.
