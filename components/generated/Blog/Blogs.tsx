import React from "react";
import Link from "next/link";
import { IBlogs } from "@/types";

const Blogs: React.FC<IBlogs> = ({ items }) => {
  return (
    <ul className="w-full flex flex-col">
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
            className="group flex items-center gap-4 border-b border-border py-4 transition-colors hover:border-accent/60"
          >
            <span className="w-8 shrink-0 font-mono text-xs text-muted-foreground/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <li className="flex flex-1 items-center justify-between gap-3 pr-4 lg:gap-0">
              <span className="font-medium group-hover:text-accent">
                {title}
              </span>
              <time className="font-mono text-xs text-muted-foreground">
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
