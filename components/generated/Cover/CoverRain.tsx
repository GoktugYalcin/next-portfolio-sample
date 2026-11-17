"use client";

import { useEffect, useRef } from "react";

/* the page's own backgrounds (notebook.css) */
const BG = { light: "#fdfdfc", dark: "#0a0a0a" };

/**
 * The theme rain falls over the whole page through a `difference` blend,
 * which keeps text readable but would turn the photo into a negative. The
 * cover is lifted out of that blend, so here the rain is copied onto it
 * instead, painted in the colour of the theme it's turning into.
 */
const CoverRain = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const mirror = ref.current;
    const ctx = mirror?.getContext("2d");
    if (!mirror || !ctx) return;

    let scene: HTMLElement | null = null;
    let sceneObserver: MutationObserver | null = null;
    let frame = 0;
    let ink = BG.light;
    let startedDark = false;

    const isDark = () => document.documentElement.classList.contains("dark");
    const clear = () => ctx.clearRect(0, 0, mirror.width, mirror.height);

    const draw = () => {
      frame = 0;
      if (!scene?.classList.contains("is-switching")) return;
      /* the theme has landed: the cover is the new page now, not wet paint */
      if (isDark() !== startedDark) {
        clear();
        return;
      }

      const box = mirror.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(box.width * dpr);
      const h = Math.round(box.height * dpr);
      if (mirror.width !== w || mirror.height !== h) {
        mirror.width = w;
        mirror.height = h;
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, w, h);

      /* the scene covers the viewport, so its canvases are in viewport space */
      scene.querySelectorAll("canvas").forEach((c) => {
        if (!c.width || !c.height) return;
        const r = c.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const sx = c.width / r.width;
        const sy = c.height / r.height;
        ctx.drawImage(
          c,
          (box.left - r.left) * sx,
          (box.top - r.top) * sy,
          box.width * sx,
          box.height * sy,
          0,
          0,
          w,
          h
        );
      });

      /* keep the shapes, swap the colour for the new theme's paper */
      ctx.globalCompositeOperation = "source-in";
      ctx.fillStyle = ink;
      ctx.fillRect(0, 0, w, h);

      frame = requestAnimationFrame(draw);
    };

    const onSceneChange = () => {
      if (scene?.classList.contains("is-switching")) {
        /* decided once, at the start: the theme flips just before the end */
        if (!frame) {
          startedDark = isDark();
          ink = startedDark ? BG.light : BG.dark;
          frame = requestAnimationFrame(draw);
        }
      } else {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        clear();
      }
    };

    const attach = () => {
      const found = document.querySelector<HTMLElement>(".pts-page");
      if (!found || found === scene) return;
      scene = found;
      sceneObserver?.disconnect();
      sceneObserver = new MutationObserver(onSceneChange);
      sceneObserver.observe(scene, {
        attributes: true,
        attributeFilter: ["class"],
      });
    };

    /* the scene is portalled into <body> by the theme button once it mounts */
    attach();
    const bodyObserver = new MutationObserver(attach);
    bodyObserver.observe(document.body, { childList: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      bodyObserver.disconnect();
      sceneObserver?.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="cover-rain" aria-hidden="true" />;
};

export default CoverRain;
