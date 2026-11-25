"use client";

import React, { useRef, useEffect, useState } from "react";

export interface SectionHeadingProps {
  index?: string;
  label?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  index,
  label,
  eyebrow,
  title,
  subtitle,
  align = "left",
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const indexText = index && label ? `${index} / ${label}` : index || eyebrow || "";
  const words = title.split(" ");
  const alignClass =
    align === "center" ? "text-center mx-auto items-center" : "text-left items-start";

  return (
    <div
      ref={containerRef}
      className={`relative w-full mb-10 md:mb-14 flex flex-col ${alignClass} ${className}`}
    >
      {/* Radial soft pool of ambient light behind title */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute -top-16 ${
          align === "center" ? "left-1/2 -translate-x-1/2" : "left-0 sm:-left-12"
        } w-[min(450px,100%)] h-[240px] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.06)_0%,transparent_70%)] blur-2xl z-0`}
      />

      {/* Index Line with 40px Hairline */}
      {indexText && (
        <div className="relative z-10 flex items-center gap-3 mb-3 select-none font-mono">
          <span className="text-[13px] tracking-normal text-[#9A9AA0]">
            {indexText}
          </span>
          <span className="w-10 h-px bg-white/20 inline-block" />
        </div>
      )}

      {/* Title: Metallic Text with *Italic Accent* support */}
      <h2
        className="relative z-10 font-bold tracking-[-0.035em] leading-[1.15]"
        style={{ fontSize: "clamp(32px, 6vw, 76px)" }}
        aria-label={title.replace(/\*/g, "")}
      >
        {words.map((rawWord, i) => {
          const isItalic = rawWord.startsWith("*") && rawWord.endsWith("*");
          const cleanWord = isItalic ? rawWord.slice(1, -1) : rawWord;

          return (
            <React.Fragment key={i}>
              {i > 0 && " "}
              <span className="inline-block py-0.5">
                <span
                  className={`inline-block transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    isItalic
                      ? "font-light italic text-[#FFFFFF] tracking-normal pr-[0.18em]"
                      : "metallic-text-gradient font-bold"
                  }`}
                  style={{
                    transform: isInView ? "translateY(0%)" : "translateY(115%)",
                    transitionDelay: `${i * 60}ms`,
                  }}
                >
                  {cleanWord}
                </span>
              </span>
            </React.Fragment>
          );
        })}
      </h2>

      {/* Optional Subtitle */}
      {subtitle && (
        <p
          className="relative z-10 mt-3 sm:mt-4 text-[15px] sm:text-[17px] text-[#A1A1AA] font-normal leading-[1.6] max-w-[62ch] transition-opacity duration-700 ease-out"
          style={{
            opacity: isInView ? 1 : 0,
            transitionDelay: `${words.length * 60 + 80}ms`,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
