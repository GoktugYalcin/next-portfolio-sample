import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BiEqualizer } from "react-icons/bi";
import { Track } from "@/types";

const NowListeningCard = ({ data }: { data: Track }) => {
  return (
    <div className="flex gap-3">
      <Image
        src={data.image[1]["#text"]}
        alt={data.artist.name}
        width={50}
        height={50}
        className="rounded-full hover:saturate-100"
      />
      <Link
        href={data.url || "#"}
        target="_blank"
        className="flex flex-col group"
      >
        <span className="w-[200px] overflow-hidden ml-auto mr-auto text-ellipsis inline-block whitespace-nowrap font-semibold group-hover:underline underline-offset-2 align-middle">
          {data["@attr"]?.nowplaying && (
            <BiEqualizer
              color={"#03BB3A"}
              fontSize={20}
              className="mt-[2px] mr-0.5 float-left animate-pulse"
            />
          )}
          <span>{data.name}</span>
        </span>
        <span className="w-[200px] overflow-hidden text-ellipsis inline-block whitespace-nowrap group-hover:underline underline-offset-2">
          {data.artist.name}
        </span>
      </Link>
    </div>
  );
};

export default NowListeningCard;
