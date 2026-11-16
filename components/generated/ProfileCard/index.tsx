import React from "react";
import Image from "next/image";
import { MapPin } from "lucide-react";
import bne from "./bne.jpeg";
import Info from "@/infos";
import { AvatarTilt } from "./AvatarTilt";

const ProfileCard: React.FC = () => {
  return (
    <div className="frame flex items-center gap-4 px-6 py-5 sm:px-8">
      <AvatarTilt>
        <Image
          src={bne}
          alt={"Just me"}
          className="h-16 w-16 rounded-xl border border-border object-cover"
          quality={60}
          priority
        />
      </AvatarTilt>
      <div className="flex min-w-0 flex-col">
        <h1 className="font-serif text-3xl leading-none tracking-tight text-foreground sm:text-[38px]">
          {Info.name}
        </h1>
        <span className="mt-1.5 font-mono text-[13px] text-muted-foreground">
          {Info.title}
        </span>
        <span className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-soft">
          <MapPin size={11} aria-hidden />
          Istanbul, Türkiye
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
