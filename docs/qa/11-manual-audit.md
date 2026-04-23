# 11 — Manual QA & UX Audit

**Auditor**: Agent 11 — QA engineer & UX auditor
**Scope**: 9 built routes under `dist/` + UX + North Star + content gaps
**Method**: Read-only. Built HTML inspected; source files consulted where dist was hard to eyeball. No builds, no installs, no edits.
**Source of truth for intent**: `docs/subject-dossier.md`, `docs/phase-1-revisions.md`, `docs/phase-2-revisions.md`, `docs/phase-3-revisions.md`, `docs/agents/01..10`.
**Severities**: P0 blocks ship · P1 ship-with-known-issue · P2 polish · P3 nice-to-have.

---

## 1. Page-by-page table

### 1.1 `/` — Home (EN, 7-beat scroll)

| # | Scenario | Expected (spec) | Observed (dist) | Sev |
|---|---|---|---|---|
| H-01 | Hero headline verbatim | Agent 2 §3, "I build machines that perceive, decide, and act — and I write down what they teach me." | Matches verbatim in `dist/index.html` | — |
| H-02 | Hero eyebrow | `§ 00 / BOOTING PERCEPTION` (Agent 4 §2.1, Beat 1) | Rendered | — |
| H-03 | Sensor-boot 3-stage loader | Phase-2 §4 — single wake-up artifact; `Initializing sensors… → Converging belief state… → Ready.` | Present with accessible `role=status` + `aria-live=polite`; reduced-motion jumps to stage 3; sessionStorage-cached so it fires once per session | — |
| H-04 | Orientation paragraph verbatim (81 words) | Agent 2 §3 | Matches | — |
| H-05 | Proof strip text | Noovelia / Odu / RobotClaw chips, 3 items | Present (EN) | — |
| H-06 | Five project cards, in order | Agent 2 §3 + Phase-1 §1: RobotClaw, OpenClaw, Drone stack, Noovelia lattice, Odu SLAM. ≤40-word copy verbatim. | All 5 present, body copy byte-identical to `src/content/copy.ts`, cluster ellipse + status pill rendered. "Open the repo" link rendered only if `repoUrl` prop provided — none is, so no repo links show. See C-07. | — |
| H-07 | Prop Guardian / Markets cluster absent | Phase-1 §1 | Not present anywhere | — |
| H-08 | Four cluster panels, in order | Perception → Planning → Human → Systems. ~70-word paragraphs verbatim. | Order correct; EN bodies verbatim | — |
| H-09 | Frontier grid excludes "market microstructure" | Agent 4 §2.1 Beat 5 | 9 chips; "market microstructure" correctly absent | — |
| H-10 | Signal beat degrades gracefully | Agent 4 §2.1 Beat 6 — one-line empty state, no link | "Nothing published here yet. I write slowly on purpose — notes coming." and NO link to `/writing/` | — |
| H-11 | Closing invitation verbatim (39 words) | Agent 2 §3 | Matches | — |
| H-12 | Mailto CTA | `mailto:cyrilletabe@gmail.com` | `href="mailto:cyrilletabe@gmail.com?subject=From%20the%20site"` | — |
| H-13 | ScrollProgress component | Agent 4 §3.2 — belief-distribution over 7 beats | Hydrated React island mounted (client:idle) | — |
| H-14 | Primary nav shows a "Writing" leaf when posts exist | Agent 4 §3.1 — leaf pruned only when zero posts | No writing posts exist → leaf pruned — consistent. But `/writing/` route still ships; see W-01 | — |
| H-15 | Eyebrow numbering skips | Agent 4 §2.1 | Home eyebrows: 00, 01, 02, 03, 04, 05, 06, 07, 08, 09. Consistent. About page eyebrow also `§ 09 / ABOUT`, colliding with home's `§ 09 / INVITATION` (different page, low risk) | P3 |
| H-16 | `.prose` class used for body | Agent 3 typography | Applied | — |
| H-17 | Section-handoff motion | Phase-1 §4 — each cluster enters as a sensor handoff | CSS transitions referenced; not verifiable statically. **[AUDIT-PENDING — requires runtime]** | P3 |

### 1.2 `/work/` — Flagship projects (EN)

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| WK-01 | H1 + dek | Agent 4 §2.2 — "Five systems that exist in the physical world. Each one taught me something that could not be read." | Matches | — |
| WK-02 | Anchors for 5 projects | `#robotclaw`, `#openclaw`, `#drone-stack`, `#noovelia-lattice`, `#odu-slam` | All 5 resolved; TOC above links each | — |
| WK-03 | Expanded 150–300 word project bodies | Agent 4 §2.2 | **Bodies are the same 40-word cards copy from `src/content/copy.ts`** — no expansion. `ProjectBody` structure (`what it does · what taught me · next`) is there in skeleton only. | **P1** |
| WK-04 | Hero asset per project | Agent 4 §2.2, Phase-3 §1 — procedurally synthesized per project | Each `<section>` has a `TODO(agent-10)` comment in source and renders no asset in dist. Page is text-only. | **P1** |
| WK-05 | Related-cluster line | Agent 4 §2.2 — "Related: Planning & Decision → /#planning" | Missing from all 5 sections | P2 |
| WK-06 | Repo / live-demo / writeup links | Agent 4 §2.2 — "only if it exists; never placeholder-linked" | No repo links rendered (none provided). Non-placeholder policy respected. | — |
| WK-07 | Eyebrow | `§ 10 / WORK` | Present | — |

### 1.3 `/writing/` — Notes index (EN)

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| W-01 | Route should not exist if zero posts | Agent 4 §2.3: "Empty state: route does not exist. Do not ship an empty index." | **`/writing/index.html` ships with zero posts and an empty-state paragraph.** Violates explicit IA guardrail. | **P1** |
| W-02 | If shipped, empty-state copy matches Agent 2 micro-copy 20 | "Nothing published here yet. I write slowly on purpose." | Matches | — |
| W-03 | Listed in primary nav | Agent 4 §3.1: pruned when empty | Nav has no writing leaf (correct per §3.1). But page still crawlable via sitemap. Mismatch. | P2 |
| W-04 | RSS link | Agent 4 §2.3 | Absent — no `/rss.xml`. Conditional, so acceptable while `/writing/` is empty. | P2 |

### 1.4 `/about/` — About (EN)

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| A-01 | H1 + bio verbatim | `src/content/copy.ts` `about.en.body` | Matches | — |
| A-02 | Portrait rendered | Agent 3 §5.3; Phase-3 §3 (optional) | Placeholder `"Portrait pending"` text in a dashed-border box. Optional per spec, but renders as a visible stub — user is not clearly told it's optional, and on a production build this looks unfinished. | **P1** |
| A-03 | CV download link resolves | Agent 4 §6.3; Phase-3 §3 — PDF present or clearly marked placeholder | **Links `/cv/cyrille-tabe-cv-en.pdf` and `/cv/cyrille-tabe-cv-fr.pdf` both dead.** `public/cv/` and `dist/cv/` contain only `.gitkeep`. Click → 404. No user-facing "PDF coming" marker. | **P0** |
| A-04 | `<link rel="alternate" type="application/pdf">` in head | Agent 4 §6.3 | Missing | P3 |
| A-05 | Timeline / Now block | Agent 4 §2.5 | Not rendered. Page is bio + CV stub only. | P2 |
| A-06 | Eyebrow collision | — | `§ 09 / ABOUT` duplicates home's `§ 09 / INVITATION` | P3 |

### 1.5 `/404` — Not found

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| 404-01 | On-brand micro-copy | Agent 2 micro-copy 23 — "This page doesn't exist — or it did, and I moved it. Head back to the start." | Matches verbatim | — |
| 404-02 | Route-not-in-plan eyebrow | implicit | `§ 404 / ROUTE NOT IN PLAN` rendered (on-brand) | — |
| 404-03 | Back link | "Back to the top" → `/` | Present | — |
| 404-04 | Served as GH Pages 404 | GH Pages auto-uses `/404.html` | File exists at `dist/404.html`; works | — |
| 404-05 | Lightweight hero-canvas motif | Agent 4 §2.8 — "so the 404 still *feels* like the site" | No scene; just text. Acceptable but misses the "feels like the site" promise. | P2 |
| 404-06 | FR counterpart `/fr/404` | Agent 4 §4.2 — Astro emits both | **Not emitted.** Only `/404.html` exists (EN-only). French visitors land on an English 404. | P2 |

### 1.6 `/fr/` — Home (FR)

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| FR-01 | `<html lang="fr-CA">` | Phase-2 §5 | `<html lang="fr-CA">` confirmed | — |
| FR-02 | Hero + closing FR verbatim | Agent 2 §4 | Matches | — |
| FR-03 | Orientation translated | Agent 2 §4 marked "pending pro translation" — but `copy.ts` ships a FR orientation paragraph | FR orientation paragraph rendered (not silent-EN). Translation quality beyond my lane. | — |
| FR-04 | Four cluster bodies translated | Agent 2 §4 — marked "pending pro translation" with a voice note | **FR cluster bodies are identical to the EN cluster bodies** (unicode-for-unicode — see `src/content/copy.ts` lines 45, 59, 73, 87). No user-facing "pending translation" marker. Silent English inside `/fr/`. Agent 2 §6 flagged "machine translation will flatten the voice, badly. Non-negotiable." This is worse: *no* translation at all, presented as FR. | **P0** |
| FR-05 | Five project cards translated | Same bind | **Project titles and 40-word bodies are EN-only** (the content model hard-codes one string per project, not a locale pair). Shipped on FR pages unchanged. | **P0** |
| FR-06 | Project cards `href` points to `/fr/travaux/` | Agent 4 §4.2 | Correct (`/fr/travaux/#robotclaw` etc.) | — |
| FR-07 | Proof-strip chip labels translated | implicit | "Noovelia — autonomie AGV / Odu — SLAM trottoir / RobotClaw — IA locale" translated | — |
| FR-08 | Signal empty-state FR | Agent 2 §5 item 20 pending translation | Has FR copy ("Rien de publié ici pour l'instant. J'écris lentement, par choix — notes à venir.") | — |
| FR-09 | Frontier chips translated | Agent 2 §5 — pending pro translation | **Chips rendered in EN** (from the `frontierBridges` string array which has no locale branch). Silent-EN inside `/fr/`. | P1 |
| FR-10 | Closing mailto | `mailto:cyrilletabe@gmail.com?subject=Depuis%20le%20site` | Correct | — |
| FR-11 | hreflang + canonical | Agent 4 §4.3–4.4 | Correct (`canonical=https://cyrilletabe.com/fr/`, alternate `en` + `x-default` → `/`) | — |
| FR-12 | Nav FR labels | Accueil / Travaux / À propos | Correct (no Écrits leaf — mirrors EN) | — |

### 1.7 `/fr/travaux/` — Travaux (FR)

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| FT-01 | H1 + dek FR | "Cinq systèmes qui existent dans le monde réel. Chacun m'a appris quelque chose qui ne se lit pas." | Present | — |
| FT-02 | Five project anchors | Same slugs as EN (Agent 4 §4.2 — slugs stay EN) | `#robotclaw` … `#odu-slam`. Correct. | — |
| FT-03 | Project bodies FR | pending translation | **Same 40-word EN copy on FR page.** No visible "pending translation" marker. | **P0** (same root cause as FR-05) |
| FT-04 | Same `WK-03` expansion gap | Same as EN | Same — thin 40-word bodies where 150–300 was specified | P1 |

### 1.8 `/fr/ecrits/` — Écrits (FR)

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| FE-01 | Route should not exist if zero FR posts | Agent 4 §2.3 + §4.2 | Ships with empty-state. Same violation as W-01. | P1 |
| FE-02 | FR empty-state copy | "Rien de publié ici pour l'instant. J'écris lentement, par choix." | Matches | — |

### 1.9 `/fr/a-propos/` — À propos (FR)

| # | Scenario | Expected | Observed | Sev |
|---|---|---|---|---|
| FA-01 | H1 + bio FR verbatim | `about.fr.body` | Matches | — |
| FA-02 | Portrait "à venir" stub | — | Rendered (same stub pattern as EN) | P1 |
| FA-03 | CV download FR + EN | | Both links dead (same root cause as A-03) | **P0** |

---

## 2. Prioritized bug list

### P0 — blocks ship

1. **CV PDFs missing entirely.** `/cv/cyrille-tabe-cv-en.pdf` and `/cv/cyrille-tabe-cv-fr.pdf` do not exist in `dist/cv/` (only `.gitkeep`). The About page and French À propos link to them with `download` attribute. A recruiter's first click is the most damaging 404 this site can ship. Either add a user-visible "CV pending" placeholder, hide the block behind a build-time flag, or drop compiled PDFs into `public/cv/` per Phase-3 §3. **Tickets**: A-03, FA-03.
2. **FR cluster paragraphs are silently English.** `src/content/copy.ts` duplicates the EN cluster body into the `fr` field for all four clusters (perception, planning, human, systems). This ships EN inside `/fr/` with no disclosure. Phase-1 §1 + Agent 2 §6 explicitly require marked-as-pending or pro translation. **Ticket**: FR-04.
3. **FR project cards are silently English.** The `projects` record in `src/content/copy.ts` is locale-less; both `/fr/` and `/fr/travaux/` render the EN 40-word bodies. Five cards × 40 words × 2 pages = ~400 untranslated words appearing on FR surfaces without a disclaimer. **Tickets**: FR-05, FT-03.

### P1 — ship-with-known-issue

1. **`/work/` and `/fr/travaux/` bodies not expanded.** Agent 4 §2.2 spec is 150–300 words per project section (the whole justification for the route existing). What ships is the same 40-word homepage card. Two pages are, structurally, a copy of the home proof grid. **Ticket**: WK-03 / FT-04.
2. **`/writing/` and `/fr/ecrits/` ship as empty shells.** Agent 4 §2.3 is explicit: "Empty state: route does not exist. Do not ship an empty index." Both routes exist, appear in the sitemap, and render an empty-state paragraph. Either prune the route at build time or keep it and add a writing leaf to the nav — not the current middle-ground. **Tickets**: W-01, FE-01.
3. **`/about/` portrait placeholder looks like a bug, not a deliberate choice.** A dashed box reading "Portrait pending" on a shipped site reads as unfinished. Phase-3 §3 permits shipping without a portrait; if we are, the block should be removed, not stubbed. **Tickets**: A-02, FA-02.
4. **FR Frontier chips are in English.** `frontierBridges` is a locale-less string array and renders in EN on `/fr/`. Same disclosure problem as P0-2/P0-3 but lower-stakes content. **Ticket**: FR-09.
5. **No social / GitHub links anywhere.** Agent 4 §2.6 specifies `FooterSocials` (GitHub, X/Mastodon, LinkedIn, email). Footer in `src/components/Footer.astro` renders only nav + mailto. For "a builder who writes" on a Noovelia/Odu-adjacent recruiter page, no GitHub link is a credibility gap. Dossier "Flagship Projects" implies `RobotClaw` and `OpenClaw` repos exist; recruiters will look. **Ticket**: new (not in table — systemic across all 9 pages).

### P2 — polish

1. **No FR 404 page.** Only `/404.html` is emitted; FR users on a bad URL get an EN page. (404-06)
2. **`/work/` missing the "Related cluster" line per project.** (WK-05)
3. **`/404` ships as plain text — misses the "feels like the site" promise.** No hero-canvas lite, no ambient SLAM layer. (404-05)
4. **`/about/` has no timeline or Now block.** (A-05)
5. **`/writing/` lacks RSS link.** (W-04)
6. **Nav/route parity mismatch for writing**: route exists, nav leaf pruned. Two different signals to the visitor. (W-03)

### P3 — nice-to-have

1. Eyebrow number `§ 09` is reused for home-closing and About page (same number, different meaning).
2. `<link rel="alternate" type="application/pdf">` not injected in `/about/` head. (A-04)
3. Section-handoff motion not verifiable statically — unclear if the named metaphors (map-handed-to-planner, etc.) read cleanly at runtime. (H-17)

---

## 3. UX audit

### 3.1 Five-second test (above-the-fold of `dist/index.html`)

A reader sees, in this order: a small behavior-tree nav sigil, four mono labels (Home / Work / About / Français), a sensor-boot strip cycling 3 stages, the `§ 00 / BOOTING PERCEPTION` eyebrow, a 14-word headline ("I build machines that perceive, decide, and act — and I write down what they teach me."), and a procedural SLAM scene. **Who**: Cyrille Tabe (identified only in title + footer — not in the fold). **What**: he builds perceiving/deciding/acting machines. **Why**: implied, not stated.

Verdict: **pass for "what", weak for "who"**. A reader who arrives from a link with a known byline is fine; a cold visitor has to scroll to the orientation paragraph (Beat 2) before learning this is one person in Montréal. The hero headline is strong enough to carry it, but Beat 2 should compress one level more to reach the fold on a 13" laptop.

### 3.2 Scroll choreography legibility

The seven beats are:
- Beat 1 Hero (minimum 70vh) → Beat 2 Orientation → Beat 3 Proof (strip + 5 cards, the densest beat) → Beat 4 Depth (4 cluster panels, ~3.2vp) → Beat 5 Frontier → Beat 6 Signal (one line) → Beat 7 Invitation.

Read statically (no motion running), the beats are cleanly separated by `border-top: 1px solid var(--surface-2)` on cluster panels and by the `section-marker` eyebrows. Eyebrow numbering ascends (00 → 01 → 02 → 03 → … → 09) which reinforces the "process booting then running" metaphor.

Risks:
- Beat 6 (Signal) is a single-line empty state. It reads as a beat skipped, not a beat intentionally quiet. The transition from "what I'm pulling in" to "writing" to "write to me" loses one rung of the ladder.
- Beat 4 does 4 sub-sections at ~0.8vp each. Without the inter-panel "sensor handoff" motion firing, the four panels just look like four stacked paragraphs with a sigil — the *intrigue* Agent 2 wants from this beat is carried entirely by the motion layer, which is **[AUDIT-PENDING]** on static read.
- The `§ 02 / SHIPS BEFORE SLIDES` eyebrow on Beat 3 is the best piece of micro-copy on the page and does most of the narrative work.

Verdict: **legible on a static read, but fragile**. If the motion budget ships degraded on a 2018 Android over LTE, the Depth beat flattens into "four paragraphs with circles" and the promise of the arc drops off.

### 3.3 Four cluster paragraphs — smart-non-specialist vs. expert

Reading each cluster body cold:
- **Perception** — lands. "A robot's first job is to agree with reality" is the right kind of sentence: immediately readable, technically precise. A non-specialist gets the thesis; an expert respects the seam-between-sensor-noise-and-map framing. "Perception bugs wearing a planner's costume" is earned.
- **Planning** — lands. "Once a robot sees, it has to choose" is the right hinge from #1. POMDP/MCTS/MPC dropped without explanation, which is a feature for recruiters and a minor barrier for strangers. The closing rhetorical question is the best sentence on the page.
- **Human** — lands with hesitation. "The hardest sensor to model is the person in the room" is strong. The "politeness, not surveillance" pivot is necessary but the paragraph ends on a softer note than #1 and #2 — it dips the energy just before Systems.
- **Systems** — lands. "Autonomy is a distributed systems problem pretending to be a robotics problem" is the most quotable sentence here. "The network is a privilege, not a dependency" is on-brand local-first.

Verdict: **the four paragraphs meet the spec**. Expert doesn't feel pandered to; non-specialist walks out with 4 crisp metaphors. Only risk is the FR version silently shipping the English strings (see P0-2).

### 3.4 Closing invitation — emotional landing

The closing beat is the strongest piece of copy on the site: "If you're building something that has to perceive, decide, or act — or you just want to argue about belief states over coffee — write to me. I answer every email that isn't a pitch deck." The "I answer every email that isn't a pitch deck" is the only line on the page that reveals a human making a specific commitment. The mailto CTA reads "Write to me — cyrilletabe@gmail.com" with the literal email visible, which is the right choice for a builder site (no form friction, no trust gap).

Risk: the beat is followed by a thin footer — copyright + "Built on Astro, hosted on GitHub Pages, self-hosted everything." — with no GitHub link. The site ends on "write to me" but gives the reader no way to verify the builder claim before they do. This is the single strongest argument for adding a GitHub link to the footer (P1-5 above).

Verdict: **lands, with one crack in the frame** — the missing GitHub link at the foot undermines the invitation's implied claim.

---

## 4. North Star check — three first-visit narratives

### 4.1 The robotics recruiter (persona A, Agent 1)

She clicks a link at 9:14 on a Tuesday. The sensor-boot strip tells her within 1.8s that this site knows the vocabulary she works with. The hero sentence reads like something a senior engineer would say out loud, not a LinkedIn bio. She scrolls to the proof strip — Noovelia AGV autonomy / Odu SLAM / RobotClaw — and the five project cards confirm this person ships on real hardware. She hovers "Noovelia lattice planner" and sees "shipped" as a status pill; "Next: I can't say yet" is exactly the kind of line a serious employee writes. She clicks "See the work" expecting expanded case studies and lands on `/work/` — and reads the same 40-word cards she just read. That's where the page quietly disappoints. She scrolls to "About" looking for a CV and gets a 404. This is where she loses 15 seconds she cannot afford to lose. **Lands**: the copy, the cluster pairing, the status language. **Falls flat**: `/work/` under-delivering, CV link dead. **Missing**: a GitHub handle to sanity-check before she messages.

### 4.2 The collaborator / fellow builder (persona B)

He arrives from a Hacker News comment. He is a POMDP person, so "a POMDP belief state and an MCTS intent tree over my life" is the sentence that stops his scroll. He reads the Planning cluster paragraph and recognises the lineage. He wants to open a repo. There is no repo link on the RobotClaw card, no "OpenClaw" repo link, no GitHub in the footer. He tries the URL `cyrilletabe.com/writing/` on instinct — it exists but is empty. He is a second click away from closing the tab. **Lands**: the technical specificity, the "memory is the hard part, not reasoning" line, the local-first ethos. **Falls flat**: no GitHub means no way to engage. **Missing**: repo links on the cards; a `/writing/` with at least one post so the "builder who writes" claim has an artifact behind it.

### 4.3 The curious intelligent stranger (persona C)

She is a designer whose engineer friend sent her the link. The sensor-boot is the moment the site *earns* her attention — she has never seen a site start this way, and the three-stage loader reads as craft, not gimmick. The hero sentence is the best thing on it. She reads "A robot's first job is to agree with reality" in the Perception cluster and actually laughs — it's both precise and funny. She reaches the closing invitation and feels the "I answer every email that isn't a pitch deck" land. She does not click anything — she just leaves the tab open and sends a screenshot of the hero to a friend. **Lands**: hero, sensor-boot, cluster copy, closing invitation. **Falls flat**: nothing that matters to her. **Missing**: one image she could share back — an ambient visual she'd crop to 1:1 for a tweet.

### 4.4 Verdict

Two of three personas **walk away with what the North Star promises**. The recruiter (the commercial target) **does not**, because `/work/` under-delivers and the CV 404s. The fix ordering is: CV PDFs first, then expand the `/work/` bodies, then add repo links. If those three ship, all three personas land.

---

## 5. Content gaps

### 5.1 Silent-English on French pages (severity P0 for content, P1 for polish)

Not a placeholder — actively wrong. Four cluster bodies, five project card bodies, five project card titles, and the Frontier chip strings all render EN inside `/fr/` and `/fr/travaux/` without any user-facing "pending translation" marker. Per Agent 2 §4–6, the hero + orientation + closing are the only verbatim FR blocks committed; every other block was required to be marked as pending pro translation, or held back. The current build neither marks nor holds — it ships EN behind a FR URL. This is the single highest-priority content gap.

### 5.2 Placeholder surfaces that look silently empty

- **`/work/` project sections**: render only the 40-word card body. A new visitor cannot tell that the page is under-built vs. deliberately minimal. A single "Long-form write-up coming" line per section would flip this from a bug to a promise.
- **`/about/` portrait**: a dashed box with "Portrait pending" reads as incomplete. Either show a portrait or remove the block — Phase-3 §3 explicitly permits the latter.
- **`/about/` CV block**: links are present but the target files do not exist. The user cannot tell from the page that the CV is not ready. A `<span class="t-micro">PDF coming</span>` next to each link would turn this from a P0 into a P2.
- **`/writing/` and `/fr/ecrits/`**: empty routes shipped against IA guardrail. The one-line empty-state ("I write slowly on purpose") *is* on-brand, but Agent 4 §2.3 said don't ship the route at all. Either cut or add Nav leaf — don't straddle.

### 5.3 FR pages that duplicate EN without acknowledging it

- `/fr/` home — cluster bodies, project cards, frontier chips.
- `/fr/travaux/` — all five project bodies + project titles.
- `/fr/ecrits/` — not a duplication issue (empty).
- `/fr/a-propos/` — bio + CV labels are translated; CV filenames are shared (correct per spec).

### 5.4 Missing external anchors

- No GitHub / LinkedIn / social anywhere in the footer or About page. Dossier and Agent 4 §2.6 imply their presence; Agent 1's persona B literally cannot act on the site without them.
- No repo links on project cards even though the cards have a `repoUrl?` prop ready to consume one. At minimum, RobotClaw, OpenClaw, and the drone stack should have GitHub URLs wired.
- No CV file in `public/cv/` — `.gitkeep` only.

### 5.5 Micro-copy that is *not* a gap

Noted for the avoidance of false alarms: the site is clean on Agent 2's banned-vocabulary list (no "passionate", "innovative", "cutting-edge", "game-changer", "solutions", "driven", "let's dive in", "I'm excited to announce" anywhere in source or dist).

---

*End of 11-manual-audit.md — Agent 11.*
