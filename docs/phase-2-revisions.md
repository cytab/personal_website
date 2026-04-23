# Phase 2 Revisions (2026-04-23)

> Phase 3 agents MUST read this file. Where Agent 3's tokens conflict with this file, this file wins. Agent 8's audit identified accessibility failures that must be corrected before engineering handoff.

## 1. Color contrast corrections (from Agent 8 audit)

### Dark mode — two pairs fail AA, forbidden for body text
- `--ink-muted` on `--surface-2` measured **4.1:1** — forbid as body text. Restrict to decorative/metadata only at ≥18.66px semibold.
- `--danger` on `--surface-2` measured **3.6:1** — darken `--danger` to pass AA on both surfaces, or forbid direct use on `--surface-2`.

### Light mode — brand colors fail AA as body text
- **Signal Amber** at `#F3A03B` on `#F5F2EB` paper = 3.2:1 — fails AA normal.
  - **Light-mode Signal Amber becomes `#9A580F`** (≥4.5:1 on paper).
- **Plasma Cyan** as link color at `#0F8F7A` on paper = 3.8:1 — fails.
  - **Light-mode Plasma Cyan becomes `#0A7A67`**.
- Dark mode tokens unchanged.

### Amber claim corrections (dark mode)
- Signal Amber on Graphite Black = **8.0:1** (Agent 3 claimed 9.1 — still AAA, just lower than advertised).
- Signal Amber on Lifted Deck = **5.9:1** (claimed 7.6 — still AA normal, just lower).
- Tokens unchanged; only the contrast metadata in the tokens doc must be corrected.

## 2. Focus ring — final token (Agent 8's two-band luminance-driven ring)
- Outer: 2px band in `--ink` (bone on dark, graphite on light).
- Inner halo: 2px in the current surface color.
- 3px transparent offset.
- Hue-independent — works on dark bg, paper, amber buttons, cyan accents.
- `@media (forced-colors: active)` → `CanvasText`.

## 3. Motion reduced-motion gaps to close (Agent 8 flag)
- **SLAM hero** must satisfy WCAG 2.2.2 — include a user-accessible pause control (pause button top-right of the scene, keyboard-reachable). Hero autoplay ≤ 5s before auto-pause unless user has interacted.
- **Ellipse breath** and **lattice wavefront** need explicit reduced-motion static terminal states — do not vanish; render the settled posterior/path.
- **Loop-closure accents** must render their post-closure state under `reduce`, not mid-animation.

## 4. Alignment of parallel outputs
- **Scroll choreography (Agent 5) ↔ Section handoffs (Agent 6)**: Agent 5's six named moments map 1:1 to Agent 6's sensor-handoff transitions. Engineering reference is the union of both docs; if wording conflicts, Agent 5 names the moment, Agent 6 specifies the motion.
- **ScrollProgress 7→4 bar subdivide (Agent 5)**: Agent 6 must spec the bar transition motion — add this to Agent 6's scope during Phase 3 if not present (flagged).
- **Sensor Boot (Agent 6) ↔ Wake-up 3-stage (Agent 2)**: same artifact. Single implementation lives in Agent 10's hero pipeline.

## 5. FR language tag
- Use `<html lang="fr-CA">` (not bare `fr`) for narration fidelity. Agent 4's IA accepted; Agent 9 implements.

## 6. Contact
- Decision deferred but default: **mailto** to `cyrilletabe@gmail.com` with a one-line instruction. No server form. Cyrille can switch to Formspree later if spam becomes an issue — zero code change, just swap the anchor target.
