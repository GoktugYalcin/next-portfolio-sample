import * as React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AirtableProject } from "@/types/air";
import { formatRelativeTime } from "@/lib/utils";
import { StatusBadge } from "@/components/generated/Frame";

export type ProjectWithMeta = AirtableProject & { updatedAt?: string | null };

const hostOf = (url: string) => {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch (e) {
    return null;
  }
};

const Icon = ({ icon }: { icon: string }) => (
  <span
    className="rain-keep grid h-9 w-9 flex-none select-none place-items-center rounded-lg border border-border bg-card text-lg"
    aria-hidden
  >
    {icon || "◦"}
  </span>
);

const Links = ({ project }: { project: ProjectWithMeta }) => {
  const liveHost = project.live ? hostOf(project.live) : null;
  if (!project.live && !project.github) return null;

  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-foreground">
      {project.live && (
        <>
          <span className="label-mono">live on</span>
          <Link
            href={project.live}
            target={"_blank"}
            className="link-dotted inline-flex items-center gap-1"
          >
            {liveHost ?? "site"}
            <ArrowUpRight size={11} className="text-soft" aria-hidden />
          </Link>
        </>
      )}
      {project.github && (
        <Link
          href={project.github}
          target={"_blank"}
          className="link-dotted inline-flex items-center gap-1"
        >
          code
          <ArrowUpRight size={11} className="text-soft" aria-hidden />
        </Link>
      )}
    </p>
  );
};

/** A work entry as a full-width row: icon, name, status, meta, then the story. */
export function ProjectRow(project: ProjectWithMeta) {
  return (
    <article className="reveal border-b border-dotted border-border py-6 first:pt-0 last:border-b-0 last:pb-0">
      <div className="flex items-start gap-3">
        <Icon icon={project.icon} />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-medium lowercase text-foreground">
              {project.name}
            </h3>
            {project.live ? (
              <StatusBadge tone="live">live</StatusBadge>
            ) : (
              <StatusBadge>source</StatusBadge>
            )}
          </div>
          <span className="text-[13px] lowercase text-soft">
            {project.live ? hostOf(project.live) : "open source"}
          </span>
        </div>
        {project.updatedAt && (
          <span className="flex-none pt-0.5 text-right font-mono text-[11px] lowercase leading-snug text-soft">
            updated
            <br />
            {formatRelativeTime(project.updatedAt)}
          </span>
        )}
      </div>
      <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-3">
        <Links project={project} />
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
    <article className="reveal flex h-full w-full flex-col rounded-lg border border-border bg-card p-4 transition-colors duration-200 ease-out hover:border-foreground/30">
      <div className="flex items-center justify-between gap-3">
        <span className="label-mono">
          {project.live ? "live" : "source"}
          {year ? ` · ${year}` : ""}
        </span>
        {project.updatedAt && (
          <span className="label-mono">
            updated {formatRelativeTime(project.updatedAt)}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <Icon icon={project.icon} />
        <h3 className="text-base font-medium lowercase text-foreground">
          {project.name}
        </h3>
      </div>
      <p className="mb-4 mt-3 text-[13.5px] leading-relaxed text-muted-foreground">
        {project.description}
      </p>
      <div className="mt-auto border-t border-dotted border-border pt-3">
        <Links project={project} />
      </div>
    </article>
  );
}
