# Tickets: About Scroll-story

Turn the `#about` section from a static positioning paragraph into a **Scroll-story** (CONTEXT.md): a multi-beat, sentence-level narrative revealed progressively by a vertical line, told over a **dimmed calm-zone** Live Proof field. Subordinate to the hero (Signature Moment), no XR leak, no second Live Proof. Domain model locked in the `/grilling` session; see `CONTEXT.md` (Scroll-story, Calm zone) and ADR-0003's 2026-07-16 revision.

Work the **frontier**: any ticket whose blockers are all done. This is a linear chain — top to bottom.

## T1 — Calm-zone support on the Live Proof

**What to build:** the Live Proof field can be quietened *only while a section declaring itself a calm zone is in view*, and returns to full when it leaves. This is the ADR-0003 revision ("per-section intensity dimming for dimming only; no per-section content/animation triggers") made real. No new canvas, no new shader — only an intensity scalar on the one global field becomes scroll-region aware.

**Blocked by:** None — can start immediately.

- [ ] Factory gains an eased `setIntensity(target)` (chased by the RAF loop, like `setReveal`/`setScroll`), and the existing one-way adaptive derate is reconciled as a *ceiling* the eased value can never exceed (so derate survives runtime intensity changes).
- [ ] LiveProof component scans for `[data-calm-zone]` elements and creates ScrollTriggers that ease intensity down on enter, back to full on leave. Sections declare intent via the attribute; dimming stays centralized here.
- [ ] Reduced-motion path unaffected (static poster; no dimming needed).
- [ ] `npm run lint` + `npm run build` green.

## T2 — About Scroll-story shell + beat copy

**What to build:** the About section becomes a tall, transparent section over the (now dimmable) field, containing four sentence-level beats laid out vertically — the positioning narrative as a *story*, not one block.

**Blocked by:** T1 (needs the calm-zone so the field quiets behind the copy).

- [ ] `aboutCopy` refactored from one body string into an array of four sentence beats, one each for: positioning → real-time 3D craft → motion/GSAP craft → performance & accessibility. About names **no tools** (the Tech Stack seam; CONTEXT.md Funnel).
- [ ] `About.jsx` rebuilt as a tall, transparent section marked `data-calm-zone`, with the four beats laid out vertically with room for a line to grow between them.
- [ ] Legibility verified over the dimmed field in-browser; dial the calm factor down if needed.
- [ ] `npm run lint` + `npm run build` green.

## T3 — About Scroll-story line + beat reveals

**What to build:** the signature behavior of the Scroll-story — a vertical SVG/DOM line that grows downward as you scroll, with each beat revealing (`EASE.reveal`) when the line reaches it. The line is **not** WebGL (would be a second Live Proof; CONTEXT.md forbids it).

**Blocked by:** T2 (needs the laid-out beats to attach reveals to).

- [ ] Vertical SVG line that grows with scroll (GSAP ScrollTrigger scrubbing a path/height).
- [ ] Each beat reveals (opacity/translate, `EASE.reveal` from `motion/easings.js`) when the line reaches it — one beat at a time, never a second spectacle.
- [ ] Reduced-motion fallback: beats visible, line static (no growth/scrub).
- [ ] Stays visibly subordinate to the hero (not pinned as a full-viewport spectacle).
- [ ] `npm run lint` + `npm run build` green.
