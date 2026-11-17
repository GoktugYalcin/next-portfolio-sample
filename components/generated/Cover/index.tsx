"use client";

import React, { useEffect, useRef, useState } from "react";
import { Link } from "next-view-transitions";
import CoverRain from "./CoverRain";

export type CoverPhoto = { id: string; src: string; alt: string };

type Stroke = {
  x: number;
  y: number;
  /** offset from rest, and its velocity */
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  angle: number;
  spin: number;
  vspin: number;
  len: number;
  width: number;
  color: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

/** next/image's optimiser, so the pixels are same-origin for the canvas */
const sameOrigin = (src: string, w: number) =>
  `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=75`;

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/** tiny deterministic PRNG so a photo always paints the same way */
const mulberry = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/**
 * Turn a photo into brush strokes: a coarse underpainting, then a finer pass
 * on top. Colour comes from the photo, direction from a slow flow field bent
 * by the local edge, so strokes run along shapes rather than across them.
 */
function strokesFor(
  img: HTMLImageElement,
  w: number,
  h: number,
  seed: number
): Stroke[] {
  const sw = 180;
  const sh = Math.max(1, Math.round((sw * h) / w));
  const off = document.createElement("canvas");
  off.width = sw;
  off.height = sh;
  const octx = off.getContext("2d", { willReadFrequently: true });
  if (!octx) return [];

  const scale = Math.max(sw / img.naturalWidth, sh / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  octx.drawImage(img, (sw - dw) / 2, (sh - dh) / 2, dw, dh);
  const data = octx.getImageData(0, 0, sw, sh).data;

  const at = (px: number, py: number) => {
    const sx = Math.max(0, Math.min(sw - 1, Math.round((px / w) * sw)));
    const sy = Math.max(0, Math.min(sh - 1, Math.round((py / h) * sh)));
    const i = (sy * sw + sx) * 4;
    return [data[i], data[i + 1], data[i + 2]] as const;
  };
  const lum = (px: number, py: number) => {
    const [r, g, b] = at(px, py);
    return 0.299 * r + 0.587 * g + 0.114 * b;
  };

  const rand = mulberry(seed);
  const strokes: Stroke[] = [];
  const unit = Math.max(0.7, Math.min(1.15, w / 720));

  const pass = (
    step: number,
    len: [number, number],
    width: [number, number],
    jitter: number
  ) => {
    const batch: { key: number; s: Stroke }[] = [];
    for (let gy = -step / 2; gy < h + step; gy += step) {
      for (let gx = -step / 2; gx < w + step; gx += step) {
        const x = gx + (rand() - 0.5) * step * 1.1;
        const y = gy + (rand() - 0.5) * step * 1.1;
        const [r, g, b] = at(x, y);

        /* run along edges: perpendicular to the luminance gradient */
        const gxl = lum(x + 4, y) - lum(x - 4, y);
        const gyl = lum(x, y + 4) - lum(x, y - 4);
        const edge = Math.min(1, Math.hypot(gxl, gyl) / 60);
        const flow =
          Math.sin(x * 0.009 + seed) * 0.9 + Math.cos(y * 0.014 - seed) * 0.7;
        const along = Math.atan2(gyl, gxl) + Math.PI / 2;
        const angle =
          flow * (1 - edge) + along * edge + (rand() - 0.5) * jitter;

        const tone = 1 + (rand() - 0.5) * 0.1;
        const c = (v: number) =>
          Math.max(0, Math.min(255, Math.round(v * tone)));

        batch.push({
          /* a sweep from the top-left, loosened so it doesn't read as a wipe */
          key: (x / w) * 0.55 + (y / h) * 0.45 + rand() * 0.42,
          s: {
            x,
            y,
            ox: 0,
            oy: 0,
            vx: 0,
            vy: 0,
            angle,
            spin: 0,
            vspin: 0,
            len: (len[0] + rand() * (len[1] - len[0])) * unit,
            width: (width[0] + rand() * (width[1] - width[0])) * unit,
            color: `rgb(${c(r)},${c(g)},${c(b)})`,
          },
        });
      }
    }
    batch.sort((a, b) => a.key - b.key);
    batch.forEach((b) => strokes.push(b.s));
  };

  pass(17 * unit, [26, 44], [15, 22], 0.5);
  pass(8 * unit, [9, 18], [5, 8.5], 0.7);
  return strokes;
}

function drawStroke(ctx: CanvasRenderingContext2D, s: Stroke) {
  const a = s.angle + s.spin;
  const dx = (Math.cos(a) * s.len) / 2;
  const dy = (Math.sin(a) * s.len) / 2;
  const x = s.x + s.ox;
  const y = s.y + s.oy;
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.width;
  ctx.beginPath();
  ctx.moveTo(x - dx, y - dy);
  ctx.lineTo(x + dx, y + dy);
  ctx.stroke();
}

/**
 * Home cover: one of my photos, redrawn as brush strokes. It paints itself
 * in, the paint ruffles under the pointer, and a click moves to the next one.
 */
const Cover = ({
  photos,
  stamp,
}: {
  photos: CoverPhoto[];
  stamp?: { src: string };
}) => {
  const figureRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [index, setIndex] = useState(0);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const figure = figureRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !figure || !ctx || !photos.length) return;

    const html = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const images = new Map<number, HTMLImageElement>();

    let w = 0;
    let h = 0;
    let dpr = 1;
    let current = 0;
    let strokes: Stroke[] = [];
    let painted = 0; // strokes laid down so far while painting in
    let painting = false;
    let ruffling = false;
    let frame = 0;
    let alive = true;
    let paintStart = 0;
    let paintMs = 1500;

    const size = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.lineCap = "round";
    };

    const drawAll = () => {
      for (let i = 0; i < strokes.length; i++) drawStroke(ctx, strokes[i]);
    };

    const tick = (now: number) => {
      frame = 0;
      if (!alive) return;

      if (painting) {
        /* a frame's timestamp can predate the call that started the paint */
        const t = Math.max(0, Math.min(1, (now - paintStart) / paintMs));
        const eased = 1 - Math.pow(1 - t, 2.2);
        const upto = Math.floor(eased * strokes.length);
        for (let i = painted; i < upto; i++) drawStroke(ctx, strokes[i]);
        painted = upto;
        if (t >= 1) {
          painting = false;
          figure.classList.add("is-live");
        }
      } else if (ruffling) {
        let moving = false;
        for (let i = 0; i < strokes.length; i++) {
          const s = strokes[i];
          if (!s.ox && !s.oy && !s.vx && !s.vy && !s.spin && !s.vspin) continue;
          s.vx += -s.ox * 0.055;
          s.vy += -s.oy * 0.055;
          s.vspin += -s.spin * 0.06;
          s.vx *= 0.86;
          s.vy *= 0.86;
          s.vspin *= 0.85;
          s.ox += s.vx;
          s.oy += s.vy;
          s.spin += s.vspin;
          if (
            Math.abs(s.ox) + Math.abs(s.oy) + Math.abs(s.vx) + Math.abs(s.vy) <
              0.04 &&
            Math.abs(s.spin) + Math.abs(s.vspin) < 0.002
          ) {
            s.ox = s.oy = s.vx = s.vy = s.spin = s.vspin = 0;
          } else {
            moving = true;
          }
        }
        drawAll();
        ruffling = moving;
      }

      if (painting || ruffling) frame = requestAnimationFrame(tick);
    };

    const go = () => {
      if (!frame) frame = requestAnimationFrame(tick);
    };

    /** lay a photo down over whatever is on the canvas now */
    const paint = (i: number, ms: number) => {
      const img = images.get(i);
      if (!img || !w) return;
      current = i;
      strokes = strokesFor(img, w, h, 7 + i * 13);
      painted = 0;
      ruffling = false;
      if (reduced) {
        drawAll();
        figure.classList.add("is-live");
        return;
      }
      painting = true;
      paintMs = ms;
      paintStart = performance.now();
      go();
    };

    const fetchPhoto = (i: number) =>
      images.has(i)
        ? Promise.resolve(images.get(i) as HTMLImageElement)
        : loadImage(sameOrigin(photos[i].src, 1200)).then((img) => {
            images.set(i, img);
            return img;
          });

    const next = () => {
      if (photos.length < 2 || painting) return;
      const i = (current + 1) % photos.length;
      setSwapping(true);
      fetchPhoto(i)
        .then(() => {
          if (!alive) return;
          setIndex(i);
          requestAnimationFrame(() =>
            requestAnimationFrame(() => setSwapping(false))
          );
          paint(i, 1100);
          fetchPhoto((i + 1) % photos.length).catch(() => {});
        })
        .catch(() => setSwapping(false));
    };

    /* ruffle: push the strokes near the pointer along its path */
    let last: { x: number; y: number } | null = null;
    let downAt: { x: number; y: number } | null = null;
    let travelled = 0;

    const onMove = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      const x = e.clientX - box.left;
      const y = e.clientY - box.top;
      if (downAt) travelled += last ? Math.hypot(x - last.x, y - last.y) : 0;
      if (last && !painting && !reduced) {
        const mx = x - last.x;
        const my = y - last.y;
        const speed = Math.min(26, Math.hypot(mx, my));
        if (speed > 0.5) {
          const reach = 64;
          const nx = mx / (Math.hypot(mx, my) || 1);
          const ny = my / (Math.hypot(mx, my) || 1);
          for (let i = 0; i < strokes.length; i++) {
            const s = strokes[i];
            const d = Math.hypot(s.x + s.ox - x, s.y + s.oy - y);
            if (d > reach) continue;
            const f = (1 - d / reach) ** 2 * speed * 0.16;
            s.vx += nx * f;
            s.vy += ny * f;
            s.vspin += (Math.random() - 0.5) * f * 0.05;
          }
          ruffling = true;
          go();
        }
      }
      last = { x, y };
    };
    const onLeave = () => {
      last = null;
    };
    const onDown = (e: PointerEvent) => {
      downAt = { x: e.clientX, y: e.clientY };
      travelled = 0;
    };
    const onUp = () => {
      const tap = !!downAt && travelled < 8;
      downAt = null;
      if (tap) next();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      next();
    };

    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerleave", onLeave);
    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("keydown", onKey);

    let resizeTimer = 0;
    let lastWidth = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        if (Math.abs(canvas.clientWidth - lastWidth) < 2) return;
        lastWidth = canvas.clientWidth;
        size();
        const img = images.get(current);
        if (!img) return;
        strokes = strokesFor(img, w, h, 7 + current * 13);
        painting = false;
        ruffling = false;
        drawAll();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const begin = () => {
      if (!alive) return;
      size();
      lastWidth = w;
      fetchPhoto(0)
        .then(() => {
          if (!alive) return;
          paint(0, 1500);
          if (photos.length > 1) fetchPhoto(1).catch(() => {});
        })
        .catch(() => {});
    };

    /* under the intro sheet nobody would see it paint: wait for it to lift */
    if (html.classList.contains("intro")) {
      document.addEventListener("introdone", begin, { once: true });
    } else {
      begin();
    }

    return () => {
      alive = false;
      if (frame) cancelAnimationFrame(frame);
      window.clearTimeout(resizeTimer);
      document.removeEventListener("introdone", begin);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerleave", onLeave);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("keydown", onKey);
    };
  }, [photos]);

  const photo = photos[index];

  return (
    <figure className="cover wide-line" ref={figureRef}>
      <div className="cover-frame rain-keep">
        {photos.length ? (
          <canvas
            ref={canvasRef}
            tabIndex={0}
            role="button"
            aria-label="one of my photos, redrawn as brush strokes. move over it to ruffle the paint, click for another."
          />
        ) : (
          <div className="cover-empty" aria-hidden />
        )}
        <CoverRain />
      </div>
      {photo && (
        <figcaption
          className="cover-cap reveal"
          style={{ "--d": "900ms" } as React.CSSProperties}
        >
          {pad(index + 1)} / {pad(photos.length)} &middot;{" "}
          <span className={`cap-name ${swapping ? "swapping" : ""}`}>
            {photo.alt}
          </span>
        </figcaption>
      )}
      {photos.length > 0 && (
        <div className="margin-note" aria-hidden="true">
          i took this.
          <br />
          go on, ruffle it.
          <svg viewBox="0 0 48 30">
            <path d="M46 3C33 5 16 12 4 26M4 26l2-10M4 26l10-3" />
          </svg>
        </div>
      )}
      {stamp && (
        <Link
          className="cover-stamp rain-lift reveal"
          style={{ "--d": "1000ms" } as React.CSSProperties}
          href="/photos"
          aria-label="see the rest of the photos"
        >
          <span className="lbl">see the photos</span>
          <span className="stamp">
            <span className="stp">
              <span className="stp-pic">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sameOrigin(stamp.src, 256)}
                  alt=""
                  draggable={false}
                />
              </span>
            </span>
          </span>
        </Link>
      )}
    </figure>
  );
};

export default Cover;
