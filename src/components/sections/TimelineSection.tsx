"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  Unlock,
  Play,
  Share2,
  Moon,
  Lock,
  Tv,
  Award,
  Terminal,
  type LucideIcon,
} from "lucide-react";

interface Milestone {
  id: string;
  time: string;
  date: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tag: string;
  accent: string;
  highlight?: boolean;
}

export function TimelineSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 65%", "end 75%"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  const milestones: Milestone[] = [
    {
      id: "m-01",
      date: "30 JAN 2027",
      time: "09:45 AM IST",
      title: "5 Problem Tracks Decryption",
      description:
        "Granular challenge rubrics, evaluation edge cases, and sample API contracts decrypt simultaneously on the Unstop portal and live platform.",
      icon: Unlock,
      tag: "T-MINUS 15M",
      accent: "#FF8C66",
      highlight: true,
    },
    {
      id: "m-02",
      date: "30 JAN 2027",
      time: "10:00 AM IST",
      title: "Sprint Kickoff & Genesis Commits",
      description:
        "Hacking starts worldwide. Repositories must initialize after this timestamp. The official 24-hour sprint clock starts ticking.",
      icon: Play,
      tag: "KICKOFF",
      accent: "#10B981",
      highlight: true,
    },
    {
      id: "m-03",
      date: "30 JAN 2027",
      time: "06:00 PM IST",
      title: "Checkpoint 01: Architecture Sync",
      description:
        "Teams publish component schemas, API structures, and repo links for intermediate peer checks.",
      icon: Share2,
      tag: "+8 HOURS",
      accent: "#06B6D4",
    },
    {
      id: "m-04",
      date: "31 JAN 2027",
      time: "02:00 AM IST",
      title: "The Midnight Push & Office Hours",
      description:
        "Dedicated mentor office hours open for production debugging, architecture guidance, and pipeline triage.",
      icon: Moon,
      tag: "+16 HOURS",
      accent: "#8B5CF6",
    },
    {
      id: "m-05",
      date: "31 JAN 2027",
      time: "10:00 AM IST",
      title: "Official Code Freeze & Submission Deadline",
      description:
        "Git trees locked. Submissions close on Unstop. Live deployment URLs and 2-minute walkthrough links are archived for review.",
      icon: Lock,
      tag: "CODE FREEZE",
      accent: "#EF4444",
      highlight: true,
    },
    {
      id: "m-06",
      date: "31 JAN 2027",
      time: "11:30 AM IST",
      title: "Round 1: Preliminary Top 10 Shortlisting",
      description:
        "Our review panel of Tech & Software Industry Experts audits all registered repositories, commit histories, and deployed cloud URLs to select the Top 10 Finalist Teams.",
      icon: Terminal,
      tag: "ROUND 1 // TOP 10",
      accent: "#8B5CF6",
      highlight: true,
    },
    {
      id: "m-07",
      date: "31 JAN 2027",
      time: "04:30 PM IST",
      title: "Round 2: Championship Final Stage",
      description:
        "The Top 10 finalist teams present live demonstrations before our review board of Tech & Software Industry Experts for architectural evaluation and defense.",
      icon: Tv,
      tag: "ROUND 2 // FINALS",
      accent: "#06B6D4",
      highlight: true,
    },
    {
      id: "m-08",
      date: "31 JAN 2027",
      time: "06:30 PM IST",
      title: "Awards & Recognition Ceremony",
      description:
        "Top engineering teams announced across all 5 problem tracks. Digital proof-of-work credentials and perks dispatched to qualifying squads.",
      icon: Award,
      tag: "AWARDS",
      accent: "#10B981",
    },
  ];

  return (
    <section
      id="timeline"
      aria-label="24-Hour Timeline"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 scroll-mt-28 select-none relative z-10"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-white/10 gap-4 mb-16"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span>03 // EXECUTION PIPELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            24-Hour Schedule
          </h2>
        </div>
        <p className="text-sm text-zinc-300 max-w-sm sm:text-right font-normal">
          Strict chronological milestones from problem decryption to the final championship review.
        </p>
      </motion.div>

      {/* Illuminated Laser Trace Pipeline */}
      <div ref={containerRef} className="relative pl-6 sm:pl-10 space-y-12 sm:space-y-16">
        {/* Base Timeline Track */}
        <div className="absolute left-[7px] sm:left-[15px] top-3 bottom-3 w-0.5 bg-white/10" />

        {/* Scroll-Linked Laser Trace Beam */}
        <motion.div
          style={{ scaleY, transformOrigin: "top" }}
          className="absolute left-[7px] sm:left-[15px] top-3 bottom-3 w-0.5 bg-gradient-to-b from-[#FF8C66] via-[#06B6D4] to-[#10B981] shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        />

        {milestones.map((milestone, idx) => {
          const Icon = milestone.icon;
          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, x: -28 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative group"
            >
              {/* Glowing Pulse Dot on the line */}
              <div
                className="absolute -left-[30px] sm:-left-[46px] top-1.5 w-4 h-4 rounded-full border-2 transition-all shadow-md z-10"
                style={{
                  backgroundColor: milestone.accent,
                  borderColor: milestone.highlight ? "#FFFFFF" : milestone.accent,
                  boxShadow: milestone.highlight
                    ? `0 0 18px ${milestone.accent}, 0 0 6px #FFFFFF`
                    : `0 0 10px ${milestone.accent}80`,
                }}
              >
                {milestone.highlight && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping opacity-60"
                    style={{ backgroundColor: milestone.accent }}
                  />
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2.5">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs sm:text-sm font-black text-white tracking-wider px-3.5 py-1.5 rounded-xl bg-black border-2 border-cyan-400 shadow-[0_0_16px_rgba(6,182,212,0.6)] flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>{milestone.time}</span>
                  </span>
                  <span className="text-xs text-white font-mono font-bold px-2 py-0.5 rounded bg-white/10 border border-white/15">
                    {milestone.date}
                  </span>
                </div>
                <span
                  className="font-mono text-[10px] font-bold px-2.5 py-0.5 rounded-full border self-start sm:self-auto tracking-wider uppercase"
                  style={{
                    borderColor: `${milestone.accent}40`,
                    backgroundColor: `${milestone.accent}15`,
                    color: milestone.accent,
                  }}
                >
                  {milestone.tag}
                </span>
              </div>

              <div className="luxury-card p-6 sm:p-7 rounded-3xl group-hover:border-white/30 transition-all hover:translate-x-1 duration-300">
                <div className="flex items-start gap-4">
                  <div
                    className="p-3 rounded-2xl border shrink-0 mt-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{
                      borderColor: `${milestone.accent}40`,
                      backgroundColor: `${milestone.accent}15`,
                      color: milestone.accent,
                    }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 text-sm text-zinc-300 leading-relaxed font-normal">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
