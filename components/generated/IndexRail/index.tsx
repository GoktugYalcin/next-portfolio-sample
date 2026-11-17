"use client";

import React, { useEffect, useState } from "react";

export type IndexItem = { id: string; label: string };

/**
 * Floating table of contents for long pages. Sits right of the frame on wide
 * screens and tracks the section currently in view.
 */
const IndexRail = ({ items }: { items: IndexItem[] }) => {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * 0.35;
      let current = items[0]?.id ?? "";
      for (const item of items) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= line) current = item.id;
      }
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && items.length) current = items[items.length - 1].id;
      setActive(current);
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav
      aria-label="On this page"
      className="fixed left-[calc(50%+388px)] top-1/2 hidden -translate-y-1/2 xl:block"
    >
      <p className="label-mono mb-3">index</p>
      <ul className="flex flex-col gap-2.5 font-mono text-[11px] lowercase">
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`flex items-center gap-2 hover:text-foreground ${
                  isActive ? "text-foreground" : "pl-2 text-soft"
                }`}
              >
                {isActive && (
                  <span className="h-px w-3 bg-foreground" aria-hidden />
                )}
                {item.label}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default IndexRail;
