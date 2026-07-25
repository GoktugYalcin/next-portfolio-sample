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
    <div className="flex-col flex justify-start items-start">
      <Link
        href={"/last-listened"}
        className="font-medium mb-4 flex items-center justify-start gap-1 hover:underline transition"
      >
        <FaSpotify className={"text-green-400"} />
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
          className="rounded-xl hover:saturate-100"
        />
        <Link
          href={lastListened.url}
          target="_blank"
          className="flex flex-col group"
        >
          <span className="w-[300px] overflow-hidden ml-auto mr-auto text-ellipsis inline-block whitespace-nowrap font-semibold group-hover:underline underline-offset-2 align-middle">
            <EqualizerBars live={lastListened.isNowPlaying} />
            <span>{lastListened.song}</span>
          </span>
          <span className="w-[200px] overflow-hidden text-ellipsis inline-block whitespace-nowrap group-hover:underline underline-offset-2">
            {lastListened.artists.join(", ")}
          </span>
        </Link>
      </div>
    </div>
  );
};

export default NowListeningCard;
