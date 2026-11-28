"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TimeRing } from "@/components/journey/TimeRing";
import { useNow } from "@/hooks/useNow";
import { usePinnedScroll } from "@/hooks/usePinnedScroll";
import { STAGES, formatDay, formatSpan, formatTime, liveStageIndex } from "@/lib/schedule";
import { EVENT_END, EVENT_START } from "@/lib/event";

const TIMES = STAGES.map((stage) => Date.parse(stage.at));
const COUNT = STAGES.length;
const HACK_START = Date.parse(EVENT_START);
const HACK_END = Date.parse(EVENT_END);
const FIVE_MINUTES = 300_000;

// Short names for the ring and the time bar, where the full ones don't fit
const SHORT_NAMES: Record<string, string> = {
  "Tracks released": "Tracks",
  "Hacking starts": "Start",
  "Architecture checkpoint": "Checkpoint",
  "Mentor office hours": "Mentors",
  "Code freeze": "Freeze",
  "Shortlist round": "Shortlist",
  "Final round": "Finals",
  Awards: "Awards",
};
const LABELS = STAGES.map((stage) => SHORT_NAMES[stage.name] ?? stage.name);

// The time bar is grouped by day
const DAYS = TIMES.reduce<{ day: string; count: number }[]>((days, time) => {
  const day = formatDay(time);
  const last = days[days.length - 1];
  if (last?.day === day) last.count += 1;
  else days.push({ day, count: 1 });
  return days;
}, []);

function phaseAt(ms: number) {
  if (ms < HACK_START) return "before the start";
  if (ms < HACK_END) return `hour ${Math.floor((ms - HACK_START) / 3_600_000) + 1} of 24`;
  if (ms === HACK_END) return "24 hours are up";
  return "judging and awards";
}

/** The time at a position between stages: 1.5 is halfway in time from stage 1 to stage 2 */
function timeAt(step: number) {
  const base = Math.floor(step);
  const next = Math.min(COUNT - 1, base + 1);
  return TIMES[base] + (TIMES[next] - TIMES[base]) * (step - base);
}

const ARROW =
  "grid size-11 shrink-0 cursor-pointer place-items-center border border-white/15 text-foreground transition-colors hover:border-brand-green hover:text-brand-green disabled:pointer-events-none disabled:opacity-25";

export function JourneySection() {
  const now = useNow();
  const liveIndex = liveStageIndex(now);

  const trackRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLOListElement>(null);
  const timeRef = useRef(TIMES[0]); // exact moment, read by the 3D ring
  const [time, setTime] = useState(TIMES[0]); // rounded, for the text
  const [index, setIndex] = useState(0);

  const show = useCallback((step: number) => {
    timeRef.current = timeAt(step);
    setTime(Math.round(timeRef.current / FIVE_MINUTES) * FIVE_MINUTES);
    setIndex(Math.round(step));
    // The time bar fills smoothly between stages without re-rendering
    barRef.current?.style.setProperty("--step", step.toFixed(3));
    viewRef.current?.querySelector("canvas")?.dispatchEvent(new Event("journey:redraw"));
  }, []);

  const { pinned, scrollToStep } = usePinnedScroll(trackRef, COUNT, (step) => {
    if (step !== null) show(step);
  });

  const select = useCallback(
    (next: number) => {
      const target = Math.min(COUNT - 1, Math.max(0, next));
      if (!scrollToStep(target)) show(target);
    },
    [scrollToStep, show]
  );

  // Without scroll control, start on whatever is happening now
  const jumpedRef = useRef(false);
  useEffect(() => {
    if (jumpedRef.current || pinned || liveIndex < 0) return;
    jumpedRef.current = true;
    const timer = window.setTimeout(() => show(liveIndex), 0);
    return () => window.clearTimeout(timer);
  }, [pinned, liveIndex, show]);

  const stage = STAGES[index];
  const next = STAGES[index + 1];
  const gap = next ? formatSpan(TIMES[index + 1] - TIMES[index]) : "";
  const built = Math.min(1, Math.max(0, (time - HACK_START) / (HACK_END - HACK_START)));

  return (
    <section id="journey" aria-labelledby="journey-heading" className="w-full">
      <div ref={trackRef} className="pin-track journey-track">
        <div ref={viewRef} className="pin-view mx-auto w-full max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
            <h2 id="journey-heading" className="text-2xl sm:text-4xl text-foreground">
              Explore the 24 hours
            </h2>
            <p className="text-sm text-text-muted">
              {pinned ? "Scroll to move through time, or scroll back to rewind." : "Pick a stage to see what happens."}
            </p>
          </div>

          <div className="journey-stage mt-3 sm:mt-4 flex flex-col overflow-hidden border border-brand-cyan/25 bg-background shadow-[0_0_60px_-20px_rgba(2,226,248,0.45)]">
            <div data-scene className="relative min-h-0 flex-1">
              <div className="absolute inset-0">
                <TimeRing timeRef={timeRef} labels={LABELS} liveIndex={liveIndex} now={now} onDrag={(steps) => select(index + steps)} />
              </div>

              {/* Digital clock in the middle of the ring. The canvas sets its position and size. */}
              <div className="pointer-events-none absolute inset-x-0 top-[var(--clock-y,50%)] flex -translate-y-1/2 flex-col items-center text-center">
                <p className="font-display text-[length:var(--clock-size,3rem)] font-bold leading-none tabular-nums text-foreground [text-shadow:0_0_26px_rgba(2,226,248,0.65),0_2px_10px_#000]">
                  {formatTime(time)}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-brand-cyan [text-shadow:0_0_6px_#000,0_0_12px_#000]">
                  {formatDay(time)} IST, {phaseAt(time)}
                </p>
                {/* How much of the 24 hours of building has passed */}
                <span aria-hidden="true" className="mt-2 block h-1 w-28 sm:w-44 overflow-hidden bg-white/20">
                  <span className="block h-full origin-left bg-brand-green shadow-[0_0_8px_#27f657]" style={{ transform: `scaleX(${built})` }} />
                </span>
              </div>

              {liveIndex >= 0 && index !== liveIndex && (
                <button
                  type="button"
                  onClick={() => select(liveIndex)}
                  className="absolute right-3 top-3 cursor-pointer bg-brand-green px-3 py-2 font-display text-sm font-bold text-black"
                >
                  Jump to now
                </button>
              )}
            </div>

            {/* What happens at this point */}
            <div className="flex items-center gap-2 sm:gap-4 border-t border-brand-cyan/25 bg-surface px-2 sm:px-4 py-3">
              <button type="button" onClick={() => select(index - 1)} disabled={index === 0} aria-label="Previous stage" className={ARROW}>
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <div className="relative min-h-[7.5rem] max-[379px]:min-h-[9rem] sm:min-h-20 flex-1 overflow-hidden text-center lg:text-left" aria-live="polite">
                <MotionConfig reducedMotion="user">
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={stage.id}
                      className="absolute inset-0 flex flex-col justify-center"
                      initial={{ opacity: 0, y: 28 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -28 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="font-display text-xl sm:text-2xl font-bold text-foreground">
                        {stage.name}
                        {index === liveIndex && <span className="ml-3 text-sm text-brand-green">Happening now</span>}
                      </p>
                      <p className="mt-1 text-sm leading-snug text-text-muted">{stage.detail}</p>
                      <p className="mt-1 text-xs text-brand-cyan lg:hidden">{next ? `Next: ${next.name}, ${gap} later` : "This is the final stage"}</p>
                    </motion.div>
                  </AnimatePresence>
                </MotionConfig>
              </div>

              {/* On wide screens the forward button also says what comes next */}
              <button
                type="button"
                onClick={() => select(index + 1)}
                disabled={!next}
                aria-label={next ? `Next stage: ${next.name}, ${gap} later` : "Next stage"}
                className={`${ARROW} lg:flex lg:h-14 lg:w-64 lg:items-center lg:justify-between lg:gap-3 lg:px-4 lg:text-left`}
              >
                <span className="hidden min-w-0 lg:block">
                  <span className="block truncate font-display text-base font-semibold">{next ? next.name : "Final stage"}</span>
                  <span className="block text-xs text-brand-cyan">{next ? `${gap} later` : "Nothing after this"}</span>
                </span>
                <ChevronRight className="size-5 shrink-0" aria-hidden="true" />
              </button>
            </div>

            {/* Time bar: grouped by day, fills as time moves, and jumps on click */}
            <div className="bg-surface px-2 sm:px-4 pb-2">
              <div aria-hidden="true" className="grid grid-cols-8 gap-1">
                {DAYS.map((day) => (
                  <p
                    key={day.day}
                    style={{ gridColumn: `span ${day.count}` }}
                    className="border-l-2 border-brand-cyan/60 pl-2 font-display text-xs font-semibold leading-none text-foreground"
                  >
                    {day.day}
                  </p>
                ))}
              </div>
              <ol ref={barRef} className="grid grid-cols-8 gap-1">
                {STAGES.map((item, i) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => select(i)}
                      aria-current={i === index ? "step" : undefined}
                      aria-label={`${item.name}, ${formatDay(TIMES[i])}, ${formatTime(TIMES[i])}`}
                      title={item.name}
                      className="group block w-full cursor-pointer py-2 text-left"
                    >
                      <span className="block h-1.5 overflow-hidden bg-white/15 group-hover:bg-white/30">
                        <span
                          className={`journey-fill block h-full origin-left ${i === index ? "bg-brand-green shadow-[0_0_12px_#27f657]" : "bg-brand-cyan"}`}
                          style={{ "--i": i } as CSSProperties}
                        />
                      </span>
                      <span className={`mt-1.5 hidden lg:block truncate font-display text-sm font-semibold ${i === index ? "text-brand-green" : "text-foreground"}`}>
                        {LABELS[i]}
                      </span>
                      <span className="mt-0.5 hidden md:block text-xs tabular-nums text-text-muted">{formatTime(TIMES[i])}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default JourneySection;
