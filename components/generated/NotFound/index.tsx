import React from "react";
import { NotFoundProps } from "@/types";

const NotFound = ({ whatNotFound }: NotFoundProps) => {
  return (
    <div className="mt-4 flex w-full select-none items-center justify-center">
      <div className="hud-corners flex w-full max-w-sm flex-col items-start justify-center gap-3 border border-dashed border-border p-8">
        <span
          className="signal-dot h-2 w-2 rounded-full bg-accent-2"
          aria-hidden
        />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground">
          No signal
        </span>
        <span className="font-display text-2xl text-foreground">
          No {whatNotFound} found
        </span>
      </div>
    </div>
  );
};

export default NotFound;
