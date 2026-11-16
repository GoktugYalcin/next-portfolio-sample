"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

const ThemeButton: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();

  function toggleTheme(): void {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex h-7 w-7 flex-none items-center justify-center rounded-full border border-border text-muted-foreground hover:bg-hover hover:text-foreground"
    >
      <Sun size={13} className="hidden dark:block" aria-hidden />
      <Moon size={13} className="dark:hidden" aria-hidden />
    </button>
  );
};

export default ThemeButton;
