import React from "react";
import { IstanbulClock } from "@/components/generated/IstanbulClock";
import { Walking } from "@/components/generated/Walking";

/**
 * Home banner: a dotted plate with coordinates, the live Istanbul clock and
 * the walking sprite pacing the bottom edge.
 */
const Banner: React.FC = () => {
  return (
    <div className="frame px-2.5 pt-2.5">
      <div className="relative h-[132px] overflow-hidden rounded-lg border border-border bg-card bg-dots sm:h-[148px]">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"
        />
        <span className="label-mono absolute left-3 top-2.5">
          41.0082° N · 28.9784° E
        </span>
        <span className="label-mono absolute right-3 top-2.5">IST / UTC+3</span>
        <p
          aria-hidden
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 select-none text-center font-serif text-5xl italic tracking-tight text-foreground/[0.07] sm:text-7xl"
        >
          gokyalc.in
        </p>
        <p className="absolute bottom-2.5 right-3 font-mono text-[10px] text-muted-foreground">
          <IstanbulClock />
        </p>
        <span className="banner-walker" aria-hidden>
          <Walking />
        </span>
      </div>
    </div>
  );
};

export default Banner;
