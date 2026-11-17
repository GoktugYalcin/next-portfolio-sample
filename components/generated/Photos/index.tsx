"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IPhoto, IPhotosWrapper } from "@/types";
import {
  Photo,
  captionFor,
  dateFor,
} from "@/components/generated/Photos/Photo";

const EASE_OUT = "cubic-bezier(0.2, 0.9, 0.25, 1.08)";
const EASE_IN = "cubic-bezier(0.4, 0, 0.6, 1)";

type Open = { index: number; from: HTMLElement };

/** the print stays on the wall as an empty spot while its photo is open */
const setShown = (el: HTMLElement, shown: boolean) => {
  el.style.visibility = shown ? "" : "hidden";
};

/** Where a photo sits when it's opened: centred, as large as the window allows. */
const stageFor = (photo: IPhoto) => {
  const ratio = photo.height / photo.width;
  const maxW = Math.min(920, innerWidth * 0.86);
  const maxH = innerHeight - 150;
  const w = Math.min(maxW, maxH / ratio);
  const h = w * ratio;
  return { w, h, x: (innerWidth - w) / 2, y: (innerHeight - h) / 2 - 22 };
};

/** The transform that puts the stage image exactly over the print it came from. */
const fromPrint = (
  from: HTMLElement,
  stage: ReturnType<typeof stageFor>,
  tilt: number
) => {
  const r = (from.querySelector(".print-win") ?? from).getBoundingClientRect();
  const dx = r.left + r.width / 2 - (stage.x + stage.w / 2);
  const dy = r.top + r.height / 2 - (stage.y + stage.h / 2);
  return `translate(${dx}px,${dy}px) rotate(${tilt}deg) scale(${
    r.width / stage.w
  })`;
};

const Viewer = ({
  photos,
  open,
  onClose,
  onStep,
}: {
  photos: IPhoto[];
  open: Open;
  onClose: () => void;
  onStep: (dir: 1 | -1) => void;
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const [on, setOn] = useState(false);
  const closing = useRef(false);
  const first = useRef(true);
  const photo = photos[open.index];
  const stage = stageFor(photo);
  const reduced =
    typeof window !== "undefined" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches;

  const tiltOf = (el: HTMLElement) =>
    parseFloat(
      getComputedStyle(el.closest(".print") ?? el).getPropertyValue("--tilt")
    ) || 0;

  /* fly in from the print the first time; later steps just swap */
  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    if (first.current) {
      first.current = false;
      setShown(open.from, false);
      if (!reduced)
        img.animate(
          [
            { transform: fromPrint(open.from, stage, tiltOf(open.from)) },
            { transform: "none" },
          ],
          { duration: 520, easing: EASE_OUT }
        );
      requestAnimationFrame(() => setOn(true));
    } else if (!reduced) {
      img.animate(
        [
          { opacity: 0, filter: "blur(6px)", transform: "scale(0.98)" },
          { opacity: 1, filter: "none", transform: "none" },
        ],
        { duration: 380, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open.index]);

  const close = useCallback(async () => {
    const img = imgRef.current;
    if (closing.current || !img) return;
    closing.current = true;
    setOn(false);
    if (!reduced && open.from.isConnected) {
      await img
        .animate(
          [
            { transform: "none" },
            { transform: fromPrint(open.from, stage, tiltOf(open.from)) },
          ],
          { duration: 380, easing: EASE_IN, fill: "forwards" }
        )
        .finished.catch(() => {});
    }
    setShown(open.from, true);
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, onClose]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [close, onStep]);

  /* stepping changes which print the viewer returns to */
  useEffect(() => {
    return () => {
      if (!closing.current) setShown(open.from, true);
    };
  }, [open.from]);

  const date = dateFor(photo);

  return (
    <div
      className={`pol-view ${on ? "on" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label={captionFor(photo)}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        key={photo.id}
        className="pol-view-photo"
        src={`/_next/image?url=${encodeURIComponent(
          `${photo.urls.raw}&q=85&w=1600`
        )}&w=1920&q=75`}
        alt={photo.alt_description || photo.description || "A photo"}
        style={{
          left: stage.x,
          top: stage.y,
          width: stage.w,
          height: stage.h,
        }}
        onClick={close}
      />
      <div className="pol-view-bar" style={{ top: stage.y + stage.h + 18 }}>
        <span className="pol-view-cap">
          {captionFor(photo)}
          {date ? ` · ${date}` : ""}
        </span>
        <span className="pol-view-actions">
          <button
            type="button"
            onClick={() => onStep(-1)}
            aria-label="previous photo"
          >
            ←
          </button>
          <span className="pol-view-count">
            {open.index + 1} / {photos.length}
          </span>
          <button
            type="button"
            onClick={() => onStep(1)}
            aria-label="next photo"
          >
            →
          </button>
          <a href={photo.links.html} target="_blank" rel="noopener">
            unsplash ↗
          </a>
          <button type="button" onClick={close} autoFocus>
            close
          </button>
        </span>
      </div>
    </div>
  );
};

/**
 * Deal the photos into columns, each to the currently shortest one, so the
 * wall stays level and still reads roughly left to right, top to bottom.
 * (CSS multi-column made WebKit drop prints while one was hovered.)
 */
const splitColumns = (photos: IPhoto[], count: number) => {
  const columns = Array.from({ length: count }, () => ({
    height: 0,
    items: [] as { photo: IPhoto; index: number }[],
  }));
  photos.forEach((photo, index) => {
    const shortest = columns.reduce((a, b) => (b.height < a.height ? b : a));
    shortest.items.push({ photo, index });
    /* frame padding and caption add roughly a fixed share of the width */
    shortest.height += (photo.height || 1) / (photo.width || 1) + 0.3;
  });
  return columns.map((column) => column.items);
};

/**
 * The wall of prints. Each one develops — dark and green-tinted, then its
 * real tones — the first time it scrolls into view, and opens large on click.
 */
function Photos({ data }: IPhotosWrapper) {
  const wallRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Open | null>(null);
  const [count, setCount] = useState(3);

  /* two columns on phones, three otherwise */
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const sync = () => setCount(mq.matches ? 2 : 3);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const columns = splitColumns(data, count);

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall) return;
    const prints = Array.from(wall.querySelectorAll<HTMLElement>(".print"));
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          const el = entry.target as HTMLElement;
          /* let the undeveloped tone paint first, or there's nothing to
           * transition from; prints already on screen wait for the page's
           * own reveal to finish */
          const wait = entry.boundingClientRect.top < innerHeight ? 650 : 60;
          window.setTimeout(() => {
            el.classList.add("developed");
            window.setTimeout(() => el.classList.add("dry"), 3600);
          }, wait);
        });
      },
      { rootMargin: "0px 0px -12% 0px" }
    );
    prints.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [data, count]);

  const onOpen = useCallback((index: number, from: HTMLElement) => {
    setOpen({ index, from });
  }, []);

  const onStep = useCallback(
    (dir: 1 | -1) =>
      setOpen((cur) => {
        if (!cur || !wallRef.current) return cur;
        const index = (cur.index + dir + data.length) % data.length;
        const from = wallRef.current.querySelector<HTMLElement>(
          `.print-frame[data-index="${index}"]`
        );
        setShown(cur.from, true);
        if (from) setShown(from, false);
        return from ? { index, from } : cur;
      }),
    [data.length]
  );

  return (
    <>
      <div className="prints" ref={wallRef}>
        {columns.map((column, c) => (
          <div className="prints-col" key={c}>
            {column.map(({ photo, index }) => (
              <Photo
                key={photo.id}
                photo={photo}
                index={index}
                onOpen={onOpen}
              />
            ))}
          </div>
        ))}
      </div>
      {open &&
        createPortal(
          <Viewer
            photos={data}
            open={open}
            onClose={() => setOpen(null)}
            onStep={onStep}
          />,
          document.body
        )}
    </>
  );
}

export default Photos;
