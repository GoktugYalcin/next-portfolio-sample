import React from "react";
import { Link } from "next-view-transitions";
import { INavItem } from "@/types";

const NavItem: React.FC<INavItem> = ({ label, isSelected, href, labelRef }) => {
  return (
    <Link
      href={href}
      className={`flex h-full flex-1 select-none items-center justify-center text-center transition-colors ${
        isSelected
          ? "pointer-events-none cursor-default text-accent"
          : "cursor-pointer text-muted-foreground hover:text-foreground"
      }`}
    >
      <span ref={labelRef}>{label}</span>
    </Link>
  );
};

export default NavItem;
