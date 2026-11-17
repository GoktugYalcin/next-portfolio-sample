"use client";

import React, { useEffect, useRef, useState } from "react";

const IST_OFFSET_MIN = 180; // Türkiye stays on UTC+3 all year
const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";

const partsFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: "Europe/Istanbul",
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
  hourCycle: "h23",
});

const secFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** "3:05 pm · tuesday" */
const wallTime = (now: Date) => {
  const p: Record<string, string> = {};
  partsFmt.formatToParts(now).forEach((x) => (p[x.type] = x.value));
  const h = Number(p.hour) % 24;
  return `${h % 12 || 12}:${p.minute} ${h < 12 ? "am" : "pm"} · ${(
    p.weekday || ""
  ).toLowerCase()}`;
};

/** "// 2h 30m ahead", or nothing when the visitor is on Istanbul time */
const offsetNote = (now: Date) => {
  const diff = IST_OFFSET_MIN + now.getTimezoneOffset();
  if (diff === 0) return "";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return (
    "// " +
    (h ? h + "h" : "") +
    (m ? (h ? " " : "") + m + "m" : "") +
    (diff > 0 ? " ahead" : " behind")
  );
};

/** Profile row: Istanbul time, weekday, and how far that is from the visitor. */
export const IstanbulClock = () => {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    const first = requestAnimationFrame(tick);
    const id = window.setInterval(tick, 20_000);
    return () => {
      cancelAnimationFrame(first);
      window.clearInterval(id);
    };
  }, []);

  if (!now) return <span>istanbul time</span>;
  const note = offsetNote(now);

  return (
    <span>
      {wallTime(now)}
      {note && <span className="meta-soft"> {note}</span>}
    </span>
  );
};

/**
 * Footer clock. Each digit sits in its own slot and rolls: the old one
 * leaves upward as the new one comes in from below.
 */
export const RollingClock = () => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const slots: HTMLSpanElement[] = [];

    const set = (text: string) => {
      while (slots.length < text.length) {
        const slot = document.createElement("span");
        slot.className = "clock-slot";
        root.appendChild(slot);
        slots.push(slot);
      }
      while (slots.length > text.length) slots.pop()?.remove();

      Array.from(text).forEach((ch, i) => {
        const slot = slots[i];
        if (slot.dataset.v === ch) return;
        slot.dataset.v = ch;
        const old = slot.lastElementChild;
        const next = document.createElement("span");
        next.textContent = ch;
        slot.appendChild(next);
        if (!old) return;
        if (document.hidden || reduced) {
          old.remove();
          return;
        }
        old.animate(
          [
            { transform: "none", opacity: 1, filter: "blur(0)" },
            { transform: "translateY(-70%)", opacity: 0, filter: "blur(2px)" },
          ],
          { duration: 420, easing: EASE_OUT }
        ).onfinish = () => old.remove();
        next.animate(
          [
            { transform: "translateY(70%)", opacity: 0, filter: "blur(2px)" },
            { transform: "none", opacity: 1, filter: "blur(0)" },
          ],
          { duration: 520, easing: EASE_OUT }
        );
      });
    };

    const tick = () => set(secFmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearInterval(id);
      root.textContent = "";
    };
  }, []);

  return <span className="clock" ref={ref} aria-hidden="true" />;
};
