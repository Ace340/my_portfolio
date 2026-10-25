import { useEffect, useRef, useState } from 'react';
import { getAmbientHue, setAmbientHue } from '../../color/ambientHueStore.js';

/**
 * AmbientHueControl — the "Ambient Hue" pitch affordance (ADR-0004 #1).
 *
 * A visually-subordinate button beside the hero's "View Work" CTA opens a
 * popover with ONE blend slider (blue ↔ goldenrod). Dragging pushes the hue
 * into the Ambient Hue signal, which the Live Proof field subscribes to —
 * recoloring is live, re-render-free, and never persisted (reload → brand
 * navy; ADR-0004 #5).
 *
 * Deliberately uncontrolled: the `<input type="range">` holds its own value
 * and reports through the store, so hue drags cause zero React re-renders.
 * Native range semantics keep it keyboard-operable (arrows/Home/End); ESC
 * closes and focus returns to the button (fully QA'd in T4).
 */
const AmbientHueControl = () => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);

  // ESC closes (focus returns to the button); outside pointer-press closes
  // (focus returns to the button too, when the popover held focus — a click
  // on another focusable element still takes focus naturally afterwards).
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false);
        if (rootRef.current.contains(document.activeElement)) {
          buttonRef.current?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="pointer-events-auto relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-controls="ambient-hue-popover"
        className="rounded-full border border-white/15 px-6 py-2 text-sm text-white/60 transition-colors hover:border-white/40 hover:text-white/85"
      >
        Ambient Hue
      </button>

      {open && (
        <div
          id="ambient-hue-popover"
          role="dialog"
          aria-label="Ambient hue"
          className="absolute bottom-full left-1/2 mb-3 w-64 max-w-[calc(100vw-2.5rem)] -translate-x-1/2 rounded-2xl border border-white/10 bg-black/85 p-4 shadow-2xl backdrop-blur-md"
        >
          <div className="flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">
              Ambient hue
            </span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              defaultValue={getAmbientHue()}
              onChange={(e) => setAmbientHue(e.currentTarget.valueAsNumber)}
              aria-label="Blend the site's ambient color from blue to goldenrod"
              className="w-full cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] text-white/40">
              <span>Blue</span>
              <span>Goldenrod</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AmbientHueControl;
