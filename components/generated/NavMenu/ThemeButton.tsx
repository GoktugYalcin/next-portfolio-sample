"use client";

import React from "react";
import { useTheme } from "next-themes";

const ThemeButton: React.FC = () => {
  const { systemTheme, theme, setTheme } = useTheme();

  const currentTheme = theme === "system" ? systemTheme : theme;

  function toggleTheme(): void {
    if (currentTheme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <span
      onClick={toggleTheme}
      className="my-auto mx-0 select-none flex-1 cursor-pointer text-center text-3xl transition relative"
    >
      <span className="hidden dark:block">🌚</span>
      <span className="dark:hidden">🌝</span>
    </span>
  );
};

export default ThemeButton;
