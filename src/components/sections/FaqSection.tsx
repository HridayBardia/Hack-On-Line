"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Mail } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const faqs: FaqItem[] = [
    {
      id: "faq-1",
      question: "What is Hack On-Line and when does the sprint take place?",
      answer:
        "Hack On-Line is a professional hackathon organization hosting high-velocity virtual engineering sprints. The hackathon takes place from January 30, 2027, 10:00 AM IST to January 31, 2027, 10:00 AM IST (24 hours non-stop). It is 100% virtual and open globally.",
      category: "OVERVIEW",
    },
    {
      id: "faq-2",
      question: "When are the exact problem statements released?",
      answer:
        "Exact problem statements, edge-case evaluation criteria, and sample API limits across all 5 problem arenas decrypt precisely 15 minutes before kickoff — at 09:45 AM IST on January 30, 2027 — directly on this website and via the Unstop dashboard.",
      category: "PROBLEM TRACKS",
    },
    {
      id: "faq-3",
      question: "Who can register, and what are the squad size restrictions?",
      answer:
        "Registration is completely free (₹0 entry fee) and open to any student, professional engineer, or independent developer worldwide. Squads can consist of 1 to 4 members. Solo developers are also fully welcomed.",
      category: "ELIGIBILITY",
    },
    {
      id: "faq-4",
      question: "Who owns the intellectual property (IP) created during the hackathon?",
      answer:
        "100% of the IP is retained by the builders. Always. Neither Hack On-Line nor any sponsor retains any ownership, claim, or restrictive license over your code, repositories, or future commercial monetization.",
      category: "IP FREEDOM",
    },
    {
      id: "faq-5",
      question: "Who evaluates and reviews our project submissions?",
      answer:
        "Evaluation is conducted in two rigorous rounds. Round 1 (Preliminary Technical Shortlisting) is evaluated by our panel of Tech & Software Industry Experts, who audit all registered repositories, commit histories, and live deployments to select the Top 10 Finalist Teams. Round 2 (Championship Live Stage) is judged live by active Tech & Software Industry Experts and startup architects to decide the final podium winners.",
      category: "JUDGING",
    },
    {
      id: "faq-6",
      question: "What are the core submission requirements to avoid disqualification?",
      answer:
        "1. Initial commits must be timestamped after 10:00 AM IST on January 30, 2027. 2. A live public deployment URL (Vercel, Fly.io, Railway, Cloudflare, etc.) is mandatory; localhost demos are disqualified. 3. An unedited 2-minute raw screencast demonstrating the live product and code architecture.",
      category: "ANTI-CHEAT",
    },
  ];

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28 scroll-mt-28 select-none relative z-10 overflow-x-clip"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col sm:flex-row sm:items-end justify-between pb-8 border-b border-white/[0.08] gap-4 mb-10"
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-widest mb-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            <span>06 // DEVELOPER INQUIRIES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
        </div>
      </motion.div>

      {/* Accordion Container */}
      <div className="divide-y divide-white/[0.08] border-y border-white/[0.08] rounded-2xl bg-zinc-950/40 overflow-hidden">
        {faqs.map((faq, idx) => {
          const isOpen = openId === faq.id;
          return (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: idx * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="transition-colors hover:bg-white/[0.02]"
            >
              <button
                onClick={() => toggle(faq.id)}
                className="w-full py-4 sm:py-5 px-4 sm:px-7 min-h-11 text-left flex items-center justify-between gap-3 sm:gap-4 focus:outline-none cursor-pointer"
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-white/[0.06] text-zinc-400 shrink-0">
                    {faq.category}
                  </span>
                  <span className="text-sm sm:text-base font-semibold text-white tracking-tight">
                    {faq.question}
                  </span>
                </div>

                <div
                  className={`p-1.5 rounded-full bg-white/5 text-zinc-400 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180 text-white" : ""
                    }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 sm:px-7 pb-6 pt-1 text-xs sm:text-sm text-zinc-400 leading-relaxed border-t border-white/[0.04]">
                      <p>{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Contact Prompt */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-8 p-5 rounded-2xl bg-zinc-950/40 border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-400"
      >
        <div className="flex items-center gap-2.5">
          <Mail className="w-4 h-4 text-brand-green" />
          <span>Have queries, need help, or exploring collaborations? Reach out anytime:</span>
        </div>
        <a
          href="https://mail.google.com/mail/?view=cm&fs=1&to=hackon.line2027@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white font-medium hover:underline transition-colors font-mono"
        >
          hackon.line2027@gmail.com →
        </a>
      </motion.div>
    </section>
  );
}
