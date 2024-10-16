import React from "react";

export const PhotoFallback: React.FC<{ height: number; width: number }> = ({
  width,
  height,
}) => (
  <svg
    width={500}
    height={200}
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="g">
        <stop offset="0%" stop-color="#222">
          <animate
            attributeName="stop-color"
            values="#222; #111; #222"
            dur="1.5s"
            repeatCount="indefinite"
          ></animate>
        </stop>
      </linearGradient>
    </defs>
    <rect width={width} height={height} fill="#222" />
    <rect id="r" width={width} height={height} fill="url(#g)" />
    <animate
      href="#r"
      attributeName="x"
      from={height * -1}
      to={height}
      dur="1s"
      repeatCount="indefinite"
    />
  </svg>
);
