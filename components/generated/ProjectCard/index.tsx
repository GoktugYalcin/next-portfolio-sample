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
    <Card className="w-full h-full flex flex-col border-border bg-card shadow-none transition-colors duration-200 ease-out hover:border-accent">
      <CardHeader>
        <div className="flex items-center gap-3">
          <CardIcon className="float-none">{project.icon}</CardIcon>
          <CardTitle className="text-xl">{project.name}</CardTitle>
        </div>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent className="mt-auto">
        <div className="flex w-full items-center justify-between gap-5 text-sm">
          <div className="flex gap-5">
            {project.github && (
              <Link
                className="flex items-center gap-1.5 text-muted-foreground hover:text-accent hover:underline underline-offset-4"
                href={project.github}
                target={"_blank"}
              >
                <FaGithub size={15} /> Code
              </Link>
            )}
            {project.live && (
              <Link
                className="flex items-center gap-1.5 text-muted-foreground hover:text-accent hover:underline underline-offset-4"
                href={project.live}
                target={"_blank"}
              >
                <Globe size={15} /> Live
              </Link>
            )}
          </div>
          {project.updatedAt && (
            <span className="text-xs text-muted-foreground">
              updated {formatRelativeTime(project.updatedAt)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
