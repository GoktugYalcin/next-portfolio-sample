import ProfileCard from "@/components/generated/ProfileCard";
import { TbLego, TbPencil } from "react-icons/tb";
import { CgCoffee } from "react-icons/cg";
import { BiBrush } from "react-icons/bi";
import ColoredCreepyTextWithIcon from "@/components/generated/ColoredCreepyTextWithIcon";
import RecentProject from "@/components/generated/RecentProject";

export default function Home() {
  return (
    <>
      <ProfileCard />
      <div className="mb-4 mt-12 text-base leading-8">
        <p className="mb-4 font-medium">About me</p>
        <p>
          Building software since <strong>2020</strong> and specialized with{" "}
          React and Next.js at the moment. Also developed backend with{" "}
          <span className="text-purple-700">C#</span> and{" "}
          <span className="text-green-700">Node.js</span>, game with{" "}
          <span className="text-orange-700">Unity</span>, IOT with{" "}
          <span className="text-rose-700">C</span>,{" "}
          <span className="text-blue-700">C++</span> and{" "}
          <span className="text-yellow-700">Python</span>.
          <i className="mx-1">
            I converted to Frontend Developer from Javascript Developer at 2021.
          </i>
          It&apos;s cause is a bit complicated. I discovered in love with
          designing and develop as WYSIWYG and gave the weight on Frontend.
          Started with maintaining JQuery projects after that, I met with{" "}
          <span className="text-base text-blue-600">React</span>. And It&apos;s
          big brother <span className="text-base text-blue-600">Next</span>.
        </p>
        <p className="mt-6">
          I enjoy building{" "}
          <ColoredCreepyTextWithIcon
            text={"Lego's"}
            icon={TbLego}
            darkColor={"text-yellow-300"}
            lightColor={"text-yellow-800"}
          />
          ,{" "}
          <ColoredCreepyTextWithIcon
            text={"brewing coffee"}
            icon={CgCoffee}
            darkColor={"text-amber-500"}
            lightColor={"text-amber-900"}
          />{" "}
          and inspiring from{" "}
          <ColoredCreepyTextWithIcon
            text={"art galleries"}
            icon={BiBrush}
            darkColor={"text-pink-400"}
            lightColor={"text-pink-700"}
          />
          . I&apos;m also writing{" "}
          <ColoredCreepyTextWithIcon
            text={"Medium stories"}
            icon={TbPencil}
            darkColor={"text-sky-200"}
            lightColor={"text-sky-900"}
          />{" "}
          frequently.
        </p>
        <div className="mt-6">
          <h2 className="mb-2">Currently working on:</h2>
          <ul>
            <RecentProject
              label={"Short-it"}
              description={
                "A link shortener app built with Supabase, Tailwind, TypeScript and Next.js"
              }
            />
            <RecentProject
              label={"Sighttrippr"}
              description={
                "Trip router and suggestion app. Building with Google API, TypeScript, Firebase, Next.js"
              }
            />
            <RecentProject
              label={"Spotify Recommendation App"}
              description={
                "I googled an app which can create custom Spotify Listening Card\n" +
                "                but I cannot found any. So I decided to build it myself."
              }
            />
          </ul>
        </div>
      </div>
    </>
  );
}
