# CV restructure report

Scope: remove OpenClaw + Drone from source (privacy), rebuild About as
the CV, narrow Work to personal + academic, expose a downloadable PDF.

## Files touched

- `src/content/copy.ts` — deleted `openclaw`, `drone-stack`,
  `noovelia-lattice`, `odu-slam` project entries; kept `robotclaw`; added
  `academicProjects[]` (3 entries from the LaTeX CV §Projects); added a
  structured `cv` object (EN + FR) mirroring `main.tex` verbatim for
  facts (Noovelia 14%, Kinova 15%, E-SMART 20%, thesis 20%). Legacy
  `about` stub kept for safety.
- `src/i18n/strings.ts` — scrubbed OpenClaw/Drone mentions from page
  descriptions (EN + FR) and updated Work meta to "1 personal + 3
  academic".
- `src/components/WorkGlyph.astro` — deleted the four non-robotclaw
  branches and their scoped CSS.
- `src/pages/index.astro`, `src/pages/fr/index.astro` — replaced the
  three-project featured block with a "Building / Shipping at work"
  `<dl>` split; RobotClaw links to `/work/#robotclaw`, Noovelia and Odu
  link to `/about/#professional-experience`. Hero and scroll-progress
  polyfill untouched.
- `src/pages/work/index.astro`, `src/pages/fr/travaux/index.astro` —
  RobotClaw flagship at top (full `bodyLong` + WorkGlyph), then an
  "Academic projects / Projets académiques" subsection rendering
  `academicProjects` as plain-text cards (title, tech, right-aligned
  mono date, one-line summary), closing with a github.com/cytab
  invitation.
- `src/pages/about/index.astro`, `src/pages/fr/a-propos/index.astro` —
  rebuilt as full CV: header (name, role, contact list, Download-CV
  button + mailto fallback + soft note), Education, Professional
  Experience (id `#professional-experience`), Research Experience,
  Technical Skills, About-me paragraph. FR notes "(version anglaise)"
  next to the button. Pure HTML/CSS, zero client JS.
- `tests/e2e/cv-download.spec.ts` — asserts the `<a download>` link at
  `/cv/cyrille-tabe-cv-en.pdf`, the mailto fallback, and the FR English
  annotation. PDF HTTP status is observed softly (test-info annotation)
  so a 404 pre-deploy does not fail the suite.
- `README.md` — updated Routes / CV / Content sections; stable anchors
  list now reflects the new slugs (`#robotclaw`,
  `#safe-mpc-collision-avoidance`, `#collision-free-exploration`,
  `#intersection-navigation`, `#professional-experience`).

`docs/` not touched (provenance).

## Voice-alignment calls

CV bullets are left close to the LaTeX (measurable numbers preserved —
14%, 12%, 15%, 20%, 7%, 10%). Intro prose on Work and the About-me
paragraph follow Agent 2's register: precise, unhurried, wry. FR
translations keep technical nouns in English (SLAM, MPC, ROS 2, YOLOv8,
CasADi, behavior tree) per §02 voice notes; dates use en-dash `–`.

## A11y adjustments

Axe flagged two serious violations on the first CV cut (non-text
`<span>` child in the Download button, `<dl>` children not in
`<dt>`/`<dd>` pairs). Fixed by: dropping the `↓` glyph, converting
Education from `<dl>` to `<div>`+`<article>`, using plain-text separators
(" — "), and making contact a `<ul>` with CSS `::before` middots. Skills
section keeps `<dl>` — direct `<div>` groups of `<dt>`/`<dd>` are valid.

## Bundle sizes (post-change)

Unchanged from baseline:

- `/` and `/fr/`: `RobotArm.js 462.88 KB / client.js 135.60 KB / index.js
  6.72 KB` → gzip total ~165 KB, identical to pre-change byte counts.
- `/work/`, `/research/`, `/about/` (and FR mirrors): `<script>` count = 0
  in each `dist/*/index.html`. No React, no islands, no polyfill.

## Test counts

- `npm run build` → passes. `astro check`: 0 errors / 0 warnings / 0 hints.
- `playwright test tests/e2e tests/axe --project=chromium-desktop` → 65
  passed, 0 failed.
- `rg -i "openclaw|drone-stack|drone stack|drone autonomy" src/ README.md
  tests/` → zero hits.
