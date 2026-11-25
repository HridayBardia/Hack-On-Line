
"use client";
import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  if ("scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
}

export function useSmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Ensure browser never restores scrolled position on reload/refresh
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Immediately snap to the first landing page (0, 0)
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname);
    }

    const resetToTop = () => {
      window.scrollTo(0, 0);
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("beforeunload", resetToTop);
    window.addEventListener("pagehide", resetToTop);

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      return () => {
        window.removeEventListener("beforeunload", resetToTop);
        window.removeEventListener("pagehide", resetToTop);
      };
    }

    // Responsive, zero-latency, butter-smooth Lenis configuration
    const lenis = new Lenis({
      duration: 0.82, // Low-latency response eliminates spongy delay
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential deceleration curve
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.6,
      infinite: false,
    });

    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    // Immediately scroll Lenis to top on fresh load / refresh
    lenis.scrollTo(0, { immediate: true });

    // Sync Lenis scroll with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Double-check on next animation frame to override any browser late layout restoration
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      lenis.scrollTo(0, { immediate: true });
    });

    // Direct native high-precision vsync loop decoupled from GSAP ticker
    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      window.removeEventListener("beforeunload", resetToTop);
      window.removeEventListener("pagehide", resetToTop);
      cancelAnimationFrame(rafId);
      lenis.destroy();
      delete (window as Window & { __lenis?: Lenis }).__lenis;
    };
  }, []);
}
