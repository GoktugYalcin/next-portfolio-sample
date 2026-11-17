import React from "react";
import { Link } from "next-view-transitions";
import { INavItem } from "@/types";

const NavItem: React.FC<INavItem> = ({ label, isSelected, href }) => {
  return (
    <Link
      href={href}
      aria-current={isSelected ? "page" : undefined}
      className={`select-none py-1 hover:text-foreground ${
        isSelected ? "text-foreground" : ""
      }`}
    >
      {label}
    </Link>
  );
};

export default NavItem;
