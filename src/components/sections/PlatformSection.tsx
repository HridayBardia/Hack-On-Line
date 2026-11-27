"use client";

import React, { useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import {
    Cpu,
    ShieldCheck,
    GitBranch,
    Zap,
    CheckCircle2,
    Binary,
    type LucideIcon,
} from "lucide-react";

interface EngineCore {
    id: string;
    code: string;
    tag: string;
    title: string;
    subtitle: string;
    accent: string;
    glow: string;
    icon: LucideIcon;
    metric: string;
    metricLabel: string;
    description: string;
    architecturePoints: string[];
    terminalData: {
        command: string;
        runtimeOutputs: Array<{ text: string; color: string }>;
    };
}

export function PlatformSection() {
    const containerRef = useRef<HTMLElement>(null);
    const [activeEngineIdx, setActiveEngineIdx] = useState(0);

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    // 3D perspective scroll kinematics (Signature Lenis & Hack The North effect)
    const perspectiveRotateX = useTransform(scrollYProgress, [0, 0.45, 0.9], [12, 0, -8]);
    const perspectiveScale = useTransform(scrollYProgress, [0, 0.45, 0.9], [0.93, 1, 0.96]);
    const perspectiveOpacity = useTransform(scrollYProgress, [0, 0.2, 0.85, 1], [0.3, 1, 1, 0.4]);

    const smoothRotateX = useSpring(perspectiveRotateX, { stiffness: 180, damping: 28 });
    const smoothScale = useSpring(perspectiveScale, { stiffness: 180, damping: 28 });

    const engines: EngineCore[] = [
        {
            id: "engine-02",
            code: "ENGINE_02 // SPRINT_INTEGRITY",
            tag: "ORIGINAL CODE ONLY",
            title: "Fresh Commits & Fair Play",
            subtitle: "Verification that every project is built fresh during the 24-hour sprint",
            accent: "#8B5CF6",
            glow: "rgba(139, 92, 246, 0.4)",
            icon: GitBranch,
            metric: "100%",
            metricLabel: "FRESH CODE CHECK",
            description:
                "No recycled projects or pre-built templates. We inspect repository commit history and timestamps to guarantee all code was written within the hackathon window. Fair and equal for all builders.",
            architecturePoints: [
                "First commit must be made after the official sprint kickoff at 10:00 AM IST",
                "Commit history checked to ensure genuine, iterative progress during the 24 hours",
                "Zero recycled codebases or pre-existing templates allowed in final submissions",
            ],
            terminalData: {
                command: "git log --since='2027-01-30 10:00:00' --stat",
                runtimeOutputs: [
                    { text: "➔ Checking repository commit timestamps & author log...", color: "text-zinc-400" },
                    { text: "➔ Natural commit progress detected across 24h sprint window", color: "text-violet-300" },
                    { text: "✔ First commit: 2027-01-30 10:04:12 IST (Created after kickoff)", color: "text-emerald-400" },
                    { text: "✔ Zero pre-existing commits detected before start time", color: "text-cyan-300" },
                    { text: "✔ Steady commit history: Authentic team collaboration", color: "text-amber-300" },
                    { text: "★ VERDICT: 100% SPRINT-NATIVE ORIGINAL PROJECT", color: "text-white font-bold" },
                ],
            },
        },
        {
            id: "engine-03",
            code: "ENGINE_03 // PEER_MATRIX",
            tag: "EVALUATION RIGOR",
            title: "Active Industry Peer Review Grid",
            subtitle: "Evaluated by software engineers who ship code daily",
            accent: "#06B6D4",
            glow: "rgba(6, 182, 212, 0.4)",
            icon: Cpu,
            metric: "Stage 01",
            metricLabel: "DIRECT CODE AUDIT",
            description:
                "No marketing pitch-theater or non-technical decks. Stage 01 evaluation is conducted by practicing engineers and infrastructure leads inspecting component architecture, schemas, and API contracts.",
            architecturePoints: [
                "Graded on 4 technical axes: Architecture (30%), Functionality (30%), Code Craft (25%), Security (15%)",
                "Engineers clone, test-drive, and review PR branches directly",
                "Comprehensive feedback provided directly on technical execution",
            ],
            terminalData: {
                command: "run-peer-eval --pr=24 --auditors=staff-infra-panel --depth=full",
                runtimeOutputs: [
                    { text: "➔ Assigning PR #24 to Staff Infrastructure Panel...", color: "text-zinc-400" },
                    { text: "➔ Inspecting TypeScript typings, database indices & error handling...", color: "text-cyan-400" },
                    { text: "✔ Type coverage: 99.4% (Zero explicit 'any' escapes detected)", color: "text-emerald-400" },
                    { text: "✔ SQL connection pooling & parameterized query checks: PASSED", color: "text-cyan-300" },
                    { text: "✔ Security review: Strict CSP headers, CORS isolation verified", color: "text-violet-300" },
                    { text: "★ AUDIT SCORE: 94.5/100 -> QUALIFIED FOR TOP 5 DEFENSE", color: "text-emerald-400 font-bold" },
                ],
            },
        },
        {
            id: "engine-04",
            code: "ENGINE_04 // DEFENSE_ARENA",
            tag: "STAGE 02 INTERROGATION",
            title: "Live Defense Interrogation Matrix",
            subtitle: "Top 5 teams undergo live architectural cross-examination",
            accent: "#FF8C66",
            glow: "rgba(255, 140, 102, 0.4)",
            icon: Zap,
            metric: "Stage 02",
            metricLabel: "LIVE DEFENSE",
            description:
                "Top 5 qualifying finalists enter the Stage 02 virtual defense room: a 5-minute live demo followed by 5 minutes of intensive technical cross-examination by our senior industry judging panel.",
            architecturePoints: [
                "Real-time stress questions on failure scenarios, scalability & edge cases",
                "Defend trade-offs, architecture choices, and database access patterns",
                "Transparent real-time rubrics calculated live in front of the community",
            ],
            terminalData: {
                command: "initiate-stage-02-defense --session=top-5-finalists --interrogation=live",
                runtimeOutputs: [
                    { text: "➔ Connecting live video link to Senior Industry Judging Panel...", color: "text-zinc-400" },
                    { text: "➔ Finalist team presents 5M live production screen share...", color: "text-amber-300" },
                    { text: "➔ Judge question: 'How does your state sync handle split-brain partitions?'", color: "text-rose-400 font-bold" },
                    { text: "➔ Finalist demonstrates CRDT deterministic conflict resolution live", color: "text-cyan-300" },
                    { text: "✔ Technical Defense Verdict: Highly proficient architectural rigor", color: "text-emerald-400" },
                    { text: "★ FINAL STANDING: HACK ON-LINE 2027 OVERALL WINNER", color: "text-amber-400 font-bold" },
                ],
            },
        },
    ];

    const currentEngine = engines[activeEngineIdx];

    return (
        <section
            id="platform"
            ref={containerRef}
            aria-label="Platform Architecture Engines"
            className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-24 sm:pt-44 sm:pb-32 overflow-hidden z-10"
            style={{ perspective: "1200px" }}
        >
            {/* 3D Perspective Animated Shell */}
            <motion.div
                style={{
                    rotateX: smoothRotateX,
                    scale: smoothScale,
                    opacity: perspectiveOpacity,
                    transformStyle: "preserve-3d",
                }}
                className="relative will-change-transform"
            >
                {/* Section Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-white/10 gap-6 mb-10">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2.5">
                            <span className="size-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                            <span>03 // DISTRIBUTED RUNTIME ARCHITECTURE</span>
                        </div>
                        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white">
                            The Hack On-Line Platform
                        </h2>
                        <p className="mt-3 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
                            Most hackathons evaluate vanity slide decks. Every project must be live on a public URL. Our judges review deployed projects manually.
                        </p>
                    </div>

                    {/* Quick Engine Counter Badge */}
                    <div className="flex items-center gap-3 p-2 rounded-2xl bg-zinc-950/80 border border-white/15 backdrop-blur-2xl shadow-xl shrink-0">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono font-bold text-zinc-300">
                            <Binary className="size-3.5 text-cyan-400" />
                            <span>3 CORE ENGINES</span>
                        </div>
                    </div>
                </div>

                {/* Engine Selection Tabs (Cybernetic Tab Matrix) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                    {engines.map((eng, idx) => {
                        const Icon = eng.icon;
                        const isSelected = activeEngineIdx === idx;
                        return (
                            <button
                                key={eng.id}
                                type="button"
                                onClick={() => setActiveEngineIdx(idx)}
                                className={`relative flex flex-col p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer border ${isSelected
                                    ? "bg-zinc-900/90 border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.8)] scale-[1.02] ring-1 ring-white/20"
                                    : "bg-zinc-950/50 border-white/10 hover:border-white/20 hover:bg-zinc-900/40"
                                    }`}
                            >
                                {/* Active Indicator Top Glow */}
                                {isSelected && (
                                    <motion.div
                                        layoutId="activeEngineTab"
                                        className="absolute inset-x-0 top-0 h-[3px] rounded-t-2xl"
                                        style={{ backgroundColor: eng.accent, boxShadow: `0 0 16px ${eng.accent}` }}
                                    />
                                )}

                                <div className="flex items-center justify-between mb-3">
                                    <span
                                        className="size-8 rounded-xl flex items-center justify-center border"
                                        style={{
                                            backgroundColor: `${eng.accent}15`,
                                            borderColor: `${eng.accent}40`,
                                            color: eng.accent,
                                        }}
                                    >
                                        <Icon className="size-4" />
                                    </span>
                                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/5 text-zinc-400 border border-white/10">
                                        {eng.metric}
                                    </span>
                                </div>

                                <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-bold mb-0.5">
                                    {eng.tag}
                                </span>
                                <span className="text-sm sm:text-base font-bold text-white tracking-tight line-clamp-1">
                                    {eng.title.split(" ")[0]} {eng.title.split(" ")[1]}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Main Cockpit Display: Split-Screen Interactive Console */}
                <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-zinc-950/90 via-zinc-900/60 to-zinc-950/90 p-4 sm:p-8 backdrop-blur-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] overflow-hidden">
                    {/* Subtle Cyber Grid & Radar Lines */}
                    <div className="absolute inset-0 bg-circuit-grid opacity-30 pointer-events-none" />

                    {/* Holographic Ambient Glow */}
                    <div
                        className="absolute top-0 right-0 w-96 h-96 rounded-full blur-[120px] pointer-events-none transition-colors duration-700"
                        style={{ backgroundColor: `${currentEngine.accent}20` }}
                    />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        {/* Left Console: Engine Spec & Architectural Principles */}
                        <div className="lg:col-span-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="size-2 rounded-full animate-ping"
                                        style={{ backgroundColor: currentEngine.accent }}
                                    />
                                    <span
                                        className="text-xs font-mono font-bold tracking-widest uppercase"
                                        style={{ color: currentEngine.accent }}
                                    >
                                        {currentEngine.code}
                                    </span>
                                </div>

                                <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                                    {currentEngine.title}
                                </h3>
                                <p className="mt-2 text-sm sm:text-base font-medium text-cyan-300">
                                    {currentEngine.subtitle}
                                </p>

                                <p className="mt-4 text-xs sm:text-sm text-zinc-300 leading-relaxed font-light">
                                    {currentEngine.description}
                                </p>

                                {/* Architectural Rigor List */}
                                <div className="mt-6 space-y-2.5">
                                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold block mb-1">
                                        SYSTEM SPECIFICATIONS & ASSERTIONS
                                    </span>
                                    {currentEngine.architecturePoints.map((pt, i) => (
                                        <div
                                            key={i}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all"
                                        >
                                            <CheckCircle2
                                                className="size-4 shrink-0 mt-0.5"
                                                style={{ color: currentEngine.accent }}
                                            />
                                            <span className="text-xs text-zinc-200 leading-relaxed font-medium">
                                                {pt}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Operational Status Badges (Clean & Authoritative) */}
                            <div className="mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center gap-3">
                                <div
                                    className="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-mono font-bold"
                                    style={{
                                        backgroundColor: `${currentEngine.accent}15`,
                                        borderColor: `${currentEngine.accent}40`,
                                        color: currentEngine.accent,
                                    }}
                                >
                                    <span className="size-2 rounded-full animate-pulse" style={{ backgroundColor: currentEngine.accent }} />
                                    <span>{currentEngine.metricLabel}: {currentEngine.metric}</span>
                                </div>

                                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                                    <ShieldCheck className="size-3.5 text-emerald-400" />
                                    <span>PRODUCTION RUNTIME VERIFIED</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Console: Live Diagnostic Console */}
                        <div className="lg:col-span-6 w-full">
                            <div className="rounded-2xl border border-white/20 bg-black/80 shadow-[0_16px_50px_rgba(0,0,0,0.9)] overflow-hidden font-mono">
                                {/* Terminal Window Chrome */}
                                <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/90 border-b border-white/10">
                                    <div className="flex items-center gap-2">
                                        <span className="size-2.5 rounded-full bg-rose-500/80" />
                                        <span className="size-2.5 rounded-full bg-amber-500/80" />
                                        <span className="size-2.5 rounded-full bg-emerald-500/80" />
                                        <span className="ml-2 text-[10px] text-zinc-400 font-medium truncate">
                                            hackonline-runtime // {currentEngine.id}
                                        </span>
                                    </div>
                                    <span className="text-[9px] uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-400 border border-white/10">
                                        STAGE AUDIT CONSOLE
                                    </span>
                                </div>

                                {/* Terminal Command Prompt */}
                                <div className="p-4 sm:p-5 text-xs">
                                    <div className="flex items-start gap-2 text-zinc-400 pb-3 border-b border-white/10 mb-4 break-all">
                                        <span className="text-emerald-400 font-bold shrink-0">$</span>
                                        <span className="text-zinc-200 font-bold break-all">{currentEngine.terminalData.command}</span>
                                    </div>

                                    {/* Terminal Outputs (Direct Static High-Tech Render) */}
                                    <div className="space-y-2 min-h-[220px]">
                                        {currentEngine.terminalData.runtimeOutputs.map((line, idx) => (
                                            <div
                                                key={idx}
                                                className="flex items-start gap-2"
                                            >
                                                <span className="text-zinc-600 select-none text-[10px]">
                                                    {String(idx + 1).padStart(2, "0")}
                                                </span>
                                                <span className={`text-xs leading-relaxed ${line.color}`}>
                                                    {line.text}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}
export default PlatformSection;
