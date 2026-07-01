<!-- Context: project-intelligence/technical | Priority: critical | Version: 2.0 | Updated: 2026-06-30 -->

# Technical Domain

> Static, animation-heavy personal portfolio for Juan Acevedo (XR Developer). Frontend-only — no backend, no database.

## Quick Reference

- **Purpose**: Tech stack, architecture, animation & styling patterns
- **Update When**: Add library | change animation approach | add new section/page
- **Audience**: Developers, AI agents
- **Deploy**: `vite build` → host `dist/` on any static host (Vercel/Netlify/GitHub Pages)

## Primary Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Language | JavaScript (JSX) | ES2020+ | Fast iteration; TS not needed for static site |
| UI Framework | React | 19.1 | Component model + hooks |
| Build Tool | Vite | 6.3 | Fast HMR, native ES modules |
| Styling | Tailwind CSS | 4.1 | Utility-first; `@theme` tokens + `@utility` customs |
| Animation | GSAP + @gsap/react | 3.13 / 2.1 | ScrollTrigger, SplitText, timeline orchestration |
| 3D | Three.js | 0.178 | WebXR / immersive scenes |
| Responsive | react-responsive | 10.0 | `useMediaQuery` breakpoint logic |
| Linting | ESLint | 9 (flat config) | Code quality |

## Project Structure

```
my_portfolio/
├── src/
│   ├── App.jsx          # Root: registers GSAP plugins, composes sections
│   ├── main.jsx         # Vite entry
│   ├── index.css        # Tailwind import, @theme tokens, @utility customs
│   └── components/      # One file per page section (PascalCase.jsx)
├── constants/           # Static data (e.g., navLinks) — imported into components
├── public/              # Static assets served as-is (/videos, /images, /fonts)
├── vite.config.js       # react() + tailwindcss() plugins
└── eslint.config.js     # Flat config, targets **/*.{js,jsx}
```

`App.jsx` composes (in order): `Navbar → Hero → Techstack → About → VirtualReality → Passions → Contact`. Other section files in `src/components/` (e.g., `Cocktails.jsx`) exist but are not currently mounted.

## Animation System (GSAP)

Register plugins once in `App.jsx`; drive animations per-component via `useGSAP`.

```jsx
// App.jsx — register once at top level
import gsap from 'gsap';
import { ScrollTrigger, SplitText } from 'gsap/all';
gsap.registerPlugin(ScrollTrigger, SplitText);

// Component — useGSAP (NOT useEffect) scopes animations + auto-cleans
import { useGSAP } from '@gsap/react';
useGSAP(() => {
  gsap.from('.title', { yPercent: 100, duration: 1.8, ease: 'expo.out', stagger: 0.06 });
  gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', scrub: true } })
    .to('.right-leaf', { y: 200 }, 0);
}, []);
```

- **Always** `useGSAP(() => {}, [])` from `@gsap/react` — handles scope + cleanup
- `ScrollTrigger` for scroll-driven; `SplitText` for char/word/line reveals
- Responsive variants via `useMediaQuery({ maxWidth: 767 })` → different trigger start/end
- `useRef` for direct element control (e.g., `<video>` `currentTime` scrubbing)

## Styling System (Tailwind v4)

```css
/* index.css */
@import "tailwindcss";

@theme {                                /* design tokens → usable as classes */
  --color-yellow: #e7d393;
  --font-sans: "Mona Sans", sans-serif;
  --font-modern-negra: "Modern Negra", sans-serif;
}

@utility flex-center { @apply flex justify-center items-center; }   /* composite */
@utility text-gradient { background: linear-gradient(to bottom, #fff, #898989); }
```

- Tokens in `@theme` (colors, fonts) → Tailwind classes (`text-yellow`, `font-sans`)
- Reusable composites via `@utility` (`flex-center`, `col-center`, `abs-center`, `text-gradient`)
- Dark base: `body { background: black; color: white; }`
- Fonts: Google Fonts import + local `@font-face` (Modern Negra)

## Component Conventions

- **Arrow-function components**: `const Hero = () => { ... }`
- **`export default`** at bottom of file
- One section per file in `src/components/`, PascalCase filename
- Tailwind utilities inline; fall back to `@utility` composites or `index.css`
- Static data imported from `constants/index.js` (e.g., `navLinks`)

## Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase.jsx | `Hero.jsx`, `VirtualReality.jsx` |
| Components | PascalCase | `Hero`, `Navbar` |
| Constants/data | camelCase | `navLinks` |
| CSS tokens | kebab-case | `--color-yellow`, `flex-center` |

## Code Standards

- JavaScript + JSX (not TypeScript); `@types/*` in devDeps are editor hints only
- Tailwind v4 via `@tailwindcss/vite` plugin — **no** `tailwind.config.js`
- ESLint flat config; `no-unused-vars` ignores `^[A-Z_]` pattern
- Animations belong in `useGSAP`, **never** `useEffect`
- Keep components self-contained: data from `constants/`, assets from `public/`

## Assets & Media

- Served from `public/` as absolute paths: `/videos/webvideo.mp4`, `/images/logoace2.png`, `/fonts/*.ttf`
- `<video>` for scroll-scrubbed sequences (`muted playsInline autoPlay loop preload`)
- Media-heavy — prefer `preload="auto"` only where needed

## Technical Constraints

| Constraint | Impact |
|------------|--------|
| Static hosting only | No server-side logic, forms, or secrets |
| Media-heavy | Large `/public` assets; lazy-load where possible |
| Client-rendered SPA | SEO limited; content lives in JSX |

## 📂 Codebase References

- **Root composition**: `src/App.jsx` — GSAP plugin registration + section order
- **Canonical component**: `src/components/Hero.jsx` — `useGSAP` + SplitText + ScrollTrigger + video scrub
- **Timeline pattern**: `src/components/Navbar.jsx` — ScrollTrigger `fromTo` timeline
- **Styling tokens**: `src/index.css` — `@theme` + `@utility` definitions
- **Static data**: `constants/index.js` — `navLinks` and similar
- **Build config**: `vite.config.js`, `eslint.config.js`, `package.json`

## Related Files

- `business-domain.md` — Why this portfolio exists (audience, goals)
- `decisions-log.md` — Why GSAP / Three.js / Tailwind v4 were chosen
- `living-notes.md` — Performance debt, pending sections
