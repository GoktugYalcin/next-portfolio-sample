import React from "react";
import Image from "next/image";
import { IPhoto } from "@/types";

const MONTHS = "jan feb mar apr may jun jul aug sep oct nov dec".split(" ");

/** a stable tilt per photo, so the wall doesn't reshuffle on every visit */
export const tiltFor = (id: string, range = 3) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return (((Math.abs(hash) % 1000) / 1000) * 2 - 1) * range;
};

export const captionFor = (photo: IPhoto) =>
  (photo.alt_description || photo.description || "untitled").toLowerCase();

export const dateFor = (photo: IPhoto) => {
  if (!photo.created_at) return null;
  const d = new Date(photo.created_at);
  return isNaN(d.getTime())
    ? null
    : `${MONTHS[d.getMonth()]} '${String(d.getFullYear()).slice(2)}`;
};

/** One print: paper frame, the photo in its window, a hand-written caption. */
export const Photo = ({
  photo,
  index,
  onOpen,
}: {
  photo: IPhoto;
  index: number;
  onOpen: (index: number, from: HTMLElement) => void;
}) => {
  const date = dateFor(photo);

  return (
    <figure
      className="print"
      style={{ "--tilt": `${tiltFor(photo.id)}deg` } as React.CSSProperties}
    >
      <button
        type="button"
        className="print-frame"
        data-index={index}
        onClick={(e) => onOpen(index, e.currentTarget)}
        aria-label={`open: ${captionFor(photo)}`}
      >
        <span
          className="print-win"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <Image
            src={`${photo.urls.raw}&q=80&w=800`}
            alt={photo.alt_description || photo.description || "A photo"}
            fill
            sizes="(min-width: 720px) 220px, 45vw"
          />
        </span>
        <figcaption className="print-cap">
          <span>{captionFor(photo)}</span>
          {date && <span className="print-date">{date}</span>}
        </figcaption>
      </button>
    </figure>
  );
};
