import { IPhoto } from "@/types";
import Link from "next/link";
import Image from "next/image";
import React, { Suspense } from "react";
import { createShimmer } from "@/lib/utils";
import { PhotoFallback } from "@/components/generated/Photos/PhotoFallback";

const rotateAngle = (id: string, range = 4) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) | 0;
  }
  const normalized = (Math.abs(hash) % 1000) / 1000;
  return (normalized * 2 - 1) * range;
};

export const Photo = (props: IPhoto) => {
  const { id, alt_description, links, urls, description, width, height } =
    props;

  return (
    <figure
      className="photo-figure transition-all"
      style={{ "--photo-rotate": `${rotateAngle(id)}deg` } as React.CSSProperties}
    >
      <Link
        href={links.html}
        target={"_blank"}
        className={
          "group block overflow-hidden rounded-lg grayscale hover:grayscale-0 transition-all duration-700 lg:hover:scale-110 hover:black"
        }
      >
        <Suspense fallback={<PhotoFallback height={height} width={width} />}>
          <Image
            src={`${urls.raw}&q=90&w=800`}
            alt={alt_description || description || "A photo"}
            width={width}
            height={height}
            placeholder="blur"
            blurDataURL={createShimmer(width, height)}
            quality={100}
          />
        </Suspense>
      </Link>
    </figure>
  );
};
