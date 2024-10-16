import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toggleTheme() {
  const currentTheme = localStorage.theme || "light";
  localStorage.setItem("theme", currentTheme === "light" ? "dark" : "light");

  if (currentTheme === "light") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop offset="0%" stop-color="#333">
          <animate attributeName="stop-color" values="#333; #222; #333" dur="1.5s" repeatCount="indefinite"></animate>
      </stop>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str);

export const createShimmer = (w: number = 700, h: number = 475) => {
  const shimmerData = `data:image/svg+xml;base64,${toBase64(
    shimmer(w ?? 700, h ?? 475)
  )}`;
  return shimmerData;
};
