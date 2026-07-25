import React from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import spotify from "@/lib/fetchers/spotify";
import { FaSpotify } from "react-icons/fa6";

const EqualizerBars = ({ live }: { live: boolean }) => (
  <span
    className={`eq-bars mt-[2px] mr-1.5 float-left ${live ? "eq-bars--live" : ""}`}
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
    <div className="flex flex-col items-start justify-start lg:items-end">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
        Now playing
      </p>
      <Link
        href={"/last-listened"}
        className="mb-4 flex items-center justify-start gap-1.5 font-medium transition hover:underline"
      >
        <FaSpotify className={"text-accent"} />
        {lastListened.isNowPlaying
          ? "I'm listening now"
          : "I recently listened"}
      </Link>
      <div className="flex gap-3">
        <Image
          src={lastListened.img}
          alt={lastListened.song}
          width={50}
          height={50}
          className="hud-corners rounded-sm hover:saturate-100"
        />
        <Link
          href={lastListened.url}
          target="_blank"
          className="group flex flex-col"
        >
          <span className="ml-auto mr-auto inline-block w-[300px] overflow-hidden text-ellipsis whitespace-nowrap align-middle font-semibold underline-offset-2 group-hover:underline">
            <EqualizerBars live={lastListened.isNowPlaying} />
            <span>{lastListened.song}</span>
          </span>
          <span className="inline-block w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-muted-foreground underline-offset-2 group-hover:underline">
            {lastListened.artists.join(", ")}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NowListeningCard;
