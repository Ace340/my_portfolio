# Portfolio Redesign — Build Plan

- **Status:** Draft — ready to build
- **Date:** 2026-07-09
- **Type:** Repositioning (Rebuild)
- **See also:** [`CONTEXT.md`](../CONTEXT.md) (glossary), [`docs/adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md`](adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md) (XR de-brand decision)

## 1. Goal

Reposition the site around a single **Primary Identity — Front-end Creative Developer** — to earn front-end interviews. Passion tracks (Level Design, Film & Photography) are *additions*, clearly secondary. (Vocabulary in `CONTEXT.md`.)

## 2. Success criteria (testable)

A visitor (recruiter) lands and, within seconds:

1. **Identity** — knows it's a front-end creative developer's site.
2. **Wow** — is hit by a memorable hero (shareable).
3. **Credibility** — sees proof of *shipped* front-end work.
4. **Clarity** — reads the passions as additions, not confusion.

**Fail condition:** a visitor leaves unsure what the owner does.

## 3. Scope

**In:** new reactive-3D-type hero, repositioned copy, restructured section order, case-study project reveals, scroll motion spine, two passion sections (Level Design, Film/Photo), XR de-brand.

**Out (this phase):** a 4th passion corner for Music (TBD), blog/CMS, i18n, backend.

## 4. Information architecture (Funnel)

1. **Hero** — reactive 3D "JUAN" + role line *"Front-end Creative Developer"* + one CTA
2. **About** — short positioning (replaces XR-flavored intro)
3. **Selected Work** — 3 case-study reveals: Mints-on-the-House site, Pangea, Soluciones Fino
4. **Tech Stack** — front-end-focused (Unity stays *under gamedev*; XR rows dropped)
5. **Beyond the code → Level Design** — flythrough video + blueprint still + intention caption
6. **Beyond the code → Film & Photography** — curated selects / La Playa Vision
7. **Contact** — sharpened CTA

## 5. Interaction design

- **Signature Moment (A):** reactive Three.js hero — 3D type "JUAN", cursor parallax + scroll-driven vertex distortion, then pin. Gets the largest share of creative effort.
- **Motion spine (B):** smooth-scroll (Lenis) + unified scroll easings; elevate the existing pin/scrub into one coherent motion language.
- **Project treatment (D):** clip-path / image-mask case-study reveals + 3D-tilt hover.
- **Mobile:** ship real WebGL, **degrade gracefully** (cap DPR, reduce effects); honor `prefers-reduced-motion`.

## 6. Build sequence (vertical slices, riskiest first)

1. **Strip & reposition** — remove XR copy, kill the VR section, kill the hero video, clean nav/stack → clean Funnel skeleton
2. **Hero — 3D-type scaffold**
3. **Hero — reactivity** (vertex-displacement shader)
4. **Hero — mobile + reduced-motion**
5. **Motion spine (B)** — Lenis + unified easings
6. **Case-study reveals (D)**
7. **Passion sections** (Level Design, Film/Photo)
8. **Polish** — perf pass, a11y, optional custom cursor

## 7. Inputs / assets checklist

- [ ] Hero: final hero text + a font file for 3D extrusion
- [ ] Shader: sourced, **understood**, **licensed/attributed** (or custom) — a vertex-displacement / noise-distortion material
- [ ] Projects: pick the 3 case studies + 1–2 line copy + fresh screenshots/recordings each
- [ ] Level Design: pick the level + host the flythrough video + 1 blueprint still + 1 intention sentence
- [ ] Film/Photo: curated selects (grid vs carousel?) + La Playa Vision embed/stills
- [ ] Decide: Music/Mints — keep / cut / corner?
- [x] Confirmed: mobile = degrade-gracefully

## 8. Open decisions

- Hero text-geometry approach (`TextGeometry` vs `troika-three-text`) — confirm against **current three.js API** before coding (step 2)
- Music/Mints placement
- Film/Photo presentation (grid vs carousel)
