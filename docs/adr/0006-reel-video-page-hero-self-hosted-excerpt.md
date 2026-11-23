# ADR-0006: Reel opens the video page — self-hosted hero excerpt, full watch on its canonical channel

- **Status:** Accepted
- **Date:** 2026-11-23
- **Decided during:** `/grilling` session (domain-modeling)
- **Branch:** `video-editor-feature`

## Context

ADR-0005 gave the Second Identity (Video Editor) a dedicated page with its own funnel. That page needs its flagship artifact to open the funnel: the **Reel** — the owner's curated "best of my edit work" compilation (*The Best Of My Work: 2026 Demo Reel*, 2026), published at the time of decision at `https://youtu.be/nZgvg_1C2nA` on the owner's personal channel (*Ace Game Dev*), which is outside the model.

Question: how should the Reel be delivered as the video page's hero — embedded from YouTube, or hosted directly on the web?

Grilling stress-tests that shaped the decision:

1. **Cold landing.** Visitors arrive cold (YouTube bio link, shared URL); the hero must paint instantly and chrome-free. A third-party iframe's load state, branding overlay, and share chrome make the funnel's first impression dependent on YouTube.
2. **Autoplay economy.** A hero must autoplay muted and loop; a YouTube embed offers nothing beyond bandwidth for that role (muted anyway, chrome present anyway).
3. **Mobile data.** A preloaded full-length video is hostile on mobile data; a short compressed excerpt with a poster frame is fair. Adaptive streaming matters for the *full* watch — which happens elsewhere.
4. **Funnel end.** After the Reel, the hire-CTA should close on-page; embedding the full Reel hands the visitor to YouTube's related shelf, where competitor reels sit one click away.
5. **Sound.** A Reel's craft is often sound-driven; the muted hero proves the *visual* rhythm, and the sound-on experience belongs to the full watch on the channel.
6. **Update cycle.** New work means re-cutting the Reel; the split costs one extra artifact per update (channel upload + hero-excerpt re-render) — accepted overhead.

## Decision

**The split:**

1. The Reel opens the video page as its **hero** — the Second Identity page's dominant real estate. It is *not* a second Signature Moment; that term stays the Primary Identity's. The Reel is proof-of-work; the interactive proof stays front-end-only.
2. **Hero = self-hosted, chrome-less excerpt** rendered from the Reel: short, compressed, muted, looping, poster-framed. (Exact cut — excerpt or full Reel if short enough — is a content decision at build time.)
3. **Full Reel (sound on) = canonical channel: *La Playa Vision*** (decided 2026-11-23) — the Second Identity channel whose canonical home is already the video page (ADR-0005). The Reel becomes that channel's featured video; the hero's "watch with sound" handoff points there, and the channel's own shelf provides the natural "watch more" expansion into on-brand work.
4. **Non-canonical copies are archive only** (the existing upload on *Ace Game Dev*): kept for personal history, outside the model, never linked from the site.

The main site is untouched: the Three.js hero remains the only Signature Moment.

### Implementation consequence

The hero excerpt is a static video asset in the existing Vite build (native `<video>` muted/loop/playsinline with a poster; no third-party player). The concrete excerpt cut and encoding are pinned at build/content time.

**Canonical watch URL (pinned 2026-11-23):** `https://youtu.be/IG5n_Kx9mIo` — *From Raw Footage to Cinematic: 2026 Demo Reel*, published on *La Playa Vision* (re-uploaded there from the personal channel; that channel's copy — *The Best Of My Work: 2026 Demo Reel* — remains archive-only).

## Consequences

**(+) Upside**

- The video page's first impression is fully owned: instant paint, no third-party chrome or branding overlay.
- The funnel stays on-page through the CTA; the "watch more" expansion leads to on-brand shelf (La Playa Vision's video work), reinforcing the Second Identity instead of leaking into an unrelated or rival context.
- Canonical-home logic stays coherent: the artifact the funnel sells lives where the funnel already points.
- Watch time for the Reel compounds on a channel the site canonically promotes.

**(-) Downside / cost**

- Build weight and bandwidth discipline: the excerpt must be short and well-compressed; a careless encoding hurts everywhere with no adaptive rescue.
- The update rhythm is two artifacts per re-cut (channel upload + hero excerpt re-render).
- View counts reset on re-upload — accepted as cheap for a portfolio artifact (proof-of-work, not popularity metrics).
- The hero proves only visual rhythm; sound-led selling happens downstream, on the channel.

## Alternatives considered

- **(a) YouTube embed as hero** — rejected: logo overlay, share chrome, "watch on YouTube," iframe latency; the first impression leased to a third party that must stay muted to autoplay anyway.
- **(b) Fully self-hosted full Reel as hero** — rejected: full-length bandwidth with no adaptive streaming; duplicates the watch off-channel and breaks canonical-home coherence.
- **(c) Vimeo player** — rejected: chrome-lighter and adaptive, but adds a third platform dependency the channel model doesn't have; the portfolio lives on YouTube.
- **(d) Poster image + click-to-play (YouTube)** — rejected for now: loses the ambient-motion first impression that makes a video hero; remains a fallback if the performance budget cannot hold a video hero.
