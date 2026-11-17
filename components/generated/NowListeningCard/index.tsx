import React from "react";
import { Link } from "next-view-transitions";
import spotify from "@/lib/fetchers/spotify";

const EqualizerBars = ({ live }: { live: boolean }) => (
  <span
    className={`eq-bars flex-none ${live ? "eq-bars--live" : ""}`}
    aria-hidden
  >
    <span className="eq-bars__bar" />
    <span className="eq-bars__bar" />
    <span className="eq-bars__bar" />
  </span>
);

/** Footer corner: what's playing (or what played last), linked to the list. */
const NowListeningCard = async () => {
  const track = await spotify.getLastListened().catch(() => null);
  if (!track) return null;

  return (
    <p className="pile-switches">
      <EqualizerBars live={track.isNowPlaying} />
      <Link
        href={"/last-listened"}
        className="footer-switch"
        title={`${track.song} — ${track.artists.join(", ")}`}
      >
        {track.isNowPlaying ? "listening now" : "last listened"}
      </Link>
    </p>
  );
};

export default NowListeningCard;
