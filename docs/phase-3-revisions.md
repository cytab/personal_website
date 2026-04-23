# Phase 3 Revisions (2026-04-23)

> Supersedes earlier "asset requests" language. Agent 10 MUST honor this.

## 1. Asset policy — all public visuals are procedural/synthetic

Real project outputs are **off-limits** as public-site assets. Do not request, reference, or visually imply:

- Real SLAM maps or point-cloud captures (Noovelia / Odu / personal)
- 4D lattice planner output frames
- Drone telemetry screenshots or videos
- Behavior-tree screenshots from deployed robots
- Any field deployment footage

These belong to confidential work. The site evokes the *aesthetic* of these systems through **procedurally generated visuals** — synthetic but plausible (Poisson-disk sampled point clouds, generated occupancy grids, computed uncertainty ellipses, simulated BT trees).

## 2. What the user will generate on request

The orchestrator (Claude Code) may ask Cyrille for **decorative imagery** the site needs but cannot be procedurally synthesized at quality. Examples:
- Transition backgrounds (ambient loops if procedural feels thin)
- A cluster-panel atmospheric still
- Closing-invitation atmosphere

Each request goes through the orchestrator with a clear brief. Do not bake asset requests into the site code as TODOs — surface them to the orchestrator first.

## 3. What Cyrille may still optionally provide

- **Portrait photo** — optional, not required. The positioning (*"the site is an instrument, not a résumé"*) works without a face. If Cyrille provides one, it goes on `/about/`. If not, ship without.
- **CV PDFs** — `public/cv/cyrille-tabe-cv-en.pdf` (+ FR). Build pipeline in Agent 9's CI attempts `latexmk` of the existing `.tex`; if it fails, Cyrille drops a prebuilt PDF.
- **Custom domain** — `public/CNAME` if he has one.

## 4. Agent 10 scope, updated

All hero / cluster / nav illustrations are **fully procedural**. No placeholder hooks "to be filled with real data later" — that data is never coming. Build the final visuals procedurally from Agent 3's art direction and Agent 6's motion spec.

## 5. Agent 9's asset-request list — corrected

The following items from Agent 9's handoff report are **removed**:
- "Real data assets (SLAM map / planner frame / POMDP trace / ROS graph) — one per cluster panel + one drone telemetry capture."
- "Behavior-tree screenshot from a deployed Noovelia robot."

These are now Agent 10's procedural scope. Remaining items in Agent 9's handoff list stand as stated.
