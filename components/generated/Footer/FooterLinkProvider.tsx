import React from "react";
import FooterLink from "@/components/generated/Footer/FooterLink";
import { getContacts } from "@/lib/contacts";

/** The contact links from Airtable, as a row of pills. */
const FooterLinkProvider = async ({
  className = "",
  style,
  withMail = true,
}: {
  className?: string;
  style?: React.CSSProperties;
  /** false where the address is already shown in full */
  withMail?: boolean;
}) => {
  const all = await getContacts();
  const infos = withMail
    ? all
    : all.filter((i) => !i.url.startsWith("mailto:"));
  if (!infos.length) return null;

  return (
    <nav className={`links ${className}`} style={style} aria-label="elsewhere">
      {infos.map((i, index) => (
        <FooterLink
          label={i.label}
          link={i.url}
          siteName={i.type}
          key={index}
        />
      ))}
    </nav>
  );
};

export default FooterLinkProvider;
