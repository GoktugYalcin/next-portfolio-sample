import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { AirtableProject } from "@/types/air";
import { formatRelativeTime } from "@/lib/utils";

export type ProjectWithMeta = AirtableProject & { updatedAt?: string | null };

export const hostOf = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch (e) {
    return null;
  }
};

export const Logo = ({ icon }: { icon: string }) => (
  <span className="logo rain-keep" aria-hidden>
    {icon || "◦"}
  </span>
);

export const LiveBadge = ({ live }: { live: boolean }) =>
  live ? (
    <span className="badge">
      <span className="dot" aria-hidden />
      live
    </span>
  ) : (
    <span className="badge">source</span>
  );

/** "live on host ↗  code ↗" */
export const Store = ({ project }: { project: ProjectWithMeta }) => {
  if (!project.live && !project.github) return null;
  return (
    <p className="store">
      {project.live && (
        <>
          <span className="k">live on</span>
          <a className="ext" href={project.live} target="_blank" rel="noopener">
            {hostOf(project.live) ?? "site"}
            <ArrowUpRight className="icon" aria-hidden />
          </a>
        </>
      )}
      {project.github && (
        <a className="ext" href={project.github} target="_blank" rel="noopener">
          code
          <ArrowUpRight className="icon" aria-hidden />
        </a>
      )}
    </p>
  );
};

export const When = ({ at }: { at?: string | null }) =>
  at ? (
    <>
      updated
      <br />
      {formatRelativeTime(at)}
    </>
  ) : null;

/** The lead entry of a work list, shown in full. */
export function ProjectLead(project: ProjectWithMeta) {
  return (
    <article className="role-main reveal">
      <div className="role-head">
        <Logo icon={project.icon} />
        <div className="role-title">
          <h3>
            {project.name} <LiveBadge live={!!project.live} />
          </h3>
          <p>{project.live ? hostOf(project.live) : "open source"}</p>
        </div>
        <p className="role-when">
          <When at={project.updatedAt} />
        </p>
      </div>
      <div className="role-body">
        <p className="lead">{project.description}</p>
        <Store project={project} />
      </div>
    </article>
  );
}

/** A work entry as a card, for the projects grid. */
export function ProjectCard(project: ProjectWithMeta) {
  const year = project.updatedAt
    ? new Date(project.updatedAt).getFullYear()
    : null;

  return (
    <article className="case">
      <span className="case-k">
        {project.live ? "live" : "source"}
        {year ? ` · ${year}` : ""}
        {project.updatedAt
          ? ` · updated ${formatRelativeTime(project.updatedAt)}`
          : ""}
      </span>
      <div className="case-title">
        <Logo icon={project.icon} />
        <strong>{project.name}</strong>
      </div>
      <span className="case-text">{project.description}</span>
      <Store project={project} />
    </article>
  );
}
