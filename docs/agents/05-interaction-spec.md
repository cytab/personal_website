# 05 — Interaction Specification

**Author**: Agent 5 — Senior Interaction Designer
**Status**: Draft v1. Binding for Agents 6 (motion), 9 (engineering), 10 (transitions implementation).
**Anchored to**: subject-dossier.md · phase-1-revisions.md (supersedes where conflict) · 01-brand-brief.md · 02-narrative-architecture.md · 03-art-direction.md · 04-information-architecture.md.
**Scope boundary**: I specify *what* happens and *when*. Agent 6 owns *how* it moves (tokens, curves, exact timings beyond the handoff windows I name). Where I name a duration, it is a target, not a curve.

---

## 0. The interaction thesis

The site is a planner-under-uncertainty rendered as a surface. Three rules govern every interaction decision below:

1. **Every interaction must pay rent in the spine metaphor.** Replan (route), sensor handoff (section), belief convergence (component). If an interaction does not fit one of the three tiers, it is cut.
2. **Keyboard equivalents are designed, not retrofitted.** A keyboard user gets the same *meaning* a mouse user gets; the motion may collapse, the metaphor does not.
3. **Reduced motion gets a designed static twin.** Not a disabled animation — a *different interaction* that reads the same meaning through position, type, and layout.

Three tiers of transition, restated so everything below references them by name:

- **Tier R — Replan (route).** Old path dissolves into uncertainty; new path expands lattice-style. Rare, scarce, load-bearing. One per route pair, each with its own named metaphor.
- **Tier S — Sensor handoff (section).** A new modality comes online. Used between the 7 beats on `/` and between project sections on `/work/`. Each handoff named.
- **Tier C — Belief convergence (component).** Uncertainty ellipse tightens around the focused element. Used for hover, focus, expand.

---

## 1. Interaction inventory — page by page

Table columns: **Trigger** | **Feedback** | **State transitions** | **Failure states** | **Keyboard equivalent**.

Every component referenced exists in Agent 4's component inventory. If Agent 4 did not name it, it does not ship.

### 1.1 Global components (present on every page)

#### `PrimaryNav` (behavior-tree, top-left desktop; drawer mobile)

| | |
|---|---|
| **Trigger** | Hover over any leaf (desktop); focus via Tab (keyboard); tap leaf (touch); tap hamburger sigil to open drawer (mobile). |
| **Feedback** | Hover: leaf's label fades in (if hidden in compact mode), sibling leaves dim to 30%, the *path from root to this leaf* strokes to 100% — previewing what a tick would look like without committing. Focus-visible: identical to hover, plus a 2px `--primary` outer ring. Active (current route) leaf: filled amber glow at 60% alpha, 2px ring, label always visible. |
| **State transitions** | Idle → Hover-preview (stroked path, 120ms) → Click commits → **Tick propagates** root→leaf at 400ms `ease-out-quart` (ticks are discrete — each node lights sequentially, not a smooth line fill; this is a behavior-tree tick, not a progress bar) → tick reaches leaf → Tier R replan begins. Duration sum: 400ms tick + 800ms replan = 1.2s route handoff. |
| **Failure states** | (a) Target route is a conditional leaf that got pruned (e.g., `/writing/` with zero posts): the leaf is not rendered, so there is nothing to click. (b) Route fetch fails (offline / 404 on direct nav): tick completes, replan half-fires into a "lattice collapsed" state that resolves to `/404` with the same replan signature — the failure is narrated, not a blank screen. |
| **Keyboard equivalent** | Tab focuses the root, then each leaf in document order. Enter or Space commits. Arrow keys navigate siblings within the tree (Down: next leaf, Up: previous, Home: root, End: last leaf). Escape closes the mobile drawer. The tick animation runs identically under keyboard commit — keyboard does not get the reduced version. |

Reduced-motion twin: the hover-preview stroked path is rendered as a static bolder stroke on focus. The tick on commit becomes an instant re-paint of the active leaf (120ms amber fade, no propagation). The replan reduced-motion twin (§6) handles the route change.

#### `LanguageToggle` (EN/FR, top-right desktop; inside mobile drawer)

| | |
|---|---|
| **Trigger** | Click/tap the inactive locale label; Enter/Space when focused. |
| **Feedback** | On hover/focus: both labels become equally weighted for 120ms (a "belief flattens" micro-moment: before you choose, both hypotheses are live). The inactive label then resolves to `--primary` on commit. |
| **State transitions** | Idle (active locale = amber, inactive = `--ink-muted`) → Hover (both `--ink`, equal weight) → Click → Tier R replan (lattice expands into the sibling locale's URL, preserving fragment per Agent 4 §4.5). The sibling URL is baked at build time — no client-side routing negotiation. |
| **Failure states** | (a) Sibling route does not exist (untranslated post): toggle is replaced at build time by a `NoTranslationNote` — there is no failure path, because there is no button. (b) Fragment not present on sibling (anchor differs, which should not happen per Agent 4 §4.2): fall through to top of sibling page. (c) JS disabled: toggle still works as a static `<a href>`; fragment preservation degrades but navigation succeeds. |
| **Keyboard equivalent** | Tab to the toggle, Enter commits. The toggle is a real `<a>` element; no custom key handling needed beyond focus-visible styling. |

Reduced-motion twin: skip the "belief flattens" micro-moment. Click commits directly.

#### `FooterBlock`

Standard link list; no bespoke interactions. Each link is a real `<a>`; hover underlines via `--primary` at 40%; keyboard Tab walks in document order. The only noteworthy behavior: the "last deploy date" is a `<time datetime>` with a `title` attribute giving the full ISO timestamp on hover — a quiet quality signal, no animation.

---

### 1.2 `/` (home) interactions

#### `HeroCanvas` (Concept 1 — Sensors Initializing)

| | |
|---|---|
| **Trigger** | Page load fires the wake sequence (see §2, Moment 1). `mousemove` within the hero region triggers point-cloud attention. `scrollY > 40% viewport` begins Moment 2 handoff. |
| **Feedback** | Wake: points stream from edges over ~1.8s, densify at center, headline fades in, `BeliefStateLoader` sharpens underneath. Attention: points within an 180px cursor radius brighten by ~25% and their local normals reorient toward the cursor, as if a sensor rig is tracking. Scroll handoff: the cloud zooms out slightly (scale 0.98) and loses ~30% density as Moment 2 fades in above it. |
| **State transitions** | Boot → Idle-breathing (Moment 1 ambient) → Attention (cursor within radius) → Handoff-out (Moment 1→2 sensor handoff). |
| **Failure states** | (a) WebGL2 unavailable: canvas2D fallback renders a static low-density cloud with no attention behavior; headline and belief loader still animate. (b) Low-power detected (`navigator.hardwareConcurrency < 4` or `connection.saveData`): skip attention behavior, keep wake animation at reduced density. (c) `prefers-reduced-motion`: the static twin per §6. |
| **Keyboard equivalent** | The hero is non-interactive by keyboard (it is ambient, not an input). Tab skips it. Screen readers receive a single `aria-label` on the hero section: "Animated point cloud — sensors initializing around the headline." The headline itself is an `<h1>` and is what the keyboard user encounters first. |

#### `ScrollProgress` — belief distribution over the 7 beats

This is the **on-home secondary nav**, rendered as a live belief distribution across the seven beats (not a scrollbar — a posterior).

| | |
|---|---|
| **Trigger** | Scroll anywhere on `/`. Hover a bar. Click a bar. At Beat 4, bars subdivide into 4 sub-bars for the four clusters. |
| **Feedback** | Continuous: each scroll event re-normalises the distribution. The "tallest bar" = the beat currently at viewport center. Neighbor beats have non-zero probability mass proportional to how close they are to being in view — the distribution is a smoothed Gaussian-like kernel over scroll position, not a one-hot. Hover a bar: that bar's label tooltips in (`§ 01 / ORIENTATION`, etc.), bar "breathes" (±3% over 1.6s per Agent 3). Click: smooth-scroll to the beat's anchor with a mini sensor-handoff (Tier S) as the beat enters. At Beat 4 in view: the single "Depth" bar splits into 4 sub-bars, one per cluster, and the scroll-kernel now weights over cluster sub-panels. |
| **State transitions** | Idle (uniform distribution on page load, before any scroll data) → first scroll: distribution sharpens to the current beat → every subsequent scroll: redistributes → at Beat 4: subdivide → leaving Beat 4: rejoin into single bar. |
| **Failure states** | (a) `IntersectionObserver` unavailable (rare, but IE11-era browsers): fall back to a scroll-Y threshold table; distribution updates less smoothly but still tracks. (b) Beat is taller than a viewport (Depth beat, ~3.2 viewports): sub-bars within the subdivided state handle it. (c) JS disabled: component hides. A plain `<nav>` with anchor links to the 7 beats is rendered instead — full functionality, no belief metaphor. |
| **Keyboard equivalent** | The component is a `<nav aria-label="Page sections">` containing 7 (or 10 when subdivided) focusable `<a>` anchor links. Tab walks them in order; Enter smooth-scrolls. When a link is focused, its bar gets the same "breathing" treatment as hover. Screen-reader announcement: "Page sections, 7 total, currently at beat 3: Proof." |

Reduced-motion twin: the distribution renders as a fixed 7-step dot-row with the active beat filled amber, others outlined — a discrete posterior, not a continuous one. No breathing.

#### `ProjectCardGrid` on Beat 3 (proof strip)

Card interactions specified in §4 (Project cards interaction). The grid-level interactions:

| | |
|---|---|
| **Trigger** | Enter viewport. Cards are 5 across on desktop, horizontal scroll-snap carousel on mobile. |
| **Feedback** | On enter: Tier S sensor handoff into the grid — each card's `UncertaintyEllipseBadge` "tunes in" sequentially (80ms stagger), as if a scanner is acquiring targets. |
| **State transitions** | Hidden → Handoff-in (staggered ellipse acquisition) → Idle. |
| **Failure states** | Not applicable at grid level; see §4 for card-level failures. |
| **Keyboard equivalent** | Tab walks cards in document order. The stagger animation does not gate focus — focus order is available the instant the grid is rendered, regardless of where the stagger is. On mobile, the scroll-snap carousel is keyboard-navigable via Tab (each card) and arrow keys (once a card is focused, Left/Right scroll the carousel). |

#### `ClusterPanel` (4 panels, Beat 4)

Covered in §5 (Research clusters interaction). Panel-level entry: Tier S sensor handoff per panel — named in §2.

#### `FrontierBridgesGrid` (Beat 5)

| | |
|---|---|
| **Trigger** | Hover/focus a chip; click does nothing (no outbound links per Agent 4 §2.1-5). |
| **Feedback** | Idle chips: outlined, `--ink-muted`. Hover/focus: Tier C belief convergence — a faint uncertainty ellipse traces around the chip (inner 1σ tightens from 120% to 100% over 240ms), the chip's one-liner dek fades in below. |
| **State transitions** | Idle → Focused (ellipse tightens, dek visible) → Blur (ellipse relaxes, dek fades out 120ms). |
| **Failure states** | None — chips are non-interactive beyond hover/focus state. |
| **Keyboard equivalent** | Each chip is a `<button type="button">` with `aria-describedby` pointing to the dek. Tab to focus. The dek is revealed on focus identically to hover. On touch, tap toggles the dek open; tap elsewhere or the chip again closes it (no hover on touch). |

#### `ContactForm` / `MailtoButton` (Beat 7)

| | |
|---|---|
| **Trigger** | Field focus, field blur, typing, submit click/Enter. |
| **Feedback** | Each field on focus: Tier C — a thin uncertainty ellipse outlines the field, `--ink-muted` → `--primary` as the field gains confidence (validates). On valid input: ellipse tightens and locks amber. On invalid input (blur with bad value): ellipse distorts (increases eccentricity — "variance went up") and `--danger` accent appears in the validation text. Submit idle → sending: the belief-state loader appears in-place of the submit label. Sending → success: loader sharpens to a single amber bar, success copy swaps in. Sending → error: loader "flattens back to prior" — returns to near-uniform, then displays the error message and keeps the form submittable. |
| **State transitions** | Idle → Typing → Validating (on blur) → Submittable (all valid) → Submitting → Success ∥ Error. |
| **Failure states** | (a) Formspree endpoint down: error state shown, user is nudged to the mailto link. (b) Client-side validation catches malformed email / empty message per Agent 2 micro-copy 14–16. (c) JS disabled: the form is a plain `<form method="post" action="{formspree-endpoint}">` that works without JS; belief-state feedback is replaced by native browser validation. |
| **Keyboard equivalent** | Native form semantics. Tab order matches visual order. Enter submits from any field. The belief-state convergence on focus happens identically for focus-visible as for hover. |

Reduced-motion twin: the ellipse is rendered as a static 1px border that changes color on state — no tightening/distortion animation. Same meaning, no motion.

---

### 1.3 `/work/` interactions

#### `ProjectTableOfContents` (sticky sidebar desktop; collapsible summary mobile)

| | |
|---|---|
| **Trigger** | Scroll updates active item. Hover/focus an item. Click an item. |
| **Feedback** | Active item is amber with a 2px left bar (mono micro). Hover previews target via a subtle dimming of non-target rows. Click: smooth-scroll with a mini Tier S handoff as the target project section enters. |
| **State transitions** | Idle → Hover/focus-preview → Click → Smooth-scroll + Tier S in-target. |
| **Failure states** | (a) Target section does not exist (content-ops error): link is not rendered. (b) JS disabled: component renders as a plain `<nav>` with anchor links; smooth-scroll degrades to instant jump. |
| **Keyboard equivalent** | `<nav>` with `<a href="#anchor">`; Tab walks, Enter commits. Focus-visible identical to hover preview. The collapsed mobile summary is a `<details>` element — native keyboard semantics, no custom handling. |

#### `ProjectSection` (per project)

Interactions specified in §4 (Project cards interaction — expanded state).

#### Section-to-section transitions on `/work/`

Between the 5 project sections, **Tier S handoffs** fire but with a different modality sequence than on `/` — per Agent 4 these are distinct artifacts, not narrative beats. Named in §2.4.

---

### 1.4 `/writing/` interactions

#### `WritingFilter` (tag chips)

| | |
|---|---|
| **Trigger** | Click a tag chip. Chip is a toggle; clicking again removes the filter. |
| **Feedback** | Active tags glow amber. Filtering is URL-fragment-driven (e.g., `/writing/#tag=belief-state`). The list re-renders with a Tier C micro-convergence: unfiltered-out entries fade out (160ms); remaining entries relax their ellipses (a visual "these are still candidates"). |
| **State transitions** | Idle → Tag active → Compounding (multiple tags = AND filter) → Reset. |
| **Failure states** | (a) No entries match: render Agent 2 micro-copy 21 empty state. (b) JS disabled: chips render as `<a href="#tag=…">` static links; the list does not filter client-side. Instead, the page reloads with the hash and a build-time–generated static variant applies (acceptable, but a JS-only filter path is also acceptable if the static variant doubles the build artifact). **Recommendation**: JS filter only, with a noscript message indicating filters require JS — the writing list itself is fully navigable without them. |
| **Keyboard equivalent** | Each chip is a `<button aria-pressed="true|false">`. Tab to focus, Space toggles. Screen-reader announces "Filter: belief-state, pressed" / "not pressed." |

#### `WritingList` entries

| | |
|---|---|
| **Trigger** | Hover/focus a row. Click anywhere in the row. |
| **Feedback** | The entire row is the hit target (not just the title — less vanity, more click area). Hover/focus: row gets a left-side amber accent line (2px) and a faint ellipse tightens around the title. |
| **State transitions** | Idle → Focused → Click → Tier R replan to `/writing/<slug>/`. |
| **Failure states** | Dead post slug: should never happen (build fails if a list entry points to a missing post). Guarded at build time by Agent 9. |
| **Keyboard equivalent** | Row is wrapped in a single `<a>` around the title; the row itself uses `role="group"` with a `redundant` visual treatment. Tab to title, Enter commits. Screen readers encounter the title as the link text, date and dek as adjacent content. |

#### `ReadingProgress` on `/writing/<slug>/`

Thin top bar that fills left-to-right with scroll depth, mono micro percentage to the right. Non-interactive. No keyboard role — it is ambient information. Respects reduced motion by using `will-change` only on continuous scroll; on reduced motion, it snaps to quartile checkpoints (25/50/75/100) instead of continuous.

---

### 1.5 `/about/` interactions

#### `CVDownloadBlock`

| | |
|---|---|
| **Trigger** | Click/tap one of the two download buttons (EN PDF / FR PDF). |
| **Feedback** | On hover/focus: Tier C — the "exiting a bounded frame" icon (Agent 3 §7.2) animates the arrow exiting the frame by 2px and back, looping once as a 320ms one-shot. The button surface ticks up to `--surface-2`. On click: standard browser download. A `BeliefStateLoader` appears inline for 200ms (the "preparing" state) even though the file is static — this is a deliberate pause to communicate that a file is arriving, not a page transition. Then the loader fades. |
| **State transitions** | Idle → Hover/focus → Click → Loader (200ms) → Download begins. |
| **Failure states** | (a) PDF missing (build broke): the button is a plain `<a>` so the browser returns 404 for the file — inelegant but not site-breaking. Build-time guard: Agent 9 must fail the build if either CV PDF is missing. (b) On slow connections: the 200ms loader window is too short to feel meaningful; acceptable trade-off — the download is standard browser behavior, not ours to orchestrate. |
| **Keyboard equivalent** | `<a href="/cv-cyrille-tabe-en.pdf" download>` and sibling for FR. Tab, Enter. Icon animation replaced by static filled variant on focus (the arrow is *outside* the frame statically on focus-visible). Same meaning: "the file leaves the site and comes to you." |

Reduced-motion twin: the icon's arrow is statically drawn outside the frame on hover/focus (instead of animating out). The 200ms loader is replaced by a static amber checkmark that appears and fades over 120ms.

#### `TimelineBlock`

| | |
|---|---|
| **Trigger** | Enter viewport. Hover/focus a row. |
| **Feedback** | On enter: rows fade in top-to-bottom with 60ms stagger (Tier S into the Timeline — "proprioception coming online"). On hover/focus: row date column locks amber, the row dek text gets a faint underline in `--ink`. |
| **State transitions** | Hidden → Entered → Idle → Focused → Blur. |
| **Failure states** | None. |
| **Keyboard equivalent** | Rows are not interactive — they are information. Tab skips them. Screen-reader: each row is a `<li>` inside a `<ol reversed>` (most recent first) inside a `<section aria-label="Timeline">`. |

#### `NowBlock` (optional)

Non-interactive prose block. No keyboard affordance beyond Tab skipping through any links in the copy.

---

### 1.6 `/404` interactions

| | |
|---|---|
| **Trigger** | Page load. |
| **Feedback** | The `HeroCanvas`'s low-density static variant renders. The 404 copy types in character by character (160ms total — it's a short line). One animated element: a single "ghost" point in the cloud *fails to converge* — it's stuck in a low-confidence jitter state. This is the 404 metaphor: the map had a point for this URL, but the belief never tightened. |
| **State transitions** | Boot → Ghost-point-jittering (persistent until navigation). |
| **Failure states** | 404 cannot itself 404. Static assets only. |
| **Keyboard equivalent** | The "Back to the top" link per Agent 2 micro-copy 23 is a real `<a>` at the top of the focus order. |

Reduced-motion twin: no typing animation, no ghost jitter. The copy renders statically, and a static 1σ ellipse is drawn around the ghost point to represent the unconverged belief.

---

## 2. Scroll choreography — the site's spine

Six named moments on `/`, each triggered by a specific observable condition, each a Tier S sensor handoff between Agent 2's beats. **The sensor-handoff metaphor is the core of this section.**

Every handoff below follows a shared structural rule: *a previous modality fades as the next comes online.* The modality is not arbitrary; it is chosen to match the content shift.

### Moment 1 — Vision wakes ↓ Orientation enters

**Beats**: Beat 1 (Hero) → Beat 2 (Orientation).
**Trigger**: `scrollY` crosses 40% of the first viewport height, AND Beat 2's top edge has entered the viewport (`IntersectionObserver` threshold 0.01). Both must be true — protects against premature fire on fast scroll overshoot.
**Modality entering**: *Vision → Language.* The hero's point-cloud (visual perception) recedes; the orientation paragraph (linguistic self-description) comes online.
**What happens**: Hero cloud scale 1 → 0.98 and alpha 30% → 8% over 400ms. Orientation eyebrow marker (`§ 01 / ORIENTATION`) types in over 240ms. Orientation paragraph fades in bottom-to-top with a 2-line cascade (Inter `--t-body`). The `ScrollProgress` belief distribution redistributes from "all mass on Beat 1" to "split 40/60 Beat 1/Beat 2."
**Named metaphor**: **"Vision yields the floor to language."**
**Reduced-motion twin**: Hero cloud fades to its reading-page alpha (8%) in one step. Orientation eyebrow and paragraph appear statically. `ScrollProgress` distribution updates in a single snap.

### Moment 2 — Proof strip acquires targets

**Beats**: Beat 2 (Orientation) → Beat 3 (Proof).
**Trigger**: Beat 3 top edge enters the viewport, threshold 0.01.
**Modality entering**: *Language → Inventory.* Prose ends; a scan begins.
**What happens**: The `ProjectCardGrid`'s 5 cards enter with a 5-step stagger (80ms between cards), each card's `UncertaintyEllipseBadge` "tuning in" — drawn from eccentricity 0.9 (nearly flat line) to its target eccentricity over 320ms, as if a sensor is locking on. The card body text fades in *after* its ellipse settles, to reinforce "the scanner confirmed the target, then the metadata loaded."
**Named metaphor**: **"Scanner locks on targets."**
**Reduced-motion twin**: All cards render at their final eccentricity immediately, no stagger. The "locked" metaphor is carried by the ellipse shape alone, not by its acquisition animation.

### Moment 3 — Depth opens: first panel (Perception)

**Beats**: Beat 3 (Proof) → Beat 4, sub-panel 1 (Perception).
**Trigger**: Perception panel's `#perception` anchor enters viewport.
**Modality entering**: *Inventory → Spatial vision (the canonical "perception modality").*
**What happens**: The site's SLAM-map background (Agent 3 §4.1) briefly intensifies — alpha 15% → 28% over 320ms — and a subset of points *loop-closes* (accent cyan flash, 180ms). The Perception cluster's 240px ellipse sigil fades in *inside* a widening occupancy-grid crop of the SLAM background. The paragraph lands beside it.
**Named metaphor**: **"Loop closure — space becomes a map."**
**Reduced-motion twin**: SLAM alpha holds at 15% statically. Sigil fades in with no crop animation. No loop-closure flash.

### Moment 4 — Depth continues: Planning panel

**Beats**: Perception sub-panel → Planning sub-panel.
**Trigger**: Planning panel's `#planning` anchor enters viewport.
**Modality entering**: *Spatial vision → Planner graph.*
**What happens**: The 4D lattice grid (Agent 3 §4.5) that is already present at 4% alpha intensifies to 10% for 480ms, and a single lattice "expansion wavefront" radiates from the Planning sigil outward (a subtle 240ms ripple). The sigil's eccentric ellipse is drawn *around* the wavefront origin, honestly saying "here is the variance over this plan." The paragraph lands.
**Named metaphor**: **"Map handed to planner — the search begins."**
**Reduced-motion twin**: Lattice alpha holds at its base 4%. No wavefront. The sigil's eccentric ellipse renders statically (it already encodes variance by shape).

### Moment 5 — Depth deepens: Human panel

**Beats**: Planning sub-panel → Human panel.
**Trigger**: Human panel's `#human` anchor enters viewport.
**Modality entering**: *Planner graph → Intent model.*
**What happens**: The Human sigil's 30°-tilted ellipse fades in *rotating* from 0° to 30° over 480ms (the rotation itself is the signal: "a model of a mind requires orientation"). A small auxiliary element — a 3-bar belief distribution — renders beside the paragraph, representing the POMDP over user intent that RobotClaw maintains. Bars start near-uniform and sharpen to a single peak over 640ms.
**Named metaphor**: **"Intent model online — the planner now asks who."**
**Reduced-motion twin**: Sigil renders at its final 30° tilt instantly. Belief bars render at their final sharpened state, no animation.

### Moment 6 — Depth concludes: Systems panel → Frontier

**Beats**: Human panel → Systems panel → Frontier (Beat 5).
**Trigger**: Two fires, serial.
- (6a) Systems panel's `#systems` anchor enters viewport: Systems sigil (compact, on-axis ellipse) snaps in decisively — 160ms, no stagger — matching its "systems are predictable" character. The SLAM background briefly dims to 6% as "messages leave the device and enter the bus."
- (6b) Frontier beat's top edge enters: the four cluster ellipses from Beat 4 shrink to 12px and arrange themselves as a row at the top of the Frontier beat, visually compressing "what has been covered." The `FrontierBridgesGrid` of 8–10 chips fades in below with 40ms stagger.
**Modality entering**:
- 6a: *Intent model → Distributed systems.*
- 6b: *Distributed systems → Research frontier.*
**Named metaphors**:
- 6a: **"Beliefs pushed to the bus."**
- 6b: **"From what I ship to what I'm pulling in."**
**Reduced-motion twin**: No ellipse shrink-and-arrange for 6b (the compression is the metaphor — render it as a static horizontal row of 12px ellipses at the top of Frontier). 6a renders the sigil instantly.

### Exit — Invitation arrival (the seventh beat; not numbered as a separate moment)

Beat 6 (Signal) → Beat 7 (Invitation) does **not** get a named sensor handoff. It is a quiet arrival: the closing paragraph fades in with no motif. This is deliberate — the arc has been doing a lot of sensor work, and the invitation earns its weight by being *un-theatrical.* Agent 6 should treat this as a plain 240ms fade. The only motion: the primary CTA button has a one-time Tier C belief convergence on first view (uncertainty ellipse tightens around the button over 480ms, sharpening to a 1px amber border).

### Section-to-section handoffs on `/work/` (not numbered Moments; same Tier S pattern)

Five project sections, four transitions. Each transition is short (240ms) because the page is long. Named metaphors, in order:

- `#robotclaw` → `#openclaw`: **"Frontend → backend: the assistant hands its actions off."**
- `#openclaw` → `#drone-stack`: **"From desk to flight — edge compute leaves the building."**
- `#drone-stack` → `#noovelia-lattice`: **"Flight plan → warehouse plan."**
- `#noovelia-lattice` → `#odu-slam`: **"Indoor map → outdoor map."**

Visually, each is a thin horizontal divider line that "sweeps" across the viewport (left-to-right, 240ms, `ease-out-quart`), carrying a micro-label with the metaphor name in mono micro (11px, `--ink-muted`). The metaphor names are *not* hidden; a visitor who watches closely reads the site's nervous system.

---

## 3. Cursor system

**Decision: the cursor changes, but only in three specific contexts. Everywhere else, it is the OS default.**

### 3.1 Why three, not zero

A "no cursor change ever" stance would be correct for a generic site but wrong here: two Agent 3 motifs (SLAM background, 4D lattice grid) explicitly respond to the cursor (points reorient, the grid ripples on lattice-tagged content). Those behaviors are *already* cursor-meaningful; a custom cursor that acknowledges them is not vanity — it is completing the interaction. But a site-wide custom cursor is vanity, and vanity is out.

### 3.2 Why three, not five

Rejected: cursor changes on code blocks ("mono crosshair") and on language toggle ("FR/EN reticle"). Both were tempting. Both failed the rent-paying test — the code block has syntax highlighting and a copy button that already carry the meaning; the language toggle is a discrete click target that does not need a custom cursor to be understood.

### 3.3 The three contexts

#### Context A — On the sensor-responsive SLAM background (hero + cluster panels)

- **Cursor form**: a 1px outlined crosshair, 16×16, `--ink` at 40% alpha, with a small `--accent` dot at the center.
- **Meaning**: "You are perceived." The cursor is *also* a sensor target from the site's point of view — a direct extension of the point-cloud reorientation behavior. On the hero, where points lean toward the cursor, this crosshair says "what you are looking at is also looking back at you."
- **When active**: inside the hero (`HeroCanvas` region), inside any `ClusterPanel` where the SLAM background is at ≥15% alpha.
- **When inactive**: on text blocks, cards, form fields, chips — anywhere the cursor is interacting with a discrete target. Those get the OS default.

#### Context B — On primary-nav BT leaves

- **Cursor form**: a small triangular "pointer" glyph (3 vertices, stroke-only), echoing a behavior-tree action-node icon. 14×14, `--primary` at 80%.
- **Meaning**: "This is a leaf of the tree; clicking commits a plan." The cursor preview *is* a miniature BT tick — it matches the shape of the node you are about to activate.
- **When active**: hovering over any `PrimaryNav` leaf, desktop only.
- **When inactive**: everywhere else in the nav (root, intermediate nodes — though we only have one level so this is moot).

#### Context C — On lattice-tagged content (planning-related cards and sections)

- **Cursor form**: the OS default, but the site's lattice-grid ripple (Agent 3 §4.5) is triggered by the cursor position — a wavefront radiates from the cursor at 240ms intervals as long as it is within a lattice-tagged region.
- **Meaning**: "This region is the planner thinking." The cursor itself is unchanged; the *environment* responds. This is the honest cursor interaction — it pays rent by triggering an existing motif, not by replacing the pointer with a gimmick.
- **When active**: on `/work/#noovelia-lattice`, on the Planning cluster panel, on any writing post tagged `planning` or `lattice`.
- **When inactive**: everywhere else.

### 3.4 Cursor rules

- **Never hide the OS cursor entirely.** A hidden cursor is a usability failure and an accessibility violation.
- **Custom cursors are purely visual.** Their hit-testing and focus behavior are identical to the default — no trickery with click offsets or expanded hit areas.
- **Touch devices**: none of this applies. No hover, no cursor. See §8.
- **Reduced motion**: Context A and B custom cursors still render (they are not motion, they are shape). Context C's lattice ripple does not fire under `prefers-reduced-motion`; the cursor stays default and the region stays static.
- **Coarse pointer + stylus**: `(pointer: coarse)` and `(any-hover: none)` media queries disable all three custom cursors. Stylus users get OS default.

### 3.5 Engineering note

Implemented as CSS `cursor:` with a custom SVG (not a React-layer custom cursor element). This avoids jank, respects accessibility tools, and fails gracefully to default when the SVG doesn't load. Agent 6 owns the SVG assets.

---

## 4. Project cards interaction

The project cards appear twice: (a) as `ProjectCardGrid` on `/` Beat 3 (the proof strip, ≤40 words per card per Agent 2), and (b) as `ProjectSection` on `/work/` (the expanded 150–300-word version with hero asset and stack chips per Agent 4 §2.2).

These are **different interactions** for different jobs.

### 4.1 Home proof-strip cards (Beat 3) — compact cards

#### States

| State | Visual | Content |
|---|---|---|
| **Idle** | Outlined card, `--surface-1`, ellipse badge at 48px, status pill in mono micro. | Title, 3-line body (what/taught/next), ellipse badge, status. |
| **Hover** | Tier C belief convergence: ellipse tightens from breathing (±3%) to locked shape; card surface lifts to `--surface-2`; 1px amber accent appears at the left edge. | Unchanged content, no expansion, no reveal. |
| **Focus-visible** | Identical to hover, plus a 2px `--primary` focus ring on the card. | |
| **Active (pressed)** | Card surface briefly dims to `--surface-1` for 120ms; left edge accent thickens to 2px. | |
| **After commit (Tier R fires)** | Card becomes the "origin point" of the lattice-expand replan into `/work/#<project-slug>`. | |

#### Reveal behavior

The home cards **do not expand in place.** They are 40-word summaries and that is the job. Clicking a card is a Tier R replan route transition to `/work/#<project>`. This keeps the home narrative tight and makes `/work/` meaningful — it is the *expanded* experience, not a duplicate.

**Reconciliation with Agent 4:** Agent 4 specified `/work/` as a single page with five anchored sections (not per-project routes). The home cards anchor-link into those sections. The replan animation treats the anchor as a valid route target — `/` → `/work/#robotclaw` fires the replan, then after the route transition lands, a Tier S handoff focuses the `#robotclaw` section. This is the one case where Tier R and Tier S fire in serial on a single click.

#### Failure states

- (a) Card's target project has no content on `/work/` (content-ops error): build fails. Never shipped.
- (b) Card's repo link is absent: the link chip is not rendered. Never a dead link.

#### Keyboard

Card is wrapped in a single `<a href="/work/#robotclaw">`. Tab focuses the card, Enter commits. The `<a>` wraps the entire card area (title + body + badge + status) so the click target is unambiguous; the status pill and repo link (if present) are separate focusable `<a>`s *inside* the card, which Tab reaches in sequence after the main card link. Screen-reader order: title → status → 3-line body → "Open RobotClaw page" (aria-label on the wrapping `<a>`).

### 4.2 `/work/` expanded project sections

#### States

| State | Visual | Content |
|---|---|---|
| **Idle** | Full-width section, `--bg`, hero data asset prominent, stack chips below header, body in `--t-body`. | Full 150–300-word body per Agent 4. |
| **Hover on header** | Tier C on the cluster ellipse badge (tightens); no other section changes. | |
| **Hero asset interaction** | Per-asset; a SLAM viewer may be scroll-zoomable, a planner frame may be click-to-animate. Specific interactions defined per-asset when the asset is commissioned (Agent 4 §7 asset request). | |

#### Reveal behavior

Sections are **always fully rendered** — no expand-in-place, no accordions. The page is a long scroll of full cards; the `ProjectTableOfContents` handles discoverability. This matches Agent 4's "one page, five deep cards" decision.

The one exception: if a project has a *code sample* that is longer than ~25 lines, it renders in a `<details>` block ("Show full source — 120 lines"). Expand is a Tier C convergence around the newly-revealed code.

#### Failure states

- (a) Hero asset missing: section renders with a placeholder block noting "asset pending" (Agent 4 §7 blocker) — visible to Cyrille, not to public visitors (guarded by a build flag). Production build fails instead.
- (b) Stack chip links out to an external tool (e.g., ROS 2) and the page 404s: chip is rendered, link behavior is standard; a dead external link is not ours to fix.

#### Keyboard

Each section has a stable `id` anchor. Tab walks through the stack chips, repo links, and any `<details>` expansions in document order. The cluster ellipse badge is decorative (alt="" on the SVG).

### 4.3 Cross-surface rule — cards are expand-by-route, not expand-in-place

Some portfolio sites let cards expand into full-page overlays in place. I am rejecting that pattern here because:

- It breaks the replan metaphor. An in-place expansion is a morph, not a plan change. It would water down Tier R to nothing.
- It violates Agent 4's decision that `/work/` is the expanded experience. Two expansion patterns (in-place on `/`, route-change to `/work/`) for the same content would confuse without adding capability.
- It creates scroll-position debt: closing the overlay drops the user back onto the home scroll at a position they may not have intended.

The one-route model — home cards → `/work/#section` — is load-bearing.

### 4.4 Touch pattern for project cards

No hover on touch. The "hover Tier C convergence" is replaced by a *press-and-hold* (>200ms) preview: ellipse tightens while held, releases on lift. A normal tap commits the route change immediately. This gives touch users the same "belief" affordance without requiring hover. See §8.

---

## 5. Research clusters interaction

Four clusters, alive and navigable. I considered three patterns and am picking one.

### 5.1 Three patterns considered

#### Pattern α — Radial graph in a dedicated `/research/` route

Four clusters radiate from a center labeled "uncertainty." Hover/click reveals the cluster panel in-place. Elegant, visual, and memorable.
**Rejected because**: Agent 4 explicitly forbade cluster routes. The radial graph would have to live on `/`, and it would compete with the scroll narrative for dominance in Beat 4.

#### Pattern β — Behavior-tree expansion: clusters as a secondary BT inside `/#planning`

Four clusters as four leaves of a sub-tree, the primary nav's BT motif extended. Technically consistent with the site's language.
**Rejected because**: it double-encodes the BT metaphor. The primary nav is already a BT; a second BT for clusters reads as "this site loves behavior trees" rather than "this site is *about* planning." Meta overload.

#### Pattern γ — Scroll-linked sequence with live distribution

The four clusters are a subsection of the scroll (Agent 4 Beat 4), but the `ScrollProgress` belief distribution *subdivides* into four sub-bars at Beat 4, and each cluster's entry fires its own Tier S sensor handoff (§2 Moments 3–6). A mini inline "distribution over clusters" widget appears at the top of Beat 4 showing which cluster is currently-in-view weighted against the others.

### 5.2 Decision — **Pattern γ, scroll-linked sequence.**

#### Justification against the spine

The planning-under-uncertainty spine says: *what should I do when I'm not sure?* The four clusters are four kinds of uncertainty Cyrille reasons about — spatial, decisional, intentional, systemic. Rendering them as a scroll-linked sequence with a live distribution *performs* that reasoning:

- The reader's attention is the belief state.
- The `ScrollProgress` subdivision is the posterior updating in real time.
- Each cluster entering (Tier S handoff) is an observation.
- The cluster-by-cluster narrative is the planner's traversal — sequential, honest about uncertainty.

Patterns α and β render clusters as *objects* (spokes or leaves). Pattern γ renders them as *states of attention*. Only the latter matches the spine.

### 5.3 The interaction contract

Beat 4 sits between Beat 3 (Proof) and Beat 5 (Frontier). Inside Beat 4:

1. **Sub-nav (inside the existing `ScrollProgress`)**: when the viewport intersects Beat 4, the "Depth" bar in the `ScrollProgress` splits into 4 sub-bars labeled Perception / Planning / Human / Systems. The sub-bar distribution is the belief over *which cluster is currently under the fovea of the reader*.

2. **Sequential entry**: each cluster panel fires its Tier S handoff as the reader reaches it — Moment 3 (Perception), Moment 4 (Planning), Moment 5 (Human), Moment 6 (Systems).

3. **Sigil animation**: each cluster's 240px ellipse sigil animates *uniquely* per §2, honoring Agent 3's per-cluster character (tight circular for Perception, eccentric for Planning, tilted for Human, on-axis compact for Systems).

4. **Data asset**: each panel carries one real data asset (SLAM / planner frame / belief trace / ROS graph per Agent 4 §7). The asset is interactive *only* if it is the planner frame (click to step through one plan iteration — this is the one place the spine gets a literal, operable demonstration).

5. **Cross-linking to `/work/`**: each cluster panel has a small "Related systems:" row at its foot with links to the relevant `/work/#<project>` anchors. Hover on a link: Tier C convergence around the target project's name; click: Tier R replan to `/work/#<project>` with the sub-bar distribution "freezing" on that cluster (the belief is locked before the route changes — visual continuity into the new page).

6. **Return**: from `/work/#noovelia-lattice` back to `/#planning` (via the "Related: Planning" link on the project section) fires a Tier R replan that lands the reader directly at the Planning sub-panel with the sub-bar distribution peaked on Planning. The URL fragment does the lifting; the replan handles the meaning.

### 5.4 Keyboard equivalent

- Tab through Beat 4 walks: sub-bar nav chip 1 → chip 2 → chip 3 → chip 4 → cluster 1 content → cluster 2 content → ... → cross-links. Each sub-bar is a focusable `<a href="#perception">` etc.
- Focus-visible on a sub-bar replicates the hover-preview of the belief distribution shifting to that cluster (but does not commit until Enter).
- Enter from a focused sub-bar smooth-scrolls to that cluster's panel with the Tier S handoff firing normally.
- Screen-reader announcement on Beat 4 entry: "Four research clusters — Perception, Planning, Human Understanding, Systems. Currently: Perception."

### 5.5 Reduced-motion twin

The sub-bar distribution is a fixed 4-step dot-row with the active cluster filled amber, others outlined (same design language as the 7-beat reduced-motion twin, §1.2). Sigils and data assets render statically. Cross-links behave identically under reduced motion (the replan has its own reduced-motion twin, §6).

---

## 6. Route-replan transitions — metaphors per pair

Every Tier R route transition gets a named metaphor. Agent 6 builds the motion; this section names what the motion means.

Per Agent 4's route map, these are the real route pairs:

1. `/` ↔ `/work/`
2. `/` ↔ `/writing/` (when it exists)
3. `/` ↔ `/about/`
4. `/writing/` ↔ `/writing/<slug>/`
5. `/work/` ↔ `/writing/<slug>/` (cross-link from a project to a related post, if one exists)
6. any ↔ `/404`
7. cross-locale (EN ↔ FR) for every route

Each pair, each direction named separately where asymmetric.

### Pair 1 — `/` → `/work/`

**Metaphor**: **"Plan commits to artifact."**
**Description**: The home page's lattice grid (§Agent 3 4.5) *thickens* into a dense plan graph, then the plan "executes" — all lines contract into a single horizontal sweep that carries the viewport to `/work/`. The destination page materialises as a field of five artifact-nodes (the five project sections) with the sweep line resolving into the `ProjectTableOfContents` sidebar.
**Duration target**: 800ms.
**Reduced-motion twin**: lattice freezes, single 120ms fade-to-black, `/work/` fades in. No sweep. No thickening.

### Pair 1 reverse — `/work/` → `/`

**Metaphor**: **"Artifact abstracted back into plan space."**
**Description**: The `ProjectTableOfContents` decomposes into lattice nodes that radiate outward and dissolve. The hero's point cloud reconstitutes from those dissolved nodes — the artifact has returned to the belief space it came from.
**Duration target**: 800ms.
**Reduced-motion twin**: 120ms fade.

### Pair 2 — `/` → `/writing/`

**Metaphor**: **"Signal detected — stream tuned."**
**Description**: The hero's point cloud condenses into a single vertical line (a signal waveform), which stretches into the vertical list of writing entries. The site has "tuned" from ambient perception to attended signal.
**Duration target**: 640ms.
**Reduced-motion twin**: 120ms fade.

### Pair 2 reverse — `/writing/` → `/`

**Metaphor**: **"Return to ambient."**
**Description**: The writing list collapses upward into a single line, which disperses back into a point cloud as the hero re-wakes (abbreviated wake sequence, ~600ms instead of 1.8s — the visitor has already been here; they don't need the full boot).
**Reduced-motion twin**: 120ms fade.

### Pair 3 — `/` → `/about/`

**Metaphor**: **"Camera turns on the operator."**
**Description**: The hero's point cloud rotates 180° around the vertical axis (conceptually — visually, points re-scatter to the opposite half of the viewport and a portrait-shaped negative space resolves). The metaphor: the sensors that have been looking outward (at the world Cyrille perceives) now look inward (at Cyrille). On arrival, the About page's portrait occupies the space where the negative was.
**Duration target**: 900ms (the longest route replan on the site — it earns it; the About is a perspective shift).
**Reduced-motion twin**: 200ms cross-fade to About; portrait fades in last.

### Pair 3 reverse — `/about/` → `/`

**Metaphor**: **"Operator hands the instrument back."**
**Description**: The portrait dissolves into a point cloud which redistributes across the viewport and re-forms into the home hero cloud.
**Reduced-motion twin**: 120ms fade.

### Pair 4 — `/writing/` → `/writing/<slug>/`

**Metaphor**: **"Item selected — context expands."**
**Description**: The clicked entry row extends: its left-edge accent line sweeps across the viewport width and *becomes* the post's top rule; the row's title transforms into the post's H1 (FLIP-style position-and-size animation, not a morph); the rest of the list recedes upward out of view.
**Duration target**: 640ms.
**Reduced-motion twin**: title jumps into H1 position instantly; 160ms fade-in of post body.

### Pair 4 reverse — `/writing/<slug>/` → `/writing/`

**Metaphor**: **"Item returned to index."**
**Description**: H1 contracts back to its row position; body recedes; list re-fills from above. Reverse of Pair 4 forward.
**Reduced-motion twin**: 120ms fade.

### Pair 5 — `/work/<#slug>/` → `/writing/<slug>/` (cross-link)

**Metaphor**: **"System handed to its narrator."**
**Description**: The project's hero asset (SLAM map, planner frame, etc.) shrinks into a quote-mark-sized glyph at the top-left of the destination post. The post's H1 types in beside it. The implicit statement: "here is the thing; here is what I wrote about it."
**Duration target**: 720ms.
**Reduced-motion twin**: 120ms fade, static glyph positioned at top-left.

### Pair 5 reverse — `/writing/<slug>/` → `/work/<#slug>/`

**Metaphor**: **"Narrator steps aside — system takes the frame."**
**Description**: The quote glyph expands back into the project's hero asset; post body recedes; project section fills in.
**Reduced-motion twin**: 120ms fade.

### Pair 6 — any → `/404`

**Metaphor**: **"Belief never converged."**
**Description**: The current page dissolves into a uniform-noise field (as if the belief has flattened back to its prior); from that noise, the 404 page resolves with one point stuck jittering (§1.6). The replan "gave up."
**Duration target**: 720ms.
**Reduced-motion twin**: 120ms fade to 404 static state.

### Pair 7 — cross-locale (EN ↔ FR)

**Metaphor**: **"Frame of reference rotated."**
**Description**: The current page's contents shift laterally ~12% of viewport width as if the reference frame has re-oriented (echoing Agent 3 §7.2's "coordinate frame" icon metaphor for the language switcher). The sibling-locale content slides in from the opposite direction, meeting at center. Fragment preserved per Agent 4 §4.5.
**Duration target**: 480ms — locale switches are frequent enough in a bilingual audience that this replan should be faster than the others.
**Reduced-motion twin**: 120ms fade. Fragment preserved.

### Shared contract for all replans

- Every replan has a **keyboard equivalent**: pressing Enter on a focused link commits the replan identically. Keyboard users see the animation; they do not get a degraded version.
- Every replan respects `prefers-reduced-motion` via its named static twin above.
- Every replan has a **failure state**: if the target route fails to load (offline, 404 on a direct URL, asset load timeout > 5s), the replan resolves into the `/404` replan (Pair 6) mid-flight, without snapping — the metaphor holds even in failure.
- The primary-nav BT tick (§1.1, 400ms) runs *in serial* before the replan's 640–900ms window. Total click-to-land budget: 1.04s–1.3s. Agent 6 confirms curves.

---

## 7. Reduced-motion — first-class static twins

Every interaction above has a reduced-motion equivalent named inline. Consolidated rules:

### 7.1 Global policy

- Respect `prefers-reduced-motion: reduce` at the top of every stylesheet and every JS-driven animation check.
- Do not ship a "motion off = nothing happens" state. Every interaction communicates something; the static twin communicates it through position, type, and layout changes instead.
- Reduced-motion users still get color, contrast, and focus changes. Those are not motion — they are state.

### 7.2 Twin patterns

Five reusable twin patterns cover the whole site:

- **Pattern T1 — Instant swap.** Replaces long narrative animations (wake sequence, hero cloud attention). The end-state renders immediately.
- **Pattern T2 — Static convergence.** Replaces Tier C ellipse tightening. The tightened ellipse is rendered statically on hover/focus, without motion — same amber, same stroke weight, just no interpolation.
- **Pattern T3 — Discrete step distribution.** Replaces continuous belief distributions. The 7-beat scroll distribution becomes a 7-dot row with one amber dot; the 4-cluster sub-distribution becomes a 4-dot row.
- **Pattern T4 — 120ms fade.** Replaces all Tier R route replans. The metaphor is not carried in motion; it is carried by the layout and type of the destination. A fade is the honest fallback.
- **Pattern T5 — Static arrow/state icon.** Replaces icon animations (CV download arrow exiting the frame becomes a statically-drawn arrow-outside-frame on focus).

### 7.3 Performance + reduced motion

Reduced motion also implies a performance-friendly branch. The SLAM map background uses its static low-density variant; the lattice grid holds at base 4%; no `requestAnimationFrame` loops run. This keeps the site well-behaved on low-end hardware regardless of user preference — a reader on a Jetson-class browser gets the same experience as a reader with reduced-motion enabled.

---

## 8. Touch — no hover-only information

### 8.1 The rule

Nothing on the site requires hover to reveal meaning. Every hover interaction has a touch equivalent that is either:

- **Tap-to-reveal** (for disclosable information like Frontier chip deks).
- **Press-and-hold** (for "preview" behaviors like project card ellipse convergence).
- **Intrinsically visible** (for information that on desktop is hover-gated but should be visible by default on touch — e.g., stack chips' full names instead of abbreviations).

### 8.2 Touch patterns per component

| Component | Desktop hover behavior | Touch equivalent |
|---|---|---|
| `PrimaryNav` leaves | Preview path strokes, sibling labels reveal | Single tap opens the mobile drawer with all leaves + labels visible by default; no hover state. Second tap commits. |
| `ScrollProgress` bars | Tooltip with beat name, ellipse breathes | Tap on a bar smooth-scrolls immediately; beat name is visible beside each bar on touch (no tooltip). |
| `ProjectCardGrid` cards | Hover Tier C convergence, surface lift | Press-and-hold (>200ms) shows Tier C convergence (held ellipse tightens); release lifts pressure; tap committed (route change). |
| `ProjectSection` expand (code `<details>`) | Hover highlights summary | Tap summary, standard `<details>` behavior. |
| `FrontierBridgesGrid` chips | Hover reveals dek | Tap toggles dek open; tap elsewhere or tap chip again to close. aria-expanded toggles. |
| `WritingList` entries | Row hover accent + ellipse | Press feedback: brief amber accent on touchstart; lift commits. No press-and-hold preview (not needed). |
| `LanguageToggle` | Both labels equalize on hover | No pre-equalize. Tap commits. |
| `ContactForm` fields | Ellipse on focus | Focus is the same; no hover gating. |
| `CVDownloadBlock` | Arrow animates out of frame | Arrow is static-outside-frame by default on touch. Tap commits download. |

### 8.3 Mobile-specific patterns

- **Mobile `PrimaryNav` is a drawer**, not a persistent sidebar. The BT motif appears as a small static sigil in the drawer header; the drawer body is a labeled list. Opening the drawer fires a Tier S-style sidebar handoff (labeled: "Tree revealed").
- **Mobile `ProjectCardGrid` is a horizontal scroll-snap carousel**, not a grid. Swipe left/right. A dots indicator at the foot of the strip (custom-drawn, 5 dots matching the cards) shows position — active dot is amber.
- **Mobile `ScrollProgress` is pinned to the bottom** (not the right side), rendered as a horizontal belief distribution. Takes up 28px of bottom safe area.
- **Mobile code blocks**: horizontal scroll for overflow; no side-by-side with prose. Line numbers are fixed-left.
- **Mobile cursor custom behaviors (§3)**: all disabled.

### 8.4 Haptics

On iOS/Android where the Web Vibration API is available and `navigator.vibrate` returns true:

- A 10ms tick on primary-nav leaf tap (matches the BT tick visually).
- A 6ms tick on `ProjectCardGrid` card press-and-hold commit.

Nothing else. Haptics for "feedback" on every tap is noise. Two points only, both where the metaphor is literally a "tick."

### 8.5 Gestures

No custom gestures. No swipe-to-dismiss, no pinch-to-zoom overrides, no pull-to-refresh. The only gestures: standard swipe on the mobile `ProjectCardGrid` carousel, and standard scroll. Everything else is a tap.

---

## 9. Guardrails, cuts, and deferred decisions

### 9.1 Interactions that were considered and cut

- **Magnetic cursor on primary CTAs.** Vanity. Does not pay rent.
- **Parallax hero.** Agent 3 §8.5 forbade this. Parallax is untethered movement; our movements are agentic.
- **Typewriter effect on every headline.** Reserved for Moment 1 (hero headline), Moment 1's section eyebrow (240ms), and the 404 copy. Applied anywhere else, it would become a tic.
- **Scroll-hijacking of the 7 beats.** Beats are IntersectionObserver-triggered, not scroll-locked. Users retain full scroll control. We observe scroll; we do not captain it.
- **Cursor-following shadow/blur on cards.** Pure vanity. Would compete with the legitimate SLAM-attention behavior.
- **Sound.** No audio in any interaction. This is unambiguous.
- **Animated page-exit transitions on external links.** External links are external — they open, our site stops mattering. A replan metaphor for a link to GitHub would be dishonest.

### 9.2 Deferred to Agent 6

- All motion durations beyond the target windows I named.
- All easing curves beyond the Agent 3 vocabulary cited.
- The exact particle count, LOD, and frame budget of the hero `HeroCanvas` and SLAM background under each device class.
- Inter-stagger values (80ms is a target; Agent 6 may adjust).

### 9.3 Deferred to Agent 9

- The build-time check that every route has its replan twin registered.
- The static twin flag / feature-detection strategy (CSS `@media (prefers-reduced-motion: reduce)` combined with a JS-side `matchMedia` subscription for React islands — standard but worth confirming).
- WebGL2 feature detection and canvas2D fallback wiring for the hero and SLAM background.

### 9.4 Blockers flagged

- **Transition choreography density.** If Agents 6 and 10 ship all seven scroll moments + seven route pairs + Tier C on every hover at full fidelity, the frame budget on mid-range laptops is at risk. Agent 6's motion-budget ledger is the mitigation (Agent 3 §12.1 already flagged this). Specifically: the hero wake + scroll-moment-1 running in overlapping windows is the single highest-cost sequence. Test this early.
- **`ScrollProgress` subdivision at Beat 4.** The 4-to-7 bar subdivision/rejoin is a non-trivial layout animation. If it proves flaky, fall back to a static 10-bar row (7 beats with Beat 4 pre-expanded into 4 sub-bars). Loses a little of the "belief subdividing" metaphor; keeps the full functionality.
- **Custom cursor on the SLAM background (§3.3 Context A).** On Windows Chromium, cursor SVGs sometimes render at the wrong DPR and appear blurry. Ship the cursor as a 2× SVG asset by default; engineering confirms.
- **Press-and-hold Tier C on touch cards (§4.4).** iOS Safari has quirks around `touchstart` + 300ms tap delay. Test on real device before committing. Fallback: skip the press-and-hold preview on touch; tap commits immediately with no preview state.
- **Cross-link replans (Pair 5).** Requires that project sections and posts be reliably cross-referenced in frontmatter. Content-ops dependency; Agent 9 owns the data schema.
- **Haptics (§8.4).** `navigator.vibrate` is not supported in iOS Safari. Behavior degrades to no-vibration silently; no error. Documented here so nobody files a bug.
- **Reduced-motion + cursor.** Users with reduced motion still see custom cursors in Contexts A and B because those are shape, not motion. If user-research later suggests reduced-motion users also prefer default cursors, add a secondary check against `prefers-reduced-motion` to disable custom cursors globally. Parked, not decided.

---

## 10. Handoff to Agents 6, 9, 10

**Agent 6 (motion):** every named metaphor in §2, §4, §5, §6 needs a motion spec — durations within my target windows, curves from Agent 3's vocabulary (`ease-out-quart` UI reveals, `ease-in-out-cubic` loops, `ease-out-expo` positions, linear continuous). I have named what moves and what it means. You name how.

**Agent 9 (engineering):** the component contracts in §1, the `IntersectionObserver` thresholds in §2, the keyboard semantics throughout, and the build-time guards for reduced-motion twins are all yours. The `ScrollProgress` belief distribution is the single most engineered component on the site — budget for it specifically.

**Agent 10 (transitions, if separate from Agent 6):** the seven route-pair metaphors in §6 and the seven scroll-moment metaphors in §2 are your direct mandate. Each has a named metaphor, a target duration, a reduced-motion twin, and a failure state. Implement each as a named module; do not share code across pairs unless the shared code doesn't compromise the individual character of each replan.

---

*End of 05-interaction-spec.md — Agent 5, Senior Interaction Designer.*
