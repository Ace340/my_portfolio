# CONTEXT.md

> Glossary for the portfolio redesign. Domain language only — no implementation, specs, or TODOs.
> Captured during the `/grilling` session (domain-modeling). Update inline as terms resolve.

## Identities

- **Primary Identity** — *Front-end Creative Developer*. The role the site exists to get hired for; owns the hero and the dominant real estate. Three.js / WebGL / GSAP are *core* skills here, not side notes.
- **Passion Track** — a creative discipline showcased as an *addition* to the Primary Identity, not a rival for attention. Proven tracks: *Level Design* (maps, blueprints, models, games) and *Film & Photography*. *Music (Mints on the House)*: kept — as a small, clearly-subordinate tertiary corner (decided 2026-07-10; see `docs/plan.md` §4). Kept *small* on purpose so the Funnel stays intact.

## Structure

- **Funnel** — the site's information-architecture: Primary Identity dominant at the top; Passion Tracks confined to a smaller, clearly-secondary zone. Opposed to *Parallel* (equal-weight sections) and *Umbrella* (one brand spread over facets). Chosen over those because the site has a single primary job: earn a front-end interview.

## Interaction

- **Signature Moment** — the single high-impact interaction that *proves* the Primary Identity. For this project: a **reactive Three.js hero built from 3D type** (the owner's name "JUAN" extruded in 3D, distorted by cursor + scroll) — *identity-first*. The one thing a visitor must remember; gets the largest share of creative effort. All other motion (scroll-story, case-study reveals) is subordinate to it.
- **Live Proof** — a running, in-page artifact that demonstrates a craft skill (e.g. a hand-written shader), as opposed to case-study evidence of *shipped* work. Subordinate to the Signature Moment by default: the hero is *both* the Signature Moment and a Live Proof; any further Live Proof is kept deliberately recessive so the Funnel stays intact. May recur as a shared recessive background across sections (not a one-off), so long as it never rivals the hero. (Added 2026-07-12; name provisional — see `docs/plan.md` §5C.)

## Disciplines (kept distinct on purpose)

- **Level Design** — game-dev discipline of layout, flow, pacing, sightlines, and encounter/gate placement; spatial storytelling. Shown via the *designed experience* (flythrough / playthrough video + an intention breakdown), not via asset craft.
- **3D Modelling / Environment Art** — asset and geometry creation. A *different* discipline from Level Design; never showcased under a Level Design banner.
- **XR** — immersive disciplines (WebXR, VR). Former Primary Identity; now **de-branded** (no longer the positioning) but its skills (Three.js, WebGL) are retained as creative-front-end strength. See ADR-0001.

## Scope of this work

- **Repositioning** (a kind of *Rebuild*) — changing what the site says the owner *is*, not just how it looks. Distinct from a **Reskin** (same content/structure, new visuals). This project is a Repositioning.
