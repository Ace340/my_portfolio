import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

import { reelHero, videoPage } from '../../../constants/index.js';

/**
 * ReelHero — the video page's hero: the Reel as proof-of-work (CONTEXT.md
 * "Reel", ADR-0006). Deliberately NOT a second Signature Moment: a
 * chrome-less, self-hosted looping excerpt in a contained stage card (not a
 * full-bleed backdrop — the ambient shader stays recessive).
 *
 * Playback starts silently the moment the page opens (browser autoplay policy
 * requires muted start); a mute/unmute toggle on the card hands sound control
 * back to the visitor (owner decision 2026-11-23 — replaces the "watch with
 * sound" CTA, which is gone). The canonical full watch (sound on) remains on
 * *La Playa Vision*, reachable via the channels grid below.
 *
 * Unlike the main site's hero, this hero does NOT occlude the site-wide
 * Live Proof field (owner request, 2026-11-23): the contained card keeps the
 * Reel opaque and dominant while the ambient shader shows through around it —
 * recessive per CONTEXT.md "Live Proof" ("a shared recessive background …
 * never rivals the hero"). Readability holds: the field is calm and dark by
 * default (brand navy).
 *
 * Until the excerpt MP4 is rendered (TODO in constants), the video fails
 * silently and the stage shows its poster — graceful degradation.
 */
const ReelHero = () => {
    const videoRef = useRef(null);
    const [muted, setMuted] = useState(true);

    // Entry reveal — modest by design: this hero must not rival the main
    // site's Signature Moment (CONTEXT.md).
    useGSAP(
        () => {
            gsap.from('.video-reveal', {
                yPercent: 40,
                opacity: 0,
                duration: 1.1,
                ease: 'expo.out',
                stagger: 0.08,
            });
        },
        { scope: '#reel-hero' },
    );

    // Mute is state + imperative DOM: React's `muted` prop is unreliable as
    // an autoplay prerequisite, so the ref callback enforces muted=true at
    // mount, and the toggle mirrors state onto the element. An unmute click
    // also resumes playback in case autoplay was ever blocked.
    const toggleSound = () => {
        const el = videoRef.current;
        if (!el) return;
        const next = !muted;
        el.muted = next;
        setMuted(next);
        if (!next) el.play().catch(() => {});
    };

    // Ref callback — guarantees muted=true before the browser's autoplay
    // decision (belt and braces alongside the `muted` prop).
    const attachVideo = (el) => {
        videoRef.current = el;
        if (el) el.muted = true;
    };

    // Transparent section: the Live Proof field shows through from the very
    // top (shared chrome continuity with the main site). Contrast for the
    // copy comes from the field's dark ambient base.
    return (
        <section id="reel-hero">
            <div className="container mx-auto px-5 text-center">
                <p className="video-reveal mb-6 text-xs uppercase tracking-[0.3em] text-accent">
                    {videoPage.eyebrow}
                </p>
                <h1 className="video-reveal font-modern-negra text-6xl leading-none md:text-8xl">
                    {videoPage.title}
                </h1>
                <p className="video-reveal mx-auto mt-8 max-w-2xl text-lg text-white/85">
                    {videoPage.tagline}
                </p>

                {/* The stage — contained card (repo-reel pattern, cf. #gamedev
                    .reel): looping excerpt, chrome-less, silent until the
                    visitor opts into sound via the on-card toggle. */}
                <div className="video-reveal reel-stage">
                    <video
                        className="reel-media"
                        ref={attachVideo}
                        src={reelHero.loopVideo}
                        poster={reelHero.poster}
                        muted
                        playsInline
                        autoPlay
                        loop
                        preload="metadata"
                        aria-hidden="true"
                    />

                    <div className="reel-caption">
                        <p className="reel-title">{reelHero.reelTitle}</p>
                        <button
                            type="button"
                            className="reel-sound"
                            onClick={toggleSound}
                            aria-pressed={muted}
                            aria-label={muted ? 'Turn reel sound on' : 'Turn reel sound off'}
                        >
                            {muted ? (
                                /* speaker-muted */
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M11 5 6 9H2v6h4l5 4z" />
                                    <line x1="22" x2="16" y1="9" y2="15" />
                                    <line x1="16" x2="22" y1="9" y2="15" />
                                </svg>
                            ) : (
                                /* speaker-on */
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <path d="M11 5 6 9H2v6h4l5 4z" />
                                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ReelHero;
