# Tickets: Ambient Hue

A visitor-adjustable ambient color for the site — the "Choose Color" slider beside the hero CTA — built per [ADR-0004](docs/adr/0004-ambient-hue-visitor-adjustable-color.md) and the *Ambient Hue* glossary entry in [`CONTEXT.md`](CONTEXT.md).

Work the **frontier**: any ticket whose blockers are all done. T2 and T3 can run in parallel once T1 lands.

## T1 — Ambient Hue core: "Choose Color" slider drives the Live Proof field

**What to build:** A visitor sees a second, visually-subordinate button — "Choose Color" — beside the hero's "View Work" CTA. Activating it opens a small popover with a single blend slider, endpoints **blue ↔ yellow**. Dragging recolors the site-wide Live Proof field live: the blended color journeys along the **hue path** (blue → teal → green → deep goldenrod) — never muddy RGB gray. Valleys stay near-black; ridge/accent tints derive from the chosen hue at a **capped luminance** (the yellow end is a deep goldenrod, not bright yellow — the brightness ceiling keeps white body copy legible). On reload the site opens on brand navy; the choice is never persisted.

**Blocked by:** None — can start immediately.

- [ ] Button renders beside the funnel CTA and reads clearly as secondary to "View Work"
- [ ] Popover opens from the button; one slider with blue/yellow endpoints
- [ ] Dragging recolors the Live Proof field live across the whole site (below the hero)
- [ ] The midpoint of the drag passes through teal/green — no muddy gray at any position
- [ ] Field stays legible behind white body copy at every position (yellow end is deep goldenrod)
- [ ] Reload returns to brand navy; nothing is written to localStorage or cookies

## T2 — Accent follows the Ambient Hue (contrast-derived)

**What to build:** With the Ambient Hue slider in place, every accent-colored element (heading spans, case-study flags, hover borders) derives its color live from the current hue instead of a fixed token. The derivation is contrast-based: *lighter on dark hues, darker on light hues* — the polarity flip is visible as the visitor drags toward the yellow end. The teal/green midpoints are the designated stress cases (ADR-0004).

**Blocked by:** T1 — Ambient Hue core: "Choose Color" slider drives the Live Proof field.

- [ ] All accent text/UI follows the current hue live while dragging
- [ ] Accent is lighter than the field on dark hues and darker on light hues (visible polarity flip toward yellow)
- [ ] Teal and green midpoints remain readable (accent text, flags, hovers)
- [ ] No hardcoded accent token remains — the Ambient Hue is the single source of truth

## T3 — Hero bulge tint follows the Ambient Hue

**What to build:** The 3D "JUAN" hero's bulge tint rides the current Ambient Hue while the letterforms stay white-dominant — form and motion are never visitor-remixed (CONTEXT.md, *Signature Moment*). At every slider position, the hero's soft-fade bottom edge must show **no hue seam** between the field and the hero bulges. The field remains occluded behind the hero exactly as today (ADR-0003 unchanged); default is brand navy.

**Blocked by:** T1 — Ambient Hue core: "Choose Color" slider drives the Live Proof field.

- [ ] Hero bulge tint tracks the slider live; letterform base stays near-white
- [ ] No hue seam at the hero fade edge at any slider position (test at least blue / teal / green / goldenrod)
- [ ] Occlusion and reduced-motion behavior behind the hero unchanged
- [ ] Default (no interaction) renders the current brand navy exactly as today

## T4 — Ambient Hue — range QA + guardrails

**What to build:** With the full Ambient Hue scope live (field + accent + hero tint), verify legibility and interaction quality across the slider's full range on desktop and mobile, and close the guardrail gaps: the `prefers-reduced-motion` static poster reflects the current hue, the popover is keyboard-operable, and persistence is confirmed absent.

**Blocked by:** T2 — Accent follows the Ambient Hue (contrast-derived); T3 — Hero bulge tint follows the Ambient Hue.

- [ ] Legibility pass across sampled positions (blue / teal / green / goldenrod × desktop / mobile) — body copy, accents, flags
- [ ] Reduced-motion poster uses the current hue (or brand navy if never touched)
- [ ] Popover: keyboard operable, ESC closes, focus returns to the button
- [ ] Confirmed: no persistence of any kind across reloads
- [ ] Build + lint clean
