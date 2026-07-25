import React from "react";
import { Metadata } from "next";
import spotify from "@/lib/fetchers/spotify";
import { SPOTIFY_RECENT_TRACKS_TYPES } from "@/types/spotify";
import Link from "next/link";
import Image from "next/image";

const description =
  "Recent tracks that a person listened to can give some tips about their situation.";

export const metadata: Metadata = {
  title: "Last Listened",
  description,
  openGraph: { title: "Last Listened", description },
  twitter: { title: "Last Listened", description },
};

export const revalidate = 300; // 5m

const SpotifyRandomCards: React.FC = async () => {
  const songs = await spotify.getLastListenedSongs(
    SPOTIFY_RECENT_TRACKS_TYPES.MULTIPLE_TRACKS
  );

  return (
    <div className="w-full">
      <p className="mb-3 mt-8 text-center font-mono text-xs uppercase tracking-[0.15em] text-accent">
        Listen_log
      </p>
      <h1 className="mb-10 max-w-[60ch] mx-auto text-lg text-muted-foreground font-normal text-center">
        A quieter kind of index — what I&apos;ve had on repeat.
      </h1>
      <div className="relative flex flex-wrap gap-4 w-full py-6 justify-center">
        {spotify.flattenArray(songs).map((song) => {
          return (
            <Link
              target={"_blank"}
              href={song.url}
              key={song.url}
              className={`
                hud-corners
                p-4
                rounded-sm
                border
                border-border
                bg-card/60
                cursor-pointer
                transition-all
                duration-300
                lg:hover:scale-[1.02]
                hover:border-accent/60
                hover:z-10
                w-[280px]
                group
              `}
            >
              {song.count > 1 && (
                <div className="group-hover:visible animate-bounce invisible transition-all absolute -right-1 -top-2 bg-accent text-accent-foreground font-mono text-xs px-2 py-1 rounded-sm">
                  <span>x</span>
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
                <h3 className="font-display text-lg truncate">{song.song}</h3>
                <p className="text-muted-foreground text-sm mt-1 truncate">
                  {song.artists.join(", ")}
                </p>
                <div className="flex justify-between items-center mt-3 font-mono text-[11px]">
                  <span className="px-2 py-1 rounded-sm bg-muted text-muted-foreground">
                    {song.year}
                  </span>
                  <span className="text-muted-foreground px-2 py-1 border rounded-sm border-border">
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
