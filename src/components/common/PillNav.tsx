"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { TextScramble } from "./TextScramble";
import { RollText } from "@/components/fx/RollText";
import { CALENDAR_URL } from "@/lib/event";

const navItems = [
  { id: "tracks", label: "Tracks" },
  { id: "about", label: "About" },
  { id: "rules", label: "Rubrics" },
  { id: "faq", label: "FAQ" },
  { id: "team", label: "Crew" },
];

type LenisLike = {
  scrollTo: (target: HTMLElement | number, opts?: { offset?: number; duration?: number }) => void;
  stop: () => void;
  start: () => void;
};

const getLenis = () => (window as Window & { __lenis?: LenisLike }).__lenis;

const NAV_OFFSET = -110;

export function PillNav() {
  const [scrolled, setScrolled] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [activeSection, setActiveSection] = useState("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = useRef(0);

  // While the mobile menu is open: lock scrolling and close on Escape
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    getLenis()?.stop();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      getLenis()?.start();
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 40);

      // Hide on scroll down, show on scroll up
      if (y <= 120 || y < lastScrollY.current - 8) setNavVisible(true);
      else if (y > lastScrollY.current + 8) setNavVisible(false);
      lastScrollY.current = y;

      // Positions are read live because Crew loads late and tracks expand, changing the page height
      const line = window.innerHeight * 0.4;
      const current = navItems.find(({ id }) => {
        const rect = document.getElementById(id)?.getBoundingClientRect();
        return !!rect && rect.top <= line && rect.bottom > line;
      });
      setActiveSection(current?.id ?? "");
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const goTo = (e: React.MouseEvent, id: string | null) => {
    e.preventDefault();
    const target = id ? document.getElementById(id) : null;
    if (id && !target) return;

    setNavVisible(true);
    setMobileMenuOpen(false);

    // Wait two frames so the menu's scroll lock is released first
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        const lenis = getLenis();
        if (lenis) {
          lenis.scrollTo(target ?? 0, { offset: target ? NAV_OFFSET : 0, duration: 1.2 });
        } else {
          const top = target ? target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET : 0;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  };

  const currentBubbleId = hoveredId || activeSection;

  return (
    <>
      <header
        className={`fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none transition-all duration-300 focus-within:translate-y-0 focus-within:opacity-100 ${
          navVisible || mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-24 opacity-0"
        }`}
      >
        <nav
          aria-label="Primary Navigation"
          className={`pointer-events-auto flex items-center gap-2 p-1.5 rounded-full luxury-nav transition-all duration-300 ${
            scrolled ? "py-1.5 px-3 shadow-2xl scale-[0.98]" : "py-2 px-4 shadow-xl"
          }`}
        >
          {/* Brand Mark */}
          <a
            href="#"
            onClick={(e) => goTo(e, null)}
            className="flex items-center gap-2 pl-2 pr-1 sm:pr-3 py-1 text-sm font-bold tracking-tight text-white hover:opacity-95 transition-opacity group cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Hack On-Line"
              className="h-6 w-auto object-contain drop-shadow-[0_0_8px_rgba(39,246,87,0.5)] group-hover:drop-shadow-[0_0_12px_rgba(2,226,248,0.8)] transition-all duration-300"
            />
            {/* The wrapper hides the name on phones: TextScramble always sets its own display */}
            <span className="hidden sm:block">
              <TextScramble
                text="Hack On-Line"
                className="tracking-tight text-white font-bold text-sm whitespace-nowrap"
                speed={22}
                cyclesPerChar={2}
              />
            </span>
            <span className="hidden min-[360px]:inline text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green border border-brand-green/20 shadow-[0_0_8px_rgba(39,246,87,0.2)]">
              2027
            </span>
          </a>

          <div className="h-4 w-px bg-white/15 mx-1 hidden lg:block" />

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-0.5 relative">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => goTo(e, item.id)}
                  onMouseEnter={() => setHoveredId(item.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  aria-current={isActive ? "location" : undefined}
                  className={`roll-trigger relative px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition-colors z-10 ${
                    isActive ? "text-white font-semibold" : "text-zinc-400 hover:text-white"
                  }`}
                >
                  {currentBubbleId === item.id && (
                    <motion.div
                      layoutId="nav-pill-bubble"
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      className="absolute inset-0 nav-pill-active -z-10"
                    />
                  )}
                  <RollText text={item.label} />
                </a>
              );
            })}
          </div>

          <div className="h-4 w-px bg-white/15 mx-1 hidden sm:block" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <a
              href={CALENDAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="luxury-button-primary px-3 sm:px-4 py-2 min-h-11 rounded-full text-xs whitespace-nowrap"
            >
              Add to calendar
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden min-w-11 min-h-11 flex items-center justify-center p-2 rounded-full text-zinc-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Drawer & Backdrop */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-label="Mobile Navigation Menu"
            data-lenis-prevent
            className="fixed! top-24 inset-x-3 sm:inset-x-4 z-50 lg:hidden luxury-card rounded-3xl p-4 sm:p-5 shadow-2xl max-h-[calc(100dvh-7rem)] overflow-y-auto"
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => goTo(e, item.id)}
                  className="px-4 py-3 min-h-11 rounded-xl text-sm font-medium text-zinc-200 hover:text-white hover:bg-white/10 flex items-center transition-colors cursor-pointer"
                >
                  {item.label}
                </a>
              ))}
              <p className="pt-3 mt-1 border-t border-white/10 text-center text-sm text-text-muted">
                Registration opens soon.
              </p>
            </div>
          </div>
        </>
      )}
    </>
  );
}
