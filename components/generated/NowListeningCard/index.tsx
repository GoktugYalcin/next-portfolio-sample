import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BiEqualizer } from "react-icons/bi";
import spotify from "@/lib/fetchers/spotify";

const NowListeningCard = async () => {
  const lastListened = await spotify.getLastListened();
  if (!lastListened) return <></>;

  return (
    <div className="flex-col flex justify-start items-start">
      <span className="font-medium mb-4">
        {lastListened.isNowPlaying
          ? "I'm listening now"
          : "I recently listened"}
      </span>
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
            <BiEqualizer
              color={lastListened.isNowPlaying ? "#03BB3A" : "#ce783c"}
              fontSize={20}
              className="mt-[2px] mr-0.5 float-left animate-pulse"
            />
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
