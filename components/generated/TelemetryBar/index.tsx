import React from "react";
import ThemeButton from "@/components/generated/NavMenu/ThemeButton";

const TelemetryBar: React.FC = () => {
  return (
    <div className="fixed inset-x-0 top-0 z-30 h-11 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-screen-lg items-center justify-between px-4 font-mono text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:text-[11px]">
        <div className="flex items-center gap-2">
          <span
            className="signal-dot h-1.5 w-1.5 rounded-full bg-accent"
            aria-hidden
          />
          <span>System online</span>
        </div>
        <div className="hidden items-center gap-1.5 text-muted-foreground/70 sm:flex">
          <span>41.0082°N</span>
          <span className="text-border">·</span>
          <span>28.9784°E</span>
        </div>
        <ThemeButton />
      </div>
    </div>
  );
};

export default TelemetryBar;
