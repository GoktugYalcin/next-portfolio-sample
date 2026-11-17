import React from "react";
import { Metadata } from "next";
import spotify from "@/lib/fetchers/spotify";
import { SPOTIFY_RECENT_TRACKS_TYPES } from "@/types/spotify";
import Link from "next/link";
import Image from "next/image";
import { Band, PageHead, Section } from "@/components/generated/PageHead";
import NotFound from "@/components/generated/NotFound";

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

  const tracks = spotify.flattenArray(songs);

  return (
    <>
      <PageHead
        crumb="last listened"
        title="last listened"
        lede={<>A quieter kind of index — what I&apos;ve had on repeat.</>}
      />
      <Band />
      <Section reveal={false}>
        {!tracks.length && <NotFound whatNotFound={"track"} />}
        <div className="cases reveal">
          {tracks.map((song) => {
            return (
              <Link
                target={"_blank"}
                href={song.url}
                key={song.url}
                className="case group cursor-pointer"
              >
                {song.count > 1 && (
                  <div className="invisible absolute -right-1 -top-2 z-10 animate-bounce rounded-full bg-foreground px-2 py-1 font-mono text-xs text-background group-hover:visible">
                    <span className="text-xs">x</span>
                    <span>{song.count}</span>
                  </div>
                )}
                <div
                  className="relative flex h-52 items-center justify-center overflow-hidden rounded-lg border border-border bg-background bg-stripes"
                  style={{ borderColor: "var(--n-line)" }}
                >
                  <div className="rain-keep relative flex h-48 w-48 items-center justify-center group-hover:animate-cdAnim">
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
                </div>

                <div className="pt-4">
                  <h3 className="truncate text-[15px] font-medium text-foreground">
                    {song.song}
                  </h3>
                  <p className="mt-1 truncate text-[13px] text-muted-foreground">
                    {song.artists.join(", ")}
                  </p>
                  <div className="mt-3 flex items-center justify-between pt-1">
                    <span className="chip">{song.year}</span>
                    <span className="chip">{song.duration}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>
    </>
  );
};

export default SpotifyRandomCards;
