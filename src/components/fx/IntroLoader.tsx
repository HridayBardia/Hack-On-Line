"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_MS = 1600;
const WELCOME_MS = 450;
const EXIT_MS = 750;

const words = ["Hack On-Line 2027", "24-hour virtual hackathon", "5 problem tracks", "Free entry"];

type Phase = "loading" | "welcome" | "exit" | "gone";

/** Short intro screen. Click or press any key to skip. Skipped for reduced motion. */
export function IntroLoader({ onDone }: { onDone: () => void }) {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const skipRef = useRef<() => void>(() => {});

  useEffect(() => {
    const timers: number[] = [];
    let frame = 0;
    let exiting = false;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    const exit = () => {
      if (exiting) return;
      exiting = true;
      window.cancelAnimationFrame(frame);
      document.documentElement.style.overflow = previousOverflow;
      setPhase("exit");
      // the page animates in while the loader is still closing
      onDone();
      timers.push(window.setTimeout(() => setPhase("gone"), EXIT_MS));
    };
    skipRef.current = exit;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    const count = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      setPercent(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) {
        frame = window.requestAnimationFrame(count);
      } else {
        setPhase("welcome");
        timers.push(window.setTimeout(exit, WELCOME_MS));
      }
    };

    if (reduced) timers.push(window.setTimeout(exit, 0));
    else frame = window.requestAnimationFrame(count);

    window.addEventListener("keydown", exit);
    return () => {
      window.removeEventListener("keydown", exit);
      window.cancelAnimationFrame(frame);
      timers.forEach((t) => window.clearTimeout(t));
      document.documentElement.style.overflow = previousOverflow;
    };
  }, [onDone]);

  if (phase === "gone") return null;

  return (
    <div className={`intro ${phase === "exit" ? "intro-exit" : ""}`} onClick={() => skipRef.current()}>
      <div aria-hidden="true" className="intro-marquee">
        {[0, 1].map((copy) => (
          <div key={copy} className="intro-marquee-track">
            {words.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        ))}
      </div>

      <div className={`intro-pill ${phase !== "loading" ? "intro-pill-done" : ""}`} role="status">
        {phase === "loading" ? (
          <>
            <span>Loading</span>
            <span className="intro-percent">{percent}%</span>
            <span aria-hidden="true" className="intro-caret" />
          </>
        ) : (
          <span>Welcome</span>
        )}
      </div>
    </div>
  );
}
