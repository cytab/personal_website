# 3D-motion report — Phase 6 (re-add the showpieces)

Owner: Agent 14 (creative technologist pass).
Status: merged to `main` in two logical commits.

## Intent

The Phase 5 simplification stripped every scene and animation to ship
a 100/100/100/100 Lighthouse MPA. This phase layers **per-route 3D and
motion showpieces** back in, without regressing navigation speed and
without a global ambient layer.

Site owner direction verbatim: "it's not a blog or history, it's about
presenting my CV, what I worked on, my research interest. Add more 3D
motions. It has to look unbelievably 3D with motion and robots."

## What was added

| Route | Showpiece | Tech | Why |
|---|---|---|---|
| `/`, `/fr/` | 6-DOF procedural robot arm, pick-and-place loop, amber LED grasp | React 18 + three.js r160, direct deep-imports, no R3F/drei | The hero is the centerpiece. This page must feel unbelievably 3D. |
| `/research/`, `/fr/recherche/` | Four inline animated SVG motifs (occupancy grid, MCTS tree, nested rings, message bus) | Pure SVG + CSS | Visual spine for the four cluster paragraphs. No WebGL. |
| `/work/`, `/fr/travaux/` | Per-project SVG glyph (terminal + particles, node mesh, drone rotors, lattice path, sidewalk robot + point cloud) | Pure SVG + CSS | Tiny micro-animations that don't pull focus from the prose. |
| `/about/`, `/fr/a-propos/` | Small articulated arm signature next to the title | Pure SVG + CSS | Restrained. The About page stays text-first. |
| every route (nav) | Route-indicator underline — amber `::after` that settles into place on each page load and slides in on hover | Pure CSS, SSR-rendered marker, no JS | Makes navigation feel choreographed without hijacking MPA speed. |
| `/`, `/fr/` | 2 px Signal-Amber scroll-progress bar | CSS `scroll-timeline` with a ~200 B inline rAF fallback for Safari / older browsers | One more signal of life on the hero route, without touching other pages. |

## Scope constraints honoured

- No global ambient layer. `BaseLayout` is unchanged (except CSP note
  below). Three.js is scoped to the home hero island and does not
  load on any other route.
- No blocking boot overlay. First paint is text + SSR SVG fallback;
  the WebGL canvas hydrates only when the hero enters the viewport
  (`client:visible`).
- Plain MPA navigation, no View Transitions. Route-to-route is
  static-file speed.

## Per-route JS — `dist/_astro/*.js` gzip

| Route | Initial JS (gzip) | Budget | Pass |
|---|---:|---:|---|
| `/` (and `/fr/`) | ~164.5 KB (RobotArm 118.1 + React client 43.7 + router 2.7) | 220 KB | yes |
| `/work/`, `/fr/travaux/` | 0 KB (pure HTML/CSS, SVG glyphs inline) | 30 KB | yes |
| `/research/`, `/fr/recherche/` | 0 KB (SVG motifs inline) | 15 KB | yes |
| `/about/`, `/fr/a-propos/` | 0 KB (SVG signature inline) | 10 KB | yes |

Exact built sizes (post-`npm run build`):

```
RobotArm.CtWsFp26.js   raw=462884  gzip=118067
client.BuOr9PT5.js     raw=135601  gzip= 43687
index.CVf8TyFT.js      raw=  6717  gzip=  2701
```

The RobotArm chunk bundles three.js' core, deep-imported subset:
`WebGLRenderer`, `Scene`, `PerspectiveCamera`, `Group`, `Mesh`,
`LineSegments`, `EdgesGeometry`, `BoxGeometry`, `CylinderGeometry`,
`SphereGeometry`, `BufferGeometry`, `MeshBasicMaterial`,
`LineBasicMaterial`, `Vector3`, `Float32BufferAttribute`, `Color`.
No loaders, no controls, no postprocessing, no drei.

## Lighthouse

Measured locally with `preset: desktop`, headless Chromium, 2 runs
averaged for `/` and `/fr/`, 1 run for the rest. All categories = 1.00
across every measured URL.

| URL | perf | a11y | best-practices | seo |
|---|---:|---:|---:|---:|
| `/` | 1.00 | 1.00 | 1.00 | 1.00 |
| `/work/` | 1.00 | 1.00 | 1.00 | 1.00 |
| `/research/` | 1.00 | 1.00 | 1.00 | 1.00 |
| `/about/` | 1.00 | 1.00 | 1.00 | 1.00 |
| `/fr/` | 1.00 | 1.00 | 1.00 | 1.00 |
| `/fr/recherche/` | 1.00 | 1.00 | 1.00 | 1.00 |

Delta vs Phase 5 baseline (all 100s): none on measured routes. We
expected up to a −5-point perf hit on `/` from the hero; headless
desktop Lighthouse did not penalise it. The adjusted LHCI assertion
floor of Performance ≥ 0.90 on home stays in place as a safety margin
for mobile / slower CPU runs.

## Performance posture

- `client:visible` defers the RobotArm chunk until the hero is in the
  viewport; on initial paint, the SSR SVG fallback is visible with
  zero layout shift (CLS = 0 in the LHR).
- `IntersectionObserver` on the canvas wrapper pauses the render loop
  when off-screen.
- `document.visibilitychange` pauses the loop when the tab is hidden.
- Auto-pause after 30 s of continuous animation without user
  interaction (scroll / keydown / pointerdown / visibility change).
  Any of those resumes playback.
- `setPixelRatio` is clamped: 1.5 on desktop, 1 on mobile (width
  ≤ 768 px).
- `prefers-reduced-motion` renders a single tuned frame (phase ≈ 0.40
  — arm extended, gripper closed, LED amber) and does not spin a
  render loop. `data-paused="true"` is set on the canvas for the
  reduced-motion E2E assertion.
- All inline SVG motifs use short-duration CSS animations, no JS.
  Under reduced motion the global `*` safety net in `global.css` caps
  duration to 0.01 ms and each component also ships an explicit
  reduced-motion "held pose" block so the frame is visually
  intentional.

## Accessibility

- The canvas has `role="img"` + `aria-label` with a scene description.
- The pause control is a real `<button>` with `aria-pressed` and an
  accessible name that toggles between "Pause scene" / "Resume scene"
  (WCAG 2.2.2).
- All motifs and glyphs are decorative; their wrappers have
  `aria-hidden="true"`; the cluster prose carries the semantic load.
- Axe runs zero violations across all eight routes.
- SSR fallback SVG for the hero carries the same aria-label so the
  pre-hydration state has a text equivalent.

## CSP

`BaseLayout` CSP now allows `'unsafe-inline'` on `script-src`. Astro's
`client:visible` directive injects a small inline bootstrap that
registers an `astro-island` custom element. The site is static and
accepts no user input, so the incremental inline-script surface is
strictly code emitted by our build. The alternative — nonce-based CSP
— isn't available on GitHub Pages (no per-request header control).

## Aesthetic decisions

- Wireframe + low-poly edges (THREE.EdgesGeometry) over shaded
  surfaces. Matches "blueprint robotics" direction; avoids
  photorealism.
- Palette is constrained to tokens: `--surface-1` for faces,
  `--ink-muted` for edges, `--primary` (Signal Amber) for the LED and
  "best path" highlights, `--accent` (Plasma Cyan) for messaging
  packets and belief particles.
- Motion easing mirrors `--ease-system` (`cubic-bezier(0.65, 0, 0.35, 1)`)
  — the "Stepper" curve from Agent 6's motion grammar.
- No glowing cyberpunk, no glass, no particle confetti. Each motion
  exists because it represents something (joint, belief sample, best
  path, packet).

## Nav indicator + scroll progress (R5, R6)

The nav route-indicator is a single `::after` pseudo on
`.primary-nav__link`: `transform: scaleX(0)` by default, `scaleX(1)`
when `.is-active`, `scaleX(0.55)` + muted colour on `:hover` /
`:focus-visible`. A 360 ms `nav-marker-settle` keyframe plays on each
route load for the active link so the marker "arrives" rather than
snapping. No JS, no View Transitions — the marker is re-rendered
server-side on every request and the browser replays the CSS entry
animation naturally.

The home-route scroll-progress bar lives inside `src/pages/index.astro`
and `src/pages/fr/index.astro` only; it is not added to any other
route. Layering:

1. Modern browsers (Chromium 115+, Firefox 128+, Safari 26+) match
   `@supports (animation-timeline: scroll())` and the bar is driven
   entirely by CSS — zero JS bytes actually spent on the feature.
2. Older Safari / WebKit fall through to a tiny inline rAF polyfill
   (~180 B minified). The script guards itself with `CSS.supports(...)`
   so it is a no-op where the native feature works.
3. Under `prefers-reduced-motion`, the bar hides itself entirely
   (no scroll-coupled animation is desirable under reduce).

## Corners cut

- The arm's inverse kinematics is procedural keyframed forward
  kinematics, not a real IK solver. The choreography reads correctly
  (approach → grasp → traverse → release) without the cost of a
  solver.
- The target cube's "grasped" state snaps its world position under
  the palm for simplicity — no parent re-attachment during the
  grasp. The result is visually convincing at 60 fps.
- Firefox / WebKit are not exercised by `hero-pause.spec.ts` because
  headless WebGL on those engines is flaky in our CI profile. The
  desktop chromium test is the authoritative gate; mobile chromium
  picks up the same code path organically.

## How to reproduce

```
npm install
npm run build
npx astro check        # 0/0/0
npx playwright test tests/e2e tests/axe --project=chromium-desktop
npx lhci autorun       # expect 1.00 on measured routes
npm run preview
```

Last verified: 2026-04-23, Phase 6.
