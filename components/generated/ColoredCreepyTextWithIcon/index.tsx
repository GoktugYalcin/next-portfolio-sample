import React from "react";
import { TextProps } from "@/types";
import { clsx } from "clsx";

const ColoredCreepyTextWithIcon = ({
  text,
  lightColor,
  darkColor,
  icon,
}: TextProps) => {
  const bounceDelay = ["10ms", "15ms", "20ms", "25ms", "30ms"][
    parseInt((Math.random() * 4).toFixed())
  ];
  return (
    <span
      className={clsx(`inline-flex justify-center items-center gap-1`, {
        [lightColor]: true,
        [`dark:${darkColor}`]: true,
      })}
    >
      {text}
      {React.createElement(icon, {
        className: `animate-bounce`,
        style: {
          animationDelay: bounceDelay,
        },
      })}
    </span>
  );
};

export default ColoredCreepyTextWithIcon;
