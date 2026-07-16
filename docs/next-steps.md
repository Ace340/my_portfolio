# Next Steps — Portfolio Redesign (Handoff)

> Resume guide. Status snapshot through 2026-07-14.
> Branch: `hero-feature`. See [`docs/plan.md`](plan.md) for the full plan, [`../CONTEXT.md`](../CONTEXT.md) for vocabulary, and [`docs/adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md`](adr/0001-de-emphasize-xr-position-as-front-end-creative-developer.md) for the XR decision.

## ✅ Done this session

- **Hero — Signature Moment complete** (commit `04f53c3`): reactive 3D "JUAN" via `TextGeometry` + simplex-noise displacement, eased cursor (`uMouse`) + scroll (`uScroll`) reactivity, `prefers-reduced-motion` static path, DPR cap, full cleanup. Files: `src/components/Hero.jsx`, `src/components/hero/{createHeroScene.js,simplex.glsl.js}`.
- **XR de-branded** (ADR-0001): VR section removed, tech stack tidied (WebXR row dropped; Unity → "Game Development, Level Design"), About copy reworded to front-end-creative.
- **Docs:** `CONTEXT.md`, `docs/plan.md`, `docs/adr/0001-…`.
- **Minor cleanup** (2026-07-10): removed dead `featureLists`/`goodLists` exports in `constants/index.js` and the `#virtual-reality` CSS block in `src/index.css`.
- **Mobile perf polish — Step 4** (2026-07-10): hero derates `uAmp` (×0.55) + DPR cap (1.5) on small screens, plus a one-way adaptive frame-rate guard that steps `uAmp` down under sustained <30fps. `src/components/hero/createHeroScene.js`.
- **Music/Mints decided** (2026-07-10): kept as a small tertiary corner (plan.md §4.7, CONTEXT.md). Assets deferred.
- **Motion spine — Step 5** (2026-07-10): added `lenis` smooth-scroll synced to GSAP ScrollTrigger via a shared ticker; unified all section easings into a shared `EASE` vocabulary (`reveal` / `title` / `ui`) in `src/motion/`. Reduced-motion falls back to native scroll. `anchors: true` intercepts nav links.
- **Selected Work — Step 6** (2026-07-10): new `SelectedWork.jsx` replacing the old `About.jsx` image grid. Four front-end case studies (Chromattic lead/featured, Mints on the House, Pangea, Soluciones Fino) with clip-path inset scroll-reveals (`EASE.reveal`) + 3D-tilt cursor hover via `gsap.quickTo` (`EASE.ui`, desktop/fine-pointer only). `gsap.matchMedia()` gates reduced-motion (static grid) + touch (no tilt). `caseStudies` array added to `constants/index.js`. Chromattic card plays a looping muted `<video>` (`.mov`→`.mp4`, 3.4 MB→632 KB, H.264/faststart/30fps); reduced-motion users get the static poster. `About.jsx` retired. Kept `id="projects"` anchor so nav + Hero CTA still resolve.

- **Grilling — About + Live Proof design (2026-07-12):** resolved a second shader as a **Live Proof** (new `CONTEXT.md` term) — a subordinate, responsive-ambient fragment shader behind the About copy, complementing the hero's vertex craft. Design = hybrid (quiet at rest → reveals on cursor/scroll attention → settles). **ADR-0002** locks sourcing: rewrite-from-scratch (Shadertoy reference is inspiration-only; author contacted in parallel). `plan.md` §4.2 / §5C / §7 / §8 updated.
- **Techstack commented out (2026-07-14):** `<Techstack />` + its import commented in `App.jsx`. To be rebuilt front-end-focused (drop the Unity row; XR rows already gone per ADR-0001). `plan.md` §4.4.
- **Game Dev & Level Design section (2026-07-14):** new `src/components/GameDev.jsx` — "Beyond the Code" passion track: a level-design reel (YouTube thumbnail linking out) + a 3-card gallery of Taco Monkey Studio game-jam games linking to itch.io (Tiny Rebels, Ghost Attack, She Wants Answers). Genre-first framing keeps the XR de-brand intact. Motion mirrors `SelectedWork` (word-split title, clip-path reveals, desktop 3D-tilt). Data in `constants/index.js` (`gameReel`, `gameProjects`); CSS `#gamedev` block in `src/index.css`. Reel poster at `/public/images/level-design-reel.jpg`.
- **Passions legacy carousel retired (2026-07-14):** `<Passions />` + import commented in `App.jsx` — it mixed all three passions; gamedev now lives in `GameDev.jsx`. Film/Photo + Music return as their own sections (Step 7). `plan.md` §4.6/§4.7.
- **Reel = linked thumbnail, not inline iframe (2026-07-14):** Lenis disables iframe `pointer-events` during smooth scroll (`src/index.css` `.lenis-smooth iframe`), so a YouTube embed would be unclickable. The reel is a thumbnail + play button → YouTube. An inline embed would need a lite/facade pattern if ever required.

## ▶️ Resume here — next slices (priority order)

1. **Step 6.5 — Live Proof shader:** ✅ built (2026-07-12). Original fragment shader (ADR-0002), evolved into a **single site-wide fixed background** (`<LiveProof>` in `App.jsx`, behind `<main>`) — starts after the hero (hero has `bg-black` to occlude it, protecting the Signature Moment). Brightness via `intensity` prop (0.8). ADR-0003. Design in `plan.md` §5C. *Per-section placement tried + reverted (read choppy).*
2. **Step 7 — Passion sections (in progress):** ✅ Game Dev & Level Design built (2026-07-14). Remaining: **Film & Photography** (La Playa Vision — grid vs carousel, embed vs stills) + the small **Music/Mints** tertiary corner. *Blocked on assets.*
3. **Step 8 — Polish:** custom cursor, a11y pass, perf, code-split three.js (bundle is ~854 kB; lenis added ~20 kB).
4. **Step 6 polish (non-blocking):** real case-study copy + fresh screenshots (see assets checklist). Build is done; only content remains.

## 🧩 Open decisions (need owner)

- ~~**Music / Mints on the House**~~ → resolved 2026-07-10: keep as a small tertiary corner.
- ~~**Lenis dependency**~~ → resolved 2026-07-10: approved & installed (`lenis` v1.3.25).
- **Anchor offset** — `anchors: true` lands sections under the fixed navbar; add a `scrollTo` offset or `scroll-padding-top` if headings get clipped (verify in the browser).
- **Nav cleanup (2026-07-14):** the `techstack` nav link in `constants/index.js` `navLinks` is now dead (section commented out), and there's no `gamedev` nav entry. Decide: remove the dead `techstack` link + add a "Game Dev" link, or leave nav as-is.

## 📦 Assets checklist (blocks steps 6 & 7 — gather when back)

**Selected Work**
- [x] Choose the case-study projects — **locked at 4**: Chromattic (lead/featured), Mints on the House, Pangea, Soluciones Fino.
- [x] Chromattic showcase video — `/videos/chromattic-showcase.mp4` (converted from `.mov`, 632 KB). Original `.mov` removed once optimized.
- [x] Mints showcase video — `/videos/moth-showcase.mp4` (converted from `.mov`, 929 KB). Original `.mov` removed once optimized.
- [ ] 1–2 line case-study copy per project (role / what you built / the win) — placeholder blurbs currently in `constants/index.js` `caseStudies`.
- [ ] Fresh screenshots for Mints / Pangea / Soluciones Fino (currently `port1.png` / `port2.png` / `port4.png`).
- [ ] Chromattic poster still — `port3.PNG` is a stand-in; capture a real frame when convenient.

**Game Dev & Level Design** ✅ section built (2026-07-14)
- [x] Flythrough/playthrough video — YouTube reel `IH1Pe1vJEgY` ("Level Design Portfolio Juan Acevedo"); poster at `/public/images/level-design-reel.jpg`.
- [x] itch.io game links — Tiny Rebels, Ghost Attack (Taco Monkey Studio); She Wants Answers on the SideQuest VR app store (`sidequestvr.com/app/45028/...`).
- [x] Screenshots — `tinyrebels.png`, `ghost-attack.png` in place.
- [x] **She Wants Answers card** — inline muted-looping showcase video (`/videos/she-wants-answers.mp4`, 2.9 MB; re-encoded from the original `.mov` at 1280×584 / 30fps, audio stripped) with a local poster (`/images/she-wants-answers.jpg`). Card links to the SideQuest VR app page. Mirrors the `SelectedWork` inline-video card pattern (autoplay skipped for reduced-motion). Original `.mov` deleted after conversion.
- [ ] 1–2 line captions per game — drafted (in `constants/index.js` `gameProjects`); tweak wording anytime.
- [ ] *(Optional)* A blueprint/map still — original plan called for one; the gallery framing replaced it. Revisit if a pure Level-Design deep-dive is wanted later.

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
