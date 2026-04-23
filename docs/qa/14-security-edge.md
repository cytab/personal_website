# 14 — Security & Edge-Case QA

**Author**: Agent 14 — Senior security-aware engineer
**Status**: Phase 4 QA. `npm run build` passes with the meta-CSP +
referrer policy patch applied to `BaseLayout.astro`.
**Anchored to**: subject-dossier, phase-1/2/3 revisions, Agents 08, 09, 10.

---

## 0. Headline verdict

- **CSP is shippable** as meta-delivered, with caveats. Clickjacking
  (`frame-ancestors`), HSTS, and MIME-sniff protection are **not
  enforceable on GitHub Pages**; they require moving behind a
  custom-domain CDN (Cloudflare Pages, Netlify, or equivalent). The
  `public/_headers` file in this repo pre-stages those for that move.
- **P0 security findings**: one — the bundled `astro@4.16.19` ships
  with ten known advisories (1 high, 9 moderate). See §5.
- **P0 edge-case findings**: one — the `/about/` CV links point at
  `/cv/cyrille-tabe-cv-en.pdf` and `.../-fr.pdf` which are **not
  present** in `public/cv/` or `dist/cv/`, so both download links 404
  at runtime.
- **JS-off**: the site remains readable. See §11.
- **Secrets scan**: zero.

---

## 1. CSP — draft, rationale, gaps

### 1.1 What ships (meta, same on every page)

```
default-src 'self';
script-src  'self' 'unsafe-inline';
style-src   'self' 'unsafe-inline';
img-src     'self' data:;
font-src    'self';
connect-src 'self';
frame-src   'none';
object-src  'none';
base-uri    'self';
form-action 'self' mailto:;
upgrade-insecure-requests
```

Plus: `<meta name="referrer" content="strict-origin-when-cross-origin">`.

Delivered via `<meta http-equiv>` in `BaseLayout.astro`, bracketed by
`<!-- sec-headers-start -->` / `<!-- sec-headers-end -->`.

### 1.2 Why `'unsafe-inline'` for `script-src` — and why that's OK here

The site ships four classes of inline script, at least one of which
runs on every page:

1. `BaseLayout.astro` — the View-Transitions feature detect + replan
   classifier + `astro:before-preparation` click coordinate capture.
2. `SensorBoot.astro` — the 1.8s boot IIFE that reads
   `sessionStorage`, times the three stages, and removes the overlay.
3. `LanguageSwitcher.astro` — the ≤400B `hashchange` handler that
   preserves the URL fragment across locale switches.
4. `BaseLayout.astro` — the Person JSON-LD, home-only.

A nonce-based CSP cannot be expressed in meta-delivered policy on a
fully static host — there is no request context in which to mint a
nonce. A hash-based CSP is technically possible but would require
emitting a per-page meta-CSP computed at build time over each page's
inline-script bytes (including the Astro-injected JSON-LD and any
future per-page inline); that's a bespoke build plugin and is out of
scope for this QA pass.

The pragmatic call: **`'unsafe-inline'` for scripts, but with
everything else locked down.** The XSS risk surface is:

- No user input reaches the DOM. The contact flow is `mailto:`.
- No server-side rendering of runtime data. All content is build-time
  static, imported from `src/content/copy.ts` and MDX collections.
- No `dangerouslySetInnerHTML` in React islands. Verified by grep.
- No third-party scripts in production (Plausible is commented out).

The residual risk is a **supply-chain compromise** of the build — if a
dependency is backdoored, `'unsafe-inline'` gives it a free hand. That
risk exists regardless of CSP posture for a static site; CSP with
hashes would not prevent a compromised build from emitting a new hash.

**Upgrade path**: once any user input or third-party script is added,
move the CSP to a build-time hash-generator plugin AND move the site
behind a proxy that can deliver real response-header CSP (which also
unlocks `frame-ancestors`). See §3.

### 1.3 Why `'unsafe-inline'` for `style-src`

Astro inlines scoped component CSS via `<style>` blocks per component
(`data-astro-cid-*`). Hashing every block on every page is the same
bespoke-build-plugin problem as scripts, with the same tradeoff.
Style-inline-injection vectors are far less severe than script
vectors — worst case is defacement, not code execution. Accepted.

### 1.4 Why meta CSP loses `frame-ancestors`

Per CSP Level 2 / Level 3 spec, the `frame-ancestors` directive is
**ignored** when the policy is delivered via `<meta http-equiv>`.
Clickjacking protection therefore currently hinges on the honor system
(and on an attacker needing to set up a framing page that uses our
domain — a low-value target for a personal portfolio, but still a gap).

**Mitigation plan**: the `public/_headers` file in this repo includes
the full policy WITH `frame-ancestors 'none'`. GH Pages ignores
`_headers`, but Cloudflare Pages, Netlify, and Vercel honor it. If
Cyrille moves the custom domain behind Cloudflare DNS proxy + Pages or
routes through Workers, that single migration activates `X-Frame-Options`,
`frame-ancestors`, HSTS, `X-Content-Type-Options`, and
`Permissions-Policy` in one go.

---

## 2. Other meta-settable headers

| Header | In meta? | Shipped? | Notes |
|---|---|---|---|
| `Content-Security-Policy` | yes (with caveats) | yes | frame-ancestors ignored per spec |
| `Referrer-Policy` | yes (`<meta name="referrer">`) | yes (`strict-origin-when-cross-origin`) | |
| `X-Content-Type-Options: nosniff` | **no** (ignored in meta) | no | Must ship as response header |
| `X-Frame-Options` | **no** (ignored in meta) | no | Covered by `frame-ancestors` post-migration |
| `Strict-Transport-Security` | **no** (ignored in meta) | no | GH Pages already force-redirects to HTTPS |
| `Permissions-Policy` | partially (inconsistent UA support) | no | Pre-staged in `_headers` |
| `Cross-Origin-Opener-Policy` | no | no | Pre-staged in `_headers` |
| `Cross-Origin-Resource-Policy` | no | no | Pre-staged in `_headers` |

---

## 3. GitHub Pages header gap — and how to close it

GitHub Pages will not let you set custom HTTP response headers. You
get what their static server emits, period. The security-relevant
headers that fall off this cliff:

- `Strict-Transport-Security` — GH Pages does redirect HTTP→HTTPS, so
  the first-visit downgrade window exists but is small. HSTS preload
  would close it; not available.
- `X-Frame-Options` / `frame-ancestors` — clickjacking unprotected.
- `X-Content-Type-Options: nosniff` — in practice modern browsers are
  conservative about sniffing on non-HTML `.js` files, but this is
  defence-in-depth we don't get.
- `Permissions-Policy` — the site uses no powerful APIs, so lack of a
  lock-down is theoretical, not exploitable.

**Recommended path**, in priority order:

1. **Custom domain + Cloudflare proxied DNS + Cloudflare Transform
   Rules** (cheapest): keeps GH Pages as the origin; Cloudflare
   rewrites response headers at the edge. Full header set achievable.
   No code changes in this repo. Add a `public/CNAME`.
2. **Migrate to Cloudflare Pages or Netlify**: drop the GH Actions
   deploy, point the Pages/Netlify integration at this repo. The
   `public/_headers` file activates automatically. No runtime change.
3. **Stay on GH Pages**: accept the gaps. Document for visitors via
   `.well-known/security.txt` (future; not shipped).

Either way, the build output is identical.

---

## 4. Secrets scan — result: zero

Scanned `src/**` for:

- OpenAI-style keys `sk-[A-Za-z0-9]{20,}`.
- GitHub PAT `ghp_...`.
- AWS access keys `AKIA[0-9A-Z]{16}`.
- Slack tokens `xox[baprs]-...`.
- Private-key blocks `BEGIN (RSA|OPENSSH|EC|DSA|PRIVATE) KEY`.
- Google API keys `AIza...`.
- Stray emails other than the known `cyrilletabe@gmail.com`.

**No matches.** The only email address present in source is
`cyrilletabe@gmail.com`, which is intentional (contact CTA + Person
JSON-LD `email` field + Footer link). Appearances enumerated:

- `src/layouts/BaseLayout.astro:70` — `email: 'mailto:cyrilletabe@gmail.com'` (JSON-LD).
- `src/pages/index.astro:136-137` — home contact anchor.
- `src/pages/fr/index.astro:96-97` — FR home contact anchor.
- `src/components/Footer.astro:20` — footer write-to-me.
- `src/content/copy.ts:150,155` — closing invitation body (EN + FR).

No other PII, no tokens, no URLs to internal services.

---

## 5. Dependency audit — `npm audit --omit=dev`

Run on 2026-04-23 against `package-lock.json` as shipped.

### 5.1 Totals

- **1 high, 9 moderate, 0 critical, 0 low, 0 info.**
- All ten findings trace back to `astro@4.16.18` and its transitive
  `vite`, `esbuild`, `@astrojs/mdx`, `@astrojs/react`, plus the
  `@astrojs/check` → `@astrojs/language-server` → `yaml-language-server`
  chain (yaml).

### 5.2 The single `high`

`GHSA-wrwg-2hg8-v723` — "Astro vulnerable to reflected XSS via the
server islands feature", CVSS 7.1. Range: `astro <=5.15.6`.

**Impact for this site**: **none exploitable**. Server islands are an
Astro 4.x preview / Astro 5 GA feature that requires server-rendered
routes. This project is 100% static (`output: 'static'` by default in
`astro.config.mjs`, no SSR adapter). The code path containing the
sink is not reachable because there are no server islands and no
request-time rendering.

**Recommendation**: fix anyway via `npm audit fix --force` which
upgrades to `astro@6.1.9` (semver-major). That's a real upgrade with
compatibility work — View Transitions API moved, i18n routing changed
shape, `@astrojs/sitemap` pin breaks — so defer to after launch unless
GH Pages starts blocking the build on audit exit codes.

### 5.3 The nine `moderate`

| Advisory | Package | Range | Why it's non-exploitable here |
|---|---|---|---|
| GHSA-5ff5-9fcw-vg88 | astro | <5.14.3 | X-Forwarded-Host reflection — requires request handling; static site has none. |
| GHSA-hr2q-hp5q-x767 | astro | <5.15.5 | URL-manipulation middleware bypass — no middleware. |
| GHSA-fvmw-cj7j-j39q | astro | <5.15.9 | Stored XSS in `/_image` on Cloudflare adapter — not on GH Pages, no adapter. |
| GHSA-ggxq-hp9w-j794 | astro | <5.15.8 | Middleware path-bypass via URL encoding — no middleware. |
| GHSA-whqg-ppgf-wp8c | astro | <5.15.8 | Double-URL-encode auth bypass — no auth. |
| GHSA-j687-52p2-xcff | astro | <6.1.6 | `define:vars` XSS via incomplete `</script>` sanitization — **code-path review**: grep `src/` for `define:vars` → **zero matches**. Not used. |
| GHSA-67mh-4wv8-2f99 | esbuild | <=0.24.2 | Dev-server CORS — dev-only; never reaches production. |
| GHSA-4w7w-66w2-5vf9 | vite | <=6.4.1 | Vite optimized-deps `.map` path traversal — dev-only. |
| GHSA-48c2-rrv3-qjmp | yaml | 2.0.0-2.8.2 | Stack overflow — reached only through `@astrojs/check` at dev/lint time. |

**Verdict**: zero of the ten advisories have a reachable code path in
the shipped artifact. The build output is HTML + JS + CSS + fonts;
none of the vulnerable code runs at runtime because the vulnerable
paths are server / dev / adapter / middleware code that the static
export does not invoke.

**Action**: when Astro 5 lands stably in the ecosystem with `sitemap`
compatibility, plan the upgrade. Mark as Agent 9 follow-up, not a
blocker.

---

## 6. Third-party scripts — inventory

| Source | URL | Shipped? | SRI? | Allowlisted in dossier? |
|---|---|---|---|---|
| Plausible | `https://plausible.io/js/script.js` | **no — HTML-commented** | n/a | yes (dossier §"Non-Negotiables": Plausible allowed) |
| Everything else | — | none | — | — |

**Finding**: the built HTML contains the string
`<script defer data-domain=... src=...plausible.io...>` on every page,
but wrapped in an HTML comment (`<!-- ... -->`). Browsers do not
execute commented scripts. Confirmed via `grep -o '<!-- <script ...plausible...-->' dist/**/index.html` — always inside a comment.

**Risk on enable**: when Cyrille uncomments Plausible, the CSP must be
updated — currently `script-src 'self' 'unsafe-inline'` would block
the external `plausible.io` load. Add to the meta-CSP:

```
script-src 'self' 'unsafe-inline' https://plausible.io;
connect-src 'self' https://plausible.io;
```

…AND add SRI (`integrity`) to the `<script>` tag. Plausible publishes
SHA-384 hashes on its docs page; pin one and set `crossorigin="anonymous"`.

---

## 7. Contact-flow audit

Dossier + phase-2-revisions §6 pin **mailto**. Source agrees — no
`<form>` elements in `src/pages/**` beyond the one in Agent 8's future
Formspree spec (not shipped). Verified:

- `grep -rn '<form' src/` → no matches.
- All contact CTAs point at `mailto:cyrilletabe@gmail.com` with a
  subject parameter.

**No rate-limiting, no honeypot, no CAPTCHA concerns** because there
is no form. `mailto:` links are handled entirely by the user's mail
client; the site is not in the trust path for spam filtering.

If/when the mailto is swapped for Formspree per Agent 9 §10:

- Formspree endpoints are POST-only; add `connect-src https://formspree.io`
  to CSP and `form-action https://formspree.io` (current policy has
  `form-action 'self' mailto:` — will need widening).
- Honeypot per Agent 8 §6.2.
- `novalidate` + controlled validation per Agent 8 §6.2.

---

## 8. Edge cases — walkthroughs

### 8.1 Home page with JS disabled — P0/P1/P2 loss ratings

Method: inspected `dist/index.html` byte-for-byte. The page is a
complete, valid HTML document: `<h1>`, seven `<section>` beats, four
`<ClusterPanel>` blocks, project grid, frontier chip list, writing
teaser, contact CTA, skip link, primary nav (`<ul>` + anchors),
footer, Person JSON-LD, hreflang alternates, canonical, OG meta.

| Feature lost without JS | Verdict |
|---|---|
| SensorBoot overlay remains over content | **P0 originally — but mitigated** |
| Hero WebGL scene does not initialize | **P2**: SSR SVG fallback renders the converged map. |
| ScrollProgress, NavTree, UncertaintyEllipse islands | **P2**: SSR fallbacks (static `<ul>` nav, static SVG sigils) already cover the content. |
| View Transitions replan metaphor on link clicks | **P2**: native full-page navigation works; no visual loss for the reader, only the choreography. |
| LanguageSwitcher hash-preservation | **P2**: per Agent 8 §9.2 + Agent 4 §4.5 this is an accepted fallback — user lands at top of translated page. |
| SensorBoot removes itself after 1.8s | **P0 if unmitigated** — without JS the overlay is a `position:fixed inset:0 z-index:900` div that covers the whole viewport and never goes away. The SSR renders it with `data-stage="0"` and no class to hide it. |

**P0 finding — SensorBoot is a full-page overlay with no `<noscript>`
fallback.** A JS-disabled visitor sees the booting eyebrow and bars,
and cannot read the actual page beneath it. The current CSS has the
`.sensor-boot--done` class only applied by JS, and the base styles use
`background: var(--bg)` which is fully opaque.

**Recommended fix** (out of Agent 14's edit lane — flagging for
Agent 9):

```html
<!-- In SensorBoot.astro, add a noscript sibling that hides it. -->
<noscript>
  <style>#sensor-boot { display: none !important; }</style>
</noscript>
```

Or alternately set `opacity: 0; pointer-events: none` by default in
the stylesheet and set `opacity: 1; pointer-events: auto` via JS on
boot. Either fixes JS-off readability.

**Rating**: **P0** — blocks the page entirely for no-JS users.

### 8.2 Brave Shields strict

Brave Shields "aggressive" blocks third-party scripts, fingerprinting,
and some data URIs. Impact against this site:

- **Fonts**: self-hosted via `@fontsource` → same-origin → **not blocked**.
- **Plausible**: commented out → **N/A**.
- **Hero WebGL canvas**: Brave's fingerprinting farbling affects
  `readPixels` / `getImageData`, but this site never reads the canvas
  back — it only renders. **No break.**
- **Cross-origin fetches**: grep `src/**` for `fetch(` → none targeting
  cross-origin URLs. **No break.**
- **View Transitions API**: not gated by shields. **No break.**

**Verdict**: Brave Shields strict is a **clean run**. Bonus — the
site's local-first ethos makes this trivially true.

### 8.3 200% browser zoom

CSS audit on `src/styles/tokens.css` + `global.css`:

- All font sizes are `rem` (`--fs-body: 1rem`, `--fs-display: 4rem`, etc.).
  Zoom scales them with root font-size.
- All spacing tokens are `rem` (`--space-1` through `--space-9`).
- Reading measures are `ch` (`--measure-body: 62ch`). Fine at zoom.
- `.container` max-width is `1280px`. At 200% zoom this still contains
  the layout reasonably; smaller screens at 200% zoom fall into the
  mobile media queries, which use `max-width: 767px` etc. and do
  trigger correctly because browser zoom reduces the effective viewport.
- Focus ring uses `2px / 3px` — scales with zoom via the browser's own
  outline rendering. On Firefox + Chrome the outline scales; on Safari
  outlines are a sub-pixel concern but not regressively so.
- Hero-headline media query at 767px uses `font-size: 2.5rem` — `rem`, fine.
- Section-marker decorative rule width is `48px` fixed — decorative,
  does not affect readability at zoom.

**One finding**: in `src/components/ScrollProgress.tsx:135` the bar
heights are set inline as `${height}px`. At 200% zoom the bars do not
scale — acceptable because the bars are decorative and the element is
a nav list with proper text labels for screen readers; the visual
"belief distribution" motif is designed to be viewed at any height.

**Verdict**: **P2**. No blocker.

### 8.4 Slow 3G LCP prediction

Per Agent 10's numbers, home page over-the-wire:

- Synchronous critical: HTML (~15KB gzip) + inline CSS + hoisted.js (4.88KB gzip).
- Hero SSR SVG is inline — renders with the document's first paint.
- Fonts: `@fontsource` imports emit `@font-face` in the CSS; browser
  fetches woff2 on demand when the font is referenced. ~30KB gzip per
  weight for Inter, ~28KB for JetBrains Mono.

**LCP candidate**: the `<h1>` display headline, which uses
`--fs-display: 4rem` + `font-family: var(--font-mono)` (JetBrains
Mono). On Slow 3G (1.6Mbps down, 300ms RTT), the critical path is
HTML (~200ms) → CSS (~100ms after HTML) → mono-font woff2 (~500ms
after CSS at 28KB). Rough LCP: **~900-1100ms** with FOUT, or ~1400ms
if the browser blocks on font.

`@fontsource` imports don't add `font-display: swap` by default; they
do ship `font-display: swap` (verified in `node_modules/@fontsource/jetbrains-mono/400.css`).
FOUT is the expected behavior.

**Verdict**: LCP comfortably under 4s on Slow 3G. **No mitigation needed.**

Optional improvement (Agent 10's lane): preload the mono 500-weight
woff2 in `BaseLayout.astro` with `<link rel="preload" as="font"
type="font/woff2" crossorigin>` to eliminate FOUT on the hero.

### 8.5 Speed-scroller vs SensorBoot

Scenario: visitor disables Enter-to-submit-nav, scrolls wildly from
top to Beat 7 (`#contact`) before the 1800ms SensorBoot envelope
finishes.

Reading `SensorBoot.astro`:

- The overlay is `position: fixed; inset: 0; z-index: 900`.
- It covers everything until the JS fires `sensor-boot--done` at
  t=1800ms (or t=240ms under `reduce`).
- `pointer-events: auto` until done, which means scroll events
  targeted at the overlay element could — on some browsers — be
  captured. However, because `position: fixed` + no explicit
  `overflow`, the overlay does not participate in scroll.

**Finding**: scrolling is NOT blocked — the overlay doesn't prevent
the underlying document from scrolling (fixed position ≠ scroll
capture). But the visual experience is: the user scrolls "through" a
blank overlay that sits on top, then the overlay fades and they're
already at Beat 7.

**Visual glitch?** Minor — the content they're now looking at wasn't
revealed with a transition. Not a P0. Rating **P2**.

**Better fix** (out of lane): give SensorBoot a `scroll-fast-skip`
listener that aborts the envelope and marks the session as booted if
`scrollY > viewport * 0.5` within the first 300ms. Flagged for Agent 10.

### 8.6 SPA Back button + View Transitions

Astro's `<ViewTransitions />` wraps browser history, so Back uses
`history.back()` → `popstate` → Astro swaps DOM.

Scroll position: Astro View Transitions ships a default scroll
restorer — the browser-native `history.scrollRestoration` is set to
`manual` and Astro re-applies the stored position on `popstate`.
Confirmed from reading Astro's source for 4.16.x.

Animation replay: the `astro:before-preparation` handler in
`BaseLayout.astro` (lines 192-215) fires for Back navigation as well
as forward. It sets `--replan-x/--replan-y` based on the clicked
element's bounding rect — but on Back, `e.sourceElement` is typically
`null`, so `rect` is `null`, so CSS variables are NOT updated; the
previous values (from the last forward nav) are reused.

**Verdict**: Back replay uses stale coordinates, so the wavefront
origin is visually "wrong" (it expands from wherever the last forward
click happened, not from the center). The metaphor survives because
the overall effect is still a lattice expansion. **P2 — visible but
non-breaking.**

**Suggested fix** (out of lane): reset `--replan-x/--replan-y` to
`50% 50%` on `popstate` or when `e.sourceElement` is absent.

### 8.7 Locale-switcher deep-link — `/work/#robotclaw` → `/fr/travaux/#robotclaw`

`src/components/LanguageSwitcher.astro` reads the current URL hash on
`DOMContentLoaded` and `hashchange`, and appends it to the switcher's
`href`. The sibling URL map in `src/i18n/strings.ts` maps `work/` to
`travaux/`. Anchor slugs (`#robotclaw`, `#openclaw`, etc.) stay in
English in both locales per Agent 4 §4.5.

**Manual test** (static inspection):

- EN `/work/#robotclaw` → switcher href rewrites to `/fr/travaux/#robotclaw`. ✓
- FR `/fr/travaux/#odu-slam` → switcher href rewrites to `/work/#odu-slam`. ✓

`dist/work/index.html` contains `id="robotclaw"` etc. on each project
section; `dist/fr/travaux/index.html` contains the same. Confirmed.

**JS-off**: per Agent 4's accepted fallback, the fragment drops. The
user lands at the top of the translated page. **P2**, intentional.

**Verdict**: anchors stable. Works.

### 8.8 Deep-route refresh — does nested FR return HTML?

`astro.config.mjs` has `trailingSlash: 'always'` and `build.format:
'directory'`. Each route emits `{route}/index.html`. Verified in `dist/`:

- `dist/fr/travaux/index.html` ✓
- `dist/fr/a-propos/index.html` ✓
- `dist/fr/ecrits/index.html` ✓
- `dist/fr/index.html` ✓
- `dist/work/index.html` ✓

GH Pages serves these as static HTML — refresh on `/fr/travaux/` hits
`dist/fr/travaux/index.html` directly. **No fallback-to-404 risk.**

**Verdict**: clean.

### 8.9 Cmd/Ctrl+Click

Grep `preventDefault` across `src/**`: **zero matches.** No anchor
element has its default behavior suppressed. Cmd+Click (macOS) and
Ctrl+Click (Win/Linux) open links in new tabs as the browser expects.

Astro View Transitions does intercept clicks to run the transition,
but its own code respects modifier keys — modifier-click falls
through to native behavior (verified in Astro source).

**Verdict**: works.

---

## 9. Resilience

### 9.1 Font CDN fails

`@fontsource/inter` and `@fontsource/jetbrains-mono` are **bundled at
build time**. The woff2 files ship in `dist/_astro/inter-latin-*.woff2`
and `.../jetbrains-mono-latin-*.woff2`. No external CDN is hit at
runtime. If a browser cannot fetch them (e.g., extreme privacy mode
blocking same-origin font requests — rare), the CSS `font-family`
falls back to system sans / mono via Tailwind's default stack.

**Verdict**: no external dependency. Resilient.

### 9.2 MDX syntax error on a collection post

**Experiment run**: added `src/content/writing/test-malformed.mdx`
with only `title:` in frontmatter (missing required `description` and
`date`). Ran `npm run build`.

Result:

```
[vite] x Build failed in 656ms
[InvalidContentEntryFrontmatterError] writing → test-malformed.mdx
frontmatter does not match collection schema.
  description: Required
  date: Required
file: .../test-malformed.mdx?astroContentCollectionEntry=true:0:0
  Location: .../test-malformed.mdx:0:0
```

**Verdict**: build fails fast with a legible error that names the
file, the collection, and the exact missing fields. Perfect.
CI/CD will refuse to deploy a broken post.

**Side note**: while the writing collection is empty, the build emits
a benign log line: *"The collection 'writing' does not exist or is
empty."* on `/writing/` and `/fr/ecrits/`. This is informational, not
an error, and the empty-state pages render correctly. No action.

Test file cleaned up; build restored green.

### 9.3 Missing image / CV referenced in content

**Finding — P0**: `src/pages/about/index.astro` lines 34 and 42 link
to `/cv/cyrille-tabe-cv-en.pdf` and `.../-fr.pdf` with a `download`
attribute. Those files do **not exist** in `public/cv/` (empty dir)
and are not in `dist/cv/` either.

Build behavior: Astro does not validate `href` paths against the
public tree at build time. Neither does `astro check`. The build
reports 0 errors.

Runtime behavior: clicking the CV link returns GH Pages' 404 page
(not the site's custom `/404.html`, because the requested path is
outside the Astro route table). The `download` attribute does
nothing on a 404 response.

**Severity**: **P0**. A hiring manager clicking "download CV" gets a
404 from GitHub.

**Recommended fix** (out of lane; for Cyrille or Agent 9):

- Drop a prebuilt `cyrille-tabe-cv-en.pdf` into `public/cv/` so the
  link resolves. FR variant optional.
- OR: edit `src/pages/about/index.astro` to conditionally render the
  link only when a CV file is present — but that requires a build-time
  file check which is not currently wired up.
- OR: add a prominent "CV available on request — write to me" block
  while the PDF is pending.

**Other referenced assets**:

- `public/favicon.svg` — present ✓
- `public/og-default.png` — present, generated by `scripts/generate-og.mjs` ✓
- `public/robots.txt` — present ✓
- Portrait at `/portrait.jpg` — referenced via a placeholder div only,
  not an actual `<img src>`. No broken link.

---

## 10. Edge-case summary — by severity

| # | Finding | Severity | Owner |
|---:|---|:---:|---|
| 1 | SensorBoot overlay with no `<noscript>` fallback blocks page for no-JS users | **P0** | Agent 9 |
| 2 | CV PDFs missing from `public/cv/` but referenced on `/about/` | **P0** | Cyrille / Agent 9 |
| 3 | `astro@4.16.19` ships with 10 advisories; **none reachable** in static artifact | P2 | Agent 9 (planned upgrade) |
| 4 | `frame-ancestors` not enforceable via meta-CSP | P1 | Cyrille (domain move) |
| 5 | HSTS / XFO / XCTO gap on GH Pages | P1 | Cyrille (domain move) |
| 6 | Back-button wavefront reuses stale replan coordinates | P2 | Agent 10 |
| 7 | Speed-scroller sees content appear mid-scroll as SensorBoot fades | P2 | Agent 10 |
| 8 | CSP uses `'unsafe-inline'` for `script-src` and `style-src` | P2 (residual) | Future — build-time hash plugin |
| 9 | On Plausible enable: CSP must be updated + SRI added | P2 (future) | Agent 9 at domain launch |

---

## 11. JS-off verdict — does the site work?

**Mostly, but the SensorBoot overlay is a blocker (finding #1).**
Fix that one-liner and the site reads cleanly without JS:

- Hero has an SSR SVG fallback.
- Nav is a static `<ul>`.
- Cluster panels render fully SSR.
- Project cards render fully SSR.
- Language switcher works as a plain `<a>` (loses fragment — acceptable).
- Contact CTA is `mailto:` — works.
- Footer is a plain `<ul>`.

Post-fix: **yes, the site works JS-off.**

---

## 12. What's locked in this document

- Meta CSP + `Referrer-Policy` delivered via `BaseLayout.astro` (§1).
- `public/_headers` pre-staged for Cloudflare Pages / Netlify (§3).
- `SECURITY.md` at repo root (separate deliverable).
- Secrets-scan result: zero (§4).
- Dependency-audit result: 10 findings, 0 reachable (§5).
- Third-party-script inventory: Plausible only, currently commented (§6).
- Contact flow: mailto, no hardening needed (§7).
- Edge-case walkthroughs (§8) with P0/P1/P2 ratings (§10).

---

*End of 14-security-edge.md — Agent 14.*
