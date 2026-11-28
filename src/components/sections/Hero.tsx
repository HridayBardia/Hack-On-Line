"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { Calendar } from "lucide-react";
import { Countdown } from "../Countdown";
import { CALENDAR_URL } from "@/lib/event";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText);
}

const facts = [
  { label: "Entry", value: "Free" },
  { label: "Team size", value: "1–4" },
  { label: "Problem tracks", value: "5" },
];

const rotatingPhrases = ["5 problem tracks.", "Free to enter.", "Teams of 1 to 4.", "100% online."];

/** `ready` turns true when the intro screen starts to close. */
export function Hero({ ready }: { ready: boolean }) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ready || !ref.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let splits: SplitText[] = [];
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const headline = new SplitText(q("[data-hero-headline]"), { type: "words,chars" });
      const phrases = (q("[data-hero-phrase]") as HTMLElement[]).map(
        (el) => new SplitText(el, { type: "words,chars" })
      );
      splits = [headline, ...phrases];

      // Letters rise out of a blur
      gsap.fromTo(
        headline.chars,
        { opacity: 0, y: 80, filter: "blur(5px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.inOut", stagger: 0.025, delay: 0.2 }
      );
      gsap.fromTo(
        q("[data-hero-fade]"),
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power2.out", stagger: 0.12, delay: 0.4 }
      );

      // Rotating line: one phrase leaves upwards as the next arrives from below
      gsap.set(q("[data-hero-phrase]"), { autoAlpha: 1 });
      phrases.forEach((p, i) => {
        if (i > 0) gsap.set(p.chars, { yPercent: 110 });
      });
      const loop = gsap.timeline({ repeat: -1, delay: 1.4 });
      phrases.forEach((current, i) => {
        const next = phrases[(i + 1) % phrases.length];
        loop
          .to(current.chars, { yPercent: -110, duration: 0.8, ease: "power3.inOut", stagger: 0.025 }, "+=1.8")
          .fromTo(
            next.chars,
            { yPercent: 110 },
            { yPercent: 0, duration: 0.8, ease: "power3.inOut", stagger: 0.025, immediateRender: false },
            "<0.15"
          );
      });
    }, ref);

    return () => {
      ctx.revert();
      splits.forEach((s) => s.revert());
    };
  }, [ready]);

  return (
    <section
      id="hero"
      ref={ref}
      className="mx-auto w-full max-w-6xl px-4 sm:px-6 pt-28 md:pt-36 pb-16 md:pb-24"
    >
      <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16 lg:items-center">
        <div data-scroll="depth">
          <h1>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-hero-fade
              src="/logo.png"
              alt="Hack On-Line 2027"
              width={700}
              height={475}
              fetchPriority="high"
              className="h-auto w-full max-w-[17rem] sm:max-w-md"
            />
            <span data-hero-headline className="mt-6 block text-3xl sm:text-5xl leading-tight text-foreground text-balance">
              Build and ship in 24 hours.
            </span>
          </h1>

          {/* Phrases are stacked in one grid cell, so the height never jumps */}
          <p className="sr-only">{rotatingPhrases.join(" ")}</p>
          <div
            aria-hidden="true"
            data-hero-fade
            className="mt-2 grid overflow-hidden font-display text-2xl sm:text-3xl font-semibold text-brand-cyan"
          >
            {rotatingPhrases.map((phrase, i) => (
              <span key={phrase} data-hero-phrase className={`[grid-area:1/1] ${i === 0 ? "" : "invisible"}`}>
                {phrase}
              </span>
            ))}
          </div>

          <p data-hero-fade className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-text-muted">
            A virtual developer hackathon on 30–31 January 2027, from 10:00 AM to 10:00 AM IST.
          </p>

          <div data-hero-fade className="mt-7 flex flex-wrap items-center gap-3">
            <a href={CALENDAR_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
              <Calendar className="size-4" aria-hidden="true" />
              Add to calendar
            </a>
            <a href="#tracks" className="btn btn-secondary">
              View tracks
            </a>
          </div>
          <p data-hero-fade className="mt-3 text-sm text-text-muted">Registration opens soon.</p>
        </div>

        {/* Outer element moves with scroll, inner one fades in on load */}
        <div data-scroll="depth">
        <div data-hero-fade className="bg-surface p-5 sm:p-7">
          <Countdown ready={ready} />
          <dl className="mt-6 divide-y divide-white/10 border-t border-white/10">
            {facts.map((fact) => (
              <div key={fact.label} className="flex items-baseline justify-between gap-4 py-3">
                <dt className="text-text-muted">{fact.label}</dt>
                <dd className="font-display text-xl font-semibold text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        </div>
      </div>

    </section>
  );
}

export default Hero;
