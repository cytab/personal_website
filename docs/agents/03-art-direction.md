# 03 — Art Direction

**Author:** Agent 3 (Art Director)
**Subject:** Cyrille Tabe — personal site
**Status at time of writing:** Pre-strategy. Agents 01 (brand brief) and 02 (narrative architecture) had not yet produced outputs when this document was drafted. Direction here flows directly from `subject-dossier.md`. Where Agent 1 later contradicts tone claims or Agent 2 contradicts IA claims, their outputs win; this document should be reconciled, not overridden wholesale — the *visual language* logic below is self-consistent and traceable to the dossier.

---

## 0. North Star for Visuals

The site should feel like watching an autonomous system **come online**: sensors initialize, a belief state converges, a plan forms, the world gets perceived and acted upon. Every visual decision must pay rent in that metaphor. Decoration that does not narrate *perception → planning → action* is cut.

Three phrases I'm writing on the wall and will not let anyone forget:

- **"Instruments, not interface."** The UI reads like a cockpit telemetry surface, not a marketing page.
- **"Data is the hero."** Real SLAM maps, real planner outputs, real belief updates. If we can't ship real data, we commission abstract representations — never, ever stock.
- **"Warm-technical, not cold-blue."** We're a roboticist in Montréal, not a Series-B SaaS in Mountain View. The palette has to have a pulse.

---

## 1. Mood — Three Reference Archetypes

> **The site feels like:** a field notebook from a robotics lab, if the lab were run by someone who also loves Swiss graphic design and reads papers in bed.

### Archetype A — *Teenage Engineering's OP-1 manual, reformatted for a LIDAR rig*
Dense, small-type, unashamed of numbers. Tables and callouts treated as ornament. Every pixel claims it's functional, even when it's decorative. Captions that read like specs. Quiet humor in the microcopy. Orange used sparingly and with intent.

### Archetype B — *The interior of a ROS rviz window at 3 a.m., but art-directed*
Dark background. Point clouds drifting. Axes, frames, grids. TF transforms blinking into view. A planner graph un-blurring. The aesthetic of debugging tools treated as legitimate visual language — the way MIT Media Lab circa 2005 treated plots as canvases. We are not *mimicking* rviz; we are borrowing its visual honesty.

### Archetype C — *A New York Times / Bloomberg long-form data piece, printed onto matte black stock*
Editorial rigor. Long-form reading that respects the reader's time. Annotated plots. Legends you can actually use. Scroll-triggered state changes that feel like a director's cut, not a party trick. The humanist type does the heavy lifting; the mono type earns its keep in data labels.

> **"Like the OP-1 manual meets rviz-at-3am meets an NYT opinion-graphics long-read."**

Deliberate non-references (to keep the team honest):
- Not Linear / Vercel / Stripe marketing — those are too polite, too cold-blue, too Silicon Valley.
- Not Awwwards-core — no kinetic type for its own sake, no unsolicited cursor gimmicks.
- Not "cyberpunk," not "neon synthwave," not "glassmorphism."
- No floating 3D laptops. No isometric hero illustrations. No gradient mesh blobs.

---

## 2. Color System

**Dark-mode-first.** Light mode is a secondary, opt-in state — not a toggle we fight for parity on.

Rationale for warm-technical: robotics imagery (SLAM, occupancy grids, heat maps) already skews cool. A warm-leaning UI gives contrast *to the data itself*, which is the hero. Cool data on warm chrome sings. Cool data on cool chrome drowns.

### 2.1 Dark Mode — primary

| Token | Name | Hex | HSL | Role |
|---|---|---|---|---|
| `--bg` | **Graphite Black** | `#0B0D0E` | `hsl(200 13% 5%)` | Page background. Not pure black — keeps OLED bloom in check and gives the mono type a surface to sit on. |
| `--surface-1` | **Instrument Panel** | `#15191B` | `hsl(204 12% 9%)` | Primary card / section surfaces. One step above `--bg`. |
| `--surface-2` | **Lifted Deck** | `#1F2427` | `hsl(200 10% 14%)` | Elevated elements: modals, code blocks, plot backgrounds. |
| `--ink` | **Bone** | `#E6E1D6` | `hsl(40 20% 87%)` | Primary body text. Slightly warm off-white — not `#FFFFFF`. This is the single most important decision in the palette. |
| `--ink-muted` | **Graphite Dust** | `#8E8A82` | `hsl(40 5% 53%)` | Secondary text, captions, metadata. |
| `--primary` | **Signal Amber** | `#F3A03B` | `hsl(32 89% 59%)` | Primary signal. Links, active states, the "it's alive" pulse, belief-converged indicator. Used sparingly — currency, not confetti. |
| `--accent` | **Plasma Cyan** | `#62E0C8` | `hsl(169 68% 63%)` | Accent / secondary signal. Used for sensor data, "perceiving" states, and to offset amber in plots so charts don't rely on color alone. |
| `--danger` | **Uncertainty Red** | `#E5484D` | `hsl(358 75% 59%)` | Errors, high-variance states, stop tokens. |

### 2.2 Accessibility — actual WCAG 2.2 numbers

Computed against `--bg = #0B0D0E`:

| Foreground | Ratio | AA normal (≥4.5) | AA large (≥3.0) | AAA normal (≥7.0) |
|---|---:|:---:|:---:|:---:|
| `--ink` Bone `#E6E1D6` | **15.8 : 1** | PASS | PASS | PASS |
| `--ink-muted` Graphite Dust `#8E8A82` | **5.6 : 1** | PASS | PASS | fail |
| `--primary` Signal Amber `#F3A03B` | **9.1 : 1** | PASS | PASS | PASS |
| `--accent` Plasma Cyan `#62E0C8` | **11.9 : 1** | PASS | PASS | PASS |
| `--danger` Uncertainty Red `#E5484D` | **4.7 : 1** | PASS | PASS | fail |

**Rules of thumb baked into the tokens:**
- Do not put `--ink-muted` on `--surface-2`. Contrast drops below AA-normal there. Use `--ink` with reduced weight, or bump size to ≥18px (AA-large applies).
- Never use `--danger` for body text on `--bg`. Limit to 16px+ at weight ≥500, or as a badge on a neutral chip.
- `--primary` and `--accent` are both safe for body-size text, but treat them as *semantic* — they mean something. If everything is signal, nothing is.
- Never convey meaning by color alone. Every stateful color is accompanied by a glyph, label, or position.

### 2.3 Light Mode — secondary

Invert hierarchy, keep amber and cyan unchanged (they carry brand recognition across modes).

| Token | Hex | HSL |
|---|---|---|
| `--bg` | `#F5F2EB` | `hsl(42 30% 94%)` — warm paper, not cold white |
| `--surface-1` | `#ECE7DC` | `hsl(42 26% 89%)` |
| `--surface-2` | `#E0D9CB` | `hsl(42 25% 83%)` |
| `--ink` | `#1A1C1D` | `hsl(200 6% 11%)` |
| `--ink-muted` | `#5A5650` | `hsl(34 6% 33%)` |
| `--primary` | `#B86A14` | `hsl(32 80% 40%)` — darkened amber for contrast on paper |
| `--accent` | `#0F8F7A` | `hsl(170 81% 31%)` — darkened cyan |

Light-mode contrast check (`--ink` on `--bg`): **15.0 : 1 — AAA pass.**

---

## 3. Typography System

Two faces. Both open-source, both self-hostable (non-negotiable from the brief).

### 3.1 Pairing

- **Display / Mono / Data:** **JetBrains Mono** — the mono face of a working engineer, not a designer's pastiche. Ligatures enabled for code (`=>`, `!=`, `>=`). Used for: all numerics, all data labels, metadata rows, version strings, timestamps, keyboard glyphs, section markers (`§ 01 / PERCEPTION`), and short display lines when we want a "terminal" feel.
- **Body / Editorial:** **Inter** — humanist, neutral, extensively tested for screens, excellent at small sizes, has a proper tabular-numbers feature that pairs cleanly with JetBrains for mixed rows. Used for: running prose, essay body, captions, nav labels.

**Trade-off considered and rejected:**
- *IBM Plex Sans + IBM Plex Mono* — too corporate-IBM; reads like a deck.
- *Geist + Geist Mono* — too Vercel-core; we're trying *not* to look like a SaaS landing page.
- *Manrope + JetBrains Mono* — Manrope is warmer but loses clarity at 13–14px which we need for data rows. If Inter feels "too default" to Agent 1, fallback pair is **Söhne / IBM Plex Sans**, but we lose open-source purity with Söhne.

### 3.2 Scale (major-third, 1.25, anchored at 16px base)

| Token | Size / Line-height | Tracking | Weight | Face | Use |
|---|---|---|---|---|---|
| `--t-display` | 64 / 68 px | -0.02em | 500 | JetBrains Mono | Landing hero line. One place on the site. |
| `--t-h1` | 40 / 46 px | -0.015em | 600 | Inter | Page titles. |
| `--t-h2` | 28 / 34 px | -0.01em | 600 | Inter | Section titles. |
| `--t-h3` | 20 / 28 px | 0 | 600 | Inter | Sub-section / card titles. |
| `--t-body` | 16 / 26 px | 0 | 400 | Inter | Running prose. |
| `--t-mono` | 13 / 20 px | +0.02em | 500 | JetBrains Mono | Labels, metadata, data rows. Uppercase permitted only at this size. |

Two extremes kept for texture, not in the formal scale:
- `--t-micro`: 11 / 16 px JetBrains Mono `+0.06em` uppercase — section markers, axis labels.
- `--t-reading`: 18 / 30 px Inter 400 — long-form essay mode only.

### 3.3 Rules

- **Numbers live in mono.** Always. A 40% performance number in Inter looks like marketing; in JetBrains it looks like an instrument reading.
- **Tabular figures on** wherever numbers stack (tables, changelogs, timestamps).
- **No italic in body prose.** Italic is reserved for titles of works (papers, projects) and for a single, intentional editorial voice move per essay.
- **Tracking opens with size reduction.** Under 14px, bump tracking +0.01 to +0.02em. Over 40px, pull -0.015 to -0.02em.
- **No all-caps headings.** All-caps is a mono-size-13 thing only — section markers, eyebrow labels.

---

## 4. Visual Motifs — the signature system

These recur across the site. They are not decoration. Each one *means* something from Cyrille's work.

### 4.1 The SLAM Map Background — "The site is mapping itself"

A persistent, low-opacity point-cloud layer behind the content. As the user scrolls, new points stream in — the site is "building a map" of itself while being read.

- Points are drawn in `--ink-muted` at 12–20% alpha.
- Density clusters near content blocks; sparse in negative space — echoes occupancy-grid density.
- Every N scroll-pixels, a small subset of points *locks in* and shifts to `--accent` at 40% alpha: a "closed loop." This is a direct nod to loop-closure in SLAM.
- On hero views, the map is more overt (30% alpha, denser); on reading pages, it recedes to near-invisible (8% alpha) so prose wins.
- Must be pausable. Must respect `prefers-reduced-motion` — in reduced mode, the cloud is static and sparse, no streaming.
- Rendered via canvas/WebGL2 with a Poisson-disk sampled seed derived from a hash of the page slug, so **each page has its own deterministic map**. (This is a detail I want engineering to actually implement — it means the About page and the RobotClaw page have visibly different "rooms.")

### 4.2 Behavior-Tree Navigation Motif

Primary navigation is rendered as a small behavior-tree diagram in the sidebar / top-left.

- Nodes: sequence (`→`), fallback (`?`), action (leaf square), condition (leaf diamond). Styled as thin-stroke outlines in `--ink-muted`.
- Current location is the *active* action node, glowing `--primary` amber at 60% alpha with a 2px outer ring.
- Path from root to current node is stroked in `--ink` at full alpha; inactive branches are at 30%.
- On hover, sibling branches reveal their labels.
- On click, the tree animates the traversal — a "tick" propagating from root to the selected leaf. Duration 400ms, easing `ease-out-quart`.

This replaces the nav bar. It is literally the nav — behavior trees navigate Cyrille's robots; they navigate Cyrille's site.

### 4.3 Uncertainty Ellipses — cluster markers

Each of the five research clusters gets a covariance-ellipse badge as its visual identifier. These are the five badges:

| Cluster | Ellipse character |
|---|---|
| **Perception & Spatial Intelligence** | Tight ellipse, near-circular, small. High confidence in spatial knowledge. |
| **Planning & Decision Under Uncertainty** | Larger, eccentric ellipse with a faint outer 2σ ring. Honest about variance. |
| **Human Understanding** | Medium ellipse, oriented at ~30° — the "emotions are tilted" visual pun. |
| **Systems & Infrastructure** | Compact ellipse aligned on-axis — systems are predictable. |
| **Markets & Quantitative Reasoning** | Very eccentric, one axis long — the fat-tail reality of markets. |

Drawn at 32×32, 48×48, and 96×96 sizes. Stroke weight 1.25 on `--surface-*`. On hover, ellipses "breathe" by ±3% over 1.6s. Each cluster page opens with its ellipse scaled up to 240px in the hero — the badge *is* the cluster's sigil.

### 4.4 Belief-State Loading Indicator

Replaces the standard spinner everywhere on the site.

- A row of 8 short vertical bars representing a discretized belief distribution.
- On load, bars start near-uniform with jitter.
- As the load resolves, the distribution *sharpens* around one bar (the "correct" one), which locks to `--primary` while the rest fade.
- Duration matches actual load time; jitter is procedural, never looped GIF-style.
- Fallback for reduced-motion: a static sharpened distribution with a 1px scanning caret beneath it.
- Used for: page transitions, async content, bilingual content swap, project detail fetches.

This is *the* interaction signature of the site. If someone screenshots one thing, it should be this.

### 4.5 4D Lattice Grid — structural motif

A subtle 8px × 8px square grid, rendered at 4% alpha, is the universal background under `--bg`. This is the 4D lattice planner made visible.

- On project pages related to planning, a *second* grid layer appears at 24px × 24px at 6% alpha, offset at a 2° rotation — the temporal slice of a 4D lattice projected down.
- Column and row rules on grids within content align to this 8px base — **8px is the atomic unit of the entire site.** All spacing, all iconography, all line-heights round to 8px.
- On hover over "lattice-tagged" content, the grid briefly intensifies (8% → 14%) and lines travel outward from the cursor like a wavefront — a planner exploring.

---

## 5. Imagery Philosophy

**No stock photography. Ever.** Full stop. The brief is explicit; I'm restating it because the pressure to grab an Unsplash robot image will be real.

### 5.1 Hero imagery is Cyrille's actual data

In priority order:
1. **Real SLAM maps** from the Odu sidewalk robot or Noovelia rigs (anonymized as needed).
2. **Real planner outputs** — 4D lattice plans, MPC trajectories, behavior-tree execution traces.
3. **Real belief-state traces** from RobotClaw's POMDP — honest-to-god posterior distributions over user intent.
4. **Real trading system charts** — equity curves, drawdown distributions (respecting prop firm NDAs; use funded-account stats at aggregate level).

All exported as SVG where possible (vector chart libraries — Observable Plot, D3) or high-DPI PNG with a `.webp` fallback. Every data visualization gets a `data-source` attribute pointing to the origin project, so we can answer "where did this come from" on demand.

### 5.2 When real data is unavailable

Commission — internally, with code — **abstract representations** of the underlying concept. Rules:
- Must be generative (a deterministic seeded script, not a one-off Figma file). This means the abstract image is itself a small project and can be regenerated with different parameters — proof that we understand the thing we're illustrating.
- Must cite the concept: caption reads "Abstract representation — Kalman update, 2D case" not just "decorative."
- Palette locked to the dark palette above. No gratuitous color.

### 5.3 Photography of Cyrille himself

One portrait, max. Monochrome, warm-toned (sits in the Bone / Graphite Dust range), shot against a matte wall or in a lab — not a studio seamless. Used once, in the About page. Never on the home page, never in social cards. The site's face is its *work*, not its author.

### 5.4 Social / OG images

Generated per-page at build time. Composition: page title in Inter 600, page-seeded SLAM map in the background, cluster ellipse in the top-right. No author photo. No gradient.

---

## 6. Hero Concepts — Five Candidates for the Landing Fold

Each specifies: **description / first 3 seconds / on mouse-move.** A recommendation follows.

### Concept 1 — *"Sensors Initializing"*
**Description:** The page opens dark. Over ~1.8s, a sparse point cloud streams in from the edges toward the center. Text fades in as the cloud reaches density threshold. Headline is set in JetBrains Mono, small caps eyebrow says `§ 00 / BOOTING PERCEPTION`. Below: a belief-state indicator sharpens from uniform to a single peak under the name "Cyrille Tabe."
**First 3 seconds:** A dark room waking up. Points arrive. A name resolves out of noise.
**On mouse-move:** The point cloud "perceives" the cursor — points within a 180px radius brighten and reorient their local normals toward it, like a sensor rig tracking a target. Subtle, non-grabby.

### Concept 2 — *"Planner Exploring"*
**Description:** A 4D lattice grid fills the viewport, at 8% alpha. From the top-left, a planner graph begins expanding — nodes and edges, breadth-first — eventually finding a "path" that terminates at the headline position. Headline types in, character by character, along the path.
**First 3 seconds:** A search algorithm running on your screen. A plan forming. A sentence as a solved trajectory.
**On mouse-move:** The planner re-plans around the cursor as an obstacle. Edges route around the mouse. Move fast and you see the planner struggle — a visible, honest computation cost.

### Concept 3 — *"Belief State Over Five Hypotheses"*
**Description:** Five vertical bars dominate the hero, each labeled with one research cluster (Perception, Planning, Human, Systems, Markets). Bars start near-uniform. Over 2s, the distribution sharpens as if new evidence were arriving — the tallest bar locks amber. Below: "Posterior over what I work on."
**First 3 seconds:** Five possibilities, then one answer forming.
**On mouse-move:** Hover on a bar re-opens the posterior — the distribution flattens, then re-sharpens to a *different* peak, showing that the answer depends on the observer. Each re-peaking pushes a short tagline into view beside the name.

### Concept 4 — *"Live SLAM of the Portfolio"*
**Description:** The entire hero is a top-down SLAM map of the site itself. Each room on the map is a section (Projects, Writing, Research, Contact). A small robot icon ("ego") sits at the page's current location. The headline is positioned as if it were a label inside the main room.
**First 3 seconds:** A map of a building you haven't entered yet. A floor plan of a mind.
**On mouse-move:** The ego-robot *drives* toward the cursor along a smoothed path. Hover over a room and a door opens; click and the ego reaches the room as the page navigates.

### Concept 5 — *"Terminal Wake"*
**Description:** A boot-log renders in JetBrains Mono, deliberately paced (not the played-out fake-terminal trope — slower, richer, more beautiful). Lines like `perception/zed2i .......... [ READY ]`, `planner/lattice-4d ....... [ READY ]`, `belief/pomdp ............. [ CONVERGED ]`. At the end, the log collapses into a single line: the name and role.
**First 3 seconds:** An honest, legible boot sequence. Each line a real subsystem.
**On mouse-move:** Cursor passes over a line; that subsystem's mini-viz appears inline — SLAM thumbnail, planner thumbnail, belief distribution — and follows the cursor as a small annotated card.

### Recommendation — **Concept 1, "Sensors Initializing"**

**Why:** It delivers the dossier's North Star ("feel like a robot waking up") most directly, in the fewest moving parts, at the lowest technical risk. It is elegant. It scales to mobile cleanly (the cloud simplifies; the belief bar remains). It does not depend on the visitor having patience (headline resolves at 1.8s). It owns a motif we reuse for the rest of the site (SLAM map + belief indicator) so the hero doesn't become a one-off trick.

Concept 4 is the ambitious alternative if engineering budget allows it — it is the most memorable, but the riskiest. If Concept 1 proves too quiet in user testing, escalate to 4. Concept 5 is a strong backup for a low-motion fallback. Concepts 2 and 3 are conceptually strong but demand more copy and more explanation than a hero should.

**Trade-off acknowledged:** Concept 1 leans heavily on motion. In `prefers-reduced-motion`, we render a pre-resolved static version — point cloud at final density, belief indicator already sharpened — and swap in a short sub-headline explaining the metaphor for users who'd otherwise miss it.

---

## 7. Iconography Rules

A single coherent icon family. We do not use Lucide, Heroicons, or any generic SaaS set as-is — we use them as *shape primitives* and re-draw the important icons in our own system.

### 7.1 Geometry

- **Grid:** 24 × 24 artboard. 20 × 20 safe area. All anchor points snap to 1px.
- **Stroke weight:** 1.5px for primary icons, 1.25px for small (16px) size variants. Strokes, not fills, as default.
- **Corner radius:** 1px (exterior), 0.5px (interior). Slightly geometric — not the friendly 4px roundness of a consumer app. These icons look like they came from a schematic.
- **Line caps:** square (0 radius). Line joins: miter with 2px limit. This is explicit: **square caps**, because they read as *instrument-like*, not *brand-friendly*.
- **Terminals:** never tapered. Never dotted. Dashed strokes are allowed only for "prediction" or "uncertainty" states.
- **Fill usage:** reserved for *state* — a filled icon means "active." Empty stroke means "available." This is a functional, not stylistic, distinction.

### 7.2 Metaphor family — sensor-inspired, not SaaS

Mental model for new icons: **"What would this look like on a robotics HMI or an oscilloscope, not in a Figma community kit?"**

| Concept | Our icon | Not this |
|---|---|---|
| Home / start | A crosshair (sensor calibration target) | A house |
| Projects | A behavior-tree root node | A briefcase |
| Writing | A waveform fragment | A pencil |
| Research | A covariance ellipse | A microscope |
| Contact | An antenna with emission arcs | An envelope |
| Navigation / menu | A tree of three BT nodes (sequence + two leaves) | Three stacked lines |
| External link | An arrow exiting a bounded frame (out-of-FOV) | Arrow in a square |
| Loading | The belief-state bars | A spinner |
| Toggle open/close | A field-of-view cone rotating | A chevron |
| Language switch | A pair of coordinate-frame labels (`FR_odom`, `EN_odom`) | A globe |
| Search | A ray-cast line hitting a target dot | A magnifying glass |
| Copy | Two overlapping transform frames | Two stacked squares |
| Theme switch | A bright/dark sensor aperture | A sun/moon |

### 7.3 Rules of use

- Always accompanied by a text label on primary nav — icons are a complement, never a standalone meaning-bearer (accessibility hard requirement).
- Animated transitions between related icons use 240ms `ease-out-expo`. For example, menu → close is the BT-root rotating and collapsing, not a bog-standard burger-to-X flip.
- Icons never use a color outside `--ink`, `--ink-muted`, `--primary`, `--accent`. No rainbow semantics.
- When an icon is the only content of a button (desktop only), it gets an `aria-label` — always.

---

## 8. Motion Principles

Five rules. These override designer instinct.

1. **Motion must encode information.** If a movement doesn't communicate perception, planning, uncertainty, or action, it gets cut.
2. **Default duration 240ms. Long durations (1.2–2s) only for state-change narratives (hero wake, belief convergence).**
3. **Easing vocabulary is small:** `ease-out-quart` for UI reveals, `ease-in-out-cubic` for loops (breathing ellipses), `ease-out-expo` for position changes (planner ticks), linear for continuous-process motion (SLAM cloud drift).
4. **`prefers-reduced-motion` is a first-class experience, not an afterthought.** Designed, not stripped.
5. **No parallax scroll.** Parallax is untethered movement; our movements are agentic — they do things.

---

## 9. Spacing, Grid, Layout Tokens

- Atomic unit: **8px.** All spacing is a multiple of 8 (with a single 4px micro-unit allowed for dense data rows).
- Content max-width for reading: 680px (≈65ch at `--t-body`).
- Content max-width for dashboards / project gallery: 1280px.
- Column grid on desktop: 12-col, 24px gutter, 80px outer margin. On tablet: 8-col, 16px gutter. On mobile: 4-col, 16px gutter.
- **Baseline grid is real, not rhetorical.** Headline and body line-heights are chosen so that three body lines equal one H2 line box — vertical rhythm is enforced.

---

## 10. Trade-offs Documented

Honest ledger. Every choice above has a cost.

| Decision | Cost | Why I took it |
|---|---|---|
| Warm amber primary | Amber at brand scale risks "crypto / prop-trading startup" read. | Mitigated by restraint (amber is 4–6% of pixels), warm-cream text, and serious editorial typography. The alternative — cold blue — fights the data. |
| JetBrains Mono everywhere for numbers | Can feel "engineer-LARP" if over-applied. | Strict rule: only numerics, labels, and micro-text. Prose stays in Inter. |
| SLAM map as background | GPU / battery cost on low-end devices. | Rendered via WebGL with LOD: density and FPS scale down on low-power devices. Respects `prefers-reduced-motion`. Fallback to static SVG. |
| Behavior-tree nav | Steeper learning curve than a nav bar. | The site *is* about behavior trees and planning. If the nav isn't interesting to explore, we've already lost. A labeled sub-nav on mobile flattens to a standard list. |
| No stock imagery, no author headshot on home | Home feels austere. | Correct outcome. Austerity is the brand. |
| Dark-mode-first | ~15–20% of users prefer light. | They get a quality light mode, not parity. We do not design two sites. |
| Live generative backgrounds | Engineering complexity. | Non-negotiable for the "alive" feel. Seeded + deterministic so testing is reproducible. |

---

## 11. Open Questions for Agents 1, 2, 4+

- **Agent 1 (Brand):** Is "quietly ambitious" still the voice? If it shifts louder, amber may need to dial *down* (louder voice + loud color = shouting). If it shifts quieter, amber dials *up*.
- **Agent 2 (Narrative/IA):** The behavior-tree nav assumes a shallow hierarchy (≤3 levels) with 5–8 leaves. If IA wants 20+ endpoints, BT-nav degrades; we'll need a fallback flat menu at a defined breakpoint.
- **Agent 4+ (Engineering):** Is WebGL2 acceptable as a baseline, with canvas2D fallback? The SLAM background and planner hero both want WebGL.
- **Agent handling content/research:** We need *real* SLAM / planner / POMDP exports. Please request from Cyrille's Noovelia and RobotClaw repos, with anonymization review.

---

## 12. Concerns for Downstream

1. **Motion budget.** If we ship everything in §4, we will murder a mid-range laptop. Engineering must own a motion-budget ledger and the ability to degrade gracefully.
2. **Behavior-tree nav UX-testing.** Novelty over clarity is a real risk. Prototype and test with at least one non-technical reader (per dossier success criteria).
3. **Data sourcing.** "Real SLAM maps, real planner outputs" is a content-ops problem, not a design problem. Someone has to actually extract these from Cyrille's systems.
4. **Bilingual typography.** Inter and JetBrains Mono both handle French diacritics fine, but the tighter `-0.02em` tracking on the display size breaks slightly on long French titles. Expect to add a `lang=fr` tracking adjustment (-0.015em instead of -0.02em).
5. **Amber + WCAG on `--surface-2`.** Primary amber on Lifted Deck `#1F2427` gives ~7.6:1 — still AAA, but watch for amber on deeper-tint custom surfaces that designers may invent downstream.
6. **Pre-strategy risk.** This document was written before brand positioning (Agent 1) and IA (Agent 2) landed. On receipt of those, re-read §1 (mood), §3.1 (type pairing), and §4.2 (BT-nav) for alignment. Everything else should hold.

---

## 13. Design Tokens — engineering handoff

Tokens below are intended to be ingested as-is into the site's token layer (Style Dictionary / Tailwind config / CSS custom properties). Comments are non-normative.

```json
{
  "$schema": "https://schemas.cyrilletabe.site/design-tokens.v1.json",
  "meta": {
    "name": "cyrille-tabe-site",
    "version": "0.1.0-art-direction",
    "author": "Agent 3 — Art Director",
    "date": "2026-04-23",
    "notes": "Pre-strategy draft. Reconcile with Agent 01/02 when available."
  },
  "color": {
    "dark": {
      "bg":          { "hex": "#0B0D0E", "hsl": "200 13% 5%",  "role": "page background" },
      "surface-1":   { "hex": "#15191B", "hsl": "204 12% 9%",  "role": "primary surface" },
      "surface-2":   { "hex": "#1F2427", "hsl": "200 10% 14%", "role": "elevated surface" },
      "ink":         { "hex": "#E6E1D6", "hsl": "40 20% 87%",  "role": "primary text",  "contrastOnBg": 15.8 },
      "ink-muted":   { "hex": "#8E8A82", "hsl": "40 5% 53%",   "role": "secondary text","contrastOnBg": 5.6 },
      "primary":     { "hex": "#F3A03B", "hsl": "32 89% 59%",  "role": "signal amber",  "contrastOnBg": 9.1 },
      "accent":      { "hex": "#62E0C8", "hsl": "169 68% 63%", "role": "plasma cyan",   "contrastOnBg": 11.9 },
      "danger":      { "hex": "#E5484D", "hsl": "358 75% 59%", "role": "uncertainty / error", "contrastOnBg": 4.7 }
    },
    "light": {
      "bg":          { "hex": "#F5F2EB", "hsl": "42 30% 94%",  "role": "warm paper" },
      "surface-1":   { "hex": "#ECE7DC", "hsl": "42 26% 89%",  "role": "primary surface" },
      "surface-2":   { "hex": "#E0D9CB", "hsl": "42 25% 83%",  "role": "elevated surface" },
      "ink":         { "hex": "#1A1C1D", "hsl": "200 6% 11%",  "role": "primary text",  "contrastOnBg": 15.0 },
      "ink-muted":   { "hex": "#5A5650", "hsl": "34 6% 33%",   "role": "secondary text" },
      "primary":     { "hex": "#B86A14", "hsl": "32 80% 40%",  "role": "darkened amber" },
      "accent":      { "hex": "#0F8F7A", "hsl": "170 81% 31%", "role": "darkened cyan" },
      "danger":      { "hex": "#B3282D", "hsl": "358 64% 37%", "role": "uncertainty / error" }
    }
  },
  "typography": {
    "families": {
      "mono":    { "name": "JetBrains Mono", "source": "self-hosted", "fallback": "ui-monospace, SFMono-Regular, Menlo, monospace", "features": ["calt", "liga", "tnum"] },
      "body":    { "name": "Inter",          "source": "self-hosted", "fallback": "ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif", "features": ["ss01", "cv11", "tnum"] }
    },
    "scale": {
      "display": { "family": "mono", "size": 64, "line": 68, "tracking": -0.02,  "weight": 500 },
      "h1":      { "family": "body", "size": 40, "line": 46, "tracking": -0.015, "weight": 600 },
      "h2":      { "family": "body", "size": 28, "line": 34, "tracking": -0.01,  "weight": 600 },
      "h3":      { "family": "body", "size": 20, "line": 28, "tracking": 0,      "weight": 600 },
      "body":    { "family": "body", "size": 16, "line": 26, "tracking": 0,      "weight": 400 },
      "mono":    { "family": "mono", "size": 13, "line": 20, "tracking": 0.02,   "weight": 500 }
    },
    "extras": {
      "micro":   { "family": "mono", "size": 11, "line": 16, "tracking": 0.06, "weight": 500, "case": "upper" },
      "reading": { "family": "body", "size": 18, "line": 30, "tracking": 0,    "weight": 400 }
    },
    "rules": {
      "numerics": "always mono",
      "tabularFiguresWhereStacked": true,
      "bodyItalic": "reserved for titles of works",
      "allCaps": "only at 13px or below"
    }
  },
  "spacing": {
    "unit": 8,
    "micro": 4,
    "stack": {
      "xs": 8, "sm": 16, "md": 24, "lg": 40, "xl": 64, "xxl": 96
    },
    "contentMax": { "reading": 680, "dashboard": 1280 },
    "grid": {
      "desktop": { "cols": 12, "gutter": 24, "margin": 80 },
      "tablet":  { "cols": 8,  "gutter": 16, "margin": 48 },
      "mobile":  { "cols": 4,  "gutter": 16, "margin": 16 }
    }
  },
  "radius": {
    "none": 0,
    "sm": 2,
    "md": 4,
    "lg": 8,
    "icon-exterior": 1,
    "icon-interior": 0.5
  },
  "stroke": {
    "icon-default": 1.5,
    "icon-small":   1.25,
    "hairline":     1,
    "caps": "square",
    "joins": "miter",
    "miterLimit": 2
  },
  "motion": {
    "duration": {
      "instant": 0,
      "fast": 120,
      "base": 240,
      "slow": 400,
      "narrative-short": 1200,
      "narrative-long": 1800
    },
    "easing": {
      "uiReveal": "cubic-bezier(0.25, 1, 0.5, 1)",
      "loopBreath": "cubic-bezier(0.4, 0, 0.2, 1)",
      "positionChange": "cubic-bezier(0.19, 1, 0.22, 1)",
      "continuous": "linear"
    },
    "reducedMotion": {
      "strategy": "designed-fallback",
      "noParallax": true,
      "replaceSpinners": "static sharpened belief bars"
    }
  },
  "motifs": {
    "slamBackground": {
      "layer": "behind-content",
      "alphaRange": { "hero": 0.30, "reading": 0.08 },
      "color": "ink-muted",
      "loopClosureColor": "accent",
      "seedFrom": "page-slug-hash",
      "respectsReducedMotion": true
    },
    "latticeGrid": {
      "base": { "cell": 8, "alpha": 0.04 },
      "temporal": { "cell": 24, "alpha": 0.06, "rotation": 2 }
    },
    "beliefStateLoader": {
      "bars": 8,
      "sharpensTo": "primary",
      "jitter": "procedural"
    },
    "behaviorTreeNav": {
      "nodeTypes": ["sequence", "fallback", "action", "condition"],
      "activeColor": "primary",
      "tickDurationMs": 400
    },
    "uncertaintyEllipses": {
      "sizes": [32, 48, 96, 240],
      "strokeWeight": 1.25,
      "breath": { "amplitude": 0.03, "durationMs": 1600 }
    }
  },
  "iconography": {
    "artboard": 24,
    "safeArea": 20,
    "strokeWeight": 1.5,
    "strokeWeightSmall": 1.25,
    "caps": "square",
    "cornerRadius": { "exterior": 1, "interior": 0.5 },
    "fillMeansActive": true,
    "metaphorFamily": "sensor-inspired",
    "forbiddenMetaphors": ["house-for-home", "briefcase-for-projects", "envelope-for-contact", "magnifier-for-search"]
  },
  "imagery": {
    "stockPhotography": "forbidden",
    "authorPortrait": { "allowedOn": ["/about"], "style": "warm-monochrome", "count": 1 },
    "dataSources": ["slam-maps", "planner-outputs", "belief-traces", "trading-charts"],
    "generativeAbstractions": { "allowed": true, "deterministic": true, "mustCiteConcept": true }
  },
  "accessibility": {
    "contrastTargets": { "bodyText": 4.5, "largeText": 3.0, "preferAAAWhereFeasible": true },
    "colorMeaningAlone": "forbidden",
    "iconOnlyButtons": "require aria-label",
    "standard": "WCAG 2.2 AA"
  },
  "i18n": {
    "languages": ["en", "fr"],
    "frenchDisplayTracking": -0.015,
    "englishDisplayTracking": -0.02
  }
}
```

---

*End of 03-art-direction.md — Agent 3, Art Director.*
