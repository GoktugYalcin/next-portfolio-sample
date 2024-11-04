import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { INavItem } from "@/types";

const NavItem: React.FC<INavItem> = ({
  label,
  selectAction,
  isSelected,
  href,
}) => {
  return (
    <Link
      href={href}
      onClick={() => selectAction()}
      className={`h-100 flex justify-center items-center select-none flex-1 cursor-pointer rounded-full text-center text-sm duration-100 hover:text-black/80 hover:font-bold hover:text-md transition-all dark:hover:text-white/80 sm:text-base relative ${
        isSelected && "pointer-events-none cursor-default"
      }`}
    >
      {label}
      {isSelected && (
        <motion.div
          layoutId="bg"
          className={`rounded-full z-[-4] w-[90%] absolute box-border m-0 lg:h-[49px] h-[40px] opacity-1 bg-gray-200/70 dark:bg-gray-800/70 pointer-events-none`}
          transition={{
            duration: 0.2,
          }}
        />
      )}
    </Link>
  );
};

export default NavItem;
