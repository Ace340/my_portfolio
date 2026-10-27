# ADR-0005: Second Identity — Video Editing gets a dedicated page outside the main Funnel

- **Status:** Accepted
- **Date:** 2026-10-27
- **Decided during:** `/grilling` session (domain-modeling)
- **Branch:** `video-editor-feature`

## Context

The site's founding IA decision (plan.md §4, `CONTEXT.md` **Funnel**) chose a single Funnel — Primary Identity (Front-end Creative Developer) dominant, Passion Tracks confined to a smaller secondary zone — *over* Parallel (equal-weight sections) and Umbrella, because "the site has a single primary job: earn a front-end interview."

The owner then proposed a **"Video Edition" section**: a showcase of video-editing skills and their YouTube channels (*La Playa Vision*, *Destapando el Arte*), on a **separate page built like a landing page**.

Grilling exposed three collisions:

1. **Parallel re-admission.** A separate landing-style page for a non-primary discipline *is* the Parallel structure the Funnel was explicitly chosen against.
2. **Identity claim under a cold landing.** A visitor arriving at the video page first (YouTube bio link, shared URL) with no main-site context would conclude "Juan is a video editor" — the glossary's fail condition, or worse.
3. **La Playa Vision double-booked.** The channel was already the showcase artifact of the main site's Film & Photography Passion Track. One artifact, two models.

The owner resolved the first collision by choosing the strongest option deliberately: video editing is a **second hireable identity** — they want video-editing *work*, not just a display of range.

## Decision

**The site now serves two hireable identities and runs two funnels.**

1. **Second Identity — Video Editor.** The site exists to win video-editing work in addition to front-end interviews. Canonical term: **Video Editing** (the false friend *Video Edition* is retired).
2. **Dedicated page, outside the main landing page.** The video portfolio lives on its own page — not a section of the main Funnel. It shares the main site's brand (same visual system, same chrome) and is reachable from a navbar item.
3. **La Playa Vision's canonical home moves to the video page.** The main site's Film & Photography Passion Track section demotes to a subordinate teaser whose job is to hand visitors over. *Destapando el Arte* (YouTube + Instagram; stories behind art pieces and movies) is a Second Identity portfolio channel with no main-site claim.
4. **Bridges in both directions.** Every identity page carries a small, deliberately-subordinate affordance handing visitors to the other page: the main site's *"Hey I also create great videos"* CTA; the video page's glimpse back to web development. A Bridge never rivals the Funnel CTA of the page it lives on.
5. **Cold-landing protection by Bridge.** A visitor who lands cold on the video page sees the video portfolio first — that is the page's job — but always has a visible path back to the Primary Identity.

The main site's Funnel is otherwise untouched: Primary Identity still owns the hero and the dominant real estate; Level Design and Music remain Passion Tracks in the secondary zone.

### Routing consequence (implementation)

The video page shares the main site's brand and lives in the same repo, so it is a **second route in the existing Vite + React SPA** — not a separate site and not a Next.js router (there is no Next.js here; `react-router` is the natural addition). Exact route path and router setup are implementation detail, deferred to the build.

## Consequences

**(+ ) Upside**

- The site's model is honest about its two revenue goals; video channels get real estate a secondary zone could never give.
- The main Funnel survives intact — the change is additive and scoped to one page plus one nav slot.
- Shared brand keeps one portfolio, one domain, one deploy.
- The glossary gains precise terms (Second Identity, Bridge, canonical channel homes) that would otherwise stay fuzzy.

**(-) Downside / cost**

- A navbar slot competes with Funnel real estate; every nav design change must now weigh two funnels.
- Two messages to keep coherent; the Film & Photography section shrinks and must be rebuilt as a teaser, not just trimmed.
- Cold-landing visitors may still misread the identity; the Bridge mitigates but cannot eliminate this.
- The SPA gains a router dependency (URL handling, scroll restoration, 404 behavior) it never needed before.

## Alternatives considered

- **(a) New Passion Track inside the main site** — rejected: a clearly-secondary zone cannot *win video-editing work*; it can only display range. The owner's goal is work.
- **(b) Split La Playa Vision by facet** (main site shows the cinematographic eye; video page shows the edit) — rejected: one canonical home is simpler; splitting one channel's evidence across two models invites drift.
- **(c) Dissolve Film & Photography into the video page entirely** — rejected as too aggressive: the main site keeps a teaser so the Passion Track zone doesn't shrink below its rhythm (Level Design still needs its sibling context).
- **Umbrella rebrand ("creative developer & video editor" in one hero)** — rejected: re-fights the founding decision at the highest-visibility pixel and muddies both funnels.
