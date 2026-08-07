# About Scroll-story — Session Handoff

> **Status (2026-07-17):** FOURTH rebuild rejected without specifics. The owner has now rejected 4 distinct concepts across 2 sessions. **Do NOT attempt a fifth rebuild blind.** Run `/grilling` first.
> **Branch:** `about-feature` (all changes uncommitted, nothing reverted)
> **Sessions covered:** 1 (2026-07-16), 2 (2026-07-17)

---

## TL;DR for the next session

The About section has been rebuilt **4 times**. All 4 builds were rejected by the owner without specific feedback. The pattern must stop.

| #  | Session | Concept                                            | Outcome                                |
|----|---------|----------------------------------------------------|----------------------------------------|
| v0 | 1       | Vertical SVG line, sentences reveal on scroll      | "I don't like it" (no specifics)       |
| v1 | 2       | Arrow travels + morphs, alternating sides          | "I don't like it"                      |
| v2 | 2       | Line + arrow as drawing head (continuous path)     | "I don't like it"                      |
| v3 | 2       | Line writes paragraphs (SplitText char stagger)    | Not confirmed; owner requested grilling |

**FIRST TASK NEXT SESSION: `/grilling`.** The owner cannot articulate what's wrong with each iteration, and the Session 1 #1 instruction (*"elicit what the owner doesn't like — do not rebuild blind"*) was NOT followed — Session 2 rebuilt blind three more times. Stop. Run the grilling skill to surface specifics before any code.

**Open questions for the grilling:**
- What does "mixes with the paragraphs" actually mean? (v3 Option B was "most close" — close how? what's missing?)
- Is the arrow wanted? (v3 dropped it; never confirmed.)
- Should About be pinned/spectacle (Session 2 default) or calm/recessive (Session 1 locks)?
- What specifically felt wrong about each of v0/v1/v2/v3?
- Is the Live Proof background integration (`data-calm-zone`) even wanted?

---

## SESSION 2 (2026-07-17) — three rebuilds, still no specifics

The owner said "I don't like it" about Session 1's vertical-line build (v0). Over this session three more concepts were tried. All rejected. None with specific feedback. Lint + build green throughout.

### Path A override (decided this session)
The owner's first request (arrow scroll-story with pinning + scrub + alternating-side travel) materially conflicted with the Session 1 locked design. I flagged three tensions (Signature Moment rivalry, Calm zone "quiet", vertical-line metaphor) and offered Path A (full override + update docs) vs Path B (recessive adaptation). Owner chose **Path A**.

**Doc updates deferred.** `CONTEXT.md` "Scroll-story" term and ADR-0003 "dimmed calm zone" still describe the Session 1 vertical-line concept. They were NOT updated this session because the concept isn't locked. **Do NOT update them until `/grilling` locks the concept.**

### v1 — Arrow-travel scroll-story
**Spec:** Pinned, scrubbed master timeline. Downward arrow appears centered, descends, morphs into sentence 1. Arrow reappears on alternating sides, crosses+descends to next sentence, morphs. Crossfade morphs (opacity + scale — true SVG path-morphing needs MorphSVG, a paid plugin not in the gsap package).
**Configurable:** `ABOUT_CONFIG` block — `CHAPTER_VH`, `STAGE_PAD_*_VH`, `SIDE_OFFSET_VW`, `FADE/TRAVEL/MORPH/HOLD_FRACTION` (must sum to 1.0).
**Result:** "I don't like it." → owner asked about "continuing line that connects paragraphs."

### v2 — Option A: Line + arrow as drawing head
**Spec:** Continuous SVG `<path>` through paragraph anchor points (start + one per paragraph), drawn progressively via `strokeDashoffset`. Arrow rides at the leading edge using `positionAtDistance()` (analytical linear-interpolation along path segments). Same crossfade morph mechanic at each anchor.
**Why this was different from v0:** v0 was a single vertical line separate from the sentences; v2 is a zigzag connector *through* the anchor points.
**Result:** "I don't like it." → owner asked about "continuing line that *mixes with* the paragraphs."

### v3 — Option B: Line writes paragraphs (CURRENT `About.jsx`)
**Spec:** No arrow (dropped). Continuous SVG path draws progressively. Each paragraph is `SplitText`'d into chars; chars reveal one-by-one in sequence staggered across the chapter's WRITE phase, finishing exactly as the line reaches that paragraph's anchor. End state: zigzag thread + all paragraphs visible.
**Key choices made (each potentially wrong — flag in grilling):**
1. No arrow / pen indicator. The line's leading edge is the implicit pen.
2. Time-staggered chars (not position-tracked — measuring each char's xy is more authentic but fragile on resize).
3. Straight line segments (not Bezier curves).
4. Opacity + y offset for char reveal (not per-char left-to-right clip wipe — would read as more "handwritten" but heavier on paint with ~400 chars).
5. Uses `SplitText` (free in gsap@3.13, already registered in `App.jsx`).
6. Reduced motion: skip SplitText, paragraphs as plain text, line fully drawn.
**Result:** Owner said *"ok we need a grilling but lets do it on another session"* — i.e. **v3 is NOT confirmed liked either.**

### Files changed in Session 2
- **`src/components/About.jsx`** — current state is v3 (line-writes-paragraphs). Fully commented; helpers `paragraphPosition`, `buildLinePoints`, `buildPathD`, `computeDistances`; timeline builder `appendChapter`. No arrow; SVG path + SplitText chars.
- All other Session 1 file changes (`CONTEXT.md`, ADR-0003, `LiveProof.jsx`, `about/createLiveProofScene.js`, `constants/index.js`, `tickets.md`) remain on the branch uncommitted and unchanged this session.

### Commands
```bash
npm run dev                       # view v3 in browser
npm run lint                      # green
npm run build                     # green
git status                        # 6 modified + 2 untracked, all uncommitted on about-feature
git diff src/components/About.jsx # full v3 source
```

### What I'd do differently next time
- **Insist on the grilling earlier.** After v1's rejection with no specifics, I should have stopped and run `/grilling` instead of presenting another options menu. Options menus let the owner pick a direction without revealing what was wrong with the prior one.
- **Demand a reference.** I asked for visual references after v2; the owner didn't provide one. A single reference (site / CodePen / sketch) would have collapsed the iteration space dramatically.
- **Don't override locked design mid-session.** Path A was approved but added doc debt that's still unpaid. If the concept isn't locked, neither should the override be.

---

## SESSION 1 (2026-07-16) — original build, archived below

> Original status: Built & green (lint + build pass), but the owner is unhappy with the result. The fix is deferred to the next session. This doc is the resume point — read it first.
> Originated in: `/grilling` (domain-modeling) → `/to-tickets` → `/implement`

### The locked design (from the Session 1 grilling — do NOT re-litigate without owner challenge)
These decisions are settled in `CONTEXT.md` + ADR-0003. The next session works within them, not against them — **unless** the owner's grilling overturns them.

- **Content = abilities/skills, NOT a career history/timeline.** This avoids re-leaking the de-branded XR identity (ADR-0001). The Repositioning stays intact.
- **Form = a Scroll-story.** Multi-beat, **sentence-level** beats (defined in `CONTEXT.md` under "Interaction"). Strictly **subordinate to the hero** (the 3D "JUAN" is the Signature Moment).
- **Line = vertical, SVG/DOM** (NOT WebGL — a shader line would be a second Live Proof, which `CONTEXT.md` forbids). Grows downward with scroll; each beat reveals when it enters view.
- **Background = transparent over the field; About is a DIMMED calm zone** (glossary term). The Live Proof field eases down to ~40% intensity while About is in view, back to full on leave.
- **Field dim = PER-SECTION** (the grilling fork "b"). ADR-0003 revision: per-section *intensity dimming* is permitted; per-section *content/animation triggers* remain forbidden.
- **Seam (Q9): About names NO tools; Tech Stack lists tools.** Beats are tool-agnostic.

**The four beat facets:** positioning → real-time 3D craft → motion/GSAP craft → performance & accessibility.

### What was built in Session 1 (file by file)
All on branch `about-feature`, **uncommitted**, `npm run lint` + `npm run build` green.

**Docs (these stand regardless of the visual fix):**
- **`CONTEXT.md`** — added two glossary terms under "Interaction": **Scroll-story** and **Calm zone** (two forms: *occluded* and *dimmed*).
- **`docs/adr/0003-…md`** — added a **Revision (2026-07-16)** note: per-section intensity dimming permitted for dimming only; About is the first dimmed calm zone.
- **`tickets.md`** (repo root, new) — the 3 tracer-bullet tickets (T1/T2/T3).

**T1 — Calm-zone support on the Live Proof:**
- **`src/components/about/createLiveProofScene.js`** — factory gained an **eased `setIntensity(target)`** (chased by the RAF loop like `setReveal`). Existing one-way adaptive frame-rate derate reconciled as a **`guardCeiling`** the eased value can never exceed.
- **`src/components/LiveProof.jsx`** — added `CALM_ZONE_INTENSITY_FACTOR = 0.4` and a 4th `useGSAP` block that scans for `[data-calm-zone]` elements, creates a `ScrollTrigger` per zone that eases intensity to `intensity * 0.4` on enter / back to `intensity` on leave.

**T2 — Beats + shell:**
- **`constants/index.js`** — `aboutCopy.body` (one string) → `aboutCopy.beats` (array of 4 sentences). Draft copy, tool-agnostic per the Q9 seam. `eyebrow` + `title` retained.
- **`src/components/About.jsx`** — rebuilt as a tall, transparent `<section id="about" data-calm-zone>`. Beats spaced `gap-[40vh]`.

**T3 — Line + beat reveals (THIS IS v0, replaced by v3 in Session 2):**
- Vertical **SVG line** (`strokeDashoffset` scrubbed with scroll) + per-beat reveal `ScrollTrigger`s (`EASE.reveal`, opacity+y). Reduced-motion fallback shows everything statically.

### Candidate sources of dissatisfaction (from Session 1 — still unverified)
The owner said "I don't like it" without specifics. Original hypotheses:
1. The feel/timing of the line + reveals (desync, sluggishness).
2. Dim strength (`CALM_ZONE_INTENSITY_FACTOR = 0.4`).
3. Section length (`gap-[40vh]` ×3 = ~160vh+).
4. Copy (draft, tool-agnostic — maybe owner wants different facets or tools named).
5. The line itself (color, weight, metaphor).
6. **Overall concept mismatch.** Owner's original phrasing — "a line that when you scroll down is showing the text" — might have meant something different (e.g. a reveal *mask/wipe* over the text). **Still unresolved.**

### Known minor issues
- `prefersReducedMotion()` is duplicated in `LiveProof.jsx` and the original `About.jsx` (v3 dropped it from About). Could be extracted to `motion/` later.
- `gap-[40vh]` was an arbitrary Tailwind value (v0 only).

---

## 6. Next-session entry point (recommended sequence)

1. **Run `/grilling`** on the About concept before any code. Surface specifics. Lock the concept (or formally overturn Session 1 locks).
2. If the concept overturns Session 1 locks: update `CONTEXT.md` + ADR-0003 to match.
3. Rebuild once, against the locked concept.
4. `/code-review` the branch, then commit to `about-feature`.
