import React from "react";
import { Link } from "next-view-transitions";
import { ChevronRight } from "lucide-react";
import { TbLego, TbPencil } from "react-icons/tb";
import { CgCoffee } from "react-icons/cg";
import { BiBrush } from "react-icons/bi";
import Cover, { CoverPhoto } from "@/components/generated/Cover";
import Intro from "@/components/generated/Motion/Intro";
import ProfileCard from "@/components/generated/ProfileCard";
import bne from "@/components/generated/ProfileCard/bne.jpeg";
import ColoredCreepyTextWithIcon from "@/components/generated/ColoredCreepyTextWithIcon";
import RecentProject from "@/components/generated/RecentProject";
import Blogs from "@/components/generated/Blog/Blogs";
import { ProjectLead } from "@/components/generated/ProjectCard";
import ProjectRows from "@/components/generated/ProjectCard/ProjectRows";
import { Band, Section } from "@/components/generated/PageHead";
import { Walking } from "@/components/generated/Walking";
import { getProjects } from "@/lib/projects";
import medium from "@/lib/fetchers/medium";
import unsplash from "@/lib/fetchers/unsplash";
import { getRepoPushedAt } from "@/lib/fetchers/github";
import { IBlog, IPhoto } from "@/types";

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

const Hobby = ({ text, icon }: { text: string; icon: React.ElementType }) => (
  <ColoredCreepyTextWithIcon
    text={text}
    icon={icon}
    darkColor={"text-foreground"}
    lightColor={"text-foreground"}
  />
);

export default async function Home() {
  const [currentProjects, showcase, blogs, photosRaw] = await Promise.all([
    getProjects(true),
    getProjects(false),
    medium.getBlogs(),
    unsplash.getPhotos(8),
  ]);

  const featured = showcase.slice(0, 4);
  const pushedAt = await Promise.all(
    featured.map((p) =>
      p.github ? getRepoPushedAt(p.github) : Promise.resolve(null)
    )
  );
  const work = featured.map((p, i) => ({ ...p, updatedAt: pushedAt[i] }));
  const posts: IBlog[] = Array.isArray(blogs?.items) ? blogs.items : [];
  const photos: IPhoto[] = Array.isArray(photosRaw) ? photosRaw : [];

  /* the first four photos take turns on the cover */
  const reel: CoverPhoto[] = photos.slice(0, 4).map((photo) => ({
    id: photo.id,
    src: `${photo.urls.raw}&q=80&w=1200&h=400&fit=crop`,
    alt: photo.alt_description || photo.description || "a photo",
  }));
  const stamp = photos[4] ?? photos[1];
  const now = new Date();

  return (
    <>
      <Intro avatar={bne.src} />
      <Cover
        photos={reel}
        stamp={
          stamp
            ? { src: `${stamp.urls.raw}&q=80&w=240&h=300&fit=crop` }
            : undefined
        }
      />
      <ProfileCard />

      <Band />
      <Section id="about" title="about" className="prose">
        <p className="salute">
          Dear reader, <Walking />
        </p>
        <p>
          Building software since <b>2020</b>, working today as a{" "}
          <b>Frontend Engineer</b>, specialized with React and Next.js. Also
          developed backend with C# and Node.js, games with Unity, IOT with C,
          C++ and Python.{" "}
          <i>
            I converted to Frontend Developer from Javascript Developer at 2021.
          </i>{" "}
          It&apos;s cause is a bit complicated. I discovered in love with
          designing and develop as WYSIWYG and gave the weight on Frontend.
          Started with maintaining jQuery projects, after that I met with React.
          And it&apos;s big brother Next. Nowadays, I have very big interest on
          Microfrontend and next-gen frontend bundling tools.
        </p>
        <p>
          I enjoy building <Hobby text={"Lego's"} icon={TbLego} />,{" "}
          <Hobby text={"brewing coffee"} icon={CgCoffee} /> and inspiring from{" "}
          <Hobby text={"art galleries"} icon={BiBrush} />. I&apos;m also writing{" "}
          <Hobby text={"Medium stories"} icon={TbPencil} /> frequently.
        </p>
      </Section>

      {!!currentProjects.length && (
        <>
          <Band />
          <Section
            id="now"
            title="right now"
            meta={
              <span className="sec-meta">
                {MONTHS[now.getMonth()]} {now.getFullYear()}
              </span>
            }
          >
            <dl className="rows">
              {currentProjects.map((project) => (
                <RecentProject
                  key={project.name}
                  label={project.name}
                  description={project.description}
                />
              ))}
            </dl>
          </Section>
        </>
      )}

      {!!work.length && (
        <>
          <Band />
          <Section id="projects" title="projects" reveal={false}>
            <ProjectLead {...work[0]} />
            {work.length > 1 && <ProjectRows projects={work.slice(1)} />}
            <Link
              className="text-btn"
              href="/projects"
              style={{ marginTop: 18 }}
            >
              the work lives here
              <ChevronRight className="icon" aria-hidden />
            </Link>
          </Section>
        </>
      )}

      {!!posts.length && (
        <>
          <Band />
          <Section
            id="writing"
            title="writing"
            className="flush"
            meta={
              <a
                className="sec-meta"
                href="https://medium.com/@gokyalcin"
                target="_blank"
                rel="noopener"
              >
                medium.com/@gokyalcin ↗
              </a>
            }
          >
            <Blogs items={posts} limit={4} />
            <Link
              className="text-btn"
              href="/blog"
              style={{ margin: "14px 0 18px" }}
            >
              all the writing
              <ChevronRight className="icon" aria-hidden />
            </Link>
          </Section>
        </>
      )}
    </>
  );
}
