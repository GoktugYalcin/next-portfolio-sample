import { IPhoto } from "@/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { createShimmer } from "@/lib/utils";

export const Photo = (props: IPhoto) => {
  const { alt_description, links, urls, description, width, height } = props;

  return (
    <figure>
      <Link
        href={links.html}
        target={"_blank"}
        className={
          "group block overflow-hidden rounded-lg saturate-50 transition-all duration-700 hover:scale-105 hover:saturate-100"
        }
      >
        <Image
          src={`${urls.raw}&q=90&w=800`}
          alt={alt_description || description || "A photo"}
          width={width}
          height={height}
          placeholder="blur"
          blurDataURL={createShimmer(width, height)}
          quality={100}
        />
      </Link>
    </figure>
  );
};
