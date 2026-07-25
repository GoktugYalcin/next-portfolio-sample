"use client";

import React, { useRef } from "react";

const MAX_TILT = 8;

export const AvatarTilt = ({ children }: { children: React.ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.willChange = "transform";
    el.style.transform = `perspective(300px) rotateX(${-y * MAX_TILT}deg) rotateY(${
      x * MAX_TILT
    }deg)`;
  };

  const handleMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(300px) rotateX(0deg) rotateY(0deg)";
    el.style.willChange = "auto";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="transition-transform duration-200 ease-out"
    >
      {children}
    </div>
  );
};
