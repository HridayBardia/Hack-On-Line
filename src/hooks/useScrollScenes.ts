"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

/**
 * Two-way scroll motion. Every element's pose is worked out from where it is on
 * screen right now, so it assembles on the way in, comes apart on the way out and
 * plays backwards when the visitor scrolls back.
 *
 * Mark elements with data-scroll="rise" | "stage" | "depth".
 * Every <h2> fades in word by word with scroll as well; only use <h2> for text that
 * never changes, because SplitText rewrites its DOM.
 *
 * Text only ever moves straight up and down. Sideways shifts and tilts broke the
 * alignment between rows whenever the visitor stopped scrolling partway.
 */

type Pose = { y?: number; rx?: number; scale?: number };

// How far from its resting place an element is before entering and after leaving
const SCENES: Record<string, { enter?: Pose; exit: Pose }> = {
  rise: { enter: { y: 56 }, exit: { y: -24 } },
  // For 3D scenes only, where tilting adds depth
  stage: { enter: { y: 80, rx: 16, scale: -0.08 }, exit: { rx: -10, scale: -0.06 } },
  // For the first screen: already in place on load, sinks away as the page moves
  depth: { exit: { y: 48 } },
};

const clamp = (n: number) => Math.min(1, Math.max(0, n));

/** Distance from the top of the page. offsetTop ignores transforms, so motion can't feed back into itself. */
function pageTop(element: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

/**
 * How much scrolling an entrance takes, as a share of the screen height. Inside a
 * pinned view it has to finish by the time the view locks in place, or an element
 * resting low on the screen would stay part-way in.
 */
function enterDistance(element: HTMLElement, usual: number, viewport: number) {
  const view = element.closest<HTMLElement>(".pin-view");
  if (!view) return usual;
  const restingTop = pageTop(element) - pageTop(view);
  return Math.max(0.02, Math.min(usual, (viewport - restingTop) / viewport));
}

/**
 * How close to the top of the screen an element's bottom gets before it starts leaving.
 * Inside a pinned view it must not start until the view itself moves off, however
 * near the top the element is resting.
 */
function leaveDistance(element: HTMLElement, usual: number) {
  const view = element.closest<HTMLElement>(".pin-view");
  if (!view) return usual;
  const restingBottom = pageTop(element) - pageTop(view) + element.offsetHeight;
  return Math.max(1, Math.min(usual, restingBottom));
}

export function useScrollScenes(ready: boolean) {
  useEffect(() => {
    const root = document.querySelector("main");
    if (!ready || !root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let scenes: HTMLElement[] = [];
    const headings = new Map<HTMLElement, { split: SplitText; tween: gsap.core.Timeline }>();

    const update = () => {
      frame = 0;
      const viewport = window.innerHeight;
      const scroll = window.scrollY;
      const remaining = document.documentElement.scrollHeight - viewport - scroll;

      // 0 to 1 as an element comes up from the bottom edge. Near the end of the page
      // it can't rise any further, so the last stretch of scrolling completes it.
      const entered = (top: number, distance: number) =>
        Math.max(clamp((viewport - (top - scroll)) / (viewport * distance)), clamp(1 - remaining / (viewport * distance)));

      for (const element of scenes) {
        const scene = SCENES[element.dataset.scroll ?? ""];
        if (!scene) continue;
        const top = pageTop(element);
        const bottom = top + element.offsetHeight - scroll;
        // Keyboard users must always see what they have focused
        const focused = element.contains(document.activeElement) && document.activeElement?.matches(":focus-visible");

        const waiting = !scene.enter || focused ? 0 : Math.pow(1 - entered(top, enterDistance(element, 0.24, viewport)), 2);
        const leaveFrom = leaveDistance(element, viewport * (element.dataset.scroll === "depth" ? 0.5 : 0.24));
        const gone = focused ? 0 : clamp((leaveFrom - bottom) / leaveFrom);

        if (waiting < 0.002 && gone < 0.002) {
          element.style.transform = "";
          element.style.opacity = "";
          continue;
        }
        const mix = (key: keyof Pose) => (scene.enter?.[key] ?? 0) * waiting + (scene.exit[key] ?? 0) * gone;
        // whole pixels keep text crisp
        const shift = `translate3d(0, ${Math.round(mix("y"))}px, 0)`;
        element.style.transform =
          element.dataset.scroll === "stage" ? `perspective(1100px) ${shift} rotateX(${mix("rx")}deg) scale(${1 + mix("scale")})` : shift;
        element.style.opacity = String(clamp(1 - waiting) * (1 - 0.85 * gone));
      }

      headings.forEach(({ tween }, heading) => {
        const top = pageTop(heading);
        const bottom = top + heading.offsetHeight - scroll;
        const leaving = clamp(bottom / leaveDistance(heading, viewport * 0.16));
        tween.progress(Math.min(entered(top, enterDistance(heading, 0.24, viewport)), leaving));
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    // Picks up sections that load later
    const collect = () => {
      scenes = Array.from(root.querySelectorAll<HTMLElement>("[data-scroll]"));
      root.querySelectorAll<HTMLElement>("h2:not([data-reveal])").forEach((heading) => {
        heading.dataset.reveal = "true";
        // Words, not letters: splitting letters apart upsets the spacing between them
        const split = new SplitText(heading, { type: "words" });
        // The heading moves as one straight line while its words fade in one by one
        const tween = gsap
          .timeline({ paused: true })
          .fromTo(split.words, { autoAlpha: 0 }, { autoAlpha: 1, ease: "none", duration: 0.5, stagger: { amount: 0.5 } }, 0)
          .fromTo(heading, { y: 28 }, { y: 0, ease: "power2.out", duration: 1 }, 0);
        headings.set(heading, { split, tween });
      });
      schedule();
    };

    collect();
    const mutations = new MutationObserver(collect);
    mutations.observe(root, { childList: true, subtree: true });
    // Opening a track changes the height of everything below it
    const resizes = new ResizeObserver(schedule);
    resizes.observe(root);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    root.addEventListener("focusin", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      mutations.disconnect();
      resizes.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      root.removeEventListener("focusin", schedule);
      scenes.forEach((element) => {
        element.style.transform = "";
        element.style.opacity = "";
      });
      headings.forEach(({ split, tween }, heading) => {
        tween.revert();
        split.revert();
        delete heading.dataset.reveal;
      });
    };
  }, [ready]);
}
