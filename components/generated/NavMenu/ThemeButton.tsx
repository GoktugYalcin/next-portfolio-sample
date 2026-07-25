"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

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
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle color mode"
      className="flex select-none items-center justify-center rounded-sm p-1 text-muted-foreground transition hover:text-accent"
    >
      <Sun size={13} className="hidden dark:block" strokeWidth={1.75} />
      <Moon size={13} className="dark:hidden" strokeWidth={1.75} />
    </button>
  );
};

export default ThemeButton;
