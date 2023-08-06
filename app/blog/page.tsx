import { Metadata } from "next";
import Medium from "@/lib/fetchers/medium";
import Blogs from "@/components/generated/Blog/Blogs";
import NotFound from "@/components/generated/NotFound";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Unleashing creativity through captivating posts about frontend development is a gateway to inspire and engage fellow developers, fostering a vibrant and innovative community.",
};

export const revalidate = 86400; // 24m

export default async function Home() {
  const blogs = await Medium.getBlogs();

  return (
    <>
      <div className="mb-10 mt-12 text-2xl">
        Unleashing creativity through captivating posts about frontend
        development is a gateway to inspire and engage fellow developers,
        fostering a vibrant and innovative community.
      </div>
      {blogs.items.length ? (
        <Blogs {...blogs} />
      ) : (
        <NotFound whatNotFound={"blog"} />
      )}
    </>
  );
}
