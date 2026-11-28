"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#050607] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full text-center space-y-4">
          <h1 className="text-4xl font-bold font-mono text-danger">Critical Failure</h1>
          <p className="text-sm text-zinc-400">A global application fault occurred.</p>
          <button
            onClick={() => reset()}
            className="px-6 py-2.5 rounded-xl bg-brand-green text-black font-bold text-sm cursor-pointer"
          >
            Reload Platform
          </button>
        </div>
      </body>
    </html>
  );
}
