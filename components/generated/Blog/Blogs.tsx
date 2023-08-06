import React from "react";
import Link from "next/link";
import { IBlogs } from "@/types";

const Blogs: React.FC<IBlogs> = ({ items }) => {
  return (
    <ul className="w-full flex flex-col gap-4">
      {items?.map(({ title, pubDate, link }, index) => {
        const postDate = new Date(pubDate);
        const date = postDate
          .toISOString()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("/");

        return (
          <Link
            key={index}
            href={link}
            target="_blank"
            className="flex transition hover:opacity-70"
          >
            <li className="flex-1 pr-4 gap-3 lg:gap-0 flex items-center justify-between">
              <span className="font-medium text-slate-700 dark:text-slate-300">
                {title}
              </span>
              <time className="text-sm text-slate-500 dark:text-gray-300">
                {date}
              </time>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default Blogs;
