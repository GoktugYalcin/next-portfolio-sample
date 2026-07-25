import React from "react";
import { RecentProjectProps } from "@/types";

const RecentProject = ({ label, description }: RecentProjectProps) => {
  return (
    <li className="lg:list-disc lg:ml-4 mb-2">
      <span className="text-muted-foreground">{`${label}: `}</span>
      <span>{description}</span>
    </li>
  );
};

export default RecentProject;
