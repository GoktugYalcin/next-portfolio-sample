"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
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
    <li className="min-w-0 bg-background">
      <Link
        target={isMail ? undefined : "_blank"}
        href={link}
        onClick={handleCopy}
        className="group flex h-full flex-col gap-1 px-6 py-3.5 hover:bg-hover sm:px-8"
      >
        <span className="label-mono">{siteName}</span>
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
          <span className="truncate">{copied ? "Copied" : label}</span>
          {copied ? (
            <Check size={12} className="flex-none text-accent" aria-hidden />
          ) : (
            <ArrowUpRight
              size={12}
              className="flex-none text-soft group-hover:text-foreground"
              aria-hidden
            />
          )}
        </span>
      </Link>
    </li>
  );
};

export default FooterLink;
