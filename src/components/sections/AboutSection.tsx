"use client";

import { useCallback, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { BuildStack } from "@/components/about/BuildStack";
import { usePinnedScroll } from "@/hooks/usePinnedScroll";

// In the same order as the floors of the 3D stack, bottom first
const principles = [
  {
    id: "fresh",
    title: "Start from scratch",
    caption: "Commit history, from 10:00 AM",
    text: "Your project is built during the 24 hours. Judges check the repository history, so start your commits after 10:00 AM IST on 30 January.",
    points: ["No projects built before the event", "Commit times are checked"],
  },
  {
    id: "live",
    title: "Ship it live",
    caption: "Your project on a public link",
    text: "Your project must run on a public link, with working APIs and real interactions. Slides and mock screens don't replace it.",
    points: ["Host it anywhere public, such as Vercel, Railway, Cloudflare or AWS", "Errors should be handled properly"],
  },
  {
    id: "review",
    title: "Reviewed by engineers",
    caption: "Code review in progress",
    text: "Working software engineers and startup architects read your code and look at how you built it.",
    points: ["Code quality, structure and type safety", "Maintainability and room to grow"],
  },
  {
    id: "own",
    title: "You own it",
    caption: "Your project stays yours",
    text: "Your team keeps all rights to what it builds. Hack On-Line takes no equity and no rights.",
    points: ["You choose the license", "Keep building it into a product or open-source project"],
  },
];

const COUNT = principles.length;

export function AboutSection() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(true);
  const trackRef = useRef<HTMLDivElement>(null);
  // Exact floor, including positions between floors. Null when floors are picked by clicking.
  const floorRef = useRef<number | null>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  const { pinned, scrollToStep } = usePinnedScroll(trackRef, COUNT, (floor, progress) => {
    floorRef.current = floor;
    if (floor === null) return;
    setActive(Math.round(floor));
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`;
  });

  // Clicking a floor scrolls to it, so the scroll position and the floor always agree
  const select = useCallback(
    (index: number) => {
      if (!scrollToStep(index)) setActive(index);
    },
    [scrollToStep]
  );
  return (
    <section id="about" aria-labelledby="about-heading" className="w-full">
      {/* A tall track: its scroll length is what moves between floors */}
      <div ref={trackRef} className="pin-track floors-track">
        <div className="pin-view mx-auto w-full max-w-6xl px-4 sm:px-6">
          <h2 id="about-heading" className="text-2xl sm:text-4xl lg:text-5xl text-foreground">
            Engineering over presentations
          </h2>
          <p data-scroll="rise" className="mt-2 max-w-2xl text-sm sm:text-lg leading-relaxed text-text-muted">
            {pinned ? "Keep scrolling to go up through the four floors." : "See the four things every project is built on."}
          </p>

          <div className="floors-stage mt-4 sm:mt-6 grid gap-px bg-white/10 lg:grid-cols-[1.5fr_1fr]">
            <div data-scroll="stage" className="floors-scene relative overflow-hidden bg-[radial-gradient(circle_at_50%_55%,#0b1f27_0%,#050607_70%)]">
              <div className="absolute inset-0">
                <BuildStack active={active} floorRef={floorRef} playing={playing} onSelect={select} />
              </div>

              <p className="pointer-events-none absolute left-3 top-3 sm:left-4 sm:top-4 flex items-center gap-2 font-display text-sm sm:text-base font-semibold text-foreground">
                <span aria-hidden="true" className="size-2 rounded-full bg-brand-green shadow-[0_0_10px_#27f657]" />
                {principles[active].caption}
              </p>
              <p className="pointer-events-none absolute bottom-3 left-3 sm:bottom-4 sm:left-4 font-display text-sm text-text-muted">
                Floor <span className="text-xl font-bold text-brand-green">{active + 1}</span> of {COUNT}
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
              {/* How far through the floors the visitor has scrolled */}
              {pinned && (
                <span aria-hidden="true" className="block h-1 w-full bg-white/10">
                  <span ref={fillRef} className="block h-full w-full origin-left scale-x-0 bg-brand-green" />
                </span>
              )}
              {/* On small pinned screens only the current floor is listed, with these to jump between them */}
              <div className="floors-jump hidden justify-center gap-1">
                {principles.map((item, i) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => select(i)}
                    aria-label={`Floor ${i + 1}: ${item.title}`}
                    aria-current={i === active ? "step" : undefined}
                    className="grid size-11 cursor-pointer place-items-center"
                  >
                    <span className={`size-3 rotate-45 border-2 ${i === active ? "border-brand-green bg-brand-green" : "border-brand-cyan"}`} />
                  </button>
                ))}
              </div>
              <ul className="flex flex-auto flex-col">
                {principles.map((item, i) => {
                  const selected = i === active;
                  return (
                    <li
                      key={item.id}
                      className={`flex-auto border-b border-white/10 last:border-b-0 ${selected ? "bg-surface-raised" : "floors-other"}`}
                    >
                      <h3 className="text-lg sm:text-2xl">
                        <button
                          type="button"
                          onClick={() => select(i)}
                          aria-expanded={selected}
                          aria-controls={`about-${item.id}`}
                          className={`flex w-full cursor-pointer items-center gap-4 px-5 py-3 sm:py-4 text-left transition-colors ${
                            selected ? "text-foreground" : "text-text-muted hover:text-foreground"
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className={`size-3 shrink-0 rotate-45 border-2 transition-colors ${selected ? "border-brand-green bg-brand-green" : "border-brand-cyan"}`}
                          />
                          {item.title}
                        </button>
                      </h3>
                      <div
                        id={`about-${item.id}`}
                        inert={!selected}
                        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                          selected ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="px-5 pb-4 sm:pb-5 pl-12">
                            <p className="text-sm sm:text-base leading-relaxed text-foreground">{item.text}</p>
                            <ul className="floors-points mt-2 list-disc space-y-1 pl-4 text-xs sm:text-sm leading-relaxed text-text-muted marker:text-brand-cyan">
                              {item.points.map((point) => (
                                <li key={point}>{point}</li>
                              ))}
                            </ul>
                          </div>
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
    </section>
  );
}

export default AboutSection;
