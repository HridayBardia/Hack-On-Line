"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { TextScramble } from "./TextScramble";

interface PillNavProps {
  onOpenRegister?: () => void;
}

export function PillNav({ onOpenRegister }: PillNavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("about");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  const navItems = [
    { id: "about", label: "About", href: "#about" },
    { id: "platform", label: "Platform", href: "#platform" },
    { id: "tracks", label: "5 Tracks", href: "#tracks" },
    { id: "timeline", label: "Timeline", href: "#timeline" },
    { id: "team", label: "Crew", href: "#team" },
    { id: "rules", label: "Judging", href: "#rules" },
    { id: "faq", label: "FAQ", href: "#faq" },
  ];

  useEffect(() => {
    let ticking = false;
    let cachedOffsets: Array<{ id: string; top: number; height: number }> = [];

    const measureSections = () => {
      const sections = ["about", "platform", "tracks", "timeline", "team", "rules", "faq"];
      cachedOffsets = sections
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          return { id, top: el.offsetTop, height: el.offsetHeight };
        })
        .filter(Boolean) as Array<{ id: string; top: number; height: number }>;
    };

    measureSections();
    window.addEventListener("resize", measureSections, { passive: true });

    let localScrolled = false;
    let localNavVisible = true;
    let localActive = "";

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const isNowScrolled = currentScrollY > 40;
          if (isNowScrolled !== localScrolled) {
            localScrolled = isNowScrolled;
            setScrolled(isNowScrolled);
          }

          // Auto-hide navbar on scroll down, reveal on scroll up
          let shouldShow = true;
          if (currentScrollY > 120) {
            if (currentScrollY > lastScrollY.current + 8) {
              shouldShow = false;
            } else if (currentScrollY < lastScrollY.current - 8) {
              shouldShow = true;
            } else {
              shouldShow = localNavVisible;
            }
          }
          if (shouldShow !== localNavVisible) {
            localNavVisible = shouldShow;
            setNavVisible(shouldShow);
          }
          lastScrollY.current = currentScrollY;

          // Active section tracking from cached offsets (zero forced layout reflows!)
          const scrollPosition = currentScrollY + 280;
          let matched = "";
          for (let i = 0; i < cachedOffsets.length; i++) {
            const { id, top, height } = cachedOffsets[i];
            if (scrollPosition >= top && scrollPosition < top + height) {
              matched = id;
              break;
            }
          }
          if (matched && matched !== localActive) {
            localActive = matched;
            setActiveSection(matched);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", measureSections);
    };
  }, []);

  // Smooth scroll handler with offset for Lenis or native scroll
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");
    const target = document.getElementById(targetId);
    if (!target) return;

    // Keep navbar visible when deliberately navigating
    setNavVisible(true);
    setMobileMenuOpen(false);

    const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
    if (lenis) {
      lenis.scrollTo(target, { offset: -110, duration: 1.2 });
    } else {
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - 110;
      window.scrollTo({ top: targetPos, behavior: "smooth" });
    }
  };

  const currentBubbleId = hoveredId || activeSection;

  return (
    <>
      <header
        className={`fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 ${navVisible ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
          }`}
      >
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto flex items-center gap-2 p-1.5 rounded-full luxury-nav transition-all duration-300 ${scrolled ? "py-1.5 px-3 shadow-2xl scale-[0.98]" : "py-2 px-4 shadow-xl"
            }`}
        >
          {/* Brand Mark */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              const lenis = (window as Window & { __lenis?: { scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void } }).__lenis;
              if (lenis) lenis.scrollTo(0, { duration: 1.2 });
              else window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 pl-2 pr-3 py-1 text-sm font-bold tracking-tight text-white hover:opacity-95 transition-opacity group cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Hack On-Line"
              className="h-6 w-auto object-contain filter drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-300"
            />
            <TextScramble
              text="Hack On-Line"
              className="tracking-tight text-white font-bold text-sm hidden sm:inline-block"
              speed={22}
              cyclesPerChar={2}
            />
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
              2027
            </span>
          </a>

          <div className="h-4 w-px bg-white/15 mx-1 hidden md:block" />

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center gap-0.5 relative">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              const isBubbleTarget = currentBubbleId === item.id;

              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={`relative px-3.5 py-1.5 text-xs font-medium transition-colors z-10 ${isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-white"
                    }`}
                >
                  {isBubbleTarget && (
                    <motion.div
                      layoutId="nav-pill-bubble"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 nav-pill-active -z-10"
                    />
                  )}
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>

          <div className="h-4 w-px bg-white/15 mx-1 hidden sm:block" />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRegister}
              className="luxury-button-primary px-4 py-1.5 rounded-full text-xs font-bold text-[#050508] transition-all flex items-center gap-1.5"
            >
              <span>Register</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="fixed top-20 inset-x-4 z-50 md:hidden luxury-card rounded-3xl p-5 shadow-2xl border border-white/15">
          <div className="flex flex-col gap-1.5">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="px-4 py-3 rounded-xl text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/10 flex items-center justify-between transition-colors"
              >
                <span>{item.label}</span>
                <span className="text-xs text-zinc-500">→</span>
              </a>
            ))}
            <div className="pt-3 mt-1 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenRegister) onOpenRegister();
                }}
                className="luxury-button-primary w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
              >
                <span>Register on Unstop</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
