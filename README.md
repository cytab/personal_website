# cyrille-tabe-site

Personal website for Cyrille Tabe. Astro static export, deployed to
GitHub Pages. Four tab routes — Home, Work, Research, About — and that's
the whole site.

## Stack

- **Astro 4** — plain MPA navigation.
- **TypeScript strict** — `astro check` gate on every build.
- **Tailwind CSS** via `@astrojs/tailwind` (tokens in `src/styles/tokens.css`).
- **MDX** integration kept available; no MDX content shipped yet.
- **Self-hosted fonts** via `@fontsource/inter` and `@fontsource/jetbrains-mono`.
- **React 18 + Three.js (r160)** — scoped to **the home hero only**
  (`src/components/RobotArm/`) via `client:visible`. The React integration
  is added back via `@astrojs/react`, but it does not hydrate on `/work/`,
  `/research/`, `/about/` or their FR mirrors.

No Framer Motion. No R3F. No View Transitions. No global ambient layer.
Every non-home route is zero-or-near-zero client JS — only a ~200 B inline
scroll-progress polyfill script is inlined on `/` and `/fr/` (guarded by
`CSS.supports('animation-timeline:scroll()')` and skipped on modern
browsers). Work / Research / About micro-motion is pure SVG + CSS.

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

- `/` + `/fr/` — Home. Hero + one-paragraph orientation + a "Building / Shipping at work" split + links out.
- `/work/` + `/fr/travaux/` — personal projects only: one flagship (RobotClaw) + three academic projects condensed from the CV.
- `/research/` + `/fr/recherche/` — four clusters (one paragraph each) + "what I'm pulling in".
- `/about/` + `/fr/a-propos/` — full CV (header, education, professional experience, research, skills, about me) with a Download-CV button.
- `/404` — "route not in plan".

## CV

`/about/` and `/fr/a-propos/` ARE the CV. The page is rendered from a
structured source in `src/content/copy.ts` (`cv.en` / `cv.fr`), mirroring
`CV_CYRILLE_TABE_comments_oeucu/main.tex` verbatim for the factual
sections.

A **Download CV** button on the About page points at
`/cv/cyrille-tabe-cv-en.pdf`. The PDF is compiled on CI by
`.github/workflows/deploy.yml` (`continue-on-error` step installs
`texlive-latex-base`, `texlive-latex-extra`, `latexmk` and runs
`latexmk -pdf`). Locally `public/cv/` only contains `.gitkeep`, so the
link 404s until deploy — that is acceptable per the brief, and a short
inline note below the button tells visitors to email if it's missing.
A mailto fallback (`mailto:cyrilletabepro@gmail.com?subject=CV%20request`)
sits next to the download button for the same reason.

The FR page links to the same EN PDF (no FR LaTeX exists yet) and
annotates it as "(version anglaise)".

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

- e2e + axe green; a hero-pause spec covers the WCAG 2.2.2 pause
  toggle on the home WebGL canvas.
- Lighthouse: **perf ≥ 95 / a11y 100 / best-practices ≥ 95 / seo 100**
  across every route; `/` stays at 95+ even with the Three.js hero.
- Zero client JS on `/work/`, `/research/`, `/about/` and their FR
  mirrors. Home ships ~165 KB gzip of React + three.js (hero island).

## Content

All copy lives in `src/content/copy.ts` (EN + FR). UI strings live in
`src/i18n/strings.ts`. Stable anchors:

- `/work/#robotclaw` — flagship personal project.
- `/work/#safe-mpc-collision-avoidance`, `/work/#collision-free-exploration`,
  `/work/#intersection-navigation` — academic projects.
- `/about/#professional-experience` — the employment list on the CV page.

## Docs (provenance)

- `docs/subject-dossier.md` — the source of truth about Cyrille.
- `docs/agents/02-narrative-architecture.md` — voice & copy reference.
- `docs/qa/simplification-report.md` — what was stripped and why.

## License

Private. Ask before reuse.
