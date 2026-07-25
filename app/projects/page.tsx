import { ProjectCard } from "@/components/generated/ProjectCard";
import { Metadata } from "next";
import air from "@/lib/fetchers/airtable";
import { getRepoPushedAt } from "@/lib/fetchers/github";
import { AirtableProject } from "@/types/air";

const description =
  "Projects have the power to transcend limitations, ignite innovation, and\n" +
  "        shape a better tomorrow through the harmonious blend of creativity, code\n" +
  "        and human potential.";

export const metadata: Metadata = {
  title: "Projects",
  description,
  openGraph: { title: "Projects", description },
  twitter: { title: "Projects", description },
};

export const revalidate = 86400; //24m

export default async function Home() {
  const showcase = await air.getShowcase(0);
  const pushedAtByIndex = await Promise.all(
    showcase.map((project) =>
      project.github ? getRepoPushedAt(project.github) : Promise.resolve(null)
    )
  );

  return (
    <>
      <h1 className="mb-10 mt-12 text-lg text-muted-foreground [font-family:var(--font-body)] font-normal max-w-[60ch] mx-auto">
        Selected work, indexed by nothing in particular — just what I&apos;ve
        been building.
      </h1>
      <div className="w-full grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">
        {showcase.map((project: AirtableProject, index: number) => {
          return (
            <ProjectCard
              {...project}
              updatedAt={pushedAtByIndex[index]}
              key={index}
            />
          );
        })}
      </div>
    </>
  );
}
