"use client";

import { useEffect, useRef, useState } from "react";
import { HeartPulse, Leaf, Lock, LockOpen, Plus,Satellite, ShieldCheck, Zap, type LucideIcon } from "lucide-react";
import { useNow } from "@/hooks/useNow";
import { TRACKS_RELEASE, formatSpan } from "@/lib/schedule";

// Public descriptions only. Never put problem statements in this file before release:
// everything here is sent to the browser and can be read early.
interface Track {
  id: string;
  name: string;
  title: string;
  summary: string;
  icon: LucideIcon;
  focus: string[];
  ideas: string[];
}

const tracks: Track[] = [
  {
    id: "agriculture",
    name: "Agriculture",
    title: "Precision agriculture, sensor meshes and crop intelligence",
    summary:
      "Soil sensor data, automated irrigation, crop disease detection from images, drone data and tools that improve yield in a changing climate.",
    icon: Leaf,
    focus: [
      "IoT sensor networks (MQTT, LoRaWAN)",
      "Crop disease detection with computer vision",
      "Local climate and soil moisture data",
      "Crop mapping from satellite images",
    ],
    ideas: [
      "A crop pest identifier that works offline on a phone",
      "A solar-powered drip irrigation scheduler driven by soil moisture",
      "A shared temperature monitor for grain cold storage",
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    title: "Clinical intelligence, healthcare systems and bio-computing",
    summary:
      "Diagnosis at the point of care, on-device body signal processing, private patient records, genomic anomaly detection and real-time triage.",
    icon: HeartPulse,
    focus: [
      "Secure clinical data exchange (FHIR, HL7)",
      "On-device signal processing (ECG, PPG, EEG)",
      "Privacy-preserving shared medical models",
      "Decision support for diagnosis",
    ],
    ideas: [
      "Detecting irregular heartbeats from ECG data on the device",
      "Private emergency room intake with automatic severity scoring",
      "A verifiable audit record for organ matching and transplants",
    ],
  },
  {
    id: "space",
    name: "Space",
    title: "Orbital mechanics, aerospace telemetry and satellite computing",
    summary:
      "Small satellite flight computers, orbit prediction, space debris tracking, delay-tolerant satellite networks and Earth observation.",
    icon: Satellite,
    focus: [
      "Delay-tolerant networking",
      "Orbit prediction (SGP4)",
      "Image analysis on board satellites",
      "Low-power flight controllers (Rust, RTOS)",
    ],
    ideas: [
      "A collision warning tool for satellites in low Earth orbit",
      "A scheduler for a shared network of ground stations",
      "Flood mapping from satellite radar images",
    ],
  },
  {
    id: "privacy",
    name: "Crypto and privacy",
    title: "Decentralized protocols, zero-knowledge proofs and cryptographic privacy",
    summary:
      "Verifiable computing, zero-knowledge proofs, privacy-preserving rollups, decentralized identity and peer-to-peer protocols that need little trust.",
    icon: ShieldCheck,
    focus: [
      "Zero-knowledge circuits (Circom, Noir)",
      "Decentralized identity and account abstraction",
      "State proofs and cross-chain relays",
      "Encrypted mempools",
    ],
    ideas: [
      "Anonymous proof of eligibility for open-source bounties",
      "Peer-to-peer code escrow that releases automatically",
      "A verifiable random source for assigning judges",
    ],
  },
  {
    id: "clean-tech",
    name: "Clean and green tech",
    title: "Clean technology, green energy grids and planetary systems",
    summary:
      "Matching energy demand to supply, balancing small power grids, live carbon intensity data, better waste routing and environmental sensor networks.",
    icon: Zap,
    focus: [
      "Time-series data from smart inverters",
      "Peak load balancing and energy storage",
      "Live carbon emissions data",
      "Industrial waste heat recovery",
    ],
    ideas: [
      "A scheduler that runs heavy computing when green power is plentiful",
      "A simulator for neighbours trading solar power",
      "Finding urban heat hotspots from satellite and thermal sensor data",
    ],
  },
];

// A short pause so the mouse can pass over a card without opening it
const HOVER_DELAY_MS = 140;
const OPEN_MS = 500; // matches the open and close animation below

export function TracksSection() {
  const now = useNow();
  const released = now !== null && now >= TRACKS_RELEASE;

  // Hovering a card previews its track. Clicking keeps a track open until it is clicked again.
  const [previewId, setPreviewId] = useState<string | null>(null);
  const [keptOpen, setKeptOpen] = useState<string[]>([]);
  const hoverTimer = useRef<number | undefined>(undefined);
  const pendingId = useRef<string | null>(null);
  const settledAt = useRef(0);
  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const cancelHover = () => {
    window.clearTimeout(hoverTimer.current);
    pendingId.current = null;
  };

  // Listens for mouse movement, not "enter": rows sliding under a resting mouse
  // while a card opens must not open the next one.
  const startHover = (e: React.PointerEvent, id: string) => {
    if (e.pointerType !== "mouse" || pendingId.current === id || previewId === id) return;
    cancelHover();
    pendingId.current = id;
    // Also wait for any card that is still opening or closing to settle
    const wait = Math.max(HOVER_DELAY_MS, settledAt.current - e.timeStamp);
    const openedAt = e.timeStamp + wait;
    hoverTimer.current = window.setTimeout(() => {
      pendingId.current = null;
      settledAt.current = openedAt + OPEN_MS;
      setPreviewId(id);
    }, wait);
  };

  // The preview closes only on leaving the whole list. Closing it when leaving one row
  // would move the rows under the mouse and make them flicker.
  const endPreview = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    cancelHover();
    setPreviewId(null);
  };

  const toggle = (id: string) => {
    cancelHover();
    setPreviewId(null);
    setKeptOpen((ids) => (ids.includes(id) ? ids.filter((other) => other !== id) : [...ids, id]));
  };

  return (
    <section id="tracks" aria-labelledby="tracks-heading" className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 sm:px-6 py-16 md:py-24">
      <div data-scroll="rise" className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="tracks-heading" className="text-3xl sm:text-5xl text-foreground">
            Five problem tracks
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-text-muted">
            See the topics now. The problem statements stay locked until 30 January 2027 at 9:45 AM IST.
          </p>
        </div>
        <p className="flex items-center gap-2 font-display text-lg font-semibold text-brand-cyan">
          {released ? <LockOpen className="size-5" aria-hidden="true" /> : <Lock className="size-5" aria-hidden="true" />}
          {released
            ? "Problem statements are out on Unstop"
            : now === null
              ? "Statements are locked"
              : `Statements unlock in ${formatSpan(TRACKS_RELEASE - now)}`}
        </p>
      </div>

      <ul className="mt-10 border-t border-white/10" onPointerLeave={endPreview}>
        {tracks.map((track) => {
          const kept = keptOpen.includes(track.id);
          const open = kept || previewId === track.id;
          const Icon = track.icon;
          return (
            <li
              key={track.id}
              data-scroll="rise"
              onPointerMove={(e) => startHover(e, track.id)}
              onPointerLeave={cancelHover}
              className={`relative border-b border-white/10 transition-colors ${open ? "bg-surface" : ""}`}
            >
              {/* Circuit line lights up on the open row */}
              <span
                aria-hidden="true"
                className={`absolute inset-y-0 left-0 w-0.5 origin-top bg-brand-cyan transition-transform duration-500 motion-reduce:transition-none ${
                  open ? "scale-y-100" : "scale-y-0"
                }`}
              />
              <h3>
                <button
                  type="button"
                  onClick={() => toggle(track.id)}
                  title={kept ? "Click to close" : "Click to keep open"}
                  aria-expanded={open}
                  aria-controls={`track-${track.id}`}
                  className="group flex w-full cursor-pointer items-center gap-4 px-3 sm:px-6 py-5 sm:py-7 text-left"
                >
                  <Icon className="size-6 sm:size-8 shrink-0 text-brand-cyan" aria-hidden="true" />
                  <span className="min-w-0 flex-1 md:flex md:items-baseline md:gap-6">
                    <span className="block font-display text-2xl sm:text-3xl font-bold text-foreground transition-transform duration-300 group-hover:translate-x-1.5 motion-reduce:transition-none md:w-80 md:shrink-0">
                      {track.name}
                    </span>
                    <span className="block text-sm font-sans font-normal leading-snug text-text-muted">{track.title}</span>
                  </span>
                  {/* Becomes an "Open" label once the track is clicked */}
                  <span
                    aria-hidden="true"
                    className={`flex h-11 shrink-0 items-center justify-center overflow-hidden border font-display text-base font-bold transition-all duration-300 motion-reduce:transition-none ${
                      kept
                        ? "w-20 border-brand-green bg-brand-green text-black shadow-[0_0_18px_rgba(39,246,87,0.45)]"
                        : open
                          ? "w-11 border-brand-green text-brand-green"
                          : "w-11 border-white/15 text-foreground group-hover:border-brand-green group-hover:text-brand-green"
                    }`}
                  >
                    {kept ? (
                      "Open"
                    ) : (
                      <Plus
                        className={`size-5 transition-transform duration-300 motion-reduce:transition-none ${open ? "rotate-45" : ""}`}
                      />
                    )}
                  </span>
                </button>
              </h3>

              {/* Animating grid rows opens to the content's own height */}
              <div
                id={`track-${track.id}`}
                inert={!open}
                className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="grid gap-8 px-3 sm:px-6 pb-8 pt-1 lg:grid-cols-3">
                    <div>
                      <p className="leading-relaxed text-foreground">{track.summary}</p>
                      <p className="mt-4 flex items-start gap-2 text-sm text-brand-cyan">
                        {released ? <LockOpen className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> : <Lock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />}
                        {released ? "Problem statement: see Unstop" : "Problem statement unlocks 30 Jan, 9:45 AM IST"}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-lg text-foreground">Areas to build in</h4>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text-muted marker:text-brand-cyan">
                        {track.focus.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg text-foreground">Example ideas</h4>
                      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-text-muted marker:text-brand-cyan">
                        {track.ideas.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="mt-3 text-xs text-text-muted">These are examples, not the problem statement.</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default TracksSection;
