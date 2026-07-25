"use client";

import React, { useEffect, useState } from "react";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export const KonamiEasterEgg = () => {
  const [running, setRunning] = useState(false);

  useEffect(() => {
    let buffer: string[] = [];

    const onKeyDown = (e: KeyboardEvent) => {
      buffer = [...buffer, e.key].slice(-SEQUENCE.length);
      if (buffer.join(",") === SEQUENCE.join(",")) {
        setRunning(true);
        buffer = [];
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!running) return null;

  return (
    <div
      className="konami-dash"
      onAnimationEnd={() => setRunning(false)}
      aria-hidden
    >
      <span className="anim" />
    </div>
  );
};
