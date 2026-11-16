import React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { TbLego, TbPencil } from "react-icons/tb";
import { CgCoffee } from "react-icons/cg";
import { BiBrush } from "react-icons/bi";
import Banner from "@/components/generated/Banner";
import ProfileCard from "@/components/generated/ProfileCard";
import ColoredCreepyTextWithIcon from "@/components/generated/ColoredCreepyTextWithIcon";
import RecentProject from "@/components/generated/RecentProject";
import IndexRail, { IndexItem } from "@/components/generated/IndexRail";
import Blogs from "@/components/generated/Blog/Blogs";
import { ProjectCard } from "@/components/generated/ProjectCard";
import { Section } from "@/components/generated/Frame";
import air from "@/lib/fetchers/airtable";
import medium from "@/lib/fetchers/medium";
import unsplash from "@/lib/fetchers/unsplash";
import { getRepoPushedAt } from "@/lib/fetchers/github";
import { IBlog, IPhoto } from "@/types";

const HOBBIES = [
  { text: "Building Lego's", icon: TbLego },
  { text: "Brewing coffee", icon: CgCoffee },
  { text: "Art galleries", icon: BiBrush },
  { text: "Medium stories", icon: TbPencil },
];

const Bullet = ({ children }: { children: React.ReactNode }) => (
  <li className="flex gap-3">
    <span className="select-none text-soft" aria-hidden>
      •
    </span>
    <p>{children}</p>
  </li>
);

export default async function Home() {
  const [currentProjects, showcase, blogs, photosRaw] = await Promise.all([
    air.getShowcase(1),
    air.getShowcase(0),
    medium.getBlogs(),
    unsplash.getPhotos(4),
  ]);

  const featured = showcase.slice(0, 4);
  const pushedAt = await Promise.all(
    featured.map((p) =>
      p.github ? getRepoPushedAt(p.github) : Promise.resolve(null)
    )
  );
  const posts: IBlog[] = Array.isArray(blogs?.items) ? blogs.items : [];
  const photos: IPhoto[] = Array.isArray(photosRaw) ? photosRaw : [];

  const index: IndexItem[] = [
    { id: "about", label: "About" },
    ...(currentProjects.length ? [{ id: "now", label: "Now" }] : []),
    ...(featured.length ? [{ id: "projects", label: "Projects" }] : []),
    ...(posts.length ? [{ id: "writing", label: "Writing" }] : []),
    ...(photos.length ? [{ id: "photos", label: "Photos" }] : []),
    { id: "contact", label: "Contact" },
  ];

  return (
    <>
      <IndexRail items={index} />
      <Banner />
      <ProfileCard />

      <Section id="about" title="About">
        <p className="mb-5 font-serif text-2xl italic text-foreground">
          Dear reader,
        </p>
        <ul className="flex flex-col gap-4 text-[15px] leading-relaxed text-muted-foreground [&_strong]:font-semibold [&_strong]:text-foreground">
          <Bullet>
            Building software since <strong>2020</strong>, working today as a{" "}
            <strong>Frontend Engineer</strong>, specialized with React and
            Next.js. Also developed backend with C# and Node.js, games with
            Unity, IOT with C, C++ and Python.
          </Bullet>
          <Bullet>
            <i>
              I converted to Frontend Developer from Javascript Developer at
              2021.
            </i>{" "}
            It&apos;s cause is a bit complicated. I discovered in love with
            designing and develop as WYSIWYG and gave the weight on Frontend.
          </Bullet>
          <Bullet>
            Started with maintaining jQuery projects, after that I met with
            React. And it&apos;s big brother Next. Nowadays, I have very big
            interest on Microfrontend and next-gen frontend bundling tools.
          </Bullet>
        </ul>

        <div className="mt-7 rounded-lg border border-border bg-card px-4 py-3.5">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground">
            Off the clock
          </p>
          <ul className="grid gap-x-6 gap-y-2 font-mono text-[13px] sm:grid-cols-2">
            {HOBBIES.map((hobby) => (
              <li key={hobby.text} className="flex items-center gap-2.5">
                <span
                  className="h-1.5 w-1.5 flex-none rounded-full bg-accent"
                  aria-hidden
                />
                <ColoredCreepyTextWithIcon
                  text={hobby.text}
                  icon={hobby.icon}
                  darkColor={"text-muted-foreground"}
                  lightColor={"text-muted-foreground"}
                />
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {!!currentProjects.length && (
        <Section
          id="now"
          title="Now"
          aside={
            <span className="label-mono">what I&apos;m building right now</span>
          }
        >
          <ul className="flex flex-col gap-3">
            {currentProjects.map((project) => (
              <RecentProject
                key={project.name}
                label={project.name}
                description={project.description}
              />
            ))}
          </ul>
        </Section>
      )}

      {!!featured.length && (
        <Section
          id="projects"
          title="Projects"
          aside={
            <Link href="/projects" className="link-arrow">
              the work lives here <span aria-hidden>→</span>
            </Link>
          }
          className="py-5"
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {featured.map((project, i) => (
              <ProjectCard
                {...project}
                updatedAt={pushedAt[i]}
                key={project.name}
              />
            ))}
          </div>
        </Section>
      )}

      {!!posts.length && (
        <Section
          id="writing"
          title="Writing"
          flush
          aside={
            <a
              href="https://medium.com/@gokyalcin"
              target="_blank"
              rel="noreferrer"
              className="link-arrow"
            >
              medium.com/@gokyalcin <span aria-hidden>↗</span>
            </a>
          }
        >
          <Blogs items={posts} limit={4} />
          <div className="flex justify-center border-t border-border bg-stripes py-7">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-md bg-foreground px-4 py-2 text-[13px] font-semibold text-background hover:opacity-85"
            >
              Read all articles <span aria-hidden>→</span>
            </Link>
          </div>
        </Section>
      )}

      {!!photos.length && (
        <Section
          id="photos"
          title="Photos"
          aside={
            <Link href="/photos" className="link-arrow">
              from the working archive <span aria-hidden>→</span>
            </Link>
          }
          className="py-5"
        >
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {photos.map((photo) => (
              <Link
                key={photo.id}
                href="/photos"
                className="group relative block aspect-square overflow-hidden rounded-lg border border-border"
              >
                <Image
                  src={`${photo.urls.raw}&q=80&w=400&h=400&fit=crop`}
                  alt={photo.alt_description || photo.description || "A photo"}
                  fill
                  sizes="(min-width: 640px) 170px, 45vw"
                  className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                />
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
