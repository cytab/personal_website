# 06 — Motion Spec

**Author**: Agent 6 — Senior Motion Designer
**Status**: Draft v1. Binding for Agents 9 (engineering) and 10 (WebGL). Co-read with Agent 3 §8 (Motion Principles) and Agent 4 §4.6 (route-transition contract).
**Co-agent status**: Agent 5's interaction spec was **not present** at time of writing. This deliverable operates *pre-interaction-spec*. Where Agent 5 later specifies trigger contracts (hover/focus/scroll-linkage semantics), the motion primitives below are designed to absorb them — easing/duration tokens and FM pseudo-code do not prejudge trigger type. Reconcile on receipt of 05.
**Anchored to**:
- Dossier (North Star: "feel like a robot waking up"), Phase-1 revisions (four clusters, transitions are first-class).
- Agent 1 (quietly ambitious voice; local-first motion budget), Agent 2 (seven-beat arc, three-stage wake-up loader), Agent 3 (warm-technical palette, motion principles, 8px atomic unit, motifs), Agent 4 (route rarity, sensor-handoff between beats, replan between routes, BT-nav tick).

---

## 0. Operating principles

Five rules. These override designer instinct; they are stricter than Agent 3's five.

1. **Every animation carries a named metaphor tied to Cyrille's work.** If it does not, it is cut. The metaphor is the spec; the pixels are an implementation.
2. **Motion encodes legibility, not delight.** A movement either makes the system more readable (where you are, what just happened, what's available) or it is decoration. Decoration is the failure mode, not the goal.
3. **Reduced motion is a first-class design, not a switch.** Every signature animation has a static counterpart that *also* carries the metaphor — a sharpened belief distribution, a pre-locked lattice path, a resolved loop closure. Designed, not stripped.
4. **Transform and opacity only.** `translate3d`, `scale`, `rotate`, `opacity`. Layout-thrashing properties (`top`, `left`, `width`, `height`, `margin`) are banned in animated contexts. One documented exception below (clip-path for lattice reveal — compositor-friendly in Chromium/Firefox/Safari 17+).
5. **No parallax for its own sake.** Scroll-linked motion exists only when it represents something (a belief distribution updating, a sensor modality coming online, a plan expanding). "Things move because you scrolled" is the banned pattern.

---

## 1. Motion tokens

### 1.1 Easing curves — three, exactly

Agent 3 named four easings. I am narrowing to three named families with explicit semantic owners. Agent 3's four curve values are preserved; I re-name two to clarify semantic role.

| Token | Name | `cubic-bezier()` | Feel | Use |
|---|---|---|---|---|
| `--ease-default` | **Observer** | `cubic-bezier(0.22, 1, 0.36, 1)` | Confident overshoot-free settle. The animation watches itself finish. | UI reveals, card expansion, hover states, belief convergence, modal open/close. This is the house curve — 80% of the site. |
| `--ease-system` | **Stepper** | `cubic-bezier(0.65, 0, 0.35, 1)` | Mechanical S-curve, symmetric, no buttery lead-in. Feels like a servo reaching a setpoint. | Technical motifs: BT-nav tick propagation, lattice-node expansion, planner search frame-stepping, 4D grid wavefront. Anything that represents a computation running. |
| `--ease-ambient` | **Drift** | `cubic-bezier(0.4, 0, 0.6, 1)` | Slow sinusoidal breathing. No stops. | Always-on elements: heartbeat pulse, ellipse breathing, SLAM-cloud drift, ambient point reorientation. Only used on looped / sustained motion. |

Deliberately omitted: `linear`. Linear is *not* an easing on this site — where Agent 3 wrote "linear for continuous-process motion," we use `--ease-ambient` because it gives the SLAM cloud a micro-acceleration that reads as *alive* rather than *mechanical*. Linear reads as dead-scroll; we do not ship dead-scroll. The one exception is the infinite rotate on a specific sub-frame inside the sensor-boot (specified inline, scoped, not a token).

**Compatibility note** for Agent 3: `ease-out-quart` (the UI-reveal curve Agent 3 called out) is algebraically closest to `Observer`; `ease-out-expo` (position-change) maps onto `Stepper`'s late portion; `ease-in-out-cubic` (loop breath) is `Drift` with tighter extremes. The semantic split below is what I defend.

### 1.2 Duration scale — six tokens

Anchored at a 240ms base (Agent 3's `--duration-base`) and extended in both directions. Each token has a *named* role so designers can pick by intent, not by millisecond.

| Token | ms | Name | Intent |
|---|---:|---|---|
| `--dur-tick` | 80 | **Tick** | UI feedback. Button press confirm, checkbox, focus ring appearance, hover entry on a small target. |
| `--dur-fast` | 160 | **Settle** | Small-scale reveals. Tooltip appear, secondary hover, menu item shift. |
| `--dur-base` | 240 | **Observe** | Default UI transition. Card hover, tab switch, accordion toggle. The workhorse. |
| `--dur-slow` | 400 | **Propagate** | Multi-element orchestration. BT-nav tick traversal, ellipse breath start, cluster-ellipse resize. |
| `--dur-narrative` | 800 | **Replan** | Route-level transitions. Old path dissolving, new path expanding. |
| `--dur-scene` | 1200 | **Wake** | Hero sensor-boot, belief-state narrative convergence, full-viewport handoffs. |

Reference anchor: Agent 3's `narrative-long: 1800` is retained as a **non-token internal value** only for the initial first-ever load (Sensor Boot composite, §2.1) — it is the total envelope of three staged sub-animations, not a reusable token. Never write `1800` elsewhere.

### 1.3 Stagger rules

Stagger is used to carry *propagation direction* — information, not ornament.

| Rule | Value | When | Direction |
|---|---|---|---|
| `--stagger-tight` | 30 ms | Same-kind items in a horizontal row (chips in the Frontier beat, project cards in Proof strip). | Left → right in LTR; reverse in RTL (site is EN/FR, both LTR, so always L→R). |
| `--stagger-base` | 60 ms | Vertical lists, belief-bar appearance, BT-node tick. | Top → bottom; BT-tick follows *root → leaf* order (which is left → right in the drawn tree, top-down conceptually). |
| `--stagger-loose` | 120 ms | Cluster-panel children on enter (eyebrow → sigil → paragraph → artifact). | Always in *reading order* of the composition: the sensor modality pretends to "perceive" the most important element first. |
| Max chain length | **8 items** | Hard cap. | Beyond 8, switch to `whileInView` per-item with no chain — a chain of 9 is a waterfall that feels loose. |
| Never stagger | icon cluster in a single logo mark; numbers in a single readout; the three stages of the belief-state loader (they stage *themselves* by design). | — | — |

Stagger is **direction-preserving** for screen readers: we emit the same DOM order we stagger in; no reverse-staggers that contradict reading order.

### 1.4 CSS custom properties — drop-in

See §11 for the full CSS + TS module. In short:

```css
:root {
  --ease-default: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-system:  cubic-bezier(0.65, 0, 0.35, 1);
  --ease-ambient: cubic-bezier(0.4, 0, 0.6, 1);

  --dur-tick: 80ms;
  --dur-fast: 160ms;
  --dur-base: 240ms;
  --dur-slow: 400ms;
  --dur-narrative: 800ms;
  --dur-scene: 1200ms;

  --stagger-tight: 30ms;
  --stagger-base:  60ms;
  --stagger-loose: 120ms;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-tick: 0ms;
    --dur-fast: 0ms;
    --dur-base: 0ms;
    --dur-slow: 0ms;
    --dur-narrative: 0ms;
    --dur-scene: 0ms;
    --stagger-tight: 0ms;
    --stagger-base: 0ms;
    --stagger-loose: 0ms;
  }
}
```

**Important**: the reduced-motion block zeroes durations *only for CSS fallbacks*. The Framer Motion components below check `useReducedMotion()` directly and branch to designed static variants — they do not simply read zeroed durations. See §5.

---

## 2. Signature animations

Five moments. Each has: metaphor, trigger, composition, FM pseudo-code, reduced-motion equivalent.

### 2.1 Sensor Boot — the first-impression moment

**Metaphor**: A robot powering on. Agent 2's three-stage loader ("Initializing sensors…" → "Converging belief state…" → "Ready.") made literal. This is *the* animation that earns the North Star.

**Trigger**: First page paint, home route (`/` and `/fr/`). Runs exactly once per session (a `sessionStorage` flag — on return-within-session, we run a 240ms compressed version). Agent 5 owns the trigger contract; Agent 6 owns the motion envelope.

**Composition** (total envelope: 1800ms, three staged sub-animations):

- **Stage A — Perception coming online** (0 → 600ms). A sparse point cloud (Agent 3's HeroCanvas / Agent 10's WebGL) streams in from all four edges toward the center. Overlay text `§ 00 / BOOTING PERCEPTION` appears at 400ms at `--dur-fast` with `--ease-default`. Meta-easing for the streaming: `--ease-system` (servo reaching setpoint).
- **Stage B — Belief converging** (600 → 1400ms). The `BeliefStateLoader` (8 bars) renders below the hero position. Bars enter near-uniform with procedural jitter; over 800ms, the distribution sharpens to a single amber-locked peak. The headline "I build machines that perceive, decide, and act..." *masks in* along the peak's vertical — clip-path from 0% to 100% width, `--ease-system`, 600ms, starting at 800ms.
- **Stage C — Ready** (1400 → 1800ms). The eyebrow updates to `§ 00 / READY`, the belief bars settle (amplitude decay on the jitter to 0), the ambient SLAM cloud (§2.4) takes over at 8% alpha, the heartbeat (§2.5) starts its first pulse. Crossfade on the eyebrow text: 400ms `--ease-default`.

**FM pseudo-code**:

```tsx
// components/hero/SensorBoot.tsx
import { motion, useReducedMotion } from "framer-motion";
import { durations, easings, staggers } from "@/tokens/motion";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: staggers.base, // 60ms
      delayChildren: 0,
    },
  },
};

const eyebrow = {
  hidden: { opacity: 0, y: 4 },
  show:   { opacity: 1, y: 0, transition: {
    duration: durations.fast / 1000, ease: easings.default, delay: 0.4,
  }},
};

const headlineReveal = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  show:   { clipPath: "inset(0 0% 0 0)",  transition: {
    duration: 0.6, ease: easings.system, delay: 0.8,
  }},
};

const beliefLoader = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: {
    duration: durations.fast / 1000, ease: easings.default, delay: 0.6,
  }},
};

export function SensorBoot({ headline, eyebrowStart, eyebrowEnd }) {
  const reduced = useReducedMotion();
  if (reduced) return <SensorBootStatic /* see §5 */ />;

  return (
    <motion.section variants={container} initial="hidden" animate="show">
      <motion.span variants={eyebrow}>{eyebrowStart /* BOOTING PERCEPTION */}</motion.span>
      <motion.h1 variants={headlineReveal}>{headline}</motion.h1>
      <motion.div variants={beliefLoader}>
        <BeliefBars mode="converging" durationMs={800} />
      </motion.div>
      {/* Stage C handoff is a state change, fired from BeliefBars.onConverged */}
    </motion.section>
  );
}
```

The point-cloud stream is **Agent 10's WebGL**, not Framer Motion — we only coordinate the *envelope timing*. Contract: Agent 10 exposes a `SlamCloud.boot({ durationMs, onReady })` imperative; we call `.boot({ durationMs: 600 })` at t=0 and chain stages B/C to the existing FM variants.

**Reduced-motion equivalent**: `SensorBootStatic` renders the end-state immediately — headline fully visible, belief bars pre-sharpened to the locked peak, eyebrow reads `§ 00 / READY`, SLAM cloud rendered at resting density/alpha. A single 240ms amber-pulse runs on the belief peak as a *first-class "I am alive" acknowledgment* — not a boot, but a heartbeat that says the system is awake. This is the design, not a fallback.

### 2.2 Belief-state converging — perceived-async loader

**Metaphor**: A POMDP posterior tightening as evidence arrives. Replaces every spinner on the site (Agent 3 §4.4).

**Trigger**: Any async-feeling moment — image decode >150ms, cross-fragment scroll jumps, nav-tick destination paints. The site is static, so "loading" is mostly perceived-async. Agent 5 owns the detection heuristic; Agent 6 owns the visual.

**Composition**:
- 8 vertical bars, 4px wide, 2px gap, on an 8px lattice row.
- `hidden` state: bars at uniform height (~16px), each with per-bar procedural jitter on height (±20%) and opacity (±10%). Jitter animates at ~12 Hz using `--ease-ambient`.
- `converging` state: over a variable window (matches actual perceived wait — never looped GIF style), the peak-bar (index chosen deterministically per-route) grows to 32px and locks to `--primary`, while non-peak bars decay to 6px and fade to `--ink-muted` 40% alpha.
- `converged` state: peak holds for 120ms, then the whole component crossfades out at `--dur-fast`.

**FM pseudo-code**:

```tsx
export function BeliefBars({ peakIndex = 3, mode, durationMs = 800 }) {
  const reduced = useReducedMotion();
  const bars = Array.from({ length: 8 });

  const heightFor = (i, phase) => {
    if (reduced) return i === peakIndex ? 32 : 6;
    if (phase === "converging") return i === peakIndex ? 32 : 6;
    return 16 + (jitterSeed(i) * 6); // ±6px jitter around 16
  };

  return (
    <div role="status" aria-label="Converging belief state">
      {bars.map((_, i) => (
        <motion.span
          key={i}
          animate={{
            height: heightFor(i, mode),
            backgroundColor: i === peakIndex && mode !== "uniform"
              ? "var(--primary)" : "var(--ink-muted)",
            opacity: i === peakIndex || mode === "uniform" ? 1 : 0.4,
          }}
          transition={{
            duration: durationMs / 1000,
            ease: easings.system,
            delay: (i * staggers.tight) / 1000,
          }}
        />
      ))}
    </div>
  );
}
```

**Reduced-motion**: render the sharpened distribution immediately, add a 1px amber *scanning caret* under the peak bar that translates 0 → 100% of the component width in 1.2s and *holds* (not loops). Reads as "a measurement happened." This is designed.

### 2.3 Plan unfolding — project card opening

**Metaphor**: A lattice planner expanding from an initial node. When a project card opens (either as a hover-elaborated preview or as a click-expanded detail inline on `/work/`), the expansion visibly propagates as lattice edges spawning children.

**Trigger**: Click on a `ProjectCard` on `/` (Beat 3) or on the ToC jump on `/work/`. Hover produces a *belief convergence* (§2.6), not a plan unfolding — planning is reserved for commit actions.

**Composition**:
- The card's rect expands in two axes, **but not by animating width/height** — we scale an absolutely-positioned surrogate up from the card's initial bounding box to the detail region's bounding box, with the real detail content cross-fading in behind. FLIP pattern, transforms only.
- Inside the expanded detail, children (title → asset → body → links) appear with `--stagger-loose` (120ms), each with `--dur-base` (240ms) `--ease-system`. The children's *order* represents a BFS plan expansion — title is the root node, asset is the first successor, body is the second, links are leaves.
- A single horizontal lattice line is drawn beneath the title that extends from 0 → 100% of the title's width in `--dur-slow` (400ms) `--ease-system`, timed to finish *as* the asset appears — the lattice finding its next node.

**FM pseudo-code**:

```tsx
export function ProjectCardPlan({ card, expanded }) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      layoutId={`project-${card.slug}`}
      transition={{
        duration: (reduced ? 0 : durations.narrative) / 1000, // 800ms
        ease: easings.system,
      }}
    >
      {expanded && (
        <motion.div
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: (reduced ? 0 : staggers.loose) / 1000,
                delayChildren: 0.1,
              },
            },
          }}
          initial="hidden" animate="show"
        >
          <motion.h3  variants={fadeUp}>{card.title}</motion.h3>
          <motion.hr variants={latticeLine} />
          <motion.figure variants={fadeUp}>{card.asset}</motion.figure>
          <motion.p      variants={fadeUp}>{card.body}</motion.p>
          <motion.ul     variants={fadeUp}>{card.links}</motion.ul>
        </motion.div>
      )}
    </motion.article>
  );
}

const latticeLine = {
  hidden: { scaleX: 0, transformOrigin: "0% 50%" },
  show:   { scaleX: 1, transition: {
    duration: durations.slow / 1000, ease: easings.system,
  }},
};
```

**Reduced-motion**: the layout change is instant; the lattice line under the title appears fully drawn immediately but in `--ink-muted` — then, 240ms after paint, brightens to `--accent` as a *post-hoc lock signal*. Instant state + a legibility-improving color shift. Designed.

### 2.4 Map drawing — ambient SLAM

**Metaphor**: The site mapping itself. Agent 3 §4.1 — the persistent low-opacity point cloud with loop closures.

**Trigger**: Always-on after the Sensor Boot completes. Scroll-modulated density and alpha; cursor-modulated local activity. Agent 10 owns the WebGL render; Agent 6 owns the motion *envelope* (when it breathes, when it pauses, when it hands off).

**Composition** (envelope only — pixels are Agent 10's):
- **Drift**: point cloud rotates ~0.6° per scroll-viewport around the page center; each point has an individual ±2px Brownian jitter at ~4 Hz. `--ease-ambient`.
- **Loop closure**: every `N` scroll-pixels (Agent 10 to choose N; I suggest 1200), a subset of ~12 points flashes `--accent` at 40% alpha for `--dur-narrative` (800ms) then settles back. `--ease-default`.
- **Pause**: when the tab loses visibility, all motion halts immediately (no animated exit — honest to the robotics metaphor: sensors sleep when unpowered). On resume, cloud animates back to current state over `--dur-slow` (400ms) with `--ease-default`.
- **Hand-off**: on route transition (§3), the cloud *dissolves* into higher-entropy noise (alpha drops, jitter amplitude doubles) during the old-path decay, then reseeds against the new route's slug hash during the new-path lattice expansion.

**FM pseudo-code** — this one is a **coordination signal**, not a motion component:

```tsx
// providers/SlamDirector.tsx
export function SlamDirector({ children }) {
  const controls = useRef<SlamCloudHandle>(null); // from Agent 10
  const pageHidden = usePageVisibility();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { controls.current?.freeze(); return; }
    if (pageHidden) controls.current?.pause();
    else            controls.current?.resume({ duration: durations.slow });
  }, [pageHidden, reduced]);

  return (
    <SlamContext.Provider value={controls}>
      {children}
    </SlamContext.Provider>
  );
}
```

**Reduced-motion**: static, sharper cloud. A *single* pre-seeded loop closure is visibly locked in amber — a frozen proof that the mechanism *would* be running. Reads as "paused mid-scan" — designed.

### 2.5 Heartbeat — always-on aliveness

**Metaphor**: A system's "I am alive" signal. A 4Hz timer that ships heartbeats on an MQTT bus in Cyrille's real work; on the site, it is the quietest motion.

**Trigger**: Always-on (subject to `prefers-reduced-motion`). Manifests in exactly two places — nowhere else, to keep it sacred:
1. The **active BT-nav leaf**: the 2px outer ring pulses amber at 0.9 → 1.0 → 0.9 opacity every 2.4s.
2. The **belief-state peak bar** when it is the locked "converged" indicator beneath the hero headline or in a post-boot state: same 2.4s cadence, height oscillation ±1px (sub-pixel-rendered on most displays — a *presence*, not a motion).

**Composition**:
- 2400ms cycle. `--ease-ambient`.
- Amplitude: opacity ±5%, transform `scale(1.0 → 1.02 → 1.0)` on the ring only (the bar oscillates in height by 1 logical px using `scaleY` on a padded container, never `height`).
- **Never** syncs across elements — each heartbeat uses a 0–200ms random phase offset so multiple heartbeats don't pulse in lockstep (lockstep reads as machine-pretending-to-be-alive; offset reads as multiple independent subsystems).

**FM pseudo-code**:

```tsx
export function Heartbeat({ children, phaseOffsetMs = 0 }) {
  const reduced = useReducedMotion();
  if (reduced) return <>{children}</>; // static; the ring/bar is still visible, just not beating

  return (
    <motion.span
      animate={{ opacity: [0.9, 1, 0.9], scale: [1, 1.02, 1] }}
      transition={{
        duration: 2.4,
        ease: easings.ambient,
        repeat: Infinity,
        delay: phaseOffsetMs / 1000,
      }}
    >
      {children}
    </motion.span>
  );
}
```

**Reduced-motion**: the ring or bar is rendered at its *peak* amplitude (opacity 1.0, scale 1.02) and held. Stronger presence, no pulse. Designed.

---

## 3. Route-replan transitions

Agent 4 §4.6 set the surface density; Agent 4 §3.1 fused the BT-nav tick with the replan as a serial handoff (tick first, then replan; total ≤1.2s). Here is the choreography for each route pair. All replans share the same envelope structure:

- **T-0 → T-400ms**: *old path decays into uncertainty*. Content opacity → 0.2, `--ink` desaturates toward `--ink-muted`, SLAM cloud jitter amplitude doubles, any locked loop-closure colors fade to `--ink-muted`. **`--ease-system`**, `--dur-slow` (400ms).
- **T-400 → T-800ms**: *new path expands lattice-style*. The destination renders behind; a lattice-wavefront `clip-path` reveals content as if a planner were finding nodes. **`--ease-system`**, `--dur-narrative` (800ms for the wavefront). Children appear with `--stagger-base`.
- **Total envelope**: 800ms route replan. Counted *after* the 400ms BT-nav tick. Total button-to-arrived: 1200ms. This matches Agent 4's budget exactly.

### 3.1 `/` ↔ `/work/` — *the planner handed the map back*

**Outgoing (home → work)**: the Proof strip's project cards are the anchor. The clicked card's `layoutId` carries to the destination hero (FLIP shared layout). The other cards fade to `--ink-muted` and translate `y: -8px` with a 60ms outward stagger — the mission handed off. Home SLAM cloud dissolves. On `/work/`, the lattice wavefront starts from the card's FLIP-landed position and expands outward, unmasking the full project table.

**Incoming (work → home)**: reverse. The selected `ProjectSection` contracts back into the Proof strip slot. The lattice wavefront on home starts from Beat 3's position and expands both up (toward the hero) and down (toward Beat 4). Scroll is restored to the card's anchor.

**Named metaphor**: *map-handed-to-planner → plan-evaluated → map-returned.*

```tsx
export function ReplanOut({ originRect, onComplete }) {
  return (
    <motion.div
      initial={{ clipPath: `circle(0% at ${originRect.cx}px ${originRect.cy}px)` }}
      animate={{ clipPath: `circle(150% at ${originRect.cx}px ${originRect.cy}px)` }}
      exit={{ opacity: 0.2, filter: "saturate(0.2)" }}
      transition={{ duration: durations.narrative / 1000, ease: easings.system }}
      onAnimationComplete={onComplete}
    />
  );
}
```

### 3.2 `/` ↔ `/about/` — *the agent identifies itself*

**Outgoing**: the hero's BeliefStateLoader peak bar is the anchor. Its `layoutId` carries to a small identifier pip beside the page title on `/about/`. The home content fades to `--ink-muted`, then the home cloud's drift speeds 3x briefly (a "where did the agent go" moment) before dissolving. On `/about/`, the lattice wavefront starts from the pip's landed position and unmasks the bio block, portrait, and timeline with `--stagger-loose`.

**Incoming**: the pip beside the page title expands back into the belief peak; home renders with a *compressed* Sensor Boot (Stage C only — the system is "already booted" mid-session).

**Named metaphor**: *ego node → annotated frame → ego returns.*

### 3.3 `/` ↔ `/writing/` — *the notebook opens*

**Outgoing**: Beat 6's WritingPreviewList is the anchor. Each preview row translates y: -12px and fades with `--stagger-base` (top row first — the one that "was opened"). The top row carries its `layoutId` to the index-page's first entry. Home cloud dissolves. On `/writing/`, the lattice wavefront starts from the top entry and expands downward; the full list appears with `--stagger-base`.

**Incoming**: the topmost entry contracts back into Beat 6's slot. Home renders compressed Sensor Boot, scroll-restored to `#signal`.

**Named metaphor**: *unfiled notes → indexed; back again.*

### 3.4 `/writing/` ↔ `/writing/<slug>/` — *the note unfolds*

The one replan that inverts the direction of expansion. Agent 4 defines `ReadingProgress` on posts; this transition seeds it.

**Outgoing (index → post)**: the clicked entry row *expands vertically* via FLIP (height surrogate, scale-transform only), its text contents cross-fading into the post's `PostHeader`. The rest of the index rows fade to `--ink-muted` 30% alpha with a 30ms outward stagger from the clicked row's position — the other notes *wait*. Lattice wavefront on the post unmasks `PostBody` downward from the header.

**Incoming (post → index)**: the `PostHeader` contracts back into the index row; the ReadingProgress bar *drains* in 400ms as the post collapses (a nice "you read this much" read). Other index rows fade back to full ink.

**Named metaphor**: *one belief sampled from the posterior → returned to the posterior.*

### 3.5 Cross-locale toggle — `/` ↔ `/fr/` (and each sibling pair)

The toggle is not a route replan in the same sense — it is a *coordinate-frame change*. Different choreography.

- The Agent 3 language-toggle icon (coordinate-frame labels `FR_odom` / `EN_odom`) rotates its active frame by 90° over `--dur-base`. Simultaneously, all `--ink` text on the page crossfades through its desaturated state at `--dur-slow` (400ms) to the translated string. No wavefront, no lattice — the *frame* changed, the world did not.
- Scroll anchor preserved (§4.5 of Agent 4's IA).

**Named metaphor**: *TF frame broadcast.*

### 3.6 Astro integration — how we implement replans

**Decision: Astro View Transitions API as the base layer, with Framer Motion shared-layout for intra-page elements.**

Rationale, in order:

1. **Astro is static** (Phase-1 revisions §2). A client-side hydrated shell (Option: single-app hydration) would defeat Astro's zero-JS default and blow the hero-route bundle budget (§4).
2. **View Transitions API (VT)** ships natively in Chromium, Safari 17+, and Firefox 129+ (2024–2025). It gives us full-page cross-document transitions with `view-transition-name` snapshots and CSS pseudo-elements (`::view-transition-old(*)`, `::view-transition-new(*)`). This is *exactly* the old-path-dissolves / new-path-expands choreography, for free on the network side.
3. **Astro's `<ViewTransitions />` component** wires this up with a single import and a persistent-element directive (`transition:persist`) for the BT-nav sigil, SLAM cloud, and language toggle — so those elements survive the transition and the BT-nav tick can run *across* the route change.
4. **Framer Motion shared-layout** (`layoutId`) handles the in-page FLIP continuity — project-card-to-detail, entry-row-to-post-header, belief-bar-to-pip. These run *inside* the VT frame, not instead of it.

**Implementation**:

```astro
---
// src/layouts/BaseLayout.astro
import { ViewTransitions } from "astro:transitions";
---
<html lang={lang}>
  <head>
    <ViewTransitions fallback="animate" />
    <!-- fallback="animate" gives non-supporting browsers a crossfade, not a flash -->
  </head>
  <body>
    <nav transition:persist="primary-nav">{/* BT-nav survives replans */}</nav>
    <canvas transition:persist="slam-cloud">{/* WebGL canvas survives */}</canvas>
    <main transition:animate="none">{/* we animate children ourselves */}
      <slot />
    </main>
  </body>
</html>
```

```css
/* src/styles/transitions.css */
::view-transition-old(root) {
  animation: replan-decay var(--dur-slow) var(--ease-system) forwards;
}
::view-transition-new(root) {
  animation: replan-expand var(--dur-narrative) var(--ease-system) forwards;
}
@keyframes replan-decay {
  to { opacity: 0.2; filter: saturate(0.2); }
}
@keyframes replan-expand {
  from { clip-path: circle(0% at var(--replan-x, 50%) var(--replan-y, 50%)); }
  to   { clip-path: circle(150% at var(--replan-x, 50%) var(--replan-y, 50%)); }
}
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 1ms; /* VT spec requires > 0 to engage */
  }
}
```

The `--replan-x/--replan-y` custom properties are set by a 300-byte client-side handler on `astro:before-preparation` that reads the clicked link's `getBoundingClientRect()` and injects the coordinates into the root — so every replan expands *from the click*, not from the viewport center. This is the single feature that makes replans feel like a planner finding *this* node, not "the page changed."

**Fallback for no-VT browsers**: Astro's `fallback="animate"` ships a crossfade. We override it in CSS to a *slightly-desaturated* 400ms crossfade so the metaphor partially survives. Documented degradation.

---

## 4. Section handoff transitions — the six sensor handoffs

Six transitions between Agent 2's seven beats on `/`. Each is a **sensor modality coming online** — the next beat is a new sensor saying "I have data."

All six share the same scaffold: `whileInView` trigger at 30% viewport intersection, 800ms envelope, `--ease-system`, reduced-motion fallback = instant-reveal + modality-name tag shown as a small mono micro label in the upper-right for 1200ms then fading.

| # | Handoff | Sensor metaphor | Visual |
|---|---|---|---|
| 1 | Hero → Orientation | **Vision coming online (RGB)** | Point cloud reorients to face the orientation block. New content scanlines in from top (`clip-path: inset(0 0 100% 0)` → `inset(0 0 0% 0)`). |
| 2 | Orientation → Proof | **Stereo depth (ZED 2i)** | A faint disparity-map shimmer crosses the viewport left-to-right (a 2px translating gradient at 6% alpha); project cards enter with `--stagger-tight`, each one "gaining depth" (z-translate 0 → 1, slight parallax-free shadow bloom). |
| 3 | Proof → Depth (clusters) | **Lidar (sweep)** | A thin 1px amber line sweeps vertically down the viewport over 400ms (`--ease-system`, `--dur-slow`). Where the line crosses a cluster panel, that panel's ellipse sigil locks into view and its eyebrow resolves. Cluster panels enter sequentially (`--stagger-loose`) as the sweep passes. |
| 4a | Perception → Planning (intra-beat, inside the Depth beat) | **Map → planner** | Cluster 1's SLAM map density locks in amber at the panel boundary; the lattice grid at the top of Cluster 2 briefly intensifies 8% → 14% for 400ms, fading back. |
| 4b | Planning → Human | **World model → intent model** | The 4D lattice lines soften and rotate 2° more (now 4° from baseline); a small covariance ellipse tilts from horizontal to the Human cluster's ~30° — the ellipse sigil *arrives pre-tilted*. |
| 4c | Human → Systems | **Intent → bus** | A single horizontal line with two small node-dots translates across the Systems panel header (left → right, `--dur-narrative`, `--ease-system`) — reading as an MQTT/ROS topic broadcast. |
| 5 | Systems → Frontier | **Introspection (self-map)** | The SLAM cloud behind the content briefly doubles its density for 400ms and fades back — the system looking at its own state. Frontier chips enter with `--stagger-loose`. |
| 6 | Frontier → Signal/Invitation | **Interrogation (outward radar)** | From the invitation block's eyebrow, an antenna-arc motif (matches Agent 3's contact icon) fans outward at 40% alpha for `--dur-narrative`; content below it resolves with `--stagger-base`. |

Total count: 1 + 1 + 1 + (3 intra-Depth) + 1 + 1 = 8 handoff moments for 7 beats. Three are intra-Depth (4a/b/c), between the four cluster panels within Beat 4. Named metaphors are bilingual-safe — they do not rely on English puns.

**Intersection pseudo-code**:

```tsx
export function BeatHandoff({ sensor, children }) {
  const reduced = useReducedMotion();

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.3, once: true }}
      variants={HandoffVariants[sensor] /* one per sensor modality */}
      transition={{
        duration: (reduced ? 0.001 : durations.narrative) / 1000,
        ease: easings.system,
      }}
    >
      {reduced && <ModalityTag label={SensorLabels[sensor]} />}
      {children}
    </motion.section>
  );
}
```

**Reduced-motion for handoffs**: the destination section is rendered immediately; a mono-micro label in the top-right corner reads `→ LIDAR / SWEEP` (or the relevant modality) for 1200ms and fades to 0. The *metaphor* arrives as a caption instead of a motion. This is the first-class designed fallback — it makes `prefers-reduced-motion` users understand the structural intent better than motion users do, which is an honest consolation, not a compromise.

---

## 5. Reduced-motion spec — full table

Every signature animation has a first-class static. This is the authoritative mapping.

| Animation | Motion (default) | Reduced-motion design |
|---|---|---|
| **Sensor Boot** (§2.1) | 3-stage 1800ms reveal | End-state rendered immediately. Single 240ms amber pulse on the belief peak — "awake, not booting." |
| **Belief-state converging** (§2.2) | Bars converge over 800ms | Sharpened distribution rendered. 1px amber scanning caret translates 0→100% in 1.2s and *holds* — "a measurement happened." |
| **Plan unfolding** (§2.3) | FLIP + 120ms-staggered children | Instant layout change. Lattice line under title appears fully drawn in `--ink-muted`, then color-shifts to `--accent` after 240ms — post-hoc lock. |
| **Map drawing** (§2.4) | Always-on drift + loop closures | Static cloud, slightly higher density. One pre-seeded loop closure rendered in amber — "paused mid-scan." |
| **Heartbeat** (§2.5) | 2.4s opacity + scale oscillation | Held at peak amplitude (opacity 1.0, scale 1.02). Stronger presence, no pulse. |
| **Route-replan** (§3.1–3.4) | Decay + wavefront 800ms | VT duration reduced to 1ms (effectively instant). A 200ms `--ink-muted` → `--ink` desaturation-return runs on the new page's main content — the *frame* changed, the color confirms it. |
| **Locale toggle** (§3.5) | 90° icon rotation + 400ms text crossfade | Instant. Icon state swaps with a 120ms color-shift on the active frame label. |
| **Section handoff** (§4, each) | Sensor-specific motion | Instant reveal + modality tag label in mono micro, visible 1200ms then fades. |
| **Component hover / belief convergence** (§6) | Ellipse tightens 160ms | Instant color shift from `--ink-muted` to `--ink`, plus a 1px amber outline appearing instantly. The ellipse is drawn in its "tightened" state. |

Rule: **no reduced-motion variant is a stripped version**. Each carries the metaphor through a different primitive (color, caption, instant state). If a design cannot produce a meaningful reduced-motion, the motion does not ship.

---

## 6. Component-level: belief-state convergence (hover/focus)

Agent 3 §4.3 spec'd covariance-ellipse badges per cluster. Agent 5 will own hover trigger contracts; I define the motion shape here so it lands ready.

**Metaphor**: A belief tightening around a hypothesis. Hover or keyboard focus brings new "evidence" to an element — its uncertainty ellipse contracts, its color locks, its surrounding lattice grid brightens within a small radius.

**Composition**:
- **Default state**: ellipse at its cluster-specific eccentricity and scale (Agent 3's table); `--ink-muted` stroke.
- **Focused state**: ellipse scales to 0.85× its axes, stroke locks to `--primary`, and a small amber pip appears at its center with a 160ms `--ease-default` entry. Duration: `--dur-fast` (160ms).
- **Lattice response**: within a 120px radius around the ellipse's centroid, the 4D lattice grid alpha bumps from 4% to 14% for the duration of focus, returning on blur with `--dur-slow`. (Agent 3 §4.5 already specified the wavefront; we reuse the primitive.)

**FM pseudo-code**:

```tsx
export function UncertaintyEllipse({ cluster, isFocused }) {
  const reduced = useReducedMotion();
  return (
    <motion.svg viewBox="0 0 64 64" aria-hidden>
      <motion.ellipse
        cx="32" cy="32"
        rx={cluster.rx} ry={cluster.ry}
        animate={{
          scale: isFocused ? 0.85 : 1,
          stroke: isFocused ? "var(--primary)" : "var(--ink-muted)",
        }}
        transition={{
          duration: (reduced ? 0 : durations.fast) / 1000,
          ease: easings.default,
        }}
      />
      {isFocused && (
        <motion.circle cx="32" cy="32" r="1.5" fill="var(--primary)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: durations.fast / 1000, ease: easings.default }}
        />
      )}
    </motion.svg>
  );
}
```

**Reduced-motion**: ellipse is drawn at its tightened state (0.85×) unconditionally on focus, with an instant color swap. The pip appears instantly.

---

## 7. Performance budget

### 7.1 Targets

- **60fps on a Pixel 6a over 4G.** This is the budget floor. Any animation that drops below 60fps on that device/network combo is a bug.
- **No animation drops below 60fps.** Monitored in dev (§7.4).
- **Transform and opacity only.** Documented exceptions: `clip-path` for the lattice wavefront (compositor-accelerated in Chromium/Firefox/Safari 17+ with `will-change: clip-path` hint on the reveal element; tested-but-verify per browser before ship); `filter: saturate(...)` on route decay (Chrome/Safari accelerate; Firefox 128+ accelerates; below that, we accept a 1-2-frame regression during the *decay* phase only — decay's 400ms includes a small tolerance).
- **Bundle budget for motion code**: **45KB gzipped** on the hero route (`/`), inclusive of Framer Motion, `useReducedMotion` hook, token module, all signature-animation components. Framer Motion's core is ~32KB gzipped (features we use: `motion`, `useReducedMotion`, `usePresence`, `LayoutGroup`). Our code: ~8KB gzipped. Leaves ~5KB headroom.
  - Tree-shaking discipline: **only import from `framer-motion`**, not `framer-motion/dom`-wildcards. No `AnimatePresence` on the hero route (it is used only in the expanded `ProjectCardPlan`, which is a deferred island).
  - Non-hero routes (e.g., `/writing/<slug>/`): **20KB gzipped** — we ship a FM-lite shim (`motion.div` + `transition` only) or use CSS-only transitions wherever the component doesn't need shared-layout. Agent 9 owns the split-route bundling config.
- **Number of concurrent animations on screen**: cap at **8** on the hero route (1 SLAM cloud drift, 1 heartbeat, 1 belief-bar jitter during boot, up to 5 project-card hover belief-convergences). Enforced by design — not every element is allowed to be animated at once.

### 7.2 Disallowed / allowed properties

| Allowed in animations | Banned in animations (layout thrash) |
|---|---|
| `transform` (translate, scale, rotate, skew) | `width`, `height` (use `scale` via FLIP or surrogate) |
| `opacity` | `top`, `left`, `right`, `bottom` (use `transform`) |
| `clip-path` (documented exception) | `margin`, `padding` |
| `filter` (short windows only) | `border-width` |
| `backdrop-filter` (Safari cost — avoid in always-on) | `font-size` (no type animations) |
| CSS custom property interpolation for colors | `background` that triggers repaint chains |

### 7.3 Paint/layer discipline

- Every animated element gets an explicit `will-change` only during its active animation (set in FM's `onAnimationStart`, cleared in `onAnimationComplete`). Permanent `will-change` creates layer-bloat that tanks the hero on a Pixel 6a.
- The SLAM canvas is a *single* compositor layer; no other always-on animation promotes a layer permanently.
- Box shadows are not animated. Pulsing shadow = paint cost. We use `opacity` on an overlay ring instead (§2.5 heartbeat).

### 7.4 Dev-only monitoring — `performance.now()` hooks

A 600-byte dev harness (stripped in prod via `import.meta.env.DEV`) that instruments the five signature animations:

```ts
// src/lib/motion-probe.ts  (DEV only)
export function probe(name: string) {
  if (!import.meta.env.DEV) return { start: () => {}, end: () => {} };
  let t0 = 0;
  return {
    start: () => { t0 = performance.now(); console.timeStamp(`${name}:start`); },
    end:   () => {
      const dt = performance.now() - t0;
      const expected = EXPECTED_MS[name];
      if (dt > expected * 1.15) console.warn(`[motion] ${name}: ${dt.toFixed(1)}ms (expected ${expected}ms)`);
    },
  };
}

// usage in a component
const p = probe("SensorBoot");
useEffect(() => { p.start(); return p.end; }, []);
```

Paired with a `PerformanceObserver` on `long-animation-frame` entries (>50ms) that logs offenders in dev only. Agent 9 wires this into the dev server; nothing ships to prod.

### 7.5 Mobile degradation

- Below 480px viewport and below 4 CPU cores (`navigator.hardwareConcurrency < 4`): the SLAM cloud halves its point count (Agent 10's concern, noted here for the coordination budget). The heartbeat is retained. The sensor-boot is retained but at 1400ms (Stage B is compressed 800→400ms).
- Reduced data saver (`navigator.connection.saveData === true`): trigger `prefers-reduced-motion` as if set, regardless of OS preference. Cyrille's local-first ethos — respect the user's network intent.

---

## 8. Metaphor-to-animation ledger

One table. If an animation is not listed here, it is not shipped.

| Animation | Metaphor | Where it lives | Named in this spec |
|---|---|---|---|
| Sensor Boot (3-stage) | Robot powering on | Hero, first paint | §2.1 |
| Belief-state convergence (bars) | POMDP posterior tightening | Hero + async loaders | §2.2, §4.4 (Agent 3) |
| Plan unfolding | Lattice planner expanding from node | Project cards, detail expansion | §2.3 |
| Map drawing | Site is mapping itself (SLAM loop closures) | Global background | §2.4 |
| Heartbeat | MQTT/ROS heartbeat signal | Active nav leaf, belief peak | §2.5 |
| Route replan (decay + wavefront) | Old plan dissolves, new plan expands | All route pairs | §3 |
| Locale toggle (90° frame rotation) | TF coordinate-frame broadcast | `FR`/`EN` toggle | §3.5 |
| Vision / Stereo / Lidar / etc. handoffs | Sensor modality coming online | Between 7 beats | §4 |
| Belief convergence on hover | Uncertainty ellipse tightens under evidence | Any hoverable cluster-tagged element | §6 |
| BT-nav tick | Behavior-tree traversal from root to active leaf | Primary nav | Agent 4 §3.1, executed by Agent 5 with our tokens |

---

## 9. Coordination contracts with other agents

Explicit so nothing accidentally overlaps.

- **Agent 5 (interaction spec — not yet present)**: owns hover/focus/scroll trigger contracts, click → navigate semantics, keyboard accessibility for animated UI. I expose motion primitives as props (`isFocused`, `mode`, `peakIndex`) that Agent 5's hooks flip. On receipt of 05: verify no conflict on the "compressed sensor boot on return-within-session" heuristic (§2.1) and the async detection for BeliefBars (§2.2).
- **Agent 10 (WebGL / rendering)**: owns pixel-level rendering of the SLAM cloud, hero point-cloud wake-up, lattice grid background. I own the *envelope timing* only — when to start, how long, when to hand off. Contract is via imperative handles (`SlamCloud.boot`, `.pause`, `.resume`, `.freeze`, `.reseed(slugHash)`).
- **Agent 3 (art direction)**: motion tokens honor Agent 3's duration/easing palette; I narrowed easings from 4 to 3 with explicit mapping (§1.1). No palette or motif reinvention.
- **Agent 4 (IA)**: honored route rarity and the BT-nav tick + replan serial handoff (§3, 1200ms total).
- **Agent 9 (engineering)**: owns the TS tokens module drop-in (§11), the Astro `ViewTransitions` wiring (§3.6), the `performance.now()` dev harness (§7.4), the mobile degradation logic (§7.5), the FM-lite split-bundle for non-hero routes (§7.1).

---

## 10. Open items / blockers

- **Agent 5's spec is missing.** The two interface points at risk: (1) sensor-boot re-run heuristic (session-storage flag) should be Agent 5's state logic, not mine; (2) async-moment detection for BeliefBars is Agent 5's trigger lane. My pseudo-code assumes both trigger sources are available as props. Flag, not blocker.
- **Astro View Transitions API fallback.** Safari < 17 and Firefox < 129 fall back to Astro's `fallback="animate"` crossfade. The replan *metaphor* degrades to a desaturated crossfade — honest degradation but weaker. If the launch audience skews old-browser, flag to Agent 9 for telemetry.
- **`clip-path` compositor acceleration.** Safari had historical issues pre-17; I spec it as allowed but verify on the target device list before ship. If it regresses the hero route's 60fps budget, fall back to an opacity-only lattice reveal (worse metaphor, same budget).
- **45KB motion bundle is tight with `LayoutGroup`.** If a future component wants `AnimatePresence` on the hero route, we'll need to drop a sub-feature or jettison Framer Motion in favor of CSS-only on the most demanding elements. Tracked as a budget that needs a gatekeeper in Agent 9's PR review.
- **Pixel 6a testing.** The 60fps floor is unverified until we have physical-device testing. Agent 9's CI should include a WebPageTest Lighthouse run on a Pixel 6a profile as a gate.
- **Reduced-motion on View Transitions.** `animation-duration: 1ms` is the current recommended pattern, but the VT spec is evolving. Re-check before ship.

---

## 11. Tokens module — drop-in

### 11.1 CSS custom properties

```css
/* src/styles/motion.css */
:root {
  /* Easings */
  --ease-default: cubic-bezier(0.22, 1, 0.36, 1);   /* Observer */
  --ease-system:  cubic-bezier(0.65, 0, 0.35, 1);   /* Stepper */
  --ease-ambient: cubic-bezier(0.4, 0, 0.6, 1);     /* Drift */

  /* Durations */
  --dur-tick:       80ms;    /* Tick:       UI feedback */
  --dur-fast:      160ms;    /* Settle:     tooltip, small reveals */
  --dur-base:      240ms;    /* Observe:    default UI */
  --dur-slow:      400ms;    /* Propagate:  orchestrated reveals, BT tick */
  --dur-narrative: 800ms;    /* Replan:     route transitions */
  --dur-scene:    1200ms;    /* Wake:       hero, narrative convergence */

  /* Staggers */
  --stagger-tight:  30ms;    /* chips, horizontal rows */
  --stagger-base:   60ms;    /* vertical lists, belief bars, BT nodes */
  --stagger-loose: 120ms;    /* cluster-panel children, plan unfolding */

  /* Heartbeat */
  --heartbeat-period: 2400ms;

  /* Replan coordinate injection targets (set by client-side handler) */
  --replan-x: 50%;
  --replan-y: 50%;
}

@media (prefers-reduced-motion: reduce) {
  :root {
    --dur-tick: 0ms;
    --dur-fast: 0ms;
    --dur-base: 0ms;
    --dur-slow: 0ms;
    --dur-narrative: 0ms;
    --dur-scene: 0ms;
    --stagger-tight: 0ms;
    --stagger-base: 0ms;
    --stagger-loose: 0ms;
    /* --heartbeat-period intentionally left at 2400ms:
       the reduced variant renders peak-amplitude held, not zero-duration.
       JS components branch on useReducedMotion() and do not read this var. */
  }
}
```

### 11.2 TypeScript tokens module

```ts
// src/tokens/motion.ts
export const easings = {
  /** Observer — default UI curve, confident no-overshoot settle. */
  default: [0.22, 1, 0.36, 1] as const,
  /** Stepper — mechanical S-curve for technical/computation motifs. */
  system:  [0.65, 0, 0.35, 1] as const,
  /** Drift — always-on breathing for ambient elements. */
  ambient: [0.4, 0, 0.6, 1] as const,
} as const;

export const durations = {
  /** Tick — 80ms. UI feedback. */
  tick:      80,
  /** Settle — 160ms. Small reveals. */
  fast:     160,
  /** Observe — 240ms. Default UI. */
  base:     240,
  /** Propagate — 400ms. Orchestrated reveals. */
  slow:     400,
  /** Replan — 800ms. Route transitions. */
  narrative: 800,
  /** Wake — 1200ms. Hero, narrative convergence. */
  scene:   1200,
} as const;

export const staggers = {
  /** 30ms — horizontal rows of same-kind items. */
  tight: 30,
  /** 60ms — vertical lists, BT nodes, belief bars. */
  base:  60,
  /** 120ms — cluster-panel children, plan unfolding. */
  loose: 120,
} as const;

/** Max children in a single staggered chain. Beyond this, switch to per-item whileInView. */
export const MAX_STAGGER_CHAIN = 8;

/** Heartbeat cycle length in ms. */
export const HEARTBEAT_PERIOD_MS = 2400;

/** Sensor-handoff modality names (for reduced-motion labels). */
export const SENSOR_LABELS = {
  vision:   "VISION / RGB",
  stereo:   "STEREO / DEPTH",
  lidar:    "LIDAR / SWEEP",
  mapToPlanner: "MAP → PLANNER",
  worldToIntent: "WORLD → INTENT",
  intentToBus:  "INTENT → BUS",
  introspection: "INTROSPECTION",
  radar:    "RADAR / OUTWARD",
} as const;

export type SensorModality = keyof typeof SENSOR_LABELS;

/** FM transition preset builders. */
export const transition = {
  /** Default UI transition. */
  ui: (duration: number = durations.base) => ({
    duration: duration / 1000,
    ease: easings.default,
  }),
  /** System/mechanical transition for technical motifs. */
  system: (duration: number = durations.slow) => ({
    duration: duration / 1000,
    ease: easings.system,
  }),
  /** Ambient transition for always-on loops. */
  ambient: (duration: number = HEARTBEAT_PERIOD_MS) => ({
    duration: duration / 1000,
    ease: easings.ambient,
    repeat: Infinity,
  }),
} as const;

/** Hook: returns a scalar that reduced-motion users see as 0. */
export function useMotionScalar(reduced: boolean) {
  return reduced ? 0 : 1;
}
```

Agent 9: drop `motion.css` into the global style import, `motion.ts` under `src/tokens/`. The rest of the signature-animation components reference these tokens exclusively — no magic numbers.

---

*End of 06-motion-spec.md — Agent 6, Motion Designer.*
