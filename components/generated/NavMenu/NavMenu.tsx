"use client";

import React, { useLayoutEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import NavItem from "@/components/generated/NavMenu/NavItem";
import { usePathname } from "next/navigation";

const PAGES = [
  { key: "home", label: "Home", href: "/" },
  { key: "photos", label: "Photos", href: "/photos" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "blog", label: "Blog", href: "/blog" },
];

const NavMenu = () => {
  const pathname = usePathname();
  const selected = pathname.split("/")[1] || "home";

  const containerRef = useRef<HTMLDivElement>(null);
  const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
  const [indicator, setIndicator] = useState<{
    left: number;
    width: number;
  } | null>(null);

  useLayoutEffect(() => {
    const el = labelRefs.current[selected];
    const container = containerRef.current;
    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      setIndicator({
        left: elRect.left - containerRect.left,
        width: elRect.width,
      });
    }
  }, [selected]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 mx-auto mb-4 h-12 w-full max-w-lg px-2 lg:px-6 sm:h-14">
      <div
        ref={containerRef}
        className="hud-corners relative mx-auto flex h-full w-full items-center rounded-sm border border-border bg-background/85 px-2 font-mono text-xs uppercase tracking-[0.1em] shadow-[0_8px_24px_-12px_oklch(0%_0_0_/_0.4)] backdrop-blur-md"
      >
        {PAGES.map((page) => (
          <NavItem
            key={page.key}
            label={page.label}
            isSelected={selected === page.key}
            href={page.href}
            labelRef={(el) => {
              labelRefs.current[page.key] = el;
            }}
          />
        ))}
        {indicator && (
          <motion.div
            className="pointer-events-none absolute bottom-1.5 h-[2px] rounded-full bg-accent shadow-[0_0_8px_1px_oklch(var(--accent)_/_0.7)]"
            animate={{ left: indicator.left, width: indicator.width }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </div>
    </div>
  );
};

export default NavMenu;
