import React from "react";
import { RecentProjectProps } from "@/types";

const RecentProject = ({ label, description }: RecentProjectProps) => {
  return (
    <li className="flex gap-2.5 text-[15px] leading-relaxed">
      <span className="select-none text-soft" aria-hidden>
        –
      </span>
      <span>
        <span className="font-medium lowercase text-foreground">{`${label}: `}</span>
        <span className="text-muted-foreground">{description}</span>
      </span>
    </li>
  );
};

export default RecentProject;
