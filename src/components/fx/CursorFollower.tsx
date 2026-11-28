"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

const CLICKABLE = "a, button, [role='button'], summary, label, .cursor-pointer, [class*='cursor-grab']";

/**
 * Custom cursor that replaces the system one and grows over anything clickable.
 * Mouse users only: touch and reduced-motion users keep their normal behaviour.
 */
export function CursorFollower() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const enabled = window.matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!enabled.matches) return;

    const root = document.documentElement;
    gsap.set(el, { xPercent: -50, yPercent: -50 });
    // Short delay: this is the only pointer on screen, so it must stay close to the mouse
    const moveX = gsap.quickTo(el, "x", { duration: 0.12, ease: "power3.out" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.12, ease: "power3.out" });
    let visible = false;

    const hide = () => {
      visible = false;
      el.dataset.visible = "false";
      root.classList.remove("has-custom-cursor");
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") {
        hide();
        return;
      }
      if (visible) {
        moveX(e.clientX);
        moveY(e.clientY);
        return;
      }
      // Appear right at the mouse instead of flying in from the last position
      moveX(e.clientX, e.clientX);
      moveY(e.clientY, e.clientY);
      visible = true;
      el.dataset.visible = "true";
      // The system cursor is hidden only once the custom one is on screen
      root.classList.add("has-custom-cursor");
    };
    const onOver = (e: PointerEvent) => {
      el.dataset.hover = (e.target as Element).closest?.(CLICKABLE) ? "true" : "false";
    };
    const onDown = () => {
      el.dataset.down = "true";
    };
    const onUp = () => {
      el.dataset.down = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    root.addEventListener("pointerleave", hide);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      document.removeEventListener("pointerover", onOver);
      root.removeEventListener("pointerleave", hide);
      hide();
      gsap.killTweensOf(el);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="cursor-follower" />;
}
