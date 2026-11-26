"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Check } from "lucide-react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

export function Countdown() {
  // Target: January 30, 2027, 10:00:00 AM IST (UTC+05:30)
  const targetDate = new Date("2027-01-30T10:00:00+05:30").getTime();

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isComplete: false,
  });
  const [copiedCal, setCopiedCal] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          isComplete: true,
        });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isComplete: false,
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const padZero = (num: number) => String(num).padStart(2, "0");

  const units = [
    { label: "DAYS", value: padZero(timeLeft.days), accent: "#FF8C66", glow: "rgba(255, 140, 102, 0.4)" },
    { label: "HOURS", value: padZero(timeLeft.hours), accent: "#A78BFA", glow: "rgba(167, 139, 250, 0.4)" },
    { label: "MINUTES", value: padZero(timeLeft.minutes), accent: "#22D3EE", glow: "rgba(34, 211, 238, 0.4)" },
    { label: "SECONDS", value: padZero(timeLeft.seconds), accent: "#34D399", glow: "rgba(52, 211, 153, 0.4)" },
  ];

  const handleAddToCalendar = () => {
    const title = encodeURIComponent("Hack On-Line 2027 — Premier 24H Virtual Developer Hackathon");
    const details = encodeURIComponent(
      "Hack On-Line 2027 is a 24-hour virtual developer hackathon across 5 engineering tracks.\n\n" +
      "⏰ Official Sprint Timeline (IST):\n" +
      "• Jan 30, 09:45 AM: 5 Problem Tracks Decryption\n" +
      "• Jan 30, 10:00 AM: Sprint Kickoff & Genesis Commits Start\n" +
      "• Jan 31, 10:00 AM: Code Freeze & Submissions Close\n" +
      "• Jan 31, 11:30 AM: Round 1 Preliminary Evaluation\n" +
      "• Jan 31, 04:30 PM: Round 2 Championship Live Stage\n" +
      "• Jan 31, 06:30 PM: Awards & Recognition Ceremony\n\n" +
      "📍 Virtual: Unstop & GitHub\n" +
      "🔗 Portal: https://unstop.com/hackathons/hack-on-line-2027"
    );
    const location = encodeURIComponent("Virtual // Unstop Portal");
    const startTime = "20270130T043000Z";
    const endTime = "20270131T043000Z";

    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startTime}/${endTime}&details=${details}&location=${location}`;

    window.open(gcalUrl, "_blank", "noopener,noreferrer");

    setCopiedCal(true);
    setTimeout(() => setCopiedCal(false), 3000);
  };

  return (
    <div className="w-full max-w-3xl sm:max-w-[840px] mx-auto mt-8 sm:mt-10 relative z-10">
      {/* Sleek Deep Obsidian Container */}
      <div className="relative rounded-3xl bg-[#030305] border border-white/20 p-5 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,1)]">
        {/* Subtle Edge Ambient Highlight */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none" />

        {/* Header Telemetry */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-5 border-b border-white/10 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,1)]" />
            </span>
            <span className="font-mono uppercase tracking-widest text-xs font-bold text-zinc-200">
              OFFICIAL COUNTDOWN
            </span>
          </div>

          <div className="font-mono text-cyan-300 text-xs sm:text-sm px-3.5 py-1 rounded-full bg-[#050b14] border border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)] font-bold tracking-wider flex items-center gap-2 shrink-0 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>30 JAN 2027 • 10:00 AM IST</span>
          </div>
        </div>

        {/* Chronometer Grid: Deep Pitch-Black Razor-Sharp Cards */}
        <div className="grid grid-cols-4 gap-2 sm:gap-4 text-center">
          {units.map((unit, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center justify-center py-4 px-1.5 sm:py-7 sm:px-4 rounded-xl sm:rounded-2xl bg-[#07070a] border border-white/15 hover:border-white/30 shadow-[0_12px_36px_rgba(0,0,0,0.95)] group overflow-hidden transition-all duration-200"
            >
              {/* Luminous Top Accent Stripe */}
              <div
                className="absolute top-0 inset-x-0 h-1"
                style={{
                  backgroundColor: unit.accent,
                  boxShadow: `0 0 12px ${unit.accent}`,
                }}
              />

              {/* Razor-Sharp Pure White High-Contrast Digits */}
              <div
                className="font-mono text-3xl sm:text-6xl md:text-7xl font-black tracking-tight text-white mb-1.5 sm:mb-2 select-none"
                style={{
                  textShadow: "0 2px 8px rgba(0,0,0,0.95)",
                }}
              >
                {unit.value}
              </div>

              {/* Bold High-Contrast Unit Label Pill */}
              <div
                className="px-2 py-0.5 sm:px-2.5 sm:py-1 rounded font-mono text-[10px] sm:text-xs tracking-wider sm:tracking-widest font-black uppercase border shadow-sm max-w-full truncate"
                style={{
                  color: unit.accent,
                  borderColor: `${unit.accent}60`,
                  backgroundColor: `${unit.accent}18`,
                  textShadow: `0 0 10px ${unit.glow}`,
                }}
              >
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Strip */}
        <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-xs w-full">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm text-zinc-300 text-center sm:text-left">
            <span className="size-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] shrink-0" />
            <span className="font-medium text-zinc-200">
              Problem statements decrypt 15m prior at
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-400/15 border border-amber-400/40 text-amber-300 font-mono font-bold text-xs sm:text-sm shrink-0">
              09:45 AM IST
            </span>
          </div>

          <button
            onClick={handleAddToCalendar}
            className="w-full sm:w-auto min-h-11 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 hover:border-cyan-400 text-xs sm:text-sm font-mono font-bold text-white transition-all duration-200 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(6,182,212,0.25)] active:scale-95 shrink-0"
          >
            {copiedCal ? (
              <>
                <Check className="size-4 text-emerald-400" />
                <span className="text-emerald-300">Calendar Opened</span>
              </>
            ) : (
              <>
                <Calendar className="size-4 text-cyan-400" />
                <span>Add to Google Calendar</span>
                <span className="text-zinc-400 font-normal">↗</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
