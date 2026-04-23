# Subject Dossier — Cyrille Tabe

> Source material for every agent. Do not alter. If information here conflicts with the brief, the brief wins; flag the discrepancy in your deliverable.

## Identity

**Name**: Cyrille Tabe
**Role**: Robotics Software Engineer @ Noovelia (Montréal) · Consultant @ Odu Technologie
**Education**: M.Eng. Electrical Engineering, Polytechnique Montréal
**Languages**: French / English (fully bilingual — site must support both)
**Location**: Montréal, Québec, Canada
**Contact email**: cyrilletabe@gmail.com

## The North Star

A personal website whose visitors **leave renewed and inspired**, as if they just stepped out of the mind of someone actively building intelligent machines.

This is not a portfolio. It is a *manifesto rendered in pixels*. It must feel alive — the way a robot "wakes up" when you turn it on. Sensors initializing. A belief state converging. A plan forming. A world being perceived.

- If a visitor is an engineer, they should want to build with you.
- If a visitor is a recruiter, they should want to hire you.
- If a visitor is a curious mind, they should walk away with a new idea rattling in their head.

## Technical Core — Four Research Clusters

These four clusters form the intellectual architecture of the site.

1. **Perception & Spatial Intelligence** — SLAM, multi-sensor fusion, 3D mapping, computer vision, ZED 2i + NVBlox + PeopleSegNet pipelines.
2. **Planning & Decision Under Uncertainty** — POMDPs, MCTS, nonlinear MPC, 4D lattice planners, behavior trees, stochastic games.
3. **Human Understanding** — intent recognition, cognitive state modeling, affect, biometrics.
4. **Systems & Infrastructure** — ROS 2, MQTT, edge-cloud orchestration, MCP, local-first architectures.

> **Private scope (do NOT reference on the public site)**: markets / quantitative / trading work is deliberately private. No mentions, no project cards, no proof points derived from trading accounts. Agents must not invent surrogate language to hint at it either.

## Frontier Bridges

What Cyrille is actively pulling into his work:
neuroscience of decision-making, causal inference, model-based & hierarchical RL, nonlinear control, affective computing, event-driven architectures, market microstructure, information theory, HCI, probabilistic programming.

## Flagship Projects

- **RobotClaw** — decentralized local-first AI assistant. POMDP belief state + MCTS intent tree. Ollama (qwen2.5:7b), MQTT bus, ChromaDB RAG, SQLite audit, multi-platform sensors (laptop, phone via Flutter, watch). Scheduled for open-source / HN launch.
- **OpenClaw** — TypeScript/Node.js action execution backend, 50+ integrations.
- **Drone autonomy stack** — Jetson Orin + PX4 + edge AI.
- **Noovelia work** — behavior trees, 4D lattice planner + MPC, YOLOv8, Redis Queue orchestration.
- **Odu Technologie work** — SLAM-based sidewalk robot navigation.

## Personality Signals

Builder-first, systems-level thinker. Loves local-first and privacy-preserving architectures. Learns by building end-to-end.

The site's voice should be: **confident, specific, technical without jargon theatrics, and quietly ambitious.**

## Non-Negotiables (from the brief)

- **Hosting: GitHub Pages (github.io).** Static export only. No server runtime. Stack choice: **Astro** (MDX-native, zero-JS default, React islands for 3D/motion).
- Bilingual (FR/EN) from day one — static `/en/*` and `/fr/*` routes (no middleware available on GH Pages).
- No Google Analytics. Privacy-preserving analytics only (Plausible cloud or omit).
- Self-hosted fonts.
- Contact: mailto or a static-friendly form relay (Formspree / Web3Forms). No server endpoints.
- Accessibility: WCAG 2.2 AA verified.
- Lighthouse ≥ 95 on all four scores before ship.
- No stock photography. Ever.

## Transitions — elevated mandate (user directive)

Transitions must be creative, meaning-carrying, and tied to Cyrille's work. They are not decoration.
- **Route-level** = a *replan*. Old path dissolves into uncertainty; new path expands lattice-style.
- **Section-level** (between the 7 narrative beats) = a *sensor handoff*. Each cluster enters as if a new modality just came online (vision → lidar → proprioception).
- **Component-level** = *belief-state convergence*. Hover/focus tightens an uncertainty ellipse around the content.
- Every transition has a named metaphor. Reduced-motion fallback is a first-class static equivalent, not a disabled state.

## Asset generation (procedural-first, ask-the-user for decorative only)

No stock. **Real project outputs are private and off-limits** — no SLAM captures, no planner frames, no drone telemetry, no BT screenshots, no field footage.

- All public visuals (hero, clusters, nav illustration, transition backgrounds) are **procedurally synthesized** to evoke the aesthetic: Poisson-disk point clouds, generated occupancy grids, computed uncertainty ellipses, simulated BT trees.
- The orchestrator (Claude Code) may ask Cyrille to generate *decorative* imagery (e.g., ambient transition backgrounds) when procedural options fall short. Each such request goes through the orchestrator with a clear brief.
- Portrait photo is **optional**.
- CV PDFs expected at `public/cv/` (compiled from LaTeX if the build can; otherwise Cyrille drops them).

## Banned Vocabulary

"passionate", "innovative", "cutting-edge", "game-changer", "solutions", "driven",
"let's dive in", "I'm excited to announce", LinkedIn-speak in general.

## Success Criteria

At least three test readers (one non-technical) report the site *made them feel something*. If not, iterate.
