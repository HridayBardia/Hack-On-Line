"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, Radio } from "lucide-react";
import { sound } from "@/lib/sound";

interface IntroPreloaderProps {
  onComplete: () => void;
}

export function IntroPreloader({ onComplete }: IntroPreloaderProps) {
  const targetWord = "HACK ON-LINE";
  const scrambleChars = "01#X%@&*§∆+=-_~/?[]{}";

  const [progress, setProgress] = useState(0);
  const [displayText, setDisplayText] = useState<string[]>(
    new Array(targetWord.length).fill("_")
  );
  const [lockedIndices, setLockedIndices] = useState<boolean[]>(
    new Array(targetWord.length).fill(false)
  );
  const [statusLog, setStatusLog] = useState("INITIALIZING RUNTIME ENVIRONMENT...");
  const [isFinishing, setIsFinishing] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 4) + 1;
      if (currentProgress > 100) currentProgress = 100;
      setProgress(currentProgress);

      if (currentProgress < 25) {
        setStatusLog("ALLOCATING RUNTIME BUFFER: 0x00000000 -> 0x7F4A2B10");
      } else if (currentProgress < 50) {
        setStatusLog("CALIBRATING 24H SYNCHRONOUS SPRINT TELEMETRY...");
      } else if (currentProgress < 75) {
        setStatusLog("DECODING 10 PROBLEM TRACK SECTORS...");
      } else if (currentProgress < 98) {
        setStatusLog("VERIFYING ATOMIC CHRONOMETER: 30-31 JAN 2027...");
      } else {
        setStatusLog("SYSTEM PRIMED // ACCESS GRANTED");
      }

      if (currentProgress === 100) {
        clearInterval(progressInterval);
      }
    }, 45);

    return () => clearInterval(progressInterval);
  }, []);

  // Letter by Letter Word Decoding Engine
  useEffect(() => {
    let lockPointer = 0;

    const decodeInterval = setInterval(() => {

      // When progress passes 20%, start locking letters sequentially
      if (progress > 20 && lockPointer < targetWord.length) {
        // Step to next letter lock every few ticks based on progress
        const expectedLockIndex = Math.floor(
          ((progress - 20) / 75) * targetWord.length
        );

        if (expectedLockIndex > lockPointer && lockPointer < targetWord.length) {
          lockPointer++;
          sound.playClick();
        }
      }

      // Generate current frame text
      const newDisplay = targetWord.split("").map((targetChar, idx) => {
        if (idx < lockPointer) {
          return targetChar;
        } else if (targetChar === " ") {
          return " ";
        } else {
          return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
        }
      });

      const newLocked = targetWord.split("").map((_, idx) => idx < lockPointer);

      setDisplayText(newDisplay);
      setLockedIndices(newLocked);

      // Check if all letters are locked and progress is 100%
      if (lockPointer >= targetWord.length && progress >= 100) {
        clearInterval(decodeInterval);
        setIsFinishing(true);
        sound.playSuccess();
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, 50);

    return () => clearInterval(decodeInterval);
  }, [progress, onComplete]);

  const handleSkip = () => {
    sound.playClick();
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isFinishing ? 0 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-0 z-50 flex flex-col justify-between p-6 sm:p-12 bg-[#030303] font-mono text-white select-none overflow-hidden"
    >
      {/* Background Micro Grid */}
      <div className="absolute inset-0 bg-micro-grid opacity-20 pointer-events-none" />

      {/* Laser Scanning Line */}
      <motion.div
        animate={{ y: ["-100%", "2000%"] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/40 via-[#FF8C66]/40 to-transparent pointer-events-none"
      />

      {/* Top Header Bar */}
      <div className="relative z-10 flex items-center justify-between text-xs text-[#71717A] border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
          <span className="text-white font-bold tracking-widest uppercase">
            HACK ON-LINE // SYSTEM BOOT
          </span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline text-[#A1A1AA] text-[11px]">
            SCHEDULE: 30-31 JAN 2027
          </span>
          <button
            onClick={handleSkip}
            className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-[#A1A1AA] hover:text-white transition-colors cursor-pointer"
          >
            ESC // SKIP
          </button>
        </div>
      </div>

      {/* Center Monolithic Decoding Display */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center py-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#06B6D4] font-semibold mb-6 tracking-widest uppercase">
          <Cpu className="w-3.5 h-3.5 text-[#FF8C66] animate-spin" />
          <span>DECODING IDENTITY SECTORS</span>
        </div>

        {/* Monolithic Letters Scrambler Display */}
        <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2.5 max-w-4xl px-2">
          {displayText.map((char, index) => {
            const isLocked = lockedIndices[index];
            const isSpace = char === " ";

            if (isSpace) {
              return <div key={index} className="w-3 sm:w-8" />;
            }

            return (
              <motion.div
                key={index}
                initial={{ scale: 0.9 }}
                animate={{
                  scale: isLocked ? [1.2, 1] : 1,
                }}
                transition={{ duration: 0.2 }}
                className={`relative flex items-center justify-center w-8 h-12 sm:w-16 sm:h-24 md:w-20 md:h-28 text-3xl sm:text-6xl md:text-7xl font-black font-mono tracking-tighter rounded-xl transition-all duration-150 ${isLocked
                  ? "text-white bg-white/[0.04] border border-white/20 shadow-[0_0_25px_rgba(255,255,255,0.15)]"
                  : "text-[#52525B] bg-white/[0.01] border border-white/5"
                  }`}
              >
                {/* Letter character */}
                <span className={isLocked ? "metallic-text-gradient drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" : ""}>
                  {char}
                </span>

                {/* Laser lock dot */}
                {isLocked && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute bottom-1 w-1 h-1 rounded-full bg-[#06B6D4]"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Subline Tag */}
        <p className="mt-8 text-xs sm:text-sm text-[#A1A1AA] tracking-widest uppercase font-mono">
          24H VIRTUAL ENGINEERING SPRINT • 10 PROBLEM TRACKS
        </p>
      </div>

      {/* Bottom Progress Telemetry Bar */}
      <div className="relative z-10 border-t border-white/5 pt-6 max-w-5xl mx-auto w-full">
        <div className="flex items-center justify-between text-xs mb-3">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#10B981] animate-pulse" />
            <span className="text-[#A1A1AA] text-[11px] font-semibold">{statusLog}</span>
          </div>

          <div className="text-sm font-black text-white font-mono">
            {progress}%
          </div>
        </div>

        {/* Progress Strip */}
        <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div
            style={{ width: `${progress}%` }}
            className="h-full bg-gradient-to-r from-[#FF8C66] via-[#8B5CF6] via-[#06B6D4] to-[#10B981] shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-75"
          />
        </div>

        <div className="flex items-center justify-between mt-3 text-[10px] text-[#71717A]">
          <span>GENESIS PROTOCOL READY</span>
          <span>100% PRODUCTION DEPLOYMENTS REQUIRED</span>
        </div>
      </div>
    </motion.div>
  );
}
