import Info from "@/infos";
import { ProjectCard } from "@/components/generated/ProjectCard";
import { Metadata } from "next";
import { Project } from "@/types";
import air from "@/lib/fetchers/airtable";
import { AirtableProject } from "@/types/air";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Projects have the power to transcend limitations, ignite innovation, and\n" +
    "        shape a better tomorrow through the harmonious blend of creativity, code\n" +
    "        and human potential.",
};

export const revalidate = 86400; //24m

export default async function Home() {
  const showcase = await air.getShowcase(0);
  return (
    <>
      <div className="mb-10 mt-12 text-2xl">
        Projects have the power to transcend limitations, ignite innovation, and
        shape a better tomorrow through the harmonious blend of creativity, code
        and human potential.
      </div>
      <div className="w-full flex-wrap flex gap-4">
        {showcase.map((project: AirtableProject, index: number) => {
          return <ProjectCard {...project} key={index} />;
        })}
      </div>
    </>
  );
}
