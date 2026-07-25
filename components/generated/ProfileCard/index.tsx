import React from "react";
import Image from "next/image";
import bne from "./bne.jpeg";
import Info from "@/infos";
import { AvatarTilt } from "./AvatarTilt";

const ProfileCard: React.FC = () => {
  return (
    <div className="flex justify-start items-center">
      <AvatarTilt>
        <Image
          src={bne}
          alt={"Just me"}
          className="h-16 w-16 rounded-full ring-1 ring-border ring-offset-2 ring-offset-background"
          quality={60}
        />
      </AvatarTilt>
      <div className="flex flex-col ml-4">
        <h1 className="text-xl font-normal text-foreground flex justify-start items-center gap-2">
          {Info.name}
        </h1>
        <span className="text-muted-foreground">{Info.title}</span>
      </div>
    </div>
  );
};

export default ProfileCard;
