"use client";

import React, { useEffect, useState } from "react";

const lineFor = (hour: number) => {
  if (hour >= 5 && hour < 12) return "this early? get a coffee first :)";
  if (hour >= 12 && hour < 17) return "sneaking a break from work? :)";
  if (hour >= 17 && hour < 21) return "evening's yours. go build something :)";
  return "still up? so am i, probably :)";
};

/** The closing line reads the visitor's own clock. */
const Closing = () => {
  const [line, setLine] = useState("you reached the end.");

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      setLine(lineFor(new Date().getHours()))
    );
    return () => cancelAnimationFrame(id);
  }, []);

  return <p className="end-hi">{line}</p>;
};

export default Closing;
