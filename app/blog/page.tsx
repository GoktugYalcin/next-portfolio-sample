import { Metadata } from "next";
import Medium from "@/lib/fetchers/medium";
import Blogs from "@/components/generated/Blog/Blogs";
import NotFound from "@/components/generated/NotFound";

const description =
  "Unleashing creativity through captivating posts about frontend development is a gateway to inspire and engage fellow developers, fostering a vibrant and innovative community.";

export const metadata: Metadata = {
  title: "Blogs",
  description,
  openGraph: { title: "Blogs", description },
  twitter: { title: "Blogs", description },
};

export const revalidate = 86400; // 24m

export default async function Home() {
  const blogs = await Medium.getBlogs();

  return (
    <>
      <h1 className="mb-10 mt-12 text-lg text-muted-foreground [font-family:var(--font-body)] font-normal max-w-[60ch] mx-auto">
        Writing, indexed by nothing in particular — just what I&apos;ve been
        thinking about frontend development.
      </h1>
      {blogs.items.length ? (
        <Blogs {...blogs} />
      ) : (
        <NotFound whatNotFound={"blog"} />
      )}
    </>
  );
}
