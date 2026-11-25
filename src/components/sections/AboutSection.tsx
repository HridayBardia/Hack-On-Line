"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Terminal,
  Users,
  ShieldCheck,
  GitBranch,
  CheckCircle2,
  Layers,
  Code2,
  Check,
  Server,
  Globe,
  ChevronRight,
  Scan,
  Sparkles,
} from "lucide-react";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeDoctrineIdx, setActiveDoctrineIdx] = useState(0);
  const [comparisonMode, setComparisonMode] = useState<"standard" | "comparison">("standard");

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Scroll-linked cinematics
  const chamberScale = useTransform(scrollYProgress, [0.15, 0.45], [0.96, 1]);
  const chamberOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0.6, 1]);

  const doctrines = [
    {
      id: "01",
      code: "RUNTIME // DEPLOYMENT",
      title: "Production Over Presentations",
      tag: "CORE DOCTRINE",
      desc: "We eliminate vanity slide decks and pitch-theater. Every project must deploy live to a public URL with working API contracts, real interactive flows, and zero mock fallbacks.",
      guarantee: "100% Live Cloud Deployment Required",
      icon: Terminal,
      accent: "#FF8C66",
      telemetry: "EDGE_LATENCY: 14.2ms // ZERO_MOCK_ASSERTION: PASSED",
      terminalTitle: "LIVE_CLOUD_PROBE // PRODUCTION VERIFICATION",
      terminalCmd: "curl -I https://app.hackonline.dev/healthz --verbose",
      terminalOutput: [
        { text: "* Connecting to edge cluster node (fra-1.edge.io)...", color: "text-zinc-500" },
        { text: "> GET /healthz HTTP/2", color: "text-cyan-400" },
        { text: "< HTTP/2 200 OK", color: "text-emerald-400 font-bold" },
        { text: "< content-type: application/json; charset=utf-8", color: "text-zinc-400" },
        { text: "< x-deployment-status: VERIFIED_LIVE_EDGE", color: "text-emerald-300" },
        { text: "< response-time: 14.2ms | zero-mock-contracts: 100%", color: "text-amber-300" },
      ],
      details: [
        "Mandatory public domain (Vercel, Fly.io, Railway, Cloudflare, AWS)",
        "Zero mock stubs: live backend database or real third-party integrations",
        "Evaluated on real network resilience and graceful HTTP error handling",
      ],
    },
    {
      id: "02",
      code: "PEER_AUDIT // CODE_RIGOR",
      title: "Active Engineer Peer Review",
      tag: "EVALUATION STANDARD",
      desc: "Submissions are reviewed directly by currently working software engineers and startup architects who deploy code daily—inspecting real component hygiene and API architecture.",
      guarantee: "Reviewed by Practicing Industry Engineers",
      icon: Users,
      accent: "#8B5CF6",
      telemetry: "AST_HYGIENE: 98.4% // DEAD_CODE_FOOTPRINT: 0.00%",
      terminalTitle: "PEER_AUDIT_CONSOLE // PULL_REQUEST_REVIEW",
      terminalCmd: "git log --oneline -n 12 --stat | review-agent --strict",
      terminalOutput: [
        { text: "PR #42: Strict TypeScript boundary & CRDT state graph", color: "text-zinc-300" },
        { text: "✓ Architecture review passed by Staff Infrastructure Engineer", color: "text-emerald-400" },
        { text: "✓ Zero dead code bloat detected; 0 spaghetti dependencies", color: "text-cyan-300" },
        { text: "✓ Modular domain boundaries & comprehensive type safety verified", color: "text-violet-300" },
        { text: "=> VERDICT: APPROVED FOR ADVANCED TECHNICAL SCORING", color: "text-emerald-400 font-bold" },
      ],
      details: [
        "Evaluators deploy and ship production software in high-velocity tech teams",
        "Direct code scrutiny: no superficial deck-reading or pitch-theater",
        "Rubric weighted heavily toward maintainability, scalability & craft",
      ],
    },
    {
      id: "03",
      code: "FRESH_CODE // FAIR_PLAY",
      title: "Fresh Commits & Original Code",
      tag: "FAIR-PLAY ASSURANCE",
      desc: "All code must be built from scratch during the 24-hour sprint. We check GitHub repository timestamps and commit history to ensure no pre-built projects or templates are recycled.",
      guarantee: "100% Fresh Code Written During Sprint",
      icon: ShieldCheck,
      accent: "#06B6D4",
      telemetry: "KICKOFF TIMESTAMP: Jan 30, 10:00 AM IST",
      terminalTitle: "REPO_CHECK // COMMIT_HISTORY_REVIEW",
      terminalCmd: "git log --since='2027-01-30 10:00:00' --stat",
      terminalOutput: [
        { text: "Repository: github.com/squad-9/hackonline-project", color: "text-zinc-300" },
        { text: "First commit: Jan 30, 2027, 10:04 AM IST (After kickoff)", color: "text-cyan-300" },
        { text: "Commit distribution: Natural development activity across 24 hours", color: "text-emerald-300" },
        { text: "History check: Verified fresh project with zero pre-made code", color: "text-emerald-400" },
        { text: "=> VERDICT: 100% SPRINT-NATIVE ORIGINAL WORK", color: "text-emerald-400 font-bold" },
      ],
      details: [
        "All project commits must start after the official sprint kickoff at 10:00 AM IST",
        "Judges verify repository commit history so no pre-existing projects are submitted",
        "Guarantees an honest, fair, and level playing field for every team",
      ],
    },
    {
      id: "04",
      code: "SOVEREIGNTY // IP_FREEDOM",
      title: "100% Builder IP Protection",
      tag: "COMMERCIAL FREEDOM",
      desc: "Builders retain complete, unencumbered ownership of their intellectual property, repositories, and future commercial monetization. We take 0% equity and 0% rights.",
      guarantee: "Total Ownership Retained by the Team",
      icon: GitBranch,
      accent: "#10B981",
      telemetry: "BUILDER_EQUITY_CLAIM: 0.00% // SOVEREIGN_IP: 100.00%",
      terminalTitle: "LEGAL_IP_CLEARANCE // BUILDER_RIGHTS_CERTIFICATE",
      terminalCmd: "ip-governance --audit-terms --organization 'Hack On-Line'",
      terminalOutput: [
        { text: "Builder IP Ownership: 100.00% UNENCUMBERED", color: "text-emerald-400 font-bold" },
        { text: "Hack On-Line Equity Claim: 0.00% (Zero Stake / Zero Royalty)", color: "text-cyan-300" },
        { text: "Commercialization Freedom: Unrestricted Worldwide", color: "text-emerald-300" },
        { text: "Open Source / Proprietary License: Decided 100% by Team", color: "text-zinc-300" },
        { text: "=> POLICY: PURE MERITOCRACY · NO EQUITY TRAPS", color: "text-emerald-400 font-bold" },
      ],
      details: [
        "You own 100% of the code, trademarks, patents, and commercial value",
        "No forced investor rights or proprietary locking by hackathon hosts",
        "Continue building into a venture or open-source package with full freedom",
      ],
    },
  ];

  const comparisonItems = [
    {
      aspect: "Judging Criteria",
      legacy: "Slide decks, 3-minute pitch theater, marketing buzzwords",
      hackOnline: "Working live deployment URL, production API resilience, clean code",
    },
    {
      aspect: "Evaluators",
      legacy: "Sponsors, non-technical generalists, marketing judges",
      hackOnline: "Practicing software engineers, startup architects, technical directors",
    },
    {
      aspect: "Code Authenticity",
      legacy: "Unchecked pre-built codebases, unverified copy-pasting",
      hackOnline: "Commit history checked; all work must start fresh after sprint kickoff",
    },
    {
      aspect: "IP & Equity",
      legacy: "Ambiguous ownership, host rights claims, investor lock-in",
      hackOnline: "100% unencumbered builder IP retention, 0% equity, total commercial freedom",
    },
  ];

  const activeDoctrine = doctrines[activeDoctrineIdx];

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-label="About Hack On-Line"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 scroll-mt-24 select-none relative z-10"
    >
      {/* Header with Scroll Stagger */}
      <motion.div
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-white/10 gap-4 mb-10"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>01 // INSTITUTIONAL ETHOS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Engineering over presentations.
          </h2>
        </div>
        <p className="text-sm text-zinc-300 max-w-md sm:text-right font-normal leading-relaxed">
          Hack On-Line is an elite hackathon platform hosting high-velocity 24-hour virtual engineering sprints.
        </p>
      </motion.div>

      {/* Heroic Statement with Scroll Glow */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="py-10 border-b border-white/10"
      >
        <p className="text-xl sm:text-3xl text-zinc-300 font-light leading-snug tracking-tight max-w-4xl">
          We built Hack On-Line because developer hackathons got corrupted by pitchmanship and PowerPoint.{" "}
          <span className="text-white font-bold underline decoration-emerald-400 decoration-2 underline-offset-8">
            We only reward running code. If your project doesn’t deploy live in production, it doesn’t exist.
          </span>
        </p>
      </motion.div>

      {/* View Mode Toggle: Standards Console vs Comparison Matrix */}
      <div className="pt-10 pb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setComparisonMode("standard")}
            className={`w-full xs:w-auto px-4 py-2.5 min-h-11 rounded-xl text-xs font-mono font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${comparisonMode === "standard"
              ? "bg-white text-zinc-950 shadow-lg scale-[1.02]"
              : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
              }`}
          >
            <Scan className="w-3.5 h-3.5 text-cyan-500" />
            <span>01 // ARCHITECTURAL CONSOLE</span>
          </button>
          <button
            onClick={() => setComparisonMode("comparison")}
            className={`w-full xs:w-auto px-4 py-2.5 min-h-11 rounded-xl text-xs font-mono font-black transition-all cursor-pointer flex items-center justify-center gap-2 ${comparisonMode === "comparison"
              ? "bg-white text-zinc-950 shadow-lg scale-[1.02]"
              : "bg-white/5 text-zinc-400 hover:text-white border border-white/10"
              }`}
          >
            <Layers className="w-3.5 h-3.5 text-violet-400" />
            <span>02 // SPRINT VS LEGACY MATRIX</span>
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold text-zinc-300">SYSTEM ARCHITECTURE ACTIVE</span>
        </div>
      </div>

      {comparisonMode === "standard" ? (
        /* ========================================================================= */
        /* CINEMATIC INTERACTIVE ARCHITECTURE CONSOLE & BLUEPRINT CHAMBER            */
        /* ========================================================================= */
        <motion.div
          style={{ scale: chamberScale, opacity: chamberOpacity }}
          className="relative py-4"
        >
          {/* Main Cinematic Grid Cockpit */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

            {/* LEFT HUD: Interactive Telemetry Standard Selector (4 Cybernetic Cylinders) */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-3.5">
              <div className="text-[11px] font-mono uppercase tracking-widest text-zinc-400 font-bold mb-1 flex items-center justify-between">
                <span>SELECT ARCHITECTURAL PROTOCOL</span>
                <span className="text-cyan-400">0{activeDoctrineIdx + 1} / 04</span>
              </div>

              {doctrines.map((doctrine, index) => {
                const isSelected = activeDoctrineIdx === index;
                return (
                  <motion.div
                    key={doctrine.id}
                    onClick={() => setActiveDoctrineIdx(index)}
                    whileHover={{ scale: 1.015, x: 4 }}
                    whileTap={{ scale: 0.985 }}
                    className={`relative p-5 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden border-2 ${isSelected
                      ? "bg-[#090A14] border-white/40 shadow-[0_0_30px_rgba(255,255,255,0.12)]"
                      : "bg-[#05060A]/80 border-white/10 hover:border-white/20 hover:bg-[#07080F]"
                      }`}
                  >
                    {/* Left Neon Pillar Strip */}
                    <div
                      className="absolute left-0 inset-y-0 w-1.5 transition-all duration-300 shadow-[0_0_12px_currentColor]"
                      style={{
                        backgroundColor: isSelected ? doctrine.accent : "transparent",
                        color: doctrine.accent,
                      }}
                    />

                    {/* Corner Watermark Number */}
                    <span className="absolute right-4 bottom-2 font-mono text-3xl font-black text-white/[0.04] pointer-events-none select-none">
                      #{doctrine.id}
                    </span>

                    <div className="flex items-center justify-between mb-2 pl-2">
                      <span
                        className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded font-black border"
                        style={{
                          borderColor: `${doctrine.accent}40`,
                          backgroundColor: `${doctrine.accent}15`,
                          color: doctrine.accent,
                        }}
                      >
                        {doctrine.code}
                      </span>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-zinc-400">
                        <span
                          className={`w-2 h-2 rounded-full ${isSelected ? "animate-pulse" : ""}`}
                          style={{ backgroundColor: isSelected ? doctrine.accent : "#52525b" }}
                        />
                        <span>{isSelected ? "INSPECTING" : "LOCKED"}</span>
                      </div>
                    </div>

                    <div className="pl-2">
                      <h3 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center justify-between">
                        <span>{doctrine.title}</span>
                        <ChevronRight
                          className={`w-4 h-4 transition-transform duration-300 ${isSelected ? "translate-x-1 text-white" : "text-zinc-600"
                            }`}
                        />
                      </h3>

                      <p className="mt-1.5 text-xs text-zinc-300 font-normal leading-relaxed">
                        {doctrine.desc}
                      </p>

                      <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                        <span className="font-semibold text-zinc-300 flex items-center gap-1.5">
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>{doctrine.guarantee}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* RIGHT HUD: The Cinematic Blueprint Telemetry & Live Verification Chamber */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div className="relative rounded-3xl bg-[#020306] border-2 border-white/25 shadow-[0_24px_80px_rgba(0,0,0,0.95)] overflow-hidden p-6 sm:p-8 flex flex-col justify-between h-full">

                {/* Background CAD Blueprint Grid & Crosshair Accents */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-20"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)
                    `,
                    backgroundSize: "28px 28px",
                  }}
                />

                {/* Ambient Radial Color Flash */}
                <div
                  className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-30 transition-all duration-500"
                  style={{ backgroundColor: activeDoctrine.accent }}
                />

                {/* Chamber Top Telemetry Banner */}
                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/15">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                      <activeDoctrine.icon
                        className="w-5 h-5"
                        style={{ color: activeDoctrine.accent }}
                      />
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">
                        DIAGNOSTIC PROTOCOL #{activeDoctrine.id}
                      </span>
                      <h4 className="text-lg sm:text-xl font-black text-white tracking-tight">
                        {activeDoctrine.title}
                      </h4>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <span
                      className="px-3 py-1 rounded-full text-[10px] font-mono font-black border uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                      style={{
                        borderColor: `${activeDoctrine.accent}50`,
                        backgroundColor: `${activeDoctrine.accent}15`,
                        color: activeDoctrine.accent,
                      }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      <span>{activeDoctrine.tag}</span>
                    </span>
                  </div>
                </div>

                {/* Live System Architecture Topology Wiring (Completely Unique) */}
                <div className="relative z-10 my-6 p-4 rounded-2xl bg-black/60 border border-white/10 backdrop-blur-md">
                  <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest font-bold mb-3 flex items-center justify-between">
                    <span>LIVE ARCHITECTURAL PIPELINE TOPOLOGY</span>
                    <span className="text-emerald-400 font-bold">PULSE: 60 FPS</span>
                  </div>

                  {/* Flow Diagram with SVG Circuit Pulse */}
                  <div className="grid grid-cols-2 xs:grid-cols-4 gap-2 text-center text-[10px] sm:text-[11px] font-mono">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/15 flex flex-col items-center justify-center">
                      <Code2 className="w-4 h-4 text-cyan-400 mb-1" />
                      <span className="font-bold text-white">01. Repo</span>
                      <span className="text-[9px] text-zinc-400">Genesis SHA</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/15 flex flex-col items-center justify-center">
                      <Globe className="w-4 h-4 text-emerald-400 mb-1" />
                      <span className="font-bold text-white">02. Edge</span>
                      <span className="text-[9px] text-zinc-400">Live Gateway</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/15 flex flex-col items-center justify-center">
                      <Server className="w-4 h-4 text-violet-400 mb-1" />
                      <span className="font-bold text-white">03. Cloud</span>
                      <span className="text-[9px] text-zinc-400">Zero-Mock API</span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/15 flex flex-col items-center justify-center">
                      <ShieldCheck className="w-4 h-4 text-amber-400 mb-1" />
                      <span className="font-bold text-white">04. Audit</span>
                      <span className="text-[9px] text-zinc-400">Peer Scrutiny</span>
                    </div>
                  </div>
                </div>

                {/* Live Holographic Terminal Console */}
                <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-[#000000] border-2 border-white/20 font-mono text-xs shadow-inner">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-white/15 mb-3 text-zinc-400 text-[11px] gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shrink-0" />
                      <span className="font-bold text-zinc-200 truncate">{activeDoctrine.terminalTitle}</span>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-bold shrink-0">{activeDoctrine.telemetry}</span>
                  </div>

                  <div className="text-zinc-300 flex items-start gap-2 mb-2 font-bold break-all">
                    <span className="text-emerald-400 shrink-0">$</span>
                    <span className="text-white">{activeDoctrine.terminalCmd}</span>
                  </div>

                  <div className="space-y-1.5 pt-1 text-[11px] break-words">
                    {activeDoctrine.terminalOutput.map((out, i) => (
                      <div key={i} className={out.color}>
                        {out.text}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specific Architectural Guarantees List */}
                <div className="relative z-10 mt-5 pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {activeDoctrine.details.map((detail, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-start gap-2 text-xs text-zinc-300"
                    >
                      <CheckCircle2
                        className="w-4 h-4 shrink-0 mt-0.5"
                        style={{ color: activeDoctrine.accent }}
                      />
                      <span className="leading-snug">{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Architectural Status Bar */}
                <div className="relative z-10 mt-5 pt-4 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 font-mono">
                  <span className="text-[11px] text-zinc-400">
                    STATUS: <strong className="text-white font-bold">MANDATORY COMPLIANCE FOR ALL SUBMISSIONS</strong>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    VERIFIED DOCTRINE
                  </span>
                </div>

              </div>
            </div>

          </div>
        </motion.div>
      ) : (
        /* ========================================================================= */
        /* SPRINT VS LEGACY COMPARISON MATRIX                                        */
        /* ========================================================================= */
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="py-6 border-b border-white/10"
        >
          <div className="luxury-card rounded-3xl p-6 sm:p-8 border border-white/15 overflow-hidden">
            <div className="text-sm font-mono text-zinc-400 uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>THE ENGINEERING DIFFERENCE</span>
            </div>

            <div className="divide-y divide-white/10">
              {comparisonItems.map((item, idx) => (
                <div key={idx} className="py-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-3 text-sm font-bold text-white font-mono">
                    {item.aspect}
                  </div>
                  <div className="md:col-span-4 p-3.5 rounded-2xl bg-rose-950/20 border border-rose-500/20 text-xs text-rose-300 leading-relaxed">
                    <span className="font-mono text-[10px] uppercase font-bold text-rose-400 block mb-1">
                      Legacy Hackathons
                    </span>
                    {item.legacy}
                  </div>
                  <div className="md:col-span-5 p-3.5 rounded-2xl bg-emerald-950/25 border border-emerald-500/25 text-xs text-emerald-200 leading-relaxed">
                    <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                      Hack On-Line 2027 Sprint
                    </span>
                    {item.hackOnline}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Live Operational Metrics Ribbon with Scroll Stagger */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        <div className="p-5 rounded-2xl bg-zinc-950/50 border border-white/10 text-center hover:border-white/20 transition-all">
          <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono">05</div>
          <div className="text-xs text-zinc-400 mt-1 uppercase font-mono tracking-wider">
            Problem Arenas
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950/50 border border-white/10 text-center hover:border-white/20 transition-all">
          <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">24H</div>
          <div className="text-xs text-zinc-400 mt-1 uppercase font-mono tracking-wider">
            Non-Stop Sprint
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950/50 border border-white/10 text-center hover:border-white/20 transition-all">
          <div className="text-3xl sm:text-4xl font-black text-white font-mono">100%</div>
          <div className="text-xs text-zinc-400 mt-1 uppercase font-mono tracking-wider">
            Cloud Deployment
          </div>
        </div>
        <div className="p-5 rounded-2xl bg-zinc-950/50 border border-white/10 text-center hover:border-white/20 transition-all">
          <div className="text-3xl sm:text-4xl font-black text-purple-400 font-mono">₹0</div>
          <div className="text-xs text-zinc-400 mt-1 uppercase font-mono tracking-wider">
            Free Builder Entry
          </div>
        </div>
      </motion.div>
    </section>
  );
}

export default AboutSection;
