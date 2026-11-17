"use client";

import { useEffect } from "react";

/**
 * Reveals: every `.reveal` starts blurred, lowered and transparent, and
 * settles the first time it scrolls into view. Stagger with `--i` (steps of
 * 70ms) or `--d` (a delay in ms) on the element.
 *
 * Mounted once in the layout. New elements (a route change, a filter, a
 * streamed section) are picked up as they are added.
 */
const Motion = () => {
  useEffect(() => {
    const html = document.documentElement;
    window.__motion = true;
    html.classList.add("js");

    const seen = new WeakSet<Element>();
    let mutations: MutationObserver | null = null;
    let frame = 0;

    const show = (el: Element) => {
      el.classList.add("visible");
      const style = (el as HTMLElement).style;
      const i = parseFloat(style.getPropertyValue("--i")) || 0;
      const d = parseFloat(style.getPropertyValue("--d")) || 0;
      window.setTimeout(() => el.classList.add("settled"), 1100 + 70 * i + d);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          show(entry.target);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -7% 0px" }
    );

    const scan = () => {
      frame = 0;
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);
        io.observe(el);
      });
    };
    const queueScan = () => {
      if (!frame) frame = requestAnimationFrame(scan);
    };

    /* at the very bottom the last rows can sit below the -7% line forever */
    const onScroll = () => {
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4;
      if (!atBottom) return;
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          io.unobserve(el);
          show(el);
        }
      });
    };

    const start = () => {
      scan();
      mutations = new MutationObserver(queueScan);
      mutations.observe(document.body, { childList: true, subtree: true });
      window.addEventListener("scroll", onScroll, { passive: true });
    };

    if (html.classList.contains("intro")) {
      document.addEventListener("introdone", start, { once: true });
    } else {
      start();
    }

    return () => {
      document.removeEventListener("introdone", start);
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
      mutations?.disconnect();
      io.disconnect();
    };
  }, []);

  return null;
};

export default Motion;
