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
    <div className="min-h-screen bg-[#050607] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-danger/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-danger/10 border border-danger/20 text-xs font-mono text-danger">
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
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-green text-black font-bold text-sm hover:bg-brand-green-soft transition-all shadow-[0_0_24px_rgba(39,246,87,0.3)] cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Re-initialize State</span>
          </button>
        </div>
      </div>
    </div>
  );
}
