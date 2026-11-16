import React from "react";
import Link from "next/link";
import { PhotoStatCardProps } from "@/types";

const PhotoStatCard = ({ link, label, stat }: PhotoStatCardProps) => {
  return (
    <div className="flex flex-col items-center gap-1 bg-background px-4 py-5 text-center">
      <span className="text-lg font-bold tabular-nums text-foreground">
        {stat?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </span>
      <Link
        href={link}
        className="label-mono hover:text-foreground"
        target="_blank"
      >
        {label}
      </Link>
    </div>
  );
};

export default PhotoStatCard;
