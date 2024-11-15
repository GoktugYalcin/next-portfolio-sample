import React from "react";
import spotify from "@/lib/fetchers/spotify";
import { SPOTIFY_RECENT_TRACKS_TYPES } from "@/types/spotify";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 300; // 5m

const SpotifyRandomCards: React.FC = async () => {
  const songs = await spotify.getLastListenedSongs(
    SPOTIFY_RECENT_TRACKS_TYPES.MULTIPLE_TRACKS
  );

  return (
    <div className="w-full">
      <div className="mb-10 mt-12 text-2xl text-center">
        Recent tracks that a person listened to can give some tips about their
        situation.
      </div>
      <div className="relative flex flex-wrap gap-3 w-full rounded-xl p-12 justify-center">
        {spotify.flattenArray(songs).map((song) => {
          return (
            <Link
              target={"_blank"}
              href={song.url}
              key={song.url}
              className={`
                p-4
                rounded-lg
                shadow-md
                cursor-pointer
                transition-all
                duration-300
                lg:hover:scale-110
                hover:scale-100
                hover:shadow-xl
                hover:z-10
                backdrop-blur-sm
                bg-opacity-90
                dark:bg-gray-800
                bg-gray-100
                w-[280px]
                group
              `}
            >
              {song.count > 1 && (
                <div className="group-hover:visible animate-bounce invisible transition-all absolute -right-1 -top-2 bg-gray-700 text-gray-300 text-sm px-2 py-1 rounded-full">
                  <span className="text-xs">x</span>
                  <span>{song.count}</span>
                </div>
              )}
              <div className="relative h-52 bg-gradient-to-br flex items-center justify-center group-hover:animate-cdAnim">
                <Image
                  src={song.img}
                  alt={`${song.song} artwork`}
                  className="w-48 h-48 rounded-full shadow-lg"
                  width={256}
                  height={256}
                />
                <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center w-full h-full">
                  <div className="w-[75px] h-[75px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500/20 backdrop-blur-sm" />
                  <div className="w-[70px] h-[70px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[5px] border-dotted border-gray-200/10" />
                  <div className="w-[63px] h-[63px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-[1.5px] border-white bg-[#9799a5]" />
                  <div className="w-[57px] h-[57px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9c2c7]" />
                  <div className="w-[53px] h-[53px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c9c2c7]" />
                  <div className="w-[47px] h-[47px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e3dee4]" />
                  <div className="w-[35px] h-[35px] absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#a6a4a5] bg-[#bebcba] shadow-[0_0_24px_-12px_rgba(0,0,0,0.25)_inset]" />
                </div>
              </div>

              <div className="p-4">
                <h3 className="dark:text-white font-semibold truncate">
                  {song.song}
                </h3>
                <p className="text-gray-400 text-sm mt-1 truncate">
                  {song.artists.join(", ")}
                </p>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-gray-700 text-gray-300">
                    {song.year}
                  </span>
                  <span className="text-xs text-slate-400 px-2 py-1 border rounded-full border-slate-400">
                    {song.duration}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default SpotifyRandomCards;
