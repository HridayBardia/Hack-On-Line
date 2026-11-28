"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { useNow } from "@/hooks/useNow";
import { EVENT_END, EVENT_START } from "@/lib/event";

const START = Date.parse(EVENT_START);
const END = Date.parse(EVENT_END);

const TICKS = Array.from({ length: 60 }, (_, i) => i);
const BOOT_MS = 2000;

/** A digit that rolls: the new one drops in while the old one falls away */
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.15em] w-[0.68em] overflow-hidden leading-[1.15em]">
      <AnimatePresence initial={false}>
        <motion.span
          key={value}
          className="absolute inset-0 text-center"
          initial={{ y: "-100%", opacity: 0 }}
          animate={{ y: "0%", opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Roll({ value }: { value: string }) {
  return (
    <span className="inline-flex">
      {/* Keys count from the right so digits keep their place when the length changes */}
      {Array.from(value).map((digit, i) => (
        <Digit key={value.length - i} value={digit} />
      ))}
    </span>
  );
}

/** An arc that shows how much of a unit is left */
function Arc({ radius, fraction, className }: { radius: number; fraction: number; className: string }) {
  return (
    <>
      <circle cx="150" cy="150" r={radius} className="dial-track" />
      <circle
        cx="150"
        cy="150"
        r={radius}
        pathLength={100}
        strokeDasharray="100 100"
        strokeDashoffset={100 - fraction * 100}
        transform="rotate(-90 150 150)"
        className={`dial-arc ${className}`}
      />
    </>
  );
}

/** `ready` turns true when the intro screen starts to close, so the dial powers up in view. */
export function Countdown({ ready }: { ready: boolean }) {
  const now = useNow(1000);

  // The dial powers down when it leaves the screen, so it powers up again every time it returns
  const dialRef = useRef<HTMLDivElement>(null);
  const inView = useInView(dialRef, 0.3);
  const on = ready && inView;

  // During power-up the ticks light one after another
  const [booted, setBooted] = useState(false);
  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(on), on ? BOOT_MS : 0);
    return () => window.clearTimeout(timer);
  }, [on]);

  if (now !== null && now >= END) {
    return <p className="font-display text-2xl font-bold text-brand-cyan">The hackathon has ended</p>;
  }

  // Before the start it counts to the start; during the event, to the code freeze
  const live = now !== null && now >= START;
  const known = now !== null && on;
  const left = now === null ? 0 : Math.max(0, (live ? END : START) - now);
  const total = Math.ceil(left / 1000);
  const days = Math.floor(total / 86_400);
  const hours = Math.floor(total / 3600) % 24;
  const minutes = Math.floor(total / 60) % 60;
  const seconds = total % 60;

  const pad = (n: number) => (now === null ? "--" : String(n).padStart(2, "0"));
  const label = live ? "Code freeze in" : "Hacking starts in";

  return (
    <div>
      <p className="text-center text-sm text-text-muted">
        {live && <span className="mr-2 inline-block size-2 rounded-full bg-brand-green" aria-hidden="true" />}
        {label}
      </p>
      <p className="sr-only">
        {now === null ? "Loading countdown" : `${days} days, ${hours} hours, ${minutes} minutes`}
      </p>

      <MotionConfig reducedMotion="user">
        <div ref={dialRef} aria-hidden="true" className="dial relative mx-auto mt-3 aspect-square w-full max-w-[19rem]">
          <svg viewBox="0 0 300 300" className="absolute inset-0 size-full">
            {/* Slowly turning outer ring */}
            <circle cx="150" cy="150" r="147" className="dial-orbit" />

            {/* One tick for each second left in the minute */}
            {TICKS.map((i) => {
              const lit = known && i < (seconds || 60);
              const head = known && i === (seconds || 60) - 1;
              return (
                <line
                  key={i}
                  x1="150"
                  x2="150"
                  y1={head ? 7 : 11}
                  y2="24"
                  transform={`rotate(${(i + 1) * 6} 150 150)`}
                  className={`dial-tick ${lit ? "dial-tick-lit" : ""} ${head ? "dial-tick-head" : ""}`}
                  style={booted ? undefined : { transitionDelay: `${i * 22}ms` }}
                />
              );
            })}

            <Arc radius={116} fraction={known ? minutes / 60 : 0} className="stroke-brand-cyan" />
            <Arc radius={106} fraction={known ? hours / 24 : 0} className="stroke-brand-cyan-soft" />

            {/* A ping goes out every second; the key restarts the animation */}
            {booted && <circle key={seconds} cx="150" cy="150" r="126" className="dial-ping" />}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center font-display font-bold tabular-nums text-foreground">
            {!live && (
              <>
                <span className="text-5xl sm:text-6xl">{now === null ? "--" : <Roll value={String(days)} />}</span>
                <span className="-mt-1 text-sm font-medium text-brand-cyan">days</span>
              </>
            )}
            <div className={`flex items-start ${live ? "text-3xl sm:text-4xl" : "mt-2 text-2xl"}`}>
              {[
                { value: pad(hours), unit: "hrs" },
                { value: pad(minutes), unit: "min" },
                { value: pad(seconds), unit: "sec" },
              ].map((part, i) => (
                <div key={part.unit} className="flex items-start">
                  {i > 0 && <span className="dial-colon px-0.5 text-brand-cyan">:</span>}
                  <span className="flex flex-col items-center">
                    <span className={part.unit === "sec" ? "text-brand-green" : ""}>
                      <Roll value={part.value} />
                    </span>
                    <span className="font-sans text-[11px] font-normal text-text-muted">{part.unit}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </MotionConfig>
    </div>
  );
}

export default Countdown;
