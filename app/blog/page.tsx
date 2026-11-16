import { Metadata } from "next";
import Medium from "@/lib/fetchers/medium";
import Blogs from "@/components/generated/Blog/Blogs";
import NotFound from "@/components/generated/NotFound";
import { Section } from "@/components/generated/Frame";

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
    <Section
      as="h1"
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
      <div className="border-b border-border px-6 py-8 sm:px-8">
        <p className="max-w-[60ch] text-[15px] leading-relaxed text-muted-foreground">
          Writing, indexed by nothing in particular — just what I&apos;ve been
          thinking about frontend development.
        </p>
      </div>
      {items.length ? (
        <Blogs items={items} />
      ) : (
        <div className="px-6 py-8 sm:px-8">
          <NotFound whatNotFound={"blog"} />
        </div>
      )}
    </Section>
  );
}
