import React from "react";
import { Link } from "next-view-transitions";
import { INavItem } from "@/types";

const NavItem: React.FC<INavItem> = ({ label, isSelected, href, labelRef }) => {
  return (
    <Link
      href={href}
      className={`h-100 flex justify-center items-center select-none flex-1 cursor-pointer text-center text-sm sm:text-base ${
        isSelected
          ? "pointer-events-none cursor-default text-accent font-medium"
          : "text-foreground/70 hover:text-foreground"
      }`}
    >
      <span ref={labelRef}>{label}</span>
    </Link>
  );
};

export default NavItem;
