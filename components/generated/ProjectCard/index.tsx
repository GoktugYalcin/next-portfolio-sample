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
import { Github, Globe } from "lucide-react";
import { Project } from "@/types";
import { AirtableProject } from "@/types/air";

export function ProjectCard(project: AirtableProject) {
  return (
    <Card className="w-[350px] dark:bg-[#18202b] bg-[#fafafa]">
      <CardHeader>
        <CardIcon>{project.icon}</CardIcon>
        <CardTitle>{project.name}</CardTitle>
        <CardDescription>{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex mt-4 w-full justify-end gap-4">
          {project.github && (
            <Link
              className="cursor-pointer"
              href={project.github}
              target={"_blank"}
            >
              <Github />
            </Link>
          )}
          {project.live && (
            <Link
              className="cursor-pointer"
              href={project.live}
              target={"_blank"}
            >
              <Globe />
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
