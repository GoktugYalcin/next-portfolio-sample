"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BsArrowUpRight, BsCheck2 } from "react-icons/bs";
import { FooterLinkProps } from "@/types";

const FooterLink = ({ siteName, link, label }: FooterLinkProps) => {
  const [copied, setCopied] = useState(false);
  const isMail = link.startsWith("mailto:");

  const handleCopy = (e: React.MouseEvent) => {
    if (!isMail) return;
    e.preventDefault();
    navigator.clipboard.writeText(link.replace("mailto:", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <li className="flex gap-3">
      <span className="text-muted-foreground">{siteName}</span>
      <Link
        target={isMail ? undefined : "_blank"}
        href={link}
        onClick={handleCopy}
        className="flex justify-start items-center font-medium gap-1 hover:underline cursor-pointer"
      >
        {copied ? "Copied" : label}
        {copied ? (
          <BsCheck2 size={10} className="mb-0.5 text-accent" />
        ) : (
          <BsArrowUpRight size={10} className="mb-0.5" fontWeight={800} />
        )}
      </Link>
    </li>
  );
};

export default FooterLink;
