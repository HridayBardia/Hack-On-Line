"use client";

import React, { useState, useEffect } from "react";
import { ExternalLink, ArrowUp, Clock } from "lucide-react";

export function FooterSection() {
  const [istTime, setIstTime] = useState("");
  const [utcTime, setUtcTime] = useState("");

  useEffect(() => {
    const updateClocks = () => {
      const now = new Date();
      setIstTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "Asia/Kolkata",
          hour12: false,
        }) + " IST"
      );
      setUtcTime(
        now.toLocaleTimeString("en-US", {
          timeZone: "UTC",
          hour12: false,
        }) + " UTC"
      );
    };

    updateClocks();
    const interval = setInterval(updateClocks, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#070709] pt-16 pb-12 border-t border-white/[0.08] text-xs font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Top Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-8 mb-12 border-b border-white/[0.08] text-zinc-400">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Hack On-Line"
              className="h-7 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            />
            <span className="flex items-center gap-2 font-semibold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Hack On-Line // 2027 Sprint</span>
            </span>
            <span className="hidden sm:inline text-zinc-600">•</span>
            <span className="hidden sm:inline text-xs text-zinc-500">
              January 30–31, 2027
            </span>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{istTime || "10:00:00 IST"}</span>
            </div>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-500">{utcTime || "04:30:00 UTC"}</span>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {/* Col 1 */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Registration & Links
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <a
                  href="https://unstop.com"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Unstop Portal</span>
                  <ExternalLink className="w-3 h-3 text-zinc-600" />
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-white transition-colors">
                  Rules & Criteria
                </a>
              </li>
              <li>
                <a href="#tracks" className="hover:text-white transition-colors">
                  5 Problem Tracks
                </a>
              </li>
            </ul>
          </div>

          {/* Col 2 */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              About & Sprints
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Hack On-Line
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  Engineering Doctrines
                </a>
              </li>
              <li>
                <a href="#timeline" className="hover:text-white transition-colors">
                  24-Hour Schedule
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-white transition-colors">
                  Organizing Crew
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Judging & Rubrics
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <a href="#rules" className="hover:text-white transition-colors">
                  Round 1: Preliminary Shortlist
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-white transition-colors">
                  Round 2: Championship Stage
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-white transition-colors">
                  100% Evaluation Matrix
                </a>
              </li>
              <li>
                <a href="#rules" className="hover:text-white transition-colors">
                  Anti-Cheat & Git Telemetry
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Governance & IP
            </div>
            <ul className="space-y-2.5 text-zinc-400">
              <li>
                <a href="#rules" className="hover:text-white transition-colors">
                  100% Builder IP Retention
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">
                  Eligibility & Rules
                </a>
              </li>
              <li>
                <a
                  href="https://mail.google.com/mail/?view=cm&fs=1&to=hackon.line2027@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Queries & Collabs: hackon.line2027@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div>
            © 2027 Hack On-Line. All rights reserved. Built for builders.
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span>All Systems Operational</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
