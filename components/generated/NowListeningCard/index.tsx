import React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import spotify from "@/lib/fetchers/spotify";
import { FaSpotify } from "react-icons/fa6";

const EqualizerBars = ({ live }: { live: boolean }) => (
  <span
    className={`eq-bars mr-2 flex-none ${live ? "eq-bars--live" : ""}`}
    aria-hidden
  >
    <span className="eq-bars__bar" />
    <span className="eq-bars__bar" />
    <span className="eq-bars__bar" />
  </span>
);

const NowListeningCard = async () => {
  const lastListened = await spotify.getLastListened();
  if (!lastListened) return <></>;

  return (
    <div className="w-full border-t border-dotted border-border">
      <div className="frame flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <Link href={"/last-listened"} className="link-arrow flex-none">
          <FaSpotify className={"text-accent"} size={13} />
          {lastListened.isNowPlaying
            ? "i'm listening now"
            : "i recently listened"}
          <span aria-hidden>→</span>
        </Link>
        <div className="flex min-w-0 items-center gap-3">
          <Image
            src={lastListened.img}
            alt={lastListened.song}
            width={40}
            height={40}
            className="flex-none rounded-md border border-border"
          />
          <Link
            href={lastListened.url}
            target="_blank"
            className="group flex min-w-0 flex-col"
          >
            <span className="flex items-center text-[13px] font-medium text-foreground underline-offset-2 group-hover:underline">
              <EqualizerBars live={lastListened.isNowPlaying} />
              <span className="truncate">{lastListened.song}</span>
            </span>
            <span className="truncate text-xs text-muted-foreground">
              {lastListened.artists.join(", ")}
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NowListeningCard;
