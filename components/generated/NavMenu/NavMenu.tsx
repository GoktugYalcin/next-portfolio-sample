"use client";

import React, { useEffect, useState } from "react";
import NavItem from "@/components/generated/NavMenu/NavItem";
import { usePathname } from "next/navigation";
import ThemeButton from "@/components/generated/NavMenu/ThemeButton";

const NavMenu = () => {
  const [selected, setSelected] = useState<string>("");
  const pathname = usePathname();

  useEffect(() => {
    const path = pathname.split("/");
    setSelected(path[1] || "home");
  }, [pathname]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 mx-auto mb-4 h-12 w-full max-w-lg px-2 lg:px-6 sm:h-16">
      <div className="flew-row relative mx-auto flex h-full w-full rounded-full border border-neutral-400/50 bg-white/30 backdrop-blur-sm dark:border-neutral-600/50 dark:bg-black/30 dark:text-white">
        <NavItem
          label={"Home"}
          selectAction={() => setSelected("home")}
          isSelected={selected === "home"}
          href={"/"}
        />
        <NavItem
          label={"Photos"}
          selectAction={() => setSelected("photos")}
          isSelected={selected === "photos"}
          href={"/photos"}
        />
        <NavItem
          label={"Projects"}
          selectAction={() => setSelected("projects")}
          isSelected={selected === "projects"}
          href={"/projects"}
        />
        <NavItem
          label={"Blog"}
          selectAction={() => setSelected("blog")}
          isSelected={selected === "blog"}
          href={"/blog"}
        />
        <ThemeButton />
      </div>
    </div>
  );
};

export default NavMenu;
