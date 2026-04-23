# 01 — Brand Brief

Author: Agent 1 (Creative Director)
Status: Source of truth for Agents 2–14. Deviations must be flagged, not silently made.

---

## Positioning

**Cyrille Tabe is a robotics software engineer building decision-making machines that behave well under uncertainty — from 4D lattice planners on factory-floor AGVs to a local-first AI assistant that reasons with a POMDP belief state on his own laptop.**

Trade-off: this line privileges the *planning-under-uncertainty* throughline over perception, trading, or HCI because it is the spine connecting Noovelia, RobotClaw, drone autonomy, and Prop Guardian — cutting it would make the site a list of unrelated projects instead of one coherent mind.

---

## Personas

### A. The Robotics Recruiter / Hiring Manager
Profile: engineering lead at a robotics firm (AGV, AMR, humanoid, drone, surgical), ML platform lead at a frontier lab, or a CTO scouting autonomy talent. Scans a site in 45 seconds.
**Walking away with**: "This person ships production autonomy on real hardware — ROS 2, behavior trees, 4D lattice + MPC at Noovelia, SLAM on sidewalk robots at Odu, PX4 + Jetson Orin drones — and he also builds his own decision systems from scratch. I need to talk to him this week."

### B. The Collaborator / Fellow Builder
Profile: another engineer or researcher working on local-first AI, POMDPs, agent architectures, or autonomy — someone who might co-author, contribute to RobotClaw, or trade ideas at 1 a.m.
**Walking away with**: "He is thinking about belief-state reasoning and MCTS intent trees the way I am, but he actually wired it to MQTT and Ollama. His RobotClaw repo is where I want to open an issue tonight."

### C. The Curious Intelligent Stranger
Profile: a designer, a PM, a journalist, a sharp non-technical friend-of-a-friend who landed here from a link.
**Walking away with**: "I did not know robots had to *guess what the world looks like* before they move. The person who built this site thinks about machines the way a neuroscientist thinks about minds, and now I am thinking about it too."

Trade-off: three personas, not five — dropping "prospective client" and "student" because the site is a positioning instrument, not a lead-gen funnel; consulting inquiries are a side-effect of A, not a target.

---

## Competitive Landscape

Six personal sites worth studying. Names only — no content lifted.

1. **Andrej Karpathy (karpathy.ai / blog)** — Steal: essayistic authority earned through specificity (micrograd, nanoGPT). Avoid: the minimalism reads as understatement only because he is already famous; Cyrille cannot yet coast on recognition.
2. **Lilian Weng (lilianweng.github.io)** — Steal: long-form technical posts as the primary artifact, not "projects." Avoid: monochrome academic chrome — the site feels like a PDF, and we want something alive.
3. **Chelsea Finn (ai.stanford.edu/~cbfinn)** — Steal: tight project-to-publication mapping, each thing has a one-line reason to exist. Avoid: the university-homepage aesthetic; it signals "I am hosted by an institution," which is the opposite of what an independent builder wants.
4. **Sebastian Raschka (sebastianraschka.com)** — Steal: a single clear throughline (teaching deep learning) everything else orbits. Avoid: newsletter-heavy layout — we are not running a media business.
5. **Boston Dynamics research pages (generic reference for robotics labs)** — Steal: video-first storytelling — a robot moving convinces faster than any paragraph. Avoid: corporate polish that sands the engineer's voice off.
6. **Simon Willison (simonwillison.net)** — Steal: TIL / now / projects / writing as independent streams that update at different cadences, proving the person is alive. Avoid: the density — it works because Simon has 20 years of archive; Cyrille needs curation, not a firehose.

Trade-off: skipped Distill, Gwern, and OpenAI researcher pages — they are tempting but either defunct, eccentric in ways that do not transfer, or institutionally backed in ways Cyrille is not.

---

## Elevator Narrative (120 words)

Cyrille Tabe is a robotics software engineer in Montréal. At Noovelia he ships the autonomy stack for industrial AGVs — behavior trees, a 4D lattice planner coupled to nonlinear MPC, YOLOv8 perception, Redis-orchestrated fleets. At Odu Technologie he puts SLAM on sidewalk robots. After hours he is building RobotClaw: a local-first AI assistant that maintains a POMDP belief state over user intent, explores it with MCTS, and runs entirely on his own hardware — Ollama, MQTT, ChromaDB, no cloud round-trip. It matters because the next decade of intelligent machines will be judged on how well they reason under uncertainty, not how large their models are. Next: open-source launch of RobotClaw, a drone autonomy stack on Jetson Orin, and long-form writing on belief-state systems.

Word count: 120.

---

## The Five Non-Negotiable Truths

These are the north stars. Every downstream agent — voice, art direction, IA, motion, code — must serve them. If a decision breaks one, cut the decision.

### 1. Uncertainty is the protagonist.
Cyrille's work is unified by one question: how should a machine act when it does not know what the world looks like? POMDPs, MCTS, MPC, SLAM, belief states, risk management in trading — all the same question in different clothing. The site must make this legible. Without this truth, the portfolio reads as six unrelated hobbies.

### 2. He ships on real hardware.
Noovelia AGVs, Odu sidewalk robots, Jetson Orin drones, FTMO-funded trading account. This is not a reading list or a paper trail — these are systems that move, fail, and are debugged at 2 a.m. The site must privilege artifacts that exist in the physical or financial world over abstractions.

### 3. Local-first is a worldview, not a feature.
RobotClaw runs on-device. The site itself will deploy via Docker alongside Vercel. No Google Analytics. Self-hosted fonts. This is consistent with a builder who thinks sovereignty over the stack is a first principle. The site must embody this — it should behave correctly with JavaScript disabled, on a plane, under a bridge.

### 4. He bridges disciplines deliberately.
Neuroscience of decision-making feeding into RL. Market microstructure informing planning. Affective computing meeting HCI. These are not name-drops — they are active borrowings. The site must show the wiring between fields, not list them as tags.

### 5. The site is an instrument, not a résumé.
The mandate is: visitors leave renewed and inspired, as if they stepped out of the mind of someone actively building intelligent machines. A résumé summarises. An instrument performs. The site must feel like a running process — sensors initialising, a belief state converging — not a static document.

---

## Concerns for Downstream Agents

- **To Agent 2 (Voice / Narrative):** the dossier's "manifesto rendered in pixels" framing is powerful but seductive. Watch for over-poeticising — "a robot waking up" is a metaphor, not a tagline. Keep the technical spine load-bearing; let the poetry decorate, not structure.
- **To Agent 3 (Art Direction):** Truth 3 (local-first as worldview) should visibly constrain your palette and asset weight. No 4MB hero videos. Motion must be cheap and legible even on a Jetson browser.
- **To Agent 4+ (IA / content):** the five research clusters in the dossier are intellectually accurate but dangerous as top-level navigation — five equal buckets flatten the story. Recommend promoting *planning under uncertainty* to a spine and letting perception/HCI/infrastructure/markets branch from it. Flag, not decision — IA owns the call.
- **On the trading cluster:** Markets & Quantitative Reasoning is real and impressive (FTMO $200K funded, Prop Guardian) but can dilute the robotics recruiter's read if given equal weight on the homepage. Suggest: present it as evidence of the *same* uncertainty-reasoning spine applied to a different domain, not as a parallel career.
- **Bilingual (FR/EN):** the positioning sentence must translate without losing "behave well under uncertainty." In French, "bien se comporter sous incertitude" risks sounding like etiquette. Agent 2 should workshop a French equivalent that keeps the technical weight.
- **Success criterion is emotional.** The dossier says three test readers must report the site "made them feel something." Build instrumentation for this early — a feedback mechanism on the site itself, or a pre-launch reader panel. Not my lane, but unowned risk if no one picks it up.
