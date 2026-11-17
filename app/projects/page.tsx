import ProjectsGrid from "@/components/generated/ProjectsGrid";
import NotFound from "@/components/generated/NotFound";
import { Band, PageHead, Section } from "@/components/generated/PageHead";
import { Metadata } from "next";
import { getProjects } from "@/lib/projects";
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
  const showcase = await getProjects(false);
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
    <>
      <PageHead
        crumb="projects"
        title="projects"
        lede={
          <>
            Selected work, indexed by nothing in particular — just what
            I&apos;ve been building.
          </>
        }
      />
      <Band />
      <Section reveal={false}>
        {projects.length ? (
          <ProjectsGrid projects={projects} />
        ) : (
          <NotFound whatNotFound={"project"} />
        )}
      </Section>
    </>
  );
}
