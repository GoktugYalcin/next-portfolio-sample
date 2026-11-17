import React from "react";
import { cn } from "@/lib/utils";

/** The dotted-texture strip that separates one section from the next. */
export const Gutter = () => (
  <div className="rule-y" aria-hidden>
    <div className="frame bg-dots h-6" />
  </div>
);

/**
 * Section title row: lowercase serif title left, a quiet mono aside right,
 * closed by a full-bleed dotted rule. Use `as="h1"` once per page.
 */
export const SectionHeader = ({
  title,
  aside,
  as: Tag = "h2",
}: {
  title: React.ReactNode;
  aside?: React.ReactNode;
  as?: "h1" | "h2";
}) => (
  <>
    <Gutter />
    <div className="rule-b">
      <div className="frame flex min-h-[52px] items-center justify-between gap-4 px-5 py-2 sm:px-6">
        <Tag className="font-serif text-[28px] leading-none tracking-tight text-foreground">
          {title}
        </Tag>
        {aside && <div className="flex shrink-0 items-center">{aside}</div>}
      </div>
    </div>
  </>
);

export const Frame = ({
  children,
  className,
  flush = false,
}: {
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) => (
  <div className={cn("frame", !flush && "px-5 py-7 sm:px-6", className)}>
    {children}
  </div>
);

export const Section = ({
  id,
  title,
  aside,
  as,
  children,
  className,
  flush,
}: {
  id?: string;
  title: React.ReactNode;
  aside?: React.ReactNode;
  as?: "h1" | "h2";
  children: React.ReactNode;
  className?: string;
  flush?: boolean;
}) => (
  <section id={id} className="scroll-mt-12">
    <SectionHeader title={title} aside={aside} as={as} />
    <Frame className={className} flush={flush}>
      {children}
    </Frame>
  </section>
);

/** Small pill used for statuses (live, source…). */
export const StatusBadge = ({
  tone = "neutral",
  children,
}: {
  tone?: "live" | "warn" | "neutral";
  children: React.ReactNode;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-px font-mono text-[10.5px] lowercase leading-4 text-muted-foreground"
    )}
  >
    {tone !== "neutral" && (
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tone === "live" ? "bg-accent" : "bg-warn"
        )}
        aria-hidden
      />
    )}
    {children}
  </span>
);
