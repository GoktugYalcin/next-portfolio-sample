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
            className="flex border-b border-border py-4 hover:text-accent transition-colors"
          >
            <li className="flex-1 pr-4 gap-3 lg:gap-0 flex items-center justify-between">
              <span className="font-medium">{title}</span>
              <time className="text-sm text-muted-foreground">{date}</time>
            </li>
          </Link>
        );
      })}
    </ul>
  );
};

export default Blogs;
