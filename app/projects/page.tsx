import ProjectsGrid from "@/components/generated/ProjectsGrid";
import NotFound from "@/components/generated/NotFound";
import { Section } from "@/components/generated/Frame";
import { Metadata } from "next";
import air from "@/lib/fetchers/airtable";
import { getRepoPushedAt } from "@/lib/fetchers/github";

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

  const projects = showcase.map((project, index) => ({
    ...project,
    updatedAt: pushedAtByIndex[index],
  }));

  return (
    <Section
      as="h1"
      title="Projects"
      aside={<span className="label-mono">selected work</span>}
    >
      <p className="mb-8 max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
        Selected work, indexed by nothing in particular — just what I&apos;ve
        been building.
      </p>
      {projects.length ? (
        <ProjectsGrid projects={projects} />
      ) : (
        <NotFound whatNotFound={"project"} />
      )}
    </Section>
  );
}
