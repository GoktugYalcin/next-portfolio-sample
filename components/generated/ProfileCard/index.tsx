import React, { Suspense } from "react";
import Image from "next/image";
import { Link } from "next-view-transitions";
import { Clock, Code2, MapPin, Music2 } from "lucide-react";
import bne from "./bne.jpeg";
import Info from "@/infos";
import { AvatarTilt } from "./AvatarTilt";
import { IstanbulClock } from "@/components/generated/IstanbulClock";
import FooterLinkProvider from "@/components/generated/Footer/FooterLinkProvider";
import spotify from "@/lib/fetchers/spotify";

const Row = ({
  icon: Icon,
  children,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) => (
  <li className="flex min-w-0 items-center gap-2.5">
    <Icon size={13} className="flex-none text-soft" />
    <span className="min-w-0 truncate">{children}</span>
  </li>
);

const ListeningRow = async () => {
  const track = await spotify.getLastListened().catch(() => null);
  if (!track) return null;

  return (
    <Row icon={Music2}>
      <Link href="/last-listened" className="link-dotted">
        {track.song.toLowerCase()}
      </Link>{" "}
      <span className="text-soft">
        {"// "}
        {track.isNowPlaying ? "playing now" : "last played"}
      </span>
    </Row>
  );
};

const ProfileCard: React.FC = () => {
  return (
    <div className="frame px-5 pb-7 sm:px-6">
      <div className="flex items-end gap-4">
        <div className="relative z-10 -mt-8 flex-none">
          <AvatarTilt>
            <Image
              src={bne}
              alt={"Just me"}
              className="h-[88px] w-[88px] rounded-2xl border-4 border-background bg-card object-cover"
              quality={60}
              priority
            />
          </AvatarTilt>
        </div>
        <div className="flex min-w-0 flex-col pb-1 pt-3">
          <h1 className="font-serif text-[34px] leading-none tracking-tight text-foreground sm:text-[40px]">
            {Info.name}
          </h1>
          <span className="mt-2 font-mono text-[12.5px] lowercase text-muted-foreground">
            {Info.title}
          </span>
        </div>
      </div>

      <ul className="mt-6 grid gap-x-8 gap-y-2.5 font-mono text-[12.5px] lowercase text-foreground sm:grid-cols-2">
        <Row icon={Code2}>building software since 2020</Row>
        <Row icon={Clock}>
          <IstanbulClock />
        </Row>
        <Row icon={MapPin}>istanbul, türkiye</Row>
        <Suspense fallback={null}>
          <ListeningRow />
        </Suspense>
      </ul>

      <FooterLinkProvider className="mt-6" />
    </div>
  );
};

export default ProfileCard;
