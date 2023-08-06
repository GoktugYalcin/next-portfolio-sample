import React from "react";
import Link from "next/link";
import { BsArrowUpRight } from "react-icons/bs";
import { FooterLinkProps } from "@/types";

const FooterLink = ({ siteName, link, label }: FooterLinkProps) => {
  return (
    <li className="flex gap-3">
      <span className="text-slate-600 dark:text-slate-400">{siteName}</span>
      <Link
        target="_blank"
        href={link}
        className="flex justify-start items-center font-medium gap-1 hover:underline cursor-pointer"
      >
        {label} <BsArrowUpRight size={10} className="mb-0.5" fontWeight={800} />
      </Link>
    </li>
  );
};

export default FooterLink;
