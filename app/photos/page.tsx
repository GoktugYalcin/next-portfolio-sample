import { Metadata } from "next";
import unsplash from "@/lib/fetchers/unsplash";
import Photos from "../../components/generated/Photos";
import NotFound from "@/components/generated/NotFound";
import { Band, PageHead, Section } from "@/components/generated/PageHead";

const description =
  "Capturing moments through photography is a delightful way to preserve and appreciate the beauty that surrounds us.";

export const metadata: Metadata = {
  title: "Photos",
  description,
  openGraph: { title: "Photos", description },
  twitter: { title: "Photos", description },
};

export const revalidate = 86400; // 24m

export default async function Home() {
  const photos = await unsplash.getPhotos();
  const stats = await unsplash.getStats();

  const hasStats = !!stats?.views && !!stats?.downloads;

  const count = (n?: number) =>
    n?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return (
    <>
      <PageHead
        crumb="photos"
        title="photos"
        lede={
          <>
            From the working archive
            {hasStats && (
              <>
                {" "}
                — {count(stats?.views?.total)} views and{" "}
                {count(stats?.downloads?.total)} downloads so far
              </>
            )}
            .{" "}
            <a
              className="ext"
              href="https://unsplash.com/@yalcingoktug"
              target="_blank"
              rel="noopener"
            >
              unsplash.com/@yalcingoktug
            </a>
          </>
        }
      />
      <Band />
      <Section
        title="prints"
        meta={
          <span className="sec-meta">
            {Array.isArray(photos) ? photos.length : 0} · click one
          </span>
        }
      >
        {Array.isArray(photos) && photos.length ? (
          <Photos data={photos} />
        ) : (
          <NotFound whatNotFound={"photo"} />
        )}
      </Section>
    </>
  );
}
