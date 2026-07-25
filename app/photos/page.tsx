import { Metadata } from "next";
import unsplash from "@/lib/fetchers/unsplash";
import Photos from "../../components/generated/Photos";
import NotFound from "@/components/generated/NotFound";
import PhotoStatCard from "@/components/generated/PhotoStatCard";

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

  return (
    <>
      <p className="mb-3 mt-8 font-mono text-xs uppercase tracking-[0.15em] text-accent">
        Photo_archive
      </p>
      <h1 className="mb-8 text-sm font-normal text-muted-foreground">
        From the working archive.
      </h1>
      {stats && (
        <div className="w-full flex gap-8 mb-10 text-sm">
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
      {photos?.length ? (
        <Photos data={photos} />
      ) : (
        <NotFound whatNotFound={"photo"} />
      )}
    </>
  );
}
