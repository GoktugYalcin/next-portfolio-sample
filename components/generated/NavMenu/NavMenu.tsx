"use client";

import React from "react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import NavItem from "@/components/generated/NavMenu/NavItem";
import ThemeButton from "@/components/generated/NavMenu/ThemeButton";

const PAGES = [
  { key: "home", label: "Home", href: "/" },
  { key: "photos", label: "Photos", href: "/photos" },
  { key: "projects", label: "Projects", href: "/projects" },
  { key: "blog", label: "Blog", href: "/blog" },
];

const NavMenu = () => {
  const pathname = usePathname();
  const selected = pathname.split("/")[1] || "home";

  return (
    <header className="sticky top-0 z-40 border-b border-dotted border-border bg-background/90 backdrop-blur-md">
      <div className="frame flex items-center justify-between gap-3 px-5 py-2 sm:px-6">
        <Link
          href="/"
          aria-label="Göktuğ — home"
          className="font-serif text-2xl italic leading-none text-foreground hover:opacity-70"
        >
          g.
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <nav
            aria-label="Main"
            className="flex items-center gap-4 text-sm lowercase text-soft sm:gap-5"
          >
            {PAGES.map((page) => (
              <NavItem
                key={page.key}
                label={page.label}
                isSelected={selected === page.key}
                href={page.href}
              />
            ))}
          </nav>
          <span className="h-4 w-px bg-border" aria-hidden />
          <ThemeButton />
        </div>
      </div>
    </header>
  );
};

export default NavMenu;
