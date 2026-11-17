import { Metadata } from "next";
import Medium from "@/lib/fetchers/medium";
import Blogs from "@/components/generated/Blog/Blogs";
import NotFound from "@/components/generated/NotFound";
import { Band, PageHead, Section } from "@/components/generated/PageHead";

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

  const items = Array.isArray(blogs?.items) ? blogs.items : [];

  return (
    <>
      <PageHead
        crumb="blog"
        title="writing"
        lede={
          <>
            Writing, indexed by nothing in particular — just what I&apos;ve been
            thinking about frontend development.{" "}
            <a
              className="ext"
              href="https://medium.com/@gokyalcin"
              target="_blank"
              rel="noopener"
            >
              medium.com/@gokyalcin
            </a>
          </>
        }
      />
      <Band />
      <Section className={items.length ? "flush" : ""}>
        {items.length ? (
          <Blogs items={items} />
        ) : (
          <NotFound whatNotFound={"blog"} />
        )}
      </Section>
    </>
  );
}
