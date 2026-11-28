"use client";

import React, { useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useScrollScenes } from "@/hooks/useScrollScenes";
import { IntroLoader } from "@/components/fx/IntroLoader";
import { CursorFollower } from "@/components/fx/CursorFollower";
import { CommitGraphBackdrop } from "@/components/fx/CommitGraphBackdrop";
import { PillNav } from "@/components/common/PillNav";
import { Hero } from "@/components/sections/Hero";
import { JourneySection } from "@/components/sections/JourneySection";
import { AboutSection } from "@/components/sections/AboutSection";
import { TracksSection } from "@/components/sections/TracksSection";
import { RulesSection } from "@/components/sections/RulesSection";
import { FaqSection } from "@/components/sections/FaqSection";
import { FooterSection } from "@/components/sections/FooterSection";

// Heavy 3D Physics Lanyard Badges: Lazy-loaded below the fold
const TeamSection = dynamic(
  () => import("@/components/sections/TeamSection").then((m) => m.TeamSection),
  { ssr: false }
);

export default function Home() {
  // Initialize smooth scrolling
  useSmoothScroll();

  // Page animations start when the intro screen begins to close
  const [ready, setReady] = useState(false);
  const handleIntroDone = useCallback(() => setReady(true), []);
  useScrollScenes(ready);

  return (
    <div className="relative min-h-dvh bg-background text-foreground selection:bg-brand-green selection:text-black overflow-x-clip">
      <IntroLoader onDone={handleIntroDone} />
      <CursorFollower />

      {/* Live git history behind every section */}
      <CommitGraphBackdrop />

      <PillNav />

      {/* Main Content Flow */}
      <main className="relative z-10 w-full overflow-x-clip">
        <Hero ready={ready} />

        {/* Scroll through the 24 hours */}
        <JourneySection />

        {/* 5 Problem Tracks */}
        <TracksSection />

        <AboutSection />

        {/* Judging rubrics and fair-play protocols */}
        <RulesSection />

        {/* FAQ */}
        <FaqSection />

        {/* Organizing Crew (Lazy loaded 3D Physics Rail) */}
        <TeamSection />
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
}
