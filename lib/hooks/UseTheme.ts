import { useEffect, useState } from "react";

export function useTheme() {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setTheme(localStorage.getItem("theme")!);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document?.documentElement.classList.add("dark");
    } else {
      document?.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", theme || "light");
  }, [theme]);

  return [theme, setTheme] as const;
}
