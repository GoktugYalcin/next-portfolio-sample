import React from "react";
import Image from "next/image";
import bne from "./bne.jpeg";
import Info from "@/infos";
import { AvatarTilt } from "./AvatarTilt";

const ProfileCard: React.FC = () => {
  return (
    <div className="flex items-center justify-start gap-5">
      <AvatarTilt>
        <div className="hud-corners rounded-sm p-1">
          <Image
            src={bne}
            alt={"Just me"}
            className="h-16 w-16 rounded-full grayscale-[15%]"
            quality={60}
          />
        </div>
      </AvatarTilt>
      <div className="flex flex-col">
        <h1 className="flex items-center justify-start gap-2 text-xl font-medium text-foreground">
          {Info.name}
        </h1>
        <span className="font-mono text-xs uppercase tracking-[0.12em] text-accent">
          {Info.title}
        </span>
      </div>
    </div>
  );
};

export default ProfileCard;
