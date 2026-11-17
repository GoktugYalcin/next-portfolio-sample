import React from "react";
import { ArrowUpRight } from "lucide-react";
import { IBlog } from "@/types";

const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");

const formatDate = (pubDate: string) => {
  // rss2json returns "YYYY-MM-DD HH:mm:ss" (UTC)
  const d = new Date(pubDate.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return pubDate;
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()} '${String(
    d.getUTCFullYear()
  ).slice(2)}`;
};

/** Posts as full-bleed rows: title, date, tags. */
const Blogs: React.FC<{ items: IBlog[]; limit?: number }> = ({
  items,
  limit,
}) => {
  const list = limit ? items?.slice(0, limit) : items;

  return (
    <>
      {list?.map(({ title, pubDate, link, categories }, index) => (
        <a
          key={index}
          href={link}
          target="_blank"
          rel="noopener"
          className="project"
        >
          <div className="project-top">
            <h3>{title}</h3>
            <span className="project-where">
              {formatDate(pubDate)}
              <ArrowUpRight className="icon" aria-hidden />
            </span>
          </div>
          {!!categories?.length && (
            <p className="project-meta">{categories.slice(0, 4).join(" · ")}</p>
          )}
        </a>
      ))}
    </>
  );
};

export default Blogs;
