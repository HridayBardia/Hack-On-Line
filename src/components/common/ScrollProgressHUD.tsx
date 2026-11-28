"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useVelocity, useSpring } from "framer-motion";
import {
  Zap,
  Activity,
  ChevronUp,
  Maximize2,
  Minimize2,
  Cpu,
  Layers,
  Radio,
  Clock,
  Shield,
  HelpCircle,
  Users,
  type LucideIcon,
} from "lucide-react";

interface SectionMarker {
  id: string;
  name: string;
  num: string;
  icon: LucideIcon;
}

const SECTIONS: SectionMarker[] = [
  { id: "hero", name: "MISSION", num: "01", icon: Zap },
  { id: "about", name: "DOCTRINES", num: "02", icon: Shield },
  { id: "platform", name: "PLATFORM", num: "03", icon: Cpu },
  { id: "tracks", name: "TRACKS", num: "04", icon: Layers },
  { id: "timeline", name: "TIMELINE", num: "05", icon: Clock },
  { id: "team", name: "CREW", num: "06", icon: Users },
  { id: "rules", name: "RUBRICS", num: "07", icon: Activity },
  { id: "faq", name: "FAQ", num: "08", icon: HelpCircle },
];

export function ScrollProgressHUD() {
  const [activeSection, setActiveSection] = useState("hero");
  const [isExpanded, setIsExpanded] = useState(false);
  const [velocityDisplay, setVelocityDisplay] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const mounted = React.useSyncExternalStore(() => () => {}, () => true, () => false);

  const { scrollYProgress, scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 25, stiffness: 200 });

  // Sync scroll percentage and velocity readings with value change gating to prevent re-render spam
  useEffect(() => {
    let lastPercent = -1;
    let lastVelocity = -1;

    const unsubProgress = scrollYProgress.on("change", (latest) => {
      const p = Math.round(latest * 100);
      if (p !== lastPercent) {
        lastPercent = p;
        setProgressPercent(p);
      }
    });

    let velTicking = false;
    const unsubVelocity = smoothVelocity.on("change", (latest) => {
      if (!velTicking) {
        window.requestAnimationFrame(() => {
          const v = Math.round(Math.abs(latest) / 50) * 50; // Step by 50 to avoid micro-render storms
          if (v !== lastVelocity) {
            lastVelocity = v;
            setVelocityDisplay(v);
          }
          velTicking = false;
        });
        velTicking = true;
      }
    });

    return () => {
      unsubProgress();
      unsubVelocity();
    };
  }, [scrollYProgress, smoothVelocity]);

  // Section observer with cached geometry (zero forced layout reflows!)
  useEffect(() => {
    let cachedOffsets: Array<{ id: string; top: number }> = [];

    const measureOffsets = () => {
      cachedOffsets = SECTIONS.map((sec) => {
        const el = document.getElementById(sec.id);
        return el ? { id: sec.id, top: el.offsetTop } : null;
      }).filter(Boolean) as Array<{ id: string; top: number }>;
    };

    measureOffsets();
    window.addEventListener("resize", measureOffsets, { passive: true });

    let ticking = false;
    let localActive = "hero";

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + window.innerHeight * 0.35;
          for (let i = cachedOffsets.length - 1; i >= 0; i--) {
            if (cachedOffsets[i].top <= scrollPos) {
              if (cachedOffsets[i].id !== localActive) {
                localActive = cachedOffsets[i].id;
                setActiveSection(cachedOffsets[i].id);
              }
              break;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measureOffsets);
    };
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;

    const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(el, { offset: -60, duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (!mounted) return null;

  // Velocity status classification
  const getVelocityTier = () => {
    if (velocityDisplay > 2500) return { label: "HYPER-SPEED", color: "text-brand-cyan", bg: "bg-brand-cyan", glow: "shadow-[0_0_12px_rgba(2,226,248,0.6)]" };
    if (velocityDisplay > 1200) return { label: "WARP FLUX", color: "text-brand-cyan", bg: "bg-brand-cyan", glow: "shadow-[0_0_12px_rgba(2,226,248,0.6)]" };
    if (velocityDisplay > 400) return { label: "CRUISING", color: "text-brand-green", bg: "bg-brand-green", glow: "shadow-[0_0_12px_rgba(39,246,87,0.6)]" };
    return { label: "NOMINAL", color: "text-brand-green", bg: "bg-brand-green", glow: "shadow-[0_0_8px_rgba(39,246,87,0.5)]" };
  };

  const tier = getVelocityTier();
  const currentSectionMeta = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[0];

  return (
    <div
      aria-label="Scroll Telemetry HUD"
      className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-2.5 sm:right-6 z-50 flex flex-col items-end gap-2.5 font-mono select-none max-w-[calc(100vw-1.25rem)]"
    >
      {/* Expanded Control Matrix Drawer */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="w-72 max-w-[calc(100vw-1.5rem)] rounded-2xl border border-white/20 bg-zinc-950/95 p-3.5 sm:p-4 shadow-[0_16px_50px_rgba(0,0,0,0.85)] backdrop-blur-2xl ring-1 ring-white/10 max-h-[75dvh] overflow-y-auto"
          >
            {/* Header Telemetry Status */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <Radio className="size-3.5 text-brand-green animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest text-zinc-300 uppercase">
                  MISSION NAVIGATION
                </span>
              </div>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${tier.color} ${tier.glow} bg-white/5 border border-white/10`}>
                {tier.label}
              </span>
            </div>

            {/* Velocity & Depth Gauges */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">
                  MOMENTUM
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">{velocityDisplay}</span>
                  <span className="text-[9px] text-zinc-500">px/s</span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-100 ${tier.bg}`}
                    style={{ width: `${Math.min(100, (velocityDisplay / 3000) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-white/[0.04] p-2.5">
                <span className="text-[9px] uppercase tracking-wider text-zinc-400 block mb-1">
                  PAGE ALTITUDE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white">{progressPercent}</span>
                  <span className="text-[9px] text-zinc-500">%</span>
                </div>
                <div className="mt-1.5 h-1 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-green via-brand-green to-brand-cyan transition-all duration-100"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Fast Warp Navigation Directory */}
            <div className="space-y-1">
              <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold block mb-1.5">
                WARP COORDINATES
              </span>
              <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1">
                {SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => scrollTo(sec.id)}
                      className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all text-left cursor-pointer border ${isActive
                        ? "bg-brand-green text-black font-bold border-brand-green shadow-[0_0_12px_rgba(39,246,87,0.45)]"
                        : "bg-white/[0.03] text-zinc-400 hover:text-white border-white/5 hover:border-white/15"
                        }`}
                    >
                      <Icon className={`size-3 shrink-0 ${isActive ? "text-zinc-950" : "text-zinc-400"}`} />
                      <span className="truncate">{sec.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Top Warp Button */}
            <button
              type="button"
              onClick={scrollToTop}
              className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-gradient-to-r from-brand-green/20 via-brand-green/20 to-brand-cyan/20 border border-white/20 text-white text-[11px] font-bold hover:border-white/40 active:scale-95 transition-all cursor-pointer shadow-lg"
            >
              <ChevronUp className="size-3.5" />
              <span>WARP TO STRATOSPHERE (TOP)</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Tactical Capsule (Always Visible Pill) */}
      <motion.div
        layout
        className="flex items-center gap-2 rounded-full border border-white/20 bg-zinc-950/85 p-1.5 pr-3 shadow-[0_8px_32px_rgba(0,0,0,0.6)] backdrop-blur-2xl ring-1 ring-white/10 transition-colors hover:border-white/40"
      >
        {/* Circular Progress Gauge */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          title="Toggle Telemetry Console"
          className="relative size-10 rounded-full flex items-center justify-center cursor-pointer group"
        >
          {/* Background Track */}
          <svg className="size-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-white/10 stroke-current"
              strokeWidth="3.2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Luminous Animated Gauge */}
            <path
              className="text-brand-green stroke-current transition-all duration-150 drop-shadow-[0_0_6px_rgba(39,246,87,0.9)]"
              strokeDasharray={`${progressPercent}, 100`}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Center Percentage Display */}
          <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black tracking-tighter text-white">
            {progressPercent}%
          </div>
        </button>

        {/* Current Active Section Pillar */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex flex-col cursor-pointer border-l border-white/10 pl-2.5 pr-1.5"
        >
          <div className="flex items-center gap-1.5">
            <span className={`size-1.5 rounded-full ${tier.bg} ${tier.glow} animate-pulse`} />
            <span className="text-[10px] font-bold text-white tracking-wider">
              {currentSectionMeta.name}
            </span>
          </div>
          <span className="text-[8px] text-zinc-500 font-medium">
            STAGE {currentSectionMeta.num} {"//"} {velocityDisplay} PX/S
          </span>
        </div>

        {/* Toggle Expansion Chevron */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? "Collapse telemetry" : "Expand telemetry"}
          className="size-8 min-w-8 min-h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-zinc-300 hover:text-white transition-all cursor-pointer"
        >
          {isExpanded ? (
            <Minimize2 className="size-3.5" />
          ) : (
            <Maximize2 className="size-3.5" />
          )}
        </button>
      </motion.div>
    </div>
  );
}
export default ScrollProgressHUD;
