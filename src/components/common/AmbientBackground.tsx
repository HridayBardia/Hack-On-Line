"use client";

import React, { useEffect, useRef } from "react";

export function AmbientBackground() {
  const mouseGlowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (mouseGlowRef.current) {
        mouseGlowRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none bg-[#050607]"
      style={{ transform: "translateZ(0)", contain: "strict" }}
    >
      {/* Primary Top Atmospheric Aurora Glow */}
      <div className="hero-glow-aura" />

      {/* Secondary Cyan Accent Pool */}
      <div className="absolute top-[40%] right-[-10%] w-[55vw] max-w-[800px] h-[550px] rounded-full bg-[radial-gradient(circle,rgba(39,246,87,0.12)_0%,transparent_70%)] blur-[100px]" />

      {/* Tertiary Amber Energy Pool */}
      <div className="absolute top-[75%] left-[-10%] w-[50vw] max-w-[700px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(2,226,248,0.08)_0%,transparent_70%)] blur-[90px]" />

      {/* Subtle Interactive Mouse Glow */}
      <div
        ref={mouseGlowRef}
        className="fixed top-0 left-0 -ml-[250px] -mt-[250px] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(39,246,87,0.06)_0%,transparent_70%)] blur-2xl transition-transform duration-100 ease-out will-change-transform hidden md:block"
      />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-circuit-grid opacity-70" />

      {/* Edge Gradient Mask */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
    </div>
  );
}
