import React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { TbLego, TbPencil } from "react-icons/tb";
import { CgCoffee } from "react-icons/cg";
import { BiBrush } from "react-icons/bi";
import Banner, { BannerPhoto } from "@/components/generated/Banner";
import ProfileCard from "@/components/generated/ProfileCard";
import ColoredCreepyTextWithIcon from "@/components/generated/ColoredCreepyTextWithIcon";
import RecentProject from "@/components/generated/RecentProject";
import IndexRail, { IndexItem } from "@/components/generated/IndexRail";
import Blogs from "@/components/generated/Blog/Blogs";
import { ProjectRow } from "@/components/generated/ProjectCard";
import { Section } from "@/components/generated/Frame";
import air from "@/lib/fetchers/airtable";
import medium from "@/lib/fetchers/medium";
import unsplash from "@/lib/fetchers/unsplash";
import { getRepoPushedAt } from "@/lib/fetchers/github";
import { Walking } from "@/components/generated/Walking";
import { IBlog, IPhoto } from "@/types";

export default async function Home() {
  const [currentProjects, showcase, blogs, photosRaw] = await Promise.all([
    air.getShowcase(1),
    air.getShowcase(0),
    medium.getBlogs(),
    unsplash.getPhotos(8),
  ]);

  const featured = showcase.slice(0, 3);
  const pushedAt = await Promise.all(
    featured.map((p) =>
      p.github ? getRepoPushedAt(p.github) : Promise.resolve(null)
    )
  );
  const posts: IBlog[] = Array.isArray(blogs?.items) ? blogs.items : [];
  const photos: IPhoto[] = Array.isArray(photosRaw) ? photosRaw : [];

  /* the first four photos run in the banner, the next four are the prints */
  const reel: BannerPhoto[] = photos.slice(0, 4).map((photo) => ({
    id: photo.id,
    src: `${photo.urls.raw}&q=80&w=1440&h=368&fit=crop`,
    alt: photo.alt_description || photo.description || "a photo",
  }));
  const prints = photos.length > 4 ? photos.slice(4, 8) : photos.slice(0, 4);

  const index: IndexItem[] = [
    { id: "about", label: "About" },
    ...(currentProjects.length ? [{ id: "now", label: "Now" }] : []),
    ...(featured.length ? [{ id: "projects", label: "Projects" }] : []),
    ...(posts.length ? [{ id: "writing", label: "Writing" }] : []),
    ...(prints.length ? [{ id: "photos", label: "Photos" }] : []),
    { id: "contact", label: "Say hi" },
  ];

  return (
    <>
      <IndexRail items={index} />
      <Banner photos={reel} />
      <ProfileCard />

      <Section id="about" title="About">
        <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-foreground [&_strong]:font-medium">
          <p className="flex items-center gap-1.5 font-serif text-2xl italic leading-none">
            Dear reader,
            <Walking />
          </p>
          <p>
            Building software since <strong>2020</strong>, working today as a{" "}
            <strong>Frontend Engineer</strong>, specialized with React and
            Next.js. Also developed backend with C# and Node.js, games with
            Unity, IOT with C, C++ and Python.{" "}
            <i>
              I converted to Frontend Developer from Javascript Developer at
              2021.
            </i>{" "}
            It&apos;s cause is a bit complicated. I discovered in love with
            designing and develop as WYSIWYG and gave the weight on Frontend.
            Started with maintaining jQuery projects, after that I met with
            React. And it&apos;s big brother Next. Nowadays, I have very big
            interest on Microfrontend and next-gen frontend bundling tools.
          </p>
          <p>
            I enjoy building{" "}
            <ColoredCreepyTextWithIcon
              text={"Lego's"}
              icon={TbLego}
              darkColor={"text-foreground"}
              lightColor={"text-foreground"}
            />
            ,{" "}
            <ColoredCreepyTextWithIcon
              text={"brewing coffee"}
              icon={CgCoffee}
              darkColor={"text-foreground"}
              lightColor={"text-foreground"}
            />{" "}
            and inspiring from{" "}
            <ColoredCreepyTextWithIcon
              text={"art galleries"}
              icon={BiBrush}
              darkColor={"text-foreground"}
              lightColor={"text-foreground"}
            />
            . I&apos;m also writing{" "}
            <ColoredCreepyTextWithIcon
              text={"Medium stories"}
              icon={TbPencil}
              darkColor={"text-foreground"}
              lightColor={"text-foreground"}
            />{" "}
            frequently.
          </p>
        </div>
      </Section>

      {!!currentProjects.length && (
        <Section
          id="now"
          title="Now"
          aside={
            <span className="label-mono">what i&apos;m building right now</span>
          }
        >
          <ul className="flex flex-col gap-2.5">
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
        <Section id="projects" title="Projects">
          {featured.map((project, i) => (
            <ProjectRow
              {...project}
              updatedAt={pushedAt[i]}
              key={project.name}
            />
          ))}
          <Link href="/projects" className="link-arrow mt-6">
            the work lives here <span aria-hidden>›</span>
          </Link>
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
          <div className="border-t border-dotted border-border px-5 py-4 sm:px-6">
            <Link href="/blog" className="link-arrow">
              all the writing <span aria-hidden>›</span>
            </Link>
          </div>
        </Section>
      )}

      {!!prints.length && (
        <Section id="photos" title="Photos">
          <p className="label-mono">from the working archive.</p>
          <div className="mt-5 flex flex-wrap gap-4">
            {prints.map((photo, i) => (
              <Link
                key={photo.id}
                href="/photos"
                aria-label="Open the photo archive"
                className="rain-keep group block bg-card p-1.5 pb-4 shadow-[0_1px_3px_rgb(0_0_0/0.14)] ring-1 ring-border transition-transform duration-300 ease-out hover:!rotate-0 hover:scale-105"
                style={{ rotate: `${[-3, 2, -1.5, 3][i % 4]}deg` }}
              >
                <span className="relative block h-[84px] w-[68px] overflow-hidden sm:h-[104px] sm:w-[84px]">
                  <Image
                    src={`${photo.urls.raw}&q=80&w=240&h=300&fit=crop`}
                    alt={
                      photo.alt_description || photo.description || "A photo"
                    }
                    fill
                    sizes="90px"
                    className="object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                </span>
              </Link>
            ))}
          </div>
          <Link href="/photos" className="link-arrow mt-6">
            open the archive <span aria-hidden>›</span>
          </Link>
        </Section>
      )}
    </>
  );
}
