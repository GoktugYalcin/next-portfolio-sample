"use client";

import React, { useState } from "react";
import Image from "next/image";

export type BannerPhoto = { id: string; src: string; alt: string };

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Home banner: a reel of my own photos. Tap to move to the next one. Falls back to a dotted plate when
 * there are no photos.
 */
const Banner = ({ photos }: { photos: BannerPhoto[] }) => {
  const [index, setIndex] = useState(0);
  const count = photos.length;
  const current = photos[index];

  return (
    <div className="rule-b">
      <div className="frame">
        <div className="relative h-[150px] overflow-hidden bg-card bg-dots sm:h-[184px]">
          {count > 0 && (
            <button
              type="button"
              onClick={() => setIndex((i) => (i + 1) % count)}
              aria-label="Next photo"
              className="absolute inset-0 block h-full w-full cursor-pointer"
            >
              {photos.map((photo, i) => (
                <Image
                  key={photo.id}
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  priority={i === 0}
                  sizes="(min-width: 720px) 720px, 100vw"
                  className={`object-cover transition-opacity duration-500 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
            </button>
          )}
          {current && (
            <span className="pointer-events-none absolute bottom-2 right-2 max-w-[70%] truncate rounded bg-background/90 px-1.5 py-0.5 font-mono text-[10.5px] lowercase text-muted-foreground backdrop-blur-sm">
              {pad(index + 1)} / {pad(count)} · {current.alt}
            </span>
          )}
        </div>
        {count > 0 && (
          <p
            aria-hidden
            className="pointer-events-none absolute left-full top-12 ml-6 hidden w-36 -rotate-3 font-hand text-[13px] leading-snug text-soft xl:block"
          >
            i took this.
            <br />
            go on, tap for the next.
            <svg
              width="34"
              height="26"
              viewBox="0 0 34 26"
              fill="none"
              className="mt-1"
            >
              <path
                d="M32 2C24 4 12 9 3 22M3 22l1-8M3 22l8-2"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </p>
        )}
      </div>
    </div>
  );
};

export default Banner;
