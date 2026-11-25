"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[APPLICATION CRASH CAUGHT BY ERROR BOUNDARY]", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-mono text-rose-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>RUNTIME_FAULT_INTERCEPTED</span>
        </div>

        <h1 className="text-5xl font-black tracking-tight text-white font-mono">
          System Interrupted
        </h1>

        <p className="text-sm text-zinc-400 leading-relaxed">
          An unexpected execution anomaly occurred. The system self-isolated to prevent state corruption.
        </p>

        <div className="pt-2">
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-all shadow-[0_0_24px_rgba(255,255,255,0.2)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-initialize State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
