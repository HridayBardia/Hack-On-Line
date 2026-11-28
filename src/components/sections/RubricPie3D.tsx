"use client";

import { useEffect, useRef, type RefObject } from "react";

// A 3D pie chart on a 2D canvas, drawn in the same style as the floors in BuildStack.
// The selected slice turns to the front, lifts out and lights up.

const GREEN = "39,246,87";
const CYAN = "2,226,248";
const WHITE = "242,247,245";

const RADIUS = 1.5;
const THICK = 0.3;
const GAP = 0.045; // how far each slice sits from the middle
const CAMERA = 8;
const BASE_PITCH = 0.66;
const TURN = Math.PI * 2;

type Point = { x: number; y: number };
type Vec = [number, number, number];

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

function path(ctx: CanvasRenderingContext2D, points: Point[], close = false) {
  ctx.beginPath();
  points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
  if (close) ctx.closePath();
}

/** A wide faint stroke under a thin bright one reads as glow and costs far less than shadows */
function glow(ctx: CanvasRenderingContext2D, rgb: string, alpha: number, width: number) {
  ctx.strokeStyle = `rgba(${rgb},${alpha * 0.18})`;
  ctx.lineWidth = width * 4;
  ctx.stroke();
  ctx.strokeStyle = `rgba(${rgb},${alpha})`;
  ctx.lineWidth = width;
  ctx.stroke();
}

function dot(ctx: CanvasRenderingContext2D, p: Point, radius: number, rgb: string, alpha: number) {
  ctx.fillStyle = `rgba(${rgb},${alpha * 0.2})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius * 2.6, 0, TURN);
  ctx.fill();
  ctx.fillStyle = `rgba(${rgb},${alpha})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, TURN);
  ctx.fill();
}

/** The point a share `k` of the way along a closed outline, measured by length */
function along(outline: Vec[], k: number): Vec {
  const lengths = outline.map((a, i) => {
    const b = outline[(i + 1) % outline.length];
    return Math.hypot(b[0] - a[0], b[2] - a[2]);
  });
  let left = (((k % 1) + 1) % 1) * lengths.reduce((sum, l) => sum + l, 0);
  let i = 0;
  while (i < lengths.length - 1 && left > lengths[i]) left -= lengths[i++];
  const a = outline[i];
  const b = outline[(i + 1) % outline.length];
  const part = lengths[i] ? left / lengths[i] : 0;
  return [a[0] + (b[0] - a[0]) * part, a[1], a[2] + (b[2] - a[2]) * part];
}

interface Props {
  /** Each weight as a share of 1, in order */
  shares: number[];
  active: number;
  /** Exact slice set by scrolling, e.g. 1.5 is halfway between slices. Null to follow `active`. */
  stepRef: RefObject<number | null>;
  playing: boolean;
  onSelect: (index: number) => void;
  label: string;
}

export function RubricPie3D({ shares, active, stepRef, playing, onSelect, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sharesRef = useRef(shares);
  const activeRef = useRef(active);
  const playingRef = useRef(playing);
  const selectRef = useRef(onSelect);
  const redrawRef = useRef<() => void>(() => {});

  // The animation loop reads these without restarting
  useEffect(() => {
    sharesRef.current = shares;
    activeRef.current = active;
    playingRef.current = playing;
    selectRef.current = onSelect;
    redrawRef.current();
  }, [shares, active, playing, onSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const weights = sharesRef.current;
    const count = weights.length;
    const starts = weights.map((_, i) => weights.slice(0, i).reduce((sum, s) => sum + s, 0));
    // Slices run clockwise from the back of the pie
    const angleAt = (turn: number) => Math.PI / 2 - turn * TURN;
    const middles = weights.map((s, i) => angleAt(starts[i] + s / 2));

    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let last = 0;
    let time = 1.8;
    let intro = 0; // how assembled the pie is, from 0 to 1
    let scrollTurn = 0;
    let spot = activeRef.current; // position between slices, used to turn the pie

    const focus: number[] = weights.map((_, i) => (i === activeRef.current ? 1 : 0));
    const wanted = (i: number) => {
      const step = stepRef.current;
      if (step === null) return i === activeRef.current ? 1 : 0;
      return clamp(1 - Math.abs(step - i), 0, 1);
    };
    const view = { yaw: 0, pitch: 0, hover: 0 };
    const drag = { on: false, x: 0, y: 0, moved: 0 };
    let faces: { index: number; points: Point[] }[] = [];

    const still = () => reducedQuery.matches || !playingRef.current;

    const render = () => {
      if (!width) return;
      ctx.clearRect(0, 0, width, height);

      // Turn the selected slice towards the front, a little to one side
      const low = Math.floor(spot);
      const high = Math.min(count - 1, low + 1);
      const facing = middles[low] + (middles[high] - middles[low]) * (spot - low);
      const yaw = -Math.PI / 2 - facing + 0.4 + view.yaw + view.hover + scrollTurn + Math.sin(time * 0.3) * 0.14;
      const pitch = clamp(BASE_PITCH + view.pitch, 0.35, 1.1);
      const unit = Math.min(width / 4.7, height / 3.9);

      const rotate = ([x, y, z]: Vec) => {
        const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
        const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);
        return {
          x: x1,
          y: y * Math.cos(pitch) + z1 * Math.sin(pitch),
          depth: z1 * Math.cos(pitch) - y * Math.sin(pitch),
        };
      };
      const project = (v: Vec): Point => {
        const r = rotate(v);
        const scale = (CAMERA / (CAMERA + r.depth)) * unit;
        return { x: width / 2 + r.x * scale, y: height * 0.54 - (r.y - 0.12) * scale };
      };
      const circle = (radius: number, y: number, from = 0, to = 1, steps = 72) =>
        Array.from({ length: steps + 1 }, (_, i): Vec => {
          const a = angleAt(from + ((to - from) * i) / steps);
          return [Math.cos(a) * radius, y, Math.sin(a) * radius];
        });

      // Floor grid, drifting towards the viewer
      const floor = -0.55;
      const drift = (time * 0.18) % 0.5;
      ctx.lineWidth = 1;
      for (let g = -2.5; g <= 2.5; g += 0.5) {
        for (const line of [
          [[g, floor, -2.5], [g, floor, 2.5]],
          [[-2.5, floor, g - drift + 0.25], [2.5, floor, g - drift + 0.25]],
        ] as Vec[][]) {
          path(ctx, line.map(project));
          ctx.strokeStyle = `rgba(${CYAN},${0.15 * (1 - Math.abs(g) / 3)})`;
          ctx.stroke();
        }
      }

      // Rings spreading across the floor
      for (let i = 0; i < 3; i++) {
        const phase = (time * 0.28 + i / 3) % 1;
        path(ctx, circle(0.4 + phase * 2.1, floor).map(project));
        ctx.strokeStyle = `rgba(${GREEN},${(1 - phase) * 0.5 * intro})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      const slices = weights.map((share, i) => {
        const f = focus[i];
        // The slices drop into place one after another, and lift away again
        const arrive = easeOut(clamp(intro * 1.9 - i * 0.28, 0, 1));
        const out = GAP + f * 0.24 + (1 - arrive) * 1.1;
        const dx = Math.cos(middles[i]) * out;
        const dz = Math.sin(middles[i]) * out;
        const bottom = f * 0.3 + (1 - arrive) * 1.8 + Math.sin(time * 1.1 + i * 1.7) * 0.025;
        const top = bottom + THICK + f * 0.2;
        const steps = Math.max(6, Math.round(share * 64));
        const outline = (y: number): Vec[] => [
          [dx, y, dz],
          ...circle(RADIUS, y, starts[i], starts[i] + share, steps).map(([x, , z]): Vec => [x + dx, y, z + dz]),
        ];
        const centre: Vec = [dx + Math.cos(middles[i]) * RADIUS * 0.64, top, dz + Math.sin(middles[i]) * RADIUS * 0.64];
        return { i, f, share, arrive, bottom, top, dx, dz, outline, centre, depth: rotate([centre[0], 0, centre[2]]).depth };
      });

      // Far slices first, so near ones are drawn over them
      const ordered = [...slices].sort((a, b) => b.depth - a.depth);
      faces = [];

      for (const slice of ordered) {
        const { f, arrive } = slice;
        if (arrive <= 0) continue;
        ctx.globalAlpha = arrive;
        const rgb = f > 0.5 ? GREEN : CYAN;
        const upper = slice.outline(slice.top);
        const lower = slice.outline(slice.bottom);

        const walls = upper
          .map((a, n) => {
            const next = (n + 1) % upper.length;
            const quad: Vec[] = [a, upper[next], lower[next], lower[n]];
            return { quad, depth: quad.reduce((sum, v) => sum + rotate(v).depth, 0) / 4 };
          })
          .sort((a, b) => b.depth - a.depth);
        for (const wall of walls) {
          const points = wall.quad.map(project);
          faces.push({ index: slice.i, points });
          path(ctx, points, true);
          ctx.fillStyle = "rgba(8,17,21,0.9)";
          ctx.fill();
          ctx.fillStyle = `rgba(${rgb},${0.07 + 0.13 * f})`;
          ctx.fill();
        }

        // Upright edges at the three corners, then the two rims
        for (const n of [0, 1, upper.length - 1]) {
          path(ctx, [project(upper[n]), project(lower[n])]);
          glow(ctx, rgb, 0.4 + 0.5 * f, 1);
        }
        path(ctx, lower.map(project), true);
        glow(ctx, rgb, 0.25 + 0.3 * f, 1);

        const face = upper.map(project);
        faces.push({ index: slice.i, points: face });
        path(ctx, face, true);
        ctx.fillStyle = "rgba(10,22,27,0.92)";
        ctx.fill();
        // Neighbouring slices alternate in strength so they stay easy to tell apart
        ctx.fillStyle = `rgba(${rgb},${(slice.i % 2 ? 0.1 : 0.2) + 0.34 * f})`;
        ctx.fill();
        glow(ctx, rgb, 0.55 + 0.45 * f, 1.4);

        // Bands moving outwards across the top
        for (let band = 0; band < 3; band++) {
          const phase = (time * 0.3 + band / 3) % 1;
          path(
            ctx,
            circle(RADIUS * phase, slice.top, starts[slice.i], starts[slice.i] + slice.share, 24)
              .map(([x, y, z]): Vec => [x + slice.dx, y, z + slice.dz])
              .map(project)
          );
          ctx.strokeStyle = `rgba(${WHITE},${(1 - phase) * (0.08 + 0.28 * f)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        // A light travelling round the edge of the selected slice
        if (f > 0.05) {
          for (let tail = 0; tail < 18; tail++) {
            dot(ctx, project(along(upper, time * 0.28 - tail * 0.007)), 2.6 - tail * 0.11, WHITE, f * (1 - tail / 18));
          }
          // Data rising from the selected slice
          for (let n = 0; n < 14; n++) {
            const k = (time * 0.45 + n * 0.173) % 1;
            const a = angleAt(starts[slice.i] + slice.share * (0.12 + ((n * 0.618) % 1) * 0.76));
            const r = RADIUS * (0.25 + ((n * 0.377) % 1) * 0.68);
            const x = slice.dx + Math.cos(a) * r;
            const z = slice.dz + Math.sin(a) * r;
            const y = slice.top + k * 0.9;
            path(ctx, [project([x, slice.top + Math.max(0, k * 0.9 - 0.22), z]), project([x, y, z])]);
            ctx.strokeStyle = `rgba(${GREEN},${f * Math.sin(k * Math.PI) * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            dot(ctx, project([x, y, z]), 1.6, n % 4 ? GREEN : WHITE, f * Math.sin(k * Math.PI));
          }
        }
        ctx.globalAlpha = 1;
      }

      // The outer ring fills up to the selected weight, showing the running total
      const ringY = -0.12;
      path(ctx, circle(RADIUS + 0.55, ringY).map(project));
      ctx.strokeStyle = `rgba(${CYAN},${0.22 * intro})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      const total = (starts[low] + weights[low] + (starts[high] + weights[high] - starts[low] - weights[low]) * (spot - low)) * intro;
      if (total > 0.005) {
        const arc = circle(RADIUS + 0.55, ringY, 0, total, 96).map(project);
        path(ctx, arc);
        glow(ctx, GREEN, 0.75, 1.8);
        dot(ctx, arc[arc.length - 1], 3.4, WHITE, intro);
      }
      for (let n = 0; n < 2; n++) {
        const a = time * 0.6 + n * Math.PI;
        dot(ctx, project([Math.cos(a) * (RADIUS + 0.55), ringY, Math.sin(a) * (RADIUS + 0.55)]), 2.2, CYAN, 0.8 * intro);
      }

      // Weights are written last, so no slice can cover them
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      const font = getComputedStyle(canvas).fontFamily;
      for (const slice of slices) {
        if (slice.arrive <= 0.6) continue;
        const p = project([slice.centre[0], slice.top + 0.08 + slice.f * 0.14, slice.centre[2]]);
        const text = `${Math.round(slice.share * 100)}%`;
        ctx.font = `700 ${Math.round(clamp(unit * (0.17 + 0.09 * slice.f), 12, 34))}px ${font}`;
        ctx.globalAlpha = (slice.arrive - 0.6) / 0.4;
        ctx.strokeStyle = "rgba(5,6,7,0.85)";
        ctx.lineWidth = 4;
        ctx.strokeText(text, p.x, p.y);
        ctx.fillStyle = `rgb(${WHITE})`;
        ctx.fillText(text, p.x, p.y);
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      if (!still()) time += dt;
      if (still()) {
        intro = 1;
        scrollTurn = 0;
      } else {
        // Worked out from where the scene is on screen, so scrolling back plays it backwards
        const ease = 1 - Math.exp(-dt * 7);
        const rect = canvas.getBoundingClientRect();
        const screen = window.innerHeight;
        const arriving = clamp((screen - rect.top) / (screen * 0.8), 0, 1);
        const leaving = clamp((screen * 0.5 - rect.bottom) / (screen * 0.4), 0, 1);
        intro += (arriving * (1 - leaving) - intro) * ease;
        scrollTurn += (clamp(rect.top / screen, -1, 1) * 1.4 - scrollTurn) * ease;
      }
      const follow = still() ? 1 : 1 - Math.exp(-dt * (stepRef.current === null ? 7 : 14));
      focus.forEach((value, i) => (focus[i] = value + (wanted(i) - value) * follow));
      spot = clamp(spot + ((stepRef.current ?? activeRef.current) - spot) * follow, 0, count - 1);
      render();
      frame = visible && !still() ? window.requestAnimationFrame(tick) : 0;
    };

    // Runs the loop when animating, or draws a single frame when paused or reduced motion
    const wake = () => {
      if (!frame) {
        last = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };
    redrawRef.current = wake;

    const resize = () => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.lineJoin = "round";
      render();
      wake();
    };
    const sizes = new ResizeObserver(resize);
    sizes.observe(canvas);

    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    }, { threshold: 0 });
    seen.observe(canvas);

    const onDown = (e: PointerEvent) => {
      drag.on = true;
      drag.x = e.clientX;
      drag.y = e.clientY;
      drag.moved = 0;
      canvas.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (drag.on) {
        const dx = e.clientX - drag.x;
        const dy = e.clientY - drag.y;
        drag.x = e.clientX;
        drag.y = e.clientY;
        drag.moved += Math.abs(dx) + Math.abs(dy);
        view.yaw += dx * 0.008;
        view.pitch = clamp(view.pitch + dy * 0.004, -0.31, 0.44);
      } else if (e.pointerType === "mouse" && !still()) {
        const rect = canvas.getBoundingClientRect();
        view.hover = ((e.clientX - rect.left) / rect.width - 0.5) * 0.35;
      }
      wake();
    };
    const onUp = (e: PointerEvent) => {
      if (!drag.on) return;
      drag.on = false;
      if (drag.moved > 6 || e.type !== "pointerup") return;
      // A click without dragging selects the nearest slice under the pointer
      const rect = canvas.getBoundingClientRect();
      const ratio = canvas.width / rect.width;
      for (let n = faces.length - 1; n >= 0; n--) {
        path(ctx, faces[n].points, true);
        if (ctx.isPointInPath((e.clientX - rect.left) * ratio, (e.clientY - rect.top) * ratio)) {
          selectRef.current(faces[n].index);
          return;
        }
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    reducedQuery.addEventListener("change", wake);
    // Scrolling still moves between slices while the animation is paused
    window.addEventListener("scroll", wake, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      sizes.disconnect();
      seen.disconnect();
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointercancel", onUp);
      reducedQuery.removeEventListener("change", wake);
      window.removeEventListener("scroll", wake);
    };
  }, [stepRef]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={label}
      className="block size-full cursor-grab touch-pan-y select-none font-display active:cursor-grabbing"
    />
  );
}
