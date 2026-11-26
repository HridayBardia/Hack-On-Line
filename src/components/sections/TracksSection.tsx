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
  ChevronLeft,
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackTrackRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [selectedModalTrack, setSelectedModalTrack] = useState<TrackData | null>(null);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

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

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      let cachedDistance = Math.max(100, trackTrack.scrollWidth - window.innerWidth + 160);

      const trigger = ScrollTrigger.create({
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
          trackTrack.style.transform = `translate3d(${-self.progress * cachedDistance}px, 0, 0)`;

          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${(self.progress * 100).toFixed(1)}%`;
          }

          if (counterRef.current) {
            const idx = Math.min(4, Math.floor(self.progress * 5));
            counterRef.current.innerText = `0${idx + 1} / 05`;
            setActiveTrackIndex(idx);
          }
        },
      });

      return () => {
        trigger.kill();
        trackTrack.style.transform = "";
      };
    });

    return () => mm.revert();
  }, []);

  const handleMobileScroll = () => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;
    const container = scrollContainerRef.current;
    if (!container) return;
    const scrollLeft = container.scrollLeft;
    const card = container.querySelector(".track-card") as HTMLElement | null;
    if (!card) return;
    const cardWidth = card.offsetWidth + 16;
    const idx = Math.min(tracks.length - 1, Math.max(0, Math.round(scrollLeft / cardWidth)));
    if (idx !== activeTrackIndex) {
      setActiveTrackIndex(idx);
      if (counterRef.current) {
        counterRef.current.innerText = `0${idx + 1} / 05`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${((idx + 1) / 5) * 100}%`;
      }
    }
  };

  const scrollToTrack = (index: number) => {
    setActiveTrackIndex(index);
    if (counterRef.current) {
      counterRef.current.innerText = `0${index + 1} / 05`;
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${((index + 1) / 5) * 100}%`;
    }
    if (typeof window !== "undefined" && window.innerWidth < 768 && scrollContainerRef.current) {
      const cards = scrollContainerRef.current.querySelectorAll<HTMLElement>(".track-card");
      if (cards[index]) {
        cards[index].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    } else {
      setSelectedModalTrack(tracks[index]);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="tracks"
      aria-label="5 Problem Tracks"
      className="relative w-full min-h-screen bg-[#050508] text-white overflow-hidden"
    >
      {/* Sticky Fullscreen Container */}
      <div className="relative w-full min-h-dvh sm:h-[100dvh] flex flex-col justify-between py-4 sm:py-8 px-0 sm:px-10 overflow-hidden">

        {/* Top Header & Telemetry Bar */}
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-white/10 shrink-0 px-4 sm:px-0">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1">
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

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            {/* Mobile Navigation Arrows */}
            <div className="flex items-center gap-1.5 sm:hidden">
              <button
                type="button"
                onClick={() => scrollToTrack(Math.max(0, activeTrackIndex - 1))}
                disabled={activeTrackIndex === 0}
                aria-label="Previous track"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToTrack(Math.min(tracks.length - 1, activeTrackIndex + 1))}
                disabled={activeTrackIndex === tracks.length - 1}
                aria-label="Next track"
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 active:bg-white/30 text-white disabled:opacity-25 disabled:pointer-events-none transition-all cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-3">
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
              <div className="w-28 sm:w-48 h-2 rounded-full bg-white/10 overflow-hidden border border-white/15">
                <div
                  ref={progressBarRef}
                  className="h-full bg-gradient-to-r from-cyan-400 via-emerald-400 to-purple-400 transition-all duration-150 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
                  style={{ width: "20%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Horizontal Ribbon of All 5 Tracks */}
        <div
          ref={scrollContainerRef}
          onScroll={handleMobileScroll}
          className="relative z-10 w-full flex items-center my-auto overflow-x-auto sm:overflow-visible no-scrollbar py-3 sm:py-4 snap-x snap-mandatory scroll-smooth"
        >
          <div
            ref={trackTrackRef}
            className="flex items-center gap-4 sm:gap-8 px-4 sm:px-8 shrink-0"
          >
            {tracks.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.id}
                  className="track-card w-[calc(100vw-3rem)] max-w-[340px] sm:max-w-none sm:w-[440px] h-[410px] sm:h-[490px] shrink-0 luxury-card rounded-3xl p-5 sm:p-8 flex flex-col justify-between relative group select-none overflow-hidden transition-all duration-300 hover:border-white/30 snap-center"
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
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
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

                    <h3 className="text-lg sm:text-2xl font-bold text-white tracking-tight leading-snug group-hover:text-white line-clamp-2 sm:line-clamp-none">
                      {track.title}
                    </h3>

                    <p className="mt-2.5 text-xs sm:text-sm text-zinc-300 font-light leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {track.core}
                    </p>
                  </div>

                  {/* Tech Focus Chips */}
                  <div className="my-auto py-2 sm:py-3">
                    <div className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider mb-1.5 sm:mb-2 font-semibold">
                      ARCHITECTURAL FOCUS
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {track.techFocus.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10.5px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-white/[0.04] border border-white/10 text-zinc-300 truncate max-w-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Footer */}
                  <div className="pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:scale-110 transition-transform"
                        style={{ color: track.accent }}
                      />
                      <span className="text-[11px] sm:text-xs font-mono text-zinc-400">
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
        <div className="relative z-20 w-full max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2.5 sm:gap-3 pt-3 border-t border-white/10 shrink-0 text-xs text-zinc-400 px-4 sm:px-0">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <span className="font-mono text-[11px] sm:text-xs">
              <span className="sm:hidden">SWIPE OR TAP TRACKS TO EXPLORE • TAP FOR DETAILS</span>
              <span className="hidden sm:inline">SCROLL DOWN TO GLIDE HORIZONTALLY · TRANSITIONS TO 24H TIMELINE AT TRACK 05</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {tracks.map((t, idx) => {
              const isActive = idx === activeTrackIndex;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => scrollToTrack(idx)}
                  className={`px-2.5 py-1 rounded-md text-[10.5px] font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                      : "bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white border border-transparent"
                  }`}
                >
                  {t.number}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Track Detail Modal */}
      {selectedModalTrack && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl luxury-card p-5 sm:p-8 rounded-3xl border border-white/20 shadow-2xl overflow-y-auto max-h-[90dvh]">
            <button
              onClick={() => setSelectedModalTrack(null)}
              aria-label="Close track detail modal"
              className="absolute top-4 right-4 min-w-11 min-h-11 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer flex items-center justify-center z-10"
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
