"use client";

import { useEffect, useRef } from "react";

// A live git history behind the whole page: branches fork, collect commits and
// merge back while the log keeps moving. Scrolling moves through it faster.

const ROW = 76; // distance between commits
const BLOCK = 11; // rows in which one branch can fork and merge
const FLOW = 22; // pixels per second the log moves on its own
const PARALLAX = 0.25;
const GREEN = "39,246,87";
const CYAN = "2,226,248";

const MESSAGES = [
  "feat: auth flow",
  "fix: build",
  "init repo",
  "feat: api routes",
  "refactor: state",
  "docs: readme",
  "feat: live deploy",
  "test: edge cases",
  "perf: cache",
  "merge: ui",
];
const TOKENS = ["</>", "{ }", "=>", "npm run build", "git push", "200 OK", "deploy ✓", "&&", "[ ]", "// TODO"];

/** A repeatable number from 0 to 1, so the history looks the same when scrolled back */
function noise(a: number, b: number) {
  const n = Math.sin(a * 127.1 + b * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

export function CommitGraphBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;

    const draw = (seconds: number) => {
      ctx.clearRect(0, 0, width, height);
      const offset = seconds * FLOW + (reduced.matches ? 0 : window.scrollY * PARALLAX);
      const mobile = width < 768;

      // Branch graphs sit near the edges so the text in the middle stays clear
      const graphs = mobile
        ? [
            { x: 14, dir: 1, strength: 0.45 },
            { x: width - 14, dir: -1, strength: 0.45 },
          ]
        : [
            { x: width * 0.035, dir: 1, strength: 1 },
            { x: width * 0.965, dir: -1, strength: 1 },
            { x: width * 0.27, dir: 1, strength: 0.28 },
            { x: width * 0.73, dir: -1, strength: 0.28 },
          ];
      const spread = mobile ? 20 : Math.min(54, width * 0.032);

      ctx.font = "11px ui-monospace, monospace";
      ctx.textBaseline = "middle";

      graphs.forEach((graph, g) => {
        const shift = offset * (0.7 + 0.3 * graph.strength) + g * 137;
        const first = Math.floor(shift / ROW) - BLOCK;
        const last = Math.ceil((shift + height) / ROW) + 1;
        const yOf = (row: number) => row * ROW - shift;
        const ink = (rgb: string, alpha: number) => `rgba(${rgb},${alpha * graph.strength})`;

        const commit = (x: number, y: number, rgb: string, merge: boolean) => {
          ctx.fillStyle = "#050607";
          ctx.strokeStyle = ink(rgb, 0.75);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(x, y, merge ? 6 : 4, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          if (merge) {
            ctx.fillStyle = ink(rgb, 0.8);
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        };

        // Main branch
        ctx.strokeStyle = ink(CYAN, 0.28);
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(graph.x, 0);
        ctx.lineTo(graph.x, height);
        ctx.stroke();

        // Feature branches
        const merges = new Set<number>();
        for (let block = Math.floor(first / BLOCK); block <= Math.floor(last / BLOCK); block++) {
          if (noise(block, g) < 0.2) continue;
          const start = block * BLOCK + 1 + Math.floor(noise(block, g + 9) * 3);
          const end = start + 4 + Math.floor(noise(block, g + 17) * 3);
          const x = graph.x + graph.dir * spread;
          merges.add(start);
          merges.add(end);

          ctx.strokeStyle = ink(GREEN, 0.34);
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(graph.x, yOf(start));
          ctx.bezierCurveTo(graph.x, yOf(start + 0.6), x, yOf(start + 0.4), x, yOf(start + 1));
          ctx.lineTo(x, yOf(end - 1));
          ctx.bezierCurveTo(x, yOf(end - 0.4), graph.x, yOf(end - 0.6), graph.x, yOf(end));
          ctx.stroke();

          for (let row = start + 1; row < end; row++) commit(x, yOf(row), GREEN, false);
        }

        // Commits on main, some with their message
        for (let row = first; row <= last; row++) {
          const y = yOf(row);
          if (y < -20 || y > height + 20) continue;
          const merge = merges.has(row);
          commit(graph.x, y, merge ? GREEN : CYAN, merge);

          if (!mobile && graph.strength === 1 && noise(row, g + 3) > 0.7) {
            const hash = Math.floor(noise(row, g + 5) * 0xffffff).toString(16).padStart(6, "0");
            const message = MESSAGES[Math.floor(noise(row, g + 7) * MESSAGES.length)];
            ctx.fillStyle = ink(CYAN, 0.3);
            ctx.textAlign = graph.dir === 1 ? "left" : "right";
            ctx.fillText(`${hash}  ${message}`, graph.x + graph.dir * (spread + 14), y);
          }
        }

        // A push travelling along main
        if (!reduced.matches) {
          const y = ((seconds * (150 + g * 23) + g * 311) % (height + 260)) - 130;
          const trail = ctx.createLinearGradient(0, y - 110, 0, y);
          trail.addColorStop(0, ink(GREEN, 0));
          trail.addColorStop(1, ink(GREEN, 0.9));
          ctx.fillStyle = trail;
          ctx.fillRect(graph.x - 1.5, y - 110, 3, 110);
          ctx.fillStyle = ink(GREEN, 1);
          ctx.beginPath();
          ctx.arc(graph.x, y, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Faint code fragments drifting up across the page
      ctx.textAlign = "center";
      ctx.font = "13px ui-monospace, monospace";
      const count = mobile ? 8 : 18;
      const span = height + 80;
      for (let i = 0; i < count; i++) {
        const depth = 0.35 + noise(i, 41) * 0.65;
        const y = ((((noise(i, 43) * span - offset * depth) % span) + span) % span) - 40;
        const x = width * (0.08 + noise(i, 47) * 0.84);
        const pulse = reduced.matches ? 0.5 : (Math.sin(seconds * 0.9 + i * 2.4) + 1) / 2;
        ctx.fillStyle = `rgba(${i % 3 === 0 ? GREEN : CYAN},${(0.05 + pulse * 0.13) * depth})`;
        ctx.fillText(TOKENS[i % TOKENS.length], x, y);
      }
    };

    // About 30 frames a second is enough for slow movement. Hidden tabs pause by themselves.
    let drawn = 0;
    const tick = (ms: number) => {
      if (ms - drawn >= 32) {
        drawn = ms;
        draw(ms / 1000);
      }
      frame = window.requestAnimationFrame(tick);
    };
    const start = () => {
      window.cancelAnimationFrame(frame);
      if (reduced.matches) draw(0);
      else frame = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      const ratio = Math.min(1.5, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(reduced.matches ? 0 : performance.now() / 1000);
    };

    resize();
    start();
    window.addEventListener("resize", resize);
    reduced.addEventListener("change", start);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      reduced.removeEventListener("change", start);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_45%,#07161b_0%,#050607_65%)]">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
