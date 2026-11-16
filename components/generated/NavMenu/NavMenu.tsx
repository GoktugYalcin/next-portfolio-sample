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
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="frame flex items-center justify-between gap-3 px-6 py-2.5 sm:px-8">
        <Link
          href="/"
          aria-label="Göktuğ — home"
          className="font-serif text-xl tracking-wide text-foreground hover:opacity-80"
        >
          <span className="hidden min-[420px]:inline">Göktuğ</span>
          <span className="min-[420px]:hidden">G.</span>
        </Link>
        <div className="flex items-center gap-4 sm:gap-5">
          <nav
            aria-label="Main"
            className="flex items-center gap-4 text-[13px] text-muted-foreground sm:gap-5"
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
          <ThemeButton />
        </div>
      </div>
    </header>
  );
};

export default NavMenu;
