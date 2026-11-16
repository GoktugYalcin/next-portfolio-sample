import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IBlog } from "@/types";

const MONTHS = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");

const formatDate = (pubDate: string) => {
  // rss2json returns "YYYY-MM-DD HH:mm:ss" (UTC)
  const d = new Date(pubDate.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return pubDate;
  return `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(
    2,
    "0"
  )}, ${d.getUTCFullYear()}`;
};

const Blogs: React.FC<{ items: IBlog[]; limit?: number }> = ({
  items,
  limit,
}) => {
  const list = limit ? items?.slice(0, limit) : items;

  return (
    <ul className="flex w-full flex-col">
      {list?.map(({ title, pubDate, link, categories }, index) => (
        <li key={index} className="border-b border-border last:border-b-0">
          <Link
            href={link}
            target="_blank"
            className="group flex flex-col gap-1.5 px-6 py-5 hover:bg-hover sm:flex-row sm:items-baseline sm:gap-6 sm:px-8"
          >
            <time className="w-24 flex-none font-mono text-[10px] text-soft">
              {formatDate(pubDate)}
            </time>
            <span className="flex min-w-0 flex-1 flex-col gap-2">
              <span className="font-serif text-xl leading-snug text-foreground">
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
            <ArrowUpRight
              size={14}
              aria-hidden
              className="hidden flex-none translate-y-0.5 text-soft group-hover:text-foreground sm:block"
            />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default Blogs;
