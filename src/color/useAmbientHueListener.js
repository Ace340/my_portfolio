import { useEffect } from 'react';
import { subscribeAmbientHue } from './ambientHueStore.js';

/**
 * Subscribe a scene setter to the Ambient Hue signal (ADR-0004).
 *
 * Subscription, not React state: drags mutate the scene's uniforms directly —
 * zero re-renders. The store notifies subscribers immediately on subscribe,
 * so a (re)mounted scene re-applies the session hue; pass the scene's mount
 * deps so a remount re-subscribes after the fresh scene exists (effect order:
 * this must run AFTER the scene-mount effect).
 *
 * @param {(t: number) => void} onHue receives each hue update (0 = brand navy)
 * @param {unknown[]} deps effect deps — the scene's mount deps
 */
export const useAmbientHueListener = (onHue, deps) =>
  // eslint-disable-next-line react-hooks/exhaustive-deps -- pass-through deps by design: callers own the dep list (the scene's mount deps)
  useEffect(() => subscribeAmbientHue(onHue), deps);
