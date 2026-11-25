"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Layers,
  Clock,
  ShieldCheck,
  HelpCircle,
  Users,
  Building2,
  ArrowRight,
  Sparkles,
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRegister?: () => void;
}

export function CommandPalette({
  isOpen,
  onClose,
  onOpenRegister,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleSelect = (action: () => void) => {
    action();
    onClose();
  };

  const commands = [
    {
      id: "register",
      title: "Register for Hack On-Line",
      sub: "Reserve squad allocation on Unstop",
      icon: Sparkles,
      action: () => {
        if (onOpenRegister) onOpenRegister();
      },
    },
    {
      id: "about",
      title: "About Us & Engineering Doctrines",
      sub: "Core principles and institutional standards",
      icon: Building2,
      action: () => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "tracks",
      title: "5 Problem Tracks",
      sub: "Explore all 5 problem arenas (15m decryption)",
      icon: Layers,
      action: () => {
        document.getElementById("tracks")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "timeline",
      title: "24-Hour Execution Timeline",
      sub: "Minute-by-minute sprint schedule",
      icon: Clock,
      action: () => {
        document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "team",
      title: "Organizing Crew Roster",
      sub: "Steering committee and operations leads",
      icon: Users,
      action: () => {
        document.getElementById("team")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "rules",
      title: "Two-Round Judging & Rubrics",
      sub: "Evaluation matrix and judging protocol",
      icon: ShieldCheck,
      action: () => {
        document.getElementById("rules")?.scrollIntoView({ behavior: "smooth" });
      },
    },
    {
      id: "faq",
      title: "Frequently Asked Questions",
      sub: "Eligibility, rules, submission standards",
      icon: HelpCircle,
      action: () => {
        document.getElementById("faq")?.scrollIntoView({ behavior: "smooth" });
      },
    },
  ];

  const filtered = commands.filter(
    (c) =>
      c.title.toLowerCase().includes(query.toLowerCase()) ||
      c.sub.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 sm:pt-28 p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: -10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-zinc-950 border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden font-sans relative z-10"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.08]">
              <Search className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or jump to section..."
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                autoFocus
              />
              <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-zinc-500">
                ESC
              </span>
            </div>

            {/* Commands List */}
            <div className="max-h-72 overflow-y-auto p-2 space-y-1">
              {filtered.map((cmd) => {
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => handleSelect(cmd.action)}
                    className="w-full p-2.5 rounded-xl hover:bg-white/[0.06] flex items-center justify-between text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-1.5 rounded-lg bg-white/[0.04] text-zinc-400 group-hover:text-white transition-colors">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">
                          {cmd.title}
                        </div>
                        <div className="text-[11px] text-zinc-500">
                          {cmd.sub}
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-white group-hover:translate-x-0.5 transition-all" />
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="p-6 text-center text-xs text-zinc-500">
                  No matching commands found.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
