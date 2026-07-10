# Next Steps — Portfolio Redesign (Handoff)

> Resume guide. Status snapshot through the session of 2026-07-10.
> Branch: `hero-feature`. See [`docs/plan.md`](plan.md) for the full plan, [`../CONTEXT.md`](../CONTEXT.md) for vocabulary, and [`docs/adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md`](adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md) for the XR decision.

## ✅ Done this session

- **Hero — Signature Moment complete** (commit `04f53c3`): reactive 3D "JUAN" via `TextGeometry` + simplex-noise displacement, eased cursor (`uMouse`) + scroll (`uScroll`) reactivity, `prefers-reduced-motion` static path, DPR cap, full cleanup. Files: `src/components/Hero.jsx`, `src/components/hero/{createHeroScene.js,simplex.glsl.js}`.
- **XR de-branded** (ADR-0001): VR section removed, tech stack tidied (WebXR row dropped; Unity → "Game Development, Level Design"), About copy reworded to front-end-creative.
- **Docs:** `CONTEXT.md`, `docs/plan.md`, `docs/adr/0001-…`.
- **Minor cleanup** (2026-07-10): removed dead `featureLists`/`goodLists` exports in `constants/index.js` and the `#virtual-reality` CSS block in `src/index.css`.
- **Mobile perf polish — Step 4** (2026-07-10): hero derates `uAmp` (×0.55) + DPR cap (1.5) on small screens, plus a one-way adaptive frame-rate guard that steps `uAmp` down under sustained <30fps. `src/components/hero/createHeroScene.js`.
- **Music/Mints decided** (2026-07-10): kept as a small tertiary corner (plan.md §4.7, CONTEXT.md). Assets deferred.
- **Motion spine — Step 5** (2026-07-10): added `lenis` smooth-scroll synced to GSAP ScrollTrigger via a shared ticker; unified all section easings into a shared `EASE` vocabulary (`reveal` / `title` / `ui`) in `src/motion/`. Reduced-motion falls back to native scroll. `anchors: true` intercepts nav links.

## ▶️ Resume here — next slices (priority order)

1. **Step 6 — Selected Work (case-study reveals):** clip-path / image-mask transitions + 3D-tilt hover. *Blocked on assets.*
2. **Step 7 — Passion sections:** Level Design (video) + Film & Photography + the small Music/Mints corner. *Blocked on assets.*
3. **Step 8 — Polish:** custom cursor, a11y pass, perf, code-split three.js (bundle is ~852 kB; lenis added ~20 kB).

## 🧩 Open decisions (need owner)

- ~~**Music / Mints on the House**~~ → resolved 2026-07-10: keep as a small tertiary corner.
- ~~**Lenis dependency**~~ → resolved 2026-07-10: approved & installed (`lenis` v1.3.25).
- **Anchor offset** — `anchors: true` lands sections under the fixed navbar; add a `scrollTo` offset or `scroll-padding-top` if headings get clipped (verify in the browser).

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

**Music (Mints on the House)**
- [ ] One link + 1-line caption for the tertiary corner (assets deferred)

## 🎛️ Hero tuning knobs (`src/components/hero/createHeroScene.js`)

- `amp` 0.18 — desktop displacement strength (passed as option; mobile auto-derates to ~0.55×). A one-way frame-rate guard floors it at 0.05 under sustained <30fps.
- `uFreq` 1.4 — noise scale
- `EASE` 0.08 — input inertia (cursor / scroll lag)
- DPR cap: 2 (desktop) / 1.5 (mobile)
- Font: swap `public/fonts/helvetiker_bold.typeface.json` for the real brand font (convert woff/ttf → typeface JSON via [facetype.js](https://github.com/gero3/facetype.js))

## 🎚️ Motion spine knobs (`src/motion/`)

- **Smooth-scroll** (`useSmoothScroll.js`): `LENIS_OPTIONS` — `duration: 1.2`, `smoothWheel: true`, `anchors: true`, `autoRaf: false` (GSAP ticker drives RAF). Gated by `prefers-reduced-motion`.
- **Easing vocabulary** (`easings.js`): `EASE.reveal` (`power3.out` — section reveals), `EASE.title` (`expo.out` — word-split headings), `EASE.ui` (`power1.inOut` — nav/carousel/parallax). Import from here; don't write ease strings ad hoc.

## 🛠️ Commands

- `npm run dev` — view locally
- `npm run lint` + `npm run build` — validate
