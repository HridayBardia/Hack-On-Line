"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileCode, Globe } from "lucide-react";
import { RubricMatrix } from "./RubricMatrix";

export function RulesSection() {
  const [activeProtocolIdx, setActiveProtocolIdx] = useState<number | null>(null);

  const evaluationCriteria = [
    { percentage: "35%", title: "Technical Architecture & Code Depth", summary: "Clean structure, type safety, state management and API design." },
    { percentage: "30%", title: "Production Execution & Live Utility", summary: "The live app works end to end and recovers from errors." },
    { percentage: "20%", title: "UI/UX Polish & Usability", summary: "Responsive, clear and smooth on mobile and desktop." },
    { percentage: "15%", title: "Problem Originality & Value", summary: "A distinct angle that solves a real problem." },
  ];

  const antiCheatRules = [
    {
      code: "PROTOCOL 01",
      title: "Fresh Commit Verification",
      icon: FileCode,
      accent: "#02E2F8",
      detail:
        "Any Git repository containing commits made before January 30, 2027, 10:00 AM IST is flagged and disqualified to ensure 100% fair play.",
      terminalCmd: "git log --reverse --format='%h %ad' | head -n 1",
      terminalExpected: "First commit timestamp >= 2027-01-30T10:00:00 IST",
    },
    {
      code: "PROTOCOL 02",
      title: "Mandatory Public Deployment",
      icon: Globe,
      accent: "#8CFFA8",
      detail:
        "Every submission must have a publicly reachable production URL (Vercel, AWS, Fly.io, Cloudflare, etc.). Localhost-only screen recordings will not be evaluated.",
      terminalCmd: "curl -s -o /dev/null -w '%{http_code}' https://team-sub.live",
      terminalExpected: "HTTP 200 OK across international edge gateways",
    },
    {
      code: "PROTOCOL 03",
      title: "100% Builder IP Freedom",
      icon: ShieldCheck,
      accent: "#27F657",
      detail:
        "You retain 100% unencumbered ownership of your code, models, and intellectual property. Hack On-Line takes 0% equity and 0% rights.",
      terminalCmd: "cat LICENSE.md | grep -i 'copyright (c)'",
      terminalExpected: "100% registered to builder team. 0% organizer claim.",
    },
  ];

  return (
    <section
      id="rules"
      aria-label="Judging Rubrics"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-20 sm:pb-32 scroll-mt-28 select-none relative z-10 overflow-x-clip"
    >
      <RubricMatrix criteria={evaluationCriteria} />

      {/* Interactive Anti-Cheat & Fair-Play Protocols */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-6 font-semibold flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse" />
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
                viewport={{ once: false, amount: 0.2 }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`p-6 sm:p-7 rounded-3xl transition-all duration-300 cursor-pointer border-2 ${isExpanded
                  ? "bg-[#151A1E] border-white/40 ring-1 ring-white/20 shadow-xl"
                  : "bg-[#0A0D0F] border-white/15 hover:border-white/30"
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
                    <div className="text-zinc-400 break-all">$ {rule.terminalCmd}</div>
                    <div className="text-brand-green font-bold break-words">✓ {rule.terminalExpected}</div>
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
