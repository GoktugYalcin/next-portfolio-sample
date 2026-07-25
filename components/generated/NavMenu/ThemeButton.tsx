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
      className="flex items-center justify-center select-none flex-none w-10 sm:w-12 cursor-pointer text-center text-xl transition relative"
    >
      <span className="hidden dark:block">🌚</span>
      <span className="dark:hidden">🌝</span>
    </span>
  );
};

export default ThemeButton;
