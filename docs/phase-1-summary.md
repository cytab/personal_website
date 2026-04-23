# Phase 1 Synthesis — Strategy & Direction

## Positioning (Agent 1)
> Cyrille Tabe is a robotics software engineer building **decision-making machines that behave well under uncertainty** — from 4D lattice planners on factory-floor AGVs to a local-first AI assistant that reasons with a POMDP belief state on his own laptop.

**The 5 non-negotiable truths:**
1. Uncertainty is the protagonist — the through-line across every project.
2. He ships on real hardware — AGVs, sidewalk robots, Jetson drones, funded trading.
3. Local-first is a worldview, not a feature — the site itself must embody it.
4. He bridges disciplines deliberately — neuroscience, microstructure, affect, control.
5. The site is an instrument, not a résumé — it performs, it does not summarise.

## Voice & Narrative (Agent 2)
- **Voice triple**: precise, unhurried, wry.
- **Anti-voice**: breathless, corporate-translucent, gatekeeping.
- **Hero statement (14 words)**: *"I build machines that perceive, decide, and act — and I write down what they teach me."*
- **Scroll arc (7 beats)**: hook → orientation → proof → depth → frontier → signal → invitation.
- Full copy: hero, orientation (81w), 5 cluster paragraphs (~70w each), 6 project cards (≤40w, *does / taught / next*), closing invitation (39w), FR for hero + closing, 25-item micro-copy library, 3-stage "wake-up" loader script.

## Art Direction (Agent 3)
- **Mood**: OP-1 manual ✕ rviz-at-3am ✕ NYT long-read. Dense, instrument-like, editorially serious, warm.
- **Palette (dark-first, warm-technical)**:
  - Graphite Black `#0B0D0E` · Instrument Panel `#15191B` · Lifted Deck `#1F2427`
  - Bone text `#E6E1D6` (15.8:1 AAA) · Signal Amber `#F3A03B` primary (9.1:1 AAA) · Plasma Cyan `#62E0C8` accent (11.9:1)
  - *Amber is currency, not confetti.*
- **Type**: JetBrains Mono (display/mono) + Inter (body). 6-size scale. Numerics always mono.
- **Chosen hero**: *"Sensors Initializing"* — dark page wakes, points stream in, belief indicator sharpens under the name, cursor acts like a sensor target. Escalation path: live SLAM of the portfolio.
- Motifs: point-cloud/SLAM map, behavior-tree nav, uncertainty ellipses per cluster, belief-state loader, lattice grid.

## Cross-agent alignment
- All three independently landed on **uncertainty as the through-line** — the positioning, the narrative arc, the visual motifs all compound.
- The "wake-up" motif is shared across Agents 2 and 3 (Agent 2's 3-stage loader ↔ Agent 3's "Sensors Initializing" hero). This is the signature moment.
- Local-first is load-bearing across all three.

## Flagged concerns (to resolve before or during Phase 2)
1. **IA decision**: Agent 1 warns that using the 5 clusters as top-level nav risks flattening the story; recommends a *planning-under-uncertainty spine*. → Agent 4 must decide.
2. **Trading cluster weight**: Agent 1 warns it is load-bearing evidence but must not get equal homepage real estate to robotics (risk of losing the recruiter persona). → Agent 4 must decide.
3. **FR translation**: Agent 2 only translated hero + closing. Professional robotics-literate translator needed post-ship. → noted for Agent 8 (i18n).
4. **Wake-up loader ↔ hero coupling**: Agent 2 warns it is a narrative promise; if Agent 10 can't deliver it visually, the hero loses half its punch. → priority for Agent 10.
5. **Contact form**: Agent 2 assumes a mail pipeline; mailto-only requires a copy rewrite. → see GitHub Pages note below.
6. **"Made them feel something" feedback loop**: no agent owns it; needs a test-reader instrument pre-launch.
7. **WebGL2 baseline**: Agent 3 wants an engineering decision on minimum GPU support. → Agent 10.
8. **Motion budget on low-end devices**: Agent 3 flags; to be spec'd by Agent 6 and enforced by Agent 10.

## Deliverables on disk
- `docs/agents/01-brand-brief.md`
- `docs/agents/02-narrative-architecture.md`
- `docs/agents/03-art-direction.md`
