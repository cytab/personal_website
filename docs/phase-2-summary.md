# Phase 2 Synthesis — Design System & IA

## IA (Agent 4)
- **Scroll-narrative hybrid home** carries Agent 2's 7-beat arc. Four clusters live as in-page panels, not routes.
- **Routes** (minimal): `/` · `/work/` · `/writing/` (conditional) · `/about/` · `/404` · `/legal/` (opt). FR mirror at `/fr/travaux/`, `/fr/ecrits/`, `/fr/a-propos/`. Slugs translated; anchors stable.
- **Primary nav** = a **behavior tree**. 4 leaves = 4 routes. Active leaf ticks amber.
- **Secondary nav (home only)** = `ScrollProgress` as a **belief distribution** over the 7 beats.
- Contact is an anchor, not a leaf.

## Interaction (Agent 5)
- Six named **sensor-handoff** scroll moments: vision-yields-to-language · scanner-locks-on-targets · loop-closure · map-handed-to-planner · intent-model-online · beliefs-pushed-to-the-bus.
- Cursor: **3 contexts only** (crosshair on SLAM bg, BT-action glyph on nav leaves, lattice-ripple on lattice-tagged content). OS default otherwise. Off on touch/coarse pointer.
- Clusters: **Pattern γ** — ScrollProgress subdivides 7→4 bars when entering cluster territory; each cluster enters as its own sensor handoff.

## Motion (Agent 6)
- **Easings (3)**: Observer `(0.22,1,0.36,1)` · Stepper `(0.65,0,0.35,1)` · Drift `(0.4,0,0.6,1)`.
- **Signature animations (5)**: Sensor Boot (1800ms, once/session) · Belief-state Converging (spinner replacement) · Plan Unfolding (FLIP card with lattice underline) · Map Drawing (ambient SLAM drift + loop closures) · Heartbeat (phase-offset active-node pulse).
- **Route replans (4 named)**: map-handed-to-planner (home↔work) · agent-identifies-self (home↔about) · notebook-opens (home↔writing) · belief-sampled-from-posterior (writing-index↔detail). Locale toggle = TF-frame-broadcast.
- **Tech**: Astro View Transitions + Framer Motion `layoutId`. 400ms decay → 800ms lattice-wavefront `clip-path` from click. Safari <17 / Firefox <129 → honest desaturated crossfade.

## Typography & Layout (Agent 7)
- **Type**: Inter 400/500/600 + italic; JetBrains Mono 400/500. Self-hosted, subset Latin + Latin-Ext. ~184KB total woff2.
- **Scale**: 6 sizes on 1.25 modular, anchored 16px. Display 64px JBM 500 · H1 40 · H2 28 · H3 20 · Body 16/26 (62ch ideal, 68ch max) · Mono 13. Eyebrow 11 uppercase. Reading prose 18/30 at 58ch.
- **Grids (2)**: 12-col structured + asymmetric editorial (2-track sidenotes + 7-track main + 2-track captions).
- **FR breathing**: 20% vertical headroom, display tracking relaxes to -0.015em on `:lang(fr)` for `É`/`œ`. Locale-aware quotes « », narrow NBSP before `:;?!%`, `hyphens: auto` in FR prose.

## Accessibility & i18n (Agent 8)
- **Contrast**: two dark-mode pairs fail AA (fixed in revisions); two light-mode brand colors fail AA (fixed in revisions — `#9A580F` amber, `#0A7A67` cyan).
- **Focus ring**: two-band luminance-driven (outer `--ink`, inner surface, 2px each, 3px offset). Hue-independent.
- **FR routing**: confirmed. `<html lang="fr-CA">`. Switcher preserves deep-link path.
- **Escalated**: SLAM hero needs WCAG 2.2.2 pause control; reduced-motion static terminal states required for ellipse breath, lattice wavefront, loop closures.

## Deliverables on disk
- `docs/agents/04-information-architecture.md`
- `docs/agents/05-interaction-spec.md`
- `docs/agents/06-motion-spec.md`
- `docs/agents/07-typography-layout.md`
- `docs/agents/08-accessibility-i18n.md`
- `docs/phase-2-revisions.md` — **Phase 3 must read first**

## Asset requests surfaced (to ask Cyrille in Phase 3)
- Real SLAM map / point-cloud capture (for hero and clusters)
- 4D lattice planner output frame(s) (Noovelia)
- Drone telemetry screenshot / video (Jetson stack)
- Behavior-tree screenshot from a deployed robot
- Portrait / identity shot (not stock, real)
- Any field deployment stills
