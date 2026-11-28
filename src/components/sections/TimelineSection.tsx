"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { useNow } from "@/hooks/useNow";
import { STAGES, formatDay, formatTime, liveStageIndex, stageIndexAt } from "@/lib/schedule";

const days = [
  { label: "Saturday, 30 January", match: "30 Jan" },
  { label: "Sunday, 31 January", match: "31 Jan" },
];

export function TimelineSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const now = useNow();
  const liveIndex = liveStageIndex(now);
  const reachedIndex = now === null ? -1 : stageIndexAt(now);

  // The circuit line fills as the reader moves down the schedule
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 70%", "end 70%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  return (
    <section id="timeline" aria-labelledby="schedule-heading" className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 sm:px-6 py-16 md:py-24">
      <h2 id="schedule-heading" className="text-3xl sm:text-5xl text-foreground">
        Event schedule
      </h2>
      <p data-scroll="rise" className="mt-3 text-base text-text-muted">All times are in India Standard Time (IST).</p>

      <div ref={listRef} className="relative mt-10">
        <div aria-hidden="true" className="absolute bottom-2 left-[7px] top-2 w-0.5 bg-white/10">
          <motion.div style={{ scaleY: fill }} className="h-full w-full origin-top bg-brand-cyan motion-reduce:transform-none!" />
        </div>

        {days.map((day) => (
          <div key={day.match} className="relative pb-6 last:pb-0">
            <h3 data-scroll="rise" className="pl-9 text-xl sm:text-2xl text-brand-cyan">{day.label}</h3>
            <ol className="mt-4">
              {STAGES.map((stage, i) => {
                const at = Date.parse(stage.at);
                if (formatDay(at) !== day.match) return null;
                const live = i === liveIndex;
                const done = !live && i <= reachedIndex;
                return (
                  <li key={stage.id} aria-current={live ? "step" : undefined} className="relative pl-9">
                    <span
                      aria-hidden="true"
                      className={`absolute left-0 top-6 size-4 rounded-full border-[3px] ${
                        live ? "border-brand-green bg-brand-green" : done ? "border-brand-cyan bg-brand-cyan" : "border-brand-cyan bg-background"
                      }`}
                    />
                    <div
                      data-scroll="rise"
                      className={`grid gap-x-8 gap-y-1 border-b border-white/10 px-3 py-5 transition-colors hover:bg-surface sm:grid-cols-[9rem_1fr] ${
                        live ? "bg-surface" : ""
                      }`}
                    >
                      <p className="font-display text-xl font-bold tabular-nums text-foreground">{formatTime(at)}</p>
                      <div>
                        <h4 className="text-xl text-foreground">{stage.name}</h4>
                        <p className="mt-1 max-w-2xl text-sm sm:text-base leading-relaxed text-text-muted">{stage.detail}</p>
                        {live && <p className="mt-2 text-sm font-semibold text-brand-green">Happening now</p>}
                        {done && <p className="mt-2 text-sm text-text-muted">Done</p>}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TimelineSection;
