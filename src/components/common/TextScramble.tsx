"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface TextScrambleProps {
  text: string;
  className?: string;
  as?: "span" | "h1" | "h2" | "h3" | "h4" | "p" | "div";
  triggerOnHover?: boolean;
  speed?: number; // Milliseconds between glyph updates
  cyclesPerChar?: number; // Number of random cycles per resolved character
  children?: React.ReactNode;
}

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!<>-_\\/[]{}—=+*^?#_";

export function useTextScramble(
  text: string,
  options: { speed?: number; cyclesPerChar?: number } = {}
) {
  const [displayText, setDisplayText] = useState(text);
  const [prevText, setPrevText] = useState(text);
  if (text !== prevText) {
    setPrevText(text);
    setDisplayText(text);
  }
  const [isScrambling, setIsScrambling] = useState(false);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const speed = options.speed ?? 25;
  const cyclesPerChar = options.cyclesPerChar ?? 2;

  const scramble = useCallback(() => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsScrambling(true);

    const length = text.length;
    let frame = 0;
    const totalFrames = length * cyclesPerChar;
    let lastTime = performance.now();

    const update = (now: number) => {
      if (now - lastTime >= speed) {
        lastTime = now;
        frame++;

        const progress = frame / totalFrames;
        const revealedChars = Math.floor(progress * length);

        let output = "";
        for (let i = 0; i < length; i++) {
          if (text[i] === " ") {
            output += " ";
          } else if (i < revealedChars) {
            output += text[i];
          } else {
            output += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          }
        }

        setDisplayText(output);

        if (frame >= totalFrames) {
          setDisplayText(text);
          setIsScrambling(false);
          return;
        }
      }

      frameRef.current = requestAnimationFrame(update);
    };

    frameRef.current = requestAnimationFrame(update);
  }, [text, speed, cyclesPerChar]);

  useEffect(() => {
    const frame = frameRef.current;
    const timeout = timeoutRef.current;
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (timeout) clearTimeout(timeout);
    };
  }, [text]);

  return { displayText, scramble, isScrambling };
}

export function TextScramble({
  text,
  className = "",
  as: Component = "span",
  triggerOnHover = true,
  speed = 24,
  cyclesPerChar = 3,
}: TextScrambleProps) {
  const { displayText, scramble } = useTextScramble(text, { speed, cyclesPerChar });

  return (
    <Component
      className={`inline-block ${className}`}
      onMouseEnter={triggerOnHover ? scramble : undefined}
    >
      {displayText}
    </Component>
  );
}
