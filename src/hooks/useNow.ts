"use client";

import { useEffect, useState } from "react";

/** Current time, refreshed every `interval` ms. Null until mounted, so prerendered markup matches. */
export function useNow(interval = 30_000) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = window.setTimeout(tick, 0);
    const timer = window.setInterval(tick, interval);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(timer);
    };
  }, [interval]);

  return now;
}
