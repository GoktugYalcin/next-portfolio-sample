"use client";

import React, { useEffect, useState } from "react";

const lineFor = (hour: number) => {
  if (hour < 5) return "still up? so am i, probably.";
  if (hour < 12) return "good morning. the coffee's brewing.";
  if (hour < 18) return "you reached the end. good afternoon.";
  return "you reached the end. good evening.";
};

/** The closing line changes with the visitor's own clock. */
const Closing = () => {
  const [line, setLine] = useState("you reached the end.");

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setLine(lineFor(new Date().getHours()))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <p className="font-serif text-2xl italic leading-tight text-foreground">
      {line}
    </p>
  );
};

export default Closing;
