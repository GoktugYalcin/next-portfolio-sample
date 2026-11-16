import React from "react";
import { NotFoundProps } from "@/types";

const NotFound = ({ whatNotFound }: NotFoundProps) => {
  return (
    <div className="flex w-full select-none flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border bg-stripes px-6 py-14 text-center">
      <span className="animate-bounce text-4xl">🧐</span>
      <span className="font-serif text-2xl text-foreground">
        No {whatNotFound} found
      </span>
      <span className="label-mono">nothing to index here yet</span>
    </div>
  );
};

export default NotFound;
