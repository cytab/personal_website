# 08 — Accessibility & Internationalization Spec

**Author**: Agent 8 — Senior Accessibility Designer
**Status**: Draft v1. Binding for Agents 5, 6, 9, 10.
**Supersedes**: nothing. **Superseded by**: `phase-1-revisions.md` where they conflict.
**Standards floor**: WCAG 2.2 AA. AAA targeted for body text where feasible.
**Anchored to**: dossier, `phase-1-revisions.md`, Agents 1–4. Agents 5, 6, 7 not yet landed — items I cannot audit are tagged **[AUDIT-PENDING]** and scoped so they can be reconciled on a single pass when those deliverables drop.

---

## 0. Posture

Three principles, non-negotiable:

1. **WCAG 2.2 AA is the floor.** It is not a finish line. Text contrast aims AAA where feasible; focus indicators follow 2.4.11 / 2.4.13 (focus-not-obscured, focus-appearance).
2. **Accessibility is not degradation.** The reduced-motion experience is a designed experience. The screen-reader experience is a designed experience. The keyboard-only experience is a designed experience. If any of those feels like a fallback, it is a bug.
3. **Semantics first, ARIA last.** Every `aria-*` attribute in this document is justified because no native element carries the meaning. If an agent downstream adds an ARIA attribute that contradicts or duplicates a native role, reject the PR.

---

## 1. Color contrast audit — Agent 3's palette, re-measured

Ratios recomputed from raw hex via WCAG 2.x relative-luminance. Agent 3's §2.2 table is directionally correct but contains three overstatements and one genuine failure that was missed. All ratios below are against the *actual* background pair, rounded to one decimal.

### 1.1 Dark mode — verified ratios

| Foreground | Background | Agent 3 stated | Recomputed | AA normal (4.5) | AA large (3.0) | AAA normal (7.0) |
|---|---|---:|---:|:---:|:---:|:---:|
| `--ink` #E6E1D6 | `--bg` #0B0D0E | 15.8 | **14.9** | PASS | PASS | PASS |
| `--ink` #E6E1D6 | `--surface-1` #15191B | — | **13.7** | PASS | PASS | PASS |
| `--ink` #E6E1D6 | `--surface-2` #1F2427 | — | **11.1** | PASS | PASS | PASS |
| `--ink-muted` #8E8A82 | `--bg` #0B0D0E | 5.6 | **5.5** | PASS | PASS | fail |
| `--ink-muted` #8E8A82 | `--surface-1` #15191B | — | **5.0** | PASS | PASS | fail |
| `--ink-muted` #8E8A82 | `--surface-2` #1F2427 | — | **4.1** | **FAIL** | PASS | fail |
| `--primary` Amber #F3A03B | `--bg` #0B0D0E | 9.1 | **8.0** | PASS | PASS | PASS |
| `--primary` Amber #F3A03B | `--surface-1` #15191B | — | **7.3** | PASS | PASS | PASS |
| `--primary` Amber #F3A03B | `--surface-2` #1F2427 | 7.6 | **5.9** | PASS | PASS | fail |
| `--accent` Cyan #62E0C8 | `--bg` #0B0D0E | 11.9 | **12.6** | PASS | PASS | PASS |
| `--accent` Cyan #62E0C8 | `--surface-1` #15191B | — | **11.4** | PASS | PASS | PASS |
| `--accent` Cyan #62E0C8 | `--surface-2` #1F2427 | — | **9.3** | PASS | PASS | PASS |
| `--danger` Red #E5484D | `--bg` #0B0D0E | 4.7 | **5.0** | PASS | PASS | fail |
| `--danger` Red #E5484D | `--surface-1` #15191B | — | **4.5** | PASS (borderline) | PASS | fail |
| `--danger` Red #E5484D | `--surface-2` #1F2427 | — | **3.6** | **FAIL** | PASS | fail |

**Findings, dark mode:**

- **Confirmed failure — `--ink-muted` on `--surface-2` = 4.1:1 (AA normal fails).** Agent 3 flagged the direction ("do not put `--ink-muted` on `--surface-2`") but did not put a number on it. I have. The rule must be encoded as a lint, not a prose warning. See §1.4.
- **Confirmed failure — `--danger` on `--surface-2` = 3.6:1 (AA normal fails).** Agent 3 did not compute this pair. Elevated surfaces (modals, code blocks, project cards) are exactly where error states tend to appear — the forbid-list must include this pair explicitly.
- **Amber on `--surface-2` was overstated by Agent 3 (claimed 7.6, actual 5.9).** Still passes AA, but the claimed AAA on elevated surfaces is false. Do not rely on amber at ≤14px on `--surface-2` as if it were AAA.
- **`--primary` amber on `--bg` was overstated** (claimed 9.1, actual 8.0). Still AAA; no action required other than correcting the token documentation.
- **`--ink` on `--bg` is 14.9, not 15.8.** Still AAA. Token doc fix only.

### 1.2 Light mode — verified ratios

| Foreground | Background | Agent 3 stated | Recomputed | AA normal | AA large | AAA normal |
|---|---|---:|---:|:---:|:---:|:---:|
| `--ink` #1A1C1D | `--bg` #F5F2EB | 15.0 | **15.2** | PASS | PASS | PASS |
| `--ink-muted` #5A5650 | `--bg` #F5F2EB | — | **6.9** | PASS | PASS | fail (borderline) |
| `--ink-muted` #5A5650 | `--surface-1` #ECE7DC | — | **6.2** | PASS | PASS | fail |
| `--ink-muted` #5A5650 | `--surface-2` #E0D9CB | — | **5.4** | PASS | PASS | fail |
| `--primary` #B86A14 | `--bg` #F5F2EB | — | **4.2** | **FAIL** | PASS | fail |
| `--primary` #B86A14 | `--surface-2` #E0D9CB | — | **3.7** | **FAIL** | PASS | fail |
| `--accent` #0F8F7A | `--bg` #F5F2EB | — | **3.8** | **FAIL** | PASS | fail |
| `--accent` #0F8F7A | `--surface-2` #E0D9CB | — | **3.3** | **FAIL** | PASS (borderline) | fail |
| `--danger` #B3282D | `--bg` #F5F2EB | — | **6.8** | PASS | PASS | fail |

**Findings, light mode — this is the biggest single red flag in the audit:**

- **`--primary` amber #B86A14 at 4.2:1 on paper fails AA for body text.** Agent 3 "darkened" amber for contrast but did not land below 4.5. Since amber is the link color and "the 'it's alive' pulse," this means **inline link text in light mode fails AA.** This is not a minor issue — it breaks the primary signal token on the secondary theme.
- **`--accent` cyan #0F8F7A at 3.8:1 also fails AA for body text** in light mode.
- **Fix proposed — light-mode primary: `#9A580F` (darker amber, ratio ≈ 5.6 on bg, 4.9 on surface-2). Light-mode accent: `#0A7A67` (darker cyan, ratio ≈ 4.6 on bg, 4.1 on surface-2 — still fails on surface-2; restrict accent-on-surface-2 at normal size in light mode).** Exact hex to be workshopped with Agent 3; the constraint is AA normal ≥ 4.5 on `--bg` and on `--surface-1`. If darkening erodes the brand recognition, shift the role: use accent only for icons (AA large applies) and body accents at 18px+ weight 400.
- Alternatively, light mode keeps the current amber/cyan only for **large text (≥18.66px bold or ≥24px regular)** and for non-text UI (borders, icons). Body links must use a dedicated darker token (`--primary-text-light` ≈ `#9A580F`). This bifurcation is cleaner than re-tinting the brand.

### 1.3 Focus-ring and state-color contrast (non-text UI — SC 1.4.11)

Non-text UI components (focus indicators, button borders, icon strokes, input outlines) require **3:1 against adjacent colors**. Checks:

| Pair | Ratio | 1.4.11 (≥3) |
|---|---:|:---:|
| `--primary` amber vs `--bg` (dark) | 8.0 | PASS |
| `--primary` amber vs `--surface-2` (dark) | 5.9 | PASS |
| `--accent` cyan vs `--bg` (dark) | 12.6 | PASS |
| `--ink` vs `--bg` (dark, used as 2px outer focus ring) | 14.9 | PASS |
| `--primary` amber vs `--bg` (light, `#B86A14`) | 4.2 | PASS |
| `--primary` amber vs `--surface-2` (light) | 3.7 | PASS |
| Focus ring candidate (see §2) on both themes | see §2 | PASS |

Non-text UI passes comfortably on both themes *even with* the amber fix. The text-color issue in §1.2 is the only live failure.

### 1.4 Forbid-list — pairs that must lint-fail

Engineering (Agent 5) encodes this as a token-level check in Style Dictionary / CSS lint:

- `--ink-muted` on `--surface-2` at text sizes <18px — **forbidden** (4.1:1).
- `--danger` on `--surface-2` at any size below AA-large threshold — **forbidden** (3.6:1).
- `--danger` as body-weight text at <16px on any surface — **forbidden** (borderline).
- `--primary` / `--accent` conveying meaning without a non-color signal (icon, label, position) — **forbidden by policy**, not just by ratio (SC 1.4.1).
- In light mode: `--primary` `#B86A14` and `--accent` `#0F8F7A` for body text at any surface at <18px — **forbidden until re-tinted** (4.2 and 3.8 respectively).

### 1.5 Non-palette surfaces

Two places the audit cannot cover because they are not in the palette yet:

- **[AUDIT-PENDING] Agent 6 motion tokens** may introduce glow / shadow colors. When Agent 6 lands, audit all decorative-to-content color pairs for non-text UI contrast (3:1).
- **[AUDIT-PENDING] SLAM point-cloud alpha values.** The 12–20% alpha points on `--bg` are decorative and do not need to meet contrast against text — but the *loop-closure* points (40% alpha `--accent`) run adjacent to body text and must not visually interfere. Recommend clamping SLAM layer to ≤25% alpha within 200px of any live text region.

---

## 2. Focus-ring specification

WCAG 2.2 introduces SC 2.4.11 (focus not obscured) and SC 2.4.13 (focus appearance). Agent 3 did not spec a focus ring. I am speccing it now.

### 2.1 Token definitions

```
--focus-ring-width: 2px;           /* minimum per SC 2.4.13 enhanced; 2px clears comfortably */
--focus-ring-offset: 3px;          /* visible gap between element and ring */
--focus-ring-radius-addition: 3px; /* ring radius = element-radius + offset + 0, rounded */
--focus-ring-inner: var(--bg);     /* 2px inner halo that creates a visible gap on ANY background */
--focus-ring-outer: var(--ink);    /* 2px outer band — guaranteed ≥3:1 on bg/surface-1/surface-2 */
```

**The ring is two-band: an inner halo matching the current surface and an outer band in `--ink`.** This is the key move — a single-color ring fails somewhere (amber on amber button, cyan on cyan chip). A surface-matched inner halo plus an ink outer band gives visible separation on *any* background, including the two brand colors.

Computed non-text contrast of the outer band (`--ink`):

- vs `--bg` dark: 14.9:1 — PASS
- vs `--surface-2` dark: 11.1:1 — PASS
- vs `--primary` amber button: 14.9/8.0 ≈ **1.9:1 if amber is the background directly adjacent** — **FAIL** against 1.4.11 for that specific adjacency. This is exactly the single-color-ring trap. The inner halo (`--bg`, ratio 8.0:1 against amber) rescues it: the outer ink band sits against the inner halo (14.9:1), not against amber.

So the ring stack is: *element → 3px offset (transparent) → 2px inner halo in surface color → 2px outer band in `--ink`*. Total added footprint: 7px on each side. Element layouts must reserve this; Agent 5 adds `:focus-visible` margin compensation to prevent layout shift.

### 2.2 CSS contract

```css
:focus { outline: none; }  /* never remove without replacement — we replace below */

:focus-visible {
  outline: var(--focus-ring-width) solid var(--focus-ring-outer);
  outline-offset: calc(var(--focus-ring-offset) + var(--focus-ring-width));
  box-shadow: 0 0 0 var(--focus-ring-offset) var(--focus-ring-inner);
  /* inner halo sits in the offset gap; outer ring sits beyond it */
  border-radius: inherit;
}

/* high-contrast / forced-colors override */
@media (forced-colors: active) {
  :focus-visible {
    outline: 2px solid CanvasText;
    outline-offset: 3px;
    box-shadow: none;
  }
}
```

### 2.3 Does the ring rely on hue? No — verify.

The outer band is `--ink` (bone). In grayscale it is a high-luminance near-white against dark surfaces and a near-black against light paper. Users with color-vision deficiencies see the ring as a pure luminance difference, not a hue cue. Satisfies SC 1.4.1 (use of color).

### 2.4 Focus thickness on the two brand colors — explicit cases

- **Focus on an amber button** (e.g., primary CTA `Write to me`): element fill `--primary` amber, focus ring inner halo in *current surface* (`--bg` or `--surface-1`), outer band in `--ink`. Halo-to-outer contrast ≥ 11:1.
- **Focus on a cyan chip** (e.g., a frontier-bridges chip): element fill `--surface-1` with cyan border, focus stack identical, outer band `--ink` at 11.4:1 against halo.
- **Focus on plain text link** (amber inline link on body): the link gets a text-decoration-thickness bump on focus *and* the two-band ring via a display-inline-block wrapper (or the ring degrades to a 2px underline + thin ink outline if the link wraps lines). Agent 5 owns the line-wrap detail; the contract is: focus must be visible on multi-line links (SC 2.4.11).

### 2.5 Skip link

Single `Skip to main content` link, first in tab order, visually hidden until focused, then absolute-positioned top-left with the full focus ring.

```html
<a class="skip-link" href="#main">Skip to main content</a>
<!-- FR: Aller au contenu principal — href preserved ("#main" works in both locales) -->
```

Targets `<main id="main" tabindex="-1">`. The `tabindex="-1"` on main is so keyboard focus lands there (not just scroll) when the skip link is activated, so the next Tab moves within main content, not back to nav.

---

## 3. Keyboard navigation flow

### 3.1 Global tab order — home page (`/`)

1. Skip link (visible on focus)
2. `LanguageToggle` (top-right header)
3. `PrimaryNav` root (see §3.2)
4. `HeroCanvas` — **not tab-focusable** (decorative; see §4)
5. Any links inside orientation paragraph
6. `ProjectCardGrid` — each card is focusable; Tab moves card-to-card; arrow keys do not override Tab (see §3.3)
7. Each `CTALink` in sequence
8. Cluster panels — paragraph links only; the `ClusterEllipseSigil` is decorative (`aria-hidden="true"`)
9. Frontier chips — each chip is a focusable `<button>` (toggles the one-liner tooltip)
10. Writing teaser links (if present)
11. Contact form fields / mailto link
12. Footer links

`ScrollProgress` component: **see §3.4 — it is not in the tab order.**

No tab traps anywhere. Escape closes anything that opens. All live-region announcements are polite, never assertive, except for form-submit failure.

### 3.2 Behavior-tree primary nav — keyboard model

**Decision: Tab through the leaves. Arrow keys do NOT drive the nav.**

Justification:

- The BT motif is *visual*. Under the hood the component is a list of four route links. A roving-tabindex arrow-key pattern would over-engineer a 4-leaf menu and make the nav behave differently from every other link list on the site — breaking user expectation (SC 3.2.3 consistent navigation).
- Arrow-key overrides are appropriate for menubars, toolbars, and tablists — not for a small set of site-wide routes. Applying the WAI-ARIA Authoring Practices `menubar` pattern here would require proper activation on Enter, keep focus trapping inside the bar, and add complexity the 4-leaf scope does not reward.
- Tab-through matches the footer nav (which is a plain list), giving keyboard users two consistent paths to the same destinations — Agent 4 §3.3's "linear fallback" requirement is already keyboard-consistent.

Contract:

- `<nav aria-label="Primary">` wrapping a `<ul>` of `<a>` elements, one per leaf.
- Current route's link has `aria-current="page"`.
- Tab order: root → home leaf → work leaf → writing leaf (if present) → about leaf. No submenus; there are none.
- On mobile drawer: the drawer is a `<dialog>` or a `<nav>` with `role="dialog"` **only if** it truly traps focus; otherwise it is a plain expanded nav. Agent 4 described a "drawer" — I recommend the non-trapping variant (a disclosure that reveals the list inline), so Escape is not needed to exit and focus management stays trivial. The trigger button has `aria-expanded` and `aria-controls`.

BT-tick animation on click is **visual only** — screen readers hear only the route change (the new page's `<h1>` on load). The tick is `aria-hidden="true"`.

### 3.3 Scroll-progress belief distribution — keyboard model

**Decision: Keyboard-actionable, but NOT in the default tab order.**

Rationale: the component is a secondary wayfinding affordance; forcing it into tab order on a long homepage would mean keyboard users traverse 7–10 bar-buttons before reaching content. Instead:

- The component is a `<nav aria-label="Sections">` rendered as a vertical list of anchor links, *visually* styled as a belief-distribution of bars. Semantically it is a table-of-contents.
- It is reachable via the skip link's second target: `Skip to section navigation` (an optional second skip link after "Skip to main content"). Acceptable alternative: expose it only when a user focuses any element near the right edge of the viewport (focus-within on a wrapper) — but that is clever, not robust. **Prefer two skip links.**
- Each bar is an `<a href="#<anchor>">` with the section label as its accessible name (e.g., "Orientation", "Perception"). The visual height of the bar (representing posterior probability over scroll position) is decorative, achieved with CSS transform / height animations on a `<span aria-hidden="true">` child.
- On activation, smooth-scroll respects `prefers-reduced-motion: reduce` — jumps instantly.
- No live region announces bar-height changes; the *document* is the source of truth.

### 3.4 Project cards — expand/collapse

Per Agent 4 §2.1 Beat 3, cards are part of a grid and link out to `/work/#<project>`. **Decision: cards are links, not expandable panels, on `/`.** The expansion Agent 4 implies ("Hover: component-level belief convergence — ellipse tightens") is a visual hover/focus state, not a disclosure. A card activation = navigation.

On `/work/`, the project sections are *not* collapsed by default — they are a long scroll with a sticky TOC. If Agent 5 decides to ship per-section disclosure on mobile:

- Each section header is a `<button aria-expanded aria-controls>`.
- Enter / Space toggles.
- **Escape does not collapse** — Escape is reserved for dialogs / overlays; a disclosure does not trap, so Escape has no job there. (If the mobile drawer implements focus trapping, Escape closes it.)

### 3.5 Language switcher — keyboard model

Single `<a>` element, pointing at the sibling-locale URL (see §6.5). Enter activates, Tab moves on. No menu, no dropdown — two languages do not need a menu. It is always the *opposite* of the current locale: if on EN, the link says `Français`; if on FR, it says `English`.

### 3.6 Frontier chips — keyboard model

Each chip is a `<button type="button" aria-expanded="false" aria-controls="chip-<id>-tip">`. Enter/Space opens the tooltip (a sibling `<div>` with the one-liner). Escape closes. Tab moves to the next chip without closing (desktop pattern) — but the live popover disappears on blur to avoid stale state on mobile touch.

### 3.7 Contact form — keyboard model

If Formspree: a standard `<form>` with labelled fields, native validation, submit button. See §4.6.
If mailto only: a single link styled as a button. Tab-focusable. Enter activates.

### 3.8 Keyboard guarantees — the contract

- Every interactive element reachable with Tab (forward) and Shift+Tab (reverse).
- No focus traps except `role="dialog"` when explicitly modal (currently: none shipped).
- Escape closes any popover / tooltip / modal.
- Enter activates links and buttons; Space also activates buttons (not links — links are Enter only, per HTML spec).
- `prefers-reduced-motion: reduce` → all smooth scrolls become instant jumps; all focus transitions become instant.
- Focus never moves without a user action (no programmatic `element.focus()` except after skip-link activation, post-form-submit, and post-route-change `<h1>` focus).

---

## 4. Screen-reader labels — component spec

### 4.1 Landmark structure (every page)

```html
<a class="skip-link" href="#main">Skip to main content</a>
<a class="skip-link" href="#section-nav">Skip to section navigation</a>  <!-- on / only -->

<header>
  <nav aria-label="Primary">...</nav>
  <a ... aria-label="Switch language to Français"> Français </a>
</header>

<main id="main" tabindex="-1">
  <!-- per-page content -->
</main>

<nav id="section-nav" aria-label="Sections">...</nav>  <!-- on / only -->

<footer>
  <nav aria-label="Footer">...</nav>
</footer>
```

One `<main>` per page. Every `<nav>` labelled. Single `<h1>` per page (Agent 4's `PageHeader`).

### 4.2 Primary nav (behavior-tree motif)

- **Semantic element**: `<nav aria-label="Primary"> > <ul> > <li> > <a>`.
- **aria-label / aria-labelledby**: nav has `aria-label="Primary"`; links are labelled by their text ("Home", "Work", "Writing", "About"). The visual BT tree decorations (nodes, edges, glows) are inside `aria-hidden="true"` wrappers.
- **Live region**: none.
- **What gets announced on interaction**: focus on link announces "Home, link" (or "current page, link" when on the active route, thanks to `aria-current="page"`). Activation navigates; the destination page's `<h1>` is announced on load if focus is moved to `<main>` post-navigation.

### 4.3 Cluster panels

- **Semantic element**: `<section aria-labelledby="cluster-<id>-title">` with an inner `<h2 id="cluster-<id>-title">`.
- **aria-label / aria-labelledby**: `aria-labelledby` pointing at the H2 (full-text, not abbreviated "§ 03 / PERCEPTION" — the eyebrow marker is `aria-hidden` and decorative; the H2 is the real heading).
- **Live region**: none.
- **What gets announced on interaction**: navigation via section-nav jumps to the section; screen reader announces the H2. Hover/focus on inline links behaves standardly.
- The `ClusterEllipseSigil` at 240px is `aria-hidden="true"` — it is decorative iconography. Its meaning is carried by the panel heading, not by the shape.

### 4.4 Hero — SLAM point-cloud canvas

- **Semantic element**: `<canvas role="img" aria-label="...">` OR `<canvas aria-hidden="true">` with the text content adjacent.
- **Decision**: `aria-hidden="true"` on the canvas. The hero's *meaning* is carried by the H1 ("I build machines that perceive, decide, and act — and I write down what they teach me.") and the eyebrow. The canvas is a mood, not information.
- **aria-label**: none (hidden).
- **Live region**: none.
- **What gets announced on interaction**: nothing from the canvas. The H1 and the belief-state loader (§4.6) are what screen readers hear.

### 4.5 Uncertainty ellipses — cluster markers

- Decorative wherever they appear as sigils (`aria-hidden="true"`).
- When an ellipse is used *inside* a project card as a cluster badge, its meaning (which cluster) is duplicated in a visually-hidden span: `<span class="sr-only">Cluster: Planning & Decision Under Uncertainty</span>`. The ellipse itself stays `aria-hidden`.
- On the cluster panels where the ellipse is the visual anchor, the H2 carries the cluster name — the ellipse is still `aria-hidden`.

### 4.6 Belief-state loader

- **Semantic element**: `<output role="status" aria-live="polite" aria-busy="true">`.
- **What gets announced on interaction**: a concise text update — "Loading" → "Ready" (and localized to "Chargement" → "Prêt"). The three-stage copy from Agent 2 micro-copy 17 ("Initializing sensors…" / "Converging belief state…" / "Ready.") is **visual only** on the *initial page load* (the hero wake) — three successive live-region announcements would be noisy; the screen reader instead hears a single "Loading" → "Ready" transition.
- The visual 8 bars are inside `aria-hidden="true"`.
- **Rationale for polite, not assertive**: loading states do not interrupt reading.

### 4.7 Scroll-progress belief distribution

- **Semantic element**: `<nav aria-label="Sections"> > <ol> > <li> > <a href="#<anchor>">`.
- The visual bar height is `aria-hidden="true"`.
- **Live region**: none. Scroll position is not announced.
- **What gets announced on interaction**: link text of the current item ("Perception"), plus `aria-current="location"` on the link matching the in-view section (updated as scroll progresses; the attribute change itself is not announced in most SR configurations, which is desired — constant announcements on scroll would be hostile).

### 4.8 Project cards

- **Semantic element**: `<article aria-labelledby="proj-<id>-title">` with `<h3>` inside.
- The whole card is wrapped in an `<a>` for full-card click area, OR the title is the link and the card is `<article>`. **Recommend the latter** — a link-wrapping-interactive-content pattern is fragile and confuses some SRs; a prominent title link + separate CTA is cleaner.
- Cluster badge ellipse: `aria-hidden`, with visually-hidden text (§4.5).
- Status pill ("shipped", "in production", "private", "open-source soon"): `<span>` with readable text, no ARIA.

### 4.9 Language toggle

- `<a href="/fr/..." hreflang="fr" lang="fr">Français</a>` (see §6).
- `aria-label`: same as link text when link text is the full language name; not needed.
- On untranslated pages: the link is replaced by a `<span>` with explanatory text "Not yet translated — EN only." The language toggle is *not* rendered as a disabled link (which would be ambiguous to SRs).

---

## 5. Reduced-motion audit

Agent 6 has not landed yet. The audit here is against **Agent 3's motion specification (§8, §4)** — Agent 6's deliverable will need re-audit when it drops.

Principles already encoded by Agent 3 (§8 rule 4): "prefers-reduced-motion is a first-class experience, not an afterthought." Good. Below is the per-motion checklist. For each, I verify that the static fallback is a **designed** experience, not degradation.

| Motion | Agent 3 fallback | First-class? | Notes |
|---|---|:---:|---|
| Hero point-cloud wake (Concept 1) | "pre-resolved static version — point cloud at final density, belief indicator already sharpened — and swap in a short sub-headline explaining the metaphor" | PASS | The short sub-headline *replaces* the motion narrative — that is first-class. Ensure the sub-headline ships in FR too. |
| SLAM background drift | "in reduced mode, the cloud is static and sparse, no streaming" | PASS | Static + sparse is a designed state. Requirement: sparseness is deterministic (seeded), same as the animated version. |
| Loop-closure accent blinks | — (not explicitly addressed) | **FAIL-RISK** | In reduced mode, the "locked-in" loop-closure points should still be rendered (in the accent color, static, at the same positions the animated version ends up at). Otherwise the narrative "a loop closed" is lost silently. Spec: reduced mode renders the *terminal* state of the loop closures, not a motionless initial state. |
| Belief-state loader bars | "static sharpened distribution with a 1px scanning caret beneath it" | PASS-WITH-QUESTION | The 1px caret is still animation if it scans. Recommend: a static bar shape without the caret *for the reduced-motion case*; replace the caret's progress information with a textual "Loading" (see §4.6). |
| Behavior-tree nav tick | "Reduced-motion fallback: static tick at destination with 120ms fade" | PASS-WITH-QUESTION | A 120ms fade is a motion. Users with vestibular triggers tolerate 0–150ms cross-fades; users who prefer *no* motion want zero. Recommend: allow the 120ms fade only under `prefers-reduced-motion: no-preference`, and switch to a hard swap (0ms) under `reduce`. The site's "designed reduced-motion state" is a hard swap accompanied by the new `aria-current="page"`. |
| Uncertainty-ellipse breathing | "hover, ellipses 'breathe' by ±3% over 1.6s" (Agent 3 §4.3) | **FAIL** | Agent 3 does not specify a reduced-motion fallback for the breath. Spec: under `reduce`, remove the breath entirely. The ellipse becomes a static shape. Hover/focus indication shifts to a 1px stroke-weight bump or a color shift to `--primary` (no motion). |
| 4D lattice grid wavefront on hover | "lines travel outward from the cursor like a wavefront" (Agent 3 §4.5) | **FAIL** | No reduced-motion fallback specified. Spec: under `reduce`, the grid does not animate on hover — the hover state intensifies from 4% to 8% alpha as a hard swap, with no wavefront. |
| Section-level "sensor handoff" transitions | — (Agent 6's lane, not yet landed) | **[AUDIT-PENDING]** | When Agent 6 lands: verify each handoff has a first-class static equivalent. Minimum spec: under `reduce`, the handoff collapses to a legible section separator (a labelled rule, a visible heading change, an eyebrow-marker cut) — not a silent jump. |
| Route-level "replan" transitions | — (Agent 6's lane) | **[AUDIT-PENDING]** | Minimum spec: under `reduce`, the route change is instant with focus moved to the new page's `<main>` `<h1>`, no cross-fade, no lattice expansion. |

### 5.1 Reduced-motion contract

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  /* Components override this globally-quenched state with their DESIGNED static fallback,
     which is their default class + a .rm-fallback variant (see Agent 6 implementation). */
}
```

The global quench is the safety net, not the strategy. The strategy is that every meaning-carrying motion has a dedicated `rm-fallback` class that renders the terminal / resolved state with a non-motion cue (label change, color change, size bump).

### 5.2 `prefers-reduced-motion` AND `prefers-reduced-transparency`

Astro can respect `prefers-reduced-transparency` at the SLAM layer:

- Under `reduce-transparency`, the SLAM background alpha jumps from 8–30% to 0% (layer hidden) and body text contrast is guaranteed against a solid surface only. This also helps users with cognitive load who find semi-transparent overlays disorienting.

---

## 6. Forms, errors, fieldsets

### 6.1 Decision — if the contact anchor uses a form

Agent 4 leaves the choice between Formspree-backed form and mailto open. Both specs below.

### 6.2 Formspree form spec

```html
<form action="https://formspree.io/f/<id>" method="POST" novalidate aria-labelledby="contact-title">
  <h2 id="contact-title">Write to me</h2>

  <div class="field">
    <label for="contact-name">Your name</label>
    <input id="contact-name" name="name" type="text" autocomplete="name" required
           aria-describedby="contact-name-help">
    <p id="contact-name-help" class="help">Optional, but I like to know who I'm writing back to.</p>
  </div>

  <div class="field">
    <label for="contact-email">Where I should reply</label>
    <input id="contact-email" name="email" type="email" autocomplete="email" required
           inputmode="email" aria-describedby="contact-email-error">
    <p id="contact-email-error" class="error" hidden role="alert"></p>
  </div>

  <div class="field">
    <label for="contact-message">What you're working on</label>
    <textarea id="contact-message" name="message" required rows="6"
              aria-describedby="contact-message-error"></textarea>
    <p id="contact-message-error" class="error" hidden role="alert"></p>
  </div>

  <button type="submit">Send it</button>

  <p class="form-status" role="status" aria-live="polite"></p>
</form>
```

**Rules:**

- `<label>` always explicit, `for` matching input `id`. No placeholder-as-label.
- `autocomplete` attributes per SC 1.3.5.
- `novalidate` so we control error UX instead of browsers' (native bubbles are inconsistent across SRs). Validation happens on submit and on blur-after-first-submit.
- Errors rendered in `<p role="alert" hidden>` — when validation fails, `hidden` is removed, `role="alert"` triggers a polite announcement, and the field itself gets `aria-invalid="true"`.
- Success and server-error states update the `<p class="form-status" role="status">` with Agent 2 micro-copy 12/13. `role="status"` = polite live region.
- No CAPTCHA that depends on sight alone. If spam becomes a problem: honeypot field (hidden to sighted and SR users alike via `aria-hidden="true"` + `tabindex="-1"` + visually hidden) OR Formspree's built-in anti-spam.
- No fieldsets — the form has three fields and no logical grouping; a `<fieldset>` around all three is over-structured and makes SRs read the same legend three times.

### 6.3 Mailto-only fallback

Single anchor:

```html
<a class="contact-cta" href="mailto:cyrilletabe@gmail.com?subject=From%20the%20site">
  Write to me — cyrilletabe@gmail.com
</a>
```

**Anchor text rule**: the visible text *contains the email address*. SRs announce the full address, which is correct for a contact action. Hiding the email behind "Write to me" only would force copy-paste via the visual context.

On FR: `Écrivez-moi — cyrilletabe@gmail.com`.

### 6.4 Validation messages — copy

From Agent 2 micro-copy 14–16:

- Empty email: "I need an address to reply to." / "J'ai besoin d'une adresse pour vous répondre."
- Malformed email: "That doesn't look like an email address." / "Ceci ne ressemble pas à une adresse courriel."
- Empty message: "Tell me something." / "Dites-moi quelque chose."

Each error message is tied to exactly one field via `aria-describedby`.

### 6.5 Language-switcher link (repeated from §4.9 for form chapter completeness)

```html
<!-- on EN page, linking to FR sibling -->
<a href="/fr/travaux/" hreflang="fr" lang="fr">Français</a>

<!-- on FR page, linking back to EN sibling -->
<a href="/work/" hreflang="en" lang="en">English</a>
```

`lang="fr"` on the EN page's FR link is important — SRs switch pronunciation for that anchor text. Without it, "Français" is read with English phonetics.

**Current-locale visual indicator**: the current-language label is *not rendered as a link* at all (there is nothing to toggle to itself). Only the other-language link is visible. Users always see "what they can switch to," never "what they're on" (the body language itself is the indicator of current locale — reinforced by `<html lang="...">`).

---

## 7. Image alt text rules

Rules:

1. No `image of`, no `picture of`, no `photo of`. The SR already says "graphic" or "image" — duplicating it is noise.
2. Functional alt: describe the *information* the image carries in the surrounding context, not the image literally.
3. Decorative images: `alt=""` (empty, not omitted). Decorative canvases: `aria-hidden="true"`.
4. Text embedded in images: the text MUST appear in the alt (SC 1.4.5 — avoid images of text in the first place).
5. For complex data visualizations, `alt` is a summary + `<figcaption>` / `aria-describedby` points to a longer description or data table (SC 1.1.1).

### 7.1 Example alt strings

Real-data assets per Agent 3 §5.1 and Agent 4 §2.1 Beat 4:

- **SLAM map of Odu sidewalk robot route**:
  `alt="SLAM occupancy grid from the Odu sidewalk robot — a Montréal sidewalk traced in gray, with higher-confidence walls in denser black and sparse points where the lidar returned noise."`
- **4D lattice planner output frame**:
  `alt="A 4D lattice planner output: candidate trajectories fanning out from the forklift, the chosen path highlighted in amber, obstacles in red."`
- **RobotClaw POMDP belief-state trace**:
  `alt="POMDP belief distribution over user intent, eight hypotheses on the x-axis. The distribution starts uniform and sharpens to a single peak labelled 'is writing code' after three observations."`
- **ROS 2 node graph for the drone stack**:
  `alt="ROS 2 node graph — 12 nodes including perception, planner, and flight-controller, connected by topic arrows routed through the MQTT bridge."`
- **Cyrille's portrait (About page)**:
  `alt="Cyrille Tabe, warm monochrome portrait against a matte wall."` — NOT `alt="A photograph of Cyrille Tabe"`. Keep it short; this image is identity, not information.
- **Behavior-tree screenshot from deployed robot**:
  `alt="Behavior tree from the Noovelia AGV stack — a root selector branching into three subtrees: charge, navigate, and reactive-avoid."`
- **OG image preview** (on the page itself, if shown): `alt="{page title}"` — the page title is already the most accurate description.
- **Decorative SLAM background canvas**: no alt; `aria-hidden="true"` on the canvas element.
- **Uncertainty-ellipse sigils**: no alt; `aria-hidden="true"`; the adjacent heading carries the meaning.
- **Project card hero asset**: alt must mention *what the asset is from* and *what it shows*, never just "Noovelia screenshot." Example: `alt="4D lattice planner running on the Noovelia forklift — top-down view of a warehouse aisle with the planned path in amber."`

### 7.2 French alt text rule

Every alt is localized. FR alt is not a machine translation of EN — it is written independently and lands through the same pro-translation pipeline Agent 2 flagged. Banned phrases in FR: "image de…", "photo de…". Same discipline as EN.

---

## 8. Motion vestibular concerns — the SLAM / point-cloud hero

This is the single largest vestibular trigger on the site. Spec the guard.

### 8.1 Triggers

Vestibular triggers in web content (per published WCAG research): large-area motion, parallax depth, rapid scale changes, high-frequency flashes, camera-like rotation. The hero Concept 1 involves streaming point-cloud particles and a belief-bar sharpening — both controlled but both qualify without guards.

### 8.2 Guard contract

- **Scale clamp**: no individual particle may grow by more than 1.2× its rest size during its animation. No viewport-scale zoom on the canvas. Canvas does not rotate.
- **Opacity ceiling**: individual particle alpha capped at 40%; layer alpha capped at 30% (hero) / 8% (reading pages), per Agent 3. Enforced at the shader level, not only at CSS.
- **Flash/frequency guard**: no more than 3 flashes per second in any region of the canvas (SC 2.3.1). Particle appearance fades in over ≥200ms; loop-closure accent bumps do not pulse more than once per particle.
- **Velocity clamp**: no particle travels faster than 50% of viewport width per second. In practice, inbound-streaming particles ease from edge to destination in ≥1.2s.
- **Area-of-motion clamp**: at any given 250ms window, no more than 60% of the canvas area is actively in motion. The remaining 40% is steady — gives the eye an anchor.
- **`prefers-reduced-motion: reduce` → canvas renders the terminal state only** (final density, loop-closures already in place, no drift). No JS animation loop runs. The canvas is, effectively, a static SVG.
- **`prefers-reduced-transparency: reduce` → canvas alpha clamped to 0** (layer hidden) AND an alternative ambient texture — the 4D lattice grid at its normal 4% alpha — becomes the sole background.
- **User pause control**: SC 2.2.2 compliance. A visually-present `Pause ambient motion` control (keyboard-focusable, labelled, in the footer if not in the header) that freezes the SLAM layer regardless of preference. State persists in `localStorage` across the session. This is a WCAG hard requirement for any continuous, auto-starting motion longer than 5 seconds — the SLAM drift qualifies.

### 8.3 Rendering cost

Not strictly an accessibility concern, but adjacent — a frame-starved canvas judders, which triggers the same vestibular response as fast motion. Budget:

- Target ≥45fps on a 2018-era mid-range laptop at the SLAM layer.
- If frame time exceeds 22ms for more than 2 consecutive seconds, the layer auto-degrades: halve particle count → halve again → switch to static.
- The degradation is silent to most users but logged once per session for telemetry (if Plausible is wired with a custom event).

### 8.4 Mobile

On viewports <768px the SLAM layer is downsampled (particle count halved) regardless of preferences, and the hero section's motion budget is tighter (no planner-hover wavefront from Agent 3 §4.5 on touch).

---

## 9. Internationalization — routing & translation responsibility

### 9.1 Routing decision — confirm Agent 4

Agent 4 §4 specifies `/` (EN default) and `/fr/` prefix. Phase-1 revisions §2 confirms. **I confirm — no changes.**

Exact verification against Agent 4 §4.2 route map:

- `/` ↔ `/fr/` — verified.
- `/work/` ↔ `/fr/travaux/` — verified. Slug translated ("travaux" is natural French).
- `/writing/` ↔ `/fr/ecrits/` — verified. "Écrits" normalized to ASCII `ecrits` in the URL to avoid percent-encoding. The visible label uses the accented form.
- `/writing/<slug>/` ↔ `/fr/ecrits/<slug-fr>/` — verified. Slugs translated per post, with the EN canonical used if no translation exists.
- `/about/` ↔ `/fr/a-propos/` — verified. Hyphen in slug. Native French.
- `/legal/` ↔ `/fr/mentions-legales/` — verified.
- Project anchors (`#robotclaw`, `#noovelia-lattice`, etc.) stay in English in FR URLs — verified. These are proper nouns / product names.
- Home-page beat anchors (`#perception`, `#planning`, `#human`, `#systems`) stay in English in FR URLs — Agent 4 acknowledged this as a trade-off for mid-scroll language-switch stability. **I accept.** Alternative (translating anchors) is more authentic in isolation but breaks the Agent 4 §4.5 fragment-preservation guarantee.

### 9.2 Language-switcher deep-link preservation — verified against route map

Agent 4 §4.5 says deep-link path is preserved. I verify:

- Every EN page's FR sibling is known at build time (Agent 4's static contract). Agent 5 must emit a `<link rel="alternate" hreflang="fr" href="{fr-sibling}">` AND render the switcher with that same href. Identical source of truth.
- Fragment carry-over: the switcher rewrites its `href` on `hashchange` so that `/fr/#planning` reflects the current hash. This is a ≤500 B client-side concern. **Fallback (JS off)**: the switcher loses the fragment; the user lands at the top of the translated page. Agent 4 accepted this; I second it — fragment loss is not a WCAG violation, and the no-JS fallback is consistent with the local-first ethos.
- Untranslated posts: Agent 4 §4.1 specifies the language switcher becomes a `NoTranslationNote` ("Not yet translated — read the EN version." / "Pas encore traduit — lisez la version anglaise."). The note is a `<p>`, not a disabled link — avoids SR ambiguity. **Verified.**

### 9.3 Per-page translation responsibility

Exactly what gets translated per page type:

| Item | Home `/` | `/work/` | `/writing/<slug>/` | `/about/` | `/404` | `/legal/` |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| `<title>` | YES | YES | YES | YES | YES | YES |
| `<meta name="description">` | YES | YES | YES | YES | YES | YES |
| `og:title`, `og:description` | YES | YES | YES | YES | YES | YES |
| `og:locale` | YES (en_US / fr_CA) | YES | YES | YES | YES | YES |
| `og:image` alt (on rendered `<img>`) | YES | YES | YES | YES | YES | YES |
| Body copy | YES | YES | YES (per-post) | YES | YES | YES |
| UI micro-copy (nav, buttons, form labels) | YES | YES | YES | YES | YES | YES |
| Image `alt` text | YES | YES | YES | YES | n/a | n/a |
| Dates | YES (formatted) | YES | YES | YES | n/a | YES |
| Numeric formats | YES | YES | YES | YES | n/a | n/a |
| Project names (RobotClaw, OpenClaw, etc.) | NO | NO | NO | NO | n/a | n/a |
| Technical terms (SLAM, MPC, POMDP, MCTS) | NO | NO | NO | NO | n/a | n/a |
| Code blocks, API identifiers | NO | NO | NO | n/a | n/a | n/a |
| Anchor slugs in-page (`#planning`) | NO | NO (project anchors are EN) | NO | NO | n/a | n/a |
| Route slugs | YES | YES (work→travaux) | YES (slug-fr) | YES | fixed | YES |
| CV PDF filename | EN / FR variants | | | `/cv-cyrille-tabe-{en\|fr}.pdf` | | |
| Structured data `inLanguage`, `@language` | YES | YES | YES | YES | n/a | YES |
| RSS feed contents | YES (EN feed) | | | | | |

**Rule for untranslated content**: if a post has no FR translation, the FR route (`/fr/ecrits/<slug>/`) returns the custom 404 with a "pas encore traduit" note. The EN post's `hreflang` tag for FR is **omitted**, per Agent 4 §4.4. **Verified; I second it.**

### 9.4 Locale-aware formatting

All formatting is build-time where static, runtime `Intl.*` where dynamic. The site has few dynamic numbers; most are static mono-type data. Rules:

- **Dates**:
  - EN format: `April 23, 2026` (long) / `2026-04-23` (mono-type metadata).
  - FR format: `23 avril 2026` / `2026-04-23`.
  - Implementation: `new Intl.DateTimeFormat(locale, { dateStyle: 'long' })`. For metadata rows in the mono typography, use ISO 8601 (`YYYY-MM-DD`) in both locales — ISO is locale-agnostic and matches the "instrument" aesthetic.
- **Numbers**:
  - EN: thousands separator `,`, decimal `.`. Example: `12,000`.
  - FR (fr-CA): thousands separator `thin NBSP` (U+202F) or ` `, decimal `,`. Example: `12 000,5`.
  - Implementation: `new Intl.NumberFormat(locale)`.
  - Mono-type data rows use the locale format by default; if a value is a canonical identifier (version number, commit SHA, port number), it stays unformatted.
- **Quotes**:
  - EN: `"smart curly"` or `'smart'`.
  - FR: `« guillemets »` with NBSP inside (`« … »`). Apostrophes: `l'autonomie` uses U+2019 (`’`).
  - Implementation: in MDX, authors can type `"..."` and `'...'`; a build-time rehype plugin swaps to the correct set per locale. Mono-type code blocks are **exempt** — quotes inside code stay as typed.
- **List separators**: EN uses comma-separated with optional Oxford comma (voice choice: keep it, matches "precise"). FR uses comma-separated without Oxford.
- **Currency**: the site does not display prices. If ever added: `Intl.NumberFormat(locale, { style: 'currency', currency: 'CAD' })`. EN: `CA$1,200` / FR: `1 200,00 $ CA`.
- **Language `lang` attribute**:
  - `<html lang="en">` on EN pages.
  - `<html lang="fr-CA">` on FR pages. `fr-CA` (Canadian French) over plain `fr`: the site is hosted in Montréal, the author's French is Québécois, and SR pronunciation hints improve with the subtag. The BCP-47 subtag changes narration on VoiceOver and NVDA.
  - Inline `lang` overrides on any cross-language quote or proper noun (e.g., an EN quote in an FR essay wraps in `<span lang="en">…</span>`).

### 9.5 RTL readiness — not in v1, documented for later

**Decision: no RTL support at launch.** Rationale:

- Primary and secondary languages are both LTR (EN, fr-CA). Adding RTL without a target language would be speculative.
- Agent 3's visual motifs (behavior-tree nav rooted left, ellipse sigils, 4D lattice) have strong directional composition; naive RTL mirror would break their meaning (a BT reads root-to-leaf; mirroring implies a different reading order).
- Retrofit is cheap if we build LTR correctly with logical properties.

**To add RTL later** (Arabic, Hebrew), do these in order:

1. **Logical-properties audit**: replace every `margin-left`, `margin-right`, `padding-left`, `padding-right`, `left`, `right`, `text-align: left|right` with their logical equivalents (`margin-inline-start`, `margin-inline-end`, `inset-inline-start`, `text-align: start|end`). Today's stylesheets should already use logical properties — Agent 5 makes this the default.
2. **`dir` attribute**: add `dir="rtl"` on `<html>` for RTL locales, or per-span for embedded RTL content. The static prerender emits both.
3. **Icon mirroring**: the external-link icon (arrow exiting a bounded frame, Agent 3 §7.2) must flip in RTL. The behavior-tree nav stays LTR — the BT is a domain-specific diagram with a fixed semantic direction, marked `dir="ltr"` explicitly regardless of page locale.
4. **Typography**: add a fallback RTL font stack (e.g., `IBM Plex Arabic` for Inter, `IBM Plex Mono Arabic` for mono).
5. **Route prefix**: `/ar/` with the same pattern as `/fr/`.
6. **Motion**: the SLAM drift and sensor handoffs are not directional in a way that conflicts with RTL. The 4D-lattice wavefront from cursor is cursor-local — stays correct. The replan transition may need direction reversal; re-audit when added.

### 9.6 Language-switcher a11y (pattern summary — referenced in §4.9 and §6.5)

```html
<a href="/fr/<sibling-slug>/" hreflang="fr" lang="fr" rel="alternate">Français</a>
```

- `hreflang` tells the browser the destination language.
- `lang` tells the SR to pronounce "Français" in French.
- `rel="alternate"` is a bonus for SEO and formally declares the link as a language alternate.
- The current locale is **not rendered as a self-link**; the site's language is the current locale indicator.
- Visually: the switcher is a plain link at top-right (mobile: in the drawer). No dropdown, no flag icon (Agent 2 micro-copy 6 pinned this — "flags are countries, not languages"). Label is the destination language's autonym ("Français" / "English"), not a localized exonym.

---

## 10. Interaction audit — Agent 5's spec

Agent 5's interaction specification **has not landed yet**. I cannot audit what is not written.

### 10.1 Audit template (to be applied on arrival)

When Agent 5 lands, every interaction gets this four-column check:

| Interaction | Keyboard path | SR announcement | Reduced-motion fallback | Touch path |
|---|---|---|---|---|

Minimum expectations (derived from Agent 4's component inventory):

- **Primary nav click**: Tab to link → Enter → navigation. SR: "{route} link" → "{new page h1}". RM: 0ms swap, no tick animation. Touch: tap on link with 44×44px min target.
- **Project card activation**: Tab to title link → Enter → navigation to `/work/#<project>`. SR: "{project name} link" → on target page, `<h1>` and section H2. RM: no hover-ellipse animation; instant hover color shift. Touch: tap on title; card-body not tappable (only the title link is the hit target).
- **Section-nav bar click (`ScrollProgress`)**: Tab via skip link → Enter → smooth scroll (or instant if reduced). SR: "{section name} link". RM: instant jump. Touch: bars are ≥24×48px vertical touch targets; tap scrolls.
- **Language switcher click**: Tab to link → Enter → navigate. SR: "Français link" (with `lang="fr"`). RM: instant. Touch: tap.
- **Frontier chip activation**: Tab to chip → Enter/Space → tooltip opens. SR: "{chip label}, collapsed button" → on activation, "expanded" + tooltip content. RM: instant open, no fade. Touch: tap to open, tap outside to close.
- **Form field interaction**: Tab to field → type → Tab out (blur validates after first submit) → error announced via `role="alert"`. SR: label → input → error on failure. RM: no animated error expand. Touch: standard.

### 10.2 Gaps I expect Agent 5 to have to close

- **"On hover" states must double as "on focus" states.** Any interaction where Agent 5 specifies hover without also specifying focus is incomplete.
- **Touch tap targets ≥24×24 (SC 2.5.8 in 2.2 AA, raised to 44×44 for primary actions — a defensive choice).**
- **Sensor-handoff transitions at section boundaries**: if Agent 5 ties a handoff to a scroll-triggered event, it must ALSO fire on anchor-link activation for keyboard users. "Motion only for scrollers" is an accessibility failure.

---

## 11. Red flags to escalate

In priority order (orchestrator to route):

1. **LIGHT-MODE BRAND COLOR FAILS AA.** `--primary` amber `#B86A14` at 4.2:1 and `--accent` cyan `#0F8F7A` at 3.8:1 on the light-mode `--bg`. Fix proposed (§1.2). This is the single largest issue and must be addressed before ship. **To Agent 3.**
2. **`--ink-muted` on `--surface-2` = 4.1:1 — AA fails.** Lint must prevent the combination. **To Agent 5.**
3. **`--danger` on `--surface-2` = 3.6:1 — AA fails.** Same. **To Agent 5.**
4. **Reduced-motion fallbacks missing for uncertainty-ellipse breath and lattice-grid wavefront.** Specified here (§5). **To Agent 6 when landing.**
5. **Loop-closure accent blinks** must render their *terminal* state under reduced motion, not disappear. **To Agent 6.**
6. **Pause control for the SLAM hero (SC 2.2.2).** Not mentioned by Agents 3, 4, or 5. Spec here (§8.2). **To Agent 5.**
7. **`<html lang="fr-CA">`**, not `fr`. Agent 4's structured-data example uses `"inLanguage": "en | fr"` — should be `fr-CA` for narration fidelity. **To Agent 4 / Agent 5.**
8. **Section-level and route-level transitions**: when Agent 6 / 10 land, re-audit reduced-motion and keyboard-triggered variants (§5).
9. **Interaction spec audit**: when Agent 5 lands, apply §10.1 template.

---

## 12. What is locked in this document

- Focus-ring token and CSS contract (§2).
- Tab order and keyboard model for every named component (§3).
- Semantic-HTML-first component map with ARIA only where justified (§4).
- Reduced-motion fallbacks for every Agent 3 motion; gaps listed for Agent 6 (§5).
- Form spec with label-error-status pattern (§6).
- Alt-text rules and exemplar strings for every real-data asset (§7).
- Vestibular guards for the SLAM hero: scale clamp 1.2×, opacity ceilings 30%/8%, flash ≤3/s, velocity ≤0.5 vw/s, area-of-motion ≤60% per 250ms, pause control mandatory (§8).
- Per-page translation responsibility matrix (§9.3), locale-formatting rules (§9.4), RTL deferred with retrofit checklist (§9.5).
- Language-switcher a11y (§6.5, §9.6).

---

*End of 08-accessibility-i18n.md — Agent 8, Senior Accessibility Designer.*
