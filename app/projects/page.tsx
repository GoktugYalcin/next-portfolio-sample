import Info from "@/infos";
import { ProjectCard } from "@/components/generated/ProjectCard";
import { Metadata } from "next";
import { Project } from "@/types";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects have the power to transcend limitations, ignite innovation, and\n" +
    "        shape a better tomorrow through the harmonious blend of creativity, code\n" +
    "        and human potential.",
};

export const revalidate = 86400; //24m

export default async function Home() {
  return (
    <>
      <div className="mb-10 mt-12 text-2xl">
        Projects have the power to transcend limitations, ignite innovation, and
        shape a better tomorrow through the harmonious blend of creativity, code
        and human potential.
      </div>
      <div className="w-full flex-wrap flex gap-4">
        {Info.projects.map((project: Project, index: number) => {
          return <ProjectCard {...project} key={index} />;
        })}
      </div>
    </>
  );
}
