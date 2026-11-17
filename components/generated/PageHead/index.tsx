import React from "react";
import { Link } from "next-view-transitions";

const d = (ms: number) => ({ "--d": `${ms}ms` } as React.CSSProperties);

/** The strip of dot texture between sections. */
export const Band = () => <div className="band" aria-hidden="true" />;

/** Top of every inner page: breadcrumb, big serif title, a line of lede. */
export const PageHead = ({
  crumb,
  title,
  lede,
}: {
  crumb: string;
  title: string;
  lede?: React.ReactNode;
}) => (
  <section className="page-head">
    <p className="crumb reveal">
      <Link href="/">home</Link> &nbsp;/&nbsp; {crumb}
    </p>
    <h1 className="page-title reveal" style={d(80)}>
      {title}
    </h1>
    {lede && (
      <p className="lede reveal" style={d(160)}>
        {lede}
      </p>
    )}
  </section>
);

/** A titled section: dotted rule under the title, body below. */
export const Section = ({
  id,
  title,
  meta,
  children,
  className = "",
  reveal = true,
}: {
  id?: string;
  title?: React.ReactNode;
  meta?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  reveal?: boolean;
}) => (
  <section className="sec" id={id}>
    {title && (
      <header className="sec-head wide-line">
        <h2>{title}</h2>
        {meta}
      </header>
    )}
    <div className={`sec-body ${reveal ? "reveal" : ""} ${className}`}>
      {children}
    </div>
  </section>
);
