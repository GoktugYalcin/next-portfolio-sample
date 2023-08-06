import React from "react";
import Image from "next/image";
import bne from "./bne.jpeg";
import Info from "@/infos";

const ProfileCard: React.FC = () => {
  return (
    <div className="flex justify-start items-center">
      <Image
        src={bne}
        alt={"Just me"}
        className="h-16 w-16 rounded-full"
        quality={60}
      />
      <div className="flex flex-col ml-4">
        <span className="mb-0.5 text-xl text-slate-900 dark:text-slate-100">
          {Info.name}
        </span>
        <span className="text-slate-600 dark:text-slate-300">{Info.title}</span>
      </div>
    </div>
  );
};

export default ProfileCard;
