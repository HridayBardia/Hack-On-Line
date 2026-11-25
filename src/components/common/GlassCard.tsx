"use client";

import React, { useRef, forwardRef, useImperativeHandle } from "react";
import clsx from "clsx";

export interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  radius?: "large" | "small";
  hoverEffect?: boolean;
  spotlight?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  (
    {
      children,
      className,
      radius = "large",
      hoverEffect = true,
      spotlight = true,
      onPointerMove,
      ...props
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    useImperativeHandle(ref, () => cardRef.current as HTMLDivElement);

    const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
      if (spotlight && cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        cardRef.current.style.setProperty("--mx", `${x}px`);
        cardRef.current.style.setProperty("--my", `${y}px`);
      }
      if (onPointerMove) onPointerMove(e);
    };

    const radiusClass = radius === "small" ? "rounded-[20px]" : "rounded-[28px]";

    return (
      <div
        ref={cardRef}
        onPointerMove={handlePointerMove}
        className={clsx(
          "relative overflow-hidden p-6 sm:p-8 md:p-9 glass-card glass-card-border",
          radiusClass,
          hoverEffect && "cursor-default hover:-translate-y-0.5",
          className
        )}
        {...props}
      >
        {/* Dynamic Pointer Spotlight Glow */}
        {spotlight && <div className="glass-card-spotlight" aria-hidden="true" />}

        {/* Card Content */}
        <div className="relative z-10 w-full h-full">{children}</div>
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";
