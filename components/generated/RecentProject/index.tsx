import React from "react";
import { RecentProjectProps } from "@/types";

/** One row of the "now" list: what, then the line about it. */
const RecentProject = ({ label, description }: RecentProjectProps) => {
  return (
    <div>
      <dt>{label}</dt>
      <dd>{description}</dd>
    </div>
  );
};

export default RecentProject;
