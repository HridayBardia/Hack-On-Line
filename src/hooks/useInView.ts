"use client";

import { useEffect, useState, type RefObject } from "react";

/** True while the element is on screen. Used to replay an animation each time it comes back. */
export function useInView(ref: RefObject<Element | null>, threshold = 0.2) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    // Starts at the threshold, ends only once the element has fully left, so it can't flicker
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold) setInView(true);
        else if (!entry.isIntersecting) setInView(false);
      },
      { threshold: [0, threshold] }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return inView;
}
