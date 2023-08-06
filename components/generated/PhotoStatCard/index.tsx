import React from "react";
import Link from "next/link";
import { PhotoStatCardProps } from "@/types";

const PhotoStatCard = ({ link, label, stat }: PhotoStatCardProps) => {
  return (
    <div className="border border-gray-200 rounded-xl p-4 dark:border-gray-700 flex flex-col w-4/12">
      <Link href={link} className="hover:underline" target="_blank">
        {label}
      </Link>
      <span className="mt-1 text-3xl font-bold spacing-sm text-highlight">
        {stat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
      </span>
    </div>
  );
};

export default PhotoStatCard;
