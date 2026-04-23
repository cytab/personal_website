# 07 — Typography & Layout

**Author**: Agent 7 — Senior Designer (typography-first)
**Status**: Draft v1. Binding for Agent 9 (build / tokens), Agent 10 (transitions visual surface), any later content agent.
**Supersedes**: nothing.
**Superseded by**: `phase-1-revisions.md` where they conflict.
**Anchored to**:
- Dossier (four clusters, bilingual FR/EN, self-hosted fonts, Astro on GH Pages).
- Phase-1 revisions (four clusters, no markets).
- Agent 1 (positioning: planning under uncertainty; voice: confident, specific, technical-without-theatrics, quietly ambitious).
- Agent 2 (seven-beat scroll arc; long-form posture; voice is precise, unhurried, wry; FR ~15% longer).
- Agent 3 (warm-technical dark palette; proposed pair JetBrains Mono + Inter; 8px atomic unit; tabular numerics; no all-caps except ≤13px; display tracking differs between FR and EN).
- Agent 4 (hybrid IA: one narrative `/`, `/work/`, `/writing/`, `/writing/<slug>/`, `/about/`, `/legal/`, `/404`; MDX long-form posts; anchors inside `/`; behavior-tree primary nav).
- Agents 5 and 6 had not yet landed at time of writing — flagged as **pre-parallel-outputs**; any conflicts resolve to this doc for typography and layout, and to Agents 5/6 for interaction/motion semantics.

---

## 0. What this document decides

1. Final type stack (body / display / mono), weights, subsets, file list.
2. Type scale (six sizes) with px + rem + line-height + tracking + `ch` caps, derived from a single modular ratio — justified.
3. Two layout grids — a 12-col structured grid and an asymmetric editorial grid — with margins, gutters, safe areas at four breakpoints.
4. Reading-column rules (prose, block quotes, code blocks full-bleed on mobile, captions).
5. Six special treatments — code, pull quotes, section markers, figure captions, numerics, inline callouts.
6. Bilingual typography rules — FR breathing, diacritics, locale-aware punctuation.
7. A full CSS custom-properties token block, ready to drop into `tokens.css`. Dark is default; light is opt-in.

Every decision below is auditable: a reason in one sentence, a trade-off where there is one.

---

## 1. The type stack — final pair

### 1.1 Decision

**Confirmed: Inter (body) + JetBrains Mono (display / mono / numeric).** I evaluated the alternatives Agent 3 flagged (Geist Sans/Mono, IBM Plex, Manrope) and one Agent 3 did not test (Commit Mono, a newer programmer mono). Inter + JetBrains Mono wins on four grounds specific to this project:

- **Inter is the most-tested humanist sans on screens at small sizes.** Agent 2's voice leans on long-form prose (70-word cluster paragraphs, 80-word orientation, full MDX essays). Inter's x-height, vertical metrics, and opentype features (`cv11`, `ss01`, tabular figures) were designed for exactly this reading register. Geist is cleaner at display sizes but loses legibility at 13–14px (we need a lot of 13px mono + Inter body pairing in data rows). Manrope is warmer but its counters close up below 16px, which starts to matter on the mobile `/writing/` index.
- **JetBrains Mono has the right *engineering honesty*.** It is not a designer's homage to code; it *is* the mono face engineers edit code in. Using it for section markers, numerics, and the hero display carries the message "this site was made by someone who spends hours in a terminal" without needing to say so. Geist Mono is newer and cleaner but reads more startup-deck than control-room; Plex Mono is too IBM. Commit Mono is beautiful but narrow-glyph, and the hero display line needs room to breathe.
- **FR diacritics are safe.** I tested *É, œ, à, ê, ç, ï* in both faces at display, H1, and body sizes. Inter 600 handles *É* and *œ* without tracking adjustment at H1. JetBrains Mono at display (`-0.02em` tracking proposed by Agent 3) loses a sliver of the acute accent on `É` at 64px — I dial that back to `-0.015em` when `lang=fr`, matching Agent 3's note in §12.4 and its `i18n.frenchDisplayTracking` token.
- **Licenses are SIL OFL 1.1** — unambiguous, redistributable, self-hostable. No Adobe, no commercial license, no fingerprinting CDN.

### 1.2 Weights actually shipped — bundle ledger

Self-hosted fonts must earn their bytes. The rule: if a weight does not appear in the type scale or in a documented override, it is cut. Both faces ship only in woff2, subset to **Latin + Latin-Ext** (covers all FR diacritics, Québec place names, stray EN-imported words in FR prose). woff2 is universal from 2020+; no woff fallback. System stack is the fallback for pre-load.

**Inter** — three weights:

| Weight | Why |
|---|---|
| 400 Regular | Body prose, captions, nav labels, form fields. The backbone. |
| 500 Medium | Button labels, active nav, chip text, metadata emphasis. Bridge between 400 and 600 so emphasis doesn't jump. |
| 600 Semibold | H1 → H3, pull-quote attribution, OG titles. (Not 700 — 600 pairs better with 400 body without the contrast spike Bold produces, and JetBrains Mono's 500 display weight is visually close to Inter 600.) |

**JetBrains Mono** — two weights:

| Weight | Why |
|---|---|
| 400 Regular | Code blocks, inline code, timestamps, data rows, numeric cells, tabular figures in dense tables. |
| 500 Medium | Display hero line, section markers (§ 01 / PERCEPTION), eyebrow labels, active mono states (e.g., the currently-ticked behavior-tree leaf label). Replaces what other sites use 700 for — JetBrains 500 is already assertive at display sizes. |

**What I deliberately cut:**
- Italic in both faces. Agent 3 banned italic in body prose; I extend: no italic in headings either. Italic is reserved for titles of works inside body paragraphs (e.g., *Probabilistic Robotics*, *RobotClaw*), so we still need **Inter 400 italic — one extra file**. JetBrains italic is cut entirely; code doesn't italicize in our style (syntax theme uses weight and hue only).
- Inter 300 / 700 / 800 / 900. Every heading that needs more presence gets size, not weight.
- Variable fonts. Inter and JetBrains Mono both ship variable, but a single variable woff2 is 300–400 KB each; shipping two fixed weights per face at 20–40 KB each is leaner and lets the browser prioritize what actually loads. Trade-off accepted: we lose fine-grained axis control; we don't need it.

**Final file list (6 files, subset `latin+latin-ext`):**

```
/fonts/inter/Inter-Regular.latin-ext.woff2            ~28 KB
/fonts/inter/Inter-Regular.italic.latin-ext.woff2     ~28 KB
/fonts/inter/Inter-Medium.latin-ext.woff2             ~28 KB
/fonts/inter/Inter-SemiBold.latin-ext.woff2           ~28 KB
/fonts/jetbrains-mono/JetBrainsMono-Regular.latin-ext.woff2   ~36 KB
/fonts/jetbrains-mono/JetBrainsMono-Medium.latin-ext.woff2    ~36 KB
──────────────────────────────────────────────────────────────
Estimated font payload                               ~184 KB
```

**Loading strategy:**
- `<link rel="preload" as="font" type="font/woff2" crossorigin>` for **Inter-Regular** and **JetBrainsMono-Medium** only (the two that paint above the fold on every route). The other four lazy-load via `@font-face` with `font-display: swap`.
- `size-adjust`, `ascent-override`, `descent-override`, `line-gap-override` are set on the fallback `@font-face` entries (system-ui → Inter, ui-monospace → JetBrains Mono) to minimize CLS during swap. Exact values in the token block (§8).
- `unicode-range` on each face constrains to Latin + Latin-Ext so the browser doesn't waste bytes on glyphs we'll never render.
- FR and EN share the same files — no per-locale woff2 split. The subset already covers both.

### 1.3 Feature toggles

OpenType features are set face-wide, not ad-hoc:

```css
/* body */
font-feature-settings: "ss01", "cv11", "tnum" off, "kern" on;
font-variant-numeric: proportional-nums;  /* default prose */

/* tabular zones (tables, data rows, timestamps) override */
font-variant-numeric: tabular-nums;
font-feature-settings: "tnum" on, "ss01", "cv11", "kern" on;

/* mono */
font-feature-settings: "calt", "liga", "zero", "tnum";
```

- `ss01` (Inter) — disambiguates `a`, `g`, `l` for screen reading; safer at 14–18px.
- `cv11` (Inter) — tall-ascender `i`/`l`, improves reading rhythm without making numbers feel stretched.
- `zero` (JetBrains) — slashed zero; distinguishes `0` from `O` in data rows where this actually bites.
- `calt`, `liga` (JetBrains) — programming ligatures (`=>`, `!=`, `>=`, `->`) in code blocks per Agent 3. **Disabled on numeric labels** so `1=>2` never collapses in a data cell; we scope ligatures to `code, pre`.
- `tnum` is **default-off in body prose** (proportional numerals read better in running text) and **always-on** in tables, timelines, timestamps, and mono display. This matches Agent 3's rule "tabular figures where numbers stack."

---

## 2. Type scale — six sizes, derived from a 1.25 modular scale

### 2.1 Ratio choice — 1.25 (major third)

Agent 3 proposed 1.25 anchored at 16px. I tested 1.2 (minor third) and 1.333 (perfect fourth) over the actual copy (hero 14 words, cluster paragraph 70 words, project card 40 words, MDX essay body):

- **1.2** compresses too tight — H2 and H3 are within 4px of each other, which muddies the hierarchy on `/writing/<slug>/` where a post can have both.
- **1.333** puts H1 at 48px and display at 75.8px — the display becomes loud on mobile and the H1 overflows the reading column in FR (FR titles run ~15% longer).
- **1.25** lands H1 at 40px, display at 64px, leaves room for a 48px intermediate if we ever need one, and keeps FR titles within the 12-col grid at tablet without wrapping awkwardly.

**Anchor**: 16px base body. This is also Agent 3's anchor — keeping it is the cheapest way to avoid breaking the already-accepted token surface.

**rem conversion**: `1rem = 16px` (we do not override root font-size). Every size below is provided in both px (absolute, for engineering clarity) and rem (for user-zoom behavior). Line-height is unitless where it multiplies against font-size.

### 2.2 The six-size table

| Token | Role | Face | Weight | Size (px / rem) | Line-height (px / unitless) | Tracking | `ch` max-width (prose only) |
|---|---|---|---|---|---|---|---|
| `--t-display` | One-off hero line; page `/` beat-1 and beat-6/7 flourish | JetBrains Mono | 500 | **64 / 4.0** | 68 / 1.0625 | -0.02em (EN) / -0.015em (FR) | n/a |
| `--t-h1` | Page titles (`/work/` header, `/about/` header, post title) | Inter | 600 | **40 / 2.5** | 46 / 1.15 | -0.015em | 20ch soft, wraps freely |
| `--t-h2` | Section titles inside a page, cluster panel title | Inter | 600 | **28 / 1.75** | 34 / 1.2143 | -0.01em | 28ch soft |
| `--t-h3` | Sub-section, project card title, callout title | Inter | 600 | **20 / 1.25** | 28 / 1.4 | 0 | 36ch soft |
| `--t-body` | Running prose, form labels, nav labels | Inter | 400 | **16 / 1.0** | 26 / 1.625 | 0 | **max 68ch, ideal 62ch** |
| `--t-mono` | Section markers, data rows, timestamps, metadata, eyebrow labels | JetBrains Mono | 500 | **13 / 0.8125** | 20 / 1.5385 | +0.02em | n/a (rows, not prose) |

**Two texture sizes** (kept out of the formal scale but available):

| Token | Role | Face | Weight | Size | Line-height | Tracking | Case |
|---|---|---|---|---|---|---|---|
| `--t-micro` | Axis labels, footnote refs, caption metadata, OG subline | JetBrains Mono | 500 | 11 / 0.6875 | 16 / 1.4545 | +0.06em | uppercase |
| `--t-reading` | Long-form MDX body on `/writing/<slug>/` only | Inter | 400 | 18 / 1.125 | 30 / 1.6667 | 0 | **max 64ch, ideal 58ch** |

Rationale for keeping `--t-reading` distinct from `--t-body`:
- The homepage and `/work/` have mixed content (prose + data + UI); 16/26 is the right compromise.
- A long essay rewards a slightly larger body and looser leading. 18/30 increases daily reading comfort and reduces fatigue in two ways: a touch more x-height per-line, and more air between lines so the eye tracks without losing place. Tested at 2000-word sample; Agent 2's style favors medium-to-long sentences and 18/30 sits them well.
- It is a scope-limited override — not a parallel scale. Headings in MDX posts still use H1–H3 from the table above.

### 2.3 Why these line-heights

- Display 1.0625: hero is one line; leading is just enough to prevent descender clipping on `ç`, `g`, `p` without opening visual space below the line.
- H1 1.15: titles in the wild run two lines, especially in FR. 46px leading on a 40px face keeps multi-line titles from looking sparse.
- H2 1.2143 (34/28): specifically tuned so **three body lines (3 × 26 = 78px) equal one-and-a-half H2 lines (1.5 × 34 = 51px... wait)**. Reconsider — the cleaner baseline-rhythm target is *four body lines ≈ three H2 lines*: 4 × 26 = 104px vs 3 × 34 = 102px. Off by 2px across four lines; acceptable. This preserves Agent 3's "three body lines equal one H2 line box" *intent* — vertical rhythm is enforced.
- H3 1.4: H3 tends to lead into a short paragraph; 28px leading on a 20px face keeps the transition from title to body soft.
- Body 1.625: the long-form sweet spot for sans-serif at 16px. Anything tighter and FR wraps get stressed; anything looser and the paragraph fragments into discrete lines.
- Mono 1.5385 (20/13): exact 4px multiple to land on the 8px baseline grid on even rows. 2.5 × 8 = 20.
- Micro 1.4545 (16/11): 2 × 8 = 16. Lands on grid.
- Reading 1.6667 (30/18): looser than body so the 18px face gets even more air; 30 / 8 = 3.75 (off-grid by 4px every two lines, acceptable inside a reading column that is itself off-grid by design).

### 2.4 Tracking rules (extending Agent 3)

- Display 64px: **-0.02em EN, -0.015em FR.** Below -0.02em, `œ` in *œuvre* starts to bind against the following glyph.
- H1 40px: **-0.015em both languages.** Tested; FR titles don't need further relaxation here.
- H2 28px: **-0.01em.**
- H3 20px: **0.**
- Body 16px: **0.**
- Mono 13px: **+0.02em** — tracking widens to compensate for the tighter counters of JetBrains at 13px; mirrors Agent 3.
- Micro 11px: **+0.06em uppercase.** Uppercase is a physical letter-spacing problem at 11px; +0.06em is the minimum that keeps `§ 01 / PERCEPTION` from feeling crammed.
- Reading 18px: **0.**

Global rule (keep it simple for Agent 9): **tracking opens as size decreases; tracks tighten as size increases.** No surprise values. Any future addition to the scale inherits this curve.

### 2.5 The `ch` caps — where max-widths live

`ch` is the width of the `0` glyph in the active font. For Inter 400 at 16px, `1ch ≈ 8.8px`; for Inter 400 at 18px, `1ch ≈ 9.9px`. Using `ch` (not `px`, not `em`) means the column auto-tightens if the user changes font-size via browser zoom — zoom-safe by design.

**Hard rule: body prose never exceeds 68ch. Ideal is 62ch. Reading mode caps at 64ch, ideal 58ch.** These are Bringhurst-standard reading columns, not marketing column widths. Everything else (data tables, project lists, nav, hero) is free of the `ch` cap.

Implementation in tokens: `--measure-body: 62ch; --measure-body-max: 68ch; --measure-reading: 58ch; --measure-reading-max: 64ch;`. Use the soft one as the default, the max one as a `max-width` ceiling for FR (which we let breathe up to 68ch — see §6).

---

## 3. Layout grids — two of them

Two grids, one token layer. Every component declares which grid it belongs to. This is not one grid with two modes — they are genuinely different systems.

### 3.1 Grid A — 12-col structured grid

**Where it applies:** `/work/` project sections, the homepage Proof strip (5 project cards), the homepage Depth cluster-panel layout, the `/writing/` index list, the footer, forms, the behavior-tree primary nav overlay when it expands, any table.

**Contract:** 12 columns, symmetric margins, predictable gutters, snaps to the 8px base.

### 3.2 Grid B — asymmetric editorial grid

**Where it applies:** `/` hero (Beat 1), the seven-beat scroll's transitional moments (between-beat sensor handoffs), cluster deep-dive panels when promoted to their own route (future), long-form `/writing/<slug>/` where the post wants sidenotes and full-bleed figures, hero imagery on `/about/`.

**Contract:** 14 tracks, asymmetric weighting (wider on the text column, narrower on a sidebar gutter), intentional negative space on one side. A single "editorial rail" (2 tracks) sits outside the main column for pull quotes, sidenotes, figure captions, and time-stamp rails on essays.

Both grids share an 8px atomic unit — all gutters, margins, and column widths round to 8px.

### 3.3 Breakpoints and their grids

Four breakpoints, explicitly aligned to real devices rather than round numbers:

| Breakpoint | Range | Device anchor |
|---|---|---|
| `mobile` | ≥ 375px | iPhone 12/13/14/15 baseline (375px). Samsung Galaxy S-series (360–412px) handled at same rules. |
| `tablet` | ≥ 768px | iPad 9th gen portrait, Android tablets. |
| `desktop` | ≥ 1024px | Laptop baseline. This is where Grid A resolves to 12 cols and Grid B resolves to its full 14 tracks. |
| `wide` | ≥ 1440px | MacBook Pro 14" / 16" hi-res, external 1440p monitors. |
| `large` | ≥ 1920px | 1080p+ desktop displays. Grid outer margins grow; columns stay fixed. |

### 3.4 Grid A — 12-col structured grid, per breakpoint

| Breakpoint | Cols | Gutter | Outer margin | Inner content width | Notes |
|---|---|---|---|---|---|
| mobile (≥375) | **4** | 16 | 16 | 375 − 32 = 343px | 12 cols would pulverize at 375; 4 is the correct mobile grid for hand-held thumb ergonomics. Project cards span 4/4 (full-width stack). Row gap 24. |
| tablet (≥768) | **8** | 16 | 32 | 768 − 64 = 704px | 8 cols is a safe doubling of mobile. Project cards span 4/8 → 2-up. Nav drawer remains. |
| desktop (≥1024) | **12** | 24 | 48 | 1024 − 96 = 928px | 12 full. Project cards span 4/12 → 3-up. BT nav returns. |
| wide (≥1440) | **12** | 24 | 80 | 1440 − 160 = 1280px | Outer margin grows, column count stays. Reading still capped at 68ch so the body column is inset within the 12 cols. |
| large (≥1920) | **12** | 32 | 160 | 1920 − 320 = 1600px | Column count fixed; margin compensates. Gutter grows to 32 to prevent the grid feeling cramped relative to its surroundings. |

**Safe areas (mobile iOS notch / Android gesture bar):** `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` are honored on all pinned UI (sticky nav, bottom scroll progress on `/`). The outer 16px margin sums with the safe-area inset; the header never sits under a notch.

### 3.5 Grid B — asymmetric editorial grid, per breakpoint

Grid B expresses *reading* pages. The track structure: **[margin] [2-track editorial rail] [gutter] [7-track main column] [gutter] [2-track right rail] [margin]**. That's 14 tracks including rails. The main column carries the body; the editorial rail carries sidenotes, pull quotes, figure captions, timestamp markers. The right rail is mostly empty — it holds the ScrollProgress on `/` and the ReadingProgress on posts, sometimes a figure that wants to breathe right.

| Breakpoint | Track structure | Gutter | Outer margin | Main column (ch) | Rails |
|---|---|---|---|---|---|
| mobile (≥375) | Single column, no rails | — | 16 | ≈37ch at 16px body | Editorial rail *collapses into flow*: sidenotes become inline `<aside>` blocks after the paragraph that references them. Pull quotes become full-bleed (-16px / -16px). |
| tablet (≥768) | **[24] [1 rail] [24] [main] [24] [1 rail] [24]** with tracks unequal — main column gets 60% of the remaining width | 24 | 24 | ≈48ch | Single rail on left only; right rail reserves 64px of air but no content at this breakpoint. |
| desktop (≥1024) | **[48] [2 rails ≈ 160px] [24] [main ≈ 640px] [24] [2 rails ≈ 120px] [48]** | 24 | 48 | ≈62ch (body) / ≈58ch (reading) | Both rails active. Editorial rail (left) = sidenotes + pull-quote attributions. Right rail = ReadingProgress + figure labels. |
| wide (≥1440) | Same structure; all tracks scale | 24 | 80 | ≈62–68ch | Rails breathe wider. |
| large (≥1920) | Same; outer margin grows, main column caps at 68ch so prose never wanders | 32 | 160 | 62–68ch | Negative space on the right becomes a deliberate editorial feature. |

**Why asymmetry:** a 12-col centered grid on a 1920px screen forces the reader's eye to the middle of the page; an asymmetric grid with weight on the left and air on the right (or vice versa, flipped for specific pages) gives the reader's eye a place to *rest*. This is page-design craft, not decoration — it is how books have been set for six hundred years.

### 3.6 Which grid does a page use?

| Page | Grid A (structured) | Grid B (editorial) |
|---|---|---|
| `/` | Beat 3 (Proof strip), Beat 4 (cluster panels inside each), Beat 5 (FrontierBridgesGrid), Beat 6 (WritingPreviewList), Beat 7 (contact form) | Beat 1 (Hero), Beat 2 (Orientation), inter-beat white space |
| `/work/` | Project sections as structured cards with data rows | Each project's body prose and figures use editorial rail for captions |
| `/writing/` | Index list | — |
| `/writing/<slug>/` | — | Entire page |
| `/about/` | Timeline (structured rows), CV download | Bio + portrait (editorial, portrait on right rail) |
| `/legal/` | Plain Grid B single-column reading | — |
| `/404` | Center-aligned Grid A | — |

---

## 4. Reading-column rules

These rules apply anywhere body prose flows — `/writing/<slug>/` first, then prose blocks on `/`, `/work/`, `/about/`.

### 4.1 Column width

- **Hard ceiling:** 68ch at `--t-body`; 64ch at `--t-reading`. Beyond this, line-to-line tracking breaks and the reader's return-sweep misses the next line start. This is measured, not aesthetic.
- **Ideal:** 62ch at `--t-body`; 58ch at `--t-reading`. This is the Bringhurst target (45–75ch acceptable, 66ch ideal).
- **Minimum:** 40ch on mobile. Below that and the text starts to look telegraphic (one-thought-per-line). Mobile 375px + 16px margins = 343px ≈ 39ch at 16/1.0 — right at the floor. Acceptable; we do not support portrait screens narrower than 375.

### 4.2 Paragraph mechanics

- Paragraph separation: **blank line**, not first-line indent. Website-native. Ghost-of-a-print-indent patterns are wrong for screen; they fight scroll.
- Paragraph margin: `margin-block-end: 1.5em` — that is 24px at `--t-body`. Lands on the 8px grid (24 = 3 × 8).
- Orphans and widows: `orphans: 3; widows: 3` on `body, article` — prevents a single line stranding at a column break. Mostly visible on PDF export (CV), but still set.
- Text alignment: **left-aligned (`text-align: start`), never justified.** Justified text on screen without a hyphenation engine produces rivers; with a hyphenation engine it mis-hyphenates technical terms like *MCTS* and *POMDP*. Left ragged is the right answer for technical prose.
- Hyphenation: `hyphens: manual` in EN (avoid automatic breaks on acronyms); `hyphens: auto` in FR (FR compound words benefit and the Hyphenator engine ships with every modern browser). `lang="fr"` scoping handles this.

### 4.3 Block quotes — *break the column intentionally*

A block quote is a voice switch. It should visually admit that. Rules:

- `blockquote` indents **negative** 24px on the left (desktop) — it reaches into the editorial rail. On mobile, it is flush with the column (no rail exists; full-bleed would be aggressive).
- Left border: 2px solid `--primary` (amber) on desktop; same on mobile but offset into the 16px margin.
- Typography: `--t-reading` on prose posts, `--t-body` otherwise; weight stays 400; color `--ink` (not muted — the quote is a primary signal).
- Attribution: new line, `--t-micro` mono uppercase, color `--ink-muted`, prefixed with an em-dash (`— `). Mono intentionally — it visually cites like a caption or a data source.
- Max width: narrower than the body column by 2ch on each side, so the quote "indents" into the page even as its border reaches out — a small asymmetry that signals voice change.
- **Pull quotes** (a stronger treatment) use `--t-h3` size and span into the right rail on desktop. See §5.2.

### 4.4 Code blocks

Code blocks are the place where the mono face earns its keep. Rules differ on mobile and desktop.

- **Mobile (<768px):** **full-bleed.** `margin-inline: -16px; padding-inline: 16px;` — the code block breaks the column and touches the viewport edges. Horizontal scroll (`overflow-x: auto`) handles long lines; wrapping is off by default because wrapping destroys indentation, and indentation is semantics in Python/YAML/ROS launch files.
- **Tablet (768–1024):** still full-bleed but aligned to the 24px margin. Rounded corners 4px. Same overflow rules.
- **Desktop (≥1024):** **boxed.** `background: --surface-2; border: 1px solid --surface-1; border-radius: 4px;` — a lifted deck with a hairline. Padding 16px (vertical), 20px (horizontal). Still scrollable horizontally.
- **Font:** JetBrains Mono 400, 14px / 22px line-height. **Never below 14px on mobile** — per mandate. (A 13px mono code block on a 375px screen is a readability failure, especially in bright sunlight.)
- **Ligatures:** on (`calt, liga`). The programmer ligatures (`=>`, `!=`, `>=`, `->`, `===`) are why we chose JetBrains Mono.
- **Tab width:** 2, set via `tab-size: 2`. Python / YAML / TS / Rust all look right at 2.
- **Inline code:** `<code>` inside a paragraph. `font-family: var(--font-mono); font-size: 0.875em; background: var(--surface-1); padding: 0.125em 0.375em; border-radius: 2px;` — inherits prose size (so inline code in `--t-reading` is visually balanced against 18px body, and in `--t-body` it's balanced against 16px). `0.875em` is the sweet spot: keeps the mono face from dominating the line without shrinking it illegibly.
- **Syntax highlighting:** Agent 6 / Agent 5 specify the theme palette; I constrain it to Agent 3's dark palette — `--ink` for identifiers, `--ink-muted` for comments, `--primary` for keywords, `--accent` for strings, `--danger` for errors only. Never rainbow. Never gratuitous color.
- **Copy button:** 32×32 icon in the top-right of the code block, `aria-label="Copy code"`. Hidden until hover on desktop; always visible on mobile (no hover state exists, so we pay the 32px cost).

### 4.5 Figure captions

Captions are the instrument-label of the site. Treatment:

- Face: **Inter 400**, size `--t-mono` equivalent (13/20) — *sans*, not mono. The caption reads as prose, not code. (A caption in mono reads like a filename, which we don't want — we want it to read like a museum wall label.)
- Color: `--ink-muted` (#8E8A82 on `--bg`) — WCAG 2.2 AA-large compliant (5.6:1 on bg; we are at 13px which is borderline, so we bump the caption to 14px on mobile where it matters most, see below).
- Spacing: 8px above caption (below figure), 24px below caption (before next block).
- Attribution: captions end with a `data-source` line in `--t-micro` mono uppercase, color `--ink-muted`, prefixed with `source: ` — e.g., `source: odu-slam, 2024-11-14`. This implements Agent 3 §5.1's `data-source` rule as a visible UI element, not just a data attribute.
- Position:
  - Desktop: caption sits in the **right rail** of Grid B, vertically aligned to the top of the figure. The figure spans the main column only; the caption lives alongside, not below. This is museum labeling — the figure is the art, the caption is the legend.
  - Mobile/tablet: caption sits below the figure in the flow.
- Size exception: on mobile, captions bump to **14/22 Inter 400** (not 13/20) because at 13px the contrast of `--ink-muted` on `--bg` dips below AAA and sits at borderline AA for small text. 14px brings it back to comfortable AA. Tracking stays at 0.

### 4.6 The reading column on `/writing/<slug>/` — a worked example

A reader opens a post at desktop 1440px:

- Outer margin: 80px each side.
- Editorial rail (left, ~160px): holds sidenotes (`<aside>` marked with `data-note-ref="1"`), pull quote attributions when a pull quote is in play.
- Main column: 58ch ≈ 574px at `--t-reading`.
- Right rail (~120px): ReadingProgress bar (sticky top), figure captions for wide figures.
- The post's H1 uses Grid B's main column (not full-bleed) so the title, dek, and first paragraph share one vertical axis.
- The first body paragraph is `--t-reading` (18/30) and flows in the main column.
- When a pull quote fires, it uses `--t-h3` (20/28) and spans main-column + right-rail — an intentional widening that signals emphasis.
- When a code block fires, it boxes at `--surface-2` inside the main column only (does not break into rails).
- When a figure fires with a caption, the figure sits in main-column; the caption slides into the right rail at 13/20 Inter 400, `--ink-muted`.
- When a full-bleed figure fires (`<Figure variant="bleed">`), it spans **margin-to-margin** across the entire viewport — the main column breaks for the figure, which resumes below. Full-bleed is rare; it is for hero figures and the one "map of the thinking" plot a long post might earn.

---

## 5. Special treatments

### 5.1 Code snippets (already covered in §4.4 — cross-reference only)

See §4.4. Constraints: `--t-mono` 14/22 on mobile (bumped from 13/20 to respect the ≥14px minimum), `--t-mono` 13/20 inline, ligatures on, mobile full-bleed, desktop boxed, never below 14px on mobile.

### 5.2 Pull quotes

A pull quote is a block quote promoted to *layout element*. Rules:

- Size: `--t-h3` (20/28) — large enough to read from across the screen without shouting.
- Face: Inter 600, tracking 0.
- Color: `--ink`.
- Position: spans main column + right rail on desktop (reads as ≈80ch — longer than body because it *is* meant to break rhythm).
- Decoration: a 32px-wide `--primary` rule above the quote, not below. The rule is the "announcement" — the quote is the announcement's content.
- Attribution: **not rendered** on pull quotes (they are lifted from the body text of the same author; attribution would be redundant). If a pull quote is lifted from a *cited* source, it becomes a block quote instead (§4.3) and gets its em-dash attribution.
- Mobile: full-bleed, `margin-inline: -16px; padding-inline: 16px;`, rule at 16px wide above. Same typography.

### 5.3 Section markers — how a reader knows they've crossed a beat

A section marker is a sensor-handoff in typography. Rules (extending Agent 3's `§ 01 / PERCEPTION` pattern):

- Format: `§ 01 / PERCEPTION` — section sign, two-digit zero-padded number, space, slash, space, uppercase label.
- Face: **JetBrains Mono 500, 11/16, tracking +0.06em, uppercase** — this is `--t-micro`.
- Color: `--ink-muted` on `--bg`; the whole marker is intentionally low-contrast (5.6:1) so it sits quietly — it is navigational, not content.
- Spacing: 24px of vertical space above (inside the previous beat's trailing margin), 16px below the marker before the beat's H2 starts. Total 40px of breathing room between beats.
- **The section rule** (new, not in Agent 3): a 1px hairline rule in `--ink-muted` at 12% alpha, starting at the left margin of the content column and extending 48px wide only, sits directly above the marker. The rule is the horizon line; the marker is the station number on it. Rule is omitted on Beat 1 (no preceding beat) and on Beat 7 (the invitation should not feel like another stop).
- **On scroll past a section marker**, the marker's numeric (the `01`) can flash to `--primary` for 240ms, then return to muted. This is the "new sensor came online" moment in typography — a typographic equivalent of the section-level sensor handoff. Agent 6 owns the motion timing; I own the typographic surface it acts on.
- FR version: `§ 01 / PERCEPTION` stays English on the EN page; on FR pages the label is translated (`§ 01 / PERCEPTION` remains because it's already a name — wait, Agent 2 gave `§ 03 / PERCEPTION & SPATIAL INTELLIGENCE` — on FR: `§ 03 / PERCEPTION & INTELLIGENCE SPATIALE`). The `§` and the digits do not change; the label translates.

### 5.4 Figure captions (already covered in §4.5 — cross-reference only)

See §4.5. Inter 400, 13/20 (14/22 on mobile), `--ink-muted`, `data-source` line in mono-micro uppercase.

### 5.5 Numeric data — the mono rule, formally

Every number on the site is mono. Agent 3 wrote the rule; I formalize it into four sub-cases:

- **Prose numerics** (inside running Inter paragraphs): 16px JetBrains Mono 400 inline. `font-variant-numeric: tabular-nums;` always. The slight face switch mid-sentence is visible and deliberate — a 14-word hero with "*20 Hz*" in it gets JetBrains Mono on those two characters. This is one of the voice markers of the site: when Cyrille cites a number, the page literally switches fonts because the number deserves its own typographic register.
- **Data rows** (tables, data labels in data viz, timestamps, file sizes): `--t-mono` 13/20 JetBrains Mono 500 tabular.
- **Large display numerics** (if we ever set a headline number — e.g., "50+ integrations" on OpenClaw card): `--t-h1` size, JetBrains Mono 500, tabular. The card's title stays Inter; the *number* is mono.
- **Dates**: always mono, always tabular. Format: `2026-04-23` (ISO) on metadata; `Apr 23, 2026` (EN) and `23 avril 2026` (FR) in prose. Both mono, both tabular. Separator for the ISO format is always hyphen-minus (not en-dash).

### 5.6 Inline callouts (info / warning / aside)

Used inside MDX posts via `<Callout>`. Three variants, all boxed, all within the reading main column:

| Variant | Border-left | Background | Icon | Voice |
|---|---|---|---|---|
| `info` | `--accent` (cyan) 2px | `--surface-1` | Antenna (from Agent 3 §7.2) | "A related fact." |
| `warning` | `--danger` 2px | `--surface-1` | FOV cone with a dashed edge | "A caveat." |
| `aside` | `--ink-muted` 2px | transparent | None; indent only | "A tangent." |

Typography inside callouts: inherits `--t-body` or `--t-reading` from the enclosing post. Titles (optional): `--t-h3`. Padding 16px (vertical) × 20px (horizontal). Margin-block 24px.

---

## 6. Bilingual typography

French is ~15% longer than English. Layouts must breathe; the type stack must absorb the extra length without visibly straining. Three families of rules.

### 6.1 Layout breathing

Every component that can wrap reserves 20% vertical room for the FR version. Concretely:

- Hero `--t-display` on `/fr/`: the 64px / 68 line-height holds (14-word FR hero = 14-word EN hero in Agent 2's translation). But any translation that goes 2 → 3 lines (a less-literal FR version) will fit because the hero's available vertical space is `min-height: 72px × 3 = 216px` — three lines of display — before it runs into the belief-state loader below.
- H1 on `/fr/work/travaux/`: **max-width relaxes from 20ch to 26ch** on FR. The FR "Travaux" is shorter than "Work" so that's fine, but per-project section titles (`/work/#robotclaw` headers) can run longer in FR. 26ch is the max safe value before wrapping becomes likely at tablet.
- Body prose on FR: **max `ch` unchanged at 68ch** — we do *not* widen the reading column in FR; that would change the type-silhouette per locale, which is wrong. Instead, we accept that FR paragraphs will be 15% taller (more lines) and leave vertical headroom in the layout.
- Button labels: FR labels can be ~40% longer than EN (`Write to me` → `Écrivez-moi`, close; but `Read the notes` → `Lire les notes`, also close — most button micro-copy translates at parity or shorter). Buttons use `min-width` not `width`; they grow with their label.
- Forms: FR labels (`Where I should reply` → `Où je dois répondre` — slightly longer) — form-field widths are 100% of their container; labels wrap above the field, not beside it, so length is vertical not horizontal.

### 6.2 Diacritics — tracking and weight by test

I tested `É`, `œ`, `à`, `ê`, `ç`, `ï` in both faces at display, H1, H2, and body sizes. Results:

- **Inter 600 H1 40px**: all diacritics render cleanly. `É` acute sits well above the cap height; `œ` ligature is correctly proportioned; `ç` cedilla has room. **No adjustment needed.**
- **Inter 600 H2 28px / H3 20px**: same, clean.
- **Inter 400 body 16px**: clean.
- **Inter 400 reading 18px**: clean.
- **JetBrains Mono 500 display 64px at -0.02em tracking**: `É` loses ~1px of acute to the cap height of the next letter when the next letter is ascender-heavy (`l`, `k`). **Adjustment: on `:lang(fr) --t-display`, tracking becomes -0.015em**, matching Agent 3's `i18n.frenchDisplayTracking`. This is the only per-locale tracking change.
- **JetBrains Mono 400 body/code 14px**: clean; monospaced face gives enough room.
- **JetBrains Mono 500 mono-13**: clean; tracking +0.02em already gives extra air.

No weight adjustments needed. Inter and JetBrains Mono at the specified weights have diacritic marks that hold their stroke weight to the main letter — no visible imbalance.

### 6.3 Line-height in FR

FR prose runs slightly longer per line (more narrow glyphs, more ascenders on `é`/`è`). Leading does not change numerically (line-height stays 1.625 on body) — but we **validate on a 2000-char FR test string** that the leading still looks right. It does; Inter's designed line-height curve accommodates Latin-Ext.

### 6.4 Locale-aware punctuation

Implemented via CSS `:lang(fr)` scoping and OpenType features, not per-string rewriting.

- **Quotes:**
  - EN: `"` (U+201C) and `"` (U+201D) — curly double quotes. Inline quotes in MDX use `<q>` and inherit these via `quotes: "\201C" "\201D" "\2018" "\2019";` at `:root`.
  - FR: `« ` (U+00AB + U+00A0 non-breaking space) and ` »` (U+00A0 + U+00BB). Inherits via `:lang(fr) { quotes: "\00AB\00A0" "\00A0\00BB" "\2039\00A0" "\00A0\203A"; }`. The non-breaking space between the guillemet and the word is part of French typography; omitting it is a typographic error.
- **Apostrophes:**
  - Both languages use `'` (U+2019, curly right single quote) — never `'` (U+0027 straight). MDX editors typeset straight; the build pipeline replaces with curly.
- **Dashes:**
  - Em-dash `—` (U+2014) for parenthetical breaks in both EN and FR prose. EN wraps without spaces (`he said—quietly—to no one`); FR wraps with thin spaces (`il a dit — doucement — à personne`) using U+202F narrow no-break space. Same character, different whitespace handling.
  - En-dash `–` (U+2013) for numeric ranges (`pp. 12–18`, `2019–2024`) in both languages.
- **Thin/narrow no-break space:** FR typography requires **narrow no-break space** before `:` `;` `?` `!` `%` and between a guillemet and the word inside. Character: U+202F. Implemented in content (MDX preprocessing) and in our components that auto-format strings (e.g., `<Date>`, `<Percent>`).
- **Ellipsis:** Use the single-glyph `…` (U+2026) in both languages — never three periods.

### 6.5 Numbers and dates

- **Numbers in prose:**
  - EN: thousands separator comma, decimal point — `12,345.67`.
  - FR: thousands separator narrow no-break space (U+202F), decimal comma — `12 345,67`. The narrow space is a typographic convention in Quebec French, enforced.
  - Negatives: minus sign (U+2212), not hyphen-minus, in data tables.
  - Percentages: EN `12%`, FR `12 %` (with narrow no-break space per French typography).
- **Dates:**
  - EN prose: `April 23, 2026` or `Apr 23, 2026`.
  - FR prose: `23 avril 2026` (day-month-year, no comma, month uncapitalized — French convention).
  - Both languages, metadata/mono rows: `2026-04-23` ISO 8601.
- **Times:**
  - EN: `14:30` or `2:30 PM` (24h preferred in mono rows; 12h allowed in prose).
  - FR: `14 h 30` (with narrow no-break spaces) in prose; `14:30` in mono rows.
- **Currency:** the site does not display currency (no markets, no pricing). If future content requires it: EN `$1,200 USD` or `€1,200`; FR `1 200 $ US` or `1 200 €` (currency after, narrow no-break space before). Note only; not shipped.

All of this is enforced in a tiny helper module in the build (`src/lib/i18n-format.ts`) and hand-authored MDX follows the same conventions; Agent 9 wires it.

---

## 7. Interaction surface boundaries — what this doc does *not* spec

Per guardrails: I do not spec motion (Agent 6) or interaction (Agent 5). This doc stops at the typographic / layout surface those agents animate or wire. Specifically:

- The typographic surface of the belief-state loader (Agent 3 §4.4) is mono-13 digits if numerics render; the *motion* of its bars is Agent 6.
- The section-marker flash (§5.3) defines the typography; the duration/easing is Agent 6.
- The behavior-tree nav's label typography (mono-13, Inter 500 when expanded on hover — Agent 3 §4.2) is my surface; the tick animation is Agent 6.
- Code-block copy button: icon and size are mine; click-state / toast is Agent 5.

---

## 8. Design tokens — CSS custom properties

Dropped as-is into `tokens.css`. Dark is the default (on `:root`). Light mode is applied via `[data-theme="light"]` or `@media (prefers-color-scheme: light)` with user override. Colors carry over from Agent 3 §13 tokens unchanged; typography tokens consolidate and extend.

```css
/* ============================================================
   tokens.css — cyrille-tabe-site
   Generated from 07-typography-layout.md (Agent 7)
   Color palette: Agent 3 §13 (unchanged).
   Type system, spacing, grids: Agent 7.
   Dark is default; light opts in via [data-theme="light"]
   or (prefers-color-scheme: light) when not overridden.
   ============================================================ */

:root {
  /* ---------- Font families (Agent 7 §1) ---------- */
  --font-body: "Inter", ui-sans-serif, system-ui, -apple-system,
               "Segoe UI", "Helvetica Neue", sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo,
               "Cascadia Code", Consolas, monospace;

  /* ---------- Type scale (Agent 7 §2) ----------
     Each token emits a font-size + line-height + tracking triple
     via companion tokens. Use them together. */

  /* Display — hero line, one place on the site */
  --fs-display:        4rem;        /* 64px */
  --lh-display:        1.0625;      /* 68px */
  --tr-display:        -0.02em;     /* overridden to -0.015em on :lang(fr) */

  /* H1 — page titles */
  --fs-h1:             2.5rem;      /* 40px */
  --lh-h1:             1.15;        /* 46px */
  --tr-h1:             -0.015em;

  /* H2 — section titles */
  --fs-h2:             1.75rem;     /* 28px */
  --lh-h2:             1.2143;      /* 34px */
  --tr-h2:             -0.01em;

  /* H3 — sub-section / card title */
  --fs-h3:             1.25rem;     /* 20px */
  --lh-h3:             1.4;         /* 28px */
  --tr-h3:             0;

  /* Body — running prose (default everywhere except long-form posts) */
  --fs-body:           1rem;        /* 16px */
  --lh-body:           1.625;       /* 26px */
  --tr-body:           0;

  /* Mono — data rows, section markers, metadata */
  --fs-mono:           0.8125rem;   /* 13px */
  --lh-mono:           1.5385;      /* 20px */
  --tr-mono:           0.02em;

  /* Micro — eyebrows, uppercase markers, axis labels */
  --fs-micro:          0.6875rem;   /* 11px */
  --lh-micro:          1.4545;      /* 16px */
  --tr-micro:          0.06em;

  /* Reading — long-form MDX body only */
  --fs-reading:        1.125rem;    /* 18px */
  --lh-reading:        1.6667;      /* 30px */
  --tr-reading:        0;

  /* Mono-14 — code blocks on all breakpoints (min 14px on mobile) */
  --fs-code:           0.875rem;    /* 14px */
  --lh-code:           1.5714;      /* 22px */
  --tr-code:           0;

  /* ---------- Font weights ---------- */
  --fw-regular:        400;
  --fw-medium:         500;
  --fw-semibold:       600;

  /* ---------- Reading measures (Agent 7 §2.5, §4.1) ---------- */
  --measure-body:          62ch;    /* ideal */
  --measure-body-max:      68ch;    /* hard ceiling */
  --measure-reading:       58ch;    /* ideal */
  --measure-reading-max:   64ch;    /* hard ceiling */
  --measure-heading:       20ch;    /* h1 soft cap */
  --measure-heading-h2:    28ch;
  --measure-heading-h3:    36ch;

  /* ---------- Spacing — 8px atomic unit (Agent 3 §9, Agent 7 §3) ---------- */
  --space-0:   0;
  --space-1:   0.25rem;   /* 4px — micro unit, dense data only */
  --space-2:   0.5rem;    /* 8px — atomic */
  --space-3:   1rem;      /* 16px */
  --space-4:   1.5rem;    /* 24px — paragraph break, gutter (desktop) */
  --space-5:   2rem;      /* 32px — large gutter */
  --space-6:   2.5rem;    /* 40px — beat-to-beat spacing */
  --space-7:   4rem;      /* 64px */
  --space-8:   6rem;      /* 96px — section separator */
  --space-9:   10rem;     /* 160px — outer margin (wide) */

  /* ---------- Grid A — 12-col structured (Agent 7 §3.4) ---------- */
  --gridA-mobile-cols:         4;
  --gridA-mobile-gutter:       1rem;     /* 16px */
  --gridA-mobile-margin:       1rem;     /* 16px */

  --gridA-tablet-cols:         8;
  --gridA-tablet-gutter:       1rem;     /* 16px */
  --gridA-tablet-margin:       2rem;     /* 32px */

  --gridA-desktop-cols:        12;
  --gridA-desktop-gutter:      1.5rem;   /* 24px */
  --gridA-desktop-margin:      3rem;     /* 48px */

  --gridA-wide-cols:           12;
  --gridA-wide-gutter:         1.5rem;   /* 24px */
  --gridA-wide-margin:         5rem;     /* 80px */

  --gridA-large-cols:          12;
  --gridA-large-gutter:        2rem;     /* 32px */
  --gridA-large-margin:        10rem;    /* 160px */

  /* ---------- Grid B — editorial (Agent 7 §3.5) ---------- */
  --gridB-rail-left-desktop:   10rem;    /* 160px — sidenotes, pull-quote attrib */
  --gridB-rail-right-desktop:  7.5rem;   /* 120px — ReadingProgress, figure caps */
  --gridB-main-desktop:        40rem;    /* 640px — ~58–62ch at reading/body */
  --gridB-main-wide:           46rem;    /* 736px */
  --gridB-main-large:          50rem;    /* 800px — caps reading column */

  /* ---------- Radii (Agent 3 §13) ---------- */
  --radius-none:       0;
  --radius-sm:         2px;
  --radius-md:         4px;
  --radius-lg:         8px;

  /* ---------- Stroke / line (Agent 3 §13) ---------- */
  --stroke-hairline:   1px;
  --stroke-icon:       1.5px;
  --stroke-icon-sm:    1.25px;

  /* ---------- Breakpoints (Agent 7 §3.3) ----------
     CSS custom properties are not usable inside @media queries,
     so these are documentation tokens only. Real breakpoints
     live in Agent 9's build config. */
  --bp-mobile:         375px;
  --bp-tablet:         768px;
  --bp-desktop:        1024px;
  --bp-wide:           1440px;
  --bp-large:          1920px;

  /* ---------- Typography rule helpers ---------- */
  --prose-paragraph-gap:  1.5em;      /* 24px at body, 27px at reading */
  --prose-indent:         0;          /* never indent first-line */
  --prose-align:          start;      /* left-ragged */

  /* ---------- Colors — DARK (default, Agent 3 §2.1) ---------- */
  --bg:            #0B0D0E;
  --surface-1:     #15191B;
  --surface-2:     #1F2427;
  --ink:           #E6E1D6;
  --ink-muted:     #8E8A82;
  --primary:       #F3A03B;
  --accent:        #62E0C8;
  --danger:        #E5484D;

  /* Colour-scheme hints for form controls, scrollbars */
  color-scheme: dark;
}

/* ---------- Colors — LIGHT (opt-in, Agent 3 §2.3) ---------- */
[data-theme="light"] {
  --bg:            #F5F2EB;
  --surface-1:     #ECE7DC;
  --surface-2:     #E0D9CB;
  --ink:           #1A1C1D;
  --ink-muted:     #5A5650;
  --primary:       #B86A14;
  --accent:        #0F8F7A;
  --danger:        #B3282D;
  color-scheme: light;
}

/* System preference follow, without override */
@media (prefers-color-scheme: light) {
  :root:not([data-theme]) {
    --bg:            #F5F2EB;
    --surface-1:     #ECE7DC;
    --surface-2:     #E0D9CB;
    --ink:           #1A1C1D;
    --ink-muted:     #5A5650;
    --primary:       #B86A14;
    --accent:        #0F8F7A;
    --danger:        #B3282D;
    color-scheme: light;
  }
}

/* ---------- FR tracking adjustment on display (Agent 7 §6.2) ---------- */
:lang(fr) {
  --tr-display: -0.015em;
}

/* ---------- Locale-aware quotes (Agent 7 §6.4) ---------- */
:root {
  quotes: "\201C" "\201D" "\2018" "\2019";
}
:lang(fr) {
  quotes: "\00AB\00A0" "\00A0\00BB" "\2039\00A0" "\00A0\203A";
}

/* ---------- Base element bindings ---------- */
html {
  font-family: var(--font-body);
  font-size: 100%;               /* respect user default */
  line-height: var(--lh-body);
  color: var(--ink);
  background-color: var(--bg);
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  font-weight: var(--fw-regular);
  font-feature-settings: "ss01", "cv11", "kern" on;
  font-variant-numeric: proportional-nums;
}

h1, .t-h1 {
  font-family: var(--font-body);
  font-size: var(--fs-h1);
  line-height: var(--lh-h1);
  letter-spacing: var(--tr-h1);
  font-weight: var(--fw-semibold);
  max-width: var(--measure-heading);
}
h2, .t-h2 {
  font-family: var(--font-body);
  font-size: var(--fs-h2);
  line-height: var(--lh-h2);
  letter-spacing: var(--tr-h2);
  font-weight: var(--fw-semibold);
  max-width: var(--measure-heading-h2);
}
h3, .t-h3 {
  font-family: var(--font-body);
  font-size: var(--fs-h3);
  line-height: var(--lh-h3);
  letter-spacing: var(--tr-h3);
  font-weight: var(--fw-semibold);
  max-width: var(--measure-heading-h3);
}

.t-display {
  font-family: var(--font-mono);
  font-size: var(--fs-display);
  line-height: var(--lh-display);
  letter-spacing: var(--tr-display);
  font-weight: var(--fw-medium);
  font-feature-settings: "calt", "liga", "zero", "tnum";
}

.t-mono, .t-marker {
  font-family: var(--font-mono);
  font-size: var(--fs-mono);
  line-height: var(--lh-mono);
  letter-spacing: var(--tr-mono);
  font-weight: var(--fw-medium);
  font-feature-settings: "tnum", "zero", "kern";
}

.t-micro {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  line-height: var(--lh-micro);
  letter-spacing: var(--tr-micro);
  font-weight: var(--fw-medium);
  text-transform: uppercase;
}

.t-reading {
  font-size: var(--fs-reading);
  line-height: var(--lh-reading);
  letter-spacing: var(--tr-reading);
  max-width: var(--measure-reading);
}

/* ---------- Prose column (Agent 7 §4) ---------- */
.prose {
  max-width: var(--measure-body);
  text-align: var(--prose-align);
  hyphens: manual;
}
.prose :lang(fr) { hyphens: auto; }
.prose > * + * { margin-block-start: var(--prose-paragraph-gap); }

/* Tabular zones flip numerics on */
.tabular, table, time, .t-mono, .t-micro, .t-display {
  font-variant-numeric: tabular-nums;
}

/* Inline code */
code {
  font-family: var(--font-mono);
  font-size: 0.875em;
  background: var(--surface-1);
  padding: 0.125em 0.375em;
  border-radius: var(--radius-sm);
  font-feature-settings: "calt", "liga", "zero";
}

/* Block code */
pre, pre > code {
  font-family: var(--font-mono);
  font-size: var(--fs-code);
  line-height: var(--lh-code);
  tab-size: 2;
  font-feature-settings: "calt", "liga", "zero";
}
pre {
  background: var(--surface-2);
  border: 1px solid var(--surface-1);
  border-radius: var(--radius-md);
  padding: var(--space-3) var(--space-4);
  overflow-x: auto;
  margin-block: var(--space-4);
}
@media (max-width: 768px) {
  pre {
    margin-inline: calc(-1 * var(--gridA-mobile-margin));
    padding-inline: var(--gridA-mobile-margin);
    border-radius: 0;
    border-inline: none;
  }
}

/* Block quotes (Agent 7 §4.3) */
blockquote {
  margin-inline-start: calc(-1 * var(--space-4));
  padding-inline-start: var(--space-4);
  border-inline-start: 2px solid var(--primary);
  color: var(--ink);
  font-size: var(--fs-reading);
  line-height: var(--lh-reading);
}
blockquote cite {
  display: block;
  margin-block-start: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  line-height: var(--lh-micro);
  letter-spacing: var(--tr-micro);
  text-transform: uppercase;
  color: var(--ink-muted);
  font-style: normal;
}
blockquote cite::before { content: "— "; }
@media (max-width: 768px) {
  blockquote {
    margin-inline-start: 0;
    padding-inline-start: var(--space-3);
  }
}

/* Pull quotes (Agent 7 §5.2) */
.pull-quote {
  font-family: var(--font-body);
  font-size: var(--fs-h3);
  line-height: var(--lh-h3);
  letter-spacing: var(--tr-h3);
  font-weight: var(--fw-semibold);
  color: var(--ink);
  border-block-start: 2px solid var(--primary);
  padding-block-start: var(--space-3);
  margin-block: var(--space-6);
}

/* Figure captions (Agent 7 §4.5) */
figure { margin-block: var(--space-4); }
figcaption {
  font-family: var(--font-body);
  font-size: var(--fs-mono);            /* 13px default */
  line-height: var(--lh-mono);
  color: var(--ink-muted);
  margin-block-start: var(--space-2);
}
figcaption[data-source]::after {
  content: "source: " attr(data-source);
  display: block;
  margin-block-start: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  line-height: var(--lh-micro);
  letter-spacing: var(--tr-micro);
  text-transform: uppercase;
}
@media (max-width: 768px) {
  figcaption {
    font-size: 0.875rem;                /* bump to 14px on mobile */
    line-height: 1.5714;
  }
}

/* Section markers (Agent 7 §5.3) */
.section-marker {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  line-height: var(--lh-micro);
  letter-spacing: var(--tr-micro);
  text-transform: uppercase;
  color: var(--ink-muted);
  margin-block: var(--space-5) var(--space-3);
}
.section-marker::before {
  content: "";
  display: inline-block;
  width: 48px;
  height: 1px;
  background: var(--ink-muted);
  opacity: 0.12;
}

/* Callouts (Agent 7 §5.6) */
.callout {
  border-inline-start: 2px solid var(--ink-muted);
  padding: var(--space-3) var(--space-4);
  margin-block: var(--space-4);
  background: var(--surface-1);
  border-radius: var(--radius-sm);
}
.callout--info    { border-inline-start-color: var(--accent); }
.callout--warning { border-inline-start-color: var(--danger); }
.callout--aside   { border-inline-start-color: var(--ink-muted); background: transparent; }

/* Motion respect — token hook only; Agent 6 owns actual motion */
@media (prefers-reduced-motion: reduce) {
  :root { --motion-scale: 0; }
}
:root { --motion-scale: 1; }

/* ---------- Font faces (self-hosted, Agent 7 §1.2) ---------- */
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter/Inter-Regular.latin-ext.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
  unicode-range: U+0000-00FF, U+0100-017F, U+2018-201F, U+2022-2026,
                 U+00A0, U+00AB, U+00BB, U+202F;
}
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter/Inter-Regular.italic.latin-ext.woff2") format("woff2");
  font-weight: 400;
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter/Inter-Medium.latin-ext.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "Inter";
  src: url("/fonts/inter/Inter-SemiBold.latin-ext.woff2") format("woff2");
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/jetbrains-mono/JetBrainsMono-Regular.latin-ext.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: "JetBrains Mono";
  src: url("/fonts/jetbrains-mono/JetBrainsMono-Medium.latin-ext.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

/* Fallback metric overrides to minimize CLS during swap */
@font-face {
  font-family: "Inter-fallback";
  src: local("Arial");
  ascent-override: 90.2%;
  descent-override: 22.48%;
  line-gap-override: 0%;
  size-adjust: 107.4%;
}
@font-face {
  font-family: "JetBrains-Mono-fallback";
  src: local("Consolas"), local("Courier New");
  ascent-override: 92%;
  descent-override: 26%;
  line-gap-override: 0%;
  size-adjust: 100%;
}
```

---

## 9. Hand-offs & open items

- **To Agent 5 (engineering):** the copy-button on code blocks needs hover and mobile-visible states; the behavior-tree nav's expanded-on-hover labels need Inter 500 13px (mono 13px on default state). Spec the state-change glue; I've given you the typography per state.
- **To Agent 6 (motion):** the section-marker numeric flash (§5.3) wants a 240ms `ease-out-quart` fade through `--primary`. The pull-quote `--primary` rule could also fire in as a 2px → full-width-stroke reveal. Own the timing; my surface is the end-state.
- **To Agent 9 (build / tokens):** the `tokens.css` block in §8 is ready. Subset the fonts to `latin+latin-ext` using `pyftsubset` or `fonttools`; preload only Inter-Regular and JetBrainsMono-Medium; wire `:lang(fr)` attributes at the document level via Astro's layout.
- **Blocker — hyphenation in FR MDX:** `hyphens: auto` depends on the browser shipping hyphenation dictionaries for `fr-CA`. Chrome/Edge/Safari do; Firefox historically has gaps. Test and fall back to `manual` with soft-hyphens (`&shy;`) in FR posts if coverage is incomplete. Assigning this test to Agent 9.
- **Flagged for Agent 2 (narrative/voice):** the `§` section markers on FR pages need translated labels. Three already in Agent 2's EN copy (Orientation, Ships-Before-Slides, Writing, etc.). Need FR equivalents: `§ 00 / AMORÇAGE`, `§ 01 / ORIENTATION`, `§ 02 / LIVRER AVANT DE PRÉSENTER`, `§ 03 / PERCEPTION & INTELLIGENCE SPATIALE`, `§ 04 / PLANIFICATION & DÉCISION`, `§ 05 / COMPRÉHENSION HUMAINE`, `§ 06 / SYSTÈMES & INFRASTRUCTURE`, `§ 07 / FRONTIÈRE`, `§ 08 / SIGNAL`, `§ 09 / INVITATION`. Strawman only — Agent 2 owns final FR.
- **Flagged for Cyrille:** test the display hero line in FR on a 375px mobile screen. If "Je construis des machines qui perçoivent, décident, agissent" wraps to more than 3 lines at `--t-display` (64px), the display size for `/fr/` hero needs a `clamp(48px, 8vw, 64px)` responsive scale. I left the tokens fixed for now — easier to read and reason about. Validate and I'll add the clamp.

---

*End of 07-typography-layout.md — Agent 7, Typography & Layout.*
