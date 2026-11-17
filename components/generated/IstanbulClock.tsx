"use client";

import React, { useEffect, useState } from "react";

const IST_OFFSET_MIN = 180; // Türkiye stays on UTC+3 all year

const timeFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
});

const secFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

const dayFmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  weekday: "long",
});

/** "2h 30m ahead" / "1h behind" / "same time as you", from the visitor's clock. */
const offsetNote = (now: Date) => {
  const diff = IST_OFFSET_MIN + now.getTimezoneOffset();
  if (diff === 0) return "same time as you";
  const abs = Math.abs(diff);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const span = [h ? `${h}h` : "", m ? `${m}m` : ""].filter(Boolean).join(" ");
  return `${span} ${diff > 0 ? "ahead" : "behind"}`;
};

const useNow = (everyMs: number) => {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, everyMs);
    return () => clearInterval(id);
  }, [everyMs]);
  return now;
};

/** Profile row: Istanbul time, weekday, and how far that is from the visitor. */
export const IstanbulClock = () => {
  const now = useNow(30_000);
  if (!now) return <span className="text-soft">istanbul time</span>;

  return (
    <>
      {timeFmt.format(now)} · {dayFmt.format(now).toLowerCase()}{" "}
      <span className="text-soft">
        {"// "}
        {offsetNote(now)}
      </span>
    </>
  );
};

/** Footer: a ticking Istanbul clock. */
export const IstanbulSeconds = () => {
  const now = useNow(1000);
  if (!now) return null;
  return <span className="tabular-nums">{secFmt.format(now)}</span>;
};
