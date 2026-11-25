"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import confetti from "canvas-confetti";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRACKS = [
  { id: "track-01", name: "Track 01: Agriculture & AgTech" },
  { id: "track-02", name: "Track 02: Medical & Healthcare" },
  { id: "track-03", name: "Track 03: Space & Aerospace" },
  { id: "track-04", name: "Track 04: Crypto & Privacy" },
  { id: "track-05", name: "Track 05: Clean & Green Tech" },
];

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const unstopUrl = "https://unstop.com";

  const [activeTab, setActiveTab] = useState<"DIRECT" | "OVERVIEW">("DIRECT");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registeredTeam, setRegisteredTeam] = useState<{ id: string; name: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    githubHandle: "",
    trackId: "track-01",
    memberCount: 4,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please check inputs.");
      }

      setSubmitted(true);
      setRegisteredTeam({
        id: data.registrationId || "HL-2027",
        name: data.team?.name || formData.teamName,
      });

      // Launch celebratory particle confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#10b981", "#06b6d4", "#8b5cf6"],
      });
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Network error. Please retry.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setRegisteredTeam(null);
    setErrorMessage(null);
    setFormData({
      teamName: "",
      leaderName: "",
      leaderEmail: "",
      githubHandle: "",
      trackId: "track-01",
      memberCount: 4,
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 8 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-zinc-950 border border-white/[0.12] rounded-3xl p-5 sm:p-8 shadow-2xl relative text-white font-sans overflow-y-auto max-h-[90dvh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] mb-5">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.png"
                  alt="Hack On-Line"
                  className="h-8 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                />
                <div>
                  <div className="font-semibold text-sm text-white">
                    Register for Hack On-Line 2027
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    ● 24H Virtual Sprint Registration
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="min-w-11 min-h-11 flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.06] rounded-xl mb-5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab("DIRECT")}
                className={`flex-1 py-2.5 min-h-11 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === "DIRECT"
                    ? "bg-white text-zinc-950 font-bold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Direct Squad Registration
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("OVERVIEW")}
                className={`flex-1 py-2.5 min-h-11 rounded-lg transition-all cursor-pointer flex items-center justify-center ${
                  activeTab === "OVERVIEW"
                    ? "bg-white text-zinc-950 font-bold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Event Schedule & Unstop
              </button>
            </div>

            {/* TAB 1: Direct Squad Registration Form */}
            {activeTab === "DIRECT" && (
              <div>
                {submitted && registeredTeam ? (
                  <div className="py-6 text-center space-y-4">
                    <div className="size-12 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                      <Sparkles className="size-6 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Squad Registered!</h3>
                    <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                      Your squad <span className="text-white font-semibold">{registeredTeam.name}</span> has been confirmed into the Hack On-Line 2027 builder roster.
                    </p>
                    <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 inline-block text-xs font-mono text-cyan-400">
                      REGISTRATION ID: {registeredTeam.id}
                    </div>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={handleReset}
                        className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
                      >
                        Register another team
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                        <AlertCircle className="size-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          TEAM / SQUAD NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.teamName}
                          onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                          placeholder="e.g. ZeroDay Architects"
                          className="w-full px-3 py-2.5 min-h-11 rounded-xl bg-white/[0.04] border border-white/10 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          LEAD BUILDER NAME *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.leaderName}
                          onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                          placeholder="e.g. Alex Turing"
                          className="w-full px-3 py-2.5 min-h-11 rounded-xl bg-white/[0.04] border border-white/10 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          LEADER EMAIL ADDRESS *
                        </label>
                        <input
                          type="email"
                          required
                          value={formData.leaderEmail}
                          onChange={(e) => setFormData({ ...formData, leaderEmail: e.target.value })}
                          placeholder="builder@domain.com"
                          className="w-full px-3 py-2.5 min-h-11 rounded-xl bg-white/[0.04] border border-white/10 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          GITHUB USERNAME (OPTIONAL)
                        </label>
                        <input
                          type="text"
                          value={formData.githubHandle}
                          onChange={(e) => setFormData({ ...formData, githubHandle: e.target.value })}
                          placeholder="e.g. octocat"
                          className="w-full px-3 py-2.5 min-h-11 rounded-xl bg-white/[0.04] border border-white/10 text-base sm:text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          PROBLEM TRACK *
                        </label>
                        <select
                          value={formData.trackId}
                          onChange={(e) => setFormData({ ...formData, trackId: e.target.value })}
                          className="w-full px-3 py-2.5 min-h-11 rounded-xl bg-[#0e0f14] border border-white/10 text-base sm:text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                        >
                          {TRACKS.map((t) => (
                            <option key={t.id} value={t.id}>
                              {t.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono text-zinc-400 mb-1">
                          SQUAD SIZE (1-4) *
                        </label>
                        <select
                          value={formData.memberCount}
                          onChange={(e) => setFormData({ ...formData, memberCount: Number(e.target.value) })}
                          className="w-full px-3 py-2.5 min-h-11 rounded-xl bg-[#0e0f14] border border-white/10 text-base sm:text-xs text-white focus:outline-none focus:border-cyan-400 transition-colors"
                        >
                          <option value={1}>1 Solo Builder</option>
                          <option value={2}>2 Builders</option>
                          <option value={3}>3 Builders</option>
                          <option value={4}>4 Builders (Full Squad)</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="luxury-button-primary w-full py-3.5 min-h-11 rounded-xl text-sm sm:text-xs font-bold text-zinc-950 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          <span>Persisting Roster Entry...</span>
                        </>
                      ) : (
                        <span>Confirm Squad Registration</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 2: Event Specs & Unstop Link */}
            {activeTab === "OVERVIEW" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <div className="text-xs font-mono text-zinc-500 uppercase tracking-wider mb-1">
                    Event Schedule
                  </div>
                  <div className="text-sm font-semibold text-white">
                    January 30–31, 2027 • 10:00 AM – 10:00 AM IST
                  </div>
                  <div className="text-xs text-zinc-400 mt-1">
                    24-Hour Virtual Sprint • ₹0 Entry Fee • Open to 1–4 member squads
                  </div>
                </div>

                <div className="space-y-2 text-xs text-zinc-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>5 Engineering Problem Tracks (decrypt at 09:45 AM IST)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Two-Round Judging (Preliminary Shortlist & Championship Finals)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>100% Builder IP Retention (You own all your code)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={unstopUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="apple-button-primary w-full py-3.5 min-h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    <span>View Portal on Unstop</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <p className="text-[10px] text-zinc-500 text-center mt-2">
                    Direct squad registrations submitted on this site are officially recorded.
                  </p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="mt-5 pt-3.5 border-t border-white/[0.06] text-center text-xs text-zinc-500">
              For queries, help or collaborations:{" "}
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=hackon.line2027@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-300 hover:text-white underline font-mono ml-1"
              >
                hackon.line2027@gmail.com
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
