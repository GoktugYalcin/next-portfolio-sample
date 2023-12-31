"use client";

import React from "react";
import Lastfm from "@/lib/fetchers/lastfm";
import NowListeningCard from "@/components/generated/NowListeningCard";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";
import { Track } from "@/types";

export const revalidate: number = 86400;

export async function Footer() {
  /*const recentlyListened: Track = await Lastfm.getRecentTracks();*/

  return (
    <div className="mt-16 flex justify-between w-full flex-col-reverse lg:flex-row gap-8 lg:gap-0">
      <div className="flex-col flex justify-center items-start">
        <span className="font-medium">Connect with me</span>
        <FooterLinkProvider />
      </div>
      {/*{!!recentlyListened && (
        <div className="flex-col flex justify-start items-start">
          <span className="font-medium mb-4">I recently listened</span>
          <NowListeningCard data={recentlyListened} />
        </div>
      )}*/}
    </div>
  );
}

export default Footer;
