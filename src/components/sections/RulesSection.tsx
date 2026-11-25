"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck,
  Terminal,
  Tv,
  CheckCircle2,
  FileCode,
  Globe,
  ArrowRight,
} from "lucide-react";

export function RulesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedStage, setSelectedStage] = useState<0 | 1>(0);
  const [activeProtocolIdx, setActiveProtocolIdx] = useState<number | null>(null);

  // Scroll-Linked Cinematics
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const stageScale = useTransform(scrollYProgress, [0.15, 0.4], [0.97, 1]);

  const evaluationCriteria = [
    {
      percentage: "35%",
      title: "Technical Architecture & Code Depth",
      accent: "#FF8C66",
      description:
        "Evaluated on clean component boundaries, efficient API contract design, robust state management, zero unvetted bloat, and absence of spaghetti dependencies. Working software engineers inspect your real pull requests.",
      tags: ["Code Structure", "Type Safety", "State Architecture", "API Design"],
    },
    {
      percentage: "30%",
      title: "Production Execution & Live Utility",
      accent: "#10B981",
      description:
        "Does the deployed application genuinely work end-to-end under realistic user scenarios? Does it recover gracefully from error states and edge-case inputs without unhandled crashes?",
      tags: ["Live Prototype", "Error Boundaries", "End-to-End Flow", "Resilience"],
    },
    {
      percentage: "20%",
      title: "UI/UX Polish & Usability",
      accent: "#06B6D4",
      description:
        "Restrained typography, snappy micro-interactions, responsive mobile/desktop adaptation, zero broken states, and sensory polish that respects the end user's attention.",
      tags: ["Interaction Fluidity", "Responsive Layout", "Clarity", "Typography"],
    },
    {
      percentage: "15%",
      title: "Problem Originality & Value",
      accent: "#8B5CF6",
      description:
        "A sharp, distinctive angle on the chosen problem sector rather than a generic boilerplate clone of an existing SaaS product. Novel utility that solves a real friction point.",
      tags: ["Novel Utility", "Unconventional Stack", "Sharp Insight", "Domain Impact"],
    },
  ];

  const judgingRounds = [
    {
      stageId: 0,
      round: "STAGE 01",
      title: "Preliminary Technical Evaluation & Top 10 Shortlist",
      judges: "Judges: Tech & Software Industry Experts",
      role: "Technical Evaluation Reviewers",
      accent: "#8B5CF6",
      icon: Terminal,
      mandate:
        "Comprehensive architectural audit and rubric scoring of 100% of submitted repositories across all 5 problem sectors immediately following the 10:00 AM IST code freeze.",
      checks: [
        "Commit timestamp check to confirm all code was started after 10:00 AM IST Jan 30 kickoff",
        "Component hygiene, type safety & state architecture rigor",
        "Public production deployment handshake (live HTTP 200 URL)",
        "Elimination of pre-baked codebases & boilerplate duplicates",
      ],
      outcome: "Qualifies exactly 10 Finalist Teams for the Championship Live Stage.",
      focus: "Automated git verification, static code scrutiny, live cloud ping, and top 10 shortlisting.",
    },
    {
      stageId: 1,
      round: "STAGE 02",
      title: "Championship Live Stage & Architecture Defense",
      judges: "Judges: Tech & Software Industry Experts",
      role: "Industry Review Board (Senior Engineers & Startup Architects)",
      accent: "#06B6D4",
      icon: Tv,
      mandate:
        "Live-streamed working presentation, edge-case stress testing, and real-time architectural interrogation of the Top 10 shortlisted squads.",
      checks: [
        "Live interactive flows under realistic and adversarial user inputs",
        "Technical defensibility and engineering scalability under Q&A",
        "Sensory polish, responsive performance & operational clarity",
        "Direct code walkthrough with senior software engineers",
      ],
      outcome: "Determines final podium rankings, track prize recognitions, and credential dispatch.",
      focus: "Live edge-case testing, Q&A defense, and podium placement by practicing industry engineers.",
    },
  ];

  const antiCheatRules = [
    {
      code: "PROTOCOL 01",
      title: "Fresh Commit Verification",
      icon: FileCode,
      accent: "#FF8C66",
      detail:
        "Any Git repository containing commits made before January 30, 2027, 10:00 AM IST is flagged and disqualified to ensure 100% fair play.",
      terminalCmd: "git log --reverse --format='%h %ad' | head -n 1",
      terminalExpected: "First commit timestamp >= 2027-01-30T10:00:00 IST",
    },
    {
      code: "PROTOCOL 02",
      title: "Mandatory Public Deployment",
      icon: Globe,
      accent: "#06B6D4",
      detail:
        "Every submission must have a publicly reachable production URL (Vercel, AWS, Fly.io, Cloudflare, etc.). Localhost-only screen recordings will not be evaluated.",
      terminalCmd: "curl -s -o /dev/null -w '%{http_code}' https://team-sub.live",
      terminalExpected: "HTTP 200 OK across international edge gateways",
    },
    {
      code: "PROTOCOL 03",
      title: "100% Builder IP Freedom",
      icon: ShieldCheck,
      accent: "#10B981",
      detail:
        "You retain 100% unencumbered ownership of your code, models, and intellectual property. Hack On-Line takes 0% equity and 0% rights.",
      terminalCmd: "cat LICENSE.md | grep -i 'copyright (c)'",
      terminalExpected: "100% registered to builder team. 0% organizer claim.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      id="rules"
      aria-label="Evaluation Matrix & Judging"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-24 sm:py-32 scroll-mt-28 select-none relative z-10"
    >
      {/* Header with Scroll Stagger */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-white/10 gap-4 mb-14"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            <span>05 // EVALUATION & JUDGING</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white flex items-center gap-3">
            <span>Two-Round Judging & Rubrics</span>
          </h2>
        </div>
        <p className="text-sm text-zinc-300 max-w-sm sm:text-right font-normal">
          Rigorous, transparent evaluation framework engineered for code quality and live cloud utility.
        </p>
      </motion.div>

      {/* Part 1: Cinematic Two-Round Stage Pipeline with Scroll Parallax */}
      <motion.div style={{ scale: stageScale }} className="mb-24 relative">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-ping" />
            <span>THE TWO-STAGE JUDGING FRAMEWORK</span>
          </div>

          {/* Stage Selector Buttons */}
          <div className="flex items-center gap-2 p-1 rounded-xl bg-black/80 border-2 border-white/15 shadow-lg">
            <button
              onClick={() => setSelectedStage(0)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer flex items-center gap-2 ${selectedStage === 0
                ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.5)] scale-[1.02]"
                : "text-zinc-400 hover:text-white"
                }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>STAGE 01 // TOP 10 AUDIT</span>
            </button>
            <button
              onClick={() => setSelectedStage(1)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-black transition-all cursor-pointer flex items-center gap-2 ${selectedStage === 1
                ? "bg-cyan-500 text-black shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-[1.02]"
                : "text-zinc-400 hover:text-white"
                }`}
            >
              <Tv className="w-3.5 h-3.5" />
              <span>STAGE 02 // LIVE FINALS</span>
            </button>
          </div>
        </div>

        {/* High-Tech Qualification Conduit Banner */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center mb-5 p-3.5 rounded-2xl bg-[#000000] border-2 border-white/15 font-mono text-xs shadow-xl">
          <div className="md:col-span-5 flex items-center gap-2.5 text-violet-300">
            <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <span className="font-black tracking-wider text-[11px] sm:text-xs">STAGE 01: 100% OF REPOSITORIES AUDITED</span>
          </div>
          <div className="md:col-span-2 flex items-center justify-center gap-2 text-zinc-300 font-black text-[11px] py-1 px-2.5 rounded-xl bg-white/[0.06] border border-white/10">
            <span className="text-zinc-400">FILTER</span>
            <span className="text-cyan-300 font-black">TOP 10</span>
            <ArrowRight className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <div className="md:col-span-5 flex items-center justify-start md:justify-end gap-2.5 text-cyan-300">
            <span className="font-black tracking-wider text-[11px] sm:text-xs">STAGE 02: LIVE ARCHITECTURE DEFENSE</span>
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </div>
        </div>

        {/* Both Cards with Cybernetic Corner HUD Brackets */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {judgingRounds.map((round) => {
            const Icon = round.icon;
            const isSelected = selectedStage === round.stageId;
            return (
              <motion.div
                key={round.stageId}
                onClick={() => setSelectedStage(round.stageId as 0 | 1)}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: round.stageId * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`p-8 sm:p-9 rounded-3xl flex flex-col justify-between group overflow-hidden relative cursor-pointer transition-all duration-300 border-2 ${isSelected
                  ? "bg-[#05060C] border-white/40 ring-1 ring-white/20 shadow-[0_0_40px_rgba(255,255,255,0.12)]"
                  : "bg-[#030408]/80 border-white/10 hover:border-white/25 hover:bg-[#06070E]"
                  }`}
              >
                {/* Cybernetic Corner HUD Brackets when active */}
                {isSelected && (
                  <>
                    <span className="absolute top-2.5 left-2.5 w-3.5 h-3.5 border-t-2 border-l-2 pointer-events-none transition-all duration-300" style={{ borderColor: round.accent }} />
                    <span className="absolute top-2.5 right-2.5 w-3.5 h-3.5 border-t-2 border-r-2 pointer-events-none transition-all duration-300" style={{ borderColor: round.accent }} />
                    <span className="absolute bottom-2.5 left-2.5 w-3.5 h-3.5 border-b-2 border-l-2 pointer-events-none transition-all duration-300" style={{ borderColor: round.accent }} />
                    <span className="absolute bottom-2.5 right-2.5 w-3.5 h-3.5 border-b-2 border-r-2 pointer-events-none transition-all duration-300" style={{ borderColor: round.accent }} />
                  </>
                )}

                {/* Accent glow */}
                <div
                  className="absolute top-0 right-0 w-52 h-52 rounded-full blur-3xl pointer-events-none transition-opacity duration-300"
                  style={{
                    backgroundColor: round.accent,
                    opacity: isSelected ? 0.35 : 0.12,
                  }}
                />

                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="font-mono text-xs font-black uppercase tracking-wider px-3.5 py-1 rounded-full border-2"
                      style={{
                        borderColor: `${round.accent}50`,
                        backgroundColor: `${round.accent}15`,
                        color: round.accent,
                      }}
                    >
                      {round.round}
                    </span>
                    <div
                      className="p-3 rounded-2xl border-2 shadow-sm transition-transform duration-300 group-hover:scale-110"
                      style={{
                        borderColor: `${round.accent}50`,
                        backgroundColor: `${round.accent}15`,
                        color: round.accent,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white tracking-tight mb-2">
                    {round.title}
                  </h3>

                  <div
                    className="text-sm font-black mb-1 flex items-center gap-2"
                    style={{ color: round.accent }}
                  >
                    <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                    <span>{round.judges}</span>
                  </div>

                  <div className="text-xs text-zinc-300 mb-5 font-mono">
                    {round.role}
                  </div>

                  <p className="text-sm text-zinc-300 leading-relaxed mb-6 font-normal">
                    {round.mandate}
                  </p>

                  {/* Verification Criteria */}
                  <div className="space-y-2.5 mb-8">
                    {round.checks.map((check, i) => (
                      <div key={i} className="flex items-start gap-2.5 text-xs text-zinc-200">
                        <CheckCircle2
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: round.accent }}
                        />
                        <span>{check}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-5 border-t border-white/10 text-xs font-bold text-white flex items-center justify-between">
                  <span className="text-zinc-400 font-mono text-[11px]">ADVANCEMENT OUTCOME</span>
                  <span className="text-right text-zinc-200">{round.outcome}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Part 2: Official 100% Evaluation Matrix Rubric */}
      <div className="mb-24">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-semibold flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>OFFICIAL 100% EVALUATION MATRIX</span>
            </div>
            <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Weighted Rubric Standards
            </h3>
            <p className="mt-2 text-sm text-zinc-400 max-w-2xl font-light">
              Submissions are judged across 4 comprehensive technical dimensions. Transparent, zero-marketing criteria weighted heavily toward real software execution.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 font-mono text-xs text-zinc-300 shrink-0">
            <span className="text-emerald-400 font-bold">100% TOTAL</span>
            <span className="text-white/20">|</span>
            <span>4 CORE AXES</span>
          </div>
        </div>

        {/* 4 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {evaluationCriteria.map((criterion, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-6 rounded-3xl bg-[#030408] border border-white/15 hover:border-white/30 transition-all duration-300 flex flex-col justify-between shadow-xl relative overflow-hidden group"
            >
              {/* Top Accent Line */}
              <div
                className="absolute inset-x-0 top-0 h-[3px] transition-all duration-300 opacity-80 group-hover:opacity-100"
                style={{ backgroundColor: criterion.accent }}
              />

              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <div
                    className="font-mono text-4xl sm:text-5xl font-black tracking-tight"
                    style={{ color: criterion.accent }}
                  >
                    {criterion.percentage}
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 font-bold">
                    WEIGHT
                  </span>
                </div>

                {/* Static Progress Bar Indicator */}
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: criterion.percentage,
                      backgroundColor: criterion.accent,
                    }}
                  />
                </div>

                <h4 className="text-lg font-bold text-white mb-2 tracking-tight">
                  {criterion.title}
                </h4>
                <p className="text-xs text-zinc-300 leading-relaxed font-light">
                  {criterion.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-1.5">
                  {criterion.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.06] text-zinc-300 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Part 3: Interactive Anti-Cheat & Fair-Play Protocols */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-6 font-semibold flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
            <span className="font-bold text-zinc-200">FAIR-PLAY & INTEGRITY PROTOCOLS</span>
          </div>
          <span className="text-zinc-400 hidden sm:inline">Click any protocol to inspect validation command</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {antiCheatRules.map((rule, idx) => {
            const Icon = rule.icon;
            const isExpanded = activeProtocolIdx === idx;
            return (
              <motion.div
                key={idx}
                onClick={() => setActiveProtocolIdx(isExpanded ? null : idx)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 cursor-pointer border-2 ${isExpanded
                  ? "bg-[#0A0B14] border-white/40 ring-1 ring-white/20 shadow-xl"
                  : "bg-[#030408] border-white/15 hover:border-white/30"
                  }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl border-2"
                      style={{
                        borderColor: `${rule.accent}50`,
                        backgroundColor: `${rule.accent}15`,
                        color: rule.accent,
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className="font-mono text-[10px] font-black uppercase tracking-wider"
                      style={{ color: rule.accent }}
                    >
                      {rule.code}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-400 hover:text-white font-bold">
                    {isExpanded ? "Hide Test" : "Inspect Check ↗"}
                  </span>
                </div>

                <h5 className="text-base font-bold text-white mb-2">
                  {rule.title}
                </h5>

                <p className="text-xs text-zinc-300 leading-relaxed font-normal">
                  {rule.detail}
                </p>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-white/10 font-mono text-[11px] space-y-1.5 text-zinc-300 bg-black/60 p-3 rounded-xl border border-white/10">
                    <div className="text-zinc-400">$ {rule.terminalCmd}</div>
                    <div className="text-emerald-400 font-bold">✓ {rule.terminalExpected}</div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default RulesSection;
