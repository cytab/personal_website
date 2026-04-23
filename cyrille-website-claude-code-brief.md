# Personal Website Project — Cyrille Tabe
## Claude Code Multi-Agent Execution Brief

> **How to use this file**: Open Claude Code at the root of your project, then run:
> `claude "Read ./cyrille-website-claude-code-brief.md and execute it phase by phase. Use the Task tool to spawn each specialist as a sub-agent using the exact prompts in Section 4. Do not skip phases. Stop and summarize at every phase gate for my approval."`

---

## 0. The North Star

A personal website for **Cyrille Tabe** — robotics software engineer, autonomy researcher, systems builder — whose visitors **leave renewed and inspired**, as if they just stepped out of the mind of someone actively building intelligent machines.

This is not a portfolio. It is a *manifesto rendered in pixels*. It must feel alive — the way a robot "wakes up" when you turn it on. Sensors initializing. A belief state converging. A plan forming. A world being perceived.

**If a visitor is an engineer, they should want to build with you.**
**If a visitor is a recruiter, they should want to hire you.**
**If a visitor is a curious mind, they should walk away with a new idea rattling in their head.**

---

## 1. About the Subject (source material for all agents)

**Name**: Cyrille Tabe
**Role**: Robotics Software Engineer @ Noovelia (Montréal) · Consultant @ Odu Technologie
**Education**: M.Eng. Electrical Engineering, Polytechnique Montréal
**Languages**: French / English (fully bilingual — site must support both)

**Technical core** — five research clusters that define the intellectual architecture of the site:

1. **Perception & Spatial Intelligence** — SLAM, multi-sensor fusion, 3D mapping, computer vision, ZED 2i + NVBlox + PeopleSegNet pipelines
2. **Planning & Decision Under Uncertainty** — POMDPs, MCTS, nonlinear MPC, 4D lattice planners, behavior trees, stochastic games
3. **Human Understanding** — intent recognition, cognitive state modeling, affect, biometrics
4. **Systems & Infrastructure** — ROS 2, MQTT, edge-cloud orchestration, MCP, local-first architectures
5. **Markets & Quantitative Reasoning** — forex, risk management, prop trading systems (FTMO $200K funded)

**Frontier bridges** (what Cyrille is actively pulling into his work): neuroscience of decision-making, causal inference, model-based & hierarchical RL, nonlinear control, affective computing, event-driven architectures, market microstructure, information theory, HCI, probabilistic programming.

**Flagship projects** (these deserve real estate on the site):

- **RobotClaw** — decentralized local-first AI assistant. POMDP belief state + MCTS intent tree. Ollama (qwen2.5:7b), MQTT bus, ChromaDB RAG, SQLite audit, multi-platform sensors (laptop, phone via Flutter, watch). Scheduled for open-source / HN launch.
- **OpenClaw** — TypeScript/Node.js action execution backend, 50+ integrations.
- **Drone autonomy stack** — Jetson Orin + PX4 + edge AI.
- **Prop Guardian** — FTMO trading compliance and risk tool (screenshot AI vision, news radar, multi-firm profiles).
- **Noovelia work** — behavior trees, 4D lattice planner + MPC, YOLOv8, Redis Queue orchestration.
- **Odu Technologie work** — SLAM-based sidewalk robot navigation.

**Personality signals** — builder-first, systems-level thinker. Loves local-first and privacy-preserving architectures. Learns by building end-to-end. The site's voice should be **confident, specific, technical without jargon theatrics, and quietly ambitious**.

---

## 2. Team Composition

Fourteen specialist agents, spawned by Claude Code via the `Task` tool, working in four phases.

| # | Agent | Phase |
|---|---|---|
| 1 | Creative Director — Strategy & Positioning | 1 |
| 2 | Creative Director — Narrative & Voice | 1 |
| 3 | Art Director / Creator | 1 → 2 |
| 4 | Senior UX/UI — Information Architect | 2 |
| 5 | Senior UX/UI — Interaction Designer | 2 |
| 6 | Senior UX/UI — Motion & Micro-interaction | 2 |
| 7 | Senior UX/UI — Typography & Layout | 2 |
| 8 | Senior UX/UI — Accessibility & i18n | 2 |
| 9 | Senior Software Engineer — Frontend Architecture | 3 |
| 10 | Senior Software Engineer — 3D / WebGL / Perf | 3 |
| 11 | QA Tester — Manual / UX Audit | 4 |
| 12 | QA Tester — Automated E2E | 4 |
| 13 | Bug Hunter — Visual Regression & Cross-browser | 4 |
| 14 | Bug Hunter — Security, Edge Cases, Resilience | 4 |

---

## 3. Execution Phases

Phase 1 — Strategy & Direction (agents 1, 2, 3 parallel)
Phase 2 — Design System & IA (agents 4–8)
Phase 3 — Implementation (agents 9 & 10)
Phase 4 — Quality Gate (agents 11–14 parallel)

See full brief in conversation. Agent prompts live in Section 4 of the original brief and are executed verbatim by Claude Code.
