"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Logo,
  ProjectWithMeta,
  Store,
  hostOf,
} from "@/components/generated/ProjectCard";
import { formatRelativeTime } from "@/lib/utils";

/** The rest of the work list: rows that open to tell their story. */
const ProjectRows = ({
  projects,
  first = false,
}: {
  projects: ProjectWithMeta[];
  first?: boolean;
}) => {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className={`roles reveal ${first ? "first" : ""}`}>
      {projects.map((project, i) => {
        const id = `row-${i}`;
        const isOpen = open === project.name;
        return (
          <div
            className={`role-row ${isOpen ? "open" : ""}`}
            key={project.name}
          >
            <button
              type="button"
              className="role-head"
              aria-expanded={isOpen}
              aria-controls={id}
              onClick={() => setOpen(isOpen ? null : project.name)}
            >
              <Logo icon={project.icon} />
              <span className="role-title">
                <h3>{project.name}</h3>
                <p>{project.live ? hostOf(project.live) : "open source"}</p>
              </span>
              <span className="role-when">
                {project.updatedAt ? formatRelativeTime(project.updatedAt) : ""}
              </span>
              <ChevronDown className="icon chev" aria-hidden />
            </button>
            <div className="role-more" id={id} inert={!isOpen}>
              <div>
                <div className="inner">
                  <p>{project.description}</p>
                  <Store project={project} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectRows;
