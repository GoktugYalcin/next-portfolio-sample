import * as React from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa";
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

export function ProjectCard(project: ProjectWithMeta) {
  const liveHost = project.live ? hostOf(project.live) : null;
  const year = project.updatedAt
    ? new Date(project.updatedAt).getFullYear()
    : null;

  return (
    <article className="flex h-full w-full flex-col rounded-xl border border-border bg-card p-4 transition-colors duration-200 ease-out hover:border-foreground/25">
      <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-lg border border-border bg-background bg-stripes">
        <div className="absolute left-2 top-2">
          {project.live ? (
            <StatusBadge tone="live">Live</StatusBadge>
          ) : (
            <StatusBadge>Source</StatusBadge>
          )}
        </div>
        {project.updatedAt && (
          <span className="absolute right-2 top-2 font-mono text-[9px] uppercase tracking-[0.12em] text-soft">
            updated {formatRelativeTime(project.updatedAt)}
          </span>
        )}
        <span className="select-none text-4xl" aria-hidden>
          {project.icon || "◦"}
        </span>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-3">
        <h3 className="text-base font-semibold text-foreground">
          {project.name}
        </h3>
        {year && (
          <span className="font-mono text-[11px] text-soft">{year}</span>
        )}
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">
        {project.description}
      </p>

      <div className="mt-auto pt-4">
        <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
          <div className="flex min-w-0 flex-1 items-center">
            {liveHost ? (
              <span className="chip truncate">{liveHost}</span>
            ) : (
              <span className="chip">open source</span>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-soft">
            {project.live && (
              <Link
                href={project.live}
                target={"_blank"}
                aria-label={`${project.name} — live`}
                className="hover:text-foreground"
              >
                <Globe size={15} />
              </Link>
            )}
            {project.github && (
              <Link
                href={project.github}
                target={"_blank"}
                aria-label={`${project.name} — code`}
                className="hover:text-foreground"
              >
                <FaGithub size={15} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
