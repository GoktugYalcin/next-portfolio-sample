import React from "react";
import { TextProps } from "@/types";

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
      className={`inline-flex justify-center items-center gap-1 dark:${darkColor} ${lightColor}`}
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
