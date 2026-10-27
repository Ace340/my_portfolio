# CONTEXT.md

> Glossary for the portfolio redesign. Domain language only — no implementation, specs, or TODOs.
> Captured during the `/grilling` session (domain-modeling). Update inline as terms resolve.

## Identities

- **Primary Identity** — *Front-end Creative Developer*. The role the site exists to get hired for; owns the hero and the dominant real estate. Three.js / WebGL / GSAP are *core* skills here, not side notes. (2026-10-27: now one of *two* hireable identities — see **Second Identity**; still owns the main landing page.)
- **Second Identity** — *Video Editor*. A second hireable identity (decided 2026-10-27; ADR-0005): the site also exists to win video-editing work. Lives on a **dedicated page outside the main landing page**, with its own funnel. Deliberately re-admits the *Parallel* structure the Funnel was chosen against — scoped to one page; the main site's Funnel is untouched.
- **Video Editing** — the Second Identity's discipline. Canonical term (the false friend *Video Edition* is retired). Portfolio shown via the owner's YouTube channels: *La Playa Vision* and *Destapando el Arte*.
- **La Playa Vision** — the owner's YouTube channel. Its **canonical home** is the Second Identity's page (decided 2026-10-27; see ADR-0005). Formerly the Film & Photography Passion Track's showcase on the main site; the main site now retains only a subordinate teaser (a **Bridge**).
- **Destapando el Arte** — the owner's YouTube channel and Instagram page dedicated to uncovering stories from art pieces and movies. A Second Identity portfolio channel.
- **Passion Track** — a creative discipline showcased as an *addition* to the Primary Identity, not a rival for attention. Proven tracks: *Level Design* (maps, blueprints, models, games) and *Film & Photography*. *Music (Mints on the House)*: kept — as a small, clearly-subordinate tertiary corner (decided 2026-07-10; see `docs/plan.md` §4). Kept *small* on purpose so the Funnel stays intact. (2026-10-27: Film & Photography's showcase channel, *La Playa Vision*, moved to the Second Identity's page as its canonical home — the main-site section survives as a subordinate teaser; see ADR-0005.)

## Structure

- **Funnel** — the site's information-architecture: Primary Identity dominant at the top; Passion Tracks confined to a smaller, clearly-secondary zone. Opposed to *Parallel* (equal-weight sections) and *Umbrella* (one brand spread over facets). Chosen over those because the main site has a single primary job: earn a front-end interview. (2026-10-27 amendment: still true *of the main site*; the site as a whole now runs **two funnels** — see **Second Identity**, ADR-0005.)
- **Bridge** — a small, deliberately-subordinate affordance that hands a visitor from one identity's page to the other, in either direction (main site ↔ video page). A Bridge never rivals the Funnel CTA of the page it lives on. Examples: the main site's *"Hey I also create great videos"* CTA; the video page's glimpse back to web development. (Added 2026-10-27; see ADR-0005.)

## Interaction

- **Signature Moment** — the single high-impact interaction that *proves* the Primary Identity. For this project: a **reactive Three.js hero built from 3D type** (the owner's name "JUAN" extruded in 3D, distorted by cursor + scroll) — *identity-first*. The one thing a visitor must remember; gets the largest share of creative effort. All other motion (scroll-story, case-study reveals) is subordinate to it. Color note (2026-10-22): the hero's *color treatment* follows the Ambient Hue; its form and motion never do — the Signature Moment is designed, not visitor-remixed.
- **Live Proof** — a running, in-page artifact that demonstrates a craft skill (e.g. a hand-written shader), as opposed to case-study evidence of *shipped* work. Subordinate to the Signature Moment by default: the hero is *both* the Signature Moment and a Live Proof; any further Live Proof is kept deliberately recessive so the Funnel stays intact. May recur as a shared recessive background across sections (not a one-off), so long as it never rivals the hero. (Added 2026-07-12; name provisional — see `docs/plan.md` §5C.) Its hue is visitor-adjustable via the *Ambient Hue* (defaults to brand navy).
- **Ambient Hue** — the visitor-adjustable ambient color of the site, exposed beside the hero CTA *as part of the pitch*: the interactivity itself is a demonstration of creative front-end range, not a settings afterthought. One hue choice drives the Live Proof field, the hero's color treatment, and a contrast-derived accent for accent-colored text (lighter on dark hues, darker on light hues). Resets on reload; every visit opens on brand navy. (Added 2026-10-22; see ADR-0004.)

## Disciplines (kept distinct on purpose)

- **Level Design** — game-dev discipline of layout, flow, pacing, sightlines, and encounter/gate placement; spatial storytelling. Shown via the *designed experience* (flythrough / playthrough video + an intention breakdown), not via asset craft.
- **3D Modelling / Environment Art** — asset and geometry creation. A *different* discipline from Level Design; never showcased under a Level Design banner.
- **XR** — immersive disciplines (WebXR, VR). Former Primary Identity; now **de-branded** (no longer the positioning) but its skills (Three.js, WebGL) are retained as creative-front-end strength. See ADR-0001.

## Scope of this work

- **Repositioning** (a kind of *Rebuild*) — changing what the site says the owner *is*, not just how it looks. Distinct from a **Reskin** (same content/structure, new visuals). This project is a Repositioning.
