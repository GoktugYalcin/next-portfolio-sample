import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IBlog } from "@/types";

const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");

const formatDate = (pubDate: string) => {
  // rss2json returns "YYYY-MM-DD HH:mm:ss" (UTC)
  const d = new Date(pubDate.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return pubDate;
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(
    2,
    "0"
  )} '${String(d.getUTCFullYear()).slice(2)}`;
};

const Blogs: React.FC<{ items: IBlog[]; limit?: number }> = ({
  items,
  limit,
}) => {
  const list = limit ? items?.slice(0, limit) : items;

  return (
    <ul className="flex w-full flex-col">
      {list?.map(({ title, pubDate, link, categories }, index) => (
        <li
          key={index}
          className="reveal border-b border-dotted border-border last:border-b-0"
        >
          <Link
            href={link}
            target="_blank"
            className="group flex items-baseline gap-4 px-5 py-4 hover:bg-hover sm:px-6"
          >
            <span className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-serif text-[22px] leading-snug text-foreground">
                {title}
              </span>
              {!!categories?.length && (
                <span className="flex flex-wrap gap-1.5">
                  {categories.slice(0, 4).map((c) => (
                    <span key={c} className="chip">
                      {c}
                    </span>
                  ))}
                </span>
              )}
            </span>
            <time className="flex flex-none items-center gap-1.5 font-mono text-[11px] text-soft">
              {formatDate(pubDate)}
              <ArrowUpRight
                size={11}
                aria-hidden
                className="group-hover:text-foreground"
              />
            </time>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Blogs;
