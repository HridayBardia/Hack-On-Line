"use client";

import React, { useCallback, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { usePinnedScroll } from "@/hooks/usePinnedScroll";
import { RubricPie3D } from "./RubricPie3D";

export interface Criterion {
  percentage: string;
  title: string;
  summary: string;
}

/** The pie holds on screen while scrolling moves through the criteria, like the floors in AboutSection */
export function RubricMatrix({ criteria }: { criteria: Criterion[] }) {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  // Exact slice, including positions between slices. Null when slices are picked by clicking.
  const stepRef = useRef<number | null>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const count = criteria.length;
  const weights = criteria.map((c) => parseInt(c.percentage, 10));
  const shares = weights.map((w) => w / 100); // the pie reads these once, when it starts
  const total = weights.slice(0, active + 1).reduce((sum, w) => sum + w, 0);

  const { pinned, scrollToStep } = usePinnedScroll(trackRef, count, (step, progress) => {
    stepRef.current = step;
    if (step === null) return;
    setActive(Math.round(step));
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
  });

  // Clicking a slice scrolls to it, so the scroll position and the slice always agree
  const select = useCallback(
    (index: number) => {
      if (!scrollToStep(index)) setActive(index);
    },
    [scrollToStep]
  );

  return (
    // A tall track: its scroll length is what moves between slices
    <div ref={trackRef} className="pin-track floors-track -mx-4 sm:-mx-6 mb-16">
      <div className="pin-view px-4 sm:px-6">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl text-foreground">Judging Rubrics</h2>
        <p data-scroll="rise" className="mt-2 max-w-2xl text-sm sm:text-lg leading-relaxed text-text-muted">
          {pinned ? "Keep scrolling to go through the four criteria that add up to 100%." : "Pick one of the four criteria that add up to 100%."}
        </p>

        <div className="floors-stage mt-4 sm:mt-6 grid gap-px bg-white/10 lg:grid-cols-[1.5fr_1fr]">
          <div data-scroll="stage" className="floors-scene relative overflow-hidden bg-[radial-gradient(circle_at_50%_55%,#0b1f27_0%,#050607_70%)]">
            <div className="absolute inset-0">
              <RubricPie3D
                shares={shares}
                active={active}
                stepRef={stepRef}
                playing={playing}
                onSelect={select}
                label={`A 3D pie chart of the judging weights: ${criteria.map((c) => `${c.title} ${c.percentage}`).join(", ")}.`}
              />
            </div>

            <p className="pointer-events-none absolute left-3 right-3 top-3 sm:left-4 sm:top-4 flex items-center gap-2 font-display text-sm sm:text-base font-semibold text-foreground">
              <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand-green shadow-[0_0_10px_#27f657]" />
              {criteria[active].title}
            </p>
            <p className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4 font-display text-sm text-text-muted">
              Running total <span className="text-xl font-bold tabular-nums text-brand-green">{total}%</span>
            </p>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause animation" : "Play animation"}
              className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 grid size-11 cursor-pointer place-items-center border border-white/15 bg-background/60 text-foreground transition-colors hover:border-brand-green hover:text-brand-green motion-reduce:hidden"
            >
              {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            </button>
          </div>

          <div data-scroll="rise" className="flex min-h-0 flex-col bg-surface">
            {/* How far through the criteria the visitor has scrolled */}
            {pinned && (
              <span aria-hidden="true" className="block h-1 w-full bg-white/10">
                <span ref={fillRef} className="block h-full w-full origin-left scale-x-0 bg-brand-green" />
              </span>
            )}
            {/* On small pinned screens only the current criterion is listed, with these to jump between them */}
            <div className="floors-jump hidden justify-center gap-1">
              {criteria.map((item, i) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => select(i)}
                  aria-label={`${item.title}, ${item.percentage}`}
                  aria-current={i === active ? "step" : undefined}
                  className="grid size-11 cursor-pointer place-items-center"
                >
                  <span className={`size-3 rotate-45 border-2 ${i === active ? "border-brand-green bg-brand-green" : "border-brand-cyan"}`} />
                </button>
              ))}
            </div>
            <ul className="flex flex-auto flex-col">
              {criteria.map((item, i) => {
                const selected = i === active;
                return (
                  <li
                    key={item.title}
                    className={`flex flex-auto flex-col justify-center border-b border-white/10 last:border-b-0 ${selected ? "bg-surface-raised" : "floors-other"}`}
                  >
                    <h3 className="text-base sm:text-xl">
                      <button
                        type="button"
                        onClick={() => select(i)}
                        aria-expanded={selected}
                        aria-controls={`rubric-${i}`}
                        className={`flex w-full cursor-pointer items-center gap-3 px-5 py-3 sm:py-4 text-left transition-colors ${
                          selected ? "text-foreground" : "text-text-muted hover:text-foreground"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`size-3 shrink-0 rotate-45 border-2 transition-colors ${selected ? "border-brand-green bg-brand-green" : "border-brand-cyan"}`}
                        />
                        <span className="flex-1">{item.title}</span>
                        <span className={`font-display text-xl sm:text-2xl font-bold tabular-nums ${selected ? "text-brand-green" : "text-brand-cyan"}`}>
                          {item.percentage}
                        </span>
                      </button>
                    </h3>
                    <div
                      id={`rubric-${i}`}
                      inert={!selected}
                      className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                        selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-4 pl-11 text-sm sm:text-base leading-relaxed text-foreground">{item.summary}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
