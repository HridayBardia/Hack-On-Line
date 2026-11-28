"use client";

import { useEffect, useRef } from "react";

// The 3D space behind the whole page. Scrolling flies the camera through it:
// forwards on the way down, backwards on the way up.

const DEPTH = 24; // length of the repeating stretch of space
const NEAR = 0.6;
const FLOOR = -3.4;
const TRAVEL = 0.006; // distance flown per scrolled pixel

type Node = { x: number; y: number; z: number; green: boolean; trace: number };

/** Same layout on every visit */
function makeNodes(count: number): Node[] {
  let seed = 7;
  const random = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: count }, () => ({
    // keep the middle of the screen, where the text is, fairly clear
    x: (random() < 0.5 ? -1 : 1) * (1.6 + random() * 9),
    y: -3 + random() * 8,
    z: random() * DEPTH,
    green: random() < 0.28,
    trace: random() < 0.3 ? (random() < 0.5 ? -1 : 1) * (0.6 + random() * 1.8) : 0,
  }));
}

export function SpaceBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const nodes = makeNodes(window.innerWidth < 768 ? 80 : 190);
    let width = 0;
    let height = 0;
    let frame = 0;
    let camera = window.scrollY * TRAVEL;
    let speed = 0;
    const look = { x: 0, y: 0, tx: 0, ty: 0 };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const focal = Math.max(width, height) * 0.55;
      const cx = width / 2 - look.x * 40;
      const cy = height * 0.46 - look.y * 26;
      const project = (x: number, y: number, z: number) => ({
        x: cx + ((x - look.x * 0.6) / z) * focal,
        y: cy - ((y - look.y * 0.4) / z) * focal,
      });
      const ahead = (z: number) => ((((z - camera) % DEPTH) + DEPTH) % DEPTH) + NEAR;
      const fade = (z: number) => Math.min(1, (DEPTH - z) / 9) * Math.min(1, (z - NEAR) / 1.5);
      const line = (a: { x: number; y: number }, b: { x: number; y: number }, color: string, thickness = 1) => {
        ctx.strokeStyle = color;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      };

      // Floor grid
      for (let z = 0; z < DEPTH; z += 1.5) {
        const d = ahead(z);
        const alpha = 0.17 * Math.max(0, fade(d));
        line(project(-14, FLOOR, d), project(14, FLOOR, d), `rgba(2,226,248,${alpha})`);
      }
      for (let x = -14; x <= 14; x += 2) {
        const from = project(x, FLOOR, 2.2);
        const to = project(x, FLOOR, DEPTH * 0.75);
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, "rgba(2,226,248,0.13)");
        gradient.addColorStop(1, "rgba(2,226,248,0)");
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      }

      // Circuit nodes. Fast scrolling stretches them into streaks that point the way you came.
      const stretch = Math.max(-2.6, Math.min(2.6, speed * 7));
      for (const node of nodes) {
        const z = ahead(node.z);
        const alpha = Math.max(0, fade(z));
        if (alpha <= 0.01) continue;
        const p = project(node.x, node.y, z);
        if (p.x < -200 || p.x > width + 200 || p.y < -200 || p.y > height + 200) continue;
        const rgb = node.green ? "39,246,87" : "2,226,248";
        const size = Math.min(3.2, 7 / z);

        if (Math.abs(stretch) > 0.08) {
          const tail = project(node.x, node.y, Math.max(NEAR, z + stretch));
          line(p, tail, `rgba(${rgb},${alpha * 0.4})`, size * 0.7);
        }
        if (node.trace) {
          // A short right-angled circuit track, like the ones in the logo
          const bend = project(node.x + node.trace, node.y, z);
          const end = project(node.x + node.trace, node.y, z + 1.1);
          line(p, bend, `rgba(${rgb},${alpha * 0.3})`);
          line(bend, end, `rgba(${rgb},${alpha * 0.22})`);
          ctx.strokeStyle = `rgba(${rgb},${alpha * 0.55})`;
          ctx.beginPath();
          ctx.arc(end.x, end.y, size, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.fillStyle = `rgba(${rgb},${alpha * 0.75})`;
        ctx.fillRect(p.x - size / 2, p.y - size / 2, size, size);
      }
    };

    // Runs only while something is moving, so an idle page costs nothing
    const tick = () => {
      const target = window.scrollY * TRAVEL;
      const step = reduced.matches ? 0 : (target - camera) * 0.12;
      camera += step;
      speed += (step - speed) * 0.2;
      look.x += (look.tx - look.x) * 0.06;
      look.y += (look.ty - look.y) * 0.06;
      draw();
      const moving =
        !reduced.matches &&
        (Math.abs(target - camera) > 0.002 || Math.abs(speed) > 0.002 || Math.abs(look.tx - look.x) + Math.abs(look.ty - look.y) > 0.004);
      frame = moving ? window.requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };

    const resize = () => {
      const ratio = Math.min(1.5, window.devicePixelRatio || 1);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      wake();
    };
    const onScroll = () => {
      if (!reduced.matches) wake();
    };
    const onMouse = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduced.matches) return;
      look.tx = e.clientX / width - 0.5;
      look.ty = 0.5 - e.clientY / height;
      wake();
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onMouse, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onMouse);
    };
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_at_50%_45%,#07161b_0%,#050607_65%)]">
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
