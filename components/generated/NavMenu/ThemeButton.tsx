"use client";

import React, { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "next-themes";
import {
  createThemeSwitch,
  type ThemeName,
  type ThemeSwitchEngine,
} from "@/components/pinui/theme-switch-engine";
import "@/components/pinui/theme-switch.css";

/**
 * Theme toggle driven by Pin UI's Theme Switch engine (rain effect).
 *
 * The engine paints inside a "scene" box. Here the scene is a fixed,
 * click-through layer over the whole viewport, so the rain of the next theme
 * wets the entire page; once it is covered the real theme is switched under it.
 */

/** Flip the document theme in the same frame the rain layer is removed. */
function applyThemeNow(next: ThemeName) {
  const root = document.documentElement;
  const freeze = document.createElement("style");
  freeze.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(freeze);

  root.classList.toggle("dark", next === "dark");
  root.classList.toggle("light", next === "light");
  root.style.colorScheme = next;
  // force a style flush so nothing cross-fades from the old theme
  void window.getComputedStyle(document.body).backgroundColor;

  requestAnimationFrame(() => requestAnimationFrame(() => freeze.remove()));
}

const subscribeNoop = () => () => {};

const ThemeButton: React.FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  /* false on the server and during hydration, true afterwards */
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  );

  const buttonRef = useRef<HTMLButtonElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<ThemeSwitchEngine | null>(null);

  const setThemeRef = useRef(setTheme);
  useEffect(() => {
    setThemeRef.current = setTheme;
  }, [setTheme]);

  useEffect(() => {
    const root = sceneRef.current;
    const button = buttonRef.current;
    const fx = fxRef.current;
    if (!mounted || !root || !button || !fx) return;

    root.dataset.theme = document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";

    const engine = createThemeSwitch({
      root,
      button,
      fx,
      effect: () => "rain",
      sound: () => false,
      onCommit: (next) => {
        applyThemeNow(next);
        setThemeRef.current(next);
      },
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [mounted]);

  /* a theme change from outside (system preference, another tab) lands at once */
  useEffect(() => {
    const root = sceneRef.current;
    if (!root || !resolvedTheme || engineRef.current?.busy()) return;
    const theme: ThemeName = resolvedTheme === "dark" ? "dark" : "light";
    root.dataset.theme = theme;
    buttonRef.current?.setAttribute(
      "aria-label",
      `Switch to ${theme === "dark" ? "light" : "dark"} theme`
    );
  }, [resolvedTheme, mounted]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="Switch theme"
        className="relative grid h-7 w-7 flex-none place-items-center rounded-full border border-border text-muted-foreground hover:bg-hover hover:text-foreground"
      >
        {/* the moon, on the light face: press it for dark */}
        <svg
          className="theme-icon col-start-1 row-start-1 dark:-rotate-90 dark:scale-50 dark:opacity-0"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M20.985 12.486C20.8913 14.2221 20.2967 15.894 19.2731 17.2994C18.2495 18.7048 16.8407 19.7837 15.217 20.4055C13.5934 21.0274 11.8243 21.1656 10.1238 20.8035C8.42322 20.4414 6.86395 19.5945 5.63446 18.3652C4.40497 17.1358 3.55789 15.5766 3.19562 13.8761C2.83334 12.1756 2.97139 10.4065 3.59308 8.78282C4.21476 7.15909 5.29346 5.75019 6.69877 4.72644C8.10409 3.70268 9.77586 3.1079 11.512 3.014C11.917 2.992 12.129 3.474 11.914 3.817C11.1949 4.96755 10.887 6.32787 11.0405 7.67595C11.194 9.02403 11.7999 10.2803 12.7593 11.2397C13.7187 12.1991 14.975 12.805 16.323 12.9585C17.6711 13.112 19.0314 12.8041 20.182 12.085C20.526 11.87 21.007 12.081 20.985 12.486Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* the sun, on the dark face: press it for light */}
        <svg
          className="theme-icon col-start-1 row-start-1 rotate-90 scale-50 opacity-0 dark:rotate-0 dark:scale-100 dark:opacity-100"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <g
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2V4M12 20V22M4.93 4.93L6.34 6.34M17.66 17.66L19.07 19.07M2 12H4M20 12H22M6.34 17.66L4.93 19.07M19.07 4.93L17.66 6.34" />
          </g>
        </svg>
      </button>
      {mounted &&
        createPortal(
          <div ref={sceneRef} className="pts pts-page" aria-hidden="true">
            <div ref={fxRef} className="pts__fx" />
          </div>,
          document.body
        )}
    </>
  );
};

export default ThemeButton;
