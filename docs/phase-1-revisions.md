# Phase 1 Revisions (2026-04-23)

> **Every Phase 2+ agent MUST read this file in addition to the dossier.** Where Agent 1/2/3 outputs conflict with this file, this file wins. The original Phase 1 briefs are not rewritten — only the following items are superseded.

## 1. Clusters drop from 5 to 4
Remove **Markets & Quantitative Reasoning** from all public surfaces. Trading work is private. Do not invent surrogate language to hint at it (no "decision systems across domains where money moves" etc.).

Concretely:
- Agent 2's cluster paragraph #5 is **deleted**. Four cluster paragraphs only.
- Agent 1's truth #2 is revised to drop "funded trading accounts": *"He ships on real hardware — AGVs, sidewalk robots, Jetson drones — and on the failure modes that only show up in the field."*
- Flagship projects drop **Prop Guardian**. Five project cards total: RobotClaw, OpenClaw, Drone stack, Noovelia lattice planner, Odu SLAM.

## 2. Hosting: GitHub Pages
**Stack is Astro** (not Next.js). Static export, no server runtime. Implications:
- i18n is static routing only: `/` (EN default) and `/fr/` — no middleware.
- Contact form is mailto or Formspree/Web3Forms. No API routes.
- Image optimization is build-time (sharp via Astro's `<Image>`).
- Deployment target: `gh-pages` branch via `actions/deploy-pages@v4`. Custom domain via CNAME if Cyrille provides one.
- Drop the Docker / self-hosted instructions from Agent 9's mandate; keep the local-first *ethos* in the content, not the infra.

## 3. IA decision pinned
Agent 4 will pin a **planning-under-uncertainty spine** (Agent 1's recommended alternative), not 5-cluster flat nav. The user has opted to revise later if needed.

## 4. Transitions are first-class (user directive)
Transitions must be creative, meaning-carrying, and tied to Cyrille's work. They are not decoration. Elevated into the mandates for Agents 5, 6, 10:

- **Route-level** = a *replan*. Old path dissolves into uncertainty; new path expands lattice-style. Not a cross-fade.
- **Section-level** (between the 7 narrative beats) = a *sensor handoff*. Each cluster enters as if a new modality just came online (vision → lidar → proprioception).
- **Component-level** = *belief-state convergence*. Hover/focus tightens an uncertainty ellipse around the content.

Every transition carries a named metaphor. Every transition has a first-class static reduced-motion equivalent (not a disabled version).

## 5. Asset pipeline
No stock. When real data is unavailable, Claude Code asks Cyrille to generate (SLAM maps, planner output frames, drone telemetry, behavior-tree screenshots). Agents may surface asset requests in their deliverables.
