"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { AmbientBackground } from "@/components/common/AmbientBackground";
import { PillNav } from "@/components/common/PillNav";
import { ScrollProgressHUD } from "@/components/common/ScrollProgressHUD";
import { Hero } from "@/components/sections/Hero";
import { VelocityMarquee } from "@/components/sections/VelocityMarquee";
import { AboutSection } from "@/components/sections/AboutSection";
import { PlatformSection } from "@/components/sections/PlatformSection";
import { TimelineSection } from "@/components/sections/TimelineSection";
import { RulesSection } from "@/components/sections/RulesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FooterSection } from "@/components/sections/FooterSection";

// 1. Heavy GSAP Problem Tracks Section: Lazy-loaded below the fold
const TracksSection = dynamic(
  () => import("@/components/sections/TracksSection").then((m) => m.TracksSection),
  { ssr: false }
);

// 2. Heavy 3D Physics Lanyard Badges: Lazy-loaded below the fold
const TeamSection = dynamic(
  () => import("@/components/sections/TeamSection").then((m) => m.TeamSection),
  { ssr: false }
);

// 3. Conditional Registration Modal: Dynamic chunk loaded on-demand
const RegistrationModal = dynamic(
  () => import("@/components/RegistrationModal").then((m) => m.RegistrationModal),
  { ssr: false }
);

export default function Home() {
  // Initialize smooth scrolling
  useSmoothScroll();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="relative min-h-dvh bg-[#070709] text-[#F4F4F6] selection:bg-white selection:text-black overflow-x-clip">
      {/* Ambient Backdrop */}
      <AmbientBackground />

      {/* Modern Navigation Header */}
      <PillNav
        onOpenRegister={() => setIsRegisterModalOpen(true)}
      />

      {/* Main Content Flow */}
      <main className="relative z-10 w-full overflow-x-clip">
        {/* 1. Hero (Above the fold: immediate render) */}
        <Hero onOpenRegister={() => setIsRegisterModalOpen(true)} />

        {/* 2. Kinetic Velocity Marquee Ticker */}
        <VelocityMarquee />

        {/* 3. About Us (Split-screen Blueprint Chamber) */}
        <AboutSection />

        {/* 4. Platform (3D Perspective Virtual Runtime Architecture) */}
        <PlatformSection />

        {/* 5. 5 Problem Tracks (Lazy loaded GSAP) */}
        <TracksSection />

        {/* 6. 24-Hour Timeline */}
        <TimelineSection />

        {/* 7. Organizing Crew (Lazy loaded 3D Physics Rail) */}
        <TeamSection />

        {/* 8. Two-Round Judging & Evaluation */}
        <RulesSection />

        {/* 9. FAQ */}
        <FaqSection />
      </main>

      {/* Floating Tactical Scroll Telemetry HUD */}
      <ScrollProgressHUD />

      {/* Footer */}
      <FooterSection />

      {/* Interactive Registration Modal (Loaded on-demand) */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      />
    </div>
  );
}
