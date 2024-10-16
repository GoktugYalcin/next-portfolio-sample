import { Metadata } from "next";
import unsplash from "@/lib/fetchers/unsplash";
import Photos from "../../components/generated/Photos";
import NotFound from "@/components/generated/NotFound";
import PhotoStatCard from "@/components/generated/PhotoStatCard";

export const metadata: Metadata = {
  title: "Photos",
  description:
    "Capturing moments through photography is a delightful way to preserve and appreciate the beauty that surrounds us.",
};

export const revalidate = 86400; // 24m

export default async function Home() {
  const photos = await unsplash.getPhotos();
  const stats = await unsplash.getStats();

  return (
    <>
      <div className="mb-10 mt-12 text-2xl">
        Capturing moments through photography is a delightful way to preserve
        and appreciate the beauty that surrounds us.
      </div>
      {stats && (
        <div className="w-full flex justify-evenly items-center mb-10 lg:gap-0 gap-3">
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
