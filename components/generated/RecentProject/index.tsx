import React from "react";
import { RecentProjectProps } from "@/types";

const RecentProject = ({ label, description }: RecentProjectProps) => {
  return (
    <li className="mb-2 flex gap-2">
      <span className="mt-[3px] text-accent" aria-hidden>
        ▸
      </span>
      <span>
        <span className="font-medium text-foreground">{`${label}: `}</span>
        <span className="text-muted-foreground">{description}</span>
      </span>
    </li>
  );
};

export default RecentProject;
