# ADR-0004: Ambient Hue — visitor-adjustable color, as part of the pitch

- **Status:** Accepted
- **Date:** 2026-10-22
- **Decided during:** `/grilling` session (domain-modeling)

## Context

The site just rebranded to a fixed navy/light-blue accent scheme (2026-10-22, `color-feature`). The owner then proposed a **"Choose Color" button beside the hero CTA**, opening a slider that changes the background shader's color — "something like gradient colors."

This collides with three standing decisions:

1. `docs/plan.md` §4 — the hero has **one CTA** ("View Work"), because the Funnel exists to earn an interview.
2. `CONTEXT.md` — the **Signature Moment** is *the* thing a visitor must remember; everything else is subordinate.
3. ADR-0003 — the Live Proof field's *"brightness is bounded by site-wide legibility."*

A visitor-controlled color could dilute all three: a second CTA competing with the funnel, a remixable hero, and arbitrary field colors under white body copy.

## Decision

**Expose the color choice as part of the pitch, under a bounded model: the Ambient Hue.**

1. **Part of the pitch, not settings.** The button sits beside the hero CTA and opens a small popover slider. The point is the interactivity itself — a demonstration of creative front-end range. This consciously amends plan.md §4's "one CTA": the color control is a *pitch affordance*, visually subordinate to the funnel CTA.
2. **Blend slider, fixed endpoints.** One slider from **blue ↔ yellow**. At any position the field renders **one blended color**, interpolated along the **hue path** (blue → teal → green → yellow) — never straight RGB (which passes through muddy gray).
3. **Scope.** The hue drives: the Live Proof field, the hero's bulge tint (keeps the soft-fade bleed edge seamless — a fixed navy hero over a yellow field would show a hue seam), and a **contrast-derived accent** for accent-colored text — *lighter on dark hues, darker on light hues*.
4. **Brightness ceiling.** Endpoint colors are capped (the yellow end is a deep goldenrod, not bright yellow) so **white body copy (`text-white/85`) always stays legible**. Body text never adapts; only the accent flips polarity. ADR-0003's brightness bound remains literally true.
5. **No persistence.** The choice resets on reload; every visit opens on brand navy. First impressions belong to the brand, not the previous visitor.

## Consequences

**(+) Upside**

- The pitch widens without a new section: interactivity demonstrated on the most visible pixels.
- Hue cohesion across the hero's bleed edge (field and hero tint move together).
- Legibility preserved *by construction* (the ceiling), not by QA-ing arbitrary visitor colors.
- Brand protected on every first load.

**(−) Downside / cost**

- Two buttons in the hero CTA row; "View Work" must stay visually primary (design constraint, not a given).
- The shader palettes stop being hard-coded constants — hue becomes a runtime parameter, and the accent rule becomes real color math (derived contrast), not a static token.
- The accent polarity flip must be tested across the whole slider range; the teal/green midpoints are the actual stress cases.
- A future "remember my color" request would contradict decision 5 — reopen this ADR, don't bolt it on.

## Alternatives considered

- **Settings icon in nav/footer (subordinate placement)** — rejected: the owner judged the control part of the pitch; hiding it defeats the purpose.
- **Full-polarity adaptation (body text flips dark on light hues too)** — rejected: every section's text becomes a moving target; a site-wide QA surface, and it breaks ADR-0003's brightness bound.
- **Preset swatches (snap, no journey)** — rejected in favour of the blend slider's journey through teal/green.
- **Free-brightness "any color" field** — rejected: kills legibility and the brand in one drag.
- **Persistence (`localStorage`)** — rejected: recruiters should meet the brand, not the previous visitor's leftover hue.
