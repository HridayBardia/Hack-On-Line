"use client";

import { useCallback, useEffect, useRef, useState, type RefObject } from "react";

// Must match the media query for .pin-track in globals.css.
// Short screens and reduced motion get a normal section instead.
const PINNED_QUERY = "(min-height: 600px) and (prefers-reduced-motion: no-preference)";

type LenisLike = { scrollTo: (target: number, options?: { duration?: number }) => void };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Turns scroll progress (0 to 1) into a position among `count` steps that rests on
 * each step and then glides to the next. 1.5 means halfway between steps 1 and 2.
 */
export function stepAt(progress: number, count: number) {
  const step = clamp(progress * count - 0.5, 0, count - 1);
  const base = Math.floor(step);
  const t = clamp((step - base - 0.25) / 0.5, 0, 1);
  return base + t * t * (3 - 2 * t);
}

/**
 * For a section whose view stays on screen while its tall track scrolls past.
 * `onStep` receives the current position, or null when the section isn't pinned.
 */
export function usePinnedScroll(trackRef: RefObject<HTMLElement | null>, count: number, onStep: (step: number | null, progress: number) => void) {
  const [pinned, setPinned] = useState(false);
  const onStepRef = useRef(onStep);
  useEffect(() => {
    onStepRef.current = onStep;
  });

  useEffect(() => {
    const query = window.matchMedia(PINNED_QUERY);
    let frame = 0;

    const update = () => {
      frame = 0;
      setPinned(query.matches);
      const track = trackRef.current;
      if (!query.matches || !track) {
        onStepRef.current(null, 0);
        return;
      }
      const rect = track.getBoundingClientRect();
      const progress = clamp(-rect.top / Math.max(1, rect.height - window.innerHeight), 0, 1);
      onStepRef.current(stepAt(progress, count), progress);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    query.addEventListener("change", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      query.removeEventListener("change", schedule);
    };
  }, [trackRef, count]);

  /** Scrolls to a step. Returns false when not pinned, so the caller sets the step itself. */
  const scrollToStep = useCallback(
    (index: number) => {
      const track = trackRef.current;
      if (!window.matchMedia(PINNED_QUERY).matches || !track) return false;
      const rect = track.getBoundingClientRect();
      const target = rect.top + window.scrollY + ((index + 0.5) / count) * (rect.height - window.innerHeight);
      const lenis = (window as Window & { __lenis?: LenisLike }).__lenis;
      if (lenis) lenis.scrollTo(target, { duration: 1 });
      else window.scrollTo({ top: target, behavior: "smooth" });
      return true;
    },
    [trackRef, count]
  );

  return { pinned, scrollToStep };
}
