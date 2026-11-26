"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Countdown } from "../Countdown";
import { TextScramble } from "@/components/common/TextScramble";
import {
  ArrowRight,
  Copy,
  Check,
  ChevronDown,
} from "lucide-react";

interface HeroProps {
  onOpenRegister?: () => void;
}

export function Hero({ onOpenRegister }: HeroProps) {
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const portalUrl = "https://unstop.com/hackathons/hack-on-line-2027";

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);

  const copyLink = () => {
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-[92dvh] pt-24 pb-12 sm:pt-36 sm:pb-24 px-3 sm:px-4 flex flex-col items-center justify-between text-center overflow-x-clip"
    >
      <motion.div
        style={{ y: heroY }}
        className="max-w-5xl mx-auto relative z-10 flex flex-col items-center w-full"
      >
        {/* Event Status Ribbon */}
        <motion.div
          initial={{ opacity: 0, y: -14, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="inline-flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-950/70 via-zinc-900/90 to-cyan-950/70 border border-white/15 shadow-[0_0_24px_rgba(139,92,246,0.3)] mb-6 text-[11px] sm:text-xs text-zinc-200 backdrop-blur-xl max-w-full text-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Hack On-Line"
            className="w-4 h-4 object-contain filter drop-shadow-[0_0_6px_rgba(16,185,129,0.5)] shrink-0"
          />
          <span className="text-zinc-200 font-normal whitespace-nowrap">
            January 30–31, 2027
          </span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-zinc-300 font-normal whitespace-nowrap">24H VIRTUAL SPRINT</span>
          <span className="text-white/30 hidden sm:inline">•</span>
          <span className="text-emerald-400 font-medium whitespace-nowrap">₹0 FREE ENTRY</span>
        </motion.div>

        {/* Monolithic Hero Title */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative inline-block my-2 max-w-full overflow-hidden"
        >
          <h1 className="text-4xl sm:text-8xl md:text-9xl font-black tracking-tight sm:tracking-tighter uppercase leading-[0.95] sm:leading-[0.9] select-none text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.3)] cursor-pointer break-words">
            <TextScramble text="HACK ON-LINE" speed={25} cyclesPerChar={2} />
          </h1>
          {/* Subtle luminous neon trace below title */}
          <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400/80 via-violet-400/80 to-transparent mt-3 shadow-[0_0_12px_rgba(6,182,212,0.8)]" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="mt-5 sm:mt-6 text-base sm:text-2xl text-zinc-300 max-w-3xl font-light leading-relaxed text-pretty px-2"
        >
          The premier 24-hour virtual developer hackathon. 5 engineering sectors, fresh commits only, and rigorous peer review by active industry engineers.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
          className="mt-9 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4"
        >
          <button
            onClick={onOpenRegister}
            className="luxury-button-primary px-7 py-3.5 rounded-2xl text-sm font-bold flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.35)] cursor-pointer"
          >
            <span>Register on Unstop</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </button>

          <a
            href="#tracks"
            className="luxury-button-secondary px-6 py-3.5 rounded-2xl text-sm font-semibold hover:border-white/40 flex items-center gap-2 cursor-pointer"
          >
            <span>Explore 5 Tracks</span>
          </a>

          <button
            onClick={copyLink}
            className="luxury-button-secondary px-4 py-3.5 rounded-2xl text-sm text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer"
            title="Copy portal registration link"
            aria-label="Copy portal registration link"
          >
            {copied ? (
              <Check className="w-4 h-4 text-emerald-400" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </motion.div>

        {/* Event Feature Pillars with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3.5 w-full max-w-4xl text-left"
        >
          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-md shadow-sm hover:border-white/20 transition-all hover:-translate-y-0.5">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Format</div>
            <div className="text-base font-bold text-white mt-1">24-Hour Virtual</div>
            <div className="text-xs text-zinc-400 mt-0.5">Online & GitHub Sprints</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-md shadow-sm hover:border-white/20 transition-all hover:-translate-y-0.5">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Problem Arenas</div>
            <div className="text-base font-bold text-white mt-1">5 Tracks</div>
            <div className="text-xs text-zinc-400 mt-0.5">T-15m Decryption</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-md shadow-sm hover:border-white/20 transition-all hover:-translate-y-0.5">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Evaluation</div>
            <div className="text-base font-bold text-white mt-1">2-Round Judging</div>
            <div className="text-xs text-zinc-400 mt-0.5">Top 10 Finalist Stage</div>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/10 backdrop-blur-md shadow-sm hover:border-white/20 transition-all hover:-translate-y-0.5">
            <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold">Intellectual Property</div>
            <div className="text-base font-bold text-white mt-1">100% Builder IP</div>
            <div className="text-xs text-zinc-400 mt-0.5">0% Equity / Open Rights</div>
          </div>
        </motion.div>

        {/* Integrated Real Chronometer */}
        <div className="w-full mt-4">
          <Countdown />
        </div>
      </motion.div>

      {/* Floating Scroll Cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 mt-8 mb-2 flex flex-col items-center gap-1.5 text-zinc-500 font-mono text-[11px] tracking-widest uppercase pointer-events-none"
      >
        <span>Scroll to Explore</span>
        <ChevronDown className="w-4 h-4 text-zinc-400 animate-bounce" />
      </motion.div>
    </section>
  );
}

export default Hero;
