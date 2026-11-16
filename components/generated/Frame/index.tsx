import React from "react";
import { cn } from "@/lib/utils";

const Corner = ({ className }: { className: string }) => (
  <span
    aria-hidden
    className={cn(
      "absolute z-10 h-[3px] w-[3px] bg-foreground opacity-40",
      className
    )}
  />
);

/**
 * Full-bleed striped band with the section title sitting in the frame column.
 * Use `as="h1"` once per page.
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
  <div className="w-full border-y border-border bg-stripes">
    <div className="frame flex min-h-[44px] items-center justify-between gap-4 bg-background px-6 py-2 sm:px-8">
      <Corner className="left-0 top-0 -translate-x-1/2 -translate-y-1/2" />
      <Corner className="right-0 top-0 -translate-y-1/2 translate-x-1/2" />
      <Corner className="bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      <Corner className="bottom-0 right-0 translate-x-1/2 translate-y-1/2" />
      <Tag className="font-serif text-2xl tracking-wide text-foreground">
        {title}
      </Tag>
      {aside && <div className="flex shrink-0 items-center">{aside}</div>}
    </div>
  </div>
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
  <div className={cn("frame", !flush && "px-6 py-8 sm:px-8", className)}>
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
  <section id={id} className="scroll-mt-14">
    <SectionHeader title={title} aside={aside} as={as} />
    <Frame className={className} flush={flush}>
      {children}
    </Frame>
  </section>
);

/** Small pill used for statuses (LIVE, SOURCE…). */
export const StatusBadge = ({
  tone = "neutral",
  children,
}: {
  tone?: "live" | "warn" | "neutral";
  children: React.ReactNode;
}) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded border px-1.5 py-0.5 font-mono text-[9px] font-medium uppercase leading-4 tracking-[0.12em]",
      tone === "live" && "border-accent/40 bg-accent/10 text-accent",
      tone === "warn" && "border-warn/40 bg-warn/10 text-warn",
      tone === "neutral" && "border-border bg-chip text-muted-foreground"
    )}
  >
    {tone === "live" && (
      <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
    )}
    {children}
  </span>
);
