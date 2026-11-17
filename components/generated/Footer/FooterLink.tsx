"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, Mail, PenLine, Link2 } from "lucide-react";
import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { FooterLinkProps } from "@/types";

const useCopy = (link: string) => {
  const [copied, setCopied] = useState(false);
  const isMail = link.startsWith("mailto:");

  const copy = (e: React.MouseEvent) => {
    if (!isMail) return;
    e.preventDefault();
    navigator.clipboard.writeText(link.replace("mailto:", ""));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return { copied, isMail, copy };
};

const iconFor = (name: string, link: string) => {
  const key = (name + " " + link).toLowerCase();
  if (key.includes("github"))
    return (
      <FaGithub
        className="icon"
        style={{ stroke: "none", fill: "currentColor" }}
      />
    );
  if (key.includes("linkedin"))
    return (
      <FaLinkedinIn
        className="icon"
        style={{ stroke: "none", fill: "currentColor" }}
      />
    );
  if (key.includes("mailto:")) return <Mail className="icon" />;
  if (key.includes("medium")) return <PenLine className="icon" />;
  return <Link2 className="icon" />;
};

/** A pill link; a mail link copies the address instead of opening a client. */
const FooterLink = ({ siteName, link }: FooterLinkProps) => {
  const { copied, isMail, copy } = useCopy(link);

  return (
    <a
      className="pill"
      href={link}
      target={isMail ? undefined : "_blank"}
      rel={isMail ? undefined : "noopener"}
      onClick={copy}
    >
      {iconFor(siteName, link)}
      {copied ? "copied" : siteName}
      {isMail ? (
        copied ? (
          <Check className="icon go" style={{ color: "var(--n-live)" }} />
        ) : (
          <Copy className="icon go" />
        )
      ) : (
        <ArrowUpRight className="icon go" />
      )}
    </a>
  );
};

/** The big serif address in "say hi", with its copy button. */
export const MailLine = ({ link }: { link: string }) => {
  const { copied, copy } = useCopy(link);

  return (
    <div className="mail-row">
      <a className="mail" href={link}>
        {link.replace("mailto:", "")}
      </a>
      <button
        type="button"
        className={`copy-btn ${copied ? "copied" : ""}`}
        onClick={copy}
        aria-label="copy email address"
      >
        <Copy className="icon i-copy" />
        <Check className="icon i-check" />
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "copied" : ""}
      </span>
    </div>
  );
};

export default FooterLink;
