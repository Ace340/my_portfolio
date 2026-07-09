# Next Steps — Portfolio Redesign (Handoff)

> Resume guide. Status snapshot from the session of 2026-07-09.
> Branch: `hero-feature`. See [`docs/plan.md`](plan.md) for the full plan, [`../CONTEXT.md`](../CONTEXT.md) for vocabulary, and [`docs/adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md`](adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md) for the XR decision.

## ✅ Done this session

- **Hero — Signature Moment complete** (commit `04f53c3`): reactive 3D "JUAN" via `TextGeometry` + simplex-noise displacement, eased cursor (`uMouse`) + scroll (`uScroll`) reactivity, `prefers-reduced-motion` static path, DPR cap, full cleanup. Files: `src/components/Hero.jsx`, `src/components/hero/{createHeroScene.js,simplex.glsl.js}`.
- **XR de-branded** (ADR-0001): VR section removed, tech stack tidied (WebXR row dropped; Unity → "Game Development, Level Design"), About copy reworded to front-end-creative.
- **Docs:** `CONTEXT.md`, `docs/plan.md`, `docs/adr/0001-…`.

## ▶️ Resume here — next slices (priority order)

1. **Step 5 — Motion spine:** add `lenis` (smooth-scroll) + unify GSAP easings across sections. *Needs OK to add the dependency.*
2. **Step 4 — Mobile perf polish:** tune `uAmp`/DPR down on small screens; optional frame-rate guard. *Code-only.*
3. **Step 6 — Selected Work (case-study reveals):** clip-path / image-mask transitions + 3D-tilt hover. *Blocked on assets.*
4. **Step 7 — Passion sections:** Level Design (video) + Film & Photography. *Blocked on assets.*
5. **Step 8 — Polish:** custom cursor, a11y pass, perf, code-split three.js (bundle is ~831 kB).
6. **Minor cleanup:** remove the now-dead `featureLists` / `goodLists` in `constants/index.js` and the `#virtual-reality` CSS block in `src/index.css`.

## 🧩 Open decision (needs owner)

- **Music / Mints on the House** — keep as a small corner, cut, or footer link?

## 📦 Assets checklist (blocks steps 6 & 7 — gather when back)

**Selected Work**
- [ ] Choose the 3 case-study projects (candidates: Mints-on-the-House site, Pangea, Soluciones Fino)
- [ ] 1–2 line case-study copy per project (role / what you built / the win)
- [ ] Fresh screenshots or short screen-recordings per project

**Level Design**
- [ ] Pick the level/game to feature
- [ ] Flythrough/playthrough video (YouTube or hosted mp4?)
- [ ] 1 blueprint/map still
- [ ] 1 intention sentence ("why this level plays this way")

**Film & Photography**
- [ ] Curated selects (how many? grid or carousel?)
- [ ] La Playa Vision: embed a video or use stills?

## 🎛️ Hero tuning knobs (`src/components/hero/createHeroScene.js`)

- `uAmp` 0.18 — displacement strength
- `uFreq` 1.4 — noise scale
- `EASE` 0.08 — input inertia (cursor / scroll lag)
- Font: swap `public/fonts/helvetiker_bold.typeface.json` for the real brand font (convert woff/ttf → typeface JSON via [facetype.js](https://github.com/gero3/facetype.js))

## 🛠️ Commands

- `npm run dev` — view locally
- `npm run lint` + `npm run build` — validate
