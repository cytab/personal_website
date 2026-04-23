# 02 — Narrative Architecture & Voice

**Author**: Agent 2 — Creative Director, narrative & voice
**Status**: Draft v1
**Positioning context**: Agent 1's brand brief was not available at time of writing. This deliverable operates *pre-positioning*, grounded directly in `docs/subject-dossier.md`. Expect minor tonal realignment once Agent 1 lands — the voice triple and narrative arc are designed to absorb those edits without a rewrite.

---

## 1. Voice

### Three adjectives
1. **Precise** — the right word, used in its technical sense, without hedging.
2. **Unhurried** — sentences that trust the reader to stay with them.
3. **Wry** — aware of its own seriousness; willing to undercut itself before anyone else does.

### Anti-adjectives (what the voice is *not*)
- **Breathless** — no exclamation, no announcement energy, no "thrilled to share."
- **Corporate-translucent** — no words that dissolve on contact (*solutions, driven, synergy*).
- **Gatekeeping** — no jargon worn as a badge. Technical terms stay because they carry weight, not because they filter readers.

### Show, don't tell

**On-voice**
- *"A behavior tree is a confession: it's what you believed the robot would need to decide, written down before the robot had to decide it."*
- *"The lattice planner runs at 20 Hz on the forklift. The rest of the stack exists so those 20 Hz mean something."*

**Off-voice**
- *"I'm passionate about leveraging cutting-edge AI solutions to drive innovation in robotics."* — banned vocabulary, zero specificity, no author behind the sentence.
- *"Let's dive into how I'm building the future of autonomous systems!"* — announcement energy, false intimacy, promises the page can't keep.

### Voice rules of thumb
- First-person singular. Cyrille speaks for himself; no royal *we*, no team-ghostwriting.
- Short sentences earn long ones. A clause-heavy paragraph is fine if the previous one was four words.
- Concrete nouns over abstract nouns. *A forklift in a warehouse* beats *an industrial automation context.*
- Translates well to French: avoid English-only idioms, phrasal verbs with no FR equivalent, and pun-dependent constructions.

---

## 2. Narrative architecture (scroll arc)

Not a sitemap — a single continuous thought, staged across a scroll. The site behaves like a robot waking up: sensors initialize, a belief state converges, a plan forms, an invitation is extended.

| Beat | Role in the arc | What the visitor should feel |
|------|-----------------|------------------------------|
| **1. Hook** — Hero statement + ambient "wake-up" motion | First contact. A thesis, not a greeting. | Curiosity. "Who is talking, and why does this sentence feel different." |
| **2. Orientation** — "What I'm building" (~80 words) | Anchors the thesis in actual work: Noovelia, Odu, RobotClaw. | Relief. This is a builder, not a brand. |
| **3. Proof** — Flagship project cards (6) | Evidence before exposition. Ships before slides. | Trust. The work exists; I can inspect it. |
| **4. Depth** — Five research clusters, each its own panel | The intellectual spine. How the projects connect. | Intrigue. These aren't unrelated hobbies — there's a shape. |
| **5. Frontier** — "What I'm pulling in" (neuroscience, causal inference, market microstructure…) | Shows the edges of current thinking, honestly unfinished. | Recognition. This person is still learning in public. |
| **6. Signal** — Writing / notes / small experiments | A lower-stakes doorway for returning visitors. | Welcome. There's a reason to come back. |
| **7. Invitation** — Closing block + contact | The "renewed and inspired" exhale. | Quiet energy. A reason to send one email, or build one thing tonight. |

**Structural principle**: each beat can be lifted out and read on its own. A visitor who lands mid-scroll should find a complete thought, not a sentence fragment. The arc rewards the full scroll; it does not require it.

---

## 3. Core copy blocks (English)

### Hero statement
**Section**: Home / top of scroll
**Constraint**: ≤ 15 words
**Word count**: 14

> I build machines that perceive, decide, and act — and I write down what they teach me.

### "What I'm building" — short-form
**Section**: Orientation, directly below hero
**Constraint**: ~80 words
**Word count**: 81

> I'm a robotics software engineer in Montréal. By day, I work on autonomy at Noovelia — behavior trees, a 4D lattice planner, an MPC that has to agree with physics in real time. On the side, I consult with Odu Technologie on SLAM for sidewalk robots, and I build RobotClaw, a local-first AI assistant that keeps a belief state about the person it's trying to help. The common thread: decisions under uncertainty, written in code that has to run tomorrow morning.

---

### Research clusters — one paragraph each
**Section**: Depth panel. Each cluster gets its own viewport with its own visual treatment (Agent 3's call).
**Constraint**: ~70 words each, readable by a smart non-specialist, respected by an expert.

#### Cluster 1 — Perception & Spatial Intelligence
**Word count**: 71

> A robot's first job is to agree with reality. I work on the pipeline that gets it there: ZED 2i stereo, NVBlox volumetric mapping, PeopleSegNet for the humans in the frame, SLAM when GPS isn't an option. What interests me is the seam — where raw sensor noise becomes a map the planner can trust. Most bugs in autonomy are perception bugs wearing a planner's costume. I spend a lot of time there.

#### Cluster 2 — Planning & Decision Under Uncertainty
**Word count**: 69

> Once a robot sees, it has to choose. I write planners that assume the world will surprise them: POMDPs for belief-space reasoning, MCTS for intent trees, nonlinear MPC for control that respects dynamics, a 4D lattice planner for a forklift that has to agree with time as well as space. Behavior trees hold the whole thing together. The question underneath all of it: what should I do when I'm not sure?

#### Cluster 3 — Human Understanding
**Word count**: 70

> The hardest sensor to model is the person in the room. I'm building toward machines that read intent before they read commands — cognitive state, affect, attention, the small biometric signals that tell you a user is confused before they've said so. This is less about surveillance and more about politeness: a system that waits for the right moment, asks the right question, and doesn't interrupt a thought it doesn't understand.

#### Cluster 4 — Systems & Infrastructure
**Word count**: 70

> Autonomy is a distributed systems problem pretending to be a robotics problem. I build on ROS 2 for the robot, MQTT for the nervous system between devices, Redis Queue for work that can wait, and an emerging MCP layer for tools the model can actually call. I prefer local-first: the network is a privilege, not a dependency. If it can run on the device, it should run on the device.

#### Cluster 5 — Markets & Quantitative Reasoning
**Word count**: 71

> Forex is a robotics problem with worse sensors and no map. I trade a funded FTMO account with the same instincts I use in autonomy — risk as a hard constraint, not a sentiment; drawdown as a state variable; news as an exogenous disturbance. Prop Guardian is the tool I built to keep myself honest: screenshot-driven compliance, multi-firm profiles, a news radar. The markets taught me what stochastic really means.

---

### Project cards — flagships
**Section**: Proof panel.
**Constraint**: ≤ 40 words each. Structure: *what it does · what it taught me · what's next.*

#### RobotClaw
**Word count**: 40

> A local-first AI assistant with a POMDP belief state and an MCTS intent tree over my life. Taught me that memory is the hard part, not reasoning. Next: open-source release, HN launch, and a phone client that actually listens.

#### OpenClaw
**Word count**: 40

> The action backend behind RobotClaw — TypeScript, Node, fifty-plus integrations. Taught me that integrations are a taxonomy problem before they're an engineering one. Next: pluggable tool manifests and an MCP bridge so other models can drive it.

#### Drone autonomy stack
**Word count**: 39

> Jetson Orin with PX4 and edge AI, for drones that have to think before the link drops. Taught me the cost of every watt and every millisecond in flight. Next: onboard VIO and a tighter perception-to-control loop.

#### Prop Guardian
**Word count**: 40

> A compliance and risk tool for prop-firm traders: screenshot vision, news radar, multi-firm profiles, a $200K FTMO account in production. Taught me risk is a UX problem. Next: a broker-agnostic risk engine and a public compliance dashboard.

#### Noovelia lattice planner
**Word count**: 39

> A 4D lattice planner with nonlinear MPC on an autonomous forklift — behavior trees on top, YOLOv8 for perception, Redis Queue for orchestration. Taught me a good planner is mostly a great cost function. Next: I can't say yet.

#### Odu SLAM
**Word count**: 39

> SLAM-based navigation for a sidewalk robot in real Montréal weather — ice, pedestrians, occluded lidar returns, the works. Taught me the map is never the territory, especially in February. Next: cross-season loop closure and semantic landmarks.

---

### Closing invitation
**Section**: Bottom of scroll, before contact.
**Constraint**: ≤ 40 words
**Word count**: 39

> If you're building something that has to perceive, decide, or act — or you just want to argue about belief states over coffee — write to me. I answer every email that isn't a pitch deck. cyrilletabe@gmail.com.

---

## 4. French translations

### Hero — FR
**Word count**: 14

> Je construis des machines qui perçoivent, décident, agissent — et j'écris ce qu'elles m'apprennent.

### Closing invitation — FR
**Word count**: 39

> Si vous bâtissez quelque chose qui doit percevoir, décider ou agir — ou si vous voulez simplement débattre d'états de croyance devant un café — écrivez-moi. Je réponds à chaque courriel qui n'est pas un *pitch deck*. cyrilletabe@gmail.com.

### Other blocks
All other EN copy blocks (orientation, five cluster paragraphs, six project cards, all micro-copy) are marked **pending pro translation**. Voice notes for the translator:

- Keep it *tutoiement-neutral* — the site addresses no one in particular, so no "vous" / "tu" choice is forced.
- Preserve technical terms in English where they are standard in the French robotics community (SLAM, MPC, POMDP, MCTS, behavior tree, lattice planner, belief state). Do not Frenchify these.
- The wry register survives translation in FR better than sarcasm does. Lean dry, not clever.
- Sentence rhythm matters more than literal fidelity. A long EN sentence can become two shorter FR sentences.

---

## 5. Micro-copy library

Twenty-four items, grouped by surface. All EN. FR marked pending pro translation.

### Buttons / CTAs
1. **Primary CTA (contact)** — `Write to me`
2. **Secondary CTA (projects)** — `See the work`
3. **Tertiary CTA (writing)** — `Read the notes`
4. **Repo link** — `Open the repo`
5. **External link (generic)** — `Read the source` *(for papers, tools, references)*
6. **Language toggle** — `FR` / `EN` *(plain, no flags — flags are countries, not languages)*

### Form states (contact form)
7. **Field label — name** — `Your name`
8. **Field label — email** — `Where I should reply`
9. **Field label — message** — `What you're working on`
10. **Submit (idle)** — `Send it`
11. **Submit (sending)** — `Sending…`
12. **Submit (success)** — `Got it. I'll reply from cyrilletabe@gmail.com.`
13. **Submit (error)** — `Something broke on my end. Try again, or email me directly.`
14. **Validation — empty email** — `I need an address to reply to.`
15. **Validation — malformed email** — `That doesn't look like an email address.`
16. **Validation — empty message** — `Tell me something.`

### Loading states
17. **Initial page load (the "wake-up")** — `Initializing sensors…` → `Converging belief state…` → `Ready.` *(three-stage, replaces a spinner; Agent 3 owns the motion)*
18. **Lazy content block** — `Loading…` *(plain, no cleverness — used when the wake-up has already happened)*
19. **Image fallback alt** — auto-generated from project name; never `image` or `photo`.

### Empty states
20. **Notes index, no posts yet** — `Nothing published here yet. I write slowly on purpose.`
21. **Search, no results** — `No match. The site is still small — try a broader word.`
22. **RSS / feed placeholder** — `A feed for when I start publishing regularly.`

### Errors
23. **404** — `This page doesn't exist — or it did, and I moved it. Head back to the start.` *(link: `Back to the top`)*
24. **500 / unknown** — `Something failed on the server. This is on me, not you. Try again in a minute.`

### Cookie / analytics banner
*(Bonus item, given the no-GA constraint in the dossier.)*

25. **Analytics notice** — `This site uses privacy-preserving analytics. No cookies, no third parties, no you-shaped profile.`

---

## 6. Concerns flagged for downstream

These are not requests — just signals the rest of the team should be aware of.

- **For Agent 1 (positioning)** — I've committed to "builder who writes" as the implicit posture, because the dossier's North Star demands a *manifesto*, not a CV. If Agent 1 lands on a more research-forward or more product-forward positioning, the hero and the five cluster paragraphs are the fastest places to retune. Flag me.
- **For Agent 3 (art direction)** — The "wake-up" loading sequence (micro-copy item 17) is a narrative promise. If it can't be delivered visually, the hero statement loses half its punch. Let's align early.
- **For the engineering agents** — The micro-copy for form states assumes a real mail pipeline (not a Formspree with a generic success message). If we're going mailto-only, items 11–16 need to be rewritten. Tell me which one.
- **For whoever owns the FR build** — Two blocks are translated here (hero, closing). The rest must go through a professional FR translator who knows the robotics register. Machine translation will flatten the voice, badly. Non-negotiable.
- **Banned vocabulary audit** — I've swept my own copy for the dossier's banned list. Clean. If a later agent introduces *passionate, innovative, cutting-edge, game-changer, solutions, driven*, or announcement-speak, please ping me or reject the PR.

---

*End of deliverable.*
