import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardIcon,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Globe } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { AirtableProject } from "@/types/air";
import { formatRelativeTime } from "@/lib/utils";

export function ProjectCard(project: AirtableProject & { updatedAt?: string | null }) {
  return (
    <Card className="hud-corners hud-corners--hover group flex h-full w-full flex-col rounded-sm border-border bg-card/60 shadow-none transition-colors duration-200 ease-out hover:border-accent/60">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardIcon className="float-none text-3xl">{project.icon}</CardIcon>
          <CardTitle className="font-display text-xl font-medium">
            {project.name}
          </CardTitle>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex w-full items-center justify-between gap-5 border-t border-border pt-4 font-mono text-xs">
          <div className="flex gap-5">
            {project.github && (
              <Link
                className="flex items-center gap-1.5 text-muted-foreground hover:text-accent hover:underline underline-offset-4"
                href={project.github}
                target={"_blank"}
              >
                <FaGithub size={14} /> Code
              </Link>
            )}
            {project.live && (
              <Link
                className="flex items-center gap-1.5 text-muted-foreground hover:text-accent hover:underline underline-offset-4"
                href={project.live}
                target={"_blank"}
              >
                <Globe size={14} /> Live
              </Link>
            )}
          </div>
          {project.updatedAt && (
            <span className="text-muted-foreground/70">
              updated {formatRelativeTime(project.updatedAt)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
