"use client";

import { useEffect, useRef, type RefObject } from "react";
import { STAGES } from "@/lib/schedule";
import { EVENT_END, EVENT_START } from "@/lib/event";

// A 3D ring of time on a 2D canvas, floating over a city. The moment being looked at
// is always at the front; the ring turns as time moves, and the sky and the city
// follow the hour in India. The clock itself is HTML, placed in the middle of the ring.

const GREEN = "39,246,87";
const CYAN = "2,226,248";
const WHITE = "242,247,245";

const HOUR = 3_600_000;
const TIMES = STAGES.map((stage) => Date.parse(stage.at));
const FIRST = TIMES[0];
const SPAN = TIMES[TIMES.length - 1] - FIRST;
const HACK_START = Date.parse(EVENT_START);
const HACK_END = Date.parse(EVENT_END);

const ARC = Math.PI * 2 * 0.92; // the gap left over separates the end from the beginning
const RADIUS = 3;
const CAMERA = 9;

const clamp = (n: number, min = 0, max = 1) => Math.min(max, Math.max(min, n));

/** Hour of the day in India, 0 to 24 */
const istHour = (ms: number) => ((((ms + 5.5 * HOUR) / HOUR) % 24) + 24) % 24;

/** 1 in full daylight, 0 at night, in between around sunrise and sunset */
function daylightAt(ms: number) {
  return clamp(Math.cos(((istHour(ms) - 12.25) / 24) * Math.PI * 2) * 2 + 0.5);
}

const mixColor = (a: number[], b: number[], t: number) => `rgb(${a.map((v, i) => Math.round(v + (b[i] - v) * t)).join(",")})`;

/** A repeatable value from 0 to 1, so the stars and the city look the same every time */
const noise = (n: number) => {
  const v = Math.sin(n * 127.1) * 43758.5453;
  return v - Math.floor(v);
};

const STARS = Array.from({ length: 110 }, (_, i) => ({ x: noise(i + 1), y: noise(i + 301), size: 0.6 + noise(i + 601) * 1.1 }));

const TOWERS = Array.from({ length: 64 }, (_, i) => ({
  width: 14 + noise(i + 11) * 30,
  height: 0.18 + noise(i + 71) ** 2 * 0.82, // share of the tallest
  gap: 1 + noise(i + 131) * 7,
}));
const CITY_WIDTH = TOWERS.reduce((sum, tower) => sum + tower.width + tower.gap, 0);

interface Props {
  /** The moment to show, in milliseconds */
  timeRef: RefObject<number>;
  /** Short names written beside the markers, in the order of STAGES */
  labels: string[];
  liveIndex: number;
  now: number | null;
  /** Dragging sideways reports a distance in steps between stages */
  onDrag: (steps: number) => void;
}

export function TimeRing({ timeRef, labels, liveIndex, now, onDrag }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef({ liveIndex, now });
  const dragRef = useRef(onDrag);

  useEffect(() => {
    liveRef.current = { liveIndex, now };
    dragRef.current = onDrag;
  }, [liveIndex, now, onDrag]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    // The element that holds both this canvas and the HTML clock
    const scene = canvas.closest<HTMLElement>("[data-scene]");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let unit = 0; // pixels per 3D unit
    let pitch = 0.5;
    let centreY = 0;
    let font = "sans-serif";
    let frame = 0;
    let visible = false;
    let clock = 0;
    let last = 0;
    let shown = timeRef.current; // eases towards the target time

    const layout = () => {
      // Tall narrow screens look down on the ring more, which opens up its middle
      pitch = width < height * 1.2 ? 0.66 : 0.5;
      unit = Math.min(width / 6.7, height / 4.9);
      centreY = height * 0.5 - (pitch - 0.5) * unit;
      font = getComputedStyle(canvas).fontFamily;
      // Tell the HTML clock where the middle of the ring is, and how big it can be
      scene?.style.setProperty("--clock-y", `${Math.round(centreY - unit * 0.08)}px`);
      scene?.style.setProperty("--clock-size", `${Math.round(clamp(unit * 0.76, 34, 84))}px`);
    };

    const angleOf = (ms: number) => ((ms - shown) / SPAN) * ARC;
    const front = (angle: number) => (Math.cos(angle) + 1) / 2; // 1 nearest, 0 at the back
    const project = (angle: number, radius: number, y = 0) => {
      const x = Math.sin(angle) * radius;
      const z = -Math.cos(angle) * radius;
      const y2 = y * Math.cos(pitch) + z * Math.sin(pitch);
      const depth = z * Math.cos(pitch) - y * Math.sin(pitch);
      const scale = (CAMERA / (CAMERA + depth)) * unit;
      return { x: width / 2 + x * scale, y: centreY - y2 * scale, scale: scale / unit };
    };

    const drawSky = (day: number, horizon: number) => {
      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, mixColor([2, 3, 11], [4, 34, 52], day));
      sky.addColorStop(1, mixColor([14, 22, 48], [14, 104, 100], day));
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, width, horizon);

      STARS.forEach((star, i) => {
        const twinkle = 0.65 + 0.35 * Math.sin(clock * 1.7 + i);
        ctx.fillStyle = `rgba(${WHITE},${(1 - day) * 0.8 * twinkle})`;
        ctx.fillRect(star.x * width, star.y * horizon, star.size, star.size);
      });

      // Sun from 6 AM to 6 PM, moon for the other half, rising and setting behind the city
      const hour = istHour(shown);
      const sunUp = hour >= 6 && hour < 18;
      const across = ((((hour - 6) % 12) + 12) % 12) / 12;
      const x = width * (0.06 + across * 0.88);
      const y = horizon - Math.sin(across * Math.PI) * Math.max(0, horizon - 26);
      const r = clamp(unit * 0.13, 7, 15);
      const halo = ctx.createRadialGradient(x, y, 0, x, y, r * 7);
      halo.addColorStop(0, `rgba(${sunUp ? "170,255,205" : CYAN},${sunUp ? 0.6 : 0.32})`);
      halo.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = halo;
      ctx.fillRect(x - r * 7, y - r * 7, r * 14, r * 14);
      ctx.save();
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      if (!sunUp) {
        // clipping away an offset circle leaves a crescent
        ctx.clip();
        ctx.beginPath();
        ctx.rect(x - r * 2, y - r * 2, r * 4, r * 4);
        ctx.arc(x + r * 0.55, y - r * 0.3, r * 0.95, 0, Math.PI * 2, true);
      }
      ctx.fillStyle = sunUp ? "#eafff1" : "#c9f8ff";
      ctx.fill("evenodd");
      ctx.restore();
    };

    // The city slides past as time moves, and its windows light up after dark
    const drawCity = (day: number, horizon: number) => {
      const tallest = Math.min(horizon * 0.5, unit * 0.95);
      const slide = ((shown - FIRST) / SPAN) * 260;
      let x = -(slide % CITY_WIDTH);
      for (let copy = 0; x < width && copy < 400; copy++) {
        const i = copy % TOWERS.length;
        const tower = TOWERS[i];
        if (x + tower.width > 0) {
          const h = tower.height * tallest;
          ctx.fillStyle = mixColor([4, 7, 14], [4, 30, 36], day);
          ctx.fillRect(x, horizon - h, tower.width, h);
          ctx.fillStyle = `rgba(${CYAN},${0.18 + day * 0.12})`;
          ctx.fillRect(x, horizon - h, tower.width, 1);
          for (let row = 0; row * 7 + 6 < h - 3; row++) {
            for (let column = 0; column * 7 + 6 < tower.width; column++) {
              const pick = noise(i * 97 + row * 13 + column);
              if (pick < 0.55) continue;
              const blink = pick > 0.96 ? 0.5 + 0.5 * Math.sin(clock * 2 + pick * 90) : 1;
              ctx.fillStyle = `rgba(${pick > 0.86 ? GREEN : CYAN},${(0.12 + (1 - day) * 0.62) * blink})`;
              ctx.fillRect(x + 4 + column * 7, horizon - h + 5 + row * 7, 2.5, 2.5);
            }
          }
        }
        x += tower.width + tower.gap;
      }
    };

    // A ground grid that flows toward the viewer as time moves forward
    const drawGround = (day: number, horizon: number) => {
      const ground = ctx.createLinearGradient(0, horizon, 0, height);
      ground.addColorStop(0, mixColor([8, 14, 30], [6, 46, 48], day));
      ground.addColorStop(0.7, "#050607");
      ctx.fillStyle = ground;
      ctx.fillRect(0, horizon, width, height - horizon);

      const depth = height - horizon;
      ctx.lineWidth = 1;
      const flow = (((((shown - FIRST) / HOUR) * 0.5) % 1) + 1) % 1;
      for (let i = 0; i < 12; i++) {
        const near = (i + flow) / 12;
        const y = horizon + near * near * depth;
        ctx.strokeStyle = `rgba(${CYAN},${0.03 + near * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(${CYAN},0.08)`;
      ctx.beginPath();
      for (let i = -12; i <= 12; i++) {
        ctx.moveTo(width / 2 + i * width * 0.025, horizon);
        ctx.lineTo(width / 2 + i * width * 0.17, height);
      }
      ctx.stroke();

      ctx.fillStyle = `rgba(${CYAN},0.5)`;
      ctx.fillRect(0, horizon, width, 1);
    };

    const quad = (points: { x: number; y: number }[]) => {
      ctx.beginPath();
      points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
    };

    // The ring is a solid band with a side wall, so it reads as an object, not a line
    const drawRing = () => {
      const INNER = RADIUS - 0.13;
      const OUTER = RADIUS + 0.13;
      // pool of light under the front of the ring
      const head = project(0, RADIUS);
      const pool = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, unit * 2);
      pool.addColorStop(0, `rgba(${GREEN},0.2)`);
      pool.addColorStop(1, `rgba(${GREEN},0)`);
      ctx.fillStyle = pool;
      ctx.fillRect(head.x - unit * 2, head.y - unit * 2, unit * 4, unit * 4);

      // cut the band where the colour changes, so the edges are exact
      const cuts = Array.from({ length: 181 }, (_, i) => FIRST + (SPAN * i) / 180);
      cuts.push(HACK_START, HACK_END, clamp(shown, FIRST, FIRST + SPAN));
      cuts.sort((a, b) => a - b);

      const pieces = cuts.slice(1).map((to, i) => ({ from: cuts[i], to, middle: angleOf((cuts[i] + to) / 2) }));
      pieces.sort((a, b) => Math.cos(a.middle) - Math.cos(b.middle)); // far side first

      for (const { from, to, middle } of pieces) {
        if (to - from < 1) continue;
        const mid = (from + to) / 2;
        const done = mid <= shown;
        const building = mid >= HACK_START && mid <= HACK_END;
        const rgb = done ? GREEN : building ? CYAN : WHITE;
        const strength = (done ? 0.92 : building ? 0.5 : 0.25) * (0.3 + 0.7 * front(middle));
        const a = angleOf(from);
        const b = angleOf(to) + 0.002; // tiny overlap hides hairline seams

        if (Math.cos(middle) > 0) {
          quad([project(a, OUTER), project(b, OUTER), project(b, OUTER, -0.17), project(a, OUTER, -0.17)]);
          ctx.fillStyle = `rgba(${rgb},${strength * 0.3})`;
          ctx.fill();
        }
        quad([project(a, INNER), project(b, INNER), project(b, OUTER), project(a, OUTER)]);
        ctx.fillStyle = `rgba(${rgb},${strength * (done ? 0.85 : 0.6)})`;
        ctx.fill();

        const p = project(a, OUTER);
        const q = project(b, OUTER);
        ctx.strokeStyle = `rgba(${rgb},${strength})`;
        ctx.lineWidth = 1.5 * p.scale;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }

      // an inner guide with a mark for every hour, brighter every third hour
      for (let t = Math.ceil((FIRST + 5.5 * HOUR) / HOUR) * HOUR - 5.5 * HOUR; t <= FIRST + SPAN; t += HOUR) {
        const angle = angleOf(t);
        const major = Math.round(istHour(t)) % 3 === 0;
        const a = project(angle, RADIUS - (major ? 0.36 : 0.27));
        const b = project(angle, RADIUS - 0.19);
        ctx.strokeStyle = `rgba(${WHITE},${(major ? 0.6 : 0.3) * (0.2 + 0.8 * front(angle))})`;
        ctx.lineWidth = major ? 1.5 : 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    };

    const drawMarkers = () => {
      const current = TIMES.reduce((best, t, i) => (Math.abs(t - shown) < Math.abs(TIMES[best] - shown) ? i : best), 0);
      const names: { x: number; y: number; text: string; alpha: number }[] = [];

      TIMES.map((t, i) => ({ t, i, angle: angleOf(t) }))
        .sort((a, b) => Math.cos(a.angle) - Math.cos(b.angle))
        .forEach(({ t, i, angle }) => {
          const near = clamp(1 - Math.abs(t - shown) / (1.2 * HOUR)); // 1 when this stage is being looked at
          const live = i === liveRef.current.liveIndex;
          const rgb = live || (i === current && near > 0.5) ? GREEN : CYAN;
          const alpha = 0.3 + 0.7 * front(angle);
          const foot = project(angle, RADIUS);
          const top = project(angle, RADIUS, 0.36 + near * 0.3);

          const beam = ctx.createLinearGradient(foot.x, foot.y, top.x, top.y);
          beam.addColorStop(0, `rgba(${rgb},0.1)`);
          beam.addColorStop(1, `rgba(${rgb},${alpha})`);
          ctx.strokeStyle = beam;
          ctx.lineWidth = (2 + near * 2) * top.scale;
          ctx.beginPath();
          ctx.moveTo(foot.x, foot.y);
          ctx.lineTo(top.x, top.y);
          ctx.stroke();

          const size = (4.5 + near * 4) * top.scale;
          ctx.fillStyle = `rgba(${rgb},${alpha * 0.2})`;
          ctx.beginPath();
          ctx.arc(top.x, top.y, size * 2.2, 0, Math.PI * 2);
          ctx.fill();
          quad([
            { x: top.x, y: top.y - size },
            { x: top.x + size * 0.78, y: top.y },
            { x: top.x, y: top.y + size },
            { x: top.x - size * 0.78, y: top.y },
          ]);
          ctx.fillStyle = `rgba(${rgb},${alpha})`;
          ctx.fill();

          // rings spreading from the stage in view
          if (near > 0.05) {
            for (let r = 0; r < 2; r++) {
              const phase = (clock * 0.6 + r * 0.5) % 1;
              ctx.strokeStyle = `rgba(${rgb},${near * (1 - phase) * 0.8})`;
              ctx.lineWidth = 1.5;
              ctx.beginPath();
              ctx.ellipse(foot.x, foot.y, phase * unit * 0.6, phase * unit * 0.6 * Math.sin(pitch), 0, 0, Math.PI * 2);
              ctx.stroke();
            }
          }

          // the stage in view is described under the scene, so it needs no name here
          if (near < 0.4 && width > 620) {
            names.push({ x: top.x, y: top.y - size - 9, text: labels[i] ?? "", alpha: clamp(0.35 + front(angle)) * (1 - near * 2.5) });
          }
        });

      // Nearest names are placed first. A name that would cover another one, or the clock, is left out.
      ctx.font = `600 ${Math.round(clamp(unit * 0.14, 11, 14))}px ${font}`;
      ctx.textAlign = "center";
      const clockY = centreY - unit * 0.08;
      const taken = [{ left: width / 2 - unit * 1.75, right: width / 2 + unit * 1.75, top: clockY - unit * 0.75, bottom: clockY + unit * 0.75 }];
      for (const name of names.reverse()) {
        const half = ctx.measureText(name.text).width / 2 + 7;
        const x = clamp(name.x, half + 4, width - half - 4);
        const box = { left: x - half, right: x + half, top: name.y - 15, bottom: name.y + 6 };
        if (taken.some((o) => box.left < o.right && box.right > o.left && box.top < o.bottom && box.bottom > o.top)) continue;
        taken.push(box);
        ctx.fillStyle = `rgba(5,6,7,${name.alpha * 0.72})`;
        ctx.fillRect(box.left, box.top, half * 2, 21);
        ctx.fillStyle = `rgba(${WHITE},${name.alpha})`;
        ctx.fillText(name.text, x, name.y);
      }
    };

    // The playhead marks the moment being looked at; a green dot marks the real time during the event
    const drawPlayhead = () => {
      const head = project(0, RADIUS);
      const above = project(0, RADIUS, 0.26);
      const below = project(0, RADIUS, -0.26);
      for (const [thickness, alpha] of [[11, 0.2], [2.5, 1]]) {
        ctx.strokeStyle = `rgba(${WHITE},${alpha})`;
        ctx.lineWidth = thickness;
        ctx.beginPath();
        ctx.moveTo(below.x, below.y);
        ctx.lineTo(above.x, above.y);
        ctx.stroke();
      }
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(head.x, head.y, 4.5, 0, Math.PI * 2);
      ctx.fill();

      const { now: real, liveIndex: live } = liveRef.current;
      if (live >= 0 && real !== null && real <= FIRST + SPAN) {
        const angle = angleOf(real);
        const p = project(angle, RADIUS, 0.15 + Math.sin(clock * 4) * 0.04);
        ctx.fillStyle = `rgba(${GREEN},${0.3 + 0.7 * front(angle)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6, 0, Math.PI * 2);
        ctx.fill();
        ctx.font = `600 13px ${font}`;
        ctx.textAlign = "center";
        ctx.fillText("Now", p.x, p.y - 12);
      }
    };

    const draw = () => {
      if (!width || !height) return;
      const day = daylightAt(shown);
      // the horizon sits just behind the far side of the ring
      const horizon = Math.max(40, project(Math.PI, RADIUS).y - unit * 0.2);
      ctx.lineCap = "butt";
      drawSky(day, horizon);
      drawCity(day, horizon);
      drawGround(day, horizon);
      drawRing();
      drawMarkers();
      drawPlayhead();
    };

    const tick = (stamp: number) => {
      const dt = Math.min(0.05, last ? (stamp - last) / 1000 : 0.016);
      last = stamp;
      if (!reduced.matches) clock += dt;
      shown += (timeRef.current - shown) * (reduced.matches ? 1 : 1 - Math.exp(-dt * 12));
      draw();
      frame = visible && !reduced.matches ? window.requestAnimationFrame(tick) : 0;
    };
    const wake = () => {
      if (!frame) {
        last = 0;
        frame = window.requestAnimationFrame(tick);
      }
    };

    const sizes = new ResizeObserver(() => {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      layout();
      draw();
      wake();
    });
    sizes.observe(canvas);
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    seen.observe(canvas);

    // With reduced motion nothing loops, so redraw when a stage is picked
    const redraw = () => reduced.matches && wake();
    canvas.addEventListener("journey:redraw", redraw);

    let dragX: number | null = null;
    const down = (e: PointerEvent) => {
      dragX = e.clientX;
      canvas.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (dragX === null) return;
      const delta = dragX - e.clientX;
      if (Math.abs(delta) < 70) return;
      dragRef.current(Math.sign(delta));
      dragX = e.clientX;
    };
    const up = () => {
      dragX = null;
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    return () => {
      window.cancelAnimationFrame(frame);
      sizes.disconnect();
      seen.disconnect();
      canvas.removeEventListener("journey:redraw", redraw);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [timeRef, labels]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="block size-full cursor-grab touch-pan-y select-none font-display active:cursor-grabbing"
    />
  );
}
