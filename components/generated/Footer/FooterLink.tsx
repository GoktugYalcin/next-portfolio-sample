"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { FooterLinkProps } from "@/types";

const useCopyMail = (link: string) => {
  const [copied, setCopied] = useState(false);
  const isMail = link.startsWith("mailto:");

  const onClick = (e: React.MouseEvent) => {
    if (!isMail) return;
    e.preventDefault();
    navigator.clipboard.writeText(link.replace("mailto:", ""));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return { copied, isMail, onClick };
};

/** A bordered pill link; a mail link copies the address instead. */
const FooterLink = ({ siteName, link }: FooterLinkProps) => {
  const { copied, isMail, onClick } = useCopyMail(link);

  return (
    <li>
      <Link
        target={isMail ? undefined : "_blank"}
        href={link}
        onClick={onClick}
        className="pill group"
      >
        {copied ? "copied" : siteName}
        {copied ? (
          <Check size={11} className="text-accent" aria-hidden />
        ) : isMail ? (
          <Copy size={11} className="text-soft" aria-hidden />
        ) : (
          <ArrowUpRight
            size={11}
            className="text-soft group-hover:text-foreground"
            aria-hidden
          />
        )}
      </Link>
    </li>
  );
};

/** The big serif address in "say hi"; click to copy. */
export const MailLine = ({ link }: { link: string }) => {
  const { copied, onClick } = useCopyMail(link);
  const address = link.replace("mailto:", "");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={link}
        className="link-dotted break-all font-serif text-[26px] leading-tight text-foreground sm:text-3xl"
      >
        {address}
      </a>
      <button
        type="button"
        onClick={onClick}
        aria-label="Copy email address"
        className="grid h-7 w-7 flex-none place-items-center rounded-md border border-border bg-card text-soft hover:bg-hover hover:text-foreground"
      >
        {copied ? (
          <Check size={12} className="text-accent" aria-hidden />
        ) : (
          <Copy size={12} aria-hidden />
        )}
      </button>
      <span className="label-mono" aria-live="polite">
        {copied ? "copied" : ""}
      </span>
    </div>
  );
};

export default FooterLink;
