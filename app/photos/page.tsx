import { Metadata } from "next";
import unsplash from "@/lib/fetchers/unsplash";
import Photos from "../../components/generated/Photos";
import NotFound from "@/components/generated/NotFound";
import PhotoStatCard from "@/components/generated/PhotoStatCard";
import { Frame, SectionHeader } from "@/components/generated/Frame";

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

  return (
    <section>
      <SectionHeader
        as="h1"
        title="Photos"
        aside={
          <a
            href="https://unsplash.com/@yalcingoktug"
            target="_blank"
            rel="noreferrer"
            className="link-arrow"
          >
            unsplash.com/@yalcingoktug <span aria-hidden>↗</span>
          </a>
        }
      />
      <Frame flush>
        <p className="px-6 py-8 text-[15px] leading-relaxed text-muted-foreground sm:px-8">
          From the working archive.
        </p>
        {hasStats && (
          <div className="grid grid-cols-2 gap-px border-y border-border bg-border">
            <PhotoStatCard
              stat={stats?.views?.total}
              label={"Total Views"}
              link={"https://unsplash.com/@yalcingoktug"}
            />
            <PhotoStatCard
              stat={stats?.downloads?.total}
              label={"Total Downloads"}
              link={"https://unsplash.com/@yalcingoktug"}
            />
          </div>
        )}
        <div className="px-6 py-10 sm:px-8">
          {Array.isArray(photos) && photos.length ? (
            <Photos data={photos} />
          ) : (
            <NotFound whatNotFound={"photo"} />
          )}
        </div>
      </Frame>
    </section>
  );
}
