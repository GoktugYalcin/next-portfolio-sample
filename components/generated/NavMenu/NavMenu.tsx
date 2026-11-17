"use client";

import React from "react";
import { Link } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ThemeButton from "@/components/generated/NavMenu/ThemeButton";

const PAGES = [
  { key: "photos", label: "photos", href: "/photos" },
  { key: "projects", label: "projects", href: "/projects" },
  { key: "blog", label: "blog", href: "/blog" },
];

const NavMenu = () => {
  const pathname = usePathname();
  const section = pathname.split("/")[1] || "";
  const home = section === "";

  return (
    <header className="nav wide-line" id="main-nav">
      {home ? (
        <a
          href="#top"
          className="nav-mark"
          aria-label="göktuğ yalçın, back to the top"
        >
          g.
        </a>
      ) : (
        <Link
          href="/"
          className="nav-mark has-back"
          aria-label="back to the homepage"
        >
          <ArrowLeft className="icon nav-back" aria-hidden />
          g.
        </Link>
      )}
      <nav className="nav-right" aria-label="site">
        {PAGES.map((page) => (
          <Link
            key={page.key}
            href={page.href}
            aria-current={section === page.key ? "page" : undefined}
            className={`nav-link ${section === page.key ? "active" : ""}`}
          >
            {page.label}
          </Link>
        ))}
        <a href="#contact" className="nav-link">
          say hi
        </a>
        <span className="nav-sep" aria-hidden="true" />
        <ThemeButton />
      </nav>
    </header>
  );
};

export default NavMenu;
