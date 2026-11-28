"use client";

import React from "react";

interface MarqueeItem {
  text: string;
  badge?: string;
  outline?: boolean;
}

const row1: MarqueeItem[] = [
  { text: "HACK ON-LINE 2027", badge: "JAN 30–31", outline: false },
  { text: "24-HOUR VIRTUAL SPRINT", outline: true },
  { text: "5 ENGINEERING TRACKS", badge: "₹0 ENTRY", outline: false },
  { text: "ZERO SLIDE DECKS", outline: true },
  { text: "PRODUCTION RUNTIMES ONLY", badge: "NO MOCKS", outline: false },
];

const row2: MarqueeItem[] = [
  { text: "LIVE CLOUD DEPLOYMENT", badge: "REQUIRED", outline: false },
  { text: "FRESH COMMITS ONLY", outline: true },
  { text: "ACTIVE INDUSTRY PEER REVIEW", badge: "STAGE 01", outline: false },
  { text: "INTERROGATION MATRIX", outline: true },
  { text: "ORIGINAL CODE ONLY", badge: "FROM SCRATCH", outline: false },
];

function MarqueeRow({
  items,
  direction = "left",
  duration = 45,
}: {
  items: MarqueeItem[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const animationClass = direction === "left" ? "animate-marquee-left" : "animate-marquee-right";

  return (
    <div className="relative flex overflow-hidden whitespace-nowrap py-2 sm:py-3 select-none w-full cursor-default">
      {/* Primary Track */}
      <div
        className={`flex shrink-0 items-center gap-6 pr-6 text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter ${animationClass}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((item, idx) => (
          <div key={`a-${idx}`} className="flex items-center gap-4 shrink-0">
            {item.badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold tracking-widest bg-white/[0.08] border border-white/20 text-brand-green-soft shadow-[0_0_16px_rgba(39,246,87,0.3)]">
                <span className="size-1.5 rounded-full bg-brand-green animate-pulse" />
                {item.badge}
              </span>
            )}

            <span
              className={
                item.outline
                  ? "text-transparent"
                  : "text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.4)]"
              }
              style={
                item.outline
                  ? { WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.55)" }
                  : undefined
              }
            >
              {item.text}
            </span>

            <span className="text-white/20 text-2xl font-light">{"///"}</span>
          </div>
        ))}
      </div>

      {/* Identical Cloned Track for Seamless Infinite CSS Loop */}
      <div
        aria-hidden="true"
        className={`flex shrink-0 items-center gap-6 pr-6 text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter ${animationClass}`}
        style={{ animationDuration: `${duration}s` }}
      >
        {items.map((item, idx) => (
          <div key={`b-${idx}`} className="flex items-center gap-4 shrink-0">
            {item.badge && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold tracking-widest bg-white/[0.08] border border-white/20 text-brand-green-soft shadow-[0_0_16px_rgba(39,246,87,0.3)]">
                <span className="size-1.5 rounded-full bg-brand-green animate-pulse" />
                {item.badge}
              </span>
            )}

            <span
              className={
                item.outline
                  ? "text-transparent"
                  : "text-white drop-shadow-[0_2px_20px_rgba(255,255,255,0.4)]"
              }
              style={
                item.outline
                  ? { WebkitTextStroke: "1.5px rgba(255, 255, 255, 0.55)" }
                  : undefined
              }
            >
              {item.text}
            </span>

            <span className="text-white/20 text-2xl font-light">{"///"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VelocityMarquee() {
  return (
    <section
      aria-label="Kinetic Ticker"
      className="relative w-full py-8 sm:py-14 overflow-hidden bg-gradient-to-b from-transparent via-zinc-950/80 to-transparent border-y border-white/10 z-10"
    >
      {/* Edge gradient mask for seamless infinite fade */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-48 bg-gradient-to-r from-[#050607] to-transparent z-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-48 bg-gradient-to-l from-[#050607] to-transparent z-20" />

      {/* Ambient Backlight Beam */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-24 bg-gradient-to-r from-brand-green/10 via-brand-green/15 to-brand-cyan/10 blur-3xl pointer-events-none" />

      {/* Row 1: Leftward Ribbon flowing in its own constant slow speed */}
      <MarqueeRow items={row1} direction="left" duration={45} />

      {/* Row 2: Rightward Ribbon flowing in its own constant slow speed */}
      <MarqueeRow items={row2} direction="right" duration={45} />
    </section>
  );
}

export default VelocityMarquee;
