import React from "react";
import { RecentProjectProps } from "@/types";

const RecentProject = ({ label, description }: RecentProjectProps) => {
  return (
    <li className="flex gap-3 text-sm leading-relaxed">
      <span
        className="mt-[9px] h-1.5 w-1.5 flex-none rounded-full bg-accent"
        aria-hidden
      />
      <span>
        <span className="font-mono text-[13px] text-foreground">{`${label}: `}</span>
        <span className="text-muted-foreground">{description}</span>
      </span>
    </li>
  );
};

export default RecentProject;
