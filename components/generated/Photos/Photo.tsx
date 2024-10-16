import { IPhoto } from "@/types";
import Link from "next/link";
import Image from "next/image";
import React, { Suspense } from "react";
import { createShimmer } from "@/lib/utils";
import { PhotoFallback } from "@/components/generated/Photos/PhotoFallback";

export const Photo = (props: IPhoto) => {
  const {
    alt_description,
    links,
    urls,
    description,
    width,
    height,
    positiveRotate,
  } = props;
  const figureClasses =
    (positiveRotate ? "rotate-[2.5deg]" : "rotate-[-2.5deg]") +
    " hover:rotate-0 transition-all";

  return (
    <figure className={figureClasses}>
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
