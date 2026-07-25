import { Link } from "next-view-transitions";
import ProfileCard from "@/components/generated/ProfileCard";
import { TbLego, TbPencil } from "react-icons/tb";
import { CgCoffee } from "react-icons/cg";
import { BiBrush } from "react-icons/bi";
import ColoredCreepyTextWithIcon from "@/components/generated/ColoredCreepyTextWithIcon";
import RecentProject from "@/components/generated/RecentProject";
import air from "@/lib/fetchers/airtable";
import React from "react";
import { Walking } from "@/components/generated/Walking";
import { IstanbulClock } from "@/components/generated/IstanbulClock";

export default async function Home() {
  const currentProjects = await air.getShowcase(1);

  return (
    <>
      <ProfileCard />
      <div className="mb-4 mt-12 max-w-[52ch] mx-auto text-base leading-8">
        <p className="mb-2 text-sm text-muted-foreground">
          <IstanbulClock />
        </p>
        <p className="mb-6 font-display italic text-2xl text-foreground flex items-center gap-1.5">
          Dear reader,
          <Walking />
        </p>
        <p className="first-letter:font-display first-letter:text-5xl first-letter:font-semibold first-letter:text-accent first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:leading-[0.8]">
          Building software since <strong>2020</strong>, working today as a{" "}
          <strong>Frontend Engineer</strong>, specialized with React and
          Next.js. Also developed backend with C# and Node.js, games with
          Unity, IOT with C, C++ and Python.{" "}
          <i>
            I converted to Frontend Developer from Javascript Developer at 2021.
          </i>{" "}
          It&apos;s cause is a bit complicated. I discovered in love with
          designing and develop as WYSIWYG and gave the weight on Frontend.
          Started with maintaining jQuery projects, after that I met with React.
          And it&apos;s big brother Next. Nowadays, I have very big interest on
          Microfrontend and next-gen frontend bundling tools.
        </p>
        <p className="mt-6">
          I enjoy building{" "}
          <ColoredCreepyTextWithIcon
            text={"Lego's"}
            icon={TbLego}
            darkColor={"text-accent"}
            lightColor={"text-accent"}
          />
          ,{" "}
          <ColoredCreepyTextWithIcon
            text={"brewing coffee"}
            icon={CgCoffee}
            darkColor={"text-accent"}
            lightColor={"text-accent"}
          />{" "}
          and inspiring from{" "}
          <ColoredCreepyTextWithIcon
            text={"art galleries"}
            icon={BiBrush}
            darkColor={"text-accent"}
            lightColor={"text-accent"}
          />
          . I&apos;m also writing{" "}
          <ColoredCreepyTextWithIcon
            text={"Medium stories"}
            icon={TbPencil}
            darkColor={"text-accent"}
            lightColor={"text-accent"}
          />{" "}
          frequently.
        </p>

        <p className="my-8 text-center text-muted-foreground" aria-hidden>
          * * *
        </p>

        <div>
          <h2 className="mb-2 text-lg">
            A note on what I&apos;m building right now:
          </h2>
          <ul>
            {currentProjects.map((project) => (
              <RecentProject
                key={project.name}
                label={project.name}
                description={project.description}
              />
            ))}
          </ul>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          p.s. — the work lives{" "}
          <Link href="/projects" className="text-accent hover:underline">
            here →
          </Link>
        </p>
      </div>
    </>
  );
}
