# ADR-0003: Live Proof as a site-wide ambient background, occluded behind the hero

- **Status:** Accepted
- **Date:** 2026-07-12
- **Decided during:** `/grilling` follow-up (domain-modeling)

## Context

The Live Proof (CONTEXT.md "Live Proof"; ADR-0002 for sourcing) was first built as a per-section artifact behind the About copy, then briefly reused on Selected Work. The owner found the per-section placement read worse than a single site-wide background: the shader appeared, vanished on Techstack, then reappeared — choppy rather than cohesive.

The desired end state is the shader as **one ambient background across the whole site.** This collides with the Signature Moment principle (`CONTEXT.md`): the hero is *the* high-impact interaction and everything else is subordinate. A persistent moving field behind the hero risks diluting it.

## Decision

**Realize the Live Proof as a single fixed full-viewport background behind all content, and occlude it behind the hero.**

- One `<LiveProof>` instance, `position: fixed`, painted behind `<main>` (negative z-index), rendering the same fragment field continuously.
- The **hero section carries an opaque backing** (`bg-black`) so the shader is not visible while the hero is in view — the shader "starts after the hero." This keeps the Signature Moment pristine: no second moving element competes with the 3D "JUAN".
- Below the hero, transparent sections show the field; sections with their own opaque/gradient backgrounds (e.g. `#contact`'s radial gradient) become natural calm zones.
- Global cursor + global scroll progress drive the field (no per-section triggers); reveal is held at full where the field is visible.

## Consequences

**(+) Upside**

- One cohesive ambient world across the site instead of choppy per-section placement.
- The Signature Moment stays protected — the shader literally cannot appear behind the hero.
- A single GPU context for the background (vs. many per-section canvases).

**(−) Downside / cost**

- A fixed background is always on-screen, so the offscreen RAF-pause optimisation no longer applies — the GPU runs while the page is open. Mitigated by the factory's mobile intensity derate, DPR cap, adaptive frame-rate guard, and a static poster for `prefers-reduced-motion`.
- Every section's text now sits over the field, so brightness is bounded by site-wide legibility (kept at the text-safe level the owner approved).

## Alternatives considered

- **Per-section instances (the prior approach)** — rejected by the owner; read as choppy (on/off/on across sections).
- **Site-wide AND show through the hero** — rejected. Two moving fields (the shader + the hero's 3D type) would compete for attention and dilute the Signature Moment, violating the Funnel.
- **A single tall scrolling canvas behind everything** — rejected on cost (document-height fill rate is prohibitive).

## Revision (2026-07-16): soft-fade bleed-through at the hero's bottom edge

The original occlusion used a hard `bg-black` edge, which left a visible #000 seam where the hero met the Live Proof field below. Refined to a **CSS-mask fade**: the hero's `bg-black` + 3D canvas now sit in a `.hero-backing` wrapper whose `mask-image` fades to transparent over the bottom ~20%, so the Live Proof bleeds through for a seamless handoff.

Why this isn't the rejected "show through the hero" alternative: the fade is confined to the bottom transition strip, well below the 3D "JUAN" type — the Signature Moment stays on a fully opaque backing, so the field is not a second competing element across the hero. The CTA overlay is a **sibling** of `.hero-backing`, so it is not masked and stays crisp at any height.

The decision still holds: the Live Proof remains one site-wide fixed background, **occluded behind the hero** — now with a soft edge rather than a hard one.
