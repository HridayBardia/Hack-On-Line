"use client";

import { useEffect, useRef, type RefObject } from "react";

// A small hand-written 3D scene on a 2D canvas: four layers, one per principle,
// stacked from the bottom up. No 3D library needed.

const GREEN = "39,246,87";
const CYAN = "2,226,248";
const WHITE = "242,247,245";

const LAYERS = 4;
const HALF = 1.3; // half the width of a layer
const THICK = 0.09;
const GAP = 0.72;
const ROOM = 1.05; // extra space opened above the selected layer
const CAMERA = 8;
const BASE_YAW = 0.68;
const BASE_PITCH = 0.46;

type Point = { x: number; y: number };
type Vec = [number, number, number];
type Project = (v: Vec) => Point;

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
  ctx.arc(p.x, p.y, radius * 2.6, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = `rgba(${rgb},${alpha})`;
  ctx.beginPath();
  ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
  ctx.fill();
}

const corners = (y: number, half = HALF): Vec[] => [
  [-half, y, -half],
  [half, y, -half],
  [half, y, half],
  [-half, y, half],
];

function box(ctx: CanvasRenderingContext2D, project: Project, centre: Vec, half: number, height: number, rgb: string, alpha: number) {
  const [x, y, z] = centre;
  const ring = (level: number) =>
    ([[x - half, level, z - half], [x + half, level, z - half], [x + half, level, z + half], [x - half, level, z + half]] as Vec[]).map(project);
  const low = ring(y);
  const high = ring(y + height);
  path(ctx, high, true);
  ctx.fillStyle = `rgba(${rgb},${alpha * 0.22})`;
  ctx.fill();
  ctx.strokeStyle = `rgba(${rgb},${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  low.forEach((p, i) => {
    path(ctx, [p, high[i]]);
    ctx.stroke();
  });
}

// ---- The object that stands on each layer. `f` is how selected the layer is (0 to 1). ----

/** Layer 1: a commit history that starts at the opening time and grows */
function drawCommits(ctx: CanvasRenderingContext2D, project: Project, base: number, f: number, t: number) {
  const alpha = 0.25 + 0.75 * f;
  const lift = 0.08 + 0.34 * f;
  const grown = ((t * 0.22) % 1.25) * 1.15; // pauses when complete, then starts again

  // Start gate: nothing exists before it
  path(ctx, ([[-1.08, base, -0.55], [-1.08, base + lift * 1.9, -0.55], [-1.08, base + lift * 1.9, 0.55], [-1.08, base, 0.55]] as Vec[]).map(project));
  glow(ctx, CYAN, alpha * 0.8, 1.2);

  const main: Vec[] = Array.from({ length: 8 }, (_, i) => [-0.92 + i * 0.27, base + lift, 0]);
  const branch: Vec[] = [main[1], [-0.35, base + lift, 0.55], [-0.08, base + lift, 0.55], [0.19, base + lift, 0.55], main[5]];

  [main, branch].forEach((line, which) => {
    const reach = clamp(grown * 1.1 - which * 0.12, 0, 1) * (line.length - 1);
    const shown = line.slice(0, Math.floor(reach) + 1);
    const part = reach % 1;
    if (part > 0) {
      const a = line[Math.floor(reach)];
      const b = line[Math.floor(reach) + 1];
      shown.push([a[0] + (b[0] - a[0]) * part, a[1], a[2] + (b[2] - a[2]) * part]);
    }
    path(ctx, shown.map(project));
    glow(ctx, which ? CYAN : GREEN, alpha, 1.8);
    line.forEach((node, i) => {
      if (i > reach) return;
      path(ctx, [project([node[0], base, node[2]]), project(node)]);
      ctx.strokeStyle = `rgba(${WHITE},${alpha * 0.25})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      dot(ctx, project(node), 2.2 + 1.4 * f, Math.floor(reach) === i ? WHITE : which ? CYAN : GREEN, alpha);
    });
  });
}

/** Layer 2: a turning globe, with signals going out from the live site */
function drawGlobe(ctx: CanvasRenderingContext2D, project: Project, base: number, f: number, t: number) {
  const alpha = 0.22 + 0.78 * f;
  const radius = 0.2 + 0.36 * f;
  const centre = base + radius + 0.08;
  const spin = t * 0.5;
  const onSphere = (lat: number, lon: number, r = radius): Vec => [
    Math.cos(lat) * Math.cos(lon + spin) * r,
    centre + Math.sin(lat) * r,
    Math.cos(lat) * Math.sin(lon + spin) * r,
  ];
  const steps = Array.from({ length: 37 }, (_, i) => (i / 36) * Math.PI * 2);

  for (const lat of [-0.9, -0.45, 0, 0.45, 0.9]) {
    path(ctx, steps.map((a) => project(onSphere(lat, a))));
    ctx.strokeStyle = `rgba(${CYAN},${alpha * 0.55})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
  for (let m = 0; m < 6; m++) {
    path(ctx, steps.map((a) => project(onSphere(a, (m / 6) * Math.PI))));
    ctx.strokeStyle = `rgba(${CYAN},${alpha * 0.4})`;
    ctx.stroke();
  }

  [[0.6, 0.3], [-0.2, 2.4], [0.25, 4.3]].forEach(([lat, lon], i) => {
    const phase = (t * 0.7 + i * 0.33) % 1;
    const from = onSphere(lat, lon);
    const to = onSphere(lat, lon, radius * (1 + phase * 0.75));
    path(ctx, [project(from), project(to)]);
    glow(ctx, GREEN, alpha * (1 - phase), 1.2);
    dot(ctx, project(from), 2 + f, GREEN, alpha);
    dot(ctx, project(to), 1.6 + f, GREEN, alpha * (1 - phase));
  });

  // Rings spreading across the layer
  for (let i = 0; i < 2; i++) {
    const phase = (t * 0.45 + i * 0.5) % 1;
    path(ctx, steps.map((a) => project([Math.cos(a) * phase * 1.15, base, Math.sin(a) * phase * 1.15])), true);
    ctx.strokeStyle = `rgba(${GREEN},${alpha * (1 - phase) * 0.8})`;
    ctx.lineWidth = 1.2;
    ctx.stroke();
  }
}

/** Layer 3: code modules, with a review scan passing over them */
function drawReview(ctx: CanvasRenderingContext2D, project: Project, base: number, f: number, t: number, yaw: number) {
  const alpha = 0.22 + 0.78 * f;
  const scan = -1.2 + ((t * 0.32) % 1) * 2.4;
  const heights = [3, 5, 2, 4, 6, 2, 3, 5, 4, 2, 6, 3, 2, 5, 4, 3];
  const modules = heights.map((h, i) => ({
    x: -0.66 + (i % 4) * 0.44,
    z: -0.66 + Math.floor(i / 4) * 0.44,
    h: (0.03 + h * 0.085) * (0.2 + 0.8 * f),
  }));
  // Far modules first, so near ones are drawn over them
  modules.sort((a, b) => b.x * Math.sin(yaw) + b.z * Math.cos(yaw) - (a.x * Math.sin(yaw) + a.z * Math.cos(yaw)));
  for (const m of modules) box(ctx, project, [m.x, base, m.z], 0.13, m.h, m.x < scan ? GREEN : CYAN, alpha * 0.9);

  const plane = ([[scan, base, -1], [scan, base + 0.75 * f + 0.08, -1], [scan, base + 0.75 * f + 0.08, 1], [scan, base, 1]] as Vec[]).map(project);
  path(ctx, plane, true);
  ctx.fillStyle = `rgba(${WHITE},${0.07 * alpha})`;
  ctx.fill();
  glow(ctx, WHITE, alpha * 0.8, 1.2);
}

/** Layer 4: the finished project, spinning inside the team's own ring */
function drawOwnership(ctx: CanvasRenderingContext2D, project: Project, base: number, f: number, t: number) {
  const alpha = 0.25 + 0.75 * f;
  const size = 0.18 + 0.3 * f;
  const centre = base + size * 1.35 + 0.06 + Math.sin(t * 1.6) * 0.04;
  const turn = (a: number, r: number, y: number): Vec => [Math.cos(a + t * 0.8) * r, y, Math.sin(a + t * 0.8) * r];

  const middle = [0, 1, 2, 3].map((i) => project(turn((i * Math.PI) / 2, size, centre)));
  const top = project([0, centre + size * 1.2, 0]);
  const bottom = project([0, centre - size * 1.2, 0]);
  middle.forEach((p, i) => {
    const next = middle[(i + 1) % 4];
    for (const tip of [top, bottom]) {
      path(ctx, [tip, p, next], true);
      ctx.fillStyle = `rgba(${GREEN},${alpha * 0.1})`;
      ctx.fill();
      glow(ctx, GREEN, alpha, 1.2);
    }
  });
  dot(ctx, project([0, centre, 0]), 3 + 2 * f, WHITE, alpha);

  const ring = Array.from({ length: 49 }, (_, i) => (i / 48) * Math.PI * 2);
  path(ctx, ring.map((a) => project([Math.cos(a) * size * 1.75, centre + Math.sin(a + t) * 0.12, Math.sin(a) * size * 1.75])));
  glow(ctx, CYAN, alpha, 1);
  const orbit = t * 1.4;
  dot(ctx, project([Math.cos(orbit) * size * 1.75, centre + Math.sin(orbit + t) * 0.12, Math.sin(orbit) * size * 1.75]), 3, CYAN, alpha);
}

interface Props {
  active: number;
  /** Exact floor set by scrolling, e.g. 1.5 is halfway between floors. Null to follow `active`. */
  floorRef: RefObject<number | null>;
  playing: boolean;
  onSelect: (index: number) => void;
}

export function BuildStack({ active, floorRef, playing, onSelect }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const playingRef = useRef(playing);
  const selectRef = useRef(onSelect);
  const redrawRef = useRef<() => void>(() => {});

  // The animation loop reads these without restarting
  useEffect(() => {
    activeRef.current = active;
    playingRef.current = playing;
    selectRef.current = onSelect;
    redrawRef.current();
  }, [active, playing, onSelect]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let frame = 0;
    let visible = false;
    let last = 0;
    let time = 1.8; // starts partway so a still frame already shows each object
    let intro = 0; // how assembled the stack is, from 0 to 1
    let scrollTurn = 0;

    const focus: number[] = Array.from({ length: LAYERS }, (_, i) => (i === activeRef.current ? 1 : 0));
    // How open each layer should be: partly open while scrolling between two floors
    const wanted = (i: number) => {
      const floor = floorRef.current;
      if (floor === null) return i === activeRef.current ? 1 : 0;
      return clamp(1 - Math.abs(floor - i), 0, 1);
    };
    const view = { yaw: 0, pitch: 0, hover: 0 };
    const drag = { on: false, x: 0, y: 0, moved: 0 };
    let faces: Point[][] = [];

    const still = () => reducedQuery.matches || !playingRef.current;

    const render = () => {
      if (!width) return;
      ctx.clearRect(0, 0, width, height);

      // The camera swings round a little as it climbs
      const climb = floorRef.current === null ? 0 : (floorRef.current - 1.5) * 0.3;
      const yaw = BASE_YAW + view.yaw + view.hover + scrollTurn + climb + Math.sin(time * 0.22) * 0.12;
      const pitch = clamp(BASE_PITCH + view.pitch, 0.22, 0.85);
      const unit = Math.min(width / 4.5, height / 5.65);

      // Layers above the selected one move up to make room for its object
      const heights: number[] = [];
      let level = 0;
      for (let i = 0; i < LAYERS; i++) {
        heights.push(level);
        level += GAP + focus[i] * ROOM;
      }
      // Ride towards the open floor, like a lift, while keeping the whole stack in view
      const weight = focus.reduce((sum, f) => sum + f, 0) || 1;
      const openFloor = focus.reduce((sum, f, i) => sum + f * (heights[i] + 0.4), 0) / weight;
      const centre = (level - GAP + 0.35) / 2;
      const middle = centre + (openFloor - centre) * 0.22;

      const project: Project = ([x, y, z]) => {
        const x1 = x * Math.cos(yaw) - z * Math.sin(yaw);
        const z1 = x * Math.sin(yaw) + z * Math.cos(yaw);
        const y1 = y - middle;
        const y2 = y1 * Math.cos(pitch) + z1 * Math.sin(pitch);
        const depth = z1 * Math.cos(pitch) - y1 * Math.sin(pitch);
        const scale = (CAMERA / (CAMERA + depth)) * unit;
        return { x: width / 2 + x1 * scale, y: height / 2 - y2 * scale };
      };

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
          ctx.strokeStyle = `rgba(${CYAN},${0.13 * (1 - Math.abs(g) / 3)})`;
          ctx.stroke();
        }
      }

      faces = [];
      for (let i = 0; i < LAYERS; i++) {
        const f = focus[i];
        // The layers drop into place one after another, and lift away again
        const arrive = easeOut(clamp(intro * 1.9 - i * 0.28, 0, 1));
        if (arrive <= 0) continue;
        const y = heights[i] + (1 - arrive) * 2.4;
        // Layers above the selected one fade, so they don't hide what it is showing
        const covering = clamp(focus.slice(0, i).reduce((sum, value) => sum + value, 0), 0, 1);
        ctx.globalAlpha = arrive * (1 - 0.6 * covering);

        const top = corners(y + THICK).map(project);
        const bottom = corners(y).map(project);
        faces[i] = top;

        path(ctx, bottom, true);
        glow(ctx, CYAN, 0.3, 1);
        top.forEach((p, c) => {
          path(ctx, [p, bottom[c]]);
          glow(ctx, f > 0.5 ? GREEN : CYAN, 0.35 + 0.5 * f, 1);
        });
        path(ctx, top, true);
        ctx.fillStyle = "rgba(10,18,22,0.68)";
        ctx.fill();
        ctx.fillStyle = `rgba(${GREEN},${0.07 * f})`;
        ctx.fill();
        glow(ctx, f > 0.5 ? GREEN : CYAN, 0.45 + 0.55 * f, 1.4);

        ctx.lineWidth = 1;
        for (let g = -HALF + 0.325; g < HALF - 0.1; g += 0.325) {
          for (const line of [
            [[g, y + THICK, -HALF], [g, y + THICK, HALF]],
            [[-HALF, y + THICK, g], [HALF, y + THICK, g]],
          ] as Vec[][]) {
            path(ctx, line.map(project));
            ctx.strokeStyle = `rgba(${CYAN},${0.08 + 0.06 * f})`;
            ctx.stroke();
          }
        }

        // A light travelling round the edge of the selected layer
        if (f > 0.05) {
          const run = (time * 0.35) % 1;
          const ring = corners(y + THICK);
          for (let tail = 0; tail < 14; tail++) {
            const p = ((run - tail * 0.008 + 1) % 1) * 4;
            const a = ring[Math.floor(p) % 4];
            const b = ring[(Math.floor(p) + 1) % 4];
            const k = p % 1;
            dot(ctx, project([a[0] + (b[0] - a[0]) * k, y + THICK, a[2] + (b[2] - a[2]) * k]), 2.4 - tail * 0.13, WHITE, f * (1 - tail / 14));
          }
        }

        const surface = y + THICK;
        if (i === 0) drawCommits(ctx, project, surface, f, time);
        if (i === 1) drawGlobe(ctx, project, surface, f, time);
        if (i === 2) drawReview(ctx, project, surface, f, time, yaw);
        if (i === 3) drawOwnership(ctx, project, surface, f, time);

        // Data rising to the next layer
        if (i < LAYERS - 1 && intro > 0.97) {
          [[-1.05, -1.05], [1.05, -1.05], [1.05, 1.05], [-1.05, 1.05]].forEach(([x, z], c) => {
            const from: Vec = [x, surface, z];
            const to: Vec = [x, heights[i + 1], z];
            path(ctx, [project(from), project(to)]);
            ctx.strokeStyle = `rgba(${CYAN},0.2)`;
            ctx.lineWidth = 1;
            ctx.stroke();
            const k = (time * 0.6 + c * 0.25 + i * 0.4) % 1;
            dot(ctx, project([x, surface + (heights[i + 1] - surface) * k, z]), 1.8, i < activeRef.current ? GREEN : CYAN, Math.sin(k * Math.PI));
          });
        }
        ctx.globalAlpha = 1;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 0.016);
      last = now;
      if (!still()) time += dt;
      const ease = still() ? 1 : 1 - Math.exp(-dt * 7);
      if (still()) {
        intro = 1;
        scrollTurn = 0;
      } else {
        // Worked out from where the scene is on screen, so scrolling back plays it backwards
        const rect = canvas.getBoundingClientRect();
        const screen = window.innerHeight;
        const arriving = clamp((screen - rect.top) / (screen * 0.8), 0, 1);
        const leaving = clamp((screen * 0.5 - rect.bottom) / (screen * 0.4), 0, 1);
        intro += (arriving * (1 - leaving) - intro) * ease;
        scrollTurn += (clamp(rect.top / screen, -1, 1) * 0.75 - scrollTurn) * ease;
      }
      const follow = still() ? 1 : 1 - Math.exp(-dt * (floorRef.current === null ? 7 : 14));
      focus.forEach((value, i) => (focus[i] = value + (wanted(i) - value) * follow));
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
        view.pitch = clamp(view.pitch + dy * 0.004, -0.24, 0.39);
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
      // A click without dragging selects the topmost layer under the pointer
      const rect = canvas.getBoundingClientRect();
      for (let i = LAYERS - 1; i >= 0; i--) {
        if (!faces[i]) continue;
        path(ctx, faces[i], true);
        const ratio = canvas.width / rect.width;
        if (ctx.isPointInPath((e.clientX - rect.left) * ratio, (e.clientY - rect.top) * ratio)) {
          selectRef.current(i);
          return;
        }
      }
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointercancel", onUp);
    reducedQuery.addEventListener("change", wake);
    // Scrolling still moves between floors while the animation is paused
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
  }, [floorRef]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="A 3D stack of four floors, one for each principle. Scrolling moves up and down through the floors."
      className="block size-full cursor-grab touch-pan-y select-none active:cursor-grabbing"
    />
  );
}
