import React, { Suspense } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Clock, Code2, MapPin, Music2 } from "lucide-react";
import me from "./me.png";
import Info from "@/infos";
import { AvatarTilt } from "./AvatarTilt";
import { IstanbulClock } from "@/components/generated/IstanbulClock";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";
import spotify from "@/lib/fetchers/spotify";

const d = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);

const ListeningRow = async () => {
  const track = await spotify.getLastListened().catch(() => null);
  if (!track) return null;

  return (
    <li>
      <Music2 className="icon" aria-hidden />
      <span>
        <Link href="/last-listened">{track.song}</Link>{" "}
        <span className="meta-soft">
          {"// "}
          {track.isNowPlaying ? "playing now" : "last played"}
        </span>
      </span>
    </li>
  );
};

/** Avatar over the cover's edge, name, four facts, and the links. */
const ProfileCard: React.FC = () => {
  return (
    <>
      <section className="profile">
        <div className="avatar reveal" style={d(120)}>
          <AvatarTilt className="absolute inset-0">
            <div className="avatar-frame">
              <Image src={me} alt={"Göktuğ, drawn"} quality={75} priority />
            </div>
          </AvatarTilt>
        </div>
        <div className="who">
          <h1 className="name reveal" style={d(200)}>
            {Info.name}
          </h1>
          <p className="role reveal" style={d(280)}>
            {Info.title}
          </p>
        </div>
      </section>

      <ul className="meta reveal" style={d(360)}>
        <li>
          <Code2 className="icon" aria-hidden />
          <span>building software since 2020</span>
        </li>
        <li>
          <Clock className="icon" aria-hidden />
          <IstanbulClock />
        </li>
        <li>
          <MapPin className="icon" aria-hidden />
          <span>istanbul, türkiye</span>
        </li>
        <Suspense fallback={null}>
          <ListeningRow />
        </Suspense>
      </ul>

      <FooterLinkProvider className="reveal" style={d(440)} />
    </>
  );
};

export default ProfileCard;
