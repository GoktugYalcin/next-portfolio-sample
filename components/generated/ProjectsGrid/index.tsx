"use client";

import React, { useMemo, useState } from "react";
import {
  ProjectCard,
  ProjectWithMeta,
} from "@/components/generated/ProjectCard";

const FILTERS = [
  { key: "all", label: "all" },
  { key: "live", label: "live" },
  { key: "code", label: "open source" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/** Project cards with the all / live / open source filter. */
const ProjectsGrid = ({ projects }: { projects: ProjectWithMeta[] }) => {
  const [filter, setFilter] = useState<FilterKey>("all");

  const visible = useMemo(
    () =>
      projects.filter((p) => {
        if (filter === "live") return !!p.live;
        if (filter === "code") return !!p.github;
        return true;
      }),
    [projects, filter]
  );

  return (
    <>
      <div className="filter-row reveal">
        <span className="count">
          {visible.length} / {projects.length}
        </span>
        <div className="pills" role="group" aria-label="filter projects">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className="pill"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div
        className="cases reveal"
        style={{ "--d": "80ms" } as React.CSSProperties}
      >
        {visible.map((project, i) => (
          <ProjectCard {...project} key={`${filter}-${project.name}-${i}`} />
        ))}
      </div>
      {!visible.length && (
        <p
          className="hi-note"
          style={{ padding: "28px 0", textAlign: "center" }}
        >
          nothing under this filter yet.
        </p>
      )}
    </>
  );
};

export default ProjectsGrid;
