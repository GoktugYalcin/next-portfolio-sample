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
      <p className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.15em] text-accent">
        Blog_index
      </p>
      <h1 className="mb-10 max-w-[60ch] text-lg font-normal text-muted-foreground">
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
