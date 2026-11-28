"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, CheckCircle2 } from "lucide-react";

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationModal({ isOpen, onClose }: RegistrationModalProps) {
  const unstopUrl = "https://unstop.com";
  const unstopRegistrationUrl = "https://unstop.com/hackathons/hack-on-line-2027";

  const [activeTab, setActiveTab] = useState<"DIRECT" | "OVERVIEW">("DIRECT");

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
                  className="h-8 w-auto object-contain filter drop-shadow-[0_0_10px_rgba(39,246,87,0.5)]"
                />
                <div>
                  <div className="font-semibold text-sm text-white">
                    Register for Hack On-Line 2027
                  </div>
                  <div className="text-[11px] text-brand-green font-mono">
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
                    ? "bg-brand-green text-black font-bold shadow-md"
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
                    ? "bg-brand-green text-black font-bold shadow-md"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Event Schedule & Unstop
              </button>
            </div>

            {/* TAB 1: Registration on Unstop Panel */}
            {activeTab === "DIRECT" && (
              <div className="space-y-4 py-2">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center space-y-2">
                  <div className="text-xs font-mono text-brand-green uppercase tracking-wider font-semibold">
                    Official Registration Portal
                  </div>
                  <div className="text-sm font-semibold text-white">
                    Registration happens on Unstop
                  </div>
                  <p className="text-xs text-zinc-400 max-w-sm mx-auto">
                    All squad registrations, roster confirmations, and track allocations are managed exclusively through the official Unstop platform.
                  </p>
                </div>

                <div className="pt-2">
                  <a
                    href={unstopRegistrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="luxury-button-primary w-full py-3.5 min-h-11 px-4 rounded-xl text-sm font-bold text-zinc-950 flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Register on Unstop</span>
                    <ExternalLink className="w-4 h-4 text-zinc-950" />
                  </a>
                </div>
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
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                    <span>5 Engineering Problem Tracks (decrypt at 09:45 AM IST)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Two-Round Judging (Preliminary Shortlist & Championship Finals)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0" />
                    <span>100% Builder IP Retention (You own all your code)</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={unstopUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="luxury-button-primary w-full py-3.5 min-h-11 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
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
