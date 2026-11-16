import React from "react";
import { Link } from "next-view-transitions";
import { INavItem } from "@/types";

const NavItem: React.FC<INavItem> = ({ label, isSelected, href }) => {
  return (
    <Link
      href={href}
      aria-current={isSelected ? "page" : undefined}
      className={`group relative select-none py-1 hover:text-foreground ${
        isSelected ? "font-semibold text-foreground" : ""
      }`}
    >
      {label}
      <span
        aria-hidden
        className={`absolute bottom-0 left-0 h-px w-full bg-current transition-transform duration-300 group-hover:origin-left group-hover:scale-x-100 ${
          isSelected ? "origin-left scale-x-100" : "origin-right scale-x-0"
        }`}
      />
    </Link>
  );
};

export default NavItem;
