import React from "react";
import Link from "next/link";
import { PhotoStatCardProps } from "@/types";

const PhotoStatCard = ({ link, label, stat }: PhotoStatCardProps) => {
  return (
    <div className="flex flex-col">
      <Link
        href={link}
        className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground hover:text-accent hover:underline underline-offset-4"
        target="_blank"
      >
        {label}
      </Link>
      <span className="mt-1.5 font-display text-2xl font-medium text-foreground">
        {stat?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </span>
    </div>
  );
};

export default PhotoStatCard;
