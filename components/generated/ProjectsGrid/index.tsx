"use client";

import React, { useMemo, useState } from "react";
import {
  ProjectCard,
  ProjectWithMeta,
} from "@/components/generated/ProjectCard";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "live", label: "Live" },
  { key: "code", label: "Open source" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

/** Project grid with the All / Live / Open source segmented filter. */
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
      <div className="mb-6 flex items-center justify-between gap-4">
        <span className="label-mono">
          {visible.length} / {projects.length} shown
        </span>
        <div
          role="group"
          aria-label="Filter projects"
          className="flex items-center gap-0.5 rounded-md border border-border bg-card p-0.5 font-mono lowercase"
        >
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              aria-pressed={filter === f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded px-2.5 py-1 text-[11px] ${
                filter === f.key
                  ? "bg-foreground font-semibold text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((project) => (
          <ProjectCard {...project} key={project.name} />
        ))}
      </div>
      {!visible.length && (
        <p className="py-10 text-center font-mono text-xs text-soft">
          Nothing under this filter yet.
        </p>
      )}
    </>
  );
};

export default ProjectsGrid;
