import React from "react";
import { useTheme } from "@/lib/hooks/UseTheme";

const ThemeButton: React.FC = () => {
  const [theme, setTheme] = useTheme();
  return (
    <span
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="hover:animate-pulse my-auto mx-0 select-none flex-1 cursor-pointer text-center text-3xl transition relative"
    >
      {theme === "light" ? "🌚" : "🌝"}
    </span>
  );
};

export default ThemeButton;
