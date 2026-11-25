"use client";

import React, { useState, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Lock,
  Zap,
  HeartPulse,
  Leaf,
  Radio,
  X,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export interface TrackData {
  id: string;
  number: string;
  title: string;
  category: string;
  shortTag: string;
  core: string;
  accent: string;
  icon: LucideIcon;
  techFocus: string[];
  sampleHypotheses: string[];
}

export function TracksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [selectedModalTrack, setSelectedModalTrack] = useState<TrackData | null>(null);

  const tracks: TrackData[] = [
    {
      id: "track-01",
      number: "01",
      title: "Precision Agriculture, Sensor Meshes & Crop Intelligence",
      category: "AGRICULTURE & AGTECH",
      shortTag: "Agriculture",
      accent: "#10B981",
      core: "Precision soil sensor telemetry, automated irrigation dispatch, computer vision crop disease diagnostics, drone payload telemetry, and climate-resilient yield optimization algorithms.",
      icon: Leaf,
      techFocus: [
        "Edge IoT Sensor Meshes (MQTT / LoRaWAN)",
        "Computer Vision Crop Pathogen Diagnostics",
        "Micro-Climate & Soil Moisture Telemetry",
        "Satellite NDVI Biomass Mapping",
      ],
      sampleHypotheses: [
        "Autonomous offline-first crop pest identifier running lightweight MobileNet locally",
        "Dynamic solar-powered drip irrigation scheduler based on soil water tension",
        "Decentralized peer-to-peer grain warehouse cold-chain telemetry broker",
      ],
    },
    {
      id: "track-02",
      number: "02",
      title: "Clinical Intelligence, Healthcare Systems & Bio-Computing",
      category: "MEDICAL & HEALTH",
      shortTag: "Medical",
      accent: "#EC4899",
      core: "Point-of-care clinical diagnostics, on-device biometric signal processing, privacy-preserving patient records, genomic anomaly detection, and real-time medical triage pipelines.",
      icon: HeartPulse,
      techFocus: [
        "FHIR & HL7 Secure Clinical Data Adapters",
        "Edge Signal DSP (ECG / PPG / EEG Telemetry)",
        "Privacy-Preserving Federated Medical Models",
        "Point-of-Care Diagnostic Decision Support",
      ],
      sampleHypotheses: [
        "On-device real-time ECG arrhythmia classification using quantised TensorFlow Lite",
        "Privacy-preserving emergency room intake triage with automated severity scoring",
        "Decentralized verifiable organ match and transplant telemetry audit ledger",
      ],
    },
    {
      id: "track-03",
      number: "03",
      title: "Orbital Mechanics, Aerospace Telemetry & Satellite Compute",
      category: "SPACE & AEROSPACE",
      shortTag: "Space",
      accent: "#06B6D4",
      core: "CubeSat flight computer architectures, orbital trajectory prediction, open space debris tracking, delay-tolerant satellite mesh communications, and hyperspectral Earth observation pipelines.",
      icon: Radio,
      techFocus: [
        "Delay-Tolerant Networking (DTN / Bundle Protocol)",
        "Orbital Mechanics & SGP4 Ephemeris Propagation",
        "On-Board Edge AI for Hyperspectral Imaging",
        "Low-Power Embedded Flight Controllers (Rust/RTOS)",
      ],
      sampleHypotheses: [
        "Autonomous low-Earth-orbit collision avoidance and conjunction assessment engine",
        "Distributed ground station network scheduler for open CubeSat telemetry reception",
        "Real-time orbital synthetic aperture radar (SAR) flood inundation mapper",
      ],
    },
    {
      id: "track-04",
      number: "04",
      title: "Decentralized Protocols, Zero-Knowledge & Cryptographic Privacy",
      category: "CRYPTO & PRIVACY",
      shortTag: "Crypto and Privacy",
      accent: "#8B5CF6",
      core: "High-integrity verifiable computation, zero-knowledge proofs, privacy-preserving rollups, decentralized identity schemes, encrypted state transitions, and trust-minimized peer-to-peer protocols.",
      icon: Lock,
      techFocus: [
        "Zero-Knowledge Circuit Synthesis (Circom / Noir)",
        "Decentralized Identity & Account Abstraction",
        "State Proofs & Trustless Cross-Chain Relays",
        "Encrypted Mempools & MEV Mitigation",
      ],
      sampleHypotheses: [
        "Zk-SNARK credential gate for anonymous open-source bounties & audits",
        "Encrypted peer-to-peer code escrow with automated smart contract release",
        "Verifiable cryptographic random beacon for decentralized judging allocations",
      ],
    },
    {
      id: "track-05",
      number: "05",
      title: "Clean Tech, Green Energy Grids & Planetary Systems",
      category: "CLEAN & GREEN TECH",
      shortTag: "Clean and green tech",
      accent: "#F59E0B",
      core: "Renewable energy demand-response dispatch, distributed micro-grid load balancing, real-time carbon intensity telemetry, circular waste stream routing, and planetary sensor meshes.",
      icon: Zap,
      techFocus: [
        "Time-Series Telemetry & Smart Inverter MQTT",
        "Grid Peak-Load Balancing & Storage Dispatch",
        "Real-time Marginal Carbon Emissions API Ingest",
        "Autonomous Industrial Waste Heat Recovery Telemetry",
      ],
      sampleHypotheses: [
        "Dynamic compute scheduler routing heavy computational jobs to green grid surplus hours",
        "Local micro-solar peer-to-peer power trade and storage balancing simulator",
        "Satellite and thermal sensor-assisted urban heat island mitigation router",
      ],
    },
  ];

  useEffect(() => {
    if (typeof window === "undefined") return;

    const section = sectionRef.current;
    const trackTrack = trackTrackRef.current;
    if (!section || !trackTrack) return;

    // Only apply horizontal scroll on screens >= 768px (tablets and desktops)
    const isDesktop = window.innerWidth >= 768;
    if (!isDesktop) return;

    let cachedDistance = Math.max(100, trackTrack.scrollWidth - window.innerWidth + 160);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: () => `+=${cachedDistance}`,
        pin: true,
        scrub: 0.8,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => {
          cachedDistance = Math.max(100, trackTrack.scrollWidth - window.innerWidth + 160);
        },
        onUpdate: (self) => {
          // Hardware-accelerated GPU translation without querying scrollWidth in the render loop
          trackTrack.style.transform = `translate3d(${-self.progress * cachedDistance}px, 0, 0)`;

          // Fill progress bar
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${(self.progress * 100).toFixed(1)}%`;
          }

          // Live track indicator
          if (counterRef.current) {
            const idx = Math.min(4, Math.floor(self.progress * 5));
            counterRef.current.innerText = `0${idx + 1} / 05`;
          }
        },
      });

      // Refresh ScrollTrigger after initial render to lock in exact dimensions
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tracks"
      aria-label="5 Problem Tracks"
      className="relative w-full min-h-screen bg-[#050508] text-white overflow-hidden"
    >
      {/* Sticky Fullscreen Container */}
      <div className="relative w-full h-screen flex flex-col justify-between py-6 sm:py-8 px-4 sm:px-10 overflow-hidden">

        {/* Top Header & Telemetry Bar */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10 shrink-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>02 // HORIZONTAL ARENA SECTORS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
              <span>5 Problem Tracks</span>
              <span className="hidden sm:inline-block text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-white/10 border border-white/15 text-zinc-300">
                LOCKED UNTIL T-15M
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                TRACK POSITION
              </div>
              <span
                ref={counterRef}
                className="text-lg sm:text-xl font-black font-mono text-cyan-400 tracking-tight"
              >
                01 / 05
              </span>
            </div>

            {/* Glowing Laser Progress Bar */}
            <div className="w-32 sm:w-48 h-2 rounded-full bg-white/10 overflow-hidden border border-white/15">
              <div
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 transition-all duration-75 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                style={{ width: "20%" }}
              />
            </div>
          </div>
        </div>

        {/* Center Horizontal Ribbon of All 5 Tracks */}
        <div className="relative z-10 w-full flex items-center my-auto overflow-x-auto sm:overflow-visible no-scrollbar py-4">
          <div
            ref={trackTrackRef}
            className="flex items-center gap-6 sm:gap-8 px-4 sm:px-8 shrink-0"
          >
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="w-[320px] sm:w-[440px] h-[450px] sm:h-[490px] shrink-0 luxury-card rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative group select-none overflow-hidden transition-all duration-300 hover:border-white/30"
                >
                  {/* Giant Watermark Track Number */}
                  <span className="pointer-events-none absolute -bottom-6 -right-3 text-[140px] sm:text-[180px] font-black font-mono text-white/[0.03] select-none leading-none group-hover:text-white/[0.06] transition-colors">
                    {track.number}
                  </span>

                  {/* Corner Accent Glow */}
                  <div
                    className="absolute -top-12 -right-12 w-44 h-44 rounded-full blur-3xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{ backgroundColor: track.accent }}
                  />

                  {/* Card Header */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="text-[10px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-md border font-bold"
                        style={{
                          borderColor: `${track.accent}45`,
                          backgroundColor: `${track.accent}15`,
                          color: track.accent,
                        }}
                      >
                        {track.category}
                      </span>
                      <span className="text-xs font-mono font-bold text-zinc-500">
                        TRACK #{track.number}
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-white">
                      {track.title}
                    </h3>

                    <p className="mt-3 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed line-clamp-3">
                      {track.core}
                    </p>
                  </div>

                  {/* Tech Focus Chips */}
                  <div className="my-auto py-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-2 font-semibold">
                      ARCHITECTURAL FOCUS
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {track.techFocus.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-5 h-5 text-zinc-400 group-hover:scale-110 transition-transform"
                        style={{ color: track.accent }}
                      />
                      <span className="text-xs font-mono text-zinc-400">
                        Fresh Commits Only
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedModalTrack(track)}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white text-xs font-bold text-white hover:text-black transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Explore</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Horizontal Guidance Bar */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-white/10 shrink-0 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono">
              SCROLL DOWN TO GLIDE HORIZONTALLY · TRANSITIONS TO 24H TIMELINE AT TRACK 05
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {tracks.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setSelectedModalTrack(t)}
                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                {t.number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Track Detail Modal */}
      {selectedModalTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl luxury-card p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
            <button
              onClick={() => setSelectedModalTrack(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-mono font-bold px-2.5 py-1 rounded uppercase tracking-wider"
                style={{
                  backgroundColor: `${selectedModalTrack.accent}20`,
                  color: selectedModalTrack.accent,
                }}
              >
                TRACK #{selectedModalTrack.number} {"//"} {selectedModalTrack.category}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {selectedModalTrack.title}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-zinc-300 font-light leading-relaxed">
              {selectedModalTrack.core}
            </p>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-bold mb-3">
                SAMPLE PROBLEM HYPOTHESES
              </div>
              <ul className="space-y-2">
                {selectedModalTrack.sampleHypotheses.map((hypo, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-zinc-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 shrink-0" />
                    <span>{hypo}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between">
              <div className="text-xs font-mono text-zinc-400">
                Evaluation: Git Timestamps + Live URL
              </div>
              <button
                onClick={() => setSelectedModalTrack(null)}
                className="px-5 py-2.5 rounded-xl bg-white text-zinc-950 font-bold text-xs hover:bg-zinc-200 transition-colors cursor-pointer"
              >
                Close Protocol
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default TracksSection;
