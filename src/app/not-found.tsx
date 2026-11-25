import Link from "next/link";
import { Terminal, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-cyan-400">
          <Terminal className="w-3.5 h-3.5 animate-pulse" />
          <span>ERROR_CODE: 404_SECTOR_NOT_FOUND</span>
        </div>

        <h1 className="text-7xl sm:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-200 to-zinc-600 font-mono">
          404
        </h1>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-white">
            Lost in Cyberspace
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The target navigation coordinates you requested do not exist in the Hack On-Line 2027 network grid.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white text-zinc-950 font-bold text-sm hover:bg-zinc-200 transition-all shadow-[0_0_24px_rgba(255,255,255,0.2)]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Mission Control</span>
          </Link>
        </div>

        <div className="text-[11px] font-mono text-zinc-600 pt-6 border-t border-white/5">
          Hack On-Line // 2027 — Premier 24H Virtual Developer Hackathon
        </div>
      </div>
    </div>
  );
}
