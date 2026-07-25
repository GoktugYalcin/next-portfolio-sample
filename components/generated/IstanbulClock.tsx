"use client";

import React, { useEffect, useState } from "react";

const formatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Istanbul",
  hour: "2-digit",
  minute: "2-digit",
});

export const IstanbulClock = () => {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatter.format(new Date()));
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return <>it&apos;s {time} in Istanbul right now.</>;
};
