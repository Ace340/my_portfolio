# ADR-0001: De-emphasize XR to position as Front-end Creative Developer

- **Status:** Accepted
- **Date:** 2026-07-09
- **Decided during:** `/grilling` session (domain-modeling)

## Context

The current site is built around an XR/VR positioning:

- Hero subtitle reads *"XR Developer"* with copy *"WebXR. XR Development. Videogames"* and *"immersive worlds that… transport you out of this world."*
- A dedicated `VirtualReality.jsx` section features a VR-headset GLTF model in a Three.js scene, with copy *"Reality is no longer the limit."*
- The About section leads with *"Using the power of WebXR and VR, I build immersive experiences…"*
- The tech stack lists *"WebXR / Needle Tools"* and *"Unity / VR Development."*

The owner's actual job target is **front-end** roles. Trade-off:

- XR is a less-crowded niche → fewer competing candidates, but also fewer openings.
- Front-end has more jobs but far more competition, so differentiation matters.

The owner is multidisciplinary (front-end + level design + film/photography) and has chosen a **Funnel** structure (see `CONTEXT.md`) in which front-end must dominate and passions must read as secondary additions.

## Decision

**De-brand XR** — remove XR-as-positioning from the site:

- Drop the *"XR Developer"* subtitle and the WebXR/immersive-worlds hero copy.
- Reframe or remove the dedicated VR section (`VirtualReality.jsx`) and its VR-headset framing.
- Reword About copy away from "WebXR and VR" as the lead.
- Adjust the tech-stack rows: keep Unity *for gamedev*; drop the "VR Development" / "WebXR" framing.

**Retain the 3D toolbox.** Three.js, WebGL, and GSAP are kept and **reframed** — from *"XR"* to *"interactive / real-time 3D on the web."* They become the core of the Front-end Creative Developer identity and power the Signature Moment (the reactive Three.js hero), rather than signalling a separate XR identity.

## Consequences

**(+) Upside**

- Recruiters read the site as front-end-first; the creative-3D work becomes a memorable *plus* rather than a confusing second identity.
- Repurposes the existing Three.js / GSAP investment instead of discarding it.
- Aligns the site with the owner's actual job target.

**(−) Downside / cost**

- Loses XR-niche differentiation for pure XR roles — **accepted**, the owner is deliberately deprioritising XR.
- The existing VR-headset GLTF and `VirtualReality.jsx` need reframing or removal (implementation follow-up).
- The existing scroll-scrubbed hero video is being removed in favour of the new Three.js hero (separate decision; see session notes).

## Alternatives considered

- **De-content XR entirely** (rip out all 3D/immersive artifacts and start flat) — rejected. The 3D/WebGL skill is the owner's strongest creative-front-end differentiator; conflating the *job title* with the *skill* would mean amputating the best asset.
- **Keep XR as a co-equal identity** (Parallel structure) — rejected. Sells three things at once and sells none; breaks the Funnel.
